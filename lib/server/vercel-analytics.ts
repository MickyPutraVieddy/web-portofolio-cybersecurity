import { dayAdd, visitDay } from "@/lib/server/visitors"

/**
 * Reads the numbers Vercel Web Analytics collected for THIS project through Vercel's Web Analytics API, so the admin can show them
 * next to the built-in counter. Server-side only: the access token never reaches the browser.
 *
 * Needs three environment variables (all optional — without them the admin simply shows how to connect):
 *   ANALYTICS_API_TOKEN   a Vercel access token (Account Settings → Tokens), scope = the team that owns the project
 *   ANALYTICS_PROJECT_ID  the project id (Project → Settings → General, "prj_…")
 *   ANALYTICS_TEAM_ID     the team id ("team_…"); leave empty for a project on a personal account
 * Docs: https://vercel.com/docs/analytics/web-analytics-api
 */
const API = "https://api.vercel.com/v1/query/web-analytics/visits"
export const VERCEL_WINDOW_DAYS = 30
const CACHE_MS = 60_000

export interface VercelPair { views: number; uniques: number }
export type VercelAnalyticsResult =
  | { configured: false }
  | { configured: true; ok: false; error: "auth" | "not-found" | "rate" | "unavailable"; message: string }
  | {
      configured: true; ok: true
      days: { day: string; views: number; uniques: number }[]
      totals: { today: VercelPair; last7: VercelPair; last30: VercelPair; allTime: VercelPair | null }
      fetchedAt: string
    }

const num = (value: unknown) => Math.max(0, Math.trunc(Number(value) || 0))
const sum = (rows: { views: number; uniques: number }[]): VercelPair => rows.reduce((a, r) => ({ views: a.views + r.views, uniques: a.uniques + r.uniques }), { views: 0, uniques: 0 })

export function vercelAnalyticsConfig(env: NodeJS.ProcessEnv = process.env) {
  const token = env.ANALYTICS_API_TOKEN?.trim(), projectId = env.ANALYTICS_PROJECT_ID?.trim(), teamId = env.ANALYTICS_TEAM_ID?.trim()
  return token && projectId ? { token, projectId, teamId: teamId || undefined } : null
}

class VercelApiError extends Error {
  status: number
  constructor(status: number) { super(`Vercel API ${status}`); this.status = status }
}

async function query(kind: "count" | "aggregate", params: Record<string, string>, config: NonNullable<ReturnType<typeof vercelAnalyticsConfig>>): Promise<unknown> {
  const url = new URL(`${API}/${kind}`)
  url.searchParams.set("projectId", config.projectId)
  if (config.teamId) url.searchParams.set("teamId", config.teamId)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  const response = await fetch(url, { headers: { Authorization: `Bearer ${config.token}` }, cache: "no-store", signal: AbortSignal.timeout(8_000) })
  if (!response.ok) throw new VercelApiError(response.status)
  return ((await response.json()) as { data?: unknown }).data
}

let cache: { at: number; key: string; value: VercelAnalyticsResult } | null = null
export function _resetVercelCacheForTests() { cache = null }

export async function getVercelAnalytics(now = Date.now(), env: NodeJS.ProcessEnv = process.env): Promise<VercelAnalyticsResult> {
  const config = vercelAnalyticsConfig(env)
  if (!config) return { configured: false }
  const key = `${config.projectId}|${config.teamId ?? ""}`
  if (cache && cache.key === key && now - cache.at < CACHE_MS) return cache.value
  const today = visitDay(now) // Vercel groups days in UTC; near midnight WIB the "today" rows can differ slightly from the built-in counter
  const since = dayAdd(today, -(VERCEL_WINDOW_DAYS - 1))
  let value: VercelAnalyticsResult
  try {
    const [rows, lifetime] = await Promise.all([
      query("aggregate", { since, until: today, by: "day", limit: "400" }, config),
      query("count", {}, config).catch((error) => { if (error instanceof VercelApiError && error.status !== 429) return null; throw error }), // lifetime is nice-to-have
    ])
    const byDay = new Map<string, { views: number; uniques: number }>()
    for (const row of Array.isArray(rows) ? (rows as { timestamp?: unknown; pageviews?: unknown; visitors?: unknown }[]) : []) {
      const day = typeof row.timestamp === "string" ? row.timestamp.slice(0, 10) : ""
      if (/^\d{4}-\d{2}-\d{2}$/.test(day)) byDay.set(day, { views: num(row.pageviews), uniques: num(row.visitors) })
    }
    const days = Array.from({ length: VERCEL_WINDOW_DAYS }, (_, i) => { const day = dayAdd(today, i - (VERCEL_WINDOW_DAYS - 1)); return { day, ...(byDay.get(day) ?? { views: 0, uniques: 0 }) } })
    const life = lifetime as { pageviews?: unknown; visitors?: unknown } | null
    value = {
      configured: true, ok: true, days,
      totals: {
        today: sum(days.slice(-1)), last7: sum(days.slice(-7)), last30: sum(days),
        allTime: life && typeof life === "object" ? { views: num(life.pageviews), uniques: num(life.visitors) } : null,
      },
      fetchedAt: new Date(now).toISOString(),
    }
  } catch (error) {
    const status = error instanceof VercelApiError ? error.status : 0
    value = status === 401 || status === 403
      ? { configured: true, ok: false, error: "auth", message: "Vercel rejected the access token. Check that ANALYTICS_API_TOKEN is valid and belongs to the team that owns the project." }
      : status === 404 || status === 400
        ? { configured: true, ok: false, error: "not-found", message: "Vercel could not find the project or Web Analytics is not enabled. Check ANALYTICS_PROJECT_ID / ANALYTICS_TEAM_ID and turn on Web Analytics in the project." }
        : status === 429
          ? { configured: true, ok: false, error: "rate", message: "Vercel asked to slow down. Try again in a minute." }
          : { configured: true, ok: false, error: "unavailable", message: "Vercel Analytics could not be reached right now." }
  }
  if (value.configured && value.ok) cache = { at: now, key, value } // only successes are cached, so fixing a setting shows up immediately
  return value
}
