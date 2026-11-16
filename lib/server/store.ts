import { promises as fs } from "node:fs"
import path from "node:path"
import { createHash, randomBytes } from "node:crypto"

export interface Store {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  del(key: string): Promise<void>
  /** Atomically reads AND removes a key: of two concurrent callers only one gets the value (single-use tokens such as WebAuthn challenges). */
  take(key: string): Promise<string | null>
  /** Atomically adds `by` to a numeric field of a hash and returns the new value. `ttlSeconds` lets the hash expire (Upstash; the file store ignores it). */
  hincr(key: string, field: string, by?: number, ttlSeconds?: number): Promise<number>
  /** The whole hash as numbers; an empty object when the key does not exist. */
  hgetall(key: string): Promise<Record<string, number>>
  /** Adds a member to a set; resolves true only when it was NOT a member yet (atomic per member). `ttlSeconds` lets the set expire. */
  sadd(key: string, member: string, ttlSeconds?: number): Promise<boolean>
  /** Deletes several keys at once (one round trip on Upstash). Missing keys are fine. */
  delMany(keys: string[]): Promise<void>
  /** Several hashes at once (one round trip on Upstash). Same shape as hgetall, in the order of `keys`. */
  hgetallMany(keys: string[]): Promise<Record<string, number>[]>
  /** Puts a value at the FRONT of a list and keeps only the newest `max` entries. `ttlSeconds` lets the list expire. */
  lpush(key: string, value: string, max: number, ttlSeconds?: number): Promise<void>
  /** The newest `count` entries of a list (newest first); empty when the key does not exist. */
  lrange(key: string, count: number): Promise<string[]>
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
  async function pipeline(commands: (string | number)[][]) {
    const response = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
    })
    if (!response.ok) throw new Error(`Storage request failed (${response.status})`)
    const rows = (await response.json()) as { result?: unknown; error?: string }[]
    if (!Array.isArray(rows) || rows.some((row) => row?.error)) throw new Error("Storage request failed")
    return rows.map((row) => row.result)
  }
  const toNumbers = (raw: unknown) => {
    const out: Record<string, number> = {}
    if (Array.isArray(raw)) for (let i = 0; i + 1 < raw.length; i += 2) out[String(raw[i])] = Number(raw[i + 1])
    else if (raw && typeof raw === "object") for (const [field, value] of Object.entries(raw)) out[field] = Number(value)
    return out
  }
  return {
    async get(key) { return ((await call(["GET", key])) as string | null) ?? null },
    async set(key, value) { await call(["SET", key, value]) },
    async del(key) { await call(["DEL", key]) },
    async take(key) { return ((await call(["GETDEL", key])) as string | null) ?? null },
    async hincr(key, field, by = 1, ttlSeconds) {
      const value = Number(await call(["HINCRBY", key, field, by]))
      if (ttlSeconds && value === by) await call(["EXPIRE", key, ttlSeconds]) // first write of this field: make sure the hash cannot live forever
      return value
    },
    async hgetall(key) { return toNumbers(await call(["HGETALL", key])) },
    async delMany(keys) {
      for (let i = 0; i < keys.length; i += 200) await pipeline(keys.slice(i, i + 200).map((key) => ["DEL", key]))
    },
    async hgetallMany(keys) {
      if (keys.length === 0) return []
      return (await pipeline(keys.map((key) => ["HGETALL", key]))).map(toNumbers)
    },
    async lpush(key, value, max, ttlSeconds) {
      await pipeline([["LPUSH", key, value], ["LTRIM", key, 0, max - 1], ...(ttlSeconds ? [["EXPIRE", key, ttlSeconds]] : [])])
    },
    async lrange(key, count) {
      const raw = await call(["LRANGE", key, 0, count - 1])
      return Array.isArray(raw) ? raw.map(String) : []
    },
    async sadd(key, member, ttlSeconds) {
      const added = Number(await call(["SADD", key, member])) === 1
      if (added && ttlSeconds) await call(["EXPIRE", key, ttlSeconds])
      return added
    },
  }
}

/** JSON files on disk — for local development or a server with a persistent disk. */
function fileStore(dir: string): Store {
  const fileFor = (key: string) => path.join(dir, createHash("sha256").update(key).digest("hex").slice(0, 40) + ".json")
  const base = {
    async get(key: string) {
      try { return await fs.readFile(fileFor(key), "utf8") } catch { return null }
    },
    async set(key: string, value: string) {
      await fs.mkdir(dir, { recursive: true, mode: 0o700 })
      const target = fileFor(key)
      const temp = `${target}.${randomBytes(6).toString("hex")}.tmp`
      await fs.writeFile(temp, value, { mode: 0o600 })
      await fs.rename(temp, target)
    },
    async del(key: string) { await fs.rm(fileFor(key), { force: true }) },
    async take(key: string) {
      // rename() is atomic: of two concurrent callers exactly one succeeds, the other sees ENOENT.
      const source = fileFor(key), claimed = `${source}.${randomBytes(6).toString("hex")}.claimed`
      try { await fs.rename(source, claimed) } catch { return null }
      try { return await fs.readFile(claimed, "utf8") } catch { return null } finally { await fs.rm(claimed, { force: true }) }
    },
  }
  // read-modify-write operations (counters, sets) are queued so concurrent requests in this process never lose an update
  let queue: Promise<unknown> = Promise.resolve()
  const serial = <T,>(task: () => Promise<T>): Promise<T> => {
    const run = queue.then(task, task)
    queue = run.catch(() => undefined)
    return run
  }
  const readJson = async <T,>(key: string, fallback: T): Promise<T> => {
    const raw = await base.get(key)
    if (!raw) return fallback
    try { return JSON.parse(raw) as T } catch { return fallback }
  }
  return {
    ...base,
    hincr: (key, field, by = 1) => serial(async () => {
      const hash = await readJson<Record<string, number>>(key, {})
      hash[field] = (Number(hash[field]) || 0) + by
      await base.set(key, JSON.stringify(hash))
      return hash[field]
    }),
    hgetall: async (key) => readJson<Record<string, number>>(key, {}),
    delMany: (keys) => serial(async () => { await Promise.all(keys.map((key) => base.del(key))) }),
    hgetallMany: async (keys) => Promise.all(keys.map((key) => readJson<Record<string, number>>(key, {}))),
    lpush: (key, value, max) => serial(async () => {
      const list = await readJson<string[]>(key, [])
      list.unshift(value)
      await base.set(key, JSON.stringify(list.slice(0, max)))
    }),
    lrange: async (key, count) => (await readJson<string[]>(key, [])).slice(0, count),
    sadd: (key, member) => serial(async () => {
      const members = await readJson<string[]>(key, [])
      if (members.includes(member)) return false
      members.push(member)
      await base.set(key, JSON.stringify(members))
      return true
    }),
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
