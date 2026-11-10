
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { ConfigError, deriveKey, isSecureRequest, readCookie, signToken, verifyToken, buildCookie } from "@/lib/server/auth"
import { generateRecoveryCodes, looksLikeRecovery, normalizeRecovery } from "@/lib/server/twofa"
import { getStore } from "@/lib/server/store"

// Infer the exact option types returned by the installed SimpleWebAuthn version.
type RegistrationOptions = Awaited<
  ReturnType<typeof import("@simplewebauthn/server").generateRegistrationOptions>
>
type AuthenticationOptions = Awaited<
  ReturnType<typeof import("@simplewebauthn/server").generateAuthenticationOptions>
>

/**
 * Passwordless admin sign-in with passkeys (WebAuthn / FIDO2).
 *
 * The cryptography (challenge, signature, origin, RP ID, user-verification, counter checks) is done by the
 * @simplewebauthn/server library, reached ONLY through the `Engine` seam below (implemented in webauthn-engine.ts).
 * This module owns what the library does not: where challenges live (single use, short-lived, bound to the browser that
 * asked for them), where credentials are stored, the ≥1-passkey / tested / recovery rules for going passwordless-only,
 * recovery codes, and failing closed.
 */

// ---- engine seam -----------------------------------------------------------------------------
export interface StoredCredential {
  id: string
  publicKey: string
  counter: number
  transports: string[]
}

export interface Engine {
  registrationOptions(i: {
    rpName: string
    rpID: string
    userName: string
    userID: Uint8Array
    excludeIds: string[]
  }): Promise<RegistrationOptions>

  verifyRegistration(i: {
    response: unknown
    expectedChallenge: string
    expectedOrigin: string
    expectedRPID: string
  }): Promise<{
    verified: boolean
    credential?: StoredCredential & {
      deviceType: string
      backedUp: boolean
    }
  }>

  authenticationOptions(i: {
    rpID: string
  }): Promise<AuthenticationOptions>

  verifyAuthentication(i: {
    response: unknown
    expectedChallenge: string
    expectedOrigin: string
    expectedRPID: string
    credential: StoredCredential
  }): Promise<{
    verified: boolean
    newCounter: number
  }>
}

let engineOverride: Engine | null = null

export function setEngineForTests(engine: Engine | null) {
  engineOverride = engine
}

export async function getEngine(): Promise<Engine> {
  if (engineOverride) return engineOverride
  return (await import("@/lib/server/webauthn-engine")).realEngine
}

// ---- relying-party configuration (never taken from the client body) ----------------------------
export const RP_NAME = "Portfolio Admin"

export function webauthnConfig(request: Request): {
  origin: string
  rpID: string
  rpName: string
} {
  const pinned = (process.env.WEBAUTHN_ORIGIN || process.env.SITE_URL || "")
    .trim()
    .replace(/\/$/, "")

  let origin = pinned

  if (!origin) {
    // Without a pinned origin only local development is accepted: a deployed site must set SITE_URL.
    if (process.env.NODE_ENV === "production") {
      throw new ConfigError("Passkeys need SITE_URL (your public https origin) to be set.")
    }

    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      ""

    origin = `${isSecureRequest(request) ? "https" : "http"}://${host}`
  }

  let url: URL

  try {
    url = new URL(origin)
  } catch {
    throw new ConfigError("SITE_URL / WEBAUTHN_ORIGIN is not a valid origin.")
  }

  const local =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"

  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new ConfigError("Passkeys need https (http is only allowed on localhost).")
  }

  const rpID = (process.env.WEBAUTHN_RP_ID || "").trim() || url.hostname

  if (url.hostname !== rpID && !url.hostname.endsWith("." + rpID)) {
    throw new ConfigError("WEBAUTHN_RP_ID must equal the site's domain (or a parent of it).")
  }

  return {
    origin: url.origin,
    rpID,
    rpName: RP_NAME,
  }
}

// ---- stored state ---------------------------------------------------------------------------------
export interface PasskeyRecord {
  id: string
  publicKey: string
  counter: number
  transports: string[]
  deviceType: string
  backedUp: boolean
  name: string
  createdAt: string
  lastUsedAt: string | null
}

interface State {
  v: 1
  userHandle: string
  creds: PasskeyRecord[]
  passwordlessOnly: boolean
  passwordlessSince: string | null
  recovery: string[]
  recoveryAt: string | null
}

const STATE_KEY = "admin:passkeys"
export const MAX_PASSKEYS = 10

const emptyState = (): State => ({
  v: 1,
  userHandle: "",
  creds: [],
  passwordlessOnly: false,
  passwordlessSince: null,
  recovery: [],
  recoveryAt: null,
})

