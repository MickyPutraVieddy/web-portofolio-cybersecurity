import { z } from "zod"
import { isValidEmail } from "@/lib/contact"

/** Only relative paths, http(s) and mailto links may be stored — never javascript:/data: URLs. */
export function isSafeUrl(value: string): boolean {
  if (value === "") return true
  if (value.startsWith("/") && !value.startsWith("//")) return !/[\\\s]/.test(value)
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:"
  } catch { return false }
}

const text = (max = 400) => z.string().max(max)
const url = z.string().max(2000).refine(isSafeUrl, "Unsafe or invalid URL")
const localized = <T extends z.ZodTypeAny>(schema: T) => z.object({ en: schema, id: schema })
const commandName = z.string().regex(/^[a-z][a-z0-9_-]{0,19}$/, "Use lowercase letters, digits, - or _")

const timelineEntry = z.object({
  period: text(80), title: text(140), org: text(140),
  detail: text(240).optional(), points: z.array(text(240)).max(12).optional(),
})

export const certKinds = ["professional", "non-professional"] as const
export const certCategories = ["red", "blue", "purple", "general"] as const
/** "by-expiry": Active/Expired is computed from expiryYear. The other two are stated by the owner. */
export const certValidity = ["by-expiry", "lifetime", "not-specified"] as const

const year = z.number().int().min(1990).max(2100).nullable()
const certification = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  visible: z.boolean(),
  name: z.string().trim().min(1, "Name is required").max(140),
  kind: z.enum(certKinds),
  category: z.enum(certCategories),
  issuer: text(140),
  credential: text(200),
  acquiredYear: year,
  issuedYear: year,
  expiryYear: year,
  validity: z.enum(certValidity),
  description: localized(text(600)),
  image: url.nullable(),
  imageAlt: localized(text(200)),
  verifyUrl: url,
}).superRefine((item, ctx) => {
  if (item.issuedYear !== null && item.expiryYear !== null && item.expiryYear < item.issuedYear) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expiryYear"], message: "Expiry year cannot be before the issued year" })
  }
})

export const skillCategories = ["red", "blue", "general"] as const
const skill = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  visible: z.boolean(),
  name: z.string().trim().min(1, "Name is required").max(100),
  category: z.enum(skillCategories),
  /** 1 (beginner) … 5 (expert); null = not rated (no bar is drawn). */
  level: z.number().int().min(1).max(5).nullable(),
  description: localized(text(300)),
})

export const mitreTacticIds = ["reconnaissance", "resource-development", "initial-access", "execution", "persistence", "privilege-escalation", "defense-evasion", "credential-access", "discovery", "lateral-movement", "collection", "command-and-control", "exfiltration", "impact"] as const
/** Official ATT&CK tactic codes (reference data, not a claim about the owner). */
export const mitreTacticCodes: Record<typeof mitreTacticIds[number], string> = {
  "reconnaissance": "TA0043",
  "resource-development": "TA0042",
  "initial-access": "TA0001",
  "execution": "TA0002",
  "persistence": "TA0003",
  "privilege-escalation": "TA0004",
  "defense-evasion": "TA0005",
  "credential-access": "TA0006",
  "discovery": "TA0007",
  "lateral-movement": "TA0008",
  "collection": "TA0009",
  "command-and-control": "TA0011",
  "exfiltration": "TA0010",
  "impact": "TA0040",
}
export const mitreExposures = ["studied", "lab", "project", "work"] as const
const mitreTechnique = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  visible: z.boolean(),
  tactic: z.enum(mitreTacticIds),
  /** Official ATT&CK technique ID, e.g. T1566 or T1566.001. Empty = unspecified (no link is drawn). */
  techniqueId: z.string().regex(/^(T\d{4}(\.\d{3})?)?$/, "Use the format T1566 or T1566.001"),
  name: z.string().trim().min(1, "Name is required").max(140),
  exposure: z.enum(mitreExposures),
  description: localized(text(400)),
})

export const projectKinds = ["professional", "non-professional"] as const
export const projectDomains = ["red", "blue", "purple", "general"] as const
export const projectStatuses = ["completed", "in-progress", "archived"] as const
const project = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  visible: z.boolean(),
  /** Highlighted in the "Featured" row on the public page (the first three are shown). */
  featured: z.boolean(),
  name: z.string().trim().min(1, "Name is required").max(140),
  kind: z.enum(projectKinds),
  domain: z.enum(projectDomains),
  status: z.enum(projectStatuses),
  year: year,
  /** Free text such as "Jan – Mar 2025". Optional. */
  period: text(80),
  summary: localized(text(300)),
  description: localized(text(1200)),
  role: localized(text(600)),
  method: localized(text(600)),
  outcome: localized(text(600)),
  /** Tool / technology names; not translated. */
  stack: z.array(text(40)).max(20),
  thumbnail: url.nullable(),
  thumbnailAlt: localized(text(200)),
  repoUrl: url,
  demoUrl: url,
  reportUrl: url,
})

