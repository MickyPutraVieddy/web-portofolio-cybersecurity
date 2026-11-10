import { createHmac, randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto"
import { getStore } from "@/lib/server/store"

export const SESSION_TTL_SECONDS = 8 * 60 * 60

export class ConfigError extends Error {}

// ---- configuration -------------------------------------------------------------------
export function authConfig() {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
  return {
    secret: process.env.SESSION_SECRET || "",
    passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
    totpSecret: process.env.ADMIN_TOTP_SECRET || "",
    googleId: process.env.GOOGLE_CLIENT_ID || "",
    googleSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    adminEmails,
  }
}

export function publicAuthConfig() {
  const c = authConfig()
  return {
    password: !!c.passwordHash && c.secret.length >= 32,
    totp: !!c.totpSecret,
    google: !!c.googleId && !!c.googleSecret && c.adminEmails.length > 0 && c.secret.length >= 32,
  }
}

function secretOrThrow() {
  const { secret } = authConfig()
  if (secret.length < 32) throw new ConfigError("SESSION_SECRET must be set (32+ characters)")
  return secret
}

/** Purpose-bound key derived from SESSION_SECRET (used to encrypt the enrolled 2FA secret and hash recovery codes). */
export function deriveKey(purpose: string): Buffer {
  return createHmac("sha256", secretOrThrow()).update(`derive:${purpose}`).digest()
}

// ---- signed tokens (sessions + oauth state) -----------------------------------------
const b64u = (value: Buffer | string) => Buffer.from(value).toString("base64url")

export function signToken(payload: object, ttlSeconds: number): string {
  const body = b64u(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }))
  const mac = createHmac("sha256", secretOrThrow()).update(body).digest()
  return `${body}.${b64u(mac)}`
}

export function verifyToken<T extends object>(token: string | undefined | null): (T & { exp: number }) | null {
  try {
    if (!token) return null
    const [body, mac] = token.split(".")
    if (!body || !mac) return null
    const expected = createHmac("sha256", secretOrThrow()).update(body).digest()
    const given = Buffer.from(mac, "base64url")
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & { exp: number }
    return payload.exp > Math.floor(Date.now() / 1000) ? payload : null
  } catch { return null }
}

// ---- cookies -------------------------------------------------------------------------
export function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https"
}
export const sessionCookieName = (secure: boolean) => (secure ? "__Host-admin_session" : "admin_session")

export function readCookie(request: Request, name: string): string | undefined {
  for (const part of (request.headers.get("cookie") || "").split(";")) {
    const index = part.indexOf("=")
    if (index > 0 && part.slice(0, index).trim() === name) return decodeURIComponent(part.slice(index + 1).trim())
  }
  return undefined
}

export function buildCookie(name: string, value: string, options: { secure: boolean; maxAge: number; path?: string }) {
  return [`${name}=${encodeURIComponent(value)}`, `Path=${options.path ?? "/"}`, `Max-Age=${options.maxAge}`, "HttpOnly", "SameSite=Lax", options.secure ? "Secure" : ""].filter(Boolean).join("; ")
}

export interface Session { sub: string; method: "password" | "google" | "passkey" | "recovery" }

/** `iat` (issued-at, seconds) lets sensitive actions demand a recent sign-in. */
export function getSession(request: Request): (Session & { exp: number; iat?: number }) | null {
  const token = readCookie(request, sessionCookieName(isSecureRequest(request)))
  const session = verifyToken<Session & { iat?: number }>(token)
  return session && typeof session.sub === "string" ? session : null
}

export function createSessionCookie(request: Request, session: Session, ttlSeconds = SESSION_TTL_SECONDS): string {
  const secure = isSecureRequest(request)
  return buildCookie(sessionCookieName(secure), signToken({ ...session, iat: Math.floor(Date.now() / 1000) }, ttlSeconds), { secure, maxAge: ttlSeconds })
}
export function clearSessionCookie(request: Request): string {
  const secure = isSecureRequest(request)
  return buildCookie(sessionCookieName(secure), "", { secure, maxAge: 0 })
}

// ---- request guards ------------------------------------------------------------------
/** Mutating requests must come from this site and carry our custom header (CSRF defence in depth). */
export function sameOriginMutation(request: Request): boolean {
  const origin = request.headers.get("origin")
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host")
  if (!origin || !host) return false
  try { if (new URL(origin).host !== host) return false } catch { return false }
  return request.headers.get("x-requested-with") === "admin"
}

