import { randomBytes, createHash } from "node:crypto"
import {
  ConfigError, authConfig, buildCookie, clearLoginFailures, clearSessionCookie, clientIp, createSessionCookie,
  getSession, isSecureRequest, loginBlockedFor, publicAuthConfig, readCookie, recordLoginFailure,
  sameOriginMutation, signToken, verifyPassword, verifyToken,
} from "@/lib/server/auth"
import {
  TwoFactorError, confirmEnrollment, disableTwoFactor, regenerateRecoveryCodes, startEnrollment, twoFactorBlockedFor,
  twoFactorClearFailures, twoFactorRecordFailure, twoFactorRequired, twoFactorState, verifySecondFactor,
} from "@/lib/server/twofa"
import {
  ConflictError, ValidationError, getAudit, getContent, getHistory, readMedia, restoreVersion, saveContent, saveMedia, writeAudit,
} from "@/lib/server/content"
import { StorageNotConfigured } from "@/lib/server/store"
import { passkeyPublicState, passwordlessOnly } from "@/lib/server/passkey"

const baseHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }

function json(body: unknown, status = 200, extra: Record<string, string | string[]> = {}): Response {
  const headers = new Headers({ ...baseHeaders, "Content-Type": "application/json" })
  for (const [key, value] of Object.entries(extra)) for (const v of Array.isArray(value) ? value : [value]) headers.append(key, v)
  return new Response(JSON.stringify(body), { status, headers })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function errorResponse(error: unknown): Response {
  if (error instanceof SyntaxError) return json({ error: "bad-request", message: "Malformed JSON" }, 400)
  if (error instanceof ValidationError) return json({ error: "validation", issues: error.issues }, 422)
  if (error instanceof ConflictError) return json({ error: "conflict", message: error.message }, 409)
  if (error instanceof StorageNotConfigured) return json({ error: "storage", message: error.message }, 503)
  if (error instanceof ConfigError) return json({ error: "config", message: error.message }, 503)
  return json({ error: "server", message: "Something went wrong" }, 500)
}

/** Every admin write passes through here: valid session + same-origin + custom header. */
function guard(request: Request, mutation: boolean): { ok: true; actor: string } | { ok: false; response: Response } {
  if (mutation && !sameOriginMutation(request)) return { ok: false, response: json({ error: "forbidden" }, 403) }
  const session = getSession(request)
  if (!session) return { ok: false, response: json({ error: "unauthorized" }, 401) }
  return { ok: true, actor: session.sub }
}

// ---- auth ----------------------------------------------------------------------------
/** What the login page needs to draw itself. Also rendered on the server so the form appears with the first paint. */
export async function loginConfig() {
  const config = publicAuthConfig()
  // Tells the login page whether to ask for a code (env secret OR a secret enrolled in the admin).
  const totp = await twoFactorRequired().catch(() => config.totp)
  // Lets the login page lead with the passkey button, and drop the password form once passkey-only is on.
  const passkey = await passkeyPublicState().catch(() => ({ count: 0, passwordlessOnly: false }))
  // Passkey-only also switches Google sign-in off (it is another way in that does not use a passkey).
  return { ...config, google: config.google && !passkey.passwordlessOnly, totp, passkey }
}

export async function authConfigHandler(): Promise<Response> {
  return json(await loginConfig())
}

export async function sessionHandler(request: Request): Promise<Response> {
  const session = getSession(request)
  return json(session ? { authenticated: true, user: session.sub, method: session.method } : { authenticated: false })
}

export async function loginHandler(request: Request): Promise<Response> {
  try {
    if (!sameOriginMutation(request)) return json({ error: "forbidden" }, 403)
    const config = authConfig()
    if (!publicAuthConfig().password) return json({ error: "config", message: "Admin password login is not configured." }, 503)
    // Passkey-only policy: password and authenticator-code sign-in are OFF. Fails closed if the policy cannot be read.
    if (await passwordlessOnly()) return json({ error: "passwordless", message: "Password sign-in is turned off. Sign in with your passkey." }, 403)
    const ip = clientIp(request)
    const blocked = await loginBlockedFor(ip)
    if (blocked) return json({ error: "locked", message: `Too many attempts. Try again in ${Math.ceil(blocked / 60)} minutes.` }, 429, { "Retry-After": String(blocked) })

    const body = (await request.json().catch(() => ({}))) as { password?: unknown; totp?: unknown }
    const password = typeof body.password === "string" ? body.password.slice(0, 200) : ""
    const totp = typeof body.totp === "string" ? body.totp.trim() : ""

    // Fail closed: if we cannot tell whether 2FA is on (store down), nobody gets in.
    const needsSecondFactor = await twoFactorRequired()
    const passwordOk = await verifyPassword(password, config.passwordHash)
    // The code is only checked (and a recovery code only consumed) once the password is right.
    const second = !needsSecondFactor ? { ok: true as const, method: undefined } : passwordOk ? await verifySecondFactor(totp) : { ok: false as const }
    if (!passwordOk || !second.ok) {
      await recordLoginFailure(ip)
      await sleep(500)
      await writeAudit("anonymous", "login-failed", `ip ${createHash("sha256").update(ip).digest("hex").slice(0, 8)}`).catch(() => {})
      // Same message whichever factor failed, so nothing is revealed.
      return json({ error: "invalid", message: "Invalid credentials." }, 401)
    }
    await clearLoginFailures(ip)
    const how = !needsSecondFactor ? "password" : second.method === "recovery" ? `password+recovery (${second.recoveryRemaining} left)` : "password+totp"
    await writeAudit("admin", "login", how).catch(() => {})
    return json({ ok: true, ...(second.method === "recovery" ? { recoveryRemaining: second.recoveryRemaining } : {}) }, 200, { "Set-Cookie": createSessionCookie(request, { sub: "admin", method: "password" }) })
  } catch (error) { return errorResponse(error) }
}

export async function logoutHandler(request: Request): Promise<Response> {
  if (!sameOriginMutation(request)) return json({ error: "forbidden" }, 403)
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie(request) })
}

