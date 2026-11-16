/* Visitor counter tests: path allow-list, bot filter, WIB day bucketing, anonymous daily hash, atomic counting, the REAL hit/admin handlers on the file store. */
import assert from "node:assert/strict"
import { mkdtempSync, readdirSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { createSessionCookie } from "@/lib/server/auth"
import { ago, delta } from "@/lib/visitor-format"
import { resetStoreForTests } from "@/lib/server/store"
import { _setAuditForTests, hitHandler, visitorsHandler, visitorsResetHandler } from "@/lib/server/visitor-handlers"
import {
  _resetLimiterForTests, _setPageLoaderForTests, countryCode, dayAdd, describeClient, getVisitorStats, isBot, referrerSource, normalizePath, parseRange, recordVisit, visitDay, visitorHash,
} from "@/lib/server/visitors"

delete process.env.VERCEL; delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN
const DATA = mkdtempSync(path.join(tmpdir(), "portfolio-visits-"))
process.env.DATA_DIR = DATA
process.env.SESSION_SECRET = "v".repeat(48) + "-session-secret-visitors"
resetStoreForTests()
_setPageLoaderForTests(async () => new Set(["case-study"])) // one published custom page; the real loader needs the content module

let passed = 0
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok   ${name}`) } catch (e) { console.error(`  FAIL ${name}\n       ${(e as Error).message}`); process.exitCode = 1 }
}

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
const baseUrl = "https://site.test"
const adminCookie = () => createSessionCookie(new Request(baseUrl), { sub: "admin", method: "password" }).split(";")[0]
let ipCounter = 1
const nextIp = () => `203.0.113.${ipCounter++}`
const hit = (body: unknown, headers: Record<string, string> = {}, raw?: string) => hitHandler(new Request(`${baseUrl}/api/hit`, {
  method: "POST", body: raw ?? JSON.stringify(body),
  headers: { host: "site.test", origin: baseUrl, "sec-fetch-site": "same-origin", "content-type": "text/plain", "user-agent": UA, "x-forwarded-for": nextIp(), ...headers },
}))
const stats = async (days?: string, cookie: string | null = adminCookie()) => {
  const r = await visitorsHandler(new Request(`${baseUrl}/api/admin/visitors${days ? `?days=${days}` : ""}`, { headers: cookie ? { cookie } : {} }))
  return { status: r.status, body: (await r.json()) as Record<string, any> }
}
const storeText = () => readdirSync(DATA).map((f) => readFileSync(path.join(DATA, f), "utf8")).join("\n")

async function main() {
  console.log("visitor counter")

  await test("normalizePath keeps only / and /pages/<slug>", () => {
    assert.equal(normalizePath("/"), "/")
    assert.equal(normalizePath("/?utm=x#top"), "/")
    assert.equal(normalizePath("/pages/case-study/"), "/pages/case-study")
    for (const bad of ["/admin", "/admin/login", "/api/hit", "//evil.test", "https://evil.test/", "/pages/Case", "/pages/a/b", "/pages/", "/x".repeat(120), "/a\\b", "/a\u0000b", "", 5, null, undefined])
      assert.equal(normalizePath(bad), null, `should reject ${JSON.stringify(bad)}`)
  })

  await test("isBot flags crawlers, scripts and empty user agents but not browsers", () => {
    for (const ua of ["", "curl/8.4.0", "Googlebot/2.1", "python-requests/2.31", "Mozilla/5.0 HeadlessChrome/120", "Slackbot-LinkExpanding 1.0"]) assert.equal(isBot(ua), true, ua)
    for (const ua of [UA, "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"]) assert.equal(isBot(ua), false)
  })

  await test("a day runs 00:00-24:00 WIB (UTC+7), not UTC", () => {
    assert.equal(visitDay(Date.parse("2026-11-16T16:59:59Z")), "2026-11-16")
    assert.equal(visitDay(Date.parse("2026-11-16T17:00:00Z")), "2026-11-17")
    assert.equal(dayAdd("2026-03-01", -1), "2026-02-28")
    assert.equal(dayAdd("2026-12-31", 1), "2027-01-01")
  })

  await test("parseRange only allows 7 / 30 / 90 (default 30)", () => {
    assert.equal(parseRange("7"), 7); assert.equal(parseRange("90"), 90)
    for (const v of ["30", "1", "999", "-5", "abc", "", null, undefined]) assert.equal(parseRange(v as string), 30)
  })

  await test("visitor hash: stable within a day, different across days / people, never the raw IP", () => {
    const a = visitorHash("2026-11-16", "198.51.100.7", UA, "salt")
    assert.equal(a, visitorHash("2026-11-16", "198.51.100.7", UA, "salt"))
    assert.notEqual(a, visitorHash("2026-11-17", "198.51.100.7", UA, "salt"), "daily salt: no linking across days")
    assert.notEqual(a, visitorHash("2026-11-16", "198.51.100.8", UA, "salt"))
    assert.notEqual(a, visitorHash("2026-11-16", "198.51.100.7", UA, "other-salt"))
    assert.match(a, /^[0-9a-f]{32}$/); assert.ok(!a.includes("198.51.100.7"))
  })

  await test("recordVisit: views and uniques are counted per day and per page", async () => {
    _resetLimiterForTests()
    const t = Date.parse("2026-11-10T03:00:00Z") // 10:00 WIB
    const ip = "198.51.100.10"
    assert.deepEqual(await recordVisit({ path: "/", ip, userAgent: UA, now: t }), { counted: true })
    assert.deepEqual(await recordVisit({ path: "/", ip, userAgent: UA, now: t + 60_000 }), { counted: true }) // same person again: +1 view, no new unique
    assert.deepEqual(await recordVisit({ path: "/pages/case-study", ip, userAgent: UA, now: t + 120_000 }), { counted: true }) // same person, other page
    assert.deepEqual(await recordVisit({ path: "/", ip: "198.51.100.11", userAgent: UA, now: t + 180_000 }), { counted: true }) // second person
    const s = await getVisitorStats(7, t + 200_000)
    const day = s.days.find((d) => d.day === "2026-11-10")!
    assert.deepEqual({ views: day.views, uniques: day.uniques }, { views: 4, uniques: 2 })
    const home = s.topPages.find((p) => p.path === "/")!, page = s.topPages.find((p) => p.path === "/pages/case-study")!
    assert.deepEqual({ v: home.views, u: home.uniques }, { v: 3, u: 2 })
    assert.deepEqual({ v: page.views, u: page.uniques }, { v: 1, u: 1 })
  })

  await test("recordVisit rejects bots, unknown pages, unlisted paths", async () => {
    _resetLimiterForTests()
    const t = Date.parse("2026-11-11T03:00:00Z")
    assert.deepEqual(await recordVisit({ path: "/", ip: "198.51.100.20", userAgent: "curl/8.4.0", now: t }), { counted: false, reason: "bot" })
    assert.deepEqual(await recordVisit({ path: "/pages/not-published", ip: "198.51.100.20", userAgent: UA, now: t }), { counted: false, reason: "unknown-page" })
    assert.deepEqual(await recordVisit({ path: "/admin", ip: "198.51.100.20", userAgent: UA, now: t }), { counted: false, reason: "path" })
    const s = await getVisitorStats(7, t + 1000)
    assert.equal(s.days.find((d) => d.day === "2026-11-11")!.views, 0)
  })

  await test("spam damper: the same visitor + page within 5 s counts once", async () => {
    _resetLimiterForTests()
    const t = Date.parse("2026-11-12T03:00:00Z"), ip = "198.51.100.30"
    assert.equal((await recordVisit({ path: "/", ip, userAgent: UA, now: t })).counted, true)
    assert.deepEqual(await recordVisit({ path: "/", ip, userAgent: UA, now: t + 1000 }), { counted: false, reason: "rate" })
    assert.equal((await recordVisit({ path: "/", ip, userAgent: UA, now: t + 6000 })).counted, true, "counts again after the window")
  })

  await test("spam damper: at most 40 hits a minute per visitor, then it resets", async () => {
    _resetLimiterForTests()
    _setPageLoaderForTests(async () => new Set(Array.from({ length: 60 }, (_, i) => `p${i}`))) // 60 DISTINCT pages so the duplicate rule cannot hide the cap
    try {
      const t = Date.parse("2026-11-14T03:00:00Z"), ip = "198.51.100.31"
      let counted = 0
      for (let i = 0; i < 60; i++) if ((await recordVisit({ path: `/pages/p${i}`, ip, userAgent: UA, now: t + i * 500 })).counted) counted++
      assert.equal(counted, 40, `expected exactly 40, got ${counted}`)
      assert.equal((await recordVisit({ path: "/pages/p0", ip, userAgent: UA, now: t + 61_000 })).counted, true, "bucket resets after a minute")
    } finally { _setPageLoaderForTests(async () => new Set(["case-study"])) }
  })

  await test("50 concurrent visitors are all counted exactly once (no lost updates)", async () => {
    _resetLimiterForTests()
    const t = Date.parse("2026-11-13T03:00:00Z")
    const results = await Promise.all(Array.from({ length: 50 }, (_, i) => recordVisit({ path: "/", ip: `192.0.2.${i + 1}`, userAgent: UA, now: t })))
    assert.equal(results.filter((r) => r.counted).length, 50)
    const day = (await getVisitorStats(7, t + 1000)).days.find((d) => d.day === "2026-11-13")!
    assert.deepEqual({ views: day.views, uniques: day.uniques }, { views: 50, uniques: 50 })
  })

  await test("storage holds numbers and salted hashes only: no raw IP, no user agent", () => {
    const text = storeText()
    for (const ip of ["198.51.100.10", "198.51.100.11", "192.0.2.1", "203.0.113.1"]) assert.ok(!text.includes(ip), `raw ip ${ip} found in storage`)
    assert.ok(!text.includes("Mozilla") && !text.includes("AppleWebKit"), "user agent found in storage")
  })

  console.log("hit endpoint")
  _resetLimiterForTests()

  await test("a normal browser hit is counted and answered with an empty 204", async () => {
    const before = (await getVisitorStats(7)).totals.today.views
    const r = await hit({ p: "/" })
    assert.equal(r.status, 204); assert.equal(await r.text(), ""); assert.equal(r.headers.get("cache-control"), "no-store")
    assert.equal((await getVisitorStats(7)).totals.today.views, before + 1)
  })

  const ignored: [string, () => Promise<Response>][] = [
    ["bot user agent", () => hit({ p: "/" }, { "user-agent": "Googlebot/2.1" })],
    ["Do-Not-Track", () => hit({ p: "/" }, { dnt: "1" })],
    ["Global Privacy Control", () => hit({ p: "/" }, { "sec-gpc": "1" })],
    ["cross-site fetch metadata", () => hit({ p: "/" }, { "sec-fetch-site": "cross-site" })],
    ["foreign Origin", () => hit({ p: "/" }, { origin: "https://evil.test" })],
    ["signed-in admin", () => hit({ p: "/" }, { cookie: adminCookie() })],
    ["admin path", () => hit({ p: "/admin/login" })],
    ["made-up path", () => hit({ p: "/totally/made/up" })],
    ["unknown custom page", () => hit({ p: "/pages/ghost" })],
    ["malformed JSON", () => hit(null, {}, "{not json")],
    ["missing p", () => hit({})],
    ["oversized body (declared)", () => hit({ p: "/" }, { "content-length": "5000" })],
    ["oversized body (streamed)", () => hit(null, {}, JSON.stringify({ p: "/", pad: "x".repeat(4000) }))],
  ]
  for (const [name, send] of ignored) {
    await test(`ignored (still 204, not counted): ${name}`, async () => {
      _resetLimiterForTests()
      const before = (await getVisitorStats(7)).totals.today.views
      const r = await send()
      assert.equal(r.status, 204); assert.equal(await r.text(), "")
      assert.equal((await getVisitorStats(7)).totals.today.views, before)
    })
  }

  console.log("admin stats endpoint")

  await test("401 without a session; never any data", async () => {
    const r = await stats("30", null)
    assert.equal(r.status, 401); assert.deepEqual(Object.keys(r.body), ["error"])
  })

  await test("401 with a forged / tampered session cookie", async () => {
    // flip a character in the MIDDLE of the signature (the last base64url character only carries padding bits, so changing it can leave the signature valid)
    const good = adminCookie(), cut = good.lastIndexOf(".") + 10
    const forged = good.slice(0, cut) + (good[cut] === "A" ? "B" : "A") + good.slice(cut + 1)
    assert.equal((await stats("30", forged)).status, 401)
  })

  await test("shape: range, WIB timezone, one entry per day, totals consistent with days", async () => {
    for (const range of [7, 30, 90]) {
      const r = await stats(String(range))
      assert.equal(r.status, 200)
      assert.equal(r.body.range, range); assert.equal(r.body.timezone, "Asia/Jakarta"); assert.equal(r.body.days.length, range)
      assert.equal(r.body.totals.range.views, r.body.days.reduce((a: number, d: { views: number }) => a + d.views, 0))
      assert.ok(r.body.totals.last30.views >= r.body.totals.last7.views)
      assert.ok(r.body.totals.last7.views >= r.body.totals.today.views)
    }
    assert.equal((await stats("123456")).body.range, 30, "invalid range falls back to 30")
  })

  console.log("details: all-time total, who visited, latest activity")

  await test("describeClient reduces a user agent to device / browser / OS", () => {
    assert.deepEqual(describeClient(UA), { device: "desktop", browser: "Chrome", os: "macOS" })
    assert.deepEqual(describeClient("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"), { device: "mobile", browser: "Safari", os: "iOS" })
    assert.deepEqual(describeClient("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36"), { device: "mobile", browser: "Chrome", os: "Android" })
    assert.equal(describeClient("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 Edg/130.0").browser, "Edge")
    assert.equal(describeClient("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0").browser, "Firefox")
    assert.equal(describeClient("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1").device, "tablet")
  })

  await test("referrerSource maps to a FIXED list, never to free text; own site and junk are Direct", () => {
    assert.equal(referrerSource("https://www.google.com/search?q=x"), "Google")
    assert.equal(referrerSource("https://www.linkedin.com/in/someone"), "LinkedIn")
    assert.equal(referrerSource("https://github.com/someone"), "GitHub")
    assert.equal(referrerSource("https://t.co/abc"), "X / Twitter")
    assert.equal(referrerSource("https://random-blog.example/post"), "Other site")
    assert.equal(referrerSource("https://site.test/pages/x", "site.test"), "Direct")
    assert.equal(referrerSource("https://notgoogle.com.evil.test/"), "Other site")
    for (const junk of ["", "not a url", null, undefined, 5, "x".repeat(3000)]) assert.equal(referrerSource(junk), "Direct")
  })

  await test("countryCode accepts two letters only (and drops Vercel's unknown markers)", () => {
    assert.equal(countryCode("id"), "ID"); assert.equal(countryCode("US"), "US")
    for (const bad of ["XX", "T1", "IDN", "I", "", "1D", null, undefined, 5, "<script>"]) assert.equal(countryCode(bad), null, String(bad))
  })

  await test("delta and ago format the admin numbers", () => {
    assert.deepEqual(delta(0, 0), null)
    assert.deepEqual(delta(5, 0), { text: "new", dir: "up" })
    assert.deepEqual(delta(15, 10), { text: "+50%", dir: "up" })
    assert.deepEqual(delta(5, 10), { text: "-50%", dir: "down" })
    assert.deepEqual(delta(10, 10), { text: "0%", dir: "flat" })
    const t = Date.parse("2026-11-16T10:00:00Z")
    assert.equal(ago(t, t + 10_000), "just now"); assert.equal(ago(t, t + 3 * 60_000), "3 min ago"); assert.equal(ago(t, t + 2 * 3600_000), "2 h ago")
  })

  await test("AS A VISITOR: one real hit shows up in the totals, the breakdown and the latest-activity list", async () => {
    _resetLimiterForTests()
    const before = (await stats("30")).body
    const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    const r = await hit({ p: "/", r: "https://www.google.com/search?q=cyber" }, { "user-agent": IPHONE, "x-vercel-ip-country": "ID", "x-forwarded-for": "198.51.100.200" })
    assert.equal(r.status, 204)
    const after = (await stats("30")).body
    assert.equal(after.totals.today.views, before.totals.today.views + 1)
    assert.equal(after.totals.today.uniques, before.totals.today.uniques + 1)
    assert.equal(after.totals.allTime.views, before.totals.allTime.views + 1)
    assert.equal(after.totals.allTime.uniques, before.totals.allTime.uniques + 1)
    const top = after.recent[0]
    assert.deepEqual({ p: top.p, d: top.d, b: top.b, o: top.o, c: top.c, r: top.r, n: top.n }, { p: "/", d: "mobile", b: "Safari", o: "iOS", c: "ID", r: "Google", n: true })
    assert.ok(Math.abs(top.t - Date.now()) < 5000, "the entry is time-stamped now")
    const get = (rows: { name: string; count: number }[], name: string) => rows.find((x) => x.name === name)?.count ?? 0
    assert.equal(get(after.breakdown.devices, "mobile"), get(before.breakdown.devices, "mobile") + 1)
    assert.equal(get(after.breakdown.countries, "ID"), get(before.breakdown.countries, "ID") + 1)
    assert.equal(get(after.breakdown.sources, "Google"), get(before.breakdown.sources, "Google") + 1)
  })

  await test("a returning visitor adds a view and a feed row but not a second unique", async () => {
    _resetLimiterForTests()
    const headers = { "x-forwarded-for": "198.51.100.201" }
    await hit({ p: "/" }, headers)
    const mid = (await stats("30")).body
    _resetLimiterForTests()
    await hit({ p: "/pages/case-study" }, headers)
    const end = (await stats("30")).body
    assert.equal(end.totals.today.views, mid.totals.today.views + 1)
    assert.equal(end.totals.today.uniques, mid.totals.today.uniques)
    assert.equal(end.recent[0].p, "/pages/case-study"); assert.equal(end.recent[0].n, false)
  })

  await test("forged referrers / countries cannot put free text into storage", async () => {
    _resetLimiterForTests()
    await hit({ p: "/", r: "https://evil-bloat-host-12345.example/x" }, { "x-vercel-ip-country": "<script>", "x-forwarded-for": "198.51.100.202" })
    const text = storeText()
    assert.ok(!text.includes("evil-bloat-host-12345") && !text.includes("<script>"), "free text reached storage")
  })

  await test("the signed-in admin is not shown in the activity list", async () => {
    _resetLimiterForTests()
    const before = (await stats("30")).body.recent.length
    await hit({ p: "/" }, { cookie: adminCookie(), "x-forwarded-for": "198.51.100.203" })
    assert.equal((await stats("30")).body.recent.length, before)
  })

  await test("the activity list is capped, newest first, and still holds no raw IP or user agent", async () => {
    for (let i = 0; i < 70; i++) { _resetLimiterForTests(); await hit({ p: "/" }, { "x-forwarded-for": `192.0.2.${100 + (i % 100)}`, "user-agent": `${UA} n${i}` }) }
    const body = (await stats("30")).body
    assert.ok(body.recent.length <= 30 && body.recent.length > 0)
    for (let i = 1; i < body.recent.length; i++) assert.ok(body.recent[i - 1].t >= body.recent[i].t, "newest first")
    const text = storeText()
    for (const ip of ["198.51.100.200", "198.51.100.201", "192.0.2.150"]) assert.ok(!text.includes(ip), `raw ip ${ip} found in storage`)
    assert.ok(!text.includes("Mozilla") && !text.includes("AppleWebKit"), "user agent found in storage")
    const lists = readdirSync(DATA).map((f) => { try { return JSON.parse(readFileSync(path.join(DATA, f), "utf8")) as unknown } catch { return null } })
      .filter((v): v is string[] => Array.isArray(v) && v.length > 0 && typeof v[0] === "string" && v[0].includes('"p"') && v[0].includes('"d"'))
    assert.equal(lists.length, 1, "exactly one activity list on disk")
    assert.equal(lists[0].length, 60, "stored list is capped at 60 (70 hits were made)")
  })

  await test("fresh store reads as all zeros (no dummy numbers anywhere)", async () => {
    const fresh = mkdtempSync(path.join(tmpdir(), "portfolio-empty-"))
    process.env.DATA_DIR = fresh; resetStoreForTests()
    try {
      const body = (await stats("90")).body
      assert.deepEqual(body.totals.allTime, { views: 0, uniques: 0 })
      for (const k of ["today", "yesterday", "last7", "previous7", "last30", "previous30", "range"]) assert.deepEqual(body.totals[k], { views: 0, uniques: 0 }, k)
      assert.deepEqual(body.recent, []); assert.deepEqual(body.topPages, [])
      for (const rows of Object.values(body.breakdown)) assert.deepEqual(rows, [])
    } finally { process.env.DATA_DIR = DATA; resetStoreForTests() }
  })

  console.log("reset to zero")
  const audit: string[][] = []
  _setAuditForTests(async (actor, action, detail) => { audit.push([actor, action, detail ?? ""]) })
  const reset = (body: unknown, headers: Record<string, string> = {}) => visitorsResetHandler(new Request(`${baseUrl}/api/admin/visitors`, {
    method: "POST", body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { host: "site.test", origin: baseUrl, "x-requested-with": "admin", "content-type": "application/json", cookie: adminCookie(), ...headers },
  }))

  await test("reset is refused without a session, without same-origin, and without the confirmation word", async () => {
    const before = (await stats("30")).body.totals.allTime.views
    assert.ok(before > 0, "there is something to protect")
    assert.equal((await reset({ confirm: "reset" }, { cookie: "" })).status, 401)
    assert.equal((await reset({ confirm: "reset" }, { origin: "https://evil.test" })).status, 403)
    assert.equal((await reset({ confirm: "reset" }, { "x-requested-with": "" })).status, 403)
    assert.equal((await reset({})).status, 422); assert.equal((await reset({ confirm: "yes" })).status, 422); assert.equal((await reset("{nope")).status, 422)
    assert.equal((await stats("30")).body.totals.allTime.views, before, "nothing was deleted")
    assert.equal(audit.length, 0)
  })

  await test("reset wipes totals, days, breakdown and the activity list, is logged, and counting works again afterwards", async () => {
    const r = await reset({ confirm: "reset" })
    assert.equal(r.status, 200); assert.deepEqual(await r.json(), { ok: true })
    assert.deepEqual(audit, [["admin", "reset-visitors", "all visitor numbers set to 0"]])
    const body = (await stats("90")).body
    assert.deepEqual(body.totals.allTime, { views: 0, uniques: 0 }); assert.deepEqual(body.totals.range, { views: 0, uniques: 0 }); assert.deepEqual(body.totals.last30, { views: 0, uniques: 0 })
    assert.deepEqual(body.recent, []); assert.deepEqual(body.topPages, [])
    for (const rows of Object.values(body.breakdown)) assert.deepEqual(rows, [])
    // the very same visitor can be counted again right after a reset (their "seen today" mark is gone too)
    const again = await hit({ p: "/" }, { "x-forwarded-for": "198.51.100.201" })
    assert.equal(again.status, 204)
    const after = (await stats("30")).body
    assert.deepEqual(after.totals.today, { views: 1, uniques: 1 }); assert.deepEqual(after.totals.allTime, { views: 1, uniques: 1 })
  })

  _setAuditForTests(null)

  console.log(`\n${passed} passed${process.exitCode ? " — with FAILURES" : ""}`)
}
main()
