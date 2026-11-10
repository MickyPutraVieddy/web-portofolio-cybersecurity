#!/usr/bin/env node
// Generates SESSION_SECRET and ADMIN_PASSWORD_HASH for the environment. Nothing is stored.
import { randomBytes, scryptSync } from "node:crypto"

const password = process.argv[2]
if (!password || password.length < 12) {
  console.error('Usage: node scripts/admin-setup.mjs "<password of 12+ characters>"')
  process.exit(1)
}
const salt = randomBytes(16)
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 })

console.log(`SESSION_SECRET=${randomBytes(48).toString("base64url")}
ADMIN_PASSWORD_HASH=scrypt:16384:8:1:${salt.toString("base64")}:${hash.toString("base64")}
`)
