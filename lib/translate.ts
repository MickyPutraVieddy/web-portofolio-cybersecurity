import type { SiteContent } from "@/lib/content-schema"

/**
 * Dynamic translation, pure part (runs in the browser AND on the server).
 *
 * English is the only language you write. Every `{ en, id }` pair in the content gets its
 * Indonesian side generated from the English side. A dictionary maps `hash(englishText)`
 * to the translated text; texts that are not translated yet simply stay in English.
 */

export type Dictionary = Record<string, string>

/** Terms that must never be translated (product names, certifications, jargon). */
export const PROTECTED_TERMS = [
  "CompTIA Security+", "Google Cybersecurity", "MITRE ATT&CK", "TryHackMe", "HackTheBox", "Hack The Box",
  "Blue Team", "Red Team", "Purple Team", "InfoSec", "Cisco", "Splunk", "Wireshark", "Burp Suite", "Nmap",
  "Metasploit", "Kali Linux", "Elastic", "Sentinel", "CrowdStrike", "VirusTotal", "n8n", "SIEM", "DFIR",
  "SOAR", "EDR", "XDR", "OSINT", "SOC", "CTF", "CVE",
]

/** Object keys inside a translatable subtree whose values are data, never prose. */
const SKIP_KEYS = new Set(["id", "url", "href", "image", "icon", "platform", "slug", "type", "kind", "color", "category", "tag", "techniqueId", "email"])

export const MAX_TEXT = 1500

/** Small, fast, deterministic 53-bit hash (cyrb53). Same result in Node and the browser. */
export function hashText(text: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

/**
 * Splits a string into the part that is translated and the formatting around it, so spacing survives:
 * "  whoami      who I am" -> prefix "  whoami      ", body "who I am".
 */
export function splitShape(text: string): { prefix: string; body: string; suffix: string } {
  const command = /^(\s*\S+\s{2,})(\S.*?)(\s*)$/s.exec(text)
  if (command && /^\s+/.test(text)) return { prefix: command[1], body: command[2], suffix: command[3] }
  const plain = /^(\s*)(.*?)(\s*)$/s.exec(text)!
  return { prefix: plain[1], body: plain[2], suffix: plain[3] }
}

/** Only real prose is translated: not URLs, e-mails, numbers, hex colors, paths or too-short tokens. */
export function isTranslatable(text: string): boolean {
  const body = splitShape(text).body
  if (body.length < 2 || body.length > MAX_TEXT) return false
  if (!/\p{L}{2,}/u.test(body)) return false
  if (/^(https?:\/\/|mailto:|\/|#|data:)/i.test(body)) return false
  if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(body)) return false
  if (/^[\w.-]+\.(txt|png|jpe?g|webp|svg|pdf)$/i.test(body)) return false
  return true
}

/** The exact text that is sent to the translator and used for the hash. */
export const sourceOf = (text: string) => splitShape(text).body

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value)

/** `{ en, id }` and nothing else. */
const isPair = (value: unknown): value is { en: unknown; id: unknown } => {
  if (!isRecord(value)) return false
  const keys = Object.keys(value)
  return keys.length === 2 && "en" in value && "id" in value
}

function visitStrings(node: unknown, visit: (text: string) => void) {
  if (typeof node === "string") { if (isTranslatable(node)) visit(sourceOf(node)); return }
  if (Array.isArray(node)) { for (const item of node) visitStrings(item, visit); return }
  if (isRecord(node)) for (const [key, value] of Object.entries(node)) if (!SKIP_KEYS.has(key)) visitStrings(value, visit)
}

function mapStrings(node: unknown, dict: Dictionary): unknown {
  if (typeof node === "string") {
    if (!isTranslatable(node)) return node
    const { prefix, body, suffix } = splitShape(node)
    const done = dict[hashText(body)]
    return done ? prefix + done + suffix : node
  }
  if (Array.isArray(node)) return node.map((item) => mapStrings(item, dict))
  if (isRecord(node)) {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(node)) out[key] = SKIP_KEYS.has(key) ? value : mapStrings(value, dict)
    return out
  }
  return node
}

function walk(node: unknown, onPair: (en: unknown) => unknown): unknown {
  if (Array.isArray(node)) return node.map((item) => walk(item, onPair))
  if (isPair(node)) return { en: node.en, id: onPair(node.en) }
  if (isRecord(node)) {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(node)) out[key] = walk(value, onPair)
    return out
  }
  return node
}

function walkReadOnly(node: unknown, onPair: (en: unknown) => void) {
  if (Array.isArray(node)) { for (const item of node) walkReadOnly(item, onPair); return }
  if (isPair(node)) { onPair(node.en); return }
  if (isRecord(node)) for (const value of Object.values(node)) walkReadOnly(value, onPair)
}

/** Every English text in the content that can be translated: hash -> text. */
export function collectTexts(content: SiteContent): Map<string, string> {
  const found = new Map<string, string>()
  walkReadOnly(content, (en) => visitStrings(en, (text) => found.set(hashText(text), text)))
  return found
}

/** Texts that have no translation yet. */
export function collectMissing(content: SiteContent, dict: Dictionary): Map<string, string> {
  const missing = new Map<string, string>()
  for (const [hash, text] of collectTexts(content)) if (!dict[hash]) missing.set(hash, text)
  return missing
}

/**
 * Returns the content with every `id` side derived from its `en` side. Whatever is stored in `id`
 * is ignored on purpose: it can only be stale. Untranslated text falls back to English, so nothing is ever empty.
 */
export function fillContent(content: SiteContent, dict: Dictionary): SiteContent {
  return walk(content, (en) => mapStrings(en, dict)) as SiteContent
}

// ---- protecting terms ----------------------------------------------------------------

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const TERM_PATTERN = new RegExp(`(?<![\\p{L}\\p{N}])(${[...PROTECTED_TERMS].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})(?![\\p{L}\\p{N}])`, "gu")

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const unescapeXml = (value: string) => value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&")

/**
 * Prepares text for DeepL's XML mode: special characters are escaped and protected terms are wrapped in
 * <x>…</x>, which DeepL is told to leave untouched (ignore_tags: ["x"]).
 */
export function markTerms(text: string): string {
  let out = "", last = 0
  for (const match of text.matchAll(TERM_PATTERN)) {
    const at = match.index ?? 0
    out += `${escapeXml(text.slice(last, at))}<x>${escapeXml(match[0])}</x>`
    last = at + match[0].length
  }
  return out + escapeXml(text.slice(last))
}

/** Reverses markTerms on DeepL's answer. */
export function unmarkTerms(text: string): string {
  return unescapeXml(text.replace(/<\/?x>/g, ""))
}

/** Splits long text into chunks the translator accepts (kept for long texts), on sentence / word boundaries. */
export function chunkText(text: string, maxBytes = 420): string[] {
  const bytes = (value: string) => new TextEncoder().encode(value).length
  if (bytes(text) <= maxBytes) return [text]
  const pieces = text.split(/(?<=[.!?;:])\s+/)
  const chunks: string[] = []
  let current = ""
  const push = (piece: string) => {
    if (!current) { current = piece; return }
    if (bytes(`${current} ${piece}`) <= maxBytes) current = `${current} ${piece}`
    else { chunks.push(current); current = piece }
  }
  for (const piece of pieces) {
    if (bytes(piece) <= maxBytes) { push(piece); continue }
    for (const word of piece.split(/\s+/)) push(word)
  }
  if (current) chunks.push(current)
  return chunks
}

/** Decodes HTML entities. */
export function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_m, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
}