// ---- two-factor (Google Authenticator) management -------------------------------------------------
export async function twoFactorStatusHandler(request: Request): Promise<Response> {
  const auth = guard(request, false)
  if (!auth.ok) return auth.response
  try {
    const state = await twoFactorState()
    return json({ ...state, passwordRequired: publicAuthConfig().password })
  } catch (error) { return errorResponse(error) }
}

const twoFactorMessages: Record<TwoFactorError["code"], [number, string]> = {
  "already-enabled": [409, "Two-factor authentication is already on."],
  "managed-by-env": [409, "Two-factor is set by the ADMIN_TOTP_SECRET environment variable. Remove that variable to manage it here."],
  "not-enabled": [409, "Two-factor authentication is not on."],
  "no-pending": [409, "The setup expired. Start again to get a new QR code."],
  "invalid-code": [400, "That code is not valid. Check the time on your phone and try the next code."],
}

export async function twoFactorActionHandler(request: Request): Promise<Response> {
  const auth = guard(request, true)
  if (!auth.ok) return auth.response
  try {
    const body = (await request.json().catch(() => ({}))) as { action?: unknown; code?: unknown; password?: unknown }
    const action = typeof body.action === "string" ? body.action : ""
    const code = typeof body.code === "string" ? body.code.slice(0, 40) : ""

    const blocked = await twoFactorBlockedFor(auth.actor)
    if (blocked) return json({ error: "locked", message: `Too many wrong codes. Try again in ${Math.ceil(blocked / 60)} minutes.` }, 429, { "Retry-After": String(blocked) })

    try {
      if (action === "start") {
        // Starting (re)enrolment needs the password again, so a left-open session alone cannot add a second factor.
        const config = authConfig()
        if (publicAuthConfig().password) {
          const password = typeof body.password === "string" ? body.password.slice(0, 200) : ""
          if (!(await verifyPassword(password, config.passwordHash))) {
            await twoFactorRecordFailure(auth.actor)
            return json({ error: "invalid-password", message: "That password is not correct." }, 400)
          }
        }
        return json(await startEnrollment())
      }
      if (action === "confirm") {
        const result = await confirmEnrollment(code)
        await twoFactorClearFailures(auth.actor)
        await writeAudit(auth.actor, "2fa-enabled", "authenticator app").catch(() => {})
        return json(result)
      }
      if (action === "disable") {
        await disableTwoFactor(code)
        await twoFactorClearFailures(auth.actor)
        await writeAudit(auth.actor, "2fa-disabled").catch(() => {})
        return json({ ok: true })
      }
      if (action === "recovery") {
        const result = await regenerateRecoveryCodes(code)
        await twoFactorClearFailures(auth.actor)
        await writeAudit(auth.actor, "2fa-recovery-regenerated").catch(() => {})
        return json(result)
      }
      return json({ error: "bad-request", message: "Unknown action" }, 400)
    } catch (error) {
      if (error instanceof TwoFactorError) {
        if (error.code === "invalid-code") await twoFactorRecordFailure(auth.actor)
        const [status, message] = twoFactorMessages[error.code]
        return json({ error: error.code, message }, status)
      }
      throw error
    }
  } catch (error) { return errorResponse(error) }
}

