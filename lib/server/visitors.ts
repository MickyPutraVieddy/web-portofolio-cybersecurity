import { createHash, randomBytes } from "node:crypto"
import { deriveKey } from "@/lib/server/auth"
import { getStore } from "@/lib/server/store"

/**
 * Privacy-first visitor counter. It stores NUMBERS ONLY:
 *   visits:day:<YYYY-MM-DD>  hash  v, u, v:<path>, u:<path>   (views / unique visitors, kept ~400 days)
 *   visits:seen:<YYYY-MM-DD> set   sha256(secret|day|ip|user-agent)[:32]   (only to tell "new today" from "seen today"; expires after 2 days)
 * The raw IP address and user agent are never written anywhere. The hash is salted with the day, so one person cannot be linked from
 * one day to the next. Consequence: "unique" is per day; a range total is the SUM of daily uniques (visitor-days), not distinct people.
 */

/** Indonesia (WIB, UTC+7) has no daylight saving, so a fixed offset is exact. A "day" starts at 00:00 WIB. */
const TZ_OFFSET_MS = 7 * 60 * 60 * 1000
export const COUNTER_TTL_SECONDS = 400 * 24 * 60 * 60
export const SEEN_TTL_SECONDS = 2 * 24 * 60 * 60

export type Range = 7 | 30 | 90

export const visitDay = (now = Date.now()): string => new Date(now + TZ_OFFSET_MS).toISOString().slice(0, 10)

export function dayAdd(day: string, delta: number): string {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

export function parseRange(value: string | null | undefined): Range {
  return value === "7" ? 7 : value === "90" ? 90 : 30
}

// ---- what counts as a countable page ---------------------------------------------------------------------------------------
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Only "/" and "/pages/<slug>" can ever be counted (query/hash are dropped). Everything else — /admin, /api, random strings — returns null,
 * so nobody can bloat storage by sending made-up paths.
 */
export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 200) return null
  if (!raw.startsWith("/") || raw.startsWith("//") || /[\\\u0000-\u001f]/.test(raw)) return null
  const clean = raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/"
  if (clean === "/") return "/"
  const match = /^\/pages\/([^/]+)$/.exec(clean)
  return match && match[1].length <= 48 && SLUG.test(match[1]) ? `/pages/${match[1]}` : null
}

type SlugLoader = () => Promise<Set<string>>
let loadSlugs: SlugLoader = async () => {
  const { getContent } = await import("@/lib/server/content") // lazy: the hot path ("/") never loads the content module
  const content = await getContent()
  return new Set(content.customPages.pages.filter((page) => page.visible).map((page) => page.slug))
}
let slugCache: { at: number; slugs: Set<string> } | null = null

async function pageExists(path: string, now: number): Promise<boolean> {
  if (path === "/") return true
  if (!slugCache || now - slugCache.at > 60_000) slugCache = { at: now, slugs: await loadSlugs() }
  return slugCache.slugs.has(path.slice("/pages/".length))
}
/** Test hook: replace how published custom pages are looked up. */
export function _setPageLoaderForTests(loader: SlugLoader | null) {
  slugCache = null
  loadSlugs = loader ?? loadSlugs
}

// ---- who counts ----------------------------------------------------------------------------------------------------------------
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|gtmetrix|uptime|monitor|curl|wget|python|httpie|axios|node-fetch|undici|go-http|java\/|okhttp|libwww|scrapy|facebookexternalhit|embedly|whatsapp|telegram|discord|slack/i

/** A coarse filter for honest crawlers and scripts. A bot that fakes a browser user agent is NOT caught — this is a counter, not a security control. */
export const isBot = (userAgent: string | null | undefined): boolean => !userAgent || userAgent.length < 12 || BOT.test(userAgent)

// ---- what we learn about a visitor (coarse, from a fixed vocabulary — never the raw user agent) ----------------------------------
export type Device = "mobile" | "tablet" | "desktop"
export const BROWSERS = ["Chrome", "Safari", "Firefox", "Edge", "Opera", "Samsung", "Other"] as const
export const SYSTEMS = ["Android", "iOS", "Windows", "macOS", "Linux", "Other"] as const
export const SOURCES = ["Direct", "Google", "Bing", "DuckDuckGo", "LinkedIn", "GitHub", "X / Twitter", "Facebook", "Instagram", "WhatsApp", "YouTube", "Reddit", "Other site"] as const
export type Browser = (typeof BROWSERS)[number]
export type System = (typeof SYSTEMS)[number]
export type Source = (typeof SOURCES)[number]
export interface ClientInfo { device: Device; browser: Browser; os: System }

