import { getStore } from "@/lib/server/store"
import { getContent } from "@/lib/server/content"
import { collectTexts, markTerms, unmarkTerms, type Dictionary } from "@/lib/translate"

/**
 * DeepL client + persistent cache. https://developers.deepl.com/docs/api-reference/translate
 * Needs the env var DEEPL_API_KEY. Keys that end in ":fx" are DeepL API Free (api-free.deepl.com), others are Pro.
 * Translations are stored once (shared by all visitors), so quota is only spent on NEW or EDITED English text.
 */

const CACHE_KEY = "i18n:id:deepl"
const BLOCK_KEY = "i18n:blocked:deepl"
const CACHE_LIMIT = 4000
const BLOCK_MS = 30 * 60 * 1000
const BATCH_SIZE = 40

export class QuotaError extends Error {}
export class AuthError extends Error {}

export async function getTranslations(): Promise<Dictionary> {
  try {
    const raw = await getStore().get(CACHE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : null
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Dictionary) : {}
  } catch { return {} }
}

async function saveTranslations(dict: Dictionary) {
  const keys = Object.keys(dict)
  const trimmed = keys.length > CACHE_LIMIT ? Object.fromEntries(keys.slice(keys.length - CACHE_LIMIT).map((key) => [key, dict[key]])) : dict
  await getStore().set(CACHE_KEY, JSON.stringify(trimmed))
}

export async function isBlocked(): Promise<boolean> {
  try {
    const until = Number(await getStore().get(BLOCK_KEY))
    return Number.isFinite(until) && until > Date.now()
  } catch { return false }
}
async function block() { try { await getStore().set(BLOCK_KEY, String(Date.now() + BLOCK_MS)) } catch { /* best effort */ } }

export const isConfigured = () => Boolean(process.env.DEEPL_API_KEY?.trim())

function endpoint(key: string) {
  return key.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate"
}

/**
 * Translates English texts to Indonesian in ONE DeepL request. Returns the translations in the same order.
 * Throws QuotaError (456 / 429), AuthError (403 / missing key) or Error.
 */
export async function translateBatch(texts: string[], fetcher: typeof fetch = fetch): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY?.trim()
  if (!key) throw new AuthError("DEEPL_API_KEY is not set")
  const response = await fetcher(endpoint(key), {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: texts.map(markTerms),
      source_lang: "EN",
      target_lang: "ID",
      tag_handling: "xml",
      ignore_tags: ["x"],
      preserve_formatting: true,
    }),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  })
  if (response.status === 456 || response.status === 429) throw new QuotaError("DeepL quota reached")
  if (response.status === 403 || response.status === 401) throw new AuthError("DeepL rejected the API key")
  if (!response.ok) throw new Error(`DeepL failed (${response.status})`)
  const data = (await response.json()) as { translations?: { text?: string }[] }
  const out = data.translations
  if (!Array.isArray(out) || out.length !== texts.length || out.some((item) => typeof item.text !== "string" || !item.text.trim())) throw new Error("DeepL returned an unexpected answer")
  return out.map((item) => unmarkTerms(item.text as string).trim())
}

export interface TranslateResult {
  /** hash -> translation, for the requested hashes that are available now. */
  translations: Dictionary
  /** Texts of the site that still have no translation. */
  pending: number
  /** True while DeepL refuses work (quota used up or key rejected); retried later. */
  blocked: boolean
  /** Human-readable reason when something is wrong (shown in the Admin). */
  error?: string
}

export const MAX_PER_CALL = BATCH_SIZE

/**
 * Translates up to MAX_PER_CALL missing texts of the site. Only text that actually exists in the site content is
 * ever sent to DeepL, so this cannot be abused as a free translation proxy.
 * `wanted` limits the work to specific hashes (visitors); omit it to translate anything missing (admin warm-up).
 */
export async function translateMissing(wanted?: string[], fetcher: typeof fetch = fetch): Promise<TranslateResult> {
  const texts = collectTexts(await getContent())
  const cache = await getTranslations()
  const wantedSet = wanted ? new Set(wanted) : null
  const translations: Dictionary = {}
  for (const hash of wantedSet ?? texts.keys()) if (cache[hash] && texts.has(hash)) translations[hash] = cache[hash]

  const todo = [...texts].filter(([hash]) => !cache[hash] && (!wantedSet || wantedSet.has(hash))).slice(0, BATCH_SIZE)
  let blocked = await isBlocked()
  let error: string | undefined
  if (!isConfigured()) { blocked = true; error = "DEEPL_API_KEY is not set in the environment variables." }

  if (!blocked && todo.length) {
    try {
      const done = await translateBatch(todo.map(([, text]) => text), fetcher)
      todo.forEach(([hash], i) => { cache[hash] = done[i]; translations[hash] = done[i] })
      await saveTranslations(cache)
    } catch (caught) {
      if (caught instanceof QuotaError) { blocked = true; error = "DeepL quota reached. It is retried later."; await block() }
      else if (caught instanceof AuthError) { blocked = true; error = "DeepL rejected the API key. Check DEEPL_API_KEY."; await block() }
      else error = caught instanceof Error ? caught.message : "Translation failed"
    }
  } else if (blocked && !error && await isBlocked()) error = "Translation is paused for a few minutes after a DeepL error."

  let pending = 0
  for (const hash of texts.keys()) if (!cache[hash]) pending++
  return { translations, pending, blocked, ...(error ? { error } : {}) }
}
