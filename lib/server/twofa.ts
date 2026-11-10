import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { ConfigError, authConfig, deriveKey, generateTotpSecret, totpUri, verifyTotpStep } from "@/lib/server/auth"
import { qrRows } from "@/lib/qr"
import { getStore } from "@/lib/server/store"

/**
 * Google Authenticator (TOTP, RFC 6238) enrolment and verification.
 *
 *  • Source of truth: ADMIN_TOTP_SECRET (environment) wins; otherwise the secret enrolled in the admin (Security page).
 *  • The enrolled secret is stored AES-256-GCM encrypted with a key derived from SESSION_SECRET — never in plain text.
 *  • A new secret only becomes active after the owner proves the app works by typing a valid code.
 *  • A code can be used once (the time step is remembered); 10 single-use recovery codes are stored only as keyed hashes.
 *  • Both the encryption key and the recovery-code hashes derive from SESSION_SECRET: rotating it invalidates the enrolled 2FA.
 *    Break-glass for the server owner: `node scripts/admin-reset-2fa.mjs` (deletes the stored record, then enrol again).
 *  • Anything unexpected (store unreachable, secret cannot be decrypted) FAILS CLOSED — it never lets a login through.
 */
const RECORD_KEY = "admin:2fa"
const PENDING_KEY = "admin:2fa:pending"
const ENV_LAST_KEY = "admin:2fa:env-last"
const PENDING_TTL_MS = 10 * 60 * 1000
export const RECOVERY_CODE_COUNT = 10
export const ISSUER = "Portfolio Admin"
export const ACCOUNT = "admin"

interface Record2fa { v: 1; secret: string; enabledAt: string; lastStep: number; recovery: string[] }
interface Pending { secret: string; createdAt: number }

// ---- encryption at rest ---------------------------------------------------------------
export function encryptSecret(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", deriveKey("2fa-secret"), iv)
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  return `v1.${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${ct.toString("base64url")}`
}
export function decryptSecret(blob: string): string {
  try {
    const [version, iv, tag, ct] = blob.split(".")
    if (version !== "v1" || !iv || !tag || !ct) throw new Error("format")
    const decipher = createDecipheriv("aes-256-gcm", deriveKey("2fa-secret"), Buffer.from(iv, "base64url"))
    decipher.setAuthTag(Buffer.from(tag, "base64url"))
    return Buffer.concat([decipher.update(Buffer.from(ct, "base64url")), decipher.final()]).toString("utf8")
  } catch {
    throw new ConfigError("The stored two-factor secret cannot be read (was SESSION_SECRET changed?). On the server run: node scripts/admin-reset-2fa.mjs")
  }
}

// ---- recovery codes ---------------------------------------------------------------------
const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // 32 symbols, no I/O/0/1 — 256 % 32 == 0 so no modulo bias
export const normalizeRecovery = (input: string) => input.toUpperCase().replace(/[^A-Z0-9]/g, "")
export const looksLikeRecovery = (input: string) => /^[A-HJ-NP-Z2-9]{10}$/.test(normalizeRecovery(input))
const recoveryHash = (code: string) => createHmac("sha256", deriveKey("2fa-recovery")).update(normalizeRecovery(code)).digest("base64url")

export function generateRecoveryCodes(count = RECOVERY_CODE_COUNT): string[] {
  return Array.from({ length: count }, () => {
    const chars = Array.from(randomBytes(10), (b) => RECOVERY_ALPHABET[b % 32]).join("")
    return `${chars.slice(0, 5)}-${chars.slice(5)}`
  })
}

// ---- storage ------------------------------------------------------------------------------
async function readRecord(): Promise<Record2fa | null> {
  const raw = await getStore().get(RECORD_KEY)
  if (!raw) return null
  const record = JSON.parse(raw) as Record2fa
  if (record?.v !== 1 || typeof record.secret !== "string" || !Array.isArray(record.recovery)) throw new ConfigError("The stored two-factor record is damaged.")
  return record
}
const writeRecord = (record: Record2fa) => getStore().set(RECORD_KEY, JSON.stringify(record))

export interface TwoFactorState { enabled: boolean; source: "env" | "app" | null; recoveryRemaining: number; enabledAt: string | null }

/** Read-only status. Throws if the store cannot be read (callers fail closed). */
export async function twoFactorState(): Promise<TwoFactorState> {
  if (authConfig().totpSecret) return { enabled: true, source: "env", recoveryRemaining: 0, enabledAt: null }
  const record = await readRecord()
  return record ? { enabled: true, source: "app", recoveryRemaining: record.recovery.length, enabledAt: record.enabledAt } : { enabled: false, source: null, recoveryRemaining: 0, enabledAt: null }
}
export const twoFactorRequired = async () => (await twoFactorState()).enabled

// ---- verification (login, disable, regenerate) -------------------------------------------
export type SecondFactor = { ok: true; method: "totp" | "recovery"; recoveryRemaining?: number } | { ok: false }