export function clientIp(request: Request): string {
  return (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown"
}

// ---- password (scrypt) ---------------------------------------------------------------
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 }

export function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  return new Promise((resolve, reject) =>
    scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p }, (error, key) =>
      error ? reject(error) : resolve(`scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64")}$${key.toString("base64")}`)))
}

export function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const [scheme, n, r, p, saltB64, hashB64] = stored.trim().replace(/^['"]|['"]$/g, "").replace(/\\/g, "").split(/[$:]/)
      if (scheme !== "scrypt") return resolve(false)
      const expected = Buffer.from(hashB64, "base64")
      scrypt(password, Buffer.from(saltB64, "base64"), expected.length, { N: +n, r: +r, p: +p }, (error, key) =>
        resolve(!error && key.length === expected.length && timingSafeEqual(key, expected)))
    } catch { resolve(false) }
  })
}

// ---- TOTP (RFC 6238, Google Authenticator compatible) --------------------------------
function base32Decode(input: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let bits = ""
  for (const char of input.replace(/=+$/, "").replace(/\s/g, "").toUpperCase()) {
    const value = alphabet.indexOf(char)
    if (value < 0) throw new ConfigError("ADMIN_TOTP_SECRET is not valid base32")
    bits += value.toString(2).padStart(5, "0")
  }
  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2))
  return Buffer.from(bytes)
}

export function totpAt(secret: string, counter: number): string {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64BE(BigInt(counter))
  const hmac = createHmac("sha1", base32Decode(secret)).update(buffer).digest()
  const offset = hmac[hmac.length - 1] & 0x0f
  const code = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3]
  return String(code % 1_000_000).padStart(6, "0")
}

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
export function base32Encode(bytes: Buffer): string {
  let bits = "", out = ""
  for (const byte of bytes) bits += byte.toString(2).padStart(8, "0")
  for (let i = 0; i < bits.length; i += 5) out += BASE32[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)]
  return out
}
/** 160-bit secret (the RFC 4226 recommendation), base32 — what authenticator apps expect. */
export function generateTotpSecret(): string { return base32Encode(randomBytes(20)) }

/** otpauth:// URI that Google Authenticator, Authy, 1Password … import by QR code. */
export function totpUri(secret: string, account: string, issuer: string): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`
}

/** Returns the 30-second time step the code matched (±1 step of clock drift), or null. */
export function verifyTotpStep(secret: string, code: string, now = Date.now()): number | null {
  if (!/^\d{6}$/.test(code)) return null
  const counter = Math.floor(now / 30000)
  let matched: number | null = null
  for (const drift of [-1, 0, 1]) {
    const expected = Buffer.from(totpAt(secret, counter + drift))
    if (timingSafeEqual(expected, Buffer.from(code))) matched = counter + drift // no early exit: constant work
  }
  return matched
}

export function verifyTotp(secret: string, code: string, now = Date.now()): boolean {
  return verifyTotpStep(secret, code, now) !== null
}

// ---- brute-force protection ----------------------------------------------------------
const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000

interface Attempts { count: number; first: number }
const limiterKey = (ip: string) => `rl:login:${createHash("sha256").update(ip).digest("hex").slice(0, 24)}`

export async function loginBlockedFor(ip: string): Promise<number> {
  try {
    const raw = await getStore().get(limiterKey(ip))
    if (!raw) return 0
    const attempts = JSON.parse(raw) as Attempts
    const remaining = attempts.first + WINDOW_MS - Date.now()
    return attempts.count >= MAX_FAILURES && remaining > 0 ? Math.ceil(remaining / 1000) : 0
  } catch { return 0 }
}
export async function recordLoginFailure(ip: string) {
  try {
    const store = getStore()
    const raw = await store.get(limiterKey(ip))
    let attempts: Attempts = raw ? JSON.parse(raw) : { count: 0, first: Date.now() }
    if (attempts.first + WINDOW_MS < Date.now()) attempts = { count: 0, first: Date.now() }
    attempts.count += 1
    await store.set(limiterKey(ip), JSON.stringify(attempts))
  } catch { /* best effort */ }
}
export async function clearLoginFailures(ip: string) {
  try { await getStore().del(limiterKey(ip)) } catch { /* best effort */ }
}
