// Dependency-free checks for the content schema and the save/restore flow (file store, no network).
//
import assert from "node:assert/strict"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { mergeContent, defaultContent } from "@/lib/site-content"
import { siteContentSchema, type Certification, type Skill, type MitreTechnique, type Project, type TrainingItem, type Tool, type Achievement, type Writeup, type CustomTemplate, customPageSchema, mitreTacticIds } from "@/lib/content-schema"
import { getContent, saveContent, restoreVersion, getHistory, ValidationError, ConflictError } from "@/lib/server/content"

delete process.env.VERCEL; delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN
process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), "portfolio-test-"))

let passed = 0
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok   ${name}`) } catch (e) { console.error(`  FAIL ${name}\n       ${(e as Error).message}`); process.exitCode = 1 }
}

const cert = (over: Partial<Certification> = {}): Certification => ({
  id: "c-test0001", visible: true, name: "Test certificate", kind: "professional", category: "blue",
  issuer: "Test issuer", credential: "", acquiredYear: 2024, issuedYear: 2024, expiryYear: 2027, validity: "by-expiry",
  description: { en: "", id: "" }, image: null, imageAlt: { en: "", id: "" }, verifyUrl: "", ...over,
})
const skill = (over: Partial<Skill> = {}): Skill => ({ id: "s-test0001", visible: true, name: "Test skill", category: "blue", level: 3, description: { en: "", id: "" }, ...over })
const mt = (over: Partial<MitreTechnique> = {}): MitreTechnique => ({ id: "m-test0001", visible: true, tactic: "initial-access", techniqueId: "T1566.001", name: "Test technique", exposure: "lab", description: { en: "", id: "" }, ...over })
const proj = (over: Partial<Project> = {}): Project => ({
  id: "p-test0001", visible: true, featured: false, name: "Test project", kind: "professional", domain: "blue", status: "completed",
  year: 2025, period: "", summary: { en: "", id: "" }, description: { en: "", id: "" }, role: { en: "", id: "" }, method: { en: "", id: "" }, outcome: { en: "", id: "" },
  stack: ["Tool A"], thumbnail: null, thumbnailAlt: { en: "", id: "" }, repoUrl: "", demoUrl: "", reportUrl: "", ...over,
})
const tr = (over: Partial<TrainingItem> = {}): TrainingItem => ({
  id: "t-test0001", visible: true, kind: "training", platform: "Test platform", name: "Test entry", domain: "blue", status: "completed",
  startYear: 2024, endYear: 2025, focus: { en: "", id: "" }, objective: { en: "", id: "" }, description: { en: "", id: "" },
  modules: ["Module 1"], skills: ["Skill A"], tools: ["Tool A"], evidenceUrl: "", ...over,
})
const tl = (over: Partial<Tool> = {}): Tool => ({
  id: "tl-test0001", visible: true, group: "security", name: "Test tool", type: "security-tool", domain: "blue",
  purpose: { en: "", id: "" }, workflow: { en: "", id: "" }, level: null, icon: null, ...over,
})
const ac = (over: Partial<Achievement> = {}): Achievement => ({ id: "a-test0001", visible: true, title: "Test achievement", year: 2025, issuer: "", description: { en: "", id: "" }, proofUrl: "", ...over })
const wu = (over: Partial<Writeup> = {}): Writeup => ({ id: "w-test0001", visible: true, title: "Test writeup", blog: "Test blog", year: 2025, summary: { en: "", id: "" }, tags: ["web"], url: "https://example.com/post", ...over })
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

async function main() {
  console.log("schema")
  await test("default content includes a safe adaptive appearance and empty custom page library", () => {
    assert.equal(defaultContent.appearance.preset, "blue")
    assert.equal(defaultContent.appearance.headingFont, "inter")
    assert.equal(defaultContent.appearance.cursorEffect, true)
    assert.equal(defaultContent.appearance.cursorIntensity, 35)
    assert.equal(defaultContent.appearance.glow, 35)
    assert.deepEqual(defaultContent.customPages.pages, [])
    assert.deepEqual(defaultContent.customPages.templates, [])
    assert.equal(siteContentSchema.safeParse(defaultContent).success, true)
  })
  await test("legacy content without appearance or custom page fields migrates to safe defaults", () => {
    const old = clone(defaultContent) as Record<string, unknown>
    delete old.appearance; delete old.customPages
    const merged = mergeContent(old)
    assert.equal(merged.appearance.preset, "blue")
    assert.deepEqual(merged.customPages.pages, [])
  })
  await test("custom pages validate safe slugs, colors and block content", () => {
    const c = clone(defaultContent)
    c.customPages.pages.push({ id: "page-test0001", slug: "security-research", title: { en: "Security Research", id: "Riset Keamanan" }, summary: { en: "A custom page", id: "Halaman khusus" }, visible: true, showInNav: true, order: 50, accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [{ id: "blk-test0001", type: "hero", eyebrow: { en: "RESEARCH", id: "RISET" }, heading: { en: "Security Research", id: "Riset Keamanan" }, body: { en: "Description", id: "Deskripsi" } }] })
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  await test("legacy custom section schema defaults missing order to the end of the homepage", () => {
    const parsed = customPageSchema.safeParse({
      id: "page-legacy001", slug: "legacy-section", title: { en: "Legacy section", id: "Bagian lama" },
      summary: { en: "", id: "" }, visible: true, showInNav: false,
      accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [],
    })
    assert.equal(parsed.success, true)
    if (parsed.success) assert.equal(parsed.data.order, 50)
  })
  await test("legacy custom page entries receive a homepage section order", () => {
    const c = clone(defaultContent)
    c.customPages.pages.push({ id: "page-test0010", slug: "inline-research", title: { en: "Inline Research", id: "Riset Inline" }, summary: { en: "", id: "" }, visible: true, showInNav: false, order: 18, accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [] })
    const parsed = siteContentSchema.safeParse(c)
    assert.equal(parsed.success, true)
    if (parsed.success) assert.equal(parsed.data.customPages.pages[0].order, 18)
  })
  await test("older appearance settings default the optional cursor aura safely", () => {
    const old = clone(defaultContent)
    delete (old.appearance as Partial<typeof old.appearance>).cursorEffect
    assert.equal(mergeContent(old).appearance.cursorEffect, true)
  })
  await test("older appearance settings migrate to an independent cursor intensity", () => {
    const old = clone(defaultContent)
    delete (old.appearance as Partial<typeof old.appearance>).cursorIntensity
    old.appearance.glow = 90
    const merged = mergeContent(old)
    assert.equal(merged.appearance.glow, 90)
    assert.equal(merged.appearance.cursorIntensity, 35)
  })
  await test("cursor animation intensity accepts zero, half and full strength independently of glow", () => {
    for (const cursorIntensity of [0, 50, 100]) {
      const candidate = clone(defaultContent)
      candidate.appearance.glow = 0
      candidate.appearance.cursorIntensity = cursorIntensity
      assert.equal(siteContentSchema.safeParse(candidate).success, true)
    }
    const disabled = clone(defaultContent)
    disabled.appearance.cursorEffect = false
    assert.equal(siteContentSchema.safeParse(disabled).success, true)
  })
  await test("cursor animation intensity rejects values outside 0..100", () => {
    for (const cursorIntensity of [-1, 101]) {
      const candidate = clone(defaultContent)
      candidate.appearance.cursorIntensity = cursorIntensity
      assert.equal(siteContentSchema.safeParse(candidate).success, false)
    }
  })
  await test("glow intensity supports zero, half and full strength", () => {
    for (const glow of [0, 50, 100]) {
      const candidate = clone(defaultContent)
      candidate.appearance.glow = glow
      assert.equal(siteContentSchema.safeParse(candidate).success, true)
    }
  })
  await test("custom homepage sections reject duplicate slugs", () => {
    const c = clone(defaultContent)
    const page = { id: "page-test0003", slug: "same-page", title: { en: "One", id: "Satu" }, summary: { en: "", id: "" }, visible: false, showInNav: false, order: 50, accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [] }
    c.customPages.pages.push(page, { ...page, id: "page-test0004" })
    assert.equal(siteContentSchema.safeParse(c).success, false)
  })
  await test("reusable custom templates validate and reject unsafe CTA links", () => {
    const valid: CustomTemplate = { id: "tpl-test0001", name: "Research Layout", accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [{ id: "blk-test0001", type: "hero", eyebrow: { en: "RESEARCH", id: "RISET" }, heading: { en: "Security research", id: "Riset keamanan" }, body: { en: "A safe template", id: "Template aman" } }] }
    const c = clone(defaultContent)
    c.customPages.templates.push(valid)
    assert.equal(siteContentSchema.safeParse(c).success, true)
    const unsafe: CustomTemplate = { id: "tpl-test0002", name: "Unsafe Layout", accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [{ id: "blk-test0002", type: "cta", heading: { en: "Go", id: "Pergi" }, body: { en: "", id: "" }, buttonLabel: { en: "Open", id: "Buka" }, href: "javascript:alert(1)" }] }
    c.customPages.templates.push(unsafe)
    assert.equal(siteContentSchema.safeParse(c).success, false)
  })
  await test("custom pages reject duplicate component IDs and non-web image URLs", () => {
    const c = clone(defaultContent)
    c.customPages.pages.push({ id: "page-test0012", slug: "bad-components", title: { en: "Bad components", id: "Komponen buruk" }, summary: { en: "", id: "" }, visible: false, showInNav: false, order: 50, accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [{ id: "blk-test0012", type: "divider" }, { id: "blk-test0012", type: "divider" }] })
    assert.equal(siteContentSchema.safeParse(c).success, false)
    c.customPages.pages[0].blocks = [{ id: "blk-test0013", type: "image", image: "mailto:admin@example.com", alt: { en: "", id: "" }, caption: { en: "", id: "" } }]
    assert.equal(siteContentSchema.safeParse(c).success, false)
  })
  await test("custom page schema rejects unsafe slugs and javascript CTA links", () => {
    const c = clone(defaultContent)
    c.customPages.pages.push({ id: "page-test0002", slug: "../admin", title: { en: "Bad", id: "Bad" }, summary: { en: "", id: "" }, visible: true, showInNav: true, order: 50, accentColor: "#55aaff", secondaryColor: "#338cff", blocks: [{ id: "blk-test0002", type: "cta", heading: { en: "Go", id: "Pergi" }, body: { en: "", id: "" }, buttonLabel: { en: "Open", id: "Buka" }, href: "javascript:alert(1)" }] })
    assert.equal(siteContentSchema.safeParse(c).success, false)
  })
  await test("default content is valid and has no certifications", () => {
    assert.equal(siteContentSchema.safeParse(defaultContent).success, true)
    assert.deepEqual(defaultContent.certifications.items, [])
  })
  await test("old stored content without `certifications` falls back to the default", () => {
    const old = clone(defaultContent) as Record<string, unknown>
    delete old.certifications
    assert.deepEqual(mergeContent(old).certifications.items, [])
  })
  await test("legacy profiles without a separate brandLogo migrate to the default shield", () => {
    const old = clone(defaultContent) as typeof defaultContent
    delete (old.profile as Partial<typeof old.profile>).brandLogo
    const merged = mergeContent(old)
    assert.equal(merged.profile.brandLogo, null)
    assert.equal(merged.profile.adminLogo, null)
  })
  await test("legacy content without footer settings receives safe footer defaults", () => {
    const old = clone(defaultContent) as Record<string, unknown>
    delete old.footer
    const merged = mergeContent(old)
    assert.equal(merged.footer.showStatus, true)
    assert.equal(merged.footer.showSocials, true)
    assert.equal(merged.footer.copyrightName, defaultContent.profile.name)
    assert.ok(merged.footer.tagline.en.length > 0)
  })
  await test("footer settings validate both localized copy and visibility toggles", () => {
    const c = clone(defaultContent)
    c.footer.tagline.id = "Penutup portofolio"
    c.footer.copyrightName = "zains403"
    c.footer.showEmail = false
    assert.equal(siteContentSchema.safeParse(c).success, true)
    const invalid = clone(defaultContent)
    ;(invalid.footer as { showStatus: unknown }).showStatus = "yes"
    assert.equal(siteContentSchema.safeParse(invalid).success, false)
  })
  await test("legacy footer without copyright owner gets the default and custom owner persists", () => {
    const old = clone(defaultContent)
    delete (old.footer as Partial<typeof old.footer>).copyrightName
    assert.equal(mergeContent(old).footer.copyrightName, defaultContent.profile.name)
    old.footer.copyrightName = "zains403"
    assert.equal(mergeContent(old).footer.copyrightName, "zains403")
  })
  await test("a valid certification is accepted", () => {
    const c = clone(defaultContent); c.certifications.items.push(cert())
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  const invalid: [string, Partial<Certification>][] = [
    ["empty name", { name: "   " }],
    ["bad kind", { kind: "other" as never }],
    ["bad category", { category: "yellow" as never }],
    ["javascript: verify URL", { verifyUrl: "javascript:alert(1)" }],
    ["data: image URL", { image: "data:image/png;base64,AAAA" }],
    ["year out of range", { acquiredYear: 1800 }],
    ["non-integer year", { issuedYear: 2024.5 }],
    ["expiry before issued", { issuedYear: 2025, expiryYear: 2023 }],
    ["bad id", { id: "Bad Id!" }],
  ]
  for (const [label, over] of invalid) {
    await test(`rejects ${label}`, () => {
      const c = clone(defaultContent); c.certifications.items.push(cert(over))
      assert.equal(siteContentSchema.safeParse(c).success, false)
    })
  }
  await test("rejects more than 60 certifications", () => {
    const c = clone(defaultContent)
    for (let i = 0; i < 61; i++) c.certifications.items.push(cert({ id: `c-test${String(i).padStart(4, "0")}` }))
    assert.equal(siteContentSchema.safeParse(c).success, false)
  })
  await test("every new copy key exists in both languages", () => {
    const en = Object.keys(defaultContent.copy.en), id = Object.keys(defaultContent.copy.id)
    assert.deepEqual(en.filter((k) => !id.includes(k)), []); assert.deepEqual(id.filter((k) => !en.includes(k)), [])
    for (const k of ["emptyBadge", "emptyTitle", "emptyText", "certTitle", "certGroupPro", "certGroupNon"]) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
  })

  console.log("skills")
  await test("default skills are empty and valid; old content without `skills` falls back", () => {
    assert.deepEqual(defaultContent.skills.items, []); assert.equal(defaultContent.skills.image, null)
    const old = clone(defaultContent) as Record<string, unknown>; delete old.skills
    assert.deepEqual(mergeContent(old).skills.items, [])
  })
  await test("a valid skill (with and without level) is accepted", () => {
    const c = clone(defaultContent); c.skills.items.push(skill(), skill({ id: "s-test0002", level: null, category: "red" }))
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  const badSkills: [string, Partial<Skill>][] = [
    ["empty name", { name: " " }], ["category purple (certs only)", { category: "purple" as never }],
    ["level 0", { level: 0 }], ["level 6", { level: 6 }], ["fractional level", { level: 2.5 }], ["bad id", { id: "X!" }],
  ]
  for (const [label, over] of badSkills) {
    await test(`skills reject ${label}`, () => { const c = clone(defaultContent); c.skills.items.push(skill(over)); assert.equal(siteContentSchema.safeParse(c).success, false) })
  }
  await test("skills reject javascript: / data: image and >120 items", () => {
    const a = clone(defaultContent); a.skills.image = "javascript:alert(1)"; assert.equal(siteContentSchema.safeParse(a).success, false)
    const b = clone(defaultContent); b.skills.image = "data:image/png;base64,AAAA"; assert.equal(siteContentSchema.safeParse(b).success, false)
    const c = clone(defaultContent); for (let i = 0; i < 121; i++) c.skills.items.push(skill({ id: `s-test${String(i).padStart(4, "0")}` }))
    assert.equal(siteContentSchema.safeParse(c).success, false)
  })
  await test("skills copy keys exist in EN and ID, incl. level names", () => {
    for (const k of ["skillsTitle", "skillsIntro", "skillGroupRed", "skillGroupBlue", "skillGroupGeneral", "skillColSkill", "skillLevel0", "skillLevel1", "skillLevel5", "navSkills"]) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
  })

  console.log("mitre")
  await test("default mitre is empty; old content without `mitre` falls back; valid techniques accepted", () => {
    assert.deepEqual(defaultContent.mitre.items, [])
    const old = clone(defaultContent) as Record<string, unknown>; delete old.mitre
    assert.deepEqual(mergeContent(old).mitre.items, [])
    const c = clone(defaultContent); c.mitre.items.push(mt(), mt({ id: "m-test0002", techniqueId: "", tactic: "impact" }), mt({ id: "m-test0003", techniqueId: "T1059" }))
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  const badM: [string, Partial<MitreTechnique>][] = [
    ["empty name", { name: " " }], ["unknown tactic", { tactic: "persistance" as never }], ["unknown exposure", { exposure: "expert" as never }],
    ["technique id 'T15'", { techniqueId: "T15" }], ["technique id with URL", { techniqueId: "javascript:alert(1)" }], ["lowercase id", { techniqueId: "t1566" }],
    ["sub-technique 2 digits", { techniqueId: "T1566.01" }], ["bad id", { id: "A!" }],
  ]
  for (const [label, over] of badM) await test(`mitre rejects ${label}`, () => { const c = clone(defaultContent); c.mitre.items.push(mt(over)); assert.equal(siteContentSchema.safeParse(c).success, false) })
  await test("mitre rejects >200 items; all 14 tactics have EN+ID names", () => {
    const c = clone(defaultContent); for (let i = 0; i < 201; i++) c.mitre.items.push(mt({ id: `m-test${String(i).padStart(4, "0")}` }))
    assert.equal(siteContentSchema.safeParse(c).success, false)
    assert.equal(mitreTacticIds.length, 14)
    for (const id of mitreTacticIds) assert.ok(defaultContent.copy.en[`mitreTac_${id}`] && defaultContent.copy.id[`mitreTac_${id}`], id)
    for (const k of ["mitreTitle", "mitreIntro", "mitreNote", "mitreExp_studied", "mitreExp_work", "navMitre"]) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
  })

  console.log("projects")
  await test("default projects is empty; old content without `projects` falls back; valid projects accepted", () => {
    assert.deepEqual(defaultContent.projects.items, [])
    const old = clone(defaultContent) as Record<string, unknown>; delete old.projects
    assert.deepEqual(mergeContent(old).projects.items, [])
    const c = clone(defaultContent)
    c.projects.items.push(proj(), proj({ id: "p-test0002", kind: "non-professional", status: "in-progress", year: null, thumbnail: "/uploads/x.png", repoUrl: "https://example.org/r", demoUrl: "https://example.org/d", reportUrl: "mailto:a@b.co" }))
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  const badP: [string, Partial<Project>][] = [
    ["empty name", { name: "  " }], ["bad kind", { kind: "other" as never }], ["bad domain", { domain: "yellow" as never }], ["bad status", { status: "done" as never }],
    ["year 1800", { year: 1800 }], ["year 2024.5", { year: 2024.5 }], ["javascript: repo link", { repoUrl: "javascript:alert(1)" }],
    ["javascript: demo link", { demoUrl: "javascript:alert(1)" }], ["data: report link", { reportUrl: "data:text/html,x" }], ["data: thumbnail", { thumbnail: "data:image/png;base64,AAAA" }],
    ["21 stack entries", { stack: Array.from({ length: 21 }, (_, i) => `T${i}`) }], ["stack entry > 40 chars", { stack: ["x".repeat(41)] }],
    ["description > 1200 chars", { description: { en: "x".repeat(1201), id: "" } }], ["outcome > 600 chars (ID)", { outcome: { en: "", id: "x".repeat(601) } }], ["bad id", { id: "P!" }],
  ]
  for (const [label, over] of badP) await test(`projects rejects ${label}`, () => { const c = clone(defaultContent); c.projects.items.push(proj(over)); assert.equal(siteContentSchema.safeParse(c).success, false) })
  await test("projects rejects >60 items; copy keys exist in EN and ID", () => {
    const c = clone(defaultContent); for (let i = 0; i < 61; i++) c.projects.items.push(proj({ id: `p-test${String(i).padStart(4, "0")}` }))
    assert.equal(siteContentSchema.safeParse(c).success, false)
    for (const k of ["navProjects", "projectsTitle", "projectsIntro", "projectsGroupPro", "projectsGroupNon", "projFeatured", "projColProject", "projStatus_completed", "projStatus_in-progress", "projStatus_archived", "projSecOutcome", "projLinkRepo"]) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
    const en = Object.keys(defaultContent.copy.en), id = Object.keys(defaultContent.copy.id)
    assert.deepEqual(en.filter((k) => !id.includes(k)), []); assert.deepEqual(id.filter((k) => !en.includes(k)), [])
  })

  console.log("tools")
  await test("default tools is empty; old content without `tools` falls back; valid entries accepted (level optional, never inferred)", () => {
    assert.deepEqual(defaultContent.tools.items, [])
    const old = clone(defaultContent) as Record<string, unknown>; delete old.tools
    assert.deepEqual(mergeContent(old).tools.items, [])
    const c = clone(defaultContent)
    c.tools.items.push(tl(), tl({ id: "tl-test0002", group: "programming", type: "language", domain: "general", level: "practicing", icon: "/api/media/abc123" }), tl({ id: "tl-test0003", domain: "dfir" }), tl({ id: "tl-test0004", domain: "web", level: "proficient" }))
    const parsed = siteContentSchema.safeParse(c); assert.equal(parsed.success, true)
    if (parsed.success) assert.deepEqual(parsed.data.tools.items.map((i) => i.level), [null, "practicing", null, "proficient"])
  })
  const badTools: [string, Partial<Tool>][] = [
    ["empty name", { name: "   " }], ["name > 100", { name: "x".repeat(101) }], ["unknown group", { group: "other" as never }],
    ["unknown type", { type: "weapon" as never }], ["unknown domain", { domain: "cloud" as never }], ["unknown level (expert)", { level: "expert" as never }],
    ["javascript: icon", { icon: "javascript:alert(1)" }], ["data: icon", { icon: "data:image/png;base64,AAAA" }],
    ["purpose > 300", { purpose: { en: "x".repeat(301), id: "" } }], ["workflow > 400", { workflow: { en: "", id: "x".repeat(401) } }],
    ["bad id", { id: "NO" }], ["non-boolean visible", { visible: "yes" as never }],
  ]
  for (const [label, over] of badTools) await test(`tools rejects ${label}`, () => { const c = clone(defaultContent); c.tools.items.push(tl(over)); assert.equal(siteContentSchema.safeParse(c).success, false) })
  await test("tools rejects >150 items; copy keys exist in EN and ID and stay symmetric", () => {
    const c = clone(defaultContent); for (let i = 0; i < 151; i++) c.tools.items.push(tl({ id: `tl-test${String(i).padStart(4, "0")}` }))
    assert.equal(siteContentSchema.safeParse(c).success, false)
    const keys = ["navTools", "toolsTitle", "toolsIntro", "toolsGroupProg", "toolsGroupSec", "toolsNoResults", "toolsShowMore", "toolsLevelNone", "toolsColTool", "toolsColLevel"]
    for (const type of ["language", "scripting", "framework", "platform", "security-tool", "other"]) keys.push(`toolType_${type}`)
    for (const d of ["red", "blue", "purple", "general", "dfir", "web"]) keys.push(`toolDomain_${d}`)
    for (const l of ["familiar", "practicing", "proficient"]) keys.push(`toolLevel_${l}`)
    for (const k of keys) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
    const en = Object.keys(defaultContent.copy.en), id = Object.keys(defaultContent.copy.id)
    assert.deepEqual(en.filter((k) => !id.includes(k)), []); assert.deepEqual(id.filter((k) => !en.includes(k)), [])
  })
  console.log("training & labs")
  await test("default training is empty; old content without `training` falls back; valid entries accepted", () => {
    assert.deepEqual(defaultContent.training.items, [])
    const old = clone(defaultContent) as Record<string, unknown>; delete old.training
    assert.deepEqual(mergeContent(old).training.items, [])
    const c = clone(defaultContent)
    c.training.items.push(tr(), tr({ id: "t-test0002", kind: "lab", status: "planned", startYear: null, endYear: null, evidenceUrl: "https://example.org/w" }), tr({ id: "t-test0003", status: "in-progress", endYear: null }))
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  await test("status is stored exactly as set (planned / in-progress are never converted)", () => {
    const c = clone(defaultContent); c.training.items.push(tr({ id: "t-test0004", status: "planned", startYear: 2020, endYear: 2021 }), tr({ id: "t-test0005", status: "in-progress", startYear: 2019, endYear: 2020 }))
    const parsed = siteContentSchema.parse(c)
    assert.deepEqual(parsed.training.items.map((i) => i.status), ["planned", "in-progress"])
  })
  const badT: [string, Partial<TrainingItem>][] = [
    ["empty name", { name: " " }], ["empty platform", { platform: "  " }], ["bad kind", { kind: "course" as never }], ["bad domain", { domain: "x" as never }], ["bad status", { status: "done" as never }],
    ["start year 1800", { startYear: 1800 }], ["end year 2200", { endYear: 2200 }], ["end before start", { startYear: 2025, endYear: 2023 }],
    ["javascript: evidence link", { evidenceUrl: "javascript:alert(1)" }], ["data: evidence link", { evidenceUrl: "data:text/html,x" }],
    ["31 modules", { modules: Array.from({ length: 31 }, (_, i) => `m${i}`) }], ["21 skills", { skills: Array.from({ length: 21 }, (_, i) => `s${i}`) }], ["21 tools", { tools: Array.from({ length: 21 }, (_, i) => `t${i}`) }],
    ["module > 120 chars", { modules: ["x".repeat(121)] }], ["description > 800 chars (ID)", { description: { en: "", id: "x".repeat(801) } }], ["bad id", { id: "T!" }],
  ]
  for (const [label, over] of badT) await test(`training rejects ${label}`, () => { const c = clone(defaultContent); c.training.items.push(tr(over)); assert.equal(siteContentSchema.safeParse(c).success, false) })
  await test("training rejects >120 items; copy keys exist in EN and ID and stay symmetric", () => {
    const c = clone(defaultContent); for (let i = 0; i < 121; i++) c.training.items.push(tr({ id: `t-test${String(i).padStart(4, "0")}` }))
    assert.equal(siteContentSchema.safeParse(c).success, false)
    for (const k of ["navTraining", "trainingTitle", "trainingIntro", "trainSecTraining", "trainSecLab", "trainStatus_completed", "trainStatus_in-progress", "trainStatus_planned", "trainEvidenceLab", "trainEvidenceTraining", "trainShowMore"]) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
    const en = Object.keys(defaultContent.copy.en), id = Object.keys(defaultContent.copy.id)
    assert.deepEqual(en.filter((k) => !id.includes(k)), []); assert.deepEqual(id.filter((k) => !en.includes(k)), [])
  })

  console.log("achievements")
  await test("default achievements empty (initial state is Coming Soon); old content falls back; valid entries accepted", () => {
    assert.deepEqual(defaultContent.achievements.items, [])
    const old = clone(defaultContent) as Record<string, unknown>; delete old.achievements
    assert.deepEqual(mergeContent(old).achievements.items, [])
    const c = clone(defaultContent); c.achievements.items.push(ac(), ac({ id: "a-test0002", year: null, issuer: "Org", proofUrl: "https://example.com/x" }))
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  const badA: [string, Partial<Achievement>][] = [
    ["empty title", { title: " " }], ["title >140", { title: "x".repeat(141) }], ["year 1800", { year: 1800 }], ["year 2101", { year: 2101 }], ["fractional year", { year: 2020.5 }],
    ["issuer >140", { issuer: "x".repeat(141) }], ["description >600", { description: { en: "x".repeat(601), id: "" } }],
    ["javascript: proof", { proofUrl: "javascript:alert(1)" }], ["data: proof", { proofUrl: "data:text/html,x" }], ["bad id", { id: "A!" }],
  ]
  for (const [label, over] of badA) await test(`achievements reject ${label}`, () => { const c = clone(defaultContent); c.achievements.items.push(ac(over)); assert.equal(siteContentSchema.safeParse(c).success, false) })
  await test("achievements reject >80 items; copy keys EN+ID", () => {
    const c = clone(defaultContent); for (let i = 0; i < 81; i++) c.achievements.items.push(ac({ id: `a-test${String(i).padStart(4, "0")}` }))
    assert.equal(siteContentSchema.safeParse(c).success, false)
    for (const k of ["navAchievements", "achievementsTitle", "achievementsIntro", "achColYear", "achColTitle", "achColDesc", "achColProof", "achViewProof", "achSearch", "achNoResults", "achShowMore", "achStatTotal"]) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
  })

  console.log("writeups")
  await test("default writeups empty; old content falls back; valid entries accepted (no link / no year allowed)", () => {
    assert.deepEqual(defaultContent.writeups.items, [])
    const old = clone(defaultContent) as Record<string, unknown>; delete old.writeups
    assert.deepEqual(mergeContent(old).writeups.items, [])
    const c = clone(defaultContent); c.writeups.items.push(wu(), wu({ id: "w-test0002", year: null, url: "", tags: [], blog: "" }))
    assert.equal(siteContentSchema.safeParse(c).success, true)
  })
  const badW: [string, Partial<Writeup>][] = [
    ["empty title", { title: " " }], ["title >140", { title: "x".repeat(141) }], ["blog >100", { blog: "x".repeat(101) }], ["year 1800", { year: 1800 }], ["fractional year", { year: 2020.5 }],
    ["summary >300", { summary: { en: "x".repeat(301), id: "" } }], ["9 tags", { tags: Array.from({ length: 9 }, (_, i) => "t" + i) }], ["empty tag", { tags: [""] }], ["31-char tag", { tags: ["x".repeat(31)] }],
    ["javascript: link", { url: "javascript:alert(1)" }], ["data: link", { url: "data:text/html,x" }], ["relative link", { url: "/admin" }], ["mailto link", { url: "mailto:a@b.co" }], ["ftp link", { url: "ftp://example.com/x" }], ["bad id", { id: "W!" }],
  ]
  for (const [label, over] of badW) await test(`writeups reject ${label}`, () => { const c = clone(defaultContent); c.writeups.items.push(wu(over)); assert.equal(siteContentSchema.safeParse(c).success, false) })
  await test("writeups reject >100 items; copy keys EN+ID", () => {
    const c = clone(defaultContent); for (let i = 0; i < 101; i++) c.writeups.items.push(wu({ id: `w-test${String(i).padStart(4, "0")}` }))
    assert.equal(siteContentSchema.safeParse(c).success, false)
    for (const k of ["navWriteups", "writeupsTitle", "writeupsIntro", "wuRead", "wuNoLink", "wuSearch", "wuFilterTag", "wuNoResults", "wuShowMore", "wuStatTotal", "wuStatBlogs"]) assert.ok(defaultContent.copy.en[k] && defaultContent.copy.id[k], k)
  })

  console.log("save / restore (file store)")
  let current = await getContent()
  await test("starts at version 0 with no certifications", () => { assert.equal(current.version, 0); assert.equal(current.certifications.items.length, 0) })
  await test("save persists certifications, bumps version and keeps other content", async () => {
    const draft = clone(current); draft.certifications.items.push(cert({ description: { en: "English", id: "Indonesia" } }))
    const saved = await saveContent(draft, current.version, "test")
    assert.equal(saved.version, 1)
    const reread = await getContent()
    assert.equal(reread.certifications.items[0].description.id, "Indonesia")
    assert.equal(reread.certifications.items[0].description.en, "English")
    assert.deepEqual(reread.education, current.education)
    assert.deepEqual(reread.profile, current.profile)
    current = reread
  })
  await test("invalid content is rejected with a ValidationError and nothing is saved", async () => {
    const draft = clone(current); draft.certifications.items[0].verifyUrl = "javascript:alert(1)"
    await assert.rejects(() => saveContent(draft, current.version, "test"), ValidationError)
    assert.equal((await getContent()).version, current.version)
  })
  await test("stale baseVersion is rejected with a ConflictError", async () => {
    await assert.rejects(() => saveContent(clone(current), current.version - 1, "test"), ConflictError)
  })
  await test("restore brings back the empty state and leaves other content untouched", async () => {
    const before = clone(current)
    const restored = await restoreVersion(0, current.version, "test")
    assert.equal(restored.certifications.items.length, 0)
    assert.deepEqual(restored.education, before.education)
    assert.ok((await getHistory()).some((h) => h.version === 1))
  })
  await test("skills save/restore: persisted, other content untouched, invalid rejected", async () => {
    const cur = await getContent(); const next = clone(cur); next.skills.items.push(skill({ description: { en: "EN text", id: "Teks ID" } }))
    const saved = await saveContent(next, cur.version, "test")
    assert.equal(saved.skills.items[0].description.id, "Teks ID"); assert.deepEqual(saved.education, cur.education)
    const bad = clone(saved); bad.skills.items[0].level = 9
    await assert.rejects(() => saveContent(bad, saved.version, "test"), ValidationError)
    assert.equal((await getContent()).skills.items.length, 1)
    const after = await getContent(); const empty = clone(after); empty.skills.items = []
    await saveContent(empty, after.version, "test")
  })
  await test("mitre save/restore: persisted, other content untouched", async () => {
    const cur = await getContent(); const next = clone(cur); next.mitre.items.push(mt({ description: { en: "EN", id: "Teks ID" } }))
    const saved = await saveContent(next, cur.version, "test")
    assert.equal(saved.mitre.items[0].description.id, "Teks ID"); assert.deepEqual(saved.skills, cur.skills)
    const bad = clone(saved); bad.mitre.items[0].techniqueId = "bad"
    await assert.rejects(() => saveContent(bad, saved.version, "test"), ValidationError)
    assert.equal((await getContent()).mitre.items.length, 1)
  })
  await test("projects save/restore: persisted per language, other content untouched, invalid rejected", async () => {
    const cur = await getContent(); const next = clone(cur)
    next.projects.items.push(proj({ featured: true, description: { en: "EN scope", id: "Lingkup ID" }, stack: ["Splunk", "Python"] }))
    const saved = await saveContent(next, cur.version, "test")
    assert.equal(saved.projects.items[0].description.id, "Lingkup ID"); assert.equal(saved.projects.items[0].description.en, "EN scope")
    assert.deepEqual(saved.projects.items[0].stack, ["Splunk", "Python"]); assert.equal(saved.projects.items[0].featured, true)
    assert.deepEqual(saved.mitre, cur.mitre); assert.deepEqual(saved.skills, cur.skills); assert.deepEqual(saved.education, cur.education)
    const bad = clone(saved); bad.projects.items[0].reportUrl = "javascript:alert(1)"
    await assert.rejects(() => saveContent(bad, saved.version, "test"), ValidationError)
    assert.equal((await getContent()).projects.items.length, 1)
    const after = await getContent(); const empty = clone(after); empty.projects.items = []
    const cleared = await saveContent(empty, after.version, "test")
    assert.equal(cleared.projects.items.length, 0)
  })
  await test("training save/restore: persisted per language, status kept, other content untouched, invalid rejected", async () => {
    const cur = await getContent(); const next = clone(cur)
    next.training.items.push(tr({ kind: "lab", status: "in-progress", description: { en: "EN did", id: "ID kerjakan" }, tools: ["Burp Suite"] }))
    const saved = await saveContent(next, cur.version, "test")
    assert.equal(saved.training.items[0].description.id, "ID kerjakan"); assert.equal(saved.training.items[0].description.en, "EN did")
    assert.equal(saved.training.items[0].status, "in-progress"); assert.deepEqual(saved.training.items[0].tools, ["Burp Suite"])
    assert.deepEqual(saved.projects, cur.projects); assert.deepEqual(saved.mitre, cur.mitre); assert.deepEqual(saved.skills, cur.skills); assert.deepEqual(saved.education, cur.education)
    const bad = clone(saved); bad.training.items[0].evidenceUrl = "javascript:alert(1)"
    await assert.rejects(() => saveContent(bad, saved.version, "test"), ValidationError)
    assert.equal((await getContent()).training.items.length, 1)
    const after = await getContent(); const empty = clone(after); empty.training.items = []
    assert.equal((await saveContent(empty, after.version, "test")).training.items.length, 0)
  })
  await test("tools save/restore: persisted per language, level kept, other content untouched, invalid rejected", async () => {
    const cur = await getContent(); const next = clone(cur)
    next.tools.items.push(tl({ group: "programming", type: "language", level: "practicing", purpose: { en: "EN purpose", id: "Tujuan ID" }, workflow: { en: "EN flow", id: "Alur ID" } }))
    const saved = await saveContent(next, cur.version, "test")
    assert.equal(saved.tools.items[0].purpose.id, "Tujuan ID"); assert.equal(saved.tools.items[0].purpose.en, "EN purpose"); assert.equal(saved.tools.items[0].workflow.id, "Alur ID")
    assert.equal(saved.tools.items[0].level, "practicing")
    assert.deepEqual(saved.training, cur.training); assert.deepEqual(saved.projects, cur.projects); assert.deepEqual(saved.mitre, cur.mitre); assert.deepEqual(saved.skills, cur.skills); assert.deepEqual(saved.education, cur.education)
    const bad = clone(saved); bad.tools.items[0].icon = "javascript:alert(1)"
    await assert.rejects(() => saveContent(bad, saved.version, "test"), ValidationError)
    assert.equal((await getContent()).tools.items.length, 1)
    const after = await getContent(); const empty = clone(after); empty.tools.items = []
    assert.equal((await saveContent(empty, after.version, "test")).tools.items.length, 0)
  })
  await test("achievements save/restore: persisted per language, other content untouched, invalid rejected", async () => {
    const cur = await getContent(); const next = clone(cur); next.achievements.items.push(ac({ description: { en: "EN text", id: "Teks ID" } }))
    const saved = await saveContent(next, cur.version, "test")
    assert.equal(saved.achievements.items[0].description.id, "Teks ID"); assert.equal(saved.achievements.items[0].description.en, "EN text"); assert.deepEqual(saved.tools, cur.tools)
    const bad = clone(saved); bad.achievements.items[0].proofUrl = "javascript:1"
    await assert.rejects(() => saveContent(bad, saved.version, "test"), ValidationError)
    assert.equal((await getContent()).achievements.items.length, 1)
  })
  await test("writeups save/restore: persisted per language, other content untouched, invalid rejected", async () => {
    const cur = await getContent(); const next = clone(cur); next.writeups.items.push(wu({ summary: { en: "EN text", id: "Teks ID" } }))
    const saved = await saveContent(next, cur.version, "test")
    assert.equal(saved.writeups.items[0].summary.id, "Teks ID"); assert.equal(saved.writeups.items[0].summary.en, "EN text"); assert.deepEqual(saved.achievements, cur.achievements)
    const bad = clone(saved); bad.writeups.items[0].url = "javascript:1"
    await assert.rejects(() => saveContent(bad, saved.version, "test"), ValidationError)
    assert.equal((await getContent()).writeups.items.length, 1)
  })
  console.log(`\n${passed} passed${process.exitCode ? " — with failures" : ""}`)
}
void main()