// ---- Google OAuth (authorization code + PKCE) ----------------------------------------
const oauthCookie = "admin_oauth"
const siteOrigin = (request: Request) => process.env.SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin

export async function googleStartHandler(request: Request): Promise<Response> {
  try {
    const config = authConfig()
    if (!publicAuthConfig().google) return Response.redirect(new URL("/admin/login?error=google-config", request.url), 302)
    // Passkey-only policy: Google sign-in is OFF too. Fails closed if the policy cannot be read.
    if (await passwordlessOnly()) return Response.redirect(new URL("/admin/login?error=google-passwordless", request.url), 302)
    const state = randomBytes(16).toString("hex")
    const nonce = randomBytes(16).toString("hex")
    const verifier = randomBytes(32).toString("base64url")
    const challenge = createHash("sha256").update(verifier).digest("base64url")
    const params = new URLSearchParams({
      client_id: config.googleId, redirect_uri: `${siteOrigin(request)}/api/admin/google/callback`, response_type: "code",
      scope: "openid email", state, nonce, code_challenge: challenge, code_challenge_method: "S256", prompt: "select_account",
    })
    const secure = isSecureRequest(request)
    return new Response(null, { status: 302, headers: {
      Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      "Set-Cookie": buildCookie(oauthCookie, signToken({ state, nonce, verifier }, 600), { secure, maxAge: 600, path: "/api/admin/google" }),
      ...baseHeaders,
    } })
  } catch (error) { return errorResponse(error) }
}

