/**
 * TEST DOUBLE — NOT shipped code. Stands in for @simplewebauthn/server (which cannot be installed in this sandbox) so the app's own logic
 * (challenge handling, storage, policy, sessions) can be tested end to end. It performs the same checks the real library does
 * (type, challenge, origin, RP ID hash, UP/UV flags, counter, ES256 signature) and understands real browser/authenticator output
 * (CBOR attestation "none", COSE keys), so it also works with Chromium's virtual authenticator.
 * It is NOT a security reference: the real library remains the production verifier.
 */
import { createHash, createPublicKey, generateKeyPairSync, randomBytes, sign, verify, type KeyObject } from "node:crypto"
import type { Engine } from "@/lib/server/passkey"

const b64 = (b: Uint8Array | Buffer) => Buffer.from(b).toString("base64url")
const unb64 = (s: string) => Buffer.from(s, "base64url")
const sha256 = (b: Uint8Array | Buffer | string) => createHash("sha256").update(b).digest()

// ---- minimal CBOR -------------------------------------------------------------------------------------------
export function cborEncode(v: unknown): Buffer {
  const head = (major: number, n: number) => n < 24 ? Buffer.from([(major << 5) | n]) : n < 256 ? Buffer.from([(major << 5) | 24, n]) : Buffer.from([(major << 5) | 25, n >> 8, n & 255])
  if (typeof v === "number") return v >= 0 ? head(0, v) : head(1, -1 - v)
  if (typeof v === "string") { const b = Buffer.from(v); return Buffer.concat([head(3, b.length), b]) }
  if (Buffer.isBuffer(v)) return Buffer.concat([head(2, v.length), v])
  if (Array.isArray(v)) return Buffer.concat([head(4, v.length), ...v.map(cborEncode)])
  if (v instanceof Map) return Buffer.concat([head(5, v.size), ...[...v].flatMap(([k, x]) => [cborEncode(k), cborEncode(x)])])
  throw new Error("cbor: unsupported value")
}
export function cborDecode(buf: Buffer, at = { i: 0 }): unknown {
  const first = buf[at.i++], major = first >> 5, info = first & 31
  let n: number
  if (info < 24) n = info; else if (info === 24) n = buf[at.i++]; else if (info === 25) { n = buf.readUInt16BE(at.i); at.i += 2 } else if (info === 26) { n = buf.readUInt32BE(at.i); at.i += 4 } else throw new Error("cbor: unsupported length")
  switch (major) {
    case 0: return n
    case 1: return -1 - n
    case 2: { const b = buf.subarray(at.i, at.i + n); at.i += n; return Buffer.from(b) }
    case 3: { const b = buf.subarray(at.i, at.i + n); at.i += n; return b.toString("utf8") }
    case 4: return Array.from({ length: n }, () => cborDecode(buf, at))
    case 5: { const m = new Map<unknown, unknown>(); for (let k = 0; k < n; k++) { const key = cborDecode(buf, at); m.set(key, cborDecode(buf, at)) } return m }
    default: throw new Error("cbor: unsupported type")
  }
}

const FLAG = { UP: 0x01, UV: 0x04, BE: 0x08, BS: 0x10, AT: 0x40 }
function parseAuthData(authData: Buffer) {
  const flags = authData[32]
  const out: { rpIdHash: Buffer; flags: number; counter: number; credentialId?: Buffer; cose?: Buffer } = { rpIdHash: authData.subarray(0, 32), flags, counter: authData.readUInt32BE(33) }
  if (flags & FLAG.AT) {
    const idLen = authData.readUInt16BE(53) // 32 rpIdHash + 1 flags + 4 counter + 16 aaguid = 53
    out.credentialId = authData.subarray(55, 55 + idLen)
    const rest = authData.subarray(55 + idLen)
    const at = { i: 0 }; cborDecode(rest, at); out.cose = rest.subarray(0, at.i)
  }
  return out
}
function coseToKey(cose: Buffer): KeyObject {
  const map = cborDecode(cose) as Map<number, unknown>
  if (map.get(1) !== 2 || map.get(3) !== -7) throw new Error("only ES256 is supported by the test double")
  return createPublicKey({ key: { kty: "EC", crv: "P-256", x: b64(map.get(-2) as Buffer), y: b64(map.get(-3) as Buffer) }, format: "jwk" })
}
function checkClientData(clientDataJSON: string, type: string, expectedChallenge: string, expectedOrigin: string) {
  const data = JSON.parse(unb64(clientDataJSON).toString("utf8")) as { type: string; challenge: string; origin: string }
  if (data.type !== type) throw new Error("unexpected clientData type")
  if (data.challenge !== expectedChallenge) throw new Error("unexpected challenge")
  if (data.origin !== expectedOrigin) throw new Error("unexpected origin")
}

