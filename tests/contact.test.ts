// Contact form: shared validation, the server handler (provider mocked, no network) and the content schema.
//
import assert from "node:assert/strict"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { defaultContent, mergeContent } from "@/lib/site-content"
import { siteContentSchema, type SocialLink } from "@/lib/content-schema"
import { cleanContact, contactLimits, isValidEmail, readContactBody, validateContact, type ContactInput } from "@/lib/contact"
import { buildEmailText, contactConfig, handleContact } from "@/lib/server/contact"
import { getContent, saveContent, ValidationError } from "@/lib/server/content"
import { resetStoreForTests } from "@/lib/server/store"

delete process.env.VERCEL; delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN
for (const key of ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"]) delete process.env[key]
process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), "portfolio-contact-test-"))

let passed = 0
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok   ${name}`) } catch (e) { console.error(`  FAIL ${name}\n       ${(e as Error).message}`); process.exitCode = 1 }
}
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

const good: ContactInput = { name: "Ada Lovelace", email: "ada@example.com", subject: "Hello", message: "I would like to talk about a security project." }
const ENV = { RESEND_API_KEY: "re_test_SECRET_KEY_123", CONTACT_TO_EMAIL: "owner@site.test", CONTACT_FROM_EMAIL: "Portfolio <noreply@site.test>" }

interface Call { url: string; init: RequestInit }
function mockFetch(status = 200) {
  const calls: Call[] = []
  const fetchImpl = async (url: string, init: RequestInit) => { calls.push({ url, init }); return new Response("{}", { status }) }
  return { calls, fetchImpl }
}
let ipCounter = 0
/** Each request gets its own IP unless a test sets one, because the file store (and so the rate limiter) outlives resetStoreForTests(). */
const uniqueIp = () => `192.0.2.${++ipCounter}`
function req(body: unknown, over: { origin?: string | null; ip?: string; contentType?: string | null; raw?: string } = {}) {
  const headers: Record<string, string> = { host: "site.test", "x-forwarded-for": over.ip ?? uniqueIp() }
  if (over.origin !== null) headers.origin = over.origin ?? "https://site.test"
  if (over.contentType !== null) headers["content-type"] = over.contentType ?? "application/json"
  return new Request("https://site.test/api/contact", { method: "POST", headers, body: over.raw ?? JSON.stringify(body) })
}
const fresh = () => resetStoreForTests()

async function main() {
  console.log("validation")
  await test("a valid message has no errors; values are trimmed", () => {
    assert.deepEqual(validateContact(good), {})
    assert.deepEqual(cleanContact({ name: "  A ", email: " a@b.co ", subject: " S ", message: "  hello world!  " }), { name: "A", email: "a@b.co", subject: "S", message: "hello world!" })
  })
  await test("every field is required (whitespace-only counts as empty)", () => {
    assert.deepEqual(validateContact({ name: "  ", email: "", subject: " ", message: "" }), { name: "required", email: "required", subject: "required", message: "required" })
  })
  await test("length limits: name 100, subject 150, message 10..5000, email 254", () => {
    assert.equal(validateContact({ ...good, name: "x".repeat(101) }).name, "too-long")
    assert.equal(validateContact({ ...good, name: "x".repeat(100) }).name, undefined)
    assert.equal(validateContact({ ...good, subject: "x".repeat(151) }).subject, "too-long")
    assert.equal(validateContact({ ...good, message: "short" }).message, "too-short")
    assert.equal(validateContact({ ...good, message: "x".repeat(contactLimits.messageMax + 1) }).message, "too-long")
    assert.equal(validateContact({ ...good, message: "x".repeat(contactLimits.messageMax) }).message, undefined)
    assert.equal(validateContact({ ...good, email: "a".repeat(250) + "@b.co" }).email, "too-long")
  })
  await test("email format: bad addresses rejected, normal ones accepted", () => {
    for (const bad of ["a", "a@b", "a@b.", "@b.co", "a b@c.co", "a@b..co", "a@-b.co", "a@b.co>", "a@@b.co"]) assert.equal(isValidEmail(bad), false, bad)
    for (const ok of ["ada@example.com", "user+tag@example.co.id", "first.last@sub.domain.org"]) assert.equal(isValidEmail(ok), true, ok)
    assert.equal(validateContact({ ...good, email: "nope" }).email, "invalid-email")
  })
  await test("header injection: line breaks / control characters are rejected in single-line fields", () => {
    assert.equal(validateContact({ ...good, subject: "Hi\r\nBcc: victim@example.com" }).subject, "invalid-chars")
    assert.equal(validateContact({ ...good, name: "Ada\nLovelace" }).name, "invalid-chars")
    assert.equal(validateContact({ ...good, email: "a@b.co\r\nBcc: x@y.z" }).email, "invalid-chars")
    assert.equal(validateContact({ ...good, subject: "a\u2028b" }).subject, "invalid-chars")
  })
  await test("message keeps line breaks and tabs but rejects other control characters", () => {
    assert.equal(validateContact({ ...good, message: "line one\nline two\tindented, long enough" }).message, undefined)
    assert.equal(validateContact({ ...good, message: "has a null byte \u0000 inside it" }).message, "invalid-chars")
  })
  await test("readContactBody: non-objects are refused, non-string fields become empty", () => {
    assert.equal(readContactBody(null), null); assert.equal(readContactBody([]), null); assert.equal(readContactBody("x"), null)
    const body = readContactBody({ name: 5, email: {}, subject: null, message: ["x"], website: "bot" })!
    assert.deepEqual(body.values, { name: "", email: "", subject: "", message: "" }); assert.equal(body.honeypot, "bot")
  })

  console.log("server handler (provider mocked)")
  await test("a request from another origin, or with no Origin header, is refused (403) and nothing is sent", async () => {
    fresh(); const m = mockFetch()
    assert.equal((await handleContact(req(good, { origin: "https://evil.example" }), { env: ENV, fetchImpl: m.fetchImpl })).status, 403)
    assert.equal((await handleContact(req(good, { origin: null }), { env: ENV, fetchImpl: m.fetchImpl })).status, 403)
    assert.equal(m.calls.length, 0)
  })
  await test("wrong content type 415; malformed JSON 400; array body 400; oversized body 413", async () => {
    fresh(); const m = mockFetch(); const deps = { env: ENV, fetchImpl: m.fetchImpl }
    assert.equal((await handleContact(req(good, { contentType: "text/plain" }), deps)).status, 415)
    assert.equal((await handleContact(req(null, { raw: "{not json" }), deps)).status, 400)
    assert.equal((await handleContact(req([1, 2]), deps)).status, 400)
    assert.equal((await handleContact(req({ ...good, message: "x".repeat(20000) }), deps)).status, 413)
    assert.equal(m.calls.length, 0)
  })
  await test("invalid input is rejected on the server (422) with per-field codes; nothing is sent", async () => {
    fresh(); const m = mockFetch()
    const res = await handleContact(req({ ...good, email: "bad", message: "" }), { env: ENV, fetchImpl: m.fetchImpl })
    assert.equal(res.status, 422)
    const body = (await res.json()) as { error: string; fields: Record<string, string> }
    assert.equal(body.error, "validation"); assert.deepEqual(body.fields, { email: "invalid-email", message: "required" })
    assert.equal(m.calls.length, 0)
  })
  await test("not configured: 503 and NEVER ok:true (no fake success), nothing sent", async () => {
    fresh(); const m = mockFetch()
    for (const env of [{}, { RESEND_API_KEY: "k" }, { RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "a@b.co" }]) {
      const res = await handleContact(req(good), { env, fetchImpl: m.fetchImpl })
      assert.equal(res.status, 503); assert.deepEqual(await res.json(), { error: "not-configured" })
    }
    assert.equal(m.calls.length, 0); assert.equal(contactConfig({}), null)
  })
  await test("success: provider called once with server-side key, correct recipient and reply-to; key never returned to the browser", async () => {
    fresh(); const m = mockFetch(200)
    const res = await handleContact(req({ ...good, name: "  Ada  " }), { env: ENV, fetchImpl: m.fetchImpl })
    assert.equal(res.status, 200); const text = await res.text(); assert.deepEqual(JSON.parse(text), { ok: true })
    assert.ok(!text.includes("SECRET_KEY")); assert.equal(res.headers.get("cache-control"), "no-store")
    assert.equal(m.calls.length, 1); assert.equal(m.calls[0].url, "https://api.resend.com/emails")
    const headers = m.calls[0].init.headers as Record<string, string>
    assert.equal(headers.Authorization, "Bearer re_test_SECRET_KEY_123")
    const sent = JSON.parse(String(m.calls[0].init.body)) as Record<string, unknown>
    assert.deepEqual(sent.to, ["owner@site.test"]); assert.equal(sent.from, "Portfolio <noreply@site.test>"); assert.equal(sent.reply_to, "ada@example.com")
    assert.equal(sent.subject, "[Portfolio] Hello"); assert.match(String(sent.text), /Name: Ada\n/); assert.match(String(sent.text), /security project/)
  })
  await test("provider error (500) -> 502 'delivery' with no provider details; fetch throwing -> 502 too", async () => {
    fresh()
    const bad = await handleContact(req(good), { env: ENV, fetchImpl: mockFetch(500).fetchImpl })
    assert.equal(bad.status, 502); assert.deepEqual(await bad.json(), { error: "delivery" })
    const boom = await handleContact(req(good, { ip: "198.51.100.9" }), { env: ENV, fetchImpl: async () => { throw new Error("network down: re_test_SECRET_KEY_123") } })
    assert.equal(boom.status, 502); const text = await boom.text(); assert.deepEqual(JSON.parse(text), { error: "delivery" }); assert.ok(!text.includes("SECRET"))
  })
  await test("honeypot: a filled hidden field is answered 'ok' but nothing is sent", async () => {
    fresh(); const m = mockFetch()
    const res = await handleContact(req({ ...good, website: "http://spam.example" }), { env: ENV, fetchImpl: m.fetchImpl })
    assert.equal(res.status, 200); assert.deepEqual(await res.json(), { ok: true }); assert.equal(m.calls.length, 0)
  })
  await test("rate limit: 5 accepted per IP per hour, the 6th gets 429 + Retry-After; other IPs and the next window are fine", async () => {
    fresh(); const m = mockFetch(); let now = 1_700_000_000_000; const deps = { env: ENV, fetchImpl: m.fetchImpl, now: () => now }; const ip = "198.51.100.50"
    for (let i = 0; i < 5; i++) assert.equal((await handleContact(req(good, { ip }), deps)).status, 200, `attempt ${i + 1}`)
    const blocked = await handleContact(req(good, { ip }), deps)
    assert.equal(blocked.status, 429); assert.deepEqual(await blocked.json(), { error: "rate-limited" }); assert.ok(Number(blocked.headers.get("retry-after")) > 0)
    assert.equal(m.calls.length, 5)
    assert.equal((await handleContact(req(good, { ip: "198.51.100.77" }), deps)).status, 200)
    now += 60 * 60 * 1000 + 1000
    assert.equal((await handleContact(req(good, { ip }), deps)).status, 200)
  })
  await test("invalid submissions and unconfigured attempts do not use up rate-limit slots", async () => {
    fresh(); const m = mockFetch(); const ip = "198.51.100.51"
    for (let i = 0; i < 8; i++) await handleContact(req({ ...good, email: "bad" }, { ip }), { env: ENV, fetchImpl: m.fetchImpl })
    for (let i = 0; i < 8; i++) await handleContact(req(good, { ip }), { env: {}, fetchImpl: m.fetchImpl })
    assert.equal((await handleContact(req(good, { ip }), { env: ENV, fetchImpl: m.fetchImpl })).status, 200)
  })
  await test("email body contains the visitor's fields; the API key is never in it", () => {
    const text = buildEmailText(good, new Date("2026-01-02T03:04:05Z"))
    assert.match(text, /Name: Ada Lovelace/); assert.match(text, /Email: ada@example.com/); assert.match(text, /2026-01-02T03:04:05.000Z/); assert.ok(!text.includes("re_test"))
  })

  console.log("content schema")
  const soc = (over: Partial<SocialLink> = {}): SocialLink => ({ id: "s-test0001", visible: true, platform: "github", icon: null, label: "me", url: "https://github.com/me", description: { en: "", id: "" }, ...over })
  await test("default contact is empty; old content without `contact` falls back; valid data accepted", () => {
    assert.deepEqual(defaultContent.contact, { email: "", socials: [] })
    const old = clone(defaultContent) as Record<string, unknown>; delete old.contact
    assert.deepEqual(mergeContent(old).contact, { email: "", socials: [] })
    const c = clone(defaultContent); c.contact.email = "me@example.com"
    c.contact.socials.push(soc(), soc({ id: "s-test0002", platform: "discord", url: "https://discord.com/users/1", label: "" }), soc({ id: "s-test0003", platform: "other", visible: false, url: "" }))
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  const badSocial: [string, Partial<SocialLink>][] = [
    ["javascript: url", { url: "javascript:alert(1)" }], ["data: url", { url: "data:text/html,x" }], ["relative url", { url: "/profile" }],
    ["mailto url", { url: "mailto:a@b.co" }], ["ftp url", { url: "ftp://x.example/me" }], ["unknown platform", { platform: "myspace-clone" as never }],
    ["label > 80", { label: "x".repeat(81) }], ["description > 160", { description: { en: "x".repeat(161), id: "" } }], ["bad id", { id: "X" }],
  ]
  for (const [label, over] of badSocial) await test(`contact rejects social with ${label}`, () => { const c = clone(defaultContent); c.contact.socials.push(soc(over)); assert.equal(siteContentSchema.safeParse(c).success, false) })
  await test("social icons: every platform has an icon, custom image accepted, old data without icon still loads", async () => {
    const { socialPlatforms } = await import("@/lib/content-schema")
    const { BRAND_ICONS } = await import("@/lib/brand-icons")
    for (const k of socialPlatforms) {
      if (k === "other" || k === "custom") continue
      assert.ok(BRAND_ICONS[k]?.path.length > 20 && BRAND_ICONS[k].label, `icon for ${k}`)
    }
    const ok = clone(defaultContent); ok.contact.socials.push(soc({ id: "s-test0009", platform: "custom", icon: "/uploads/my-icon.png" }), soc({ id: "s-test0010", platform: "tiktok" }))
    assert.equal(siteContentSchema.safeParse(ok).success, true)
    const legacy = clone(defaultContent) as any; const old = soc({ id: "s-test0011" }) as any; delete old.icon; legacy.contact.socials.push(old)
    const parsed = siteContentSchema.safeParse(legacy); assert.equal(parsed.success, true)
    if (parsed.success) assert.equal(parsed.data.contact.socials[0].icon, null)
  })
  await test("contact rejects an invalid public email and more than 12 social links", () => {
    const a = clone(defaultContent); a.contact.email = "not-an-email"; assert.equal(siteContentSchema.safeParse(a).success, false)
    const b = clone(defaultContent); for (let i = 0; i < 13; i++) b.contact.socials.push(soc({ id: `s-test${String(i).padStart(4, "0")}` })); assert.equal(siteContentSchema.safeParse(b).success, false)
  })
  await test("copy keys for Contact exist in EN and ID and stay symmetric", () => {
    const keys = ["navContact", "contactTitle", "contactIntro", "contactFormTitle", "cfName", "cfEmail", "cfSubject", "cfMessage", "cfSend", "cfSending", "cfPrivacy", "cfSuccessTitle", "cfSuccessBody",
      "cfErrRequired", "cfErrTooShort", "cfErrTooLong", "cfErrInvalidEmail", "cfErrInvalidChars", "cfErrNotConfigured", "cfErrRate", "cfErrDelivery", "cfErrNetwork", "contactNoLinks"]
    for (const k of keys) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
    const en = Object.keys(defaultContent.copy.en), id = Object.keys(defaultContent.copy.id)
    assert.deepEqual(en.filter((k) => !id.includes(k)), []); assert.deepEqual(id.filter((k) => !en.includes(k)), [])
  })
  await test("contact save: persisted per language, other content untouched, invalid link rejected", async () => {
    fresh()
    const cur = await getContent(); const next = clone(cur)
    next.contact.email = "me@example.com"; next.contact.socials.push(soc({ description: { en: "EN note", id: "Catatan ID" } }))
    const saved = await saveContent(next, cur.version, "test")
    assert.equal(saved.contact.socials[0].description.id, "Catatan ID"); assert.equal(saved.contact.socials[0].description.en, "EN note"); assert.equal(saved.contact.email, "me@example.com")
    assert.deepEqual(saved.writeups, cur.writeups); assert.deepEqual(saved.tools, cur.tools); assert.deepEqual(saved.projects, cur.projects); assert.deepEqual(saved.education, cur.education)
    const bad = clone(saved); bad.contact.socials[0].url = "javascript:alert(1)"
    await assert.rejects(() => saveContent(bad, saved.version, "test"), ValidationError)
    assert.equal((await getContent()).contact.socials[0].url, "https://github.com/me")
  })

  console.log(`\n${passed} passed`)
}
main()
