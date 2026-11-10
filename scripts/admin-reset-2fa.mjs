#!/usr/bin/env node
// Removes the stored two-factor secret (and any unfinished setup). Uses the same storage environment as the site.
import { createHash } from "node:crypto"
import { rm } from "node:fs/promises"
import path from "node:path"

const KEYS = ["admin:2fa", "admin:2fa:pending", "admin:2fa:env-last"]
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

if (url && token) {
  for (const key of KEYS) {
    const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(["DEL", key]) })
    if (!response.ok) { console.error(`Could not delete ${key} (HTTP ${response.status}).`); process.exit(1) }
  }
  console.log("Two-factor record removed from the KV store. Sign in with your password and enrol again.")
} else {
  const dir = process.env.DATA_DIR || path.join(process.cwd(), ".data")
  for (const key of KEYS) await rm(path.join(dir, createHash("sha256").update(key).digest("hex").slice(0, 40) + ".json"), { force: true })
  console.log(`Two-factor record removed from ${dir}. Sign in with your password and enrol again.`)
}
if (process.env.ADMIN_TOTP_SECRET) console.log("Note: ADMIN_TOTP_SECRET is set in this environment — remove it too, or 2FA stays required.")
