import { clientIp, getSession } from "@/lib/server/auth"
import { getTranslations, isBlocked, translateMissing } from "@/lib/server/translate"
import { collectTexts } from "@/lib/translate"
import { getContent } from "@/lib/server/content"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } })

/** Calls must come from this site itself (Origin host = Host). */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host")
  if (!origin || !host) return false
  try { return new URL(origin).host === host } catch { return false }
}

/** Best-effort per-IP limit (per server instance): 40 calls / minute. */
const hits = new Map<string, number[]>()
function limited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 2000) for (const [key, list] of hits) if (!list.some((t) => now - t < 60_000)) hits.delete(key)
  return recent.length > 40
}

/**
 * POST { hashes: string[] }  -> translations for the site's own English texts (visitors).
 * POST { warm: true }        -> admin only: translate whatever is still missing, MAX_PER_CALL at a time.
 * Only text that exists in the saved site content is ever translated.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "forbidden" }, 403)
  if (limited(clientIp(request))) return json({ error: "rate_limited" }, 429)
  let body: { hashes?: unknown; warm?: unknown }
  try { body = (await request.json()) as typeof body } catch { return json({ error: "bad_request" }, 400) }

  if (body.warm === true) {
    if (!getSession(request)) return json({ error: "unauthorized" }, 401)
    return json(await translateMissing())
  }
  if (!Array.isArray(body.hashes) || body.hashes.length > 200 || !body.hashes.every((h) => typeof h === "string" && /^[0-9a-z]{1,16}$/.test(h))) {
    return json({ error: "bad_request" }, 400)
  }
  const hashes = body.hashes as string[]
  // Cheap path: everything asked for is already cached.
  const cache = await getTranslations()
  const texts = collectTexts(await getContent())
  const known = hashes.filter((h) => texts.has(h))
  if (known.every((h) => cache[h]) || (await isBlocked())) {
    const translations: Record<string, string> = {}
    for (const h of known) if (cache[h]) translations[h] = cache[h]
    return json({ translations, pending: known.filter((h) => !cache[h]).length, blocked: await isBlocked() })
  }
  return json(await translateMissing(known))
}