async function readState(): Promise<State> {
  const raw = await getStore().get(STATE_KEY)

  if (!raw) return emptyState()

  let state: State

  try {
    state = JSON.parse(raw) as State
  } catch {
    throw new ConfigError("The stored passkey record is damaged.")
  }

  if (
    state?.v !== 1 ||
    !Array.isArray(state.creds) ||
    !Array.isArray(state.recovery)
  ) {
    throw new ConfigError("The stored passkey record is damaged.")
  }

  return state
}

const writeState = (state: State) =>
  getStore().set(STATE_KEY, JSON.stringify(state))

/** What the (public) login page may know. Throws if the store cannot be read, so callers fail closed. */
export async function passkeyPublicState(): Promise<{
  count: number
  passwordlessOnly: boolean
}> {
  const s = await readState()

  return {
    count: s.creds.length,
    passwordlessOnly: s.passwordlessOnly,
  }
}

export async function passwordlessOnly(): Promise<boolean> {
  return (await readState()).passwordlessOnly
}

export interface PasskeySummary {
  id: string
  name: string
  createdAt: string
  lastUsedAt: string | null
  deviceType: string
  backedUp: boolean
}

export interface PasskeyStatus {
  passkeys: PasskeySummary[]
  passwordlessOnly: boolean
  passwordlessSince: string | null
  recoveryRemaining: number
  recoveryAt: string | null
  requirements: {
    hasPasskey: boolean
    tested: boolean
    hasRecovery: boolean
  }
  max: number
}

const summarize = (c: PasskeyRecord): PasskeySummary => ({
  id: c.id,
  name: c.name,
  createdAt: c.createdAt,
  lastUsedAt: c.lastUsedAt,
  deviceType: c.deviceType,
  backedUp: c.backedUp,
})

const requirementsOf = (s: State) => ({
  hasPasskey: s.creds.length > 0,
  tested: s.creds.some((c) => c.lastUsedAt !== null),
  hasRecovery: s.recovery.length > 0,
})

export async function passkeyStatus(): Promise<PasskeyStatus> {
  const s = await readState()

  return {
    passkeys: s.creds.map(summarize),
    passwordlessOnly: s.passwordlessOnly,
    passwordlessSince: s.passwordlessSince,
    recoveryRemaining: s.recovery.length,
    recoveryAt: s.recoveryAt,
    requirements: requirementsOf(s),
    max: MAX_PASSKEYS,
  }
}

export class PasskeyError extends Error {
  constructor(
    public code:
      | "limit"
      | "challenge"
      | "verification"
      | "duplicate"
      | "not-found"
      | "last-passkey"
      | "no-passkey"
      | "not-tested"
      | "no-recovery"
      | "bad-name"
      | "bad-request",
  ) {
    super(code)
  }
}

// ---- challenges: single use, 2-minute life, bound to the browser that asked --------------------------
const CHALLENGE_TTL_MS = 120_000

type Purpose = "login" | "register"

interface ChallengeRecord {
  challenge: string
  purpose: Purpose
  sub: string | null
  exp: number
}

const challengeKey = (cid: string) => `pk:chal:${cid}`

export const challengeCookieName = (secure: boolean) =>
  secure ? "__Host-admin_pk" : "admin_pk"

async function issueChallenge(
  request: Request,
  challenge: string,
  purpose: Purpose,
  sub: string | null,
  now: number,
): Promise<string> {
  const cid = randomBytes(18).toString("base64url")

  const record: ChallengeRecord = {
    challenge,
    purpose,
    sub,
    exp: now + CHALLENGE_TTL_MS,
  }

  await getStore().set(challengeKey(cid), JSON.stringify(record))

  const secure = isSecureRequest(request)

  // The cookie carries only the lookup id; without THIS browser's cookie the stored challenge cannot be claimed.
  return buildCookie(
    challengeCookieName(secure),
    signToken({ cid, purpose }, CHALLENGE_TTL_MS / 1000),
    {
      secure,
      maxAge: CHALLENGE_TTL_MS / 1000,
    },
  )
}

export function clearChallengeCookie(request: Request): string {
  const secure = isSecureRequest(request)

  return buildCookie(challengeCookieName(secure), "", {
    secure,
    maxAge: 0,
  })
}

