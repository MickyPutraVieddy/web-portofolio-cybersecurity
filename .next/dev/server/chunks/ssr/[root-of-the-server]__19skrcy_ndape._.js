module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/admin/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPage,
    "dynamic",
    ()=>dynamic,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$admin$2d$app$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/admin/admin-app.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const dynamic = "force-dynamic";
const metadata = {
    title: "Admin",
    robots: {
        index: false,
        follow: false
    }
};
async function AdminPage() {
    // Server-side gate: no valid session cookie → login. The API re-checks on every call.
    const requestHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    const request = new Request("http://localhost/admin", {
        headers: new Headers(requestHeaders)
    });
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])(request);
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin/login");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$admin$2d$app$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AdminApp"], {
        user: session.sub,
        method: session.method
    }, void 0, false, {
        fileName: "[project]/app/admin/page.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/admin/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/admin/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/components/admin/admin-app.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminApp",
    ()=>AdminApp
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AdminApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AdminApp() from the server but AdminApp is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/admin/admin-app.tsx", "AdminApp");
}),
"[project]/components/admin/admin-app.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$admin$2d$app$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/admin/admin-app.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$admin$2d$app$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/lib/server/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-rsc] (ecmascript)");
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
        const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().get(limiterKey(ip));
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
        const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])();
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().del(limiterKey(ip));
    } catch  {}
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__19skrcy_ndape._.js.map