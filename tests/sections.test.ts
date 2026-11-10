// Section order / numbering / custom sections merged into ONE homepage flow.
//
import assert from "node:assert/strict"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { defaultContent } from "@/lib/site-content"
import { siteContentSchema, type CustomPage } from "@/lib/content-schema"
import { buildSectionPlan, FLOW_SECTION_IDS } from "@/lib/section-plan"
import { getContent, saveContent } from "@/lib/server/content"

delete process.env.VERCEL; delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN
process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), "portfolio-sections-"))

let passed = 0
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok   ${name}`) } catch (e) { console.error(`  FAIL ${name}\n       ${(e as Error).message}`); process.exitCode = 1 }
}
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))
const custom = (over: Partial<CustomPage> = {}): CustomPage => ({
  id: "section-test0001", slug: "bug-bounty", title: { en: "Bug bounty", id: "Bug bounty" }, summary: { en: "", id: "" }, visible: true, showInNav: true,
  order: 50, accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [], ...over,
})
const ids = (plan: ReturnType<typeof buildSectionPlan>) => plan.map((e) => e.anchor)

async function main() {
  console.log("Sections & order")
  await test("default flow: every built-in section numbered 00.. in order, intro first", () => {
    const plan = buildSectionPlan(defaultContent.sections, [])
    assert.equal(plan[0].anchor, "intro"); assert.equal(plan[0].number, "00")
    assert.deepEqual(plan.map((e) => e.number), plan.map((_, i) => String(i).padStart(2, "0")))
    for (const e of plan) assert.ok((FLOW_SECTION_IDS as readonly string[]).includes(e.anchor))
    assert.ok(!ids(plan).includes("header") && !ids(plan).includes("footer"))
  })
  await test("custom section is merged into the SAME list at its order, not appended elsewhere", () => {
    const c = clone(defaultContent)
    const about = c.sections.find((s) => s.id === "about")!, edu = c.sections.find((s) => s.id === "education")!
    const mid = (about.order + edu.order) / 2
    assert.ok(Number.isInteger(mid) === false || mid !== about.order)
    c.customPages.pages.push(custom({ order: about.order }))
    const plan = buildSectionPlan(c.sections, c.customPages.pages)
    const i = ids(plan).indexOf("custom-bug-bounty")
    assert.ok(i > 0 && ids(plan)[i - 1] === "about", "custom placed right after About on an order tie")
    assert.equal(plan[i].number, String(i).padStart(2, "0"))
  })
  await test("removing a built-in section renumbers everything after it (nav and headings stay equal)", () => {
    const c = clone(defaultContent)
    const before = buildSectionPlan(c.sections, [])
    c.sections.find((s) => s.id === "education")!.visible = false
    const after = buildSectionPlan(c.sections, [])
    assert.equal(after.length, before.length - 1)
    assert.ok(!ids(after).includes("education"))
    assert.deepEqual(after.map((e) => e.number), after.map((_, i) => String(i).padStart(2, "0")))
    assert.equal(after.find((e) => e.anchor === "experience")!.number, before.find((e) => e.anchor === "experience")!.number.replace(/\d+/, (n) => String(Number(n) - 1).padStart(2, "0")))
  })
  await test("hidden custom section is not in the plan; restoring brings it back", () => {
    const c = clone(defaultContent); c.customPages.pages.push(custom({ visible: false }))
    assert.ok(!ids(buildSectionPlan(c.sections, c.customPages.pages)).includes("custom-bug-bounty"))
    c.customPages.pages[0].visible = true
    assert.ok(ids(buildSectionPlan(c.sections, c.customPages.pages)).includes("custom-bug-bounty"))
  })
  await test("moving up/down: swapping order values reorders the plan", () => {
    const c = clone(defaultContent)
    const a = c.sections.find((s) => s.id === "skills")!, b = c.sections.find((s) => s.id === "mitre")!
    const keep = ids(buildSectionPlan(c.sections, []))
    ;[a.order, b.order] = [b.order, a.order]
    const now = ids(buildSectionPlan(c.sections, []))
    assert.equal(now.indexOf("mitre"), keep.indexOf("skills")); assert.equal(now.indexOf("skills"), keep.indexOf("mitre"))
  })
  await test("custom sections in nav: schema keeps showInNav, old data without the field still loads", () => {
    const c = clone(defaultContent) as any; const old = custom() as any; delete old.showInNav; c.customPages.pages.push(old)
    const r = siteContentSchema.safeParse(c); assert.equal(r.success, true)
    if (r.success) assert.equal(r.data.customPages.pages[0].showInNav, false)
  })
  await test("save + reload: new order, hidden built-in and deleted custom section persist", async () => {
    const cur = await getContent(); const next = clone(cur)
    next.customPages.pages.push(custom({ order: 3 }))
    next.sections.find((s) => s.id === "tools")!.visible = false
    const saved = await saveContent(next, cur.version, "test")
    const plan = buildSectionPlan(saved.sections, saved.customPages.pages)
    assert.ok(ids(plan).includes("custom-bug-bounty")); assert.ok(!ids(plan).includes("tools"))
    const del = clone(saved); del.customPages.pages = []
    const saved2 = await saveContent(del, saved.version, "test")
    assert.ok(!ids(buildSectionPlan(saved2.sections, saved2.customPages.pages)).includes("custom-bug-bounty"))
    assert.equal((await getContent()).customPages.pages.length, 0)
  })
  console.log(`\n${passed} passed${process.exitCode ? " — with failures" : ""}`)
}
void main()
