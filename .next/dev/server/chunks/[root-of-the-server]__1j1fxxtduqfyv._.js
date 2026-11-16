module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/admin/visitors/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitor$2d$handlers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/visitor-handlers.ts [app-route] (ecmascript)");
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const GET = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitor$2d$handlers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["visitorsHandler"];
const POST = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitor$2d$handlers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["visitorsResetHandler"];
}),
"[project]/lib/server/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfigError",
    ()=>ConfigError,
    "SESSION_TTL_SECONDS",
    ()=>SESSION_TTL_SECONDS,
    "authConfig",
    ()=>authConfig,
    "base32Encode",
    ()=>base32Encode,
    "buildCookie",
    ()=>buildCookie,
    "clearLoginFailures",
    ()=>clearLoginFailures,
    "clearSessionCookie",
    ()=>clearSessionCookie,
    "clientIp",
    ()=>clientIp,
    "createSessionCookie",
    ()=>createSessionCookie,
    "deriveKey",
    ()=>deriveKey,
    "generateTotpSecret",
    ()=>generateTotpSecret,
    "getSession",
    ()=>getSession,
    "hashPassword",
    ()=>hashPassword,
    "isSecureRequest",
    ()=>isSecureRequest,
    "loginBlockedFor",
    ()=>loginBlockedFor,
    "publicAuthConfig",
    ()=>publicAuthConfig,
    "readCookie",
    ()=>readCookie,
    "recordLoginFailure",
    ()=>recordLoginFailure,
    "sameOriginMutation",
    ()=>sameOriginMutation,
    "sessionCookieName",
    ()=>sessionCookieName,
    "signToken",
    ()=>signToken,
    "totpAt",
    ()=>totpAt,
    "totpUri",
    ()=>totpUri,
    "verifyPassword",
    ()=>verifyPassword,
    "verifyToken",
    ()=>verifyToken,
    "verifyTotp",
    ()=>verifyTotp,
    "verifyTotpStep",
    ()=>verifyTotpStep
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
;
;
const SESSION_TTL_SECONDS = 8 * 60 * 60;
class ConfigError extends Error {
}
function authConfig() {
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e)=>e.trim().toLowerCase()).filter(Boolean);
    return {
        secret: process.env.SESSION_SECRET || "",
        passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
        totpSecret: process.env.ADMIN_TOTP_SECRET || "",
        googleId: process.env.GOOGLE_CLIENT_ID || "",
        googleSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        adminEmails
    };
}
function publicAuthConfig() {
    const c = authConfig();
    return {
        password: !!c.passwordHash && c.secret.length >= 32,
        totp: !!c.totpSecret,
        google: !!c.googleId && !!c.googleSecret && c.adminEmails.length > 0 && c.secret.length >= 32
    };
}
function secretOrThrow() {
    const { secret } = authConfig();
    if (secret.length < 32) throw new ConfigError("SESSION_SECRET must be set (32+ characters)");
    return secret;
}
function deriveKey(purpose) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", secretOrThrow()).update(`derive:${purpose}`).digest();
}
// ---- signed tokens (sessions + oauth state) -----------------------------------------
const b64u = (value)=>Buffer.from(value).toString("base64url");
function signToken(payload, ttlSeconds) {
    const body = b64u(JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + ttlSeconds
    }));
    const mac = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", secretOrThrow()).update(body).digest();
    return `${body}.${b64u(mac)}`;
}
function verifyToken(token) {
    try {
        if (!token) return null;
        const [body, mac] = token.split(".");
        if (!body || !mac) return null;
        const expected = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", secretOrThrow()).update(body).digest();
        const given = Buffer.from(mac, "base64url");
        if (given.length !== expected.length || !(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(given, expected)) return null;
        const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
    } catch  {
        return null;
    }
}
function isSecureRequest(request) {
    return new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
}
const sessionCookieName = (secure)=>secure ? "__Host-admin_session" : "admin_session";
function readCookie(request, name) {
    for (const part of (request.headers.get("cookie") || "").split(";")){
        const index = part.indexOf("=");
        if (index > 0 && part.slice(0, index).trim() === name) return decodeURIComponent(part.slice(index + 1).trim());
    }
    return undefined;
}
function buildCookie(name, value, options) {
    return [
        `${name}=${encodeURIComponent(value)}`,
        `Path=${options.path ?? "/"}`,
        `Max-Age=${options.maxAge}`,
        "HttpOnly",
        "SameSite=Lax",
        options.secure ? "Secure" : ""
    ].filter(Boolean).join("; ");
}
function getSession(request) {
    const token = readCookie(request, sessionCookieName(isSecureRequest(request)));
    const session = verifyToken(token);
    return session && typeof session.sub === "string" ? session : null;
}
function createSessionCookie(request, session, ttlSeconds = SESSION_TTL_SECONDS) {
    const secure = isSecureRequest(request);
    return buildCookie(sessionCookieName(secure), signToken({
        ...session,
        iat: Math.floor(Date.now() / 1000)
    }, ttlSeconds), {
        secure,
        maxAge: ttlSeconds
    });
}
function clearSessionCookie(request) {
    const secure = isSecureRequest(request);
    return buildCookie(sessionCookieName(secure), "", {
        secure,
        maxAge: 0
    });
}
function sameOriginMutation(request) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    if (!origin || !host) return false;
    try {
        if (new URL(origin).host !== host) return false;
    } catch  {
        return false;
    }
    return request.headers.get("x-requested-with") === "admin";
}
function clientIp(request) {
    return (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}
// ---- password (scrypt) ---------------------------------------------------------------
const SCRYPT = {
    N: 16384,
    r: 8,
    p: 1,
    keylen: 64
};
function hashPassword(password) {
    const salt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16);
    return new Promise((resolve, reject)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scrypt"])(password, salt, SCRYPT.keylen, {
            N: SCRYPT.N,
            r: SCRYPT.r,
            p: SCRYPT.p
        }, (error, key)=>error ? reject(error) : resolve(`scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64")}$${key.toString("base64")}`)));
}
function verifyPassword(password, stored) {
    return new Promise((resolve)=>{
        try {
            const [scheme, n, r, p, saltB64, hashB64] = stored.trim().replace(/^['"]|['"]$/g, "").replace(/\\/g, "").split(/[$:]/);
            if (scheme !== "scrypt") return resolve(false);
            const expected = Buffer.from(hashB64, "base64");
            (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scrypt"])(password, Buffer.from(saltB64, "base64"), expected.length, {
                N: +n,
                r: +r,
                p: +p
            }, (error, key)=>resolve(!error && key.length === expected.length && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(key, expected)));
        } catch  {
            resolve(false);
        }
    });
}
// ---- TOTP (RFC 6238, Google Authenticator compatible) --------------------------------
function base32Decode(input) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    for (const char of input.replace(/=+$/, "").replace(/\s/g, "").toUpperCase()){
        const value = alphabet.indexOf(char);
        if (value < 0) throw new ConfigError("ADMIN_TOTP_SECRET is not valid base32");
        bits += value.toString(2).padStart(5, "0");
    }
    const bytes = [];
    for(let i = 0; i + 8 <= bits.length; i += 8)bytes.push(parseInt(bits.slice(i, i + 8), 2));
    return Buffer.from(bytes);
}
function totpAt(secret, counter) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64BE(BigInt(counter));
    const hmac = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha1", base32Decode(secret)).update(buffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = (hmac[offset] & 0x7f) << 24 | hmac[offset + 1] << 16 | hmac[offset + 2] << 8 | hmac[offset + 3];
    return String(code % 1_000_000).padStart(6, "0");
}
const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32Encode(bytes) {
    let bits = "", out = "";
    for (const byte of bytes)bits += byte.toString(2).padStart(8, "0");
    for(let i = 0; i < bits.length; i += 5)out += BASE32[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];
    return out;
}
function generateTotpSecret() {
    return base32Encode((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(20));
}
function totpUri(secret, account, issuer) {
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}
function verifyTotpStep(secret, code, now = Date.now()) {
    if (!/^\d{6}$/.test(code)) return null;
    const counter = Math.floor(now / 30000);
    let matched = null;
    for (const drift of [
        -1,
        0,
        1
    ]){
        const expected = Buffer.from(totpAt(secret, counter + drift));
        if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(expected, Buffer.from(code))) matched = counter + drift; // no early exit: constant work
    }
    return matched;
}
function verifyTotp(secret, code, now = Date.now()) {
    return verifyTotpStep(secret, code, now) !== null;
}
// ---- brute-force protection ----------------------------------------------------------
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const limiterKey = (ip)=>`rl:login:${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(ip).digest("hex").slice(0, 24)}`;
async function loginBlockedFor(ip) {
    try {
        const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().get(limiterKey(ip));
        if (!raw) return 0;
        const attempts = JSON.parse(raw);
        const remaining = attempts.first + WINDOW_MS - Date.now();
        return attempts.count >= MAX_FAILURES && remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    } catch  {
        return 0;
    }
}
async function recordLoginFailure(ip) {
    try {
        const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
        const raw = await store.get(limiterKey(ip));
        let attempts = raw ? JSON.parse(raw) : {
            count: 0,
            first: Date.now()
        };
        if (attempts.first + WINDOW_MS < Date.now()) attempts = {
            count: 0,
            first: Date.now()
        };
        attempts.count += 1;
        await store.set(limiterKey(ip), JSON.stringify(attempts));
    } catch  {}
}
async function clearLoginFailures(ip) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().del(limiterKey(ip));
    } catch  {}
}
}),
"[project]/lib/server/store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StorageNotConfigured",
    ()=>StorageNotConfigured,
    "getStore",
    ()=>getStore,
    "resetStoreForTests",
    ()=>resetStoreForTests
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
;
;
class StorageNotConfigured extends Error {
}
/** Upstash / Vercel KV over plain REST — no SDK needed. */ function upstashStore(url, token) {
    async function call(command) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(command),
            cache: "no-store"
        });
        if (!response.ok) throw new Error(`Storage request failed (${response.status})`);
        return (await response.json()).result;
    }
    async function pipeline(commands) {
        const response = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(commands),
            cache: "no-store"
        });
        if (!response.ok) throw new Error(`Storage request failed (${response.status})`);
        const rows = await response.json();
        if (!Array.isArray(rows) || rows.some((row)=>row?.error)) throw new Error("Storage request failed");
        return rows.map((row)=>row.result);
    }
    const toNumbers = (raw)=>{
        const out = {};
        if (Array.isArray(raw)) for(let i = 0; i + 1 < raw.length; i += 2)out[String(raw[i])] = Number(raw[i + 1]);
        else if (raw && typeof raw === "object") for (const [field, value] of Object.entries(raw))out[field] = Number(value);
        return out;
    };
    return {
        async get (key) {
            return await call([
                "GET",
                key
            ]) ?? null;
        },
        async set (key, value) {
            await call([
                "SET",
                key,
                value
            ]);
        },
        async del (key) {
            await call([
                "DEL",
                key
            ]);
        },
        async take (key) {
            return await call([
                "GETDEL",
                key
            ]) ?? null;
        },
        async hincr (key, field, by = 1, ttlSeconds) {
            const value = Number(await call([
                "HINCRBY",
                key,
                field,
                by
            ]));
            if (ttlSeconds && value === by) await call([
                "EXPIRE",
                key,
                ttlSeconds
            ]); // first write of this field: make sure the hash cannot live forever
            return value;
        },
        async hgetall (key) {
            return toNumbers(await call([
                "HGETALL",
                key
            ]));
        },
        async delMany (keys) {
            for(let i = 0; i < keys.length; i += 200)await pipeline(keys.slice(i, i + 200).map((key)=>[
                    "DEL",
                    key
                ]));
        },
        async hgetallMany (keys) {
            if (keys.length === 0) return [];
            return (await pipeline(keys.map((key)=>[
                    "HGETALL",
                    key
                ]))).map(toNumbers);
        },
        async lpush (key, value, max, ttlSeconds) {
            await pipeline([
                [
                    "LPUSH",
                    key,
                    value
                ],
                [
                    "LTRIM",
                    key,
                    0,
                    max - 1
                ],
                ...ttlSeconds ? [
                    [
                        "EXPIRE",
                        key,
                        ttlSeconds
                    ]
                ] : []
            ]);
        },
        async lrange (key, count) {
            const raw = await call([
                "LRANGE",
                key,
                0,
                count - 1
            ]);
            return Array.isArray(raw) ? raw.map(String) : [];
        },
        async sadd (key, member, ttlSeconds) {
            const added = Number(await call([
                "SADD",
                key,
                member
            ])) === 1;
            if (added && ttlSeconds) await call([
                "EXPIRE",
                key,
                ttlSeconds
            ]);
            return added;
        }
    };
}
/** JSON files on disk — for local development or a server with a persistent disk. */ function fileStore(dir) {
    const fileFor = (key)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(key).digest("hex").slice(0, 40) + ".json");
    const base = {
        async get (key) {
            try {
                return await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].readFile(fileFor(key), "utf8");
            } catch  {
                return null;
            }
        },
        async set (key, value) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].mkdir(dir, {
                recursive: true,
                mode: 0o700
            });
            const target = fileFor(key);
            const temp = `${target}.${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(6).toString("hex")}.tmp`;
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].writeFile(temp, value, {
                mode: 0o600
            });
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rename(temp, target);
        },
        async del (key) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rm(fileFor(key), {
                force: true
            });
        },
        async take (key) {
            // rename() is atomic: of two concurrent callers exactly one succeeds, the other sees ENOENT.
            const source = fileFor(key), claimed = `${source}.${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(6).toString("hex")}.claimed`;
            try {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rename(source, claimed);
            } catch  {
                return null;
            }
            try {
                return await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].readFile(claimed, "utf8");
            } catch  {
                return null;
            } finally{
                await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rm(claimed, {
                    force: true
                });
            }
        }
    };
    // read-modify-write operations (counters, sets) are queued so concurrent requests in this process never lose an update
    let queue = Promise.resolve();
    const serial = (task)=>{
        const run = queue.then(task, task);
        queue = run.catch(()=>undefined);
        return run;
    };
    const readJson = async (key, fallback)=>{
        const raw = await base.get(key);
        if (!raw) return fallback;
        try {
            return JSON.parse(raw);
        } catch  {
            return fallback;
        }
    };
    return {
        ...base,
        hincr: (key, field, by = 1)=>serial(async ()=>{
                const hash = await readJson(key, {});
                hash[field] = (Number(hash[field]) || 0) + by;
                await base.set(key, JSON.stringify(hash));
                return hash[field];
            }),
        hgetall: async (key)=>readJson(key, {}),
        delMany: (keys)=>serial(async ()=>{
                await Promise.all(keys.map((key)=>base.del(key)));
            }),
        hgetallMany: async (keys)=>Promise.all(keys.map((key)=>readJson(key, {}))),
        lpush: (key, value, max)=>serial(async ()=>{
                const list = await readJson(key, []);
                list.unshift(value);
                await base.set(key, JSON.stringify(list.slice(0, max)));
            }),
        lrange: async (key, count)=>(await readJson(key, [])).slice(0, count),
        sadd: (key, member)=>serial(async ()=>{
                const members = await readJson(key, []);
                if (members.includes(member)) return false;
                members.push(member);
                await base.set(key, JSON.stringify(members));
                return true;
            })
    };
}
let cached = null;
function getStore() {
    if (cached) return cached;
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) return cached = upstashStore(url, token);
    if (process.env.VERCEL) {
        throw new StorageNotConfigured("No persistent storage is configured. Add Upstash Redis (KV) in your Vercel project.");
    }
    return cached = fileStore(process.env.DATA_DIR || __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), ".data"));
}
function resetStoreForTests() {
    cached = null;
}
}),
"[project]/lib/server/vercel-analytics.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VERCEL_WINDOW_DAYS",
    ()=>VERCEL_WINDOW_DAYS,
    "_resetVercelCacheForTests",
    ()=>_resetVercelCacheForTests,
    "getVercelAnalytics",
    ()=>getVercelAnalytics,
    "vercelAnalyticsConfig",
    ()=>vercelAnalyticsConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/visitors.ts [app-route] (ecmascript)");