/** Reads AND deletes the challenge in one go: whatever happens next, it can never be used a second time. */
async function claimChallenge(
  request: Request,
  purpose: Purpose,
  now: number,
): Promise<ChallengeRecord | null> {
  const token = verifyToken<{ cid?: string; purpose?: string }>(
    readCookie(request, challengeCookieName(isSecureRequest(request))),
  )

  if (
    !token ||
    typeof token.cid !== "string" ||
    token.purpose !== purpose
  ) {
    return null
  }

  const raw = await getStore().take(challengeKey(token.cid))

  // atomic read+delete: a challenge can be claimed exactly once
  if (!raw) return null

  try {
    const record = JSON.parse(raw) as ChallengeRecord

    return (
      record.purpose === purpose &&
      record.exp > now &&
      typeof record.challenge === "string"
    )
      ? record
      : null
  } catch {
    return null
  }
}

// ---- sign-in ----------------------------------------------------------------------------------------------
export async function beginLogin(
  request: Request,
  now = Date.now(),
): Promise<{
  options: AuthenticationOptions
  cookie: string
}> {
  const state = await readState()

  if (state.creds.length === 0) {
    throw new PasskeyError("no-passkey")
  }

  const cfg = webauthnConfig(request)

  const options = await (await getEngine()).authenticationOptions({
    rpID: cfg.rpID,
  })

  return {
    options,
    cookie: await issueChallenge(
      request,
      options.challenge,
      "login",
      null,
      now,
    ),
  }
}

export type LoginResult =
  | { ok: true; credentialId: string; name: string }
  | {
      ok: false
      reason:
        | "challenge"
        | "unknown-credential"
        | "verification"
        | "counter"
        | "bad-request"
    }

export async function finishLogin(
  request: Request,
  response: unknown,
  now = Date.now(),
): Promise<LoginResult> {
  const record = await claimChallenge(request, "login", now)

  if (!record) return { ok: false, reason: "challenge" }

  const id = (response as { id?: unknown } | null)?.id

  if (typeof id !== "string" || id.length > 1400) {
    return { ok: false, reason: "bad-request" }
  }

  const state = await readState()
  const cred = state.creds.find((c) => c.id === id)

  if (!cred) return { ok: false, reason: "unknown-credential" }

  // A discoverable credential reports which user it belongs to: it must be OUR admin's handle.
  const reportedHandle = (
    response as { response?: { userHandle?: unknown } } | null
  )?.response?.userHandle

  if (
    typeof reportedHandle === "string" &&
    reportedHandle !== "" &&
    state.userHandle &&
    reportedHandle !== state.userHandle
  ) {
    return { ok: false, reason: "verification" }
  }

  const cfg = webauthnConfig(request)

  let verified: {
    verified: boolean
    newCounter: number
  }

  try {
    // Every expected value comes from the server: the stored challenge, the pinned origin and RP ID, the stored public key.
    verified = await (await getEngine()).verifyAuthentication({
      response,
      expectedChallenge: record.challenge,
      expectedOrigin: cfg.origin,
      expectedRPID: cfg.rpID,
      credential: {
        id: cred.id,
        publicKey: cred.publicKey,
        counter: cred.counter,
        transports: cred.transports,
      },
    })
  } catch {
    return { ok: false, reason: "verification" }
  }

  if (!verified.verified) {
    return { ok: false, reason: "verification" }
  }

  // Cloned-authenticator defence (synced passkeys legitimately stay at 0).
  if (
    (verified.newCounter !== 0 || cred.counter !== 0) &&
    verified.newCounter <= cred.counter
  ) {
    return { ok: false, reason: "counter" }
  }

  const fresh = await readState()
  const target = fresh.creds.find((c) => c.id === id)

  if (!target) return { ok: false, reason: "unknown-credential" }

  target.counter = verified.newCounter
  target.lastUsedAt = new Date(now).toISOString()

  await writeState(fresh)

  return {
    ok: true,
    credentialId: cred.id,
    name: cred.name,
  }
}

// ---- registration (needs a signed-in admin) -----------------------------------------------------------------
export async function beginRegistration(
  request: Request,
  actor: string,
  now = Date.now(),
): Promise<{
  options: RegistrationOptions
  cookie: string
}> {
  const state = await readState()

  if (state.creds.length >= MAX_PASSKEYS) {
    throw new PasskeyError("limit")
  }

  const cfg = webauthnConfig(request)

  if (!state.userHandle) {
    state.userHandle = randomBytes(32).toString("base64url")
    await writeState(state)
  }

  // stable WebAuthn user.id, created once
  const userHandle = state.userHandle

  const options = await (await getEngine()).registrationOptions({
    rpName: cfg.rpName,
    rpID: cfg.rpID,
    userName: "admin",
    userID: new Uint8Array(Buffer.from(userHandle, "base64url")),
    excludeIds: state.creds.map((c) => c.id),
  })

  return {
    options,
    cookie: await issueChallenge(
      request,
      options.challenge,
      "register",
      actor,
      now,
    ),
  }
}

