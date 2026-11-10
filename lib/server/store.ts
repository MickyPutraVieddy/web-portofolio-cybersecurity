import { promises as fs } from "node:fs"
import path from "node:path"
import { createHash, randomBytes } from "node:crypto"

export interface Store {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  del(key: string): Promise<void>
  /** Atomically reads AND removes a key: of two concurrent callers only one gets the value (single-use tokens such as WebAuthn challenges). */
  take(key: string): Promise<string | null>
}

export class StorageNotConfigured extends Error {}

/** Upstash / Vercel KV over plain REST — no SDK needed. */
function upstashStore(url: string, token: string): Store {
  async function call(command: (string | number)[]) {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
      cache: "no-store",
    })
    if (!response.ok) throw new Error(`Storage request failed (${response.status})`)
    return ((await response.json()) as { result: unknown }).result
  }
  return {
    async get(key) { return ((await call(["GET", key])) as string | null) ?? null },
    async set(key, value) { await call(["SET", key, value]) },
    async del(key) { await call(["DEL", key]) },
    async take(key) { return ((await call(["GETDEL", key])) as string | null) ?? null },
  }
}

/** JSON files on disk — for local development or a server with a persistent disk. */
function fileStore(dir: string): Store {
  const fileFor = (key: string) => path.join(dir, createHash("sha256").update(key).digest("hex").slice(0, 40) + ".json")
  return {
    async get(key) {
      try { return await fs.readFile(fileFor(key), "utf8") } catch { return null }
    },
    async set(key, value) {
      await fs.mkdir(dir, { recursive: true, mode: 0o700 })
      const target = fileFor(key)
      const temp = `${target}.${randomBytes(6).toString("hex")}.tmp`
      await fs.writeFile(temp, value, { mode: 0o600 })
      await fs.rename(temp, target)
    },
    async del(key) { await fs.rm(fileFor(key), { force: true }) },
    async take(key) {
      // rename() is atomic: of two concurrent callers exactly one succeeds, the other sees ENOENT.
      const source = fileFor(key), claimed = `${source}.${randomBytes(6).toString("hex")}.claimed`
      try { await fs.rename(source, claimed) } catch { return null }
      try { return await fs.readFile(claimed, "utf8") } catch { return null } finally { await fs.rm(claimed, { force: true }) }
    },
  }
}

let cached: Store | null = null

export function getStore(): Store {
  if (cached) return cached
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) return (cached = upstashStore(url, token))
  if (process.env.VERCEL) {
    throw new StorageNotConfigured("No persistent storage is configured. Add Upstash Redis (KV) in your Vercel project.")
  }
  return (cached = fileStore(process.env.DATA_DIR || path.join(process.cwd(), ".data")))
}

export function resetStoreForTests() { cached = null }
