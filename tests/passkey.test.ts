/* Passkey tests: the app's REAL handlers + file store, with the WebAuthn crypto replaced by a test double (tests/helpers/webauthn-fake.ts)
   and a software authenticator. */
import assert from "node:assert/strict"
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { createSessionCookie, hashPassword, verifyToken } from "@/lib/server/auth"
import { authConfigHandler, loginHandler, logoutHandler, sessionHandler } from "@/lib/server/handlers"
import { googleCallbackHandler, googleStartHandler } from "@/lib/server/handlers"
import { passkeyActionHandler, passkeyLoginHandler, passkeyStatusHandler } from "@/lib/server/passkey-handlers"
import { setEngineForTests, webauthnConfig } from "@/lib/server/passkey"
import { getAudit } from "@/lib/server/content"
import { resetStoreForTests } from "@/lib/server/store"
import { FakeEngine, SoftAuthenticator } from "./helpers/webauthn-fake"
import { generateKeyPairSync } from "node:crypto"

delete process.env.VERCEL; delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN; delete process.env.ADMIN_TOTP_SECRET; delete process.env.SITE_URL
const DATA = mkdtempSync(path.join(tmpdir(), "portfolio-passkey-"))
process.env.DATA_DIR = DATA
process.env.SESSION_SECRET = "s".repeat(64)
const ORIGIN = "https://site.test"
process.env.WEBAUTHN_ORIGIN = ORIGIN
const PASSWORD = "correct horse battery staple"
const engine = new FakeEngine()
setEngineForTests(engine)