// ---- the engine double ---------------------------------------------------------------------------------------------
export class FakeEngine implements Engine {
  calls: { registrationOptions: Parameters<Engine["registrationOptions"]>[0][]; authenticationOptions: Parameters<Engine["authenticationOptions"]>[0][] } = { registrationOptions: [], authenticationOptions: [] }
  async registrationOptions(
    i: Parameters<Engine["registrationOptions"]>[0],
  ): ReturnType<Engine["registrationOptions"]> {
    this.calls.registrationOptions.push(i)
    return {
      challenge: b64(randomBytes(32)),
      rp: { name: i.rpName, id: i.rpID },
      user: { id: b64(i.userID), name: i.userName, displayName: i.userName },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      timeout: 120000,
      attestation: "none",
      excludeCredentials: i.excludeIds.map((id) => ({ id, type: "public-key" as const })),
      authenticatorSelection: {
        residentKey: "required",
        requireResidentKey: true,
        userVerification: "required",
      },
    }
  }
  async verifyRegistration(i: Parameters<Engine["verifyRegistration"]>[0]) {
    const r = i.response as { response: { clientDataJSON: string; attestationObject: string } }
    checkClientData(r.response.clientDataJSON, "webauthn.create", i.expectedChallenge, i.expectedOrigin)
    const att = cborDecode(unb64(r.response.attestationObject)) as Map<string, unknown>
    if (att.get("fmt") !== "none") throw new Error("test double only accepts attestation none")
    const auth = parseAuthData(att.get("authData") as Buffer)
    if (!auth.rpIdHash.equals(sha256(i.expectedRPID))) throw new Error("rpId hash mismatch")
    if (!(auth.flags & FLAG.UP) || !(auth.flags & FLAG.UV)) throw new Error("user presence/verification required")
    if (!auth.credentialId || !auth.cose) throw new Error("no credential data")
    return { verified: true, credential: { id: b64(auth.credentialId), publicKey: b64(auth.cose), counter: auth.counter, transports: ["internal"], deviceType: auth.flags & FLAG.BE ? "multiDevice" : "singleDevice", backedUp: !!(auth.flags & FLAG.BS) } }
  }
  async authenticationOptions(
    i: Parameters<Engine["authenticationOptions"]>[0],
  ): ReturnType<Engine["authenticationOptions"]> {
    this.calls.authenticationOptions.push(i)
    return {
      challenge: b64(randomBytes(32)),
      rpId: i.rpID,
      timeout: 120000,
      userVerification: "required",
      allowCredentials: [],
    }
  }
  async verifyAuthentication(i: Parameters<Engine["verifyAuthentication"]>[0]) {
    const r = i.response as { id: string; response: { clientDataJSON: string; authenticatorData: string; signature: string } }
    if (r.id !== i.credential.id) throw new Error("credential id mismatch")
    checkClientData(r.response.clientDataJSON, "webauthn.get", i.expectedChallenge, i.expectedOrigin)
    const authData = unb64(r.response.authenticatorData), auth = parseAuthData(authData)
    if (!auth.rpIdHash.equals(sha256(i.expectedRPID))) throw new Error("rpId hash mismatch")
    if (!(auth.flags & FLAG.UP) || !(auth.flags & FLAG.UV)) throw new Error("user presence/verification required")
    const ok = verify("sha256", Buffer.concat([authData, sha256(unb64(r.response.clientDataJSON))]), coseToKey(unb64(i.credential.publicKey)), unb64(r.response.signature))
    if (!ok) throw new Error("bad signature")
    if ((auth.counter !== 0 || i.credential.counter !== 0) && auth.counter <= i.credential.counter) throw new Error("counter did not increase")
    return { verified: true, newCounter: auth.counter }
  }
}

