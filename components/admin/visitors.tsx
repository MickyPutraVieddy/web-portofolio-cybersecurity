"use client"

import { useEffect, useRef, useState } from "react"
import { Activity, ExternalLink, Globe, Loader2, Minus, Monitor, RefreshCw, Smartphone, Tablet, Trash2, TrendingDown, TrendingUp, Users } from "lucide-react"
import { api } from "@/components/admin/api"
import { ago, delta } from "@/lib/visitor-format"
import type { Pair, RecentVisit, Range, Slice, VisitorStats } from "@/lib/server/visitors"
import type { VercelAnalyticsResult } from "@/lib/server/vercel-analytics"

const RANGES: Range[] = [7, 30, 90]
const fmt = (n: number) => n.toLocaleString("en-US")
const shortDate = (day: string) => `${day.slice(8)}/${day.slice(5, 7)}` // YYYY-MM-DD -> dd/MM
const LIVE_MS = 20_000 // the panel re-reads the numbers this often while it is open and visible

function flag(code: string | null): string {
  return code && /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "🌐"
}
function countryName(code: string): string {
  try { return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code } catch { return code }
}
const pageLabel = (path: string) => (path === "/" ? "Home page" : path)
const DeviceIcon = ({ device }: { device: RecentVisit["d"] }) => (device === "mobile" ? <Smartphone aria-hidden="true" /> : device === "tablet" ? <Tablet aria-hidden="true" /> : <Monitor aria-hidden="true" />)

// ---- chart geometry (pure) ---------------------------------------------------------------------------------------------------
// The SVG is drawn at the width of its container (1 unit = 1 CSS px), so axis text keeps its real size on a phone instead of shrinking with a viewBox.
const H = 220, PAD = { l: 44, r: 20, t: 10, b: 26 } // r leaves room for the half-width of the last (today) date label
const plotH = H - PAD.t - PAD.b
const LABEL_PX = 46 // minimum horizontal room per date label

/** Round a maximum up to 1/2/5 × 10^k so the grid lines carry friendly numbers. */
export function niceMax(n: number): number {
  if (n <= 5) return 5
  const base = 10 ** Math.floor(Math.log10(n))
  for (const step of [1, 2, 5, 10]) if (step * base >= n) return step * base
  return 10 * base
}