export function describeClient(userAgent: string): ClientInfo {
  const ua = userAgent
  const device: Device = /ipad|tablet|(android(?!.*mobile))/i.test(ua) ? "tablet" : /mobi|iphone|ipod|android/i.test(ua) ? "mobile" : "desktop"
  const browser: Browser = /edg(e|a|ios)?\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /samsungbrowser/i.test(ua) ? "Samsung"
    : /firefox|fxios/i.test(ua) ? "Firefox" : /chrome|crios|chromium/i.test(ua) ? "Chrome" : /safari/i.test(ua) ? "Safari" : "Other"
  const os: System = /android/i.test(ua) ? "Android" : /iphone|ipad|ipod/i.test(ua) ? "iOS" : /windows/i.test(ua) ? "Windows"
    : /mac os x|macintosh/i.test(ua) ? "macOS" : /linux|x11|cros/i.test(ua) ? "Linux" : "Other"
  return { device, browser, os }
}

const SOURCE_HOSTS: [RegExp, Source][] = [
  [/(^|\.)google\./, "Google"], [/(^|\.)bing\.com$/, "Bing"], [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"], [/(^|\.)(linkedin\.com|lnkd\.in)$/, "LinkedIn"],
  [/(^|\.)github\.(com|io)$/, "GitHub"], [/(^|\.)(twitter\.com|x\.com|t\.co)$/, "X / Twitter"], [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"], [/(^|\.)(whatsapp\.com|wa\.me)$/, "WhatsApp"], [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube"], [/(^|\.)reddit\.com$/, "Reddit"],
]

/** Referrer -> one of a FIXED list of sources. Free-form hosts are never stored (that would let anyone bloat the database with made-up names). */
export function referrerSource(raw: unknown, ownHost?: string | null): Source {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 2048) return "Direct"
  let host: string
  try { host = new URL(raw).hostname.toLowerCase() } catch { return "Direct" }
  if (!host || (ownHost && host === ownHost.split(":")[0].toLowerCase())) return "Direct" // navigating inside the site is not a new source
  for (const [pattern, name] of SOURCE_HOSTS) if (pattern.test(host)) return name
  return "Other site"
}

/** ISO country code supplied by the hosting platform (Vercel: x-vercel-ip-country). The IP itself is never read for this. */
export function countryCode(raw: unknown): string | null {
  return typeof raw === "string" && /^[A-Za-z]{2}$/.test(raw) && !/^(xx|t1)$/i.test(raw) ? raw.toUpperCase() : null
}

const processSalt = randomBytes(16).toString("hex")
function secretSalt(): string {
  try { return deriveKey("visitors").toString("hex") } catch { return processSalt } // no SESSION_SECRET (local dev): per-process random salt
}

export function visitorHash(day: string, ip: string, userAgent: string, salt = secretSalt()): string {
  return createHash("sha256").update(`${salt}|${day}|${ip}|${userAgent}`).digest("hex").slice(0, 32)
}

// ---- spam damper (in-memory: per server instance; good enough to stop a single noisy client, see docs) -----------------------------
const recent = new Map<string, number>()
const buckets = new Map<string, { count: number; resetAt: number }>()
const DEDUPE_MS = 5_000
const MAX_PER_MINUTE = 40

function admit(hash: string, path: string, now: number): boolean {
  if (recent.size + buckets.size > 10_000) { recent.clear(); buckets.clear() } // crude memory bound
  const last = recent.get(`${hash}|${path}`)
  if (last !== undefined && now - last < DEDUPE_MS) return false // double-fire (reload storm, React strict mode)
  let bucket = buckets.get(hash)
  if (!bucket || bucket.resetAt <= now) bucket = { count: 0, resetAt: now + 60_000 }
  if (bucket.count >= MAX_PER_MINUTE) return false
  bucket.count += 1
  buckets.set(hash, bucket)
  recent.set(`${hash}|${path}`, now)
  return true
}
export function _resetLimiterForTests() { recent.clear(); buckets.clear() }

// ---- write ---------------------------------------------------------------------------------------------------------------------
const TOTAL_KEY = "visits:total", RECENT_KEY = "visits:recent"
export type RecordResult = { counted: true } | { counted: false; reason: "path" | "bot" | "unknown-page" | "rate" }