export const trainingKinds = ["training", "lab"] as const
export const trainingDomains = ["red", "blue", "purple", "general"] as const
/** Never changed automatically: Planned / In Progress stay as the owner set them. */
export const trainingStatuses = ["completed", "in-progress", "planned"] as const
const trainingItem = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  visible: z.boolean(),
  kind: z.enum(trainingKinds),
  platform: z.string().trim().min(1, "Platform is required").max(100),
  name: z.string().trim().min(1, "Name is required").max(140),
  domain: z.enum(trainingDomains),
  status: z.enum(trainingStatuses),
  startYear: year,
  endYear: year,
  focus: localized(text(200)),
  objective: localized(text(400)),
  description: localized(text(800)),
  /** Modules / rooms / lessons completed (optional). */
  modules: z.array(text(120)).max(30),
  skills: z.array(text(60)).max(20),
  tools: z.array(text(40)).max(20),
  /** Certificate / badge / writeup / evidence link (optional). */
  evidenceUrl: url,
}).superRefine((item, ctx) => {
  if (item.startYear !== null && item.endYear !== null && item.endYear < item.startYear) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endYear"], message: "End year cannot be before the start year" })
  }
})

export const toolGroups = ["programming", "security"] as const
export const toolTypes = ["language", "scripting", "framework", "platform", "security-tool", "other"] as const
export const toolDomains = ["red", "blue", "purple", "general", "dfir", "web"] as const
/** Optional and chosen by the owner; never inferred. null = not stated (no meter is drawn). */
export const toolLevels = ["familiar", "practicing", "proficient"] as const
const tool = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  visible: z.boolean(),
  group: z.enum(toolGroups),
  name: z.string().trim().min(1, "Name is required").max(100),
  type: z.enum(toolTypes),
  domain: z.enum(toolDomains),
  purpose: localized(text(300)),
  /** Associated workflow or example usage (optional). */
  workflow: localized(text(400)),
  level: z.enum(toolLevels).nullable(),
  /** Optional logo / icon (uploaded through the Admin). Empty = a generic icon is drawn. */
  icon: url.nullable(),
})

const achievement = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  visible: z.boolean(),
  title: z.string().trim().min(1, "Title is required").max(140),
  /** Year received; null = not stated. */
  year: year,
  /** Awarding organisation, event or platform (optional, not translated). */
  issuer: text(140),
  description: localized(text(600)),
  /** Optional link to evidence (announcement, certificate page, write-up). */
  proofUrl: url,
})

/** A write-up link must be a real web address (http/https), never a relative path or mailto. Empty = no button. */
const webUrl = z.string().max(2000).refine((v) => v === "" || (/^https?:\/\//i.test(v) && isSafeUrl(v)), "Use a full http(s) link")
const writeup = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  visible: z.boolean(),
  title: z.string().trim().min(1, "Title is required").max(140),
  /** Blog / platform name, e.g. the site hosting the write-up. Not translated. */
  blog: z.string().trim().max(100),
  year: year,
  summary: localized(text(300)),
  /** Short labels such as "web", "forensics". Not translated. */
  tags: z.array(z.string().trim().min(1).max(30)).max(8),
  url: webUrl,
})

export const socialPlatforms = ["discord", "linkedin", "github", "instagram", "x", "youtube", "facebook", "tiktok", "telegram", "whatsapp", "threads", "bluesky", "mastodon", "reddit", "twitch", "medium", "devto", "hashnode", "substack", "wordpress", "blogger", "ghost", "gitlab", "stackoverflow", "hackerone", "bugcrowd", "tryhackme", "hackthebox", "credly", "signal", "spotify", "kofi", "behance", "pinterest", "linktree", "other", "custom"] as const
const social = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
  /** A link is only shown on the site when it is visible AND has a URL. */
  visible: z.boolean(),
  platform: z.enum(socialPlatforms),
  /** Only used when platform = "custom": your own icon image (PNG / JPEG / WebP / SVG). */
  icon: url.nullable().default(null),
  /** Username / handle / label shown next to the icon. Empty = the platform name is shown. */
  label: z.string().trim().max(80),
  url: webUrl,
  description: localized(text(160)),
})
const contactEmail = z.string().trim().max(254).refine((v) => v === "" || isValidEmail(v), "Use a valid email address")


