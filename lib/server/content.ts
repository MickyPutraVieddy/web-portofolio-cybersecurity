import { siteContentSchema, type SiteContent } from "@/lib/content-schema"
import { defaultContent, mergeContent } from "@/lib/site-content"
import { getStore } from "@/lib/server/store"

const CURRENT = "content:current"
const HISTORY = "content:history"
const AUDIT = "audit:log"
const HISTORY_LIMIT = 10
const AUDIT_LIMIT = 100

export interface HistoryItem { version: number; savedAt: string; by: string; content: SiteContent }
export interface AuditItem { at: string; actor: string; action: string; detail?: string }

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await getStore().get(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

/** Public read. Never throws: any storage or data problem falls back to the built-in content. */
export async function getContent(): Promise<SiteContent> {
  return mergeContent(await readJson<unknown>(CURRENT, null))
}

export async function getHistory(): Promise<HistoryItem[]> {
  return readJson<HistoryItem[]>(HISTORY, [])
}

export async function getAudit(): Promise<AuditItem[]> {
  return readJson<AuditItem[]>(AUDIT, [])
}

export async function writeAudit(actor: string, action: string, detail?: string) {
  const log = await getAudit()
  log.unshift({ at: new Date().toISOString(), actor, action, ...(detail ? { detail: detail.slice(0, 200) } : {}) })
  await getStore().set(AUDIT, JSON.stringify(log.slice(0, AUDIT_LIMIT)))
}

export class ConflictError extends Error {}
export class ValidationError extends Error {
  constructor(public issues: { path: string; message: string }[]) { super("Invalid content") }
}

/** Drops keys that do not exist in the built-in copy so the admin cannot invent new ones. */
function pruneCopy(content: SiteContent): SiteContent {
  const next = { ...content, copy: { en: {}, id: {} } as SiteContent["copy"] }
  for (const locale of ["en", "id"] as const) {
    for (const key of Object.keys(defaultContent.copy[locale])) {
      next.copy[locale][key] = content.copy[locale][key] ?? defaultContent.copy[locale][key]
    }
  }
  return next
}

export async function saveContent(input: unknown, baseVersion: number, actor: string): Promise<SiteContent> {
  const parsed = siteContentSchema.safeParse(input)
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues.slice(0, 8).map((issue) => ({ path: issue.path.join("."), message: issue.message })))
  }
  const current = await getContent()
  if (baseVersion !== current.version) throw new ConflictError("Content was changed elsewhere. Reload before saving.")
  const history = await getHistory()
  history.unshift({ version: current.version, savedAt: new Date().toISOString(), by: actor, content: current })
  const next: SiteContent = { ...pruneCopy(parsed.data), version: current.version + 1 }
  const store = getStore()
  await store.set(HISTORY, JSON.stringify(history.slice(0, HISTORY_LIMIT)))
  await store.set(CURRENT, JSON.stringify(next))
  await writeAudit(actor, "save", `v${current.version} → v${next.version}`)
  return next
}

export async function restoreVersion(version: number, baseVersion: number, actor: string): Promise<SiteContent> {
  const target = (await getHistory()).find((item) => item.version === version)
  if (!target) throw new ValidationError([{ path: "version", message: "Version not found" }])
  const restored = await saveContent(target.content, baseVersion, actor)
  await writeAudit(actor, "restore", `restored content of v${version}`)
  return restored
}

// ---- media ---------------------------------------------------------------------------
const MAX_IMAGE_BYTES = 700 * 1024
const signatures: { mime: string; test: (b: Buffer) => boolean }[] = [
  { mime: "image/png", test: (b) => b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/jpeg", test: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/webp", test: (b) => b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
]

/** Accepts PNG / JPEG / WebP only, checked by file signature (never by the client-sent type). */
export async function saveMedia(bytes: Buffer, actor: string): Promise<string> {
  if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) throw new ValidationError([{ path: "file", message: "Image must be under 700 KB" }])
  const match = signatures.find((item) => item.test(bytes))
  if (!match) throw new ValidationError([{ path: "file", message: "Only PNG, JPEG or WebP images are allowed" }])
  const id = (await import("node:crypto")).randomBytes(12).toString("hex")
  await getStore().set(`media:${id}`, JSON.stringify({ mime: match.mime, data: bytes.toString("base64") }))
  await writeAudit(actor, "upload", `${match.mime} ${Math.round(bytes.length / 1024)}KB`)
  return `/api/media/${id}`
}

export async function readMedia(id: string): Promise<{ mime: string; bytes: Buffer } | null> {
  if (!/^[a-f0-9]{24}$/.test(id)) return null
  const record = await readJson<{ mime: string; data: string } | null>(`media:${id}`, null)
  return record ? { mime: record.mime, bytes: Buffer.from(record.data, "base64") } : null
}