;
/**
 * Reads the numbers Vercel Web Analytics collected for THIS project through Vercel's Web Analytics API, so the admin can show them
 * next to the built-in counter. Server-side only: the access token never reaches the browser.
 *
 * Needs three environment variables (all optional — without them the admin simply shows how to connect):
 *   ANALYTICS_API_TOKEN   a Vercel access token (Account Settings → Tokens), scope = the team that owns the project
 *   ANALYTICS_PROJECT_ID  the project id (Project → Settings → General, "prj_…")
 *   ANALYTICS_TEAM_ID     the team id ("team_…"); leave empty for a project on a personal account
 * Docs: https://vercel.com/docs/analytics/web-analytics-api
 */ const API = "https://api.vercel.com/v1/query/web-analytics/visits";
const VERCEL_WINDOW_DAYS = 30;
const CACHE_MS = 60_000;
const num = (value)=>Math.max(0, Math.trunc(Number(value) || 0));
const sum = (rows)=>rows.reduce((a, r)=>({
            views: a.views + r.views,
            uniques: a.uniques + r.uniques
        }), {
        views: 0,
        uniques: 0
    });
function vercelAnalyticsConfig(env = process.env) {
    const token = env.ANALYTICS_API_TOKEN?.trim(), projectId = env.ANALYTICS_PROJECT_ID?.trim(), teamId = env.ANALYTICS_TEAM_ID?.trim();
    return token && projectId ? {
        token,
        projectId,
        teamId: teamId || undefined
    } : null;
}
class VercelApiError extends Error {
    status;
    constructor(status){
        super(`Vercel API ${status}`);
        this.status = status;
    }
}
async function query(kind, params, config) {
    const url = new URL(`${API}/${kind}`);
    url.searchParams.set("projectId", config.projectId);
    if (config.teamId) url.searchParams.set("teamId", config.teamId);
    for (const [key, value] of Object.entries(params))url.searchParams.set(key, value);
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${config.token}`
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000)
    });
    if (!response.ok) throw new VercelApiError(response.status);
    return (await response.json()).data;
}
let cache = null;
function _resetVercelCacheForTests() {
    cache = null;
}
async function getVercelAnalytics(now = Date.now(), env = process.env) {
    const config = vercelAnalyticsConfig(env);
    if (!config) return {
        configured: false
    };
    const key = `${config.projectId}|${config.teamId ?? ""}`;
    if (cache && cache.key === key && now - cache.at < CACHE_MS) return cache.value;
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["visitDay"])(now) // Vercel groups days in UTC; near midnight WIB the "today" rows can differ slightly from the built-in counter
    ;
    const since = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dayAdd"])(today, -(VERCEL_WINDOW_DAYS - 1));
    let value;
    try {
        const [rows, lifetime] = await Promise.all([
            query("aggregate", {
                since,
                until: today,
                by: "day",
                limit: "400"
            }, config),
            query("count", {}, config).catch((error)=>{
                if (error instanceof VercelApiError && error.status !== 429) return null;
                throw error;
            })
        ]);
        const byDay = new Map();
        for (const row of Array.isArray(rows) ? rows : []){
            const day = typeof row.timestamp === "string" ? row.timestamp.slice(0, 10) : "";
            if (/^\d{4}-\d{2}-\d{2}$/.test(day)) byDay.set(day, {
                views: num(row.pageviews),
                uniques: num(row.visitors)
            });
        }
        const days = Array.from({
            length: VERCEL_WINDOW_DAYS
        }, (_, i)=>{
            const day = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dayAdd"])(today, i - (VERCEL_WINDOW_DAYS - 1));
            return {
                day,
                ...byDay.get(day) ?? {
                    views: 0,
                    uniques: 0
                }
            };
        });
        const life = lifetime;
        value = {
            configured: true,
            ok: true,
            days,
            totals: {
                today: sum(days.slice(-1)),
                last7: sum(days.slice(-7)),
                last30: sum(days),
                allTime: life && typeof life === "object" ? {
                    views: num(life.pageviews),
                    uniques: num(life.visitors)
                } : null
            },
            fetchedAt: new Date(now).toISOString()
        };
    } catch (error) {
        const status = error instanceof VercelApiError ? error.status : 0;
        value = status === 401 || status === 403 ? {
            configured: true,
            ok: false,
            error: "auth",
            message: "Vercel rejected the access token. Check that ANALYTICS_API_TOKEN is valid and belongs to the team that owns the project."
        } : status === 404 || status === 400 ? {
            configured: true,
            ok: false,
            error: "not-found",
            message: "Vercel could not find the project or Web Analytics is not enabled. Check ANALYTICS_PROJECT_ID / ANALYTICS_TEAM_ID and turn on Web Analytics in the project."
        } : status === 429 ? {
            configured: true,
            ok: false,
            error: "rate",
            message: "Vercel asked to slow down. Try again in a minute."
        } : {
            configured: true,
            ok: false,
            error: "unavailable",
            message: "Vercel Analytics could not be reached right now."
        };
    }
    if (value.configured && value.ok) cache = {
        at: now,
        key,
        value
    }; // only successes are cached, so fixing a setting shows up immediately
    return value;
}
}),
"[project]/lib/server/visitor-handlers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_setAuditForTests",
    ()=>_setAuditForTests,
    "hitHandler",
    ()=>hitHandler,
    "vercelAnalyticsHandler",
    ()=>vercelAnalyticsHandler,
    "visitorsHandler",
    ()=>visitorsHandler,
    "visitorsResetHandler",
    ()=>visitorsResetHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$vercel$2d$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/vercel-analytics.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/visitors.ts [app-route] (ecmascript)");
;
;
;
;
const noStore = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
};
const json = (body, status = 200)=>new Response(JSON.stringify(body), {
        status,
        headers: {
            ...noStore,
            "Content-Type": "application/json"
        }
    });
/** Reads at most `limit` bytes; null when the body is larger (the rest is never buffered). */ async function readSmallBody(request, limit = 1024) {
    const reader = request.body?.getReader();
    if (!reader) return "";
    const chunks = [];
    let size = 0;
    for(;;){
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > limit) {
            await reader.cancel().catch(()=>undefined);
            return null;
        }
        chunks.push(value);
    }
    return Buffer.concat(chunks).toString("utf8");
}
async function hitHandler(request) {
    const done = ()=>new Response(null, {
            status: 204,
            headers: noStore
        });
    try {
        const h = request.headers;
        if (h.get("dnt") === "1" || h.get("sec-gpc") === "1") return done() // respect Do-Not-Track / Global Privacy Control
        ;
        const site = h.get("sec-fetch-site");
        if (site && site !== "same-origin") return done();
        const origin = h.get("origin"), host = h.get("x-forwarded-host") || h.get("host");
        if (origin) {
            try {
                if (new URL(origin).host !== host) return done();
            } catch  {
                return done();
            }
        }
        if (Number(h.get("content-length") || 0) > 1024) return done();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])(request)) return done() // the signed-in owner looking at their own site is not a visitor
        ;
        const text = await readSmallBody(request);
        if (text === null) return done();
        let path, referrer;
        try {
            const body = JSON.parse(text);
            path = body.p;
            referrer = body.r;
        } catch  {
            return done();
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordVisit"])({
            path,
            referrer,
            host,
            ip: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clientIp"])(request),
            userAgent: h.get("user-agent") || "",
            country: h.get("x-vercel-ip-country")
        });
    } catch  {}
    return done();
}
async function visitorsHandler(request) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])(request)) return json({
        error: "unauthorized"
    }, 401);
    try {
        return json(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getVisitorStats"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseRange"])(new URL(request.url).searchParams.get("days"))));
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StorageNotConfigured"]) return json({
            error: "storage",
            message: error.message
        }, 503);
        return json({
            error: "server",
            message: "Something went wrong"
        }, 500);
    }
}
async function vercelAnalyticsHandler(request) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])(request)) return json({
        error: "unauthorized"
    }, 401);
    try {
        return json(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$vercel$2d$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getVercelAnalytics"])());
    } catch  {
        return json({
            configured: true,
            ok: false,
            error: "unavailable",
            message: "Vercel Analytics could not be reached right now."
        });
    }
}
let writeAudit = async (actor, action, detail)=>{
    await (await __turbopack_context__.A("[project]/lib/server/content.ts [app-route] (ecmascript, async loader)")).writeAudit(actor, action, detail);
};
function _setAuditForTests(fn) {
    writeAudit = fn ?? (async (actor, action, detail)=>{
        await (await __turbopack_context__.A("[project]/lib/server/content.ts [app-route] (ecmascript, async loader)")).writeAudit(actor, action, detail);
    });
}
async function visitorsResetHandler(request) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sameOriginMutation"])(request)) return json({
        error: "forbidden"
    }, 403);
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])(request);
    if (!session) return json({
        error: "unauthorized"
    }, 401);
    try {
        const body = await request.json().catch(()=>null);
        if (body?.confirm !== "reset") return json({
            error: "validation",
            message: "Confirmation missing"
        }, 422);
        await writeAudit(session.sub, "reset-visitors", "all visitor numbers set to 0");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$visitors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resetVisitorStats"])();
        return json({
            ok: true
        });
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StorageNotConfigured"]) return json({
            error: "storage",
            message: error.message
        }, 503);
        return json({
            error: "server",
            message: "Something went wrong"
        }, 500);
    }
}
}),
"[project]/lib/server/visitors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BROWSERS",
    ()=>BROWSERS,
    "COUNTER_TTL_SECONDS",
    ()=>COUNTER_TTL_SECONDS,
    "RECENT_LIMIT",
    ()=>RECENT_LIMIT,
    "RECENT_TTL_SECONDS",
    ()=>RECENT_TTL_SECONDS,
    "SEEN_TTL_SECONDS",
    ()=>SEEN_TTL_SECONDS,
    "SOURCES",
    ()=>SOURCES,
    "SYSTEMS",
    ()=>SYSTEMS,
    "_resetLimiterForTests",
    ()=>_resetLimiterForTests,
    "_setPageLoaderForTests",
    ()=>_setPageLoaderForTests,
    "countryCode",
    ()=>countryCode,
    "dayAdd",
    ()=>dayAdd,
    "describeClient",
    ()=>describeClient,
    "getVisitorStats",
    ()=>getVisitorStats,
    "isBot",
    ()=>isBot,
    "normalizePath",
    ()=>normalizePath,
    "parseRange",
    ()=>parseRange,
    "recordVisit",
    ()=>recordVisit,
    "referrerSource",
    ()=>referrerSource,
    "resetVisitorStats",
    ()=>resetVisitorStats,
    "visitDay",
    ()=>visitDay,
    "visitorHash",
    ()=>visitorHash
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
;
;
;
/**
 * Privacy-first visitor counter. It stores NUMBERS ONLY:
 *   visits:day:<YYYY-MM-DD>  hash  v, u, v:<path>, u:<path>   (views / unique visitors, kept ~400 days)
 *   visits:seen:<YYYY-MM-DD> set   sha256(secret|day|ip|user-agent)[:32]   (only to tell "new today" from "seen today"; expires after 2 days)
 * The raw IP address and user agent are never written anywhere. The hash is salted with the day, so one person cannot be linked from
 * one day to the next. Consequence: "unique" is per day; a range total is the SUM of daily uniques (visitor-days), not distinct people.
 */ /** Indonesia (WIB, UTC+7) has no daylight saving, so a fixed offset is exact. A "day" starts at 00:00 WIB. */ const TZ_OFFSET_MS = 7 * 60 * 60 * 1000;
const COUNTER_TTL_SECONDS = 400 * 24 * 60 * 60;
const SEEN_TTL_SECONDS = 2 * 24 * 60 * 60;
const visitDay = (now = Date.now())=>new Date(now + TZ_OFFSET_MS).toISOString().slice(0, 10);
function dayAdd(day, delta) {
    const date = new Date(`${day}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + delta);
    return date.toISOString().slice(0, 10);
}
function parseRange(value) {
    return value === "7" ? 7 : value === "90" ? 90 : 30;
}
// ---- what counts as a countable page ---------------------------------------------------------------------------------------
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function normalizePath(raw) {
    if (typeof raw !== "string" || raw.length === 0 || raw.length > 200) return null;
    if (!raw.startsWith("/") || raw.startsWith("//") || /[\\\u0000-\u001f]/.test(raw)) return null;
    const clean = raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
    if (clean === "/") return "/";
    const match = /^\/pages\/([^/]+)$/.exec(clean);
    return match && match[1].length <= 48 && SLUG.test(match[1]) ? `/pages/${match[1]}` : null;
}
let loadSlugs = async ()=>{
    const { getContent } = await __turbopack_context__.A("[project]/lib/server/content.ts [app-route] (ecmascript, async loader)") // lazy: the hot path ("/") never loads the content module
    ;
    const content = await getContent();
    return new Set(content.customPages.pages.filter((page)=>page.visible).map((page)=>page.slug));
};
let slugCache = null;
async function pageExists(path, now) {
    if (path === "/") return true;
    if (!slugCache || now - slugCache.at > 60_000) slugCache = {
        at: now,
        slugs: await loadSlugs()
    };
    return slugCache.slugs.has(path.slice("/pages/".length));
}
function _setPageLoaderForTests(loader) {
    slugCache = null;
    loadSlugs = loader ?? loadSlugs;
}
// ---- who counts ----------------------------------------------------------------------------------------------------------------
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|gtmetrix|uptime|monitor|curl|wget|python|httpie|axios|node-fetch|undici|go-http|java\/|okhttp|libwww|scrapy|facebookexternalhit|embedly|whatsapp|telegram|discord|slack/i;
const isBot = (userAgent)=>!userAgent || userAgent.length < 12 || BOT.test(userAgent);
const BROWSERS = [
    "Chrome",
    "Safari",
    "Firefox",
    "Edge",
    "Opera",
    "Samsung",
    "Other"
];
const SYSTEMS = [
    "Android",
    "iOS",
    "Windows",
    "macOS",
    "Linux",
    "Other"
];
const SOURCES = [
    "Direct",
    "Google",
    "Bing",
    "DuckDuckGo",
    "LinkedIn",
    "GitHub",
    "X / Twitter",
    "Facebook",
    "Instagram",
    "WhatsApp",
    "YouTube",
    "Reddit",
    "Other site"
];
function describeClient(userAgent) {
    const ua = userAgent;
    const device = /ipad|tablet|(android(?!.*mobile))/i.test(ua) ? "tablet" : /mobi|iphone|ipod|android/i.test(ua) ? "mobile" : "desktop";
    const browser = /edg(e|a|ios)?\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /samsungbrowser/i.test(ua) ? "Samsung" : /firefox|fxios/i.test(ua) ? "Firefox" : /chrome|crios|chromium/i.test(ua) ? "Chrome" : /safari/i.test(ua) ? "Safari" : "Other";
    const os = /android/i.test(ua) ? "Android" : /iphone|ipad|ipod/i.test(ua) ? "iOS" : /windows/i.test(ua) ? "Windows" : /mac os x|macintosh/i.test(ua) ? "macOS" : /linux|x11|cros/i.test(ua) ? "Linux" : "Other";
    return {
        device,
        browser,
        os
    };
}
const SOURCE_HOSTS = [
    [
        /(^|\.)google\./,
        "Google"
    ],
    [
        /(^|\.)bing\.com$/,
        "Bing"
    ],
    [
        /(^|\.)duckduckgo\.com$/,
        "DuckDuckGo"
    ],
    [
        /(^|\.)(linkedin\.com|lnkd\.in)$/,
        "LinkedIn"
    ],
    [
        /(^|\.)github\.(com|io)$/,
        "GitHub"
    ],
    [
        /(^|\.)(twitter\.com|x\.com|t\.co)$/,
        "X / Twitter"
    ],
    [
        /(^|\.)(facebook\.com|fb\.com|fb\.me)$/,
        "Facebook"
    ],
    [
        /(^|\.)instagram\.com$/,
        "Instagram"
    ],
    [
        /(^|\.)(whatsapp\.com|wa\.me)$/,
        "WhatsApp"
    ],
    [
        /(^|\.)(youtube\.com|youtu\.be)$/,
        "YouTube"
    ],
    [
        /(^|\.)reddit\.com$/,
        "Reddit"
    ]
];
function referrerSource(raw, ownHost) {
    if (typeof raw !== "string" || raw.length === 0 || raw.length > 2048) return "Direct";
    let host;
    try {
        host = new URL(raw).hostname.toLowerCase();
    } catch  {
        return "Direct";
    }
    if (!host || ownHost && host === ownHost.split(":")[0].toLowerCase()) return "Direct" // navigating inside the site is not a new source
    ;
    for (const [pattern, name] of SOURCE_HOSTS)if (pattern.test(host)) return name;
    return "Other site";
}
function countryCode(raw) {
    return typeof raw === "string" && /^[A-Za-z]{2}$/.test(raw) && !/^(xx|t1)$/i.test(raw) ? raw.toUpperCase() : null;
}
const processSalt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
function secretSalt() {
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveKey"])("visitors").toString("hex");
    } catch  {
        return processSalt;
    } // no SESSION_SECRET (local dev): per-process random salt
}
function visitorHash(day, ip, userAgent, salt = secretSalt()) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(`${salt}|${day}|${ip}|${userAgent}`).digest("hex").slice(0, 32);
}
// ---- spam damper (in-memory: per server instance; good enough to stop a single noisy client, see docs) -----------------------------
const recent = new Map();
const buckets = new Map();
const DEDUPE_MS = 5_000;
const MAX_PER_MINUTE = 40;
function admit(hash, path, now) {
    if (recent.size + buckets.size > 10_000) {
        recent.clear();
        buckets.clear();
    } // crude memory bound
    const last = recent.get(`${hash}|${path}`);
    if (last !== undefined && now - last < DEDUPE_MS) return false // double-fire (reload storm, React strict mode)
    ;
    let bucket = buckets.get(hash);
    if (!bucket || bucket.resetAt <= now) bucket = {
        count: 0,
        resetAt: now + 60_000
    };
    if (bucket.count >= MAX_PER_MINUTE) return false;
    bucket.count += 1;
    buckets.set(hash, bucket);
    recent.set(`${hash}|${path}`, now);
    return true;
}
function _resetLimiterForTests() {
    recent.clear();
    buckets.clear();
}
// ---- write ---------------------------------------------------------------------------------------------------------------------
const TOTAL_KEY = "visits:total", RECENT_KEY = "visits:recent";
const RECENT_LIMIT = 60;
const RECENT_TTL_SECONDS = 14 * 24 * 60 * 60;
async function recordVisit(input) {
    const now = input.now ?? Date.now();
    const path = normalizePath(input.path);
    if (!path) return {
        counted: false,
        reason: "path"
    };
    if (isBot(input.userAgent)) return {
        counted: false,
        reason: "bot"
    };
    if (!await pageExists(path, now)) return {
        counted: false,
        reason: "unknown-page"
    };
    const day = visitDay(now);
    const hash = visitorHash(day, input.ip, input.userAgent);
    if (!admit(hash, path, now)) return {
        counted: false,
        reason: "rate"
    };
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    const counters = `visits:day:${day}`, seen = `visits:seen:${day}`;
    const client = describeClient(input.userAgent), country = countryCode(input.country), source = referrerSource(input.referrer, input.host);
    const [isNewToday, isNewOnPage] = await Promise.all([
        store.sadd(seen, hash, SEEN_TTL_SECONDS),
        store.sadd(seen, `${hash}|${path}`, SEEN_TTL_SECONDS)
    ]);
    const writes = [
        store.hincr(counters, "v", 1, COUNTER_TTL_SECONDS),
        store.hincr(counters, `v:${path}`, 1, COUNTER_TTL_SECONDS),
        store.hincr(TOTAL_KEY, "v", 1)
    ];
    if (isNewOnPage) writes.push(store.hincr(counters, `u:${path}`, 1, COUNTER_TTL_SECONDS));
    if (isNewToday) {
        writes.push(store.hincr(counters, "u", 1, COUNTER_TTL_SECONDS), store.hincr(TOTAL_KEY, "u", 1), store.hincr(counters, `ud:${client.device}`, 1, COUNTER_TTL_SECONDS), store.hincr(counters, `ub:${client.browser}`, 1, COUNTER_TTL_SECONDS), store.hincr(counters, `ur:${source}`, 1, COUNTER_TTL_SECONDS));
        if (country) writes.push(store.hincr(counters, `uc:${country}`, 1, COUNTER_TTL_SECONDS));
    }
    const entry = {
        t: now,
        p: path,
        d: client.device,
        b: client.browser,
        o: client.os,
        c: country,
        r: source,
        n: isNewToday
    };
    writes.push(store.lpush(RECENT_KEY, JSON.stringify(entry), RECENT_LIMIT, RECENT_TTL_SECONDS));
    await Promise.all(writes);
    return {
        counted: true
    };
}
const count = (value)=>Math.max(0, Math.trunc(Number(value) || 0));
const sum = (rows)=>rows.reduce((acc, row)=>({
            views: acc.views + row.views,
            uniques: acc.uniques + row.uniques
        }), {
        views: 0,
        uniques: 0
    });