export async function googleCallbackHandler(request: Request): Promise<Response> {
  const fail = (code: string) => new Response(null, { status: 302, headers: { Location: `/admin/login?error=${code}`, "Set-Cookie": buildCookie(oauthCookie, "", { secure: isSecureRequest(request), maxAge: 0, path: "/api/admin/google" }), ...baseHeaders } })
  try {
    const config = authConfig()
    if (await passwordlessOnly()) return fail("google-passwordless")
    const url = new URL(request.url)
    const saved = verifyToken<{ state: string; nonce: string; verifier: string }>(readCookie(request, oauthCookie))
    const code = url.searchParams.get("code")
    if (!saved || !code || url.searchParams.get("state") !== saved.state) return fail("google-state")

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, cache: "no-store",
      body: new URLSearchParams({ code, client_id: config.googleId, client_secret: config.googleSecret, redirect_uri: `${siteOrigin(request)}/api/admin/google/callback`, grant_type: "authorization_code", code_verifier: saved.verifier }),
    })
    if (!tokenResponse.ok) return fail("google-token")
    const { id_token: idToken } = (await tokenResponse.json()) as { id_token?: string }
    // The ID token came straight from Google over TLS in exchange for our secret, so its claims can be trusted.
    const claims = JSON.parse(Buffer.from((idToken || "").split(".")[1] || "", "base64url").toString("utf8")) as {
      aud?: string; iss?: string; exp?: number; nonce?: string; email?: string; email_verified?: boolean
    }
    const validIssuer = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com"
    if (claims.aud !== config.googleId || !validIssuer || !claims.exp || claims.exp * 1000 < Date.now() || claims.nonce !== saved.nonce) return fail("google-token")
    const email = (claims.email || "").toLowerCase()
    if (!claims.email_verified || !config.adminEmails.includes(email)) {
      await writeAudit("anonymous", "google-denied", email.slice(0, 80)).catch(() => {})
      return fail("google-denied")
    }
    await writeAudit(email, "login", "google").catch(() => {})
    // Respond with a page (not a redirect) so the next request to /admin is same-site and carries the cookie.
    const headers = new Headers({ "Content-Type": "text/html; charset=utf-8", ...baseHeaders })
    headers.append("Set-Cookie", createSessionCookie(request, { sub: email, method: "google" }))
    headers.append("Set-Cookie", buildCookie(oauthCookie, "", { secure: isSecureRequest(request), maxAge: 0, path: "/api/admin/google" }))
    return new Response(`<!doctype html><meta charset="utf-8"><title>Signing in…</title><script>location.replace("/admin")</script><noscript><a href="/admin">Continue</a></noscript>`, { status: 200, headers })
  } catch { return fail("google-error") }
}

// ---- content -------------------------------------------------------------------------
export async function contentGetHandler(request: Request): Promise<Response> {
  const auth = guard(request, false)
  if (!auth.ok) return auth.response
  try {
    const [content, history] = await Promise.all([getContent(), getHistory()])
    return json({ content, history: history.map(({ version, savedAt, by }) => ({ version, savedAt, by })) })
  } catch (error) { return errorResponse(error) }
}

export async function contentPutHandler(request: Request): Promise<Response> {
  const auth = guard(request, true)
  if (!auth.ok) return auth.response
  try {
    const body = (await request.json()) as { content?: unknown; baseVersion?: unknown }
    if (typeof body.baseVersion !== "number") return json({ error: "validation", issues: [{ path: "baseVersion", message: "Required" }] }, 422)
    const content = await saveContent(body.content, body.baseVersion, auth.actor)
    return json({ content })
  } catch (error) { return errorResponse(error) }
}

export async function contentRestoreHandler(request: Request): Promise<Response> {
  const auth = guard(request, true)
  if (!auth.ok) return auth.response
  try {
    const body = (await request.json()) as { version?: unknown; baseVersion?: unknown }
    if (typeof body.version !== "number" || typeof body.baseVersion !== "number") return json({ error: "validation", issues: [{ path: "version", message: "Required" }] }, 422)
    return json({ content: await restoreVersion(body.version, body.baseVersion, auth.actor) })
  } catch (error) { return errorResponse(error) }
}

export async function mediaUploadHandler(request: Request): Promise<Response> {
  const auth = guard(request, true)
  if (!auth.ok) return auth.response
  try {
    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof Blob)) return json({ error: "validation", issues: [{ path: "file", message: "No file" }] }, 422)
    return json({ url: await saveMedia(Buffer.from(await file.arrayBuffer()), auth.actor) })
  } catch (error) { return errorResponse(error) }
}

export async function auditHandler(request: Request): Promise<Response> {
  const auth = guard(request, false)
  if (!auth.ok) return auth.response
  try { return json({ audit: await getAudit() }) } catch (error) { return errorResponse(error) }
}

export async function mediaGetHandler(id: string): Promise<Response> {
  const media = await readMedia(id)
  if (!media) return new Response("Not found", { status: 404 })
  return new Response(new Uint8Array(media.bytes), { headers: {
    "Content-Type": media.mime, "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  } })
}