export const cleanName = (input: unknown): string | null => {
  if (typeof input !== "string") return null

  const name = input
    .replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  return name.length >= 1 && name.length <= 40 ? name : null
}

export async function finishRegistration(
  request: Request,
  actor: string,
  response: unknown,
  name: unknown,
  now = Date.now(),
): Promise<PasskeySummary> {
  const record = await claimChallenge(request, "register", now)

  if (!record || record.sub !== actor) {
    throw new PasskeyError("challenge")
  }

  const cfg = webauthnConfig(request)

  let result: Awaited<ReturnType<Engine["verifyRegistration"]>>

  try {
    result = await (await getEngine()).verifyRegistration({
      response,
      expectedChallenge: record.challenge,
      expectedOrigin: cfg.origin,
      expectedRPID: cfg.rpID,
    })
  } catch {
    throw new PasskeyError("verification")
  }

  if (!result.verified || !result.credential) {
    throw new PasskeyError("verification")
  }

  const state = await readState()

  if (state.creds.length >= MAX_PASSKEYS) {
    throw new PasskeyError("limit")
  }

  if (state.creds.some((c) => c.id === result.credential!.id)) {
    throw new PasskeyError("duplicate")
  }

  const label =
    name === undefined || name === ""
      ? `Passkey ${state.creds.length + 1}`
      : cleanName(name)

  if (!label) throw new PasskeyError("bad-name")

  const created: PasskeyRecord = {
    ...result.credential,
    name: label,
    createdAt: new Date(now).toISOString(),
    lastUsedAt: null,
  }

  state.creds.push(created)
  await writeState(state)

  return summarize(created)
}

/** The stable WebAuthn user handle (what a discoverable credential returns as userHandle). */
export async function expectedUserHandle(): Promise<string> {
  return (await readState()).userHandle
}

// ---- management ---------------------------------------------------------------------------------------------------
export async function renamePasskey(
  id: string,
  name: unknown,
): Promise<void> {
  const label = cleanName(name)

  if (!label) throw new PasskeyError("bad-name")

  const state = await readState()
  const cred = state.creds.find((c) => c.id === id)

  if (!cred) throw new PasskeyError("not-found")

  cred.name = label
  await writeState(state)
}

export async function removePasskey(id: string): Promise<void> {
  const state = await readState()

  if (!state.creds.some((c) => c.id === id)) {
    throw new PasskeyError("not-found")
  }

  if (state.passwordlessOnly && state.creds.length <= 1) {
    throw new PasskeyError("last-passkey") // would lock everyone out
  }

  state.creds = state.creds.filter((c) => c.id !== id)
  await writeState(state)
}

// ---- recovery codes (keyed hashes, single use) ------------------------------------------------------------------------
const recoveryHash = (code: string) =>
  createHmac("sha256", deriveKey("passkey-recovery"))
    .update(normalizeRecovery(code))
    .digest("base64url")

export async function regenerateRecovery(now = Date.now()): Promise<string[]> {
  const state = await readState()

  if (state.creds.length === 0) {
    throw new PasskeyError("no-passkey")
  }

  const codes = generateRecoveryCodes()

  state.recovery = codes.map(recoveryHash)
  state.recoveryAt = new Date(now).toISOString()

  await writeState(state)

  return codes
}

/** Consumes one recovery code. Returns how many remain, or null if the code is not valid. */
export async function consumeRecoveryCode(
  input: string,
): Promise<number | null> {
  if (!looksLikeRecovery(input)) return null

  const state = await readState()
  const given = Buffer.from(recoveryHash(input))

  let index = -1

  // no early exit
  state.recovery.forEach((hash, i) => {
    const stored = Buffer.from(hash)

    if (
      stored.length === given.length &&
      timingSafeEqual(stored, given)
    ) {
      index = i
    }
  })

  if (index < 0) return null

  state.recovery = state.recovery.filter((_, i) => i !== index)

  await writeState(state)

  return state.recovery.length
}

// ---- passwordless-only policy --------------------------------------------------------------------------------------------
/** Turning password + authenticator-code sign-in off requires a registered passkey that has really been used to sign in, and recovery codes. */
export async function setPasswordlessOnly(
  enabled: boolean,
  now = Date.now(),
): Promise<void> {
  const state = await readState()

  if (enabled) {
    const r = requirementsOf(state)

    if (!r.hasPasskey) throw new PasskeyError("no-passkey")
    if (!r.tested) throw new PasskeyError("not-tested")
    if (!r.hasRecovery) throw new PasskeyError("no-recovery")
  }

  state.passwordlessOnly = enabled
  state.passwordlessSince = enabled ? new Date(now).toISOString() : null

  await writeState(state)
}