const pair = (row)=>({
        views: row?.views ?? 0,
        uniques: row?.uniques ?? 0
    });
function slices(hashes, prefix, limit) {
    const totals = new Map();
    for (const hash of hashes)for (const [field, value] of Object.entries(hash))if (field.startsWith(prefix)) totals.set(field.slice(prefix.length), (totals.get(field.slice(prefix.length)) ?? 0) + count(value));
    const sorted = [
        ...totals
    ].filter(([, n])=>n > 0).sort((a, b)=>b[1] - a[1] || a[0].localeCompare(b[0]));
    const head = sorted.slice(0, limit).map(([name, n])=>({
            name,
            count: n
        }));
    const rest = sorted.slice(limit).reduce((acc, [, n])=>acc + n, 0);
    return rest > 0 ? [
        ...head,
        {
            name: "Other",
            count: rest
        }
    ] : head;
}
function parseRecent(rows) {
    const out = [];
    for (const raw of rows){
        try {
            const v = JSON.parse(raw);
            if (typeof v.t !== "number" || typeof v.p !== "string") continue;
            out.push({
                t: v.t,
                p: v.p,
                n: v.n === true,
                c: countryCode(v.c),
                d: v.d === "mobile" || v.d === "tablet" ? v.d : "desktop",
                b: BROWSERS.includes(v.b) ? v.b : "Other",
                o: SYSTEMS.includes(v.o) ? v.o : "Other",
                r: SOURCES.includes(v.r) ? v.r : "Direct"
            });
        } catch  {}
    }
    return out;
}
async function getVisitorStats(range, now = Date.now()) {
    const today = visitDay(now);
    const span = Math.max(range, 60) // the comparison cards need 60 days (this 30 + the 30 before)
    ;
    const dayKeys = Array.from({
        length: span
    }, (_, index)=>dayAdd(today, index - (span - 1)));
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    const [hashes, total, recent] = await Promise.all([
        store.hgetallMany(dayKeys.map((day)=>`visits:day:${day}`)),
        store.hgetall(TOTAL_KEY),
        store.lrange(RECENT_KEY, 30)
    ]);
    const all = dayKeys.map((day, index)=>({
            day,
            views: count(hashes[index].v),
            uniques: count(hashes[index].u)
        }));
    const chart = all.slice(-range);
    const inRange = hashes.slice(-range);
    const pages = new Map();
    for (const hash of inRange){
        for (const [field, value] of Object.entries(hash)){
            const kind = field.startsWith("v:") ? "views" : field.startsWith("u:") ? "uniques" : null;
            if (!kind) continue;
            const path = field.slice(2);
            const entry = pages.get(path) ?? {
                path,
                views: 0,
                uniques: 0
            };
            entry[kind] += count(value);
            pages.set(path, entry);
        }
    }
    const topPages = [
        ...pages.values()
    ].sort((a, b)=>b.views - a.views || b.uniques - a.uniques || a.path.localeCompare(b.path)).slice(0, 8);
    const n = all.length;
    const last7 = sum(all.slice(-7)), last30 = sum(all.slice(-30));
    return {
        range,
        timezone: "Asia/Jakarta",
        days: chart,
        totals: {
            today: pair(all[n - 1]),
            yesterday: pair(all[n - 2]),
            last7,
            previous7: sum(all.slice(-14, -7)),
            last30,
            previous30: sum(all.slice(-60, -30)),
            range: sum(chart),
            // counted from the first hit on; never smaller than what the retained daily numbers add up to (covers hits made before the total existed)
            allTime: {
                views: Math.max(count(total.v), sum(all).views),
                uniques: Math.max(count(total.u), sum(all).uniques)
            }
        },
        topPages,
        breakdown: {
            devices: slices(inRange, "ud:", 3),
            browsers: slices(inRange, "ub:", 5),
            countries: slices(inRange, "uc:", 6),
            sources: slices(inRange, "ur:", 6)
        },
        recent: parseRecent(recent),
        generatedAt: new Date(now).toISOString()
    };
}
async function resetVisitorStats(now = Date.now()) {
    const today = visitDay(now);
    const span = Math.ceil(COUNTER_TTL_SECONDS / 86_400) + 2 // everything that could still exist
    ;
    const keys = [
        TOTAL_KEY,
        RECENT_KEY
    ];
    for(let i = 0; i < span; i++){
        const day = dayAdd(today, -i);
        keys.push(`visits:day:${day}`, `visits:seen:${day}`);
    }
    keys.push(`visits:day:${dayAdd(today, 1)}`, `visits:seen:${dayAdd(today, 1)}`); // clock skew between servers
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().delMany(keys);
    _resetLimiterForTests();
    return {
        days: span
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1j1fxxtduqfyv._.js.map