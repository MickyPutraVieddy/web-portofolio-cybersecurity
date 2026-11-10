import { createHash } from "node:crypto"
import {
  ConfigError, clearLoginFailures, clientIp, createSessionCookie, getSession, loginBlockedFor, recordLoginFailure, sameOriginMutation,
} from "@/lib/server/auth"
import { ConflictError, ValidationError, writeAudit } from "@/lib/server/content"
import { StorageNotConfigured } from "@/lib/server/store"
import {
  PasskeyError, beginLogin, beginRegistration, clearChallengeCookie, consumeRecoveryCode, finishLogin, finishRegistration, passkeyStatus,
  regenerateRecovery, removePasskey, renamePasskey, setPasswordlessOnly, webauthnConfig,
} from "@/lib/server/passkey"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const RECENT_SECONDS = 15 * 60 // adding / removing a passkey, recovery codes and the policy need a sign-in from the last 15 minutes

function json(body: unknown, status = 200, extra: Record<string, string | string[]> = {}): Response {
  const headers = new Headers({ "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Content-Type": "application/json" })
  for (const [key, value] of Object.entries(extra)) for (const v of Array.isArray(value) ? value : [value]) headers.append(key, v)
  return new Response(JSON.stringify(body), { status, headers })
}
function errorResponse(error: unknown): Response {
  if (error instanceof SyntaxError) return json({ error: "bad-request", message: "Malformed JSON" }, 400)
  if (error instanceof ValidationError || error instanceof ConflictError) return json({ error: "conflict", message: "Conflict" }, 409)
  if (error instanceof StorageNotConfigured) return json({ error: "storage", message: error.message }, 503)
  if (error instanceof ConfigError) return json({ error: "config", message: error.message }, 503)
  if (error instanceof PasskeyError) {
    const [status, message] = passkeyMessages[error.code]
    return json({ error: error.code, message }, status)
  }
  return json({ error: "server", message: "Something went wrong" }, 500)
}
const passkeyMessages: Record<PasskeyError["code"], [number, string]> = {
  limit: [409, "The maximum number of passkeys is registered. Remove one first."],
  challenge: [400, "The request expired or was already used. Please try again."],
  verification: [400, "The passkey could not be verified."],
  duplicate: [409, "This passkey is already registered."],
  "not-found": [404, "That passkey does not exist."],
  "last-passkey": [409, "This is your last passkey and passkey-only sign-in is on. Add another passkey first, or turn passkey-only off."],
  "no-passkey": [409, "No passkey is registered yet."],
  "not-tested": [409, "Sign in with a passkey once first (use “Test sign-in”), so we know it really works."],
  "no-recovery": [409, "Generate and save your recovery codes first."],
  "bad-name": [400, "Give the passkey a short name (1–40 characters)."],
  "bad-request": [400, "Bad request."],
}
const body = async (request: Request) => ((await request.json().catch(() => ({}))) ?? {}) as Record<string, unknown>
const hashed = (value: string) => createHash("sha256").update(value).digest("hex").slice(0, 8)

// ---- public: sign in ---------------------------------------------------------------------------------------------
/** POST /api/admin/passkey/login  — { action: "options" | "verify" | "recovery" } */
export async function passkeyLoginHandler(request: Request): Promise<Response> {
  try {
    if (!sameOriginMutation(request)) return json({ error: "forbidden" }, 403)
    const ip = clientIp(request)
    const blocked = await loginBlockedFor(ip)
    if (blocked) return json({ error: "locked", message: `Too many attempts. Try again in ${Math.ceil(blocked / 60)} minutes.` }, 429, { "Retry-After": String(blocked) })
    const input = await body(request)

    if (input.action === "options") {
      const { options, cookie } = await beginLogin(request)
      // "Use a passkey from another device": ask the browser to go straight to its phone / QR (hybrid) flow. The QR itself is drawn
      // by the browser / OS, is short-lived and bound to this very challenge; unsupported browsers simply ignore the hint.
      if (input.crossDevice === true) options.hints = ["hybrid"]
      return json(options, 200, { "Set-Cookie": cookie })
    }

    if (input.action === "verify") {
      const result = await finishLogin(request, input.response)
      if (!result.ok) {
        await recordLoginFailure(ip); await sleep(400)
        await writeAudit("anonymous", "login-failed", `passkey (${result.reason}) ip ${hashed(ip)}`).catch(() => {})
        return json({ error: "invalid", message: "Passkey sign-in failed." }, 401, { "Set-Cookie": clearChallengeCookie(request) })
      }
      await clearLoginFailures(ip)
      await writeAudit("admin", "login", `passkey "${result.name}"`).catch(() => {})
      return json({ ok: true }, 200, { "Set-Cookie": [createSessionCookie(request, { sub: "admin", method: "passkey" }), clearChallengeCookie(request)] })
    }

    if (input.action === "recovery") {
      const code = typeof input.code === "string" ? input.code.slice(0, 40) : ""
      const remaining = (await passkeyStatus()).passkeys.length === 0 ? null : await consumeRecoveryCode(code)
      if (remaining === null) {
        await recordLoginFailure(ip); await sleep(500)
        await writeAudit("anonymous", "login-failed", `recovery code ip ${hashed(ip)}`).catch(() => {})
        return json({ error: "invalid", message: "That recovery code is not valid." }, 401)
      }
      await clearLoginFailures(ip)
      await writeAudit("admin", "login", `recovery code (${remaining} left)`).catch(() => {})
      // A recovery sign-in is deliberately short (1 hour): its job is to let you register a new passkey.
      return json({ ok: true, recoveryRemaining: remaining }, 200, { "Set-Cookie": createSessionCookie(request, { sub: "admin", method: "recovery" }, 3600) })
    }
    return json({ error: "bad-request", message: "Unknown action" }, 400)
  } catch (error) { return errorResponse(error) }
}