/** Verifies a 6-digit authenticator code (once per time step) or a single-use recovery code. */
export async function verifySecondFactor(input: string, now = Date.now()): Promise<SecondFactor> {
  const code = input.trim()
  const envSecret = authConfig().totpSecret
  if (envSecret) {
    const step = verifyTotpStep(envSecret, code, now)
    if (step === null) return { ok: false }
    try { // replay protection is best-effort for the env secret (it must keep working if the store is down)
      const last = Number((await getStore().get(ENV_LAST_KEY)) ?? 0)
      if (step <= last) return { ok: false }
      await getStore().set(ENV_LAST_KEY, String(step))
    } catch { /* ignore */ }
    return { ok: true, method: "totp" }
  }

  const record = await readRecord()
  if (!record) return { ok: false }
  if (/^\d{6}$/.test(code)) {
    const step = verifyTotpStep(decryptSecret(record.secret), code, now)
    if (step === null || step <= record.lastStep) return { ok: false }
    await writeRecord({ ...record, lastStep: step })
    return { ok: true, method: "totp" }
  }
  if (looksLikeRecovery(code)) {
    const given = Buffer.from(recoveryHash(code))
    let index = -1
    record.recovery.forEach((hash, i) => { const stored = Buffer.from(hash); if (stored.length === given.length && timingSafeEqual(stored, given)) index = i }) // no early exit
    if (index < 0) return { ok: false }
    const recovery = record.recovery.filter((_, i) => i !== index)
    await writeRecord({ ...record, recovery })
    return { ok: true, method: "recovery", recoveryRemaining: recovery.length }
  }
  return { ok: false }
}

// ---- enrolment ----------------------------------------------------------------------------
export class TwoFactorError extends Error { constructor(public code: "already-enabled" | "managed-by-env" | "not-enabled" | "no-pending" | "invalid-code") { super(code) } }

export async function startEnrollment(): Promise<{ secret: string; uri: string; qr: string[]; expiresAt: string }> {
  const state = await twoFactorState()
  if (state.source === "env") throw new TwoFactorError("managed-by-env")
  if (state.enabled) throw new TwoFactorError("already-enabled")
  const secret = generateTotpSecret()
  const uri = totpUri(secret, ACCOUNT, ISSUER)
  const pending: Pending = { secret: encryptSecret(secret), createdAt: Date.now() }
  await getStore().set(PENDING_KEY, JSON.stringify(pending))
  return { secret, uri, qr: qrRows(uri), expiresAt: new Date(pending.createdAt + PENDING_TTL_MS).toISOString() }
}

export async function confirmEnrollment(code: string, now = Date.now()): Promise<{ recoveryCodes: string[] }> {
  const state = await twoFactorState()
  if (state.source === "env") throw new TwoFactorError("managed-by-env")
  if (state.enabled) throw new TwoFactorError("already-enabled")
  const raw = await getStore().get(PENDING_KEY)
  const pending = raw ? (JSON.parse(raw) as Pending) : null
  if (!pending || pending.createdAt + PENDING_TTL_MS < now) { await getStore().del(PENDING_KEY).catch(() => {}); throw new TwoFactorError("no-pending") }
  const step = verifyTotpStep(decryptSecret(pending.secret), code.trim(), now)
  if (step === null) throw new TwoFactorError("invalid-code")
  const recoveryCodes = generateRecoveryCodes()
  await writeRecord({ v: 1, secret: pending.secret, enabledAt: new Date(now).toISOString(), lastStep: step, recovery: recoveryCodes.map(recoveryHash) })
  await getStore().del(PENDING_KEY)
  return { recoveryCodes }
}

export async function disableTwoFactor(code: string): Promise<void> {
  const state = await twoFactorState()
  if (state.source === "env") throw new TwoFactorError("managed-by-env")
  if (!state.enabled) throw new TwoFactorError("not-enabled")
  if (!(await verifySecondFactor(code)).ok) throw new TwoFactorError("invalid-code")
  await getStore().del(RECORD_KEY)
  await getStore().del(PENDING_KEY).catch(() => {})
}

export async function regenerateRecoveryCodes(code: string): Promise<{ recoveryCodes: string[] }> {
  const state = await twoFactorState()
  if (state.source === "env") throw new TwoFactorError("managed-by-env")
  if (!state.enabled) throw new TwoFactorError("not-enabled")
  if (!(await verifySecondFactor(code)).ok) throw new TwoFactorError("invalid-code")
  const record = await readRecord()
  if (!record) throw new TwoFactorError("not-enabled")
  const recoveryCodes = generateRecoveryCodes()
  await writeRecord({ ...record, recovery: recoveryCodes.map(recoveryHash) })
  return { recoveryCodes }
}

// ---- brute-force limiter for the 2FA management endpoints (5 failures / 15 min per signed-in user) --------
const LIMIT = { max: 5, windowMs: 15 * 60 * 1000 }
const limiterKey = (actor: string) => `rl:2fa:${createHash("sha256").update(actor).digest("hex").slice(0, 24)}`
interface Attempts { count: number; first: number }

export async function twoFactorBlockedFor(actor: string): Promise<number> {
  const raw = await getStore().get(limiterKey(actor))
  if (!raw) return 0
  const a = JSON.parse(raw) as Attempts
  const remaining = a.first + LIMIT.windowMs - Date.now()
  return a.count >= LIMIT.max && remaining > 0 ? Math.ceil(remaining / 1000) : 0
}
export async function twoFactorRecordFailure(actor: string): Promise<void> {
  const store = getStore()
  const raw = await store.get(limiterKey(actor))
  let a: Attempts = raw ? JSON.parse(raw) : { count: 0, first: Date.now() }
  if (a.first + LIMIT.windowMs < Date.now()) a = { count: 0, first: Date.now() }
  a.count += 1
  await store.set(limiterKey(actor), JSON.stringify(a))
}
export const twoFactorClearFailures = (actor: string) => getStore().del(limiterKey(actor))