function Chart({ stats }: { stats: VisitorStats }) {
  const holder = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(640)
  useEffect(() => {
    const el = holder.current
    if (!el || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => setWidth(Math.max(280, Math.floor(el.clientWidth))))
    observer.observe(el) // also reports the initial size
    return () => observer.disconnect()
  }, [])

  const { days } = stats
  const n = days.length
  const plotW = width - PAD.l - PAD.r
  const slot = plotW / n
  const max = niceMax(Math.max(...days.map((d) => d.views), ...days.map((d) => d.uniques), 0))
  const x = (i: number) => PAD.l + (i + 0.5) * slot
  const y = (v: number) => PAD.t + plotH - (v / max) * plotH
  const barW = Math.max(2, slot * 0.68)
  const labelStep = Math.max(1, Math.ceil(LABEL_PX / slot)) // labels are aligned to the LAST day, so "today" is always labelled
  const line = days.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(d.uniques).toFixed(1)}`).join(" ")
  const summary = `Daily page views (bars) and unique visitors (line) for the last ${n} days. ${fmt(stats.totals.range.views)} views and ${fmt(stats.totals.range.uniques)} unique visitor-days in total.`
  return (
    <div className="adm-vis-chart" ref={holder}>
      <p className="adm-vis-legend" aria-hidden="true">
        <span><i className="adm-vis-key-bar" />Page views</span>
        <span><i className="adm-vis-key-line" />Unique visitors</span>
      </p>
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} role="img" aria-label={summary}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line className="adm-vis-grid" x1={PAD.l} x2={width - PAD.r} y1={y(max * f)} y2={y(max * f)} />
            <text className="adm-vis-axis" x={PAD.l - 8} y={y(max * f) + 4} textAnchor="end">{fmt(Math.round(max * f))}</text>
          </g>
        ))}
        {days.map((d, i) => (
          <rect key={d.day} className={i === n - 1 ? "adm-vis-bar adm-vis-bar-today" : "adm-vis-bar"} x={x(i) - barW / 2} y={y(d.views)} width={barW} height={Math.max(0, PAD.t + plotH - y(d.views))} rx={Math.min(2, barW / 2)}>
            <title>{`${d.day}: ${fmt(d.views)} views, ${fmt(d.uniques)} unique`}</title>
          </rect>
        ))}
        <path className="adm-vis-line" d={line} />
        {slot >= 9 && days.map((d, i) => <circle key={d.day} className="adm-vis-dot" cx={x(i)} cy={y(d.uniques)} r={2.4} />)}
        {days.map((d, i) => ((n - 1 - i) % labelStep === 0 ? <text key={d.day} className="adm-vis-axis" x={x(i)} y={H - 8} textAnchor="middle">{shortDate(d.day)}</text> : null))}
      </svg>
    </div>
  )
}

function Change({ current, previous, label }: { current: number; previous: number; label: string }) {
  const d = delta(current, previous)
  if (!d) return <span className="adm-vis-delta" data-dir="flat">no data yet</span>
  const Icon = d.dir === "up" ? TrendingUp : d.dir === "down" ? TrendingDown : Minus
  return <span className="adm-vis-delta" data-dir={d.dir}><Icon aria-hidden="true" />{d.text} <small>{label}</small></span>
}

/** `absolute`: show the earlier number instead of a percentage (today is still in progress, so "-59% vs yesterday" at noon would mislead). */
function StatCard({ label, now, before, vs, accent, absolute }: { label: string; now: Pair; before?: Pair; vs?: string; accent?: boolean; absolute?: boolean }) {
  return (
    <div className="adm-vis-card" data-accent={accent ? "true" : undefined}>
      <dt>{label}</dt>
      <dd>
        <span className="adm-vis-num">{fmt(now.views)}</span>
        <span className="adm-vis-sub"><b>{fmt(now.uniques)}</b> unique visitors</span>
        {before && vs && absolute ? <span className="adm-vis-delta" data-dir="flat">{vs} <b>{fmt(before.views)}</b> views</span> : before && vs ? <Change current={now.views} previous={before.views} label={vs} /> : <span className="adm-vis-delta" data-dir="flat">since counting began</span>}
      </dd>
    </div>
  )
}

function Breakdown({ title, rows, render }: { title: string; rows: Slice[]; render?: (name: string) => string }) {
  const total = rows.reduce((a, r) => a + r.count, 0)
  return (
    <div className="adm-vis-break">
      <h4>{title}</h4>
      {total === 0 ? <p className="adm-hint">No data yet</p> : (
        <ul>
          {rows.map((row) => (
            <li key={row.name}>
              <span className="adm-vis-break-name">{render ? render(row.name) : row.name}</span>
              <span className="adm-mono adm-vis-break-n">{Math.round((row.count / total) * 100)}%<small> · {fmt(row.count)}</small></span>
              <span className="adm-vis-track" aria-hidden="true"><span style={{ width: `${Math.max(3, (row.count / total) * 100)}%` }} /></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LiveFeed({ rows, now }: { rows: RecentVisit[]; now: number }) {
  return (
    <div className="adm-vis-feed">
      <h4><Activity aria-hidden="true" /> Latest activity <span className="adm-hint">newest first · anonymous</span></h4>
      {rows.length === 0 ? <p className="adm-vis-empty">Waiting for the first visitor. Open your public site in a private window to see it appear here.</p> : (
        <ul>
          {rows.slice(0, 12).map((row, i) => (
            <li key={`${row.t}-${i}`}>
              <span className="adm-vis-feed-dev" title={row.d}><DeviceIcon device={row.d} /></span>
              <span className="adm-vis-feed-main">
                <b>{pageLabel(row.p)}</b>
                <span className="adm-hint">{row.b} · {row.o} · {row.c ? `${flag(row.c)} ${countryName(row.c)}` : "Unknown location"} · {row.r === "Direct" ? "Direct" : `from ${row.r}`}</span>
              </span>
              {row.n && <span className="adm-vis-pill">new today</span>}
              <time className="adm-hint adm-mono" dateTime={new Date(row.t).toISOString()} title={new Date(row.t).toLocaleString()}>{ago(row.t, now)}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function VercelCompare({ own, tick }: { own: VisitorStats["totals"]; tick: number }) {
  const [data, setData] = useState<VercelAnalyticsResult | null>(null)
  useEffect(() => {
    let cancelled = false
    api<VercelAnalyticsResult>("/api/admin/vercel-analytics")
      .then((d) => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setData({ configured: true, ok: false, error: "unavailable", message: "Vercel Analytics could not be reached right now." }) })
    return () => { cancelled = true }
  }, [tick])

  const head = (
    <h4><Globe aria-hidden="true" /> Vercel Web Analytics <span className="adm-hint">same site, measured by Vercel</span></h4>
  )
  const link = <a className="adm-btn adm-btn-small" href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">Open in Vercel <ExternalLink aria-hidden="true" /></a>

  if (data === null) return <div className="adm-vis-vercel">{head}<p className="adm-vis-loading" role="status"><Loader2 className="adm-spin" aria-hidden="true" /> Loading…</p></div>

  if (!data.configured) {
    return (
      <div className="adm-vis-vercel">
        {head}
        <p>Vercel is already collecting analytics for this site (see the <b>Analytics</b> tab of your Vercel project). To also see those numbers here, add three variables in <b>Vercel → Settings → Environment Variables</b> and redeploy:</p>
        <ul className="adm-vis-env adm-mono">
          <li><b>ANALYTICS_API_TOKEN</b> — an access token (Vercel → Account Settings → Tokens)</li>
          <li><b>ANALYTICS_PROJECT_ID</b> — Project → Settings → General (<span>prj_…</span>)</li>
          <li><b>ANALYTICS_TEAM_ID</b> — your team id (<span>team_…</span>); leave out for a personal account</li>
        </ul>
        {link}
      </div>
    )
  }

  if (!data.ok) return <div className="adm-vis-vercel">{head}<div className="adm-error" role="alert"><p>{data.message}</p></div>{link}</div>

  const rows: { label: string; mine: Pair; vercel: Pair | null }[] = [
    { label: "Today", mine: own.today, vercel: data.totals.today },
    { label: "Last 7 days", mine: own.last7, vercel: data.totals.last7 },
    { label: "Last 30 days", mine: own.last30, vercel: data.totals.last30 },
    { label: "All time", mine: own.allTime, vercel: data.totals.allTime },
  ]
  return (
    <div className="adm-vis-vercel">
      {head}
      <div className="adm-vis-table-wrap adm-vis-compare">
        <table>
          <thead><tr><th scope="col">Period</th><th scope="col">Built-in views</th><th scope="col">Built-in unique</th><th scope="col">Vercel views</th><th scope="col">Vercel visitors</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td><td>{fmt(r.mine.views)}</td><td>{fmt(r.mine.uniques)}</td>
                <td>{r.vercel ? fmt(r.vercel.views) : "—"}</td><td>{r.vercel ? fmt(r.vercel.uniques) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="adm-hint">The two will not match exactly: each tool has its own bot filter and its own idea of a “visitor”, Vercel counts days in UTC (this panel in Jakarta time), and Vercel&rsquo;s history may start earlier than the built-in counter. Updated {new Date(data.fetchedAt).toLocaleTimeString()}.</p>
      {link}
    </div>
  )
}

export function VisitorsPanel() {
  const [range, setRange] = useState<Range>(30)
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [tick, setTick] = useState(0)
  const [manual, setManual] = useState(0) // bumps only on a manual refresh, so the live mode never hammers the Vercel API
  const [live, setLive] = useState(true)
  const [asking, setAsking] = useState(false) // the reset button asks once more before it deletes anything
  const [resetting, setResetting] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false
    api<VisitorStats>(`/api/admin/visitors?days=${range}`)
      .then((data) => { if (!cancelled) { setStats(data); setError(""); setRefreshing(false); setNow(Date.now()) } })
      .catch((e: unknown) => { if (!cancelled) { setError(e instanceof Error ? e.message : "Could not load visitor numbers"); setRefreshing(false) } })
    return () => { cancelled = true }
  }, [range, tick])

  // live mode: re-read while the tab is visible; the "x min ago" labels also keep moving
  useEffect(() => {
    if (!live) return
    const timer = window.setInterval(() => {
      setNow(Date.now())
      if (document.visibilityState === "visible") setTick((t) => t + 1)
    }, LIVE_MS)
    return () => window.clearInterval(timer)
  }, [live])

  async function reset() {
    setResetting(true)
    try {
      await api("/api/admin/visitors", { method: "POST", body: { confirm: "reset" } })
      setAsking(false); setStats(null); setError(""); setTick((t) => t + 1); setManual((m) => m + 1)
    } catch (e) { setError(e instanceof Error ? e.message : "Could not reset the numbers") } finally { setResetting(false) }
  }

  const ready = stats !== null && stats.range === range
  const best = ready ? stats.days.reduce((a, b) => (b.views > a.views ? b : a), stats.days[0]) : null
  const topMax = ready ? Math.max(1, ...stats.topPages.map((p) => p.views)) : 1
  const noData = ready && stats.totals.allTime.views === 0

  return (
    <section className="adm-group adm-vis" aria-labelledby="adm-vis-title">
      <div className="adm-vis-head">
        <h3 id="adm-vis-title"><Users aria-hidden="true" /> Visitors</h3>
        <button type="button" className="adm-vis-live" aria-pressed={live} onClick={() => setLive((v) => !v)} title={live ? "Updating every 20 seconds. Click to pause." : "Paused. Click to resume."}>
          <i aria-hidden="true" />{live ? "Live" : "Paused"}
        </button>
      </div>
      <p className="adm-note">Anonymous counts only: no IP address or browser string is stored, and a visitor cannot be followed from one day to the next. Days run midnight to midnight, Jakarta time (WIB). Your own visits while signed in are not counted.</p>

      <div className="adm-vis-toolbar">
        <div className="adm-seg" role="group" aria-label="Time range">
          {RANGES.map((r) => <button key={r} type="button" aria-pressed={range === r} onClick={() => setRange(r)}>{r} days</button>)}
        </div>
        <button type="button" className="adm-btn adm-btn-small" disabled={refreshing} onClick={() => { setRefreshing(true); setTick((t) => t + 1); setManual((m) => m + 1) }}>
          {refreshing ? <Loader2 className="adm-spin" aria-hidden="true" /> : <RefreshCw aria-hidden="true" />} Refresh
        </button>
        {ready && <span className="adm-hint" aria-live="polite">Updated {new Date(stats.generatedAt).toLocaleTimeString()}</span>}
      </div>

      {error && !ready && (
        <div className="adm-error" role="alert">
          <p>{error}</p>
          <button type="button" className="adm-btn adm-btn-small" onClick={() => { setError(""); setTick((t) => t + 1) }}>Try again</button>
        </div>
      )}

      {!ready && !error && <p className="adm-vis-loading" role="status"><Loader2 className="adm-spin" aria-hidden="true" /> Loading visitor numbers…</p>}

      {ready && (
        <>
          <dl className="adm-vis-cards">
            <StatCard label="Today" now={stats.totals.today} before={stats.totals.yesterday} vs="yesterday:" absolute />
            <StatCard label="Last 7 days" now={stats.totals.last7} before={stats.totals.previous7} vs="vs previous 7" />
            <StatCard label="Last 30 days" now={stats.totals.last30} before={stats.totals.previous30} vs="vs previous 30" />
            <StatCard label="All time" now={stats.totals.allTime} accent />
          </dl>

          {noData && <p className="adm-vis-empty">Nothing counted yet — everything starts at 0. The first real visit to the public site shows up here within seconds.</p>}

          <LiveFeed rows={stats.recent} now={now} />

          {!noData && stats.totals.range.views > 0 && (
            <>
              <Chart stats={stats} />
              {best && best.views > 0 && <p className="adm-hint adm-vis-best">Busiest day in this range: <b>{shortDate(best.day)}</b> with {fmt(best.views)} views.</p>}
              <div className="adm-vis-grid2">
                <div className="adm-vis-pages">
                  <h4>Top pages <span className="adm-hint">last {range} days</span></h4>
                  <ul>
                    {stats.topPages.map((page) => (
                      <li key={page.path}>
                        <span className="adm-vis-path"><b>{pageLabel(page.path)}</b>{page.path !== "/" && <span className="adm-hint adm-mono">custom page</span>}</span>
                        <span className="adm-vis-count adm-mono">{fmt(page.views)} views · {fmt(page.uniques)} unique</span>
                        <span className="adm-vis-track" aria-hidden="true"><span style={{ width: `${Math.max(2, (page.views / topMax) * 100)}%` }} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Breakdown title="Where visitors come from" rows={stats.breakdown.sources} />
              </div>
              <div className="adm-vis-grid3">
                <Breakdown title="Devices" rows={stats.breakdown.devices} render={(n) => n[0].toUpperCase() + n.slice(1)} />
                <Breakdown title="Browsers" rows={stats.breakdown.browsers} />
                <Breakdown title="Countries" rows={stats.breakdown.countries} render={(n) => (n === "Other" ? n : `${flag(n)} ${countryName(n)}`)} />
              </div>
              <details className="adm-vis-table">
                <summary>Show the daily numbers as a table</summary>
                <div className="adm-vis-table-wrap">
                  <table>
                    <thead><tr><th scope="col">Date</th><th scope="col">Views</th><th scope="col">Unique</th></tr></thead>
                    <tbody>{[...stats.days].reverse().map((d) => <tr key={d.day}><td className="adm-mono">{d.day}</td><td>{fmt(d.views)}</td><td>{fmt(d.uniques)}</td></tr>)}</tbody>
                  </table>
                </div>
              </details>
            </>
          )}

          <VercelCompare own={stats.totals} tick={manual} />
          <p className="adm-hint">“Unique” counts each visitor once per day. The 7-, 30-day and all-time figures add up the daily uniques, so someone who returns on three days is counted three times.</p>
          <div className="adm-vis-reset">
            {!asking ? (
              <button type="button" className="adm-btn adm-btn-small" onClick={() => setAsking(true)}><Trash2 aria-hidden="true" /> Reset all numbers to 0…</button>
            ) : (
              <div role="alertdialog" aria-label="Confirm reset">
                <p><b>Delete every visitor number?</b> Daily counts, the all-time total and the latest-activity list are removed for good. Vercel&rsquo;s own analytics are not affected.</p>
                <button type="button" className="adm-btn adm-btn-small" disabled={resetting} onClick={() => setAsking(false)}>Cancel</button>{" "}
                <button type="button" className="adm-btn adm-btn-small adm-btn-danger" disabled={resetting} onClick={() => void reset()}>
                  {resetting ? <Loader2 className="adm-spin" aria-hidden="true" /> : <Trash2 aria-hidden="true" />} Yes, reset to 0
                </button>
              </div>
            )}
            {error && ready && <p className="adm-hint" role="alert">{error}</p>}
          </div>
        </>
      )}
    </section>
  )
}