// ---- a software authenticator (what a phone / laptop does) --------------------------------------------------------------
export interface Tamper { origin?: string; challenge?: string; rpId?: string; uv?: boolean; counter?: number; signWith?: KeyObject; userHandle?: string; id?: string }
export class SoftAuthenticator {
  private creds = new Map<string, { key: KeyObject; jwk: { x: string; y: string }; counter: number; rpId: string; userHandle: string }>()
  constructor(public name = "device", private flags = FLAG.UP | FLAG.UV) {}

  create(options: any, origin: string, tamper: Tamper = {}) {
    const rpId: string = tamper.rpId ?? options.rp.id
    for (const c of options.excludeCredentials ?? []) if (this.creds.has(c.id)) throw new Error("InvalidStateError: already registered on this device")
    const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "P-256" })
    const jwk = publicKey.export({ format: "jwk" }) as { x: string; y: string }
    const id = b64(randomBytes(32))
    this.creds.set(id, { key: privateKey, jwk, counter: 0, rpId, userHandle: options.user.id })
    const cose = cborEncode(new Map<number, unknown>([[1, 2], [3, -7], [-1, 1], [-2, unb64(jwk.x)], [-3, unb64(jwk.y)]]))
    const idBuf = unb64(id), len = Buffer.alloc(2); len.writeUInt16BE(idBuf.length)
    const flags = (tamper.uv === false ? FLAG.UP : this.flags) | FLAG.AT
    const authData = Buffer.concat([sha256(rpId), Buffer.from([flags]), Buffer.alloc(4), Buffer.alloc(16), len, idBuf, cose])
    const clientData = JSON.stringify({ type: "webauthn.create", challenge: tamper.challenge ?? options.challenge, origin: tamper.origin ?? origin, crossOrigin: false })
    return { id, rawId: id, type: "public-key", authenticatorAttachment: "platform", clientExtensionResults: {},
      response: { clientDataJSON: b64(Buffer.from(clientData)), attestationObject: b64(cborEncode(new Map<string, unknown>([["fmt", "none"], ["attStmt", new Map()], ["authData", authData]]))), transports: ["internal"] } }
  }

  get(options: any, origin: string, tamper: Tamper = {}) {
    const rpId: string = tamper.rpId ?? options.rpId
    const allowed: string[] = (options.allowCredentials ?? []).map((c: { id: string }) => c.id)
    const entry = [...this.creds].find(([id, c]) => c.rpId === rpId && (allowed.length === 0 || allowed.includes(id)))
    if (!entry) throw new Error("NotAllowedError: no passkey on this device for this site")
    const [id, cred] = entry
    const shown = tamper.counter ?? cred.counter + 1
    if (tamper.counter === undefined) cred.counter = shown // a forged counter must not change the real device's state
    const flags = tamper.uv === false ? FLAG.UP : this.flags
    const counter = Buffer.alloc(4); counter.writeUInt32BE(shown)
    const authData = Buffer.concat([sha256(rpId), Buffer.from([flags]), counter])
    const clientData = Buffer.from(JSON.stringify({ type: "webauthn.get", challenge: tamper.challenge ?? options.challenge, origin: tamper.origin ?? origin, crossOrigin: false }))
    const signature = sign("sha256", Buffer.concat([authData, sha256(clientData)]), tamper.signWith ?? cred.key)
    const responseId = tamper.id ?? id
    return { id: responseId, rawId: responseId, type: "public-key", authenticatorAttachment: "platform", clientExtensionResults: {},
      response: { clientDataJSON: b64(clientData), authenticatorData: b64(authData), signature: b64(signature), userHandle: tamper.userHandle ?? cred.userHandle } }
  }
  count() { return this.creds.size }
}
