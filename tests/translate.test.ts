// Checks for the DeepL auto-translation (network is mocked — no real request is made).
import assert from "node:assert/strict"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { defaultContent, mergeContent } from "@/lib/site-content"
import { chunkText, collectMissing, collectTexts, fillContent, hashText, isTranslatable, markTerms, splitShape, unmarkTerms } from "@/lib/translate"

delete process.env.VERCEL; delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN
process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), "portfolio-i18n-"))
process.env.DEEPL_API_KEY = "test-key:fx"

let passed = 0
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok   ${name}`) } catch (e) { console.error(`  FAIL ${name}\n       ${(e as Error).message}`); process.exitCode = 1 }
}

/** A fake DeepL: "translates" by wrapping every text, keeps <x> tags, can simulate quota / bad key. */
function fakeFetch(state: { calls: string[][]; status?: number; bodies?: Record<string, unknown>[] }): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.ok(String(input).startsWith("https://api-free.deepl.com/v2/translate"), "free key must use api-free")
    const headers = init?.headers as Record<string, string>
    assert.equal(headers.Authorization, "DeepL-Auth-Key test-key:fx")
    const body = JSON.parse(String(init?.body)) as { text: string[]; source_lang: string; target_lang: string; tag_handling: string; ignore_tags: string[] }
    assert.equal(body.source_lang, "EN"); assert.equal(body.target_lang, "ID"); assert.equal(body.tag_handling, "xml"); assert.deepEqual(body.ignore_tags, ["x"])
    state.calls.push(body.text)
    if (state.status) return new Response("{}", { status: state.status })
    return Response.json({ translations: body.text.map((t) => ({ text: `ID(${t})` })) })
  }) as typeof fetch
}

async function main() {
  await test("defaults contain no Indonesian text", () => {
    const json = JSON.stringify(defaultContent)
    assert.ok(!/Terima kasih|Pendidikan|Keamanan Informasi|Kembali ke atas/.test(json))
    assert.deepEqual(defaultContent.education.id, [])
  })

  await test("hash is stable and differs per text", () => {
    assert.equal(hashText("hello"), hashText("hello"))
    assert.notEqual(hashText("hello"), hashText("hello "))
  })

  await test("only prose is translatable", () => {
    assert.ok(isTranslatable("Work experience"))
    for (const x of ["https://a.com", "/uploads/x.png", "a@b.co", "education.txt", "2024", "#ff00aa", "", "x"]) assert.ok(!isTranslatable(x), x)
  })

  await test("terminal spacing is kept", () => {
    assert.deepEqual(splitShape("  whoami      who I am"), { prefix: "  whoami      ", body: "who I am", suffix: "" })
  })

  await test("protected terms are wrapped for DeepL and restored; & < > survive", () => {
    const marked = markTerms("Hands-on SIEM and n8n with CompTIA Security+ & MITRE ATT&CK <b>")
    assert.ok(marked.includes("<x>SIEM</x>") && marked.includes("<x>n8n</x>") && marked.includes("<x>MITRE ATT&amp;CK</x>"))
    assert.equal(unmarkTerms(marked), "Hands-on SIEM and n8n with CompTIA Security+ & MITRE ATT&CK <b>")
  })

  await test("long text is chunked under the 500-byte limit and loses nothing", () => {
    const text = Array.from({ length: 40 }, (_, i) => `Sentence number ${i} about incident response.`).join(" ")
    const chunks = chunkText(text)
    assert.ok(chunks.length > 1)
    assert.ok(chunks.every((c) => new TextEncoder().encode(c).length <= 420))
    assert.equal(chunks.join(" "), text)
  })

  await test("fillContent: id side comes from en, stored id is ignored, untranslated falls back to English", () => {
    const stored = JSON.parse(JSON.stringify(defaultContent))
    stored.education.id = [{ period: "x", title: "New entry", org: "", detail: "" }, { period: "x", title: "New entry", org: "" }]
    stored.profile.role.id = "stale text"
    const merged = mergeContent(stored)
    const none = fillContent(merged, {})
    assert.equal(none.education.id.length, merged.education.en.length)
    assert.equal(none.education.id[0].title, merged.education.en[0].title)
    assert.equal(none.profile.role.id, merged.profile.role.en)
    const dict = { [hashText("Information Security")]: "Keamanan Informasi" }
    assert.equal(fillContent(merged, dict).profile.role.id, "Keamanan Informasi")
    assert.equal(fillContent(merged, dict).profile.role.en, "Information Security")
  })

  await test("fillContent: structure of arrays always follows English; URLs and ids untouched", () => {
    const c = mergeContent({ ...defaultContent, education: { en: [{ period: "2020 — 2024", title: "B.Sc. Computer Science", org: "Binus University" }], id: [] } })
    const out = fillContent(c, { [hashText("Binus University")]: "Universitas Binus" })
    assert.equal(out.education.id.length, 1)
    assert.equal(out.education.id[0].org, "Universitas Binus")
    assert.equal(out.education.id[0].period, "2020 — 2024")
  })

  await test("collectMissing shrinks as the dictionary grows", () => {
    const all = collectTexts(defaultContent)
    assert.ok(all.size > 50)
    const [h] = [...all.keys()]
    assert.ok(!collectMissing(defaultContent, { [h]: "x" }).has(h))
  })

  const { translateMissing, getTranslations, translateBatch } = await import("@/lib/server/translate")

  await test("server: one batch request, cached, and the next call only sends what is still missing", async () => {
    const state = { calls: [] as string[][] }
    const first = await translateMissing(undefined, fakeFetch(state))
    assert.equal(state.calls.length, 1)
    assert.ok(state.calls[0].length <= 40 && state.calls[0].length > 1)
    assert.ok(Object.values(first.translations).every((t) => t.startsWith("ID(")))
    const second = await translateMissing(undefined, fakeFetch(state))
    assert.ok(second.pending < first.pending)
    assert.ok(!state.calls[1].some((t) => state.calls[0].includes(t)), "already translated text was sent again")
    assert.ok(Object.keys(await getTranslations()).length >= Object.keys(first.translations).length)
  })

  await test("server: only text from the site is ever translated", async () => {
    const state = { calls: [] as string[][] }
    const r = await translateMissing(["zzzzzzzz", hashText("Totally unrelated attacker text")], fakeFetch(state))
    assert.equal(state.calls.length, 0)
    assert.deepEqual(r.translations, {})
  })

  await test("server: translateBatch keeps terms and returns clean text", async () => {
    const out = await translateBatch(["Hands-on SIEM triage"], fakeFetch({ calls: [] }))
    assert.equal(out[0], "ID(Hands-on SIEM triage)")
  })

  await test("server: quota (456) is not cached and pauses further calls", async () => {
    const { resetStoreForTests } = await import("@/lib/server/store")
    process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), "portfolio-i18n-q-")); resetStoreForTests()
    const state = { calls: [] as string[][], status: 456 }
    const r = await translateMissing(undefined, fakeFetch(state))
    assert.equal(r.blocked, true); assert.match(r.error ?? "", /quota/i)
    assert.deepEqual(await getTranslations(), {})
    const again = await translateMissing(undefined, fakeFetch(state))
    assert.equal(state.calls.length, 1)
    assert.equal(again.blocked, true)
  })

  await test("server: bad key (403) and missing key give a clear error", async () => {
    const { resetStoreForTests } = await import("@/lib/server/store")
    process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), "portfolio-i18n-k-")); resetStoreForTests()
    const bad = await translateMissing(undefined, fakeFetch({ calls: [], status: 403 }))
    assert.match(bad.error ?? "", /API key/)
    process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), "portfolio-i18n-m-")); resetStoreForTests()
    delete process.env.DEEPL_API_KEY
    const missing = await translateMissing(undefined, fakeFetch({ calls: [] }))
    assert.match(missing.error ?? "", /DEEPL_API_KEY/)
    process.env.DEEPL_API_KEY = "test-key:fx"
  })

  console.log(`\n${passed} passed`)
}
void main()