// ---- signed in: manage ------------------------------------------------------------------------------------------------
function guard(request: Request, mutation: boolean): { ok: true; actor: string; method: string; recent: boolean } | { ok: false; response: Response } {
  if (mutation && !sameOriginMutation(request)) return { ok: false, response: json({ error: "forbidden" }, 403) }
  const session = getSession(request)
  if (!session) return { ok: false, response: json({ error: "unauthorized" }, 401) }
  return { ok: true, actor: session.sub, method: session.method, recent: typeof session.iat === "number" && Date.now() / 1000 - session.iat <= RECENT_SECONDS }
}

export async function passkeyStatusHandler(request: Request): Promise<Response> {
  const auth = guard(request, false)
  if (!auth.ok) return auth.response
  try {
    let rpID: string | null = null, configError: string | null = null
    try { rpID = webauthnConfig(request).rpID } catch (e) { configError = e instanceof ConfigError ? e.message : "Passkeys are not configured." }
    return json({ ...(await passkeyStatus()), rpID, configError, session: { method: auth.method, recent: auth.recent } })
  } catch (error) { return errorResponse(error) }
}

/** POST /api/admin/passkey — register-options | register-verify | test-options | test-verify | rename | remove | recovery-codes | policy */
export async function passkeyActionHandler(request: Request): Promise<Response> {
  const auth = guard(request, true)
  if (!auth.ok) return auth.response
  try {
    const input = await body(request)
    const action = typeof input.action === "string" ? input.action : ""
    const ip = clientIp(request)
    const blocked = await loginBlockedFor(ip)
    if (blocked) return json({ error: "locked", message: `Too many attempts. Try again in ${Math.ceil(blocked / 60)} minutes.` }, 429, { "Retry-After": String(blocked) })
    const needsRecent = ["register-options", "register-verify", "remove", "recovery-codes", "policy"].includes(action)
    if (needsRecent && !auth.recent) return json({ error: "reauth", message: "For safety, sign in again (within the last 15 minutes) to change sign-in methods." }, 403)

    switch (action) {
      case "register-options": {
        const { options, cookie } = await beginRegistration(request, auth.actor)
        return json(options, 200, { "Set-Cookie": cookie })
      }
      case "register-verify": {
        const created = await finishRegistration(request, auth.actor, input.response, input.name)
        await writeAudit(auth.actor, "passkey-added", `"${created.name}"`).catch(() => {})
        return json({ ok: true, passkey: created }, 200, { "Set-Cookie": clearChallengeCookie(request) })
      }
      case "test-options": {
        const { options, cookie } = await beginLogin(request)
        return json(options, 200, { "Set-Cookie": cookie })
      }
      case "test-verify": {
        const result = await finishLogin(request, input.response)
        if (!result.ok) { await recordLoginFailure(ip); return json({ error: "verification", message: "The passkey could not be verified." }, 400, { "Set-Cookie": clearChallengeCookie(request) }) }
        await writeAudit(auth.actor, "passkey-tested", `"${result.name}"`).catch(() => {})
        return json({ ok: true, name: result.name }, 200, { "Set-Cookie": clearChallengeCookie(request) })
      }
      case "rename": {
        await renamePasskey(String(input.id ?? ""), input.name)
        await writeAudit(auth.actor, "passkey-renamed").catch(() => {})
        return json({ ok: true })
      }
      case "remove": {
        await removePasskey(String(input.id ?? ""))
        await writeAudit(auth.actor, "passkey-removed").catch(() => {})
        return json({ ok: true })
      }
      case "recovery-codes": {
        const codes = await regenerateRecovery()
        await writeAudit(auth.actor, "passkey-recovery-regenerated").catch(() => {})
        return json({ recoveryCodes: codes })
      }
      case "policy": {
        const enabled = input.enabled === true
        await setPasswordlessOnly(enabled)
        await writeAudit(auth.actor, enabled ? "passwordless-on" : "passwordless-off", enabled ? "password and authenticator-code sign-in disabled" : "password sign-in available again").catch(() => {})
        return json({ ok: true })
      }
      default:
        return json({ error: "bad-request", message: "Unknown action" }, 400)
    }
  } catch (error) { return errorResponse(error) }
}