let passed = 0
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok   ${name}`) } catch (e) { console.error(`  FAIL ${name}\n       ${(e as Error).stack?.split("\n").slice(0, 3).join("\n       ")}`); process.exitCode = 1 }
}

// ---- a tiny "browser": cookie jar + request helper -----------------------------------------------------------------------------

function getSetCookie(headers: Headers): string[] {
  const nodeHeaders = headers as Headers & { getSetCookie?: () => string[] }
  if (typeof nodeHeaders.getSetCookie === "function") {
    return nodeHeaders.getSetCookie()
  }
  const combined = headers.get("set-cookie")
  return combined ? combined.split(/,\s*(?=[^;,\s]+=)/) : []
}

class Jar {
  cookies = new Map<string, string>()
  absorb(res: Response) { for (const c of getSetCookie(res.headers)) { const [pair, ...attrs] = c.split("; "); const i = pair.indexOf("="); const name = pair.slice(0, i); if (attrs.includes("Max-Age=0")) this.cookies.delete(name); else this.cookies.set(name, decodeURIComponent(pair.slice(i + 1))) } }
  header() { return [...this.cookies].map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("; ") }
  has(name: string) { return this.cookies.has(name) }
}
let ipN = 1
type Handler = (r: Request) => Promise<Response>
async function call(handler: Handler, route: string, method: string, body: unknown, jar: Jar, opts: { ip?: string; headers?: Record<string, string> } = {}) {
  const req = new Request(ORIGIN + route, { method, body: body === undefined ? undefined : JSON.stringify(body), headers: { host: "site.test", origin: ORIGIN, "x-requested-with": "admin", "content-type": "application/json", "x-forwarded-for": opts.ip ?? `10.7.0.${ipN++}`, cookie: jar.header(), ...opts.headers } })
  const res = await handler(req); jar.absorb(res)
  return { status: res.status, body: (await res.json()) as Record<string, any>, res }
}
const loginApi = (jar: Jar, body: unknown, ip?: string) => call(passkeyLoginHandler, "/api/admin/passkey/login", "POST", body, jar, { ip })
const manage = (jar: Jar, body: unknown) => call(passkeyActionHandler, "/api/admin/passkey", "POST", body, jar)
const status = (jar: Jar) => call(passkeyStatusHandler, "/api/admin/passkey", "GET", undefined, jar)
const passwordLogin = (jar: Jar, password = PASSWORD) => call(loginHandler, "/api/admin/login", "POST", { password }, jar)
const config = () => call(async () => authConfigHandler(), "/api/admin/config", "GET", undefined, new Jar())
const whoami = (jar: Jar) => call(sessionHandler, "/api/admin/session", "GET", undefined, jar)
async function atOffset<T>(seconds: number, fn: () => Promise<T>): Promise<T> { const real = Date.now; Date.now = () => real() + seconds * 1000; try { return await fn() } finally { Date.now = real } }
/** An admin signed in with the password (the pre-passkey state). `ageSeconds` backdates the sign-in. */
async function adminJar(ageSeconds = 0, method: "password" | "passkey" | "recovery" = "password") {
  const jar = new Jar(); const cookie = await atOffset(-ageSeconds, async () => createSessionCookie(new Request(ORIGIN), { sub: "admin", method }))
  jar.cookies.set("__Host-admin_session", decodeURIComponent(cookie.split(";")[0].split("=").slice(1).join("="))); return jar
}
const storeText = () => readdirSync(DATA).map((f) => readFileSync(path.join(DATA, f), "utf8")).join("\n")
const resetAll = () => { for (const f of readdirSync(DATA)) rmSync(path.join(DATA, f)); resetStoreForTests() }

/** Registers `auth` as a passkey through the real endpoints. */
async function enrol(jar: Jar, auth: SoftAuthenticator, name?: string) {
  const o = await manage(jar, { action: "register-options" }); assert.equal(o.status, 200)
  return manage(jar, { action: "register-verify", response: auth.create(o.body, ORIGIN), name })
}
/** Signs in with `auth` through the real endpoints; returns the login response and the browser jar. */
async function passkeyLogin(auth: SoftAuthenticator, tamper = {}, jar = new Jar()) {
  const o = await loginApi(jar, { action: "options" }); assert.equal(o.status, 200)
  const r = await loginApi(jar, { action: "verify", response: auth.get(o.body, ORIGIN, tamper) })
  return { ...r, jar }
}

async function main() {
  process.env.ADMIN_PASSWORD_HASH = await hashPassword(PASSWORD)

  console.log("relying-party configuration")
  await test("origin and RP ID come from the server (WEBAUTHN_ORIGIN / SITE_URL), never from the request", () => {
    const cfg = webauthnConfig(new Request("https://evil.test/", { headers: { host: "evil.test" } }))
    assert.equal(cfg.origin, ORIGIN); assert.equal(cfg.rpID, "site.test")
  })
  await test("plain http (non-localhost), invalid origins and an unrelated RP ID are refused", () => {
    const saved = { ...process.env }
    try {
      process.env.WEBAUTHN_ORIGIN = "http://site.test"; assert.throws(() => webauthnConfig(new Request(ORIGIN)))
      process.env.WEBAUTHN_ORIGIN = "http://localhost:3000"; assert.equal(webauthnConfig(new Request(ORIGIN)).rpID, "localhost")
      process.env.WEBAUTHN_ORIGIN = ORIGIN; process.env.WEBAUTHN_RP_ID = "other.test"; assert.throws(() => webauthnConfig(new Request(ORIGIN)))
      process.env.WEBAUTHN_RP_ID = "test"; assert.equal(webauthnConfig(new Request(ORIGIN)).rpID, "test")
      delete process.env.WEBAUTHN_RP_ID; delete process.env.WEBAUTHN_ORIGIN; (process.env as Record<string, string>).NODE_ENV = "production"; assert.throws(() => webauthnConfig(new Request(ORIGIN)), /SITE_URL/)
    } finally { process.env.WEBAUTHN_ORIGIN = ORIGIN; delete process.env.WEBAUTHN_RP_ID; if (saved.NODE_ENV === undefined) delete (process.env as Record<string, string | undefined>).NODE_ENV; else (process.env as Record<string, string>).NODE_ENV = saved.NODE_ENV }
  })

  console.log("guards")
  await test("status needs a session; management and login POSTs need same-origin + custom header", async () => {
    assert.equal((await status(new Jar())).status, 401)
    assert.equal((await manage(new Jar(), { action: "register-options" })).status, 401)
    const jar = await adminJar()
    assert.equal((await call(passkeyActionHandler, "/api/admin/passkey", "POST", { action: "register-options" }, jar, { headers: { origin: "https://evil.test" } })).status, 403)
    assert.equal((await call(passkeyActionHandler, "/api/admin/passkey", "POST", { action: "register-options" }, jar, { headers: { "x-requested-with": "" } })).status, 403)
    assert.equal((await call(passkeyLoginHandler, "/api/admin/passkey/login", "POST", { action: "options" }, new Jar(), { headers: { origin: "https://evil.test" } })).status, 403)
  })
  await test("changing sign-in methods needs a sign-in from the last 15 minutes (step-up)", async () => {
    const old = await adminJar(16 * 60)
    for (const action of ["register-options", "recovery-codes", "policy", "remove"]) { const r = await manage(old, { action, id: "x", enabled: true }); assert.equal(r.status, 403, action); assert.equal(r.body.error, "reauth") }
    assert.equal((await status(old)).status, 200)
  })

  console.log("enrolment")
  const jar = await adminJar()
  let laptop = new SoftAuthenticator("laptop"); const phone = new SoftAuthenticator("phone")
  await test("before any passkey: login page config says count 0; no passkey login possible; password login works", async () => {
    const c = await config(); assert.deepEqual(c.body.passkey, { count: 0, passwordlessOnly: false })
    assert.equal((await loginApi(new Jar(), { action: "options" })).status, 409)
    assert.equal((await passwordLogin(new Jar())).status, 200)
  })
  await test("register-options: RP/user from the server, discoverable + user-verification required, ceremony cookie is HttpOnly", async () => {
    const r = await manage(jar, { action: "register-options" }); assert.equal(r.status, 200)
    assert.equal(r.body.rp.id, "site.test"); assert.equal(r.body.authenticatorSelection.userVerification, "required"); assert.equal(r.body.authenticatorSelection.residentKey, "required"); assert.equal(r.body.attestation, "none")
    const input = engine.calls.registrationOptions.at(-1)!; assert.equal(input.rpID, "site.test"); assert.equal(input.userID.length, 32); assert.deepEqual(input.excludeIds, [])
    const cookie = getSetCookie(r.res.headers).find((c) => c.startsWith("__Host-admin_pk="))!; assert.ok(cookie && cookie.includes("HttpOnly") && cookie.includes("Secure"))
  })
  await test("register-verify stores the passkey (public key only); nothing active yet: still 'untested', policy untouched", async () => {
    const r = await enrol(jar, laptop, "MacBook Touch ID"); assert.equal(r.status, 200); assert.equal(r.body.passkey.name, "MacBook Touch ID")
    const s = (await status(jar)).body; assert.equal(s.passkeys.length, 1); assert.deepEqual(s.requirements, { hasPasskey: true, tested: false, hasRecovery: false }); assert.equal(s.passwordlessOnly, false)
    assert.ok(!("publicKey" in s.passkeys[0]) && !JSON.stringify(s).includes("counter"))
  })
  await test("the stable WebAuthn user handle sent at registration is the one stored and later expected", async () => {
    const input = engine.calls.registrationOptions.at(-1)!; const stored = JSON.parse(readdirSync(DATA).map((f) => readFileSync(path.join(DATA, f), "utf8")).find((t) => t.includes('"userHandle"'))!)
    assert.equal(Buffer.from(input.userID).toString("base64url"), stored.userHandle)
  })
  await test("registration replay: the same response cannot be submitted twice (challenge is single-use)", async () => {
    const j = await adminJar(); const o = await manage(j, { action: "register-options" }); const resp = new SoftAuthenticator().create(o.body, ORIGIN)
    assert.equal((await manage(j, { action: "register-verify", response: resp })).status, 200)
    j.cookies.set("__Host-admin_pk", "x"); assert.equal((await manage(j, { action: "register-verify", response: resp })).status, 400)
    await manage(await adminJar(), { action: "noop" })
    // clean that extra passkey away so later counts are predictable
    const s = (await status(jar)).body; const extra = s.passkeys.find((p: any) => p.name.startsWith("Passkey")); assert.equal((await manage(jar, { action: "remove", id: extra.id })).status, 200)
  })
  await test("registration with a wrong origin / wrong RP ID / no user verification is refused and stores nothing", async () => {
    const before = (await status(jar)).body.passkeys.length
    for (const tamper of [{ origin: "https://evil.test" }, { rpId: "evil.test" }, { uv: false }, { challenge: "AAAA" }]) {
      const o = await manage(jar, { action: "register-options" }); const r = await manage(jar, { action: "register-verify", response: new SoftAuthenticator().create(o.body, ORIGIN, tamper) })
      assert.equal(r.status, 400, JSON.stringify(tamper))
    }
    assert.equal((await status(jar)).body.passkeys.length, before)
  })
  await test("a registered authenticator is excluded from re-registration (server sends excludeCredentials)", async () => {
    const o = await manage(jar, { action: "register-options" }); assert.equal(o.body.excludeCredentials.length, 1)
    assert.throws(() => laptop.create(o.body, ORIGIN), /already registered/)
  })
  await test("second device (backup passkey) registers; names are cleaned; at most 10 passkeys", async () => {
    const r = await enrol(jar, phone, "  iPhone\n Face ID  "); assert.equal(r.status, 200); assert.equal(r.body.passkey.name, "iPhone Face ID")
    assert.equal((await status(jar)).body.passkeys.length, 2)
    for (let i = 0; i < 8; i++) assert.equal((await enrol(jar, new SoftAuthenticator(), `extra ${i}`)).status, 200)
    const o = await manage(jar, { action: "register-options" }); assert.equal(o.status, 409); assert.equal(o.body.error, "limit")
    for (const p of (await status(jar)).body.passkeys.filter((p: any) => p.name.startsWith("extra"))) assert.equal((await manage(jar, { action: "remove", id: p.id })).status, 200)
    assert.equal((await status(jar)).body.passkeys.length, 2)
  })

  console.log("sign-in")
  await test("passkey sign-in: session cookie (method passkey), HttpOnly, lastUsedAt set; ceremony cookie cleared", async () => {
    const r = await passkeyLogin(laptop); assert.equal(r.status, 200)
    const cookie = getSetCookie(r.res.headers).find((c) => c.startsWith("__Host-admin_session="))!; assert.ok(cookie.includes("HttpOnly") && cookie.includes("Secure"))
    assert.equal((await whoami(r.jar)).body.method, "passkey"); assert.equal(r.jar.has("__Host-admin_pk"), false)
    const s = (await status(r.jar)).body; assert.ok(s.passkeys.some((p: any) => p.lastUsedAt)); assert.equal(s.requirements.tested, true)
  })
  await test("device two (phone) signs in too; sign-in options use the server RP ID and require user verification", async () => {
    const r = await passkeyLogin(phone); assert.equal(r.status, 200)
    const input = engine.calls.authenticationOptions.at(-1)!; assert.equal(input.rpID, "site.test")
    const o = await loginApi(new Jar(), { action: "options" }); assert.equal(o.body.userVerification, "required")
  })
  await test("'use a passkey from another device' asks the browser for the hybrid (QR) flow; plain sign-in does not", async () => {
    assert.deepEqual((await loginApi(new Jar(), { action: "options", crossDevice: true })).body.hints, ["hybrid"])
    assert.equal((await loginApi(new Jar(), { action: "options" })).body.hints, undefined)
  })
  await test("logout clears the session; the cookie no longer works", async () => {
    const r = await passkeyLogin(laptop); assert.equal((await status(r.jar)).status, 200)
    const out = await call(logoutHandler, "/api/admin/logout", "POST", {}, r.jar); assert.equal(out.status, 200); assert.equal(r.jar.has("__Host-admin_session"), false)
    assert.equal((await status(r.jar)).status, 401)
  })

  console.log("attacks")
  await test("replay: a captured assertion + its ceremony cookie cannot be used again", async () => {
    const j = new Jar(); const o = await loginApi(j, { action: "options" }); const resp = laptop.get(o.body, ORIGIN)
    const saved = j.header()
    assert.equal((await loginApi(j, { action: "verify", response: resp })).status, 200)
    const replay = new Jar(); for (const part of saved.split("; ")) { const i = part.indexOf("="); replay.cookies.set(part.slice(0, i), decodeURIComponent(part.slice(i + 1))) }
    assert.equal((await loginApi(replay, { action: "verify", response: resp })).status, 401)
  })
  await test("two simultaneous verifications of ONE challenge: exactly one wins (atomic claim)", async () => {
    const j = new Jar(); const o = await loginApi(j, { action: "options" }); const resp = laptop.get(o.body, ORIGIN)
    const results = await Promise.all([0, 1, 2, 3].map(() => { const copy = new Jar(); copy.cookies = new Map(j.cookies); return loginApi(copy, { action: "verify", response: resp }) }))
    assert.equal(results.filter((r) => r.status === 200).length, 1)
  })
  await test("invalid challenge: assertion over a different challenge, tampered challenge, no ceremony cookie → 401, no session", async () => {
    const j = new Jar(); const o = await loginApi(j, { action: "options" })
    const r = await loginApi(j, { action: "verify", response: laptop.get(o.body, ORIGIN, { challenge: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" }) }); assert.equal(r.status, 401); assert.equal(getSetCookie(r.res.headers).some((c) => c.includes("admin_session=") && !c.includes("Max-Age=0")), false)
    const o2 = await loginApi(new Jar(), { action: "options" }); assert.equal((await loginApi(new Jar(), { action: "verify", response: laptop.get(o2.body, ORIGIN) })).status, 401)
  })
  await test("a challenge is bound to the browser that asked: another browser's cookie cannot claim it", async () => {
    const a = new Jar(), b = new Jar(); const oa = await loginApi(a, { action: "options" }); await loginApi(b, { action: "options" })
    assert.equal((await loginApi(b, { action: "verify", response: laptop.get(oa.body, ORIGIN) })).status, 401)
  })
  await test("expired challenge (2-minute life) → 401", async () => {
    const j = new Jar(); const o = await loginApi(j, { action: "options" }); const resp = laptop.get(o.body, ORIGIN)
    assert.equal((await atOffset(125, () => loginApi(j, { action: "verify", response: resp }))).status, 401)
  })
  await test("a registration challenge cannot be spent on sign-in (purpose is checked)", async () => {
    const j = await adminJar(); const o = await manage(j, { action: "register-options" })
    j.cookies.delete("__Host-admin_session"); const fake = laptop.get({ challenge: o.body.challenge, rpId: "site.test" }, ORIGIN)
    assert.equal((await loginApi(j, { action: "verify", response: fake })).status, 401)
  })
  const evil = generateKeyPairSync("ec", { namedCurve: "P-256" }).privateKey
  for (const [label, tamper] of [["origin mismatch (phishing site)", { origin: "https://evil.test" }], ["RP ID mismatch", { rpId: "evil.test" }], ["no user verification (biometric/PIN skipped)", { uv: false }], ["signature from a different key", { signWith: evil }], ["unknown credential id", { id: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" }], ["user handle of another account", { userHandle: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" }]] as const)
    await test(`refused: ${label}`, async () => {
      const dev = tamper.rpId ? new SoftAuthenticator() : laptop
      if (tamper.rpId) dev.create({ ...engine.calls.registrationOptions.at(-1), rp: { id: "evil.test" }, user: { id: "x" }, challenge: "c", excludeCredentials: [] }, "https://evil.test", { rpId: "evil.test" })
      const r = await passkeyLogin(dev, tamper); assert.equal(r.status, 401); assert.equal(r.body.message, "Passkey sign-in failed."); assert.equal((await whoami(r.jar)).body.authenticated, false)
    })
  await test("cloned-authenticator defence: a counter that goes backwards is refused", async () => {
    await passkeyLogin(laptop); await passkeyLogin(laptop) // counter climbs
    assert.equal((await passkeyLogin(laptop, { counter: 1 })).status, 401)
    assert.equal((await passkeyLogin(laptop)).status, 200) // and the real device keeps working
  })
  await test("brute force: 5 failures from one address lock it (429) even for a correct passkey; other addresses are unaffected", async () => {
    const ip = "203.0.113.50"; const codes: number[] = []
    for (let i = 0; i < 5; i++) { const j = new Jar(); await loginApi(j, { action: "options" }, ip); codes.push((await loginApi(j, { action: "verify", response: { id: "nope" } }, ip)).status) }
    assert.deepEqual(codes, [401, 401, 401, 401, 401])
    const j = new Jar(); assert.equal((await loginApi(j, { action: "options" }, ip)).status, 429)
    assert.equal((await loginApi(new Jar(), { action: "options" }, "203.0.113.51")).status, 200)
  })

  console.log("recovery")
  const codesBox: { codes: string[] } = { codes: [] }
  await test("recovery codes: generated once (10), stored only as keyed hashes", async () => {
    const r = await manage(jar, { action: "recovery-codes" }); assert.equal(r.status, 200); codesBox.codes = r.body.recoveryCodes; assert.equal(codesBox.codes.length, 10)
    const text = storeText(); for (const c of codesBox.codes) assert.ok(!text.includes(c) && !text.includes(c.replace("-", "")))
    assert.equal((await status(jar)).body.recoveryRemaining, 10)
  })
  await test("recovery sign-in: works once (case/dash-insensitive), gives a SHORT 1-hour session, count drops, reuse refused", async () => {
    const j = new Jar(); const r = await loginApi(j, { action: "recovery", code: codesBox.codes[0].toLowerCase().replace("-", " ") }); assert.equal(r.status, 200); assert.equal(r.body.recoveryRemaining, 9)
    assert.equal((await whoami(j)).body.method, "recovery")
    const payload = verifyToken<{ iat: number }>(j.cookies.get("__Host-admin_session")); assert.ok(payload && payload.exp - payload.iat <= 3600)
    assert.equal((await loginApi(new Jar(), { action: "recovery", code: codesBox.codes[0] })).status, 401)
  })
  await test("wrong / malformed recovery codes are refused and consume nothing", async () => {
    for (const code of ["", "AAAAA-AAAAA", "123456", "' OR 1=1", "A".repeat(500)]) assert.equal((await loginApi(new Jar(), { action: "recovery", code })).status, 401)
    assert.equal((await status(jar)).body.recoveryRemaining, 9)
  })
  await test("a recovery session can register a replacement passkey (that is what it is for)", async () => {
    const j = new Jar(); await loginApi(j, { action: "recovery", code: codesBox.codes[1] })
    assert.equal((await enrol(j, new SoftAuthenticator(), "Replacement key")).status, 200)
    const s = (await status(j)).body; const extra = s.passkeys.find((p: any) => p.name === "Replacement key"); assert.equal((await manage(j, { action: "remove", id: extra.id })).status, 200)
  })

  console.log("passkey-only policy (migration)")
  await test("cannot switch passwords off until a passkey exists, has been used, and recovery codes exist", async () => {
    resetAll(); const j = await adminJar()
    assert.equal((await manage(j, { action: "policy", enabled: true })).body.error, "no-passkey")
    await enrol(j, laptop = new SoftAuthenticator("l"), "Laptop")
    assert.equal((await manage(j, { action: "policy", enabled: true })).body.error, "not-tested")
    await passkeyLogin(laptop)
    assert.equal((await manage(j, { action: "policy", enabled: true })).body.error, "no-recovery")
    await manage(j, { action: "recovery-codes" })
    assert.equal((await status(j)).body.passwordlessOnly, false); assert.equal((await passwordLogin(new Jar())).status, 200) // old method still works meanwhile
  })
  await test("'Test sign-in' inside the admin proves a passkey works without creating a new session", async () => {
    resetAll(); const j = await adminJar(); const dev = new SoftAuthenticator(); await enrol(j, dev, "Dev")
    const bad = await manage(j, { action: "test-options" }); assert.equal((await manage(j, { action: "test-verify", response: dev.get(bad.body, ORIGIN, { origin: "https://evil.test" }) })).status, 400)
    assert.equal((await status(j)).body.requirements.tested, false)
    const o = await manage(j, { action: "test-options" }); const r = await manage(j, { action: "test-verify", response: dev.get(o.body, ORIGIN) }); assert.equal(r.status, 200)
    assert.equal(getSetCookie(r.res.headers).some((c) => c.includes("admin_session=") && !c.includes("Max-Age=0")), false); assert.equal((await status(j)).body.requirements.tested, true)
    assert.ok((await getAudit()).some((e) => e.action === "passkey-tested"))
  })
  await test("with passkey-only ON: password login (even the right password) and config reflect it; passkey + recovery still work", async () => {
    resetAll(); const j = await adminJar(); const a = new SoftAuthenticator("a"), b = new SoftAuthenticator("b")
    await enrol(j, a, "A"); await enrol(j, b, "B"); await passkeyLogin(a); const codes = (await manage(j, { action: "recovery-codes" })).body.recoveryCodes
    assert.equal((await manage(j, { action: "policy", enabled: true })).status, 200)
    const pw = await passwordLogin(new Jar()); assert.equal(pw.status, 403); assert.equal(pw.body.error, "passwordless")
    assert.deepEqual((await config()).body.passkey, { count: 2, passwordlessOnly: true })
    assert.equal((await passkeyLogin(b)).status, 200)
    assert.equal((await passkeyLogin(b, { uv: false })).status, 401) // a failed attempt, for the audit test
    assert.equal((await loginApi(new Jar(), { action: "recovery", code: codes[0] })).status, 200)
    // last-passkey protection
    const ids = (await status(j)).body.passkeys.map((p: any) => p.id)
    assert.equal((await manage(j, { action: "remove", id: ids[0] })).status, 200); const last = await manage(j, { action: "remove", id: ids[1] }); assert.equal(last.status, 409); assert.equal(last.body.error, "last-passkey")
    // turning it off restores password login
    assert.equal((await manage(j, { action: "policy", enabled: false })).status, 200); assert.equal((await passwordLogin(new Jar())).status, 200)
  })
  await test("audit log records enrolment, sign-in, failures and policy changes (no secrets)", async () => {
    const log = (await getAudit()).map((e) => e.action + ":" + (e.detail ?? "")).join("\n")
    for (const needle of ["passkey-added", "login:passkey", "login-failed", "passwordless-on", "passwordless-off"]) assert.ok(log.includes(needle), needle)
    assert.ok(!/publicKey|[A-Za-z0-9_-]{40,}/.test(log))
  })

  await test("passkey-only also turns Google sign-in off: login page hides it, /google/start and /google/callback refuse (no redirect to Google, no session)", async () => {
    process.env.GOOGLE_CLIENT_ID = "id.apps.googleusercontent.com"; process.env.GOOGLE_CLIENT_SECRET = "secret"; process.env.ADMIN_EMAILS = "owner@example.com"
    try {
      resetAll(); const j = await adminJar(); const a = new SoftAuthenticator("g")
      await enrol(j, a, "A"); await passkeyLogin(a); await manage(j, { action: "recovery-codes" })
      assert.equal((await config()).body.google, true) // policy off: Google still offered
      const before = await googleStartHandler(new Request(ORIGIN + "/api/admin/google/start", { headers: { host: "site.test" } })); assert.match(before.headers.get("location") ?? "", /accounts\.google\.com/)
      assert.equal((await manage(j, { action: "policy", enabled: true })).status, 200)
      assert.equal((await config()).body.google, false)
      const start = await googleStartHandler(new Request(ORIGIN + "/api/admin/google/start", { headers: { host: "site.test" } }))
      assert.match(start.headers.get("location") ?? "", /error=google-passwordless/); assert.ok(!(start.headers.get("location") ?? "").includes("accounts.google.com"))
      const cb = await googleCallbackHandler(new Request(ORIGIN + "/api/admin/google/callback?code=x&state=y", { headers: { host: "site.test" } }))
      assert.match(cb.headers.get("location") ?? "", /error=google-passwordless/); assert.ok(!getSetCookie(cb.headers).some((c) => c.includes("admin_session=") && !c.includes("Max-Age=0")))
    } finally { delete process.env.GOOGLE_CLIENT_ID; delete process.env.GOOGLE_CLIENT_SECRET; delete process.env.ADMIN_EMAILS }
  })

  console.log("fail closed")
  await test("a damaged passkey record never opens a door: password login, passkey options and config all behave safely", async () => {
    for (const f of readdirSync(DATA)) { const t = readFileSync(path.join(DATA, f), "utf8"); if (t.includes('"userHandle"')) writeFileSync(path.join(DATA, f), "{not json") }
    resetStoreForTests()
    const pw = await passwordLogin(new Jar()); assert.notEqual(pw.status, 200); assert.equal(getSetCookie(pw.res.headers).length, 0)
    assert.notEqual((await loginApi(new Jar(), { action: "options" })).status, 200)
    assert.equal((await config()).status, 200)
  })

  console.log(`\n${passed} passed${process.exitCode ? " — with failures" : ""}`)
}
void main()
