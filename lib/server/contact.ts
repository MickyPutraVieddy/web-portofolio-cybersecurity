import { createHash } from "node:crypto"
import { cleanContact, readContactBody, validateContact, type ContactInput } from "@/lib/contact"
import { getStore } from "@/lib/server/store"

/**
 * Contact form backend.
 *  - Validates everything again on the server (the browser copy is only for UX).
 *  - Honeypot field + per-IP rate limit against spam.
 *  - Sends through an email provider's HTTPS API using server-only env vars. If they are missing, the form
 *    answers "not configured" and NEVER reports success.
 *  - Messages are not stored anywhere (no database row, no log of the text).
 */

const MAX_BODY_BYTES = 16 * 1024
const RATE_MAX = 5
const RATE_WINDOW_MS = 60 * 60 * 1000
const PROVIDER_TIMEOUT_MS = 10_000
const RESEND_URL = "https://api.resend.com/emails"

export interface ContactConfig { apiKey: string; to: string; from: string }
type ContactEnv = Record<string, string | undefined>

/** Server-only. Never import this file from client code. */
export function contactConfig(env: ContactEnv = process.env): ContactConfig | null {
  const apiKey = (env.RESEND_API_KEY || "").trim()
  const to = (env.CONTACT_TO_EMAIL || "").trim()
  const from = (env.CONTACT_FROM_EMAIL || "").trim()
  return apiKey && to && from ? { apiKey, to, from } : null
}

const baseHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Content-Type": "application/json" }
function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...baseHeaders, ...extra } })
}

/** The browser must be on this site (blocks cross-site form posts). */
export function sameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin")
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host")
  if (!origin || !host) return false
  try { return new URL(origin).host === host } catch { return false }
}

function clientIp(request: Request): string {
  return (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown"
}

// ---- rate limit (best effort, same approach as the admin login limiter) ---------------
interface Attempts { count: number; first: number }
const limiterKey = (ip: string) => `rl:contact:${createHash("sha256").update(ip).digest("hex").slice(0, 24)}`

/** Records one attempt. Returns the seconds to wait when the limit is exceeded, otherwise 0. */
export async function takeContactSlot(ip: string, now = Date.now()): Promise<number> {
  try {
    const store = getStore()
    const raw = await store.get(limiterKey(ip))
    let attempts: Attempts = raw ? (JSON.parse(raw) as Attempts) : { count: 0, first: now }
    if (attempts.first + RATE_WINDOW_MS < now) attempts = { count: 0, first: now }
    if (attempts.count >= RATE_MAX) return Math.max(1, Math.ceil((attempts.first + RATE_WINDOW_MS - now) / 1000))
    attempts.count += 1
    await store.set(limiterKey(ip), JSON.stringify(attempts))
    return 0
  } catch { return 0 /* storage unavailable: fail open, honeypot + validation still apply */ }
}

// ---- delivery ------------------------------------------------------------------------
type FetchLike = (input: string, init: RequestInit) => Promise<Response>

export function buildEmailText(values: ContactInput, sentAt: Date): string {
  return [
    "New message from the portfolio contact form", "",
    `Name: ${values.name}`, `Email: ${values.email}`, `Subject: ${values.subject}`, `Sent: ${sentAt.toISOString()}`, "",
    "Message:", values.message, "",
  ].join("\n")
}

/** Returns true only when the provider answered 2xx. The message text is never logged. */
export async function deliver(values: ContactInput, config: ContactConfig, fetchImpl: FetchLike = fetch, now = new Date()): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)
  try {
    const response = await fetchImpl(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: config.from, to: [config.to], reply_to: values.email, subject: `[Portfolio] ${values.subject}`, text: buildEmailText(values, now) }),
      signal: controller.signal,
    })
    if (!response.ok) console.error(`[contact] provider responded with status ${response.status}`)
    return response.ok
  } catch {
    console.error("[contact] provider request failed")
    return false
  } finally { clearTimeout(timer) }
}

export interface ContactDeps { fetchImpl?: FetchLike; env?: ContactEnv; now?: () => number }

export async function handleContact(request: Request, deps: ContactDeps = {}): Promise<Response> {
  if (!sameOriginRequest(request)) return json({ error: "forbidden" }, 403)
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) return json({ error: "unsupported-media-type" }, 415)

  let text: string
  try { text = await request.text() } catch { return json({ error: "bad-request" }, 400) }
  if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) return json({ error: "too-large" }, 413)
  let raw: unknown
  try { raw = JSON.parse(text) } catch { return json({ error: "bad-request" }, 400) }
  const body = readContactBody(raw)
  if (!body) return json({ error: "bad-request" }, 400)

  // Honeypot: real visitors never see or fill this field. Bots get a silent "ok" and nothing is sent.
  if (body.honeypot.trim() !== "") return json({ ok: true })

  const errors = validateContact(body.values)
  if (Object.keys(errors).length > 0) return json({ error: "validation", fields: errors }, 422)

  const config = contactConfig(deps.env)
  if (!config) return json({ error: "not-configured" }, 503)

  const wait = await takeContactSlot(clientIp(request), deps.now?.())
  if (wait > 0) return json({ error: "rate-limited" }, 429, { "Retry-After": String(wait) })

  const sent = await deliver(cleanContact(body.values), config, deps.fetchImpl)
  return sent ? json({ ok: true }) : json({ error: "delivery" }, 502)
}