export const RECENT_LIMIT = 60
export const RECENT_TTL_SECONDS = 14 * 24 * 60 * 60
export interface RecentVisit { t: number; p: string; d: Device; b: Browser; o: System; c: string | null; r: Source; n: boolean }

export async function recordVisit(input: { path: unknown; ip: string; userAgent: string; country?: unknown; referrer?: unknown; host?: string | null; now?: number }): Promise<RecordResult> {
  const now = input.now ?? Date.now()
  const path = normalizePath(input.path)
  if (!path) return { counted: false, reason: "path" }
  if (isBot(input.userAgent)) return { counted: false, reason: "bot" }
  if (!(await pageExists(path, now))) return { counted: false, reason: "unknown-page" }
  const day = visitDay(now)
  const hash = visitorHash(day, input.ip, input.userAgent)
  if (!admit(hash, path, now)) return { counted: false, reason: "rate" }

  const store = getStore()
  const counters = `visits:day:${day}`, seen = `visits:seen:${day}`
  const client = describeClient(input.userAgent), country = countryCode(input.country), source = referrerSource(input.referrer, input.host)
  const [isNewToday, isNewOnPage] = await Promise.all([store.sadd(seen, hash, SEEN_TTL_SECONDS), store.sadd(seen, `${hash}|${path}`, SEEN_TTL_SECONDS)])
  const writes: Promise<unknown>[] = [
    store.hincr(counters, "v", 1, COUNTER_TTL_SECONDS),
    store.hincr(counters, `v:${path}`, 1, COUNTER_TTL_SECONDS),
    store.hincr(TOTAL_KEY, "v", 1),
  ]
  if (isNewOnPage) writes.push(store.hincr(counters, `u:${path}`, 1, COUNTER_TTL_SECONDS))
  if (isNewToday) {
    writes.push(
      store.hincr(counters, "u", 1, COUNTER_TTL_SECONDS),
      store.hincr(TOTAL_KEY, "u", 1),
      store.hincr(counters, `ud:${client.device}`, 1, COUNTER_TTL_SECONDS),
      store.hincr(counters, `ub:${client.browser}`, 1, COUNTER_TTL_SECONDS),
      store.hincr(counters, `ur:${source}`, 1, COUNTER_TTL_SECONDS),
    )
    if (country) writes.push(store.hincr(counters, `uc:${country}`, 1, COUNTER_TTL_SECONDS))
  }
  const entry: RecentVisit = { t: now, p: path, d: client.device, b: client.browser, o: client.os, c: country, r: source, n: isNewToday }
  writes.push(store.lpush(RECENT_KEY, JSON.stringify(entry), RECENT_LIMIT, RECENT_TTL_SECONDS))
  await Promise.all(writes)
  return { counted: true }
}

// ---- read ----------------------------------------------------------------------------------------------------------------------
export interface DayStat { day: string; views: number; uniques: number }
export interface PageStat { path: string; views: number; uniques: number }
export interface Pair { views: number; uniques: number }
export interface Slice { name: string; count: number }
export interface VisitorStats {
  range: Range
  timezone: "Asia/Jakarta"
  days: DayStat[]
  totals: {
    today: Pair; yesterday: Pair; last7: Pair; previous7: Pair; last30: Pair; previous30: Pair; range: Pair
    /** Everything since counting began (the daily numbers expire after ~400 days, this total never does). */
    allTime: Pair
  }
  topPages: PageStat[]
  /** Who the NEW visitors in the chosen range were (one count per visitor per day). */
  breakdown: { devices: Slice[]; browsers: Slice[]; countries: Slice[]; sources: Slice[] }
  /** The newest hits, newest first. */
  recent: RecentVisit[]
  generatedAt: string
}

const count = (value: unknown) => Math.max(0, Math.trunc(Number(value) || 0))
const sum = (rows: DayStat[]): Pair => rows.reduce((acc, row) => ({ views: acc.views + row.views, uniques: acc.uniques + row.uniques }), { views: 0, uniques: 0 })
const pair = (row: DayStat | undefined): Pair => ({ views: row?.views ?? 0, uniques: row?.uniques ?? 0 })

function slices(hashes: Record<string, number>[], prefix: string, limit: number): Slice[] {
  const totals = new Map<string, number>()
  for (const hash of hashes) for (const [field, value] of Object.entries(hash)) if (field.startsWith(prefix)) totals.set(field.slice(prefix.length), (totals.get(field.slice(prefix.length)) ?? 0) + count(value))
  const sorted = [...totals].filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  const head = sorted.slice(0, limit).map(([name, n]) => ({ name, count: n }))
  const rest = sorted.slice(limit).reduce((acc, [, n]) => acc + n, 0)
  return rest > 0 ? [...head, { name: "Other", count: rest }] : head
}

