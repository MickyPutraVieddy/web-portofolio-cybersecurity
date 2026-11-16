/* Production paths of the visitor counter: (1) the Upstash REST store incl. /pipeline, driven through a faithful in-memory fake of Upstash;
   (2) the Vercel Web Analytics API reader, driven through a fake of api.vercel.com. No network is used. */
import assert from "node:assert/strict"
import { resetStoreForTests } from "@/lib/server/store"
import { _resetVercelCacheForTests, getVercelAnalytics, vercelAnalyticsConfig } from "@/lib/server/vercel-analytics"
import { _resetLimiterForTests, _setPageLoaderForTests, getVisitorStats, recordVisit, resetVisitorStats } from "@/lib/server/visitors"

let passed = 0
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok   ${name}`) } catch (e) { console.error(`  FAIL ${name}\n       ${(e as Error).message}`); process.exitCode = 1 }
}

// ---- fake Upstash --------------------------------------------------------------------------------------------------------------
const kv = new Map<string, unknown>(), ttl = new Map<string, number>()
const log: string[][] = []
function run(cmd: (string | number)[]): unknown {
  const [name, key, ...rest] = cmd.map((c, i) => (i === 0 ? String(c).toUpperCase() : c)) as [string, string, ...(string | number)[]]
  log.push(cmd.map(String))
  switch (name) {
    case "GET": return (kv.get(key) as string | undefined) ?? null
    case "SET": kv.set(key, String(rest[0])); return "OK"
    case "DEL": return kv.delete(key) ? 1 : 0
    case "GETDEL": { const v = kv.get(key) ?? null; kv.delete(key); return v }
    case "HINCRBY": { const h = (kv.get(key) as Record<string, number>) ?? {}; h[String(rest[0])] = (h[String(rest[0])] ?? 0) + Number(rest[1]); kv.set(key, h); return h[String(rest[0])] }
    case "HGETALL": { const h = (kv.get(key) as Record<string, number>) ?? {}; return Object.entries(h).flatMap(([f, v]) => [f, String(v)]) } // real Upstash: flat array of strings
    case "SADD": { const s = (kv.get(key) as Set<string>) ?? new Set<string>(); const had = s.has(String(rest[0])); s.add(String(rest[0])); kv.set(key, s); return had ? 0 : 1 }
    case "EXPIRE": ttl.set(key, Number(rest[0])); return 1
    case "LPUSH": { const l = (kv.get(key) as string[]) ?? []; l.unshift(String(rest[0])); kv.set(key, l); return l.length }
    case "LTRIM": { const l = (kv.get(key) as string[]) ?? []; kv.set(key, l.slice(Number(rest[0]), Number(rest[1]) + 1)); return "OK" }
    case "LRANGE": return ((kv.get(key) as string[]) ?? []).slice(Number(rest[0]), Number(rest[1]) + 1)
    default: throw new Error(`fake upstash: unsupported ${name}`)
  }
}

const realFetch = globalThis.fetch
let vercelCalls: URL[] = []
let vercelHandler: (url: URL, headers: Headers) => Response = () => new Response("{}", { status: 500 })
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url)
  if (url.host === "fake-upstash.test") {
    assert.equal(new Headers(init?.headers).get("authorization"), "Bearer tok", "Upstash token sent")
    const body = JSON.parse(String(init?.body))
    if (url.pathname === "/pipeline") return Response.json((body as (string | number)[][]).map((c) => ({ result: run(c) })))
    return Response.json({ result: run(body) })
  }
  if (url.host === "api.vercel.com") { vercelCalls.push(url); return vercelHandler(url, new Headers(init?.headers)) }
  throw new Error(`unexpected network call to ${url.host}`)
}) as typeof fetch

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"

async function main() {
  console.log("Upstash store (production path)")
  process.env.KV_REST_API_URL = "https://fake-upstash.test"; process.env.KV_REST_API_TOKEN = "tok"
  process.env.SESSION_SECRET = "u".repeat(48) + "-upstash-test-secret"
  delete process.env.VERCEL; resetStoreForTests(); _setPageLoaderForTests(async () => new Set())

  await test("a visit is counted through Upstash: totals, breakdown, latest activity", async () => {
    const t = Date.parse("2026-11-16T05:00:00Z") // 12:00 WIB
    assert.deepEqual(await recordVisit({ path: "/", ip: "198.51.100.5", userAgent: UA, country: "id", referrer: "https://www.linkedin.com/", now: t }), { counted: true })
    assert.deepEqual(await recordVisit({ path: "/", ip: "198.51.100.6", userAgent: UA, country: "SG", now: t + 60_000 }), { counted: true })
    _resetLimiterForTests()
    assert.deepEqual(await recordVisit({ path: "/", ip: "198.51.100.5", userAgent: UA, country: "ID", now: t + 120_000 }), { counted: true }) // same person again
    const s = await getVisitorStats(30, t + 130_000)
    assert.deepEqual(s.totals.today, { views: 3, uniques: 2 })
    assert.deepEqual(s.totals.allTime, { views: 3, uniques: 2 })
    assert.deepEqual(s.breakdown.countries.map((c) => [c.name, c.count]).sort(), [["ID", 1], ["SG", 1]])
    assert.deepEqual(s.breakdown.sources.find((x) => x.name === "LinkedIn"), { name: "LinkedIn", count: 1 })
    assert.equal(s.recent.length, 3); assert.equal(s.recent[0].n, false); assert.equal(s.recent[2].c, "ID")
  })

  await test("the 60 days of daily numbers are read in ONE pipeline request, and keys get an expiry", async () => {
    log.length = 0
    let pipelines = 0
    const wrapped = globalThis.fetch
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => { if (String(input).endsWith("/pipeline")) pipelines++; return wrapped(input, init) }) as typeof fetch
    try { await getVisitorStats(90, Date.parse("2026-11-16T05:00:00Z")) } finally { globalThis.fetch = wrapped }
    assert.equal(pipelines, 1, "one /pipeline call for all days")
    assert.equal(log.filter((c) => c[0] === "HGETALL").length >= 90, true)
    assert.ok([...ttl.entries()].some(([k, v]) => k === "visits:recent" && v === 14 * 24 * 3600), "recent list expires")
    assert.ok([...ttl.keys()].some((k) => k.startsWith("visits:day:")), "daily hashes expire")
    assert.ok(!ttl.has("visits:total"), "the all-time total never expires")
  })

  await test("an Upstash outage never breaks the visitor's page (hit handler stays 204)", async () => {
    const { hitHandler } = await import("@/lib/server/visitor-handlers")
    const wrapped = globalThis.fetch
    globalThis.fetch = (async () => new Response("down", { status: 500 })) as typeof fetch
    try {
      _resetLimiterForTests()
      const r = await hitHandler(new Request("https://site.test/api/hit", { method: "POST", body: JSON.stringify({ p: "/" }), headers: { host: "site.test", origin: "https://site.test", "sec-fetch-site": "same-origin", "user-agent": UA, "x-forwarded-for": "198.51.100.77" } }))
      assert.equal(r.status, 204)
    } finally { globalThis.fetch = wrapped }
  })

  await test("reset deletes every visits:* key in Upstash (days, seen-hashes, total, recent) in a few pipeline requests", async () => {
    const t = Date.parse("2026-11-16T05:00:00Z")
    _resetLimiterForTests()
    await recordVisit({ path: "/", ip: "198.51.100.90", userAgent: UA, country: "ID", now: t })
    assert.ok([...kv.keys()].some((k) => k.startsWith("visits:day:")) && kv.has("visits:total") && kv.has("visits:recent") && [...kv.keys()].some((k) => k.startsWith("visits:seen:")))
    let pipelines = 0
    const wrapped = globalThis.fetch
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => { if (String(input).endsWith("/pipeline")) pipelines++; return wrapped(input, init) }) as typeof fetch
    try { await resetVisitorStats(t) } finally { globalThis.fetch = wrapped }
    assert.deepEqual([...kv.keys()].filter((k) => k.startsWith("visits:")), [], "no visitor key left")
    assert.ok(pipelines <= 6, `used ${pipelines} pipeline requests`)
    const s = await getVisitorStats(30, t)
    assert.deepEqual(s.totals.allTime, { views: 0, uniques: 0 }); assert.deepEqual(s.recent, [])
  })

  console.log("Vercel Web Analytics API")
  const env = { ANALYTICS_API_TOKEN: "secret-token", ANALYTICS_PROJECT_ID: "prj_123", ANALYTICS_TEAM_ID: "team_456" } as unknown as NodeJS.ProcessEnv
  const now = Date.parse("2026-11-16T05:00:00Z")

  await test("not configured -> { configured: false } and no network call", async () => {
    vercelCalls = []; _resetVercelCacheForTests()
    assert.deepEqual(await getVercelAnalytics(now, {} as NodeJS.ProcessEnv), { configured: false })
    assert.deepEqual(await getVercelAnalytics(now, { ANALYTICS_API_TOKEN: "x" } as unknown as NodeJS.ProcessEnv), { configured: false }, "token alone is not enough")
    assert.equal(vercelCalls.length, 0)
    assert.equal(vercelAnalyticsConfig(env)?.teamId, "team_456"); assert.equal(vercelAnalyticsConfig({ ...env, ANALYTICS_TEAM_ID: "" } as NodeJS.ProcessEnv)?.teamId, undefined)
  })

  await test("reads daily rows + lifetime count, fills gaps with zeros, sends the token only in the Authorization header", async () => {
    vercelCalls = []; _resetVercelCacheForTests()
    vercelHandler = (url, headers) => {
      assert.equal(headers.get("authorization"), "Bearer secret-token")
      if (url.pathname.endsWith("/aggregate")) return Response.json({ version: 1, data: [
        { timestamp: "2026-11-16T00:00:00.000Z", pageviews: 12, visitors: 7 },
        { timestamp: "2026-11-15T00:00:00.000Z", pageviews: 20, visitors: 11 },
        { timestamp: "2026-11-01T00:00:00.000Z", pageviews: 5, visitors: 4 },
      ] })
      return Response.json({ version: 1, data: { pageviews: 900, visitors: 640 } })
    }
    const r = await getVercelAnalytics(now, env)
    assert.ok(r.configured && r.ok)
    if (!(r.configured && r.ok)) return
    assert.equal(r.days.length, 30); assert.equal(r.days[29].day, "2026-11-16")
    assert.deepEqual(r.totals.today, { views: 12, uniques: 7 })
    assert.deepEqual(r.totals.last7, { views: 32, uniques: 18 })
    assert.deepEqual(r.totals.last30, { views: 37, uniques: 22 })
    assert.deepEqual(r.totals.allTime, { views: 900, uniques: 640 })
    const agg = vercelCalls.find((u) => u.pathname.endsWith("/aggregate"))!
    assert.equal(agg.searchParams.get("projectId"), "prj_123"); assert.equal(agg.searchParams.get("teamId"), "team_456")
    assert.equal(agg.searchParams.get("by"), "day"); assert.equal(agg.searchParams.get("until"), "2026-11-16"); assert.equal(agg.searchParams.get("since"), "2026-10-18")
    assert.ok(!JSON.stringify(r).includes("secret-token"), "token never in the result")
    assert.ok(!vercelCalls.some((u) => u.href.includes("secret-token")), "token never in a URL")
  })

  await test("a second call within a minute is served from cache; a failure is not cached", async () => {
    vercelCalls = []; _resetVercelCacheForTests()
    vercelHandler = (url) => (url.pathname.endsWith("/aggregate") ? Response.json({ data: [] }) : Response.json({ data: { pageviews: 1, visitors: 1 } }))
    await getVercelAnalytics(now, env); const n = vercelCalls.length
    await getVercelAnalytics(now + 30_000, env); assert.equal(vercelCalls.length, n, "cached")
    await getVercelAnalytics(now + 61_000, env); assert.ok(vercelCalls.length > n, "refetched after 60 s")
    _resetVercelCacheForTests(); vercelHandler = () => new Response("nope", { status: 500 })
    assert.equal((await getVercelAnalytics(now, env) as { ok: boolean }).ok, false)
    vercelHandler = (url) => (url.pathname.endsWith("/aggregate") ? Response.json({ data: [] }) : Response.json({ data: { pageviews: 1, visitors: 1 } }))
    assert.equal((await getVercelAnalytics(now, env) as { ok: boolean }).ok, true, "recovers right away")
  })

  for (const [status, expected] of [[401, "auth"], [403, "auth"], [404, "not-found"], [429, "rate"], [500, "unavailable"]] as const) {
    await test(`Vercel answers ${status} -> a readable "${expected}" status, never an exception`, async () => {
      _resetVercelCacheForTests(); vercelHandler = () => new Response("{}", { status })
      const r = await getVercelAnalytics(now, env)
      assert.ok(r.configured && !r.ok && r.error === expected, JSON.stringify(r))
      assert.ok(r.configured && !r.ok && r.message.length > 10 && !r.message.includes("secret-token"))
    })
  }

  await test("lifetime count failing (e.g. 404) still returns the daily numbers", async () => {
    _resetVercelCacheForTests()
    vercelHandler = (url) => (url.pathname.endsWith("/aggregate") ? Response.json({ data: [{ timestamp: "2026-11-16T00:00:00Z", pageviews: 3, visitors: 2 }] }) : new Response("{}", { status: 404 }))
    const r = await getVercelAnalytics(now, env)
    assert.ok(r.configured && r.ok && r.totals.allTime === null && r.totals.today.views === 3)
  })

  globalThis.fetch = realFetch
  console.log(`\n${passed} passed${process.exitCode ? " — with FAILURES" : ""}`)
}
main()