const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit HEX color")
const mediaUrl = z.string().max(2000).refine((value) => {
  if (value === "") return true
  if (value.startsWith("/") && !value.startsWith("//")) return !/[\\\s]/.test(value)
  try { const parsed = new URL(value); return parsed.protocol === "https:" || parsed.protocol === "http:" } catch { return false }
}, "Use an http(s) image URL or a safe relative path")
const customBlockBase = { id: z.string().regex(/^[a-z0-9-]{4,48}$/) }
const customBlock = z.discriminatedUnion("type", [
  z.object({ ...customBlockBase, type: z.literal("hero"), eyebrow: localized(text(80)), heading: localized(text(140)), body: localized(text(1200)) }),
  z.object({ ...customBlockBase, type: z.literal("text"), heading: localized(text(140)), body: localized(text(2400)) }),
  z.object({ ...customBlockBase, type: z.literal("image"), image: mediaUrl.nullable(), alt: localized(text(200)), caption: localized(text(240)) }),
  z.object({ ...customBlockBase, type: z.literal("cards"), heading: localized(text(140)), items: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]{4,48}$/), title: localized(text(120)), body: localized(text(600)), tag: text(40) })).max(12) }),
  z.object({ ...customBlockBase, type: z.literal("stats"), heading: localized(text(140)), items: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]{4,48}$/), value: text(32), label: localized(text(80)) })).max(8) }),
  z.object({ ...customBlockBase, type: z.literal("timeline"), heading: localized(text(140)), items: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]{4,48}$/), period: text(80), title: localized(text(120)), body: localized(text(600)) })).max(16) }),
  z.object({ ...customBlockBase, type: z.literal("gallery"), heading: localized(text(140)), images: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]{4,48}$/), image: mediaUrl, alt: localized(text(200)) })).max(12) }),
  z.object({ ...customBlockBase, type: z.literal("cta"), heading: localized(text(140)), body: localized(text(600)), buttonLabel: localized(text(80)), href: url }),
  z.object({ ...customBlockBase, type: z.literal("divider") }),
])

function validateCustomBlockIds(blocks: z.infer<typeof customBlock>[], ctx: z.RefinementCtx) {
  const ids = new Set<string>()
  const add = (id: string, path: (string | number)[]) => {
    if (ids.has(id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path, message: "Block and item IDs must be unique within a page or template" })
    ids.add(id)
  }
  blocks.forEach((block, index) => {
    add(block.id, ["blocks", index, "id"])
    if (block.type === "cards" || block.type === "stats" || block.type === "timeline") block.items.forEach((item, itemIndex) => add(item.id, ["blocks", index, "items", itemIndex, "id"]))
    if (block.type === "gallery") block.images.forEach((item, itemIndex) => add(item.id, ["blocks", index, "images", itemIndex, "id"]))
  })
}
export const customPageSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(48),
  title: localized(text(120)),
  summary: localized(text(400)),
  visible: z.boolean(),
  /** Adds an in-page anchor link for this section to the navbar (same homepage, no separate route). */
  showInNav: z.boolean().default(false),
  /** Position inside the single homepage section flow; not a separate route. */
  order: z.number().int().min(0).max(99).default(50),
  accentColor: hexColor,
  secondaryColor: hexColor,
  blocks: z.array(customBlock).max(40),
}).superRefine((page, ctx) => validateCustomBlockIds(page.blocks, ctx))
export const customTemplateSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{4,48}$/),
  name: z.string().trim().min(1).max(80),
  accentColor: hexColor,
  secondaryColor: hexColor,
  blocks: z.array(customBlock).max(40),
}).superRefine((template, ctx) => validateCustomBlockIds(template.blocks, ctx))
export const customPagesSchema = z.object({
  pages: z.array(customPageSchema).max(24),
  templates: z.array(customTemplateSchema).max(24),
})
export const appearanceSchema = z.object({
  preset: z.enum(["blue", "red", "purple", "general", "custom"]),
  accentColor: hexColor,
  secondaryColor: hexColor,
  glow: z.number().int().min(0).max(100),
  cursorEffect: z.boolean().default(true),
  cursorIntensity: z.number().int().min(0).max(100).default(35),
  headingFont: z.enum(["inter", "plex-mono", "system"]),
  bodyFont: z.enum(["inter", "plex-mono", "system"]),
  monoFont: z.enum(["plex-mono", "inter", "system"]),
  headingWeight: z.enum(["600", "700", "800"]),
})