function parseRecent(rows: string[]): RecentVisit[] {
  const out: RecentVisit[] = []
  for (const raw of rows) {
    try {
      const v = JSON.parse(raw) as Partial<RecentVisit>
      if (typeof v.t !== "number" || typeof v.p !== "string") continue
      out.push({
        t: v.t, p: v.p, n: v.n === true, c: countryCode(v.c),
        d: v.d === "mobile" || v.d === "tablet" ? v.d : "desktop",
        b: (BROWSERS as readonly string[]).includes(v.b as string) ? (v.b as Browser) : "Other",
        o: (SYSTEMS as readonly string[]).includes(v.o as string) ? (v.o as System) : "Other",
        r: (SOURCES as readonly string[]).includes(v.r as string) ? (v.r as Source) : "Direct",
      })
    } catch { /* skip a damaged entry */ }
  }
  return out
}

export async function getVisitorStats(range: Range, now = Date.now()): Promise<VisitorStats> {
  const today = visitDay(now)
  const span = Math.max(range, 60) // the comparison cards need 60 days (this 30 + the 30 before)
  const dayKeys = Array.from({ length: span }, (_, index) => dayAdd(today, index - (span - 1)))
  const store = getStore()
  const [hashes, total, recent] = await Promise.all([
    store.hgetallMany(dayKeys.map((day) => `visits:day:${day}`)),
    store.hgetall(TOTAL_KEY),
    store.lrange(RECENT_KEY, 30),
  ])
  const all: DayStat[] = dayKeys.map((day, index) => ({ day, views: count(hashes[index].v), uniques: count(hashes[index].u) }))
  const chart = all.slice(-range)
  const inRange = hashes.slice(-range)

  const pages = new Map<string, PageStat>()
  for (const hash of inRange) {
    for (const [field, value] of Object.entries(hash)) {
      const kind = field.startsWith("v:") ? "views" : field.startsWith("u:") ? "uniques" : null
      if (!kind) continue
      const path = field.slice(2)
      const entry = pages.get(path) ?? { path, views: 0, uniques: 0 }
      entry[kind] += count(value)
      pages.set(path, entry)
    }
  }
  const topPages = [...pages.values()].sort((a, b) => b.views - a.views || b.uniques - a.uniques || a.path.localeCompare(b.path)).slice(0, 8)

  const n = all.length
  const last7 = sum(all.slice(-7)), last30 = sum(all.slice(-30))
  return {
    range,
    timezone: "Asia/Jakarta",
    days: chart,
    totals: {
      today: pair(all[n - 1]), yesterday: pair(all[n - 2]),
      last7, previous7: sum(all.slice(-14, -7)),
      last30, previous30: sum(all.slice(-60, -30)),
      range: sum(chart),
      // counted from the first hit on; never smaller than what the retained daily numbers add up to (covers hits made before the total existed)
      allTime: { views: Math.max(count(total.v), sum(all).views), uniques: Math.max(count(total.u), sum(all).uniques) },
    },
    topPages,
    breakdown: { devices: slices(inRange, "ud:", 3), browsers: slices(inRange, "ub:", 5), countries: slices(inRange, "uc:", 6), sources: slices(inRange, "ur:", 6) },
    recent: parseRecent(recent),
    generatedAt: new Date(now).toISOString(),
  }
}

// ---- reset ---------------------------------------------------------------------------------------------------------------------
/** Deletes EVERY visitor number: daily counters, the all-time total, the latest-activity list and the "seen today" hashes. Cannot be undone. */
export async function resetVisitorStats(now = Date.now()): Promise<{ days: number }> {
  const today = visitDay(now)
  const span = Math.ceil(COUNTER_TTL_SECONDS / 86_400) + 2 // everything that could still exist
  const keys = [TOTAL_KEY, RECENT_KEY]
  for (let i = 0; i < span; i++) { const day = dayAdd(today, -i); keys.push(`visits:day:${day}`, `visits:seen:${day}`) }
  keys.push(`visits:day:${dayAdd(today, 1)}`, `visits:seen:${dayAdd(today, 1)}`) // clock skew between servers
  await getStore().delMany(keys)
  _resetLimiterForTests()
  return { days: span }
}
