/* 2FA tests: RFC 6238 vectors, QR encoder, encryption at rest, and the REAL handlers (enrol → login → recovery → disable) on the file store. */
import assert from "node:assert/strict"
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { hashPassword, verifyPassword, totpAt, generateTotpSecret, base32Encode, totpUri, verifyTotpStep, createSessionCookie } from "@/lib/server/auth"
import { decryptSecret, encryptSecret, generateRecoveryCodes, looksLikeRecovery } from "@/lib/server/twofa"
import { authConfigHandler, loginHandler, twoFactorActionHandler, twoFactorStatusHandler } from "@/lib/server/handlers"
import { resetStoreForTests } from "@/lib/server/store"
import { qrMatrix } from "@/lib/qr"

delete process.env.VERCEL; delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN; delete process.env.ADMIN_TOTP_SECRET
const DATA = mkdtempSync(path.join(tmpdir(), "portfolio-2fa-"))
process.env.DATA_DIR = DATA
const SECRET_A = "a".repeat(48) + "-session-secret-A", SECRET_B = "b".repeat(48) + "-session-secret-B"
process.env.SESSION_SECRET = SECRET_A
const PASSWORD = "correct horse battery staple"

let passed = 0
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok   ${name}`) } catch (e) { console.error(`  FAIL ${name}\n       ${(e as Error).message}`); process.exitCode = 1 }
}

let ip = 1
const baseUrl = "https://site.test"
const cookieOf = () => createSessionCookie(new Request(baseUrl), { sub: "admin", method: "password" }).split(";")[0]
const req = (route: string, method: string, body?: unknown, opts: { cookie?: string | null; headers?: Record<string, string> } = {}) => new Request(baseUrl + route, {
  method, body: body === undefined ? undefined : JSON.stringify(body),
  headers: { host: "site.test", origin: baseUrl, "x-requested-with": "admin", "content-type": "application/json", "x-forwarded-for": `10.9.0.${ip++}`, ...(opts.cookie === null ? {} : { cookie: opts.cookie ?? cookieOf() }), ...opts.headers },
})
const act = async (body: unknown, opts = {}) => { const r = await twoFactorActionHandler(req("/api/admin/2fa", "POST", body, opts)); return { status: r.status, body: (await r.json()) as Record<string, any> } }
const login = async (body: unknown) => { const r = await loginHandler(req("/api/admin/login", "POST", body, { cookie: null })); return { status: r.status, body: (await r.json()) as Record<string, any>, setCookie: r.headers.get("set-cookie") } }
const status = async () => ((await (await twoFactorStatusHandler(req("/api/admin/2fa", "GET"))).json()) as Record<string, any>)
const config = async () => ((await (await authConfigHandler()).json()) as Record<string, any>)
/** Run fn with Date.now() shifted by `seconds` (a TOTP step is 30 s). */
async function atOffset<T>(seconds: number, fn: () => Promise<T>): Promise<T> { const real = Date.now; Date.now = () => real() + seconds * 1000; try { return await fn() } finally { Date.now = real } }
const stepNow = () => Math.floor(Date.now() / 30000)
const storeText = () => readdirSync(DATA).map((f) => readFileSync(path.join(DATA, f), "utf8")).join("\n")

async function main() {
  process.env.ADMIN_PASSWORD_HASH = await hashPassword(PASSWORD)

  console.log("password hash formats")
  await test("verifyPassword accepts the colon format (no $), the old $ format, quotes and stray backslashes; rejects wrong passwords and garbage", async () => {
    const dollar = await hashPassword("a-long-test-password"), colon = dollar.replace(/\$/g, ":")
    assert.ok(!colon.includes("$")); assert.equal(await verifyPassword("a-long-test-password", colon), true); assert.equal(await verifyPassword("a-long-test-password", dollar), true)
    assert.equal(await verifyPassword("a-long-test-password", `'${dollar}'`), true); assert.equal(await verifyPassword("a-long-test-password", dollar.replace(/\$/g, "\\$")), true)
    assert.equal(await verifyPassword("wrong-password-here", colon), false)
    for (const junk of ["", "scrypt", "scrypt:1:2", "bcrypt:16384:8:1:aa:bb", "scrypt:16384:8:1:", "scrypt::::"]) assert.equal(await verifyPassword("a-long-test-password", junk), false)
  })

  console.log("TOTP primitives")
  await test("RFC 6238 SHA-1 test vectors (6-digit tails)", () => {
    const secret = base32Encode(Buffer.from("12345678901234567890"))
    for (const [t, code] of [[59, "287082"], [1111111109, "081804"], [1111111111, "050471"], [1234567890, "005924"], [2000000000, "279037"]] as const) assert.equal(totpAt(secret, Math.floor(t / 30)), code)
  })
  await test("generated secret: 32 base32 chars, random; otpauth URI has issuer/account/secret", () => {
    const a = generateTotpSecret(), b = generateTotpSecret()
    assert.match(a, /^[A-Z2-7]{32}$/); assert.notEqual(a, b)
    const uri = totpUri(a, "admin", "Portfolio Admin"); assert.ok(uri.startsWith("otpauth://totp/Portfolio%20Admin:admin?secret=" + a)); assert.ok(uri.includes("issuer=Portfolio%20Admin"))
  })
  await test("verifyTotpStep: ±1 step accepted, ±2 rejected, non-digits rejected", () => {
    const s = generateTotpSecret(), now = 1_700_000_000_000, c = Math.floor(now / 30000)
    assert.equal(verifyTotpStep(s, totpAt(s, c), now), c); assert.equal(verifyTotpStep(s, totpAt(s, c - 1), now), c - 1); assert.equal(verifyTotpStep(s, totpAt(s, c + 1), now), c + 1)
    assert.equal(verifyTotpStep(s, totpAt(s, c + 2), now), null); assert.equal(verifyTotpStep(s, "12345", now), null); assert.equal(verifyTotpStep(s, "abcdef", now), null)
  })

  console.log("QR encoder")
  await test("size = 17 + 4·version and finder patterns are in place", () => {
    for (const [len, size] of [[5, 21], [40, 29], [137, 49], [200, 57]] as const) {
      const m = qrMatrix("x".repeat(len)); assert.equal(m.length, size)
      for (const [x0, y0] of [[0, 0], [size - 7, 0], [0, size - 7]]) { assert.ok(m[y0][x0] && m[y0 + 6][x0 + 6] && m[y0 + 3][x0 + 3]); assert.ok(!m[y0 + 1][x0 + 1] && !m[y0 + 5][x0 + 5]) }
    }
  })
  await test("rejects text too long instead of drawing a broken code", () => assert.throws(() => qrMatrix("x".repeat(400))))

  console.log("secrets at rest")
  await test("encrypt/decrypt round-trip; ciphertext differs each time and hides the secret", () => {
    const s = generateTotpSecret(), a = encryptSecret(s), b = encryptSecret(s)
    assert.equal(decryptSecret(a), s); assert.notEqual(a, b); assert.ok(!a.includes(s))
  })
  await test("tampered ciphertext or a different SESSION_SECRET fails closed (throws, never returns garbage)", () => {
    const blob = encryptSecret("JBSWY3DPEHPK3PXP"); const parts = blob.split("."); parts[3] = parts[3].slice(0, -2) + (parts[3].endsWith("AA") ? "BB" : "AA")
    assert.throws(() => decryptSecret(parts.join(".")))
    process.env.SESSION_SECRET = SECRET_B; try { assert.throws(() => decryptSecret(blob)) } finally { process.env.SESSION_SECRET = SECRET_A }
  })
  await test("recovery codes: 10, unique, XXXXX-XXXXX, no ambiguous characters", () => {
    const codes = generateRecoveryCodes(); assert.equal(codes.length, 10); assert.equal(new Set(codes).size, 10)
    for (const c of codes) { assert.match(c, /^[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}$/); assert.ok(looksLikeRecovery(c.toLowerCase())) }
    assert.ok(!looksLikeRecovery("123456"))
  })

  console.log("handlers: guards")
  await test("status needs a session; management POST needs session + same-origin header", async () => {
    assert.equal((await twoFactorStatusHandler(req("/api/admin/2fa", "GET", undefined, { cookie: null }))).status, 401)
    assert.equal((await twoFactorActionHandler(req("/api/admin/2fa", "POST", { action: "start", password: PASSWORD }, { cookie: null }))).status, 401)
    assert.equal((await twoFactorActionHandler(req("/api/admin/2fa", "POST", { action: "start", password: PASSWORD }, { headers: { origin: "https://evil.test" } }))).status, 403)
    assert.equal((await twoFactorActionHandler(req("/api/admin/2fa", "POST", { action: "start", password: PASSWORD }, { headers: { "x-requested-with": "" } }))).status, 403)
  })

  console.log("handlers: enrolment")
  let secret = "", codes: string[] = []
  await test("before enrolment: login with password only works, config says totp=false", async () => {
    assert.equal((await config()).totp, false)
    const r = await login({ password: PASSWORD }); assert.equal(r.status, 200); assert.ok(r.setCookie)
    assert.deepEqual(await status(), { enabled: false, source: null, recoveryRemaining: 0, enabledAt: null, passwordRequired: true })
  })
  await test("start: wrong password refused; right password gives secret + otpauth URI + QR rows", async () => {
    const bad = await act({ action: "start", password: "nope" }); assert.equal(bad.status, 400); assert.equal(bad.body.error, "invalid-password")
    const ok = await act({ action: "start", password: PASSWORD }); assert.equal(ok.status, 200)
    secret = ok.body.secret; assert.match(secret, /^[A-Z2-7]{32}$/)
    assert.equal(ok.body.uri, totpUri(secret, "admin", "Portfolio Admin"))
    assert.ok(Array.isArray(ok.body.qr) && ok.body.qr.length >= 21 && ok.body.qr.every((r: string) => /^[01]+$/.test(r) && r.length === ok.body.qr.length))
  })
  await test("pending secret is stored encrypted, and 2FA is NOT active yet", async () => {
    assert.ok(!storeText().includes(secret)); assert.equal((await config()).totp, false); assert.equal((await login({ password: PASSWORD })).status, 200)
  })
  await test("confirm: wrong code refused (still off); correct code turns it on and returns 10 recovery codes once", async () => {
    const wrong = await act({ action: "confirm", code: "000000" }); assert.equal(wrong.status, 400); assert.equal(wrong.body.error, "invalid-code")
    assert.equal((await status()).enabled, false)
    const ok = await act({ action: "confirm", code: totpAt(secret, stepNow()) }); assert.equal(ok.status, 200)
    codes = ok.body.recoveryCodes; assert.equal(codes.length, 10)
    const s = await status(); assert.equal(s.enabled, true); assert.equal(s.source, "app"); assert.equal(s.recoveryRemaining, 10)
  })
  await test("nothing sensitive in plain text on disk (secret, recovery codes)", () => {
    const text = storeText(); assert.ok(!text.includes(secret)); for (const c of codes) assert.ok(!text.includes(c) && !text.includes(c.replace("-", "")))
  })
  await test("enrolling again while on → 409; config now reports totp=true", async () => {
    const r = await act({ action: "start", password: PASSWORD }); assert.equal(r.status, 409); assert.equal(r.body.error, "already-enabled")
    assert.equal((await config()).totp, true)
  })

  console.log("handlers: login with 2FA")
  await test("password alone, wrong password + right code, and wrong code are all refused with the SAME message", async () => {
    const a = await login({ password: PASSWORD }), b = await login({ password: "wrong password!!", totp: totpAt(secret, stepNow() + 1) }), c = await login({ password: PASSWORD, totp: "123456" })
    for (const r of [a, b, c]) { assert.equal(r.status, 401); assert.equal(r.body.message, "Invalid credentials."); assert.equal(r.setCookie, null) }
  })
  await test("password + valid code signs in; the same code cannot be reused (replay)", async () => {
    const code = totpAt(secret, stepNow() + 1) // confirm consumed the current step; the next one is within the ±1 window
    const ok = await login({ password: PASSWORD, totp: code }); assert.equal(ok.status, 200); assert.ok(ok.setCookie)
    const again = await login({ password: PASSWORD, totp: code }); assert.equal(again.status, 401)
  })
  await test("a code that is only 'valid' for an already-used step is refused (older code replay)", async () => {
    const old = totpAt(secret, stepNow()); assert.equal((await login({ password: PASSWORD, totp: old })).status, 401)
  })
  await test("a valid code after the clock moves on works again", async () => {
    const r = await atOffset(120, async () => login({ password: PASSWORD, totp: totpAt(secret, stepNow()) })); assert.equal(r.status, 200)
  })
  await test("recovery code signs in once (case/dash-insensitive), count drops, reuse refused", async () => {
    const r = await login({ password: PASSWORD, totp: codes[0].toLowerCase().replace("-", " ") }); assert.equal(r.status, 200); assert.equal(r.body.recoveryRemaining, 9)
    assert.equal((await login({ password: PASSWORD, totp: codes[0] })).status, 401); assert.equal((await status()).recoveryRemaining, 9)
  })
  await test("recovery code with a WRONG password is refused and not consumed", async () => {
    assert.equal((await login({ password: "wrong password!!", totp: codes[1] })).status, 401); assert.equal((await status()).recoveryRemaining, 9)
    assert.equal((await login({ password: PASSWORD, totp: codes[1] })).status, 200)
  })
  await test("junk in the code field never matches", async () => {
    for (const junk of ["", "      ", "ABCDE-FGHIJ", "1234567", "' OR 1=1 --", "A".repeat(500)]) assert.equal((await login({ password: PASSWORD, totp: junk })).status, 401)
  })

  console.log("handlers: recovery codes & disabling")
  await test("regenerate needs a valid code; old codes stop working, new ones work", async () => {
    assert.equal((await act({ action: "recovery", code: "000000" })).status, 400)
    const r = await atOffset(240, async () => act({ action: "recovery", code: totpAt(secret, stepNow()) })); assert.equal(r.status, 200)
    const fresh: string[] = r.body.recoveryCodes; assert.equal(fresh.length, 10)
    assert.equal((await login({ password: PASSWORD, totp: codes[2] })).status, 401); assert.equal((await login({ password: PASSWORD, totp: fresh[0] })).status, 200)
    codes = fresh
  })
  await test("management endpoints lock after 5 wrong codes (429) and a correct code is also refused while locked", async () => {
    const results: number[] = []
    for (let i = 0; i < 6; i++) results.push((await act({ action: "disable", code: "000000" })).status)
    assert.deepEqual(results, [400, 400, 400, 400, 400, 429])
    const r = await atOffset(360, async () => act({ action: "disable", code: totpAt(secret, stepNow()) })); assert.equal(r.status, 429)
  })
  await test("a different user is not locked by someone else's failures (limiter is per signed-in user)", async () => {
    const other = createSessionCookie(new Request(baseUrl), { sub: "someone@example.com", method: "google" }).split(";")[0]
    const r = await act({ action: "disable", code: "000000" }, { cookie: other }); assert.equal(r.status, 400)
  })
  await test("disable with a recovery code works → 2FA off, record gone, login by password again", async () => {
    // clear the lock the previous test created, as time would
    const files = readdirSync(DATA).filter((f) => readFileSync(path.join(DATA, f), "utf8").includes('"count"'))
    for (const f of files) writeFileSync(path.join(DATA, f), JSON.stringify({ count: 0, first: Date.now() }))
    const r = await act({ action: "disable", code: codes[3] }); assert.equal(r.status, 200)
    assert.equal((await status()).enabled, false); assert.equal((await config()).totp, false); assert.equal((await login({ password: PASSWORD })).status, 200)
    assert.equal((await act({ action: "disable", code: "123456" })).status, 409)
  })

  console.log("fail closed")
  await test("changing SESSION_SECRET after enrolment never lets a code-less login through", async () => {
    resetStoreForTests()
    const start = await act({ action: "start", password: PASSWORD }); secret = start.body.secret
    assert.equal((await act({ action: "confirm", code: totpAt(secret, stepNow()) })).status, 200)
    process.env.SESSION_SECRET = SECRET_B
    try {
      const r = await login({ password: PASSWORD, totp: totpAt(secret, stepNow() + 1) }); assert.notEqual(r.status, 200); assert.equal(r.setCookie, null)
      const none = await login({ password: PASSWORD }); assert.notEqual(none.status, 200)
    } finally { process.env.SESSION_SECRET = SECRET_A }
    assert.equal((await login({ password: PASSWORD, totp: totpAt(secret, stepNow() + 1) })).status, 200) // restored → works again
  })
  await test("a damaged stored record also fails closed", async () => {
    for (const f of readdirSync(DATA)) { const t = readFileSync(path.join(DATA, f), "utf8"); if (t.includes('"recovery"')) writeFileSync(path.join(DATA, f), "{not json") }
    const r = await login({ password: PASSWORD }); assert.notEqual(r.status, 200); assert.equal(r.setCookie, null)
  })

  console.log("environment-managed secret")
  await test("ADMIN_TOTP_SECRET wins: UI cannot enrol/disable, login needs the code, replay refused", async () => {
    // reset the damaged record so the env path is tested on its own
    for (const f of readdirSync(DATA)) writeFileSync(path.join(DATA, f), "{}")
    resetStoreForTests()
    const envSecret = generateTotpSecret(); process.env.ADMIN_TOTP_SECRET = envSecret
    try {
      const s = await status(); assert.equal(s.source, "env"); assert.equal(s.enabled, true)
      assert.equal((await act({ action: "start", password: PASSWORD })).body.error, "managed-by-env"); assert.equal((await act({ action: "disable", code: "000000" })).body.error, "managed-by-env")
      assert.equal((await login({ password: PASSWORD })).status, 401)
      const code = totpAt(envSecret, stepNow()); assert.equal((await login({ password: PASSWORD, totp: code })).status, 200); assert.equal((await login({ password: PASSWORD, totp: code })).status, 401)
    } finally { delete process.env.ADMIN_TOTP_SECRET }
  })

  console.log(`\n${passed} passed${process.exitCode ? " — with failures" : ""}`)
}
void main()