export type CustomBlock = z.infer<typeof customBlock>
export type CustomPage = z.infer<typeof customPageSchema>
export type CustomTemplate = z.infer<typeof customTemplateSchema>

export const sectionIds = [
  "header", "intro", "about", "education", "experience", "certifications", "skills", "mitre",
  "projects", "training", "tools", "achievements", "writeups", "contact", "footer",
] as const

export const siteContentSchema = z.object({
  version: z.number().int().nonnegative(),
  appearance: appearanceSchema,
  customPages: customPagesSchema,
  profile: z.object({
    name: text(80), givenNames: text(80), familyName: text(60), handle: text(40), brandLogo: url.nullable(),
    role: localized(text(120)), location: localized(text(120)), description: localized(text(1200)),
    resume: localized(url.nullable()), portrait: url.nullable(), adminLogo: url.nullable(),
    credentials: z.array(text(80)).max(12),
    focus: localized(z.array(text(80)).max(12)),
  }),
  copy: localized(z.record(text(500))),
  aboutRows: localized(z.array(z.object({ label: text(60), value: text(400) })).max(20)),
  statusLine: localized(text(300)),
  terminalOutput: localized(z.record(commandName, z.array(text(300)).max(40))),
  quickCommands: z.array(commandName).max(10),
  education: localized(z.array(timelineEntry).max(20)),
  experience: localized(z.array(timelineEntry).max(20)),
  certifications: z.object({ items: z.array(certification).max(60) }),
  skills: z.object({ image: url.nullable(), imageAlt: localized(text(200)), items: z.array(skill).max(120) }),
  mitre: z.object({ items: z.array(mitreTechnique).max(200) }),
  projects: z.object({ items: z.array(project).max(60) }),
  training: z.object({ items: z.array(trainingItem).max(120) }),
  writeups: z.object({ items: z.array(writeup).max(100) }),
  /** `email` is the address shown publicly (optional). The inbox that receives the form is a server env var, not stored here. */
  contact: z.object({ email: contactEmail, socials: z.array(social).max(12) }),
  /** Footer presentation settings. Social destinations are shared with Contact to avoid maintaining duplicate URLs. */
  footer: z.object({
    tagline: localized(text(240)),
    connectLabel: localized(text(80)),
    transmissionLabel: localized(text(80)),
    statusLabel: localized(text(80)),
    bottomNote: localized(text(180)),
    backToTopLabel: localized(text(60)),
    rightsText: localized(text(100)),
    copyrightName: text(100),
    showStatus: z.boolean(),
    showSocials: z.boolean(),
    showEmail: z.boolean(),
    showBottomNote: z.boolean(),
    showBackToTop: z.boolean(),
    showCopyright: z.boolean(),
  }),
  achievements: z.object({ items: z.array(achievement).max(80) }),
  tools: z.object({ items: z.array(tool).max(150) }),
  sections: z.array(z.object({
    id: z.enum(sectionIds), editorLabel: text(80), order: z.number().int().min(0).max(99), visible: z.boolean(),
  })).max(20),
}).superRefine((content, ctx) => {
  const ids = new Set<string>()
  const slugs = new Set<string>()
  content.customPages.pages.forEach((page, index) => {
    if (ids.has(page.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["customPages", "pages", index, "id"], message: "Custom page IDs must be unique" })
    if (slugs.has(page.slug)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["customPages", "pages", index, "slug"], message: "Custom homepage section slugs must be unique" })
    ids.add(page.id); slugs.add(page.slug)
  })
  const templateIds = new Set<string>()
  content.customPages.templates.forEach((template, index) => {
    if (templateIds.has(template.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["customPages", "templates", index, "id"], message: "Template IDs must be unique" })
    templateIds.add(template.id)
  })
})

export type SiteContent = z.infer<typeof siteContentSchema>
export type TimelineItem = z.infer<typeof timelineEntry>
export type Certification = z.infer<typeof certification>
export type Skill = z.infer<typeof skill>
export type MitreTechnique = z.infer<typeof mitreTechnique>
export type Project = z.infer<typeof project>
export type Writeup = z.infer<typeof writeup>
export type SocialLink = z.infer<typeof social>
export type Achievement = z.infer<typeof achievement>
export type TrainingItem = z.infer<typeof trainingItem>
export type Tool = z.infer<typeof tool>
