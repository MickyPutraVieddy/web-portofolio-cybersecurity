import { clientIp, getSession, sameOriginMutation } from "@/lib/server/auth"
import { StorageNotConfigured } from "@/lib/server/store"
import { getVercelAnalytics } from "@/lib/server/vercel-analytics"
import { getVisitorStats, parseRange, recordVisit, resetVisitorStats } from "@/lib/server/visitors"

const noStore = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...noStore, "Content-Type": "application/json" } })

/** Reads at most `limit` bytes; null when the body is larger (the rest is never buffered). */
async function readSmallBody(request: Request, limit = 1024): Promise<string | null> {
  const reader = request.body?.getReader()
  if (!reader) return ""
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > limit) { await reader.cancel().catch(() => undefined); return null }
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString("utf8")
}

/**
 * Public hit endpoint. It ALWAYS answers 204 with no body: a visitor's page must never be slowed or broken by counting, and the answer must
 * not tell a scanner why a hit was ignored. The checks below only keep the numbers honest; they are noise filters, not a security boundary
 * (a non-browser client can fake any header — that is why paths are allow-listed and storage use is bounded).
 */
export async function hitHandler(request: Request): Promise<Response> {
  const done = () => new Response(null, { status: 204, headers: noStore })
  try {
    const h = request.headers
    if (h.get("dnt") === "1" || h.get("sec-gpc") === "1") return done() // respect Do-Not-Track / Global Privacy Control
    const site = h.get("sec-fetch-site")
    if (site && site !== "same-origin") return done()
    const origin = h.get("origin"), host = h.get("x-forwarded-host") || h.get("host")
    if (origin) { try { if (new URL(origin).host !== host) return done() } catch { return done() } }
    if (Number(h.get("content-length") || 0) > 1024) return done()
    if (getSession(request)) return done() // the signed-in owner looking at their own site is not a visitor
    const text = await readSmallBody(request)
    if (text === null) return done()
    let path: unknown, referrer: unknown
    try { const body = JSON.parse(text) as { p?: unknown; r?: unknown }; path = body.p; referrer = body.r } catch { return done() }
    await recordVisit({ path, referrer, host, ip: clientIp(request), userAgent: h.get("user-agent") || "", country: h.get("x-vercel-ip-country") })
  } catch { /* counting must never surface an error to the visitor */ }
  return done()
}

export async function visitorsHandler(request: Request): Promise<Response> {
  if (!getSession(request)) return json({ error: "unauthorized" }, 401)
  try {
    return json(await getVisitorStats(parseRange(new URL(request.url).searchParams.get("days"))))
  } catch (error) {
    if (error instanceof StorageNotConfigured) return json({ error: "storage", message: error.message }, 503)
    return json({ error: "server", message: "Something went wrong" }, 500)
  }
}

/** The same numbers as seen by Vercel Web Analytics (needs the ANALYTICS_* variables). Never fails the page: problems come back as a readable status. */
export async function vercelAnalyticsHandler(request: Request): Promise<Response> {
  if (!getSession(request)) return json({ error: "unauthorized" }, 401)
  try { return json(await getVercelAnalytics()) } catch { return json({ configured: true, ok: false, error: "unavailable", message: "Vercel Analytics could not be reached right now." }) }
}

type AuditWriter = (actor: string, action: string, detail?: string) => Promise<void>
let writeAudit: AuditWriter = async (actor, action, detail) => { await (await import("@/lib/server/content")).writeAudit(actor, action, detail) }
/** Test hook: replace the activity-log writer (the real one pulls in the whole content module). */
export function _setAuditForTests(fn: AuditWriter | null) { writeAudit = fn ?? (async (actor, action, detail) => { await (await import("@/lib/server/content")).writeAudit(actor, action, detail) }) }

/** Admin only, same-origin, and the body must say {"confirm":"reset"} — a stray request can never wipe the numbers. The action goes into the activity log. */
export async function visitorsResetHandler(request: Request): Promise<Response> {
  if (!sameOriginMutation(request)) return json({ error: "forbidden" }, 403)
  const session = getSession(request)
  if (!session) return json({ error: "unauthorized" }, 401)
  try {
    const body = (await request.json().catch(() => null)) as { confirm?: unknown } | null
    if (body?.confirm !== "reset") return json({ error: "validation", message: "Confirmation missing" }, 422)
    await writeAudit(session.sub, "reset-visitors", "all visitor numbers set to 0")
    await resetVisitorStats()
    return json({ ok: true })
  } catch (error) {
    if (error instanceof StorageNotConfigured) return json({ error: "storage", message: error.message }, 503)
    return json({ error: "server", message: "Something went wrong" }, 500)
  }
}
