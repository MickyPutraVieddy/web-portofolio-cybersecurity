module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/admin/login/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage,
    "dynamic",
    ()=>dynamic,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$login$2d$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/admin/login-form.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$handlers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/handlers.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
const dynamic = "force-dynamic";
const metadata = {
    title: "Admin sign in",
    robots: {
        index: false,
        follow: false
    }
};
async function LoginPage() {
    // Already signed in → straight to the admin (one redirect, no form flash).
    const requestHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    const request = new Request("http://localhost/admin/login", {
        headers: new Headers(requestHeaders)
    });
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])(request)) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin");
    // The form is drawn on the server with its real configuration, so the fields are in the very first paint.
    // If the configuration cannot be read here, fall back to the old behaviour (the browser asks the API).
    const initialConfig = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$handlers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginConfig"])().catch(()=>null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$login$2d$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LoginForm"], {
        initialConfig: initialConfig
    }, void 0, false, {
        fileName: "[project]/app/admin/login/page.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/admin/login/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/admin/login/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/components/admin/login-form.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginForm",
    ()=>LoginForm
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LoginForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LoginForm() from the server but LoginForm is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/admin/login-form.tsx", "LoginForm");
}),
"[project]/components/admin/login-form.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$login$2d$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/admin/login-form.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$login$2d$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/lib/qr.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "qrMatrix",
    ()=>qrMatrix,
    "qrRows",
    ()=>qrRows
]);
/**
 * Minimal QR Code encoder (ISO/IEC 18004): byte mode, error-correction level M, versions 1–10, automatic mask choice.
 * No dependencies — used to draw the Google Authenticator enrollment code. Output is a boolean matrix (true = dark module).
 */ // Level M tables, index = version (1..10)
const ECC_PER_BLOCK = [
    0,
    10,
    16,
    26,
    18,
    24,
    16,
    18,
    22,
    22,
    26
];
const BLOCKS = [
    0,
    1,
    1,
    1,
    2,
    2,
    4,
    4,
    4,
    5,
    5
];
const FORMAT_BITS_M = 0;
const MAX_VERSION = 10;
function rawModules(ver) {
    let result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
        const n = Math.floor(ver / 7) + 2;
        result -= (25 * n - 10) * n - 55;
        if (ver >= 7) result -= 36;
    }
    return result;
}
const dataCodewords = (ver)=>Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[ver] * BLOCKS[ver];
// ---- Reed–Solomon over GF(2^8) / 0x11D
function gfMul(x, y) {
    let z = 0;
    for(let i = 7; i >= 0; i--){
        z = z << 1 ^ (z >>> 7) * 0x11d;
        z ^= (y >>> i & 1) * x;
    }
    return z;
}
function rsDivisor(degree) {
    const result = new Array(degree).fill(0);
    result[degree - 1] = 1;
    let root = 1;
    for(let i = 0; i < degree; i++){
        for(let j = 0; j < result.length; j++){
            result[j] = gfMul(result[j], root);
            if (j + 1 < result.length) result[j] ^= result[j + 1];
        }
        root = gfMul(root, 0x02);
    }
    return result;
}
function rsRemainder(data, divisor) {
    const result = divisor.map(()=>0);
    for (const b of data){
        const factor = b ^ result.shift();
        result.push(0);
        divisor.forEach((coef, i)=>{
            result[i] ^= gfMul(coef, factor);
        });
    }
    return result;
}
function alignmentPositions(ver) {
    if (ver === 1) return [];
    const n = Math.floor(ver / 7) + 2;
    const step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
    const out = [
        6
    ];
    for(let pos = ver * 4 + 10; out.length < n; pos -= step)out.splice(1, 0, pos);
    return out;
}
function buildCodewords(bytes, ver) {
    const bits = [];
    const push = (value, len)=>{
        for(let i = len - 1; i >= 0; i--)bits.push(value >>> i & 1);
    };
    push(0b0100, 4);
    push(bytes.length, ver >= 10 ? 16 : 8);
    for (const b of bytes)push(b, 8);
    const capacityBits = dataCodewords(ver) * 8;
    push(0, Math.min(4, capacityBits - bits.length));
    push(0, (8 - bits.length % 8) % 8);
    const data = [];
    for(let i = 0; i < bits.length; i += 8)data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
    for(let pad = 0xec; data.length < dataCodewords(ver); pad ^= 0xec ^ 0x11)data.push(pad);
    const numBlocks = BLOCKS[ver], eccLen = ECC_PER_BLOCK[ver];
    const raw = Math.floor(rawModules(ver) / 8);
    const shortBlocks = numBlocks - raw % numBlocks;
    const shortLen = Math.floor(raw / numBlocks);
    const divisor = rsDivisor(eccLen);
    const blocks = [];
    for(let i = 0, k = 0; i < numBlocks; i++){
        const dat = data.slice(k, k + shortLen - eccLen + (i < shortBlocks ? 0 : 1));
        k += dat.length;
        const ecc = rsRemainder(dat, divisor);
        if (i < shortBlocks) dat.push(0);
        blocks.push(dat.concat(ecc));
    }
    const result = [];
    for(let i = 0; i < blocks[0].length; i++)blocks.forEach((block, j)=>{
        if (i !== shortLen - eccLen || j >= shortBlocks) result.push(block[i]);
    });
    return result;
}
function penalty(m) {
    const n = m.length;
    let score = 0;
    const line = (get)=>{
        let run = 1;
        for(let i = 1; i < n; i++){
            if (get(i) === get(i - 1)) {
                run++;
                if (run === 5) score += 3;
                else if (run > 5) score++;
            } else run = 1;
        }
        // finder-like 1:1:3:1:1 pattern with 4 light modules on either side
        const pat = [
            true,
            false,
            true,
            true,
            true,
            false,
            true
        ];
        for(let i = 0; i + 7 <= n; i++){
            if (!pat.every((v, k)=>get(i + k) === v)) continue;
            const lightBefore = i >= 4 && [
                1,
                2,
                3,
                4
            ].every((k)=>!get(i - k));
            const lightAfter = i + 11 <= n && [
                7,
                8,
                9,
                10
            ].every((k)=>!get(i + k));
            if (lightBefore || lightAfter) score += 40;
        }
    };
    for(let y = 0; y < n; y++)line((x)=>m[y][x]);
    for(let x = 0; x < n; x++)line((y)=>m[y][x]);
    for(let y = 0; y + 1 < n; y++)for(let x = 0; x + 1 < n; x++)if (m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) score += 3;
    const dark = m.reduce((a, row)=>a + row.filter(Boolean).length, 0);
    score += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
    return score;
}
const MASKS = [
    (x, y)=>(x + y) % 2 === 0,
    (_x, y)=>y % 2 === 0,
    (x)=>x % 3 === 0,
    (x, y)=>(x + y) % 3 === 0,
    (x, y)=>(Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
    (x, y)=>x * y % 2 + x * y % 3 === 0,
    (x, y)=>(x * y % 2 + x * y % 3) % 2 === 0,
    (x, y)=>((x + y) % 2 + x * y % 3) % 2 === 0
];
function qrMatrix(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let ver = 1;
    while(ver <= MAX_VERSION && dataCodewords(ver) * 8 < 4 + (ver >= 10 ? 16 : 8) + bytes.length * 8)ver++;
    if (ver > MAX_VERSION) throw new Error("Text is too long for this QR encoder");
    const size = ver * 4 + 17;
    const modules = Array.from({
        length: size
    }, ()=>new Array(size).fill(false));
    const isFn = Array.from({
        length: size
    }, ()=>new Array(size).fill(false));
    const set = (x, y, dark)=>{
        modules[y][x] = dark;
        isFn[y][x] = true;
    };
    for(let i = 0; i < size; i++){
        set(6, i, i % 2 === 0);
        set(i, 6, i % 2 === 0);
    }
    for (const [cx, cy] of [
        [
            3,
            3
        ],
        [
            size - 4,
            3
        ],
        [
            3,
            size - 4
        ]
    ])for(let dy = -4; dy <= 4; dy++)for(let dx = -4; dx <= 4; dx++){
        const x = cx + dx, y = cy + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, Math.max(Math.abs(dx), Math.abs(dy)) !== 2 && Math.max(Math.abs(dx), Math.abs(dy)) !== 4);
    }
    const align = alignmentPositions(ver);
    align.forEach((ax, i)=>align.forEach((ay, j)=>{
            if (i === 0 && j === 0 || i === 0 && j === align.length - 1 || i === align.length - 1 && j === 0) return;
            for(let dy = -2; dy <= 2; dy++)for(let dx = -2; dx <= 2; dx++)set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }));
    const drawFormat = (mask)=>{
        const data = FORMAT_BITS_M << 3 | mask;
        let rem = data;
        for(let i = 0; i < 10; i++)rem = rem << 1 ^ (rem >>> 9) * 0x537;
        const bits = (data << 10 | rem) ^ 0x5412;
        const bit = (i)=>(bits >>> i & 1) !== 0;
        for(let i = 0; i <= 5; i++)set(8, i, bit(i));
        set(8, 7, bit(6));
        set(8, 8, bit(7));
        set(7, 8, bit(8));
        for(let i = 9; i < 15; i++)set(14 - i, 8, bit(i));
        for(let i = 0; i < 8; i++)set(size - 1 - i, 8, bit(i));
        for(let i = 8; i < 15; i++)set(8, size - 15 + i, bit(i));
        set(8, size - 8, true);
    };
    drawFormat(0);
    if (ver >= 7) {
        let rem = ver;
        for(let i = 0; i < 12; i++)rem = rem << 1 ^ (rem >>> 11) * 0x1f25;
        const bits = ver << 12 | rem;
        for(let i = 0; i < 18; i++){
            const dark = (bits >>> i & 1) !== 0, a = size - 11 + i % 3, b = Math.floor(i / 3);
            set(a, b, dark);
            set(b, a, dark);
        }
    }
    const codewords = buildCodewords(bytes, ver);
    let bitIndex = 0;
    for(let right = size - 1; right >= 1; right -= 2){
        if (right === 6) right = 5;
        for(let vert = 0; vert < size; vert++)for(let j = 0; j < 2; j++){
            const x = right - j, upward = (right + 1 & 2) === 0, y = upward ? size - 1 - vert : vert;
            if (!isFn[y][x] && bitIndex < codewords.length * 8) {
                modules[y][x] = (codewords[bitIndex >>> 3] >>> 7 - (bitIndex & 7) & 1) !== 0;
                bitIndex++;
            }
        }
    }
    const applyMask = (mask)=>{
        for(let y = 0; y < size; y++)for(let x = 0; x < size; x++)if (!isFn[y][x] && MASKS[mask](x, y)) modules[y][x] = !modules[y][x];
    };
    let best = 0, bestScore = Infinity;
    for(let mask = 0; mask < 8; mask++){
        drawFormat(mask);
        applyMask(mask);
        const score = penalty(modules);
        if (score < bestScore) {
            best = mask;
            bestScore = score;
        }
        applyMask(mask);
    }
    drawFormat(best);
    applyMask(best);
    return modules;
}
const qrRows = (text)=>qrMatrix(text).map((row)=>row.map((d)=>d ? "1" : "0").join(""));
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
"[project]/lib/server/handlers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auditHandler",
    ()=>auditHandler,
    "authConfigHandler",
    ()=>authConfigHandler,
    "contentGetHandler",
    ()=>contentGetHandler,
    "contentPutHandler",
    ()=>contentPutHandler,
    "contentRestoreHandler",
    ()=>contentRestoreHandler,
    "googleCallbackHandler",
    ()=>googleCallbackHandler,
    "googleStartHandler",
    ()=>googleStartHandler,
    "loginConfig",
    ()=>loginConfig,
    "loginHandler",
    ()=>loginHandler,
    "logoutHandler",
    ()=>logoutHandler,
    "mediaGetHandler",
    ()=>mediaGetHandler,
    "mediaUploadHandler",
    ()=>mediaUploadHandler,
    "sessionHandler",
    ()=>sessionHandler,
    "twoFactorActionHandler",
    ()=>twoFactorActionHandler,
    "twoFactorStatusHandler",
    ()=>twoFactorStatusHandler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/twofa.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/content.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/passkey.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
const baseHeaders = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
};
function json(body, status = 200, extra = {}) {
    const headers = new Headers({
        ...baseHeaders,
        "Content-Type": "application/json"
    });
    for (const [key, value] of Object.entries(extra))for (const v of Array.isArray(value) ? value : [
        value
    ])headers.append(key, v);
    return new Response(JSON.stringify(body), {
        status,
        headers
    });
}
const sleep = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
function errorResponse(error) {
    if (error instanceof SyntaxError) return json({
        error: "bad-request",
        message: "Malformed JSON"
    }, 400);
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ValidationError"]) return json({
        error: "validation",
        issues: error.issues
    }, 422);
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConflictError"]) return json({
        error: "conflict",
        message: error.message
    }, 409);
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StorageNotConfigured"]) return json({
        error: "storage",
        message: error.message
    }, 503);
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConfigError"]) return json({
        error: "config",
        message: error.message
    }, 503);
    return json({
        error: "server",
        message: "Something went wrong"
    }, 500);
}
/** Every admin write passes through here: valid session + same-origin + custom header. */ function guard(request, mutation) {
    if (mutation && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sameOriginMutation"])(request)) return {
        ok: false,
        response: json({
            error: "forbidden"
        }, 403)
    };
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])(request);
    if (!session) return {
        ok: false,
        response: json({
            error: "unauthorized"
        }, 401)
    };
    return {
        ok: true,
        actor: session.sub
    };
}
async function loginConfig() {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["publicAuthConfig"])();
    // Tells the login page whether to ask for a code (env secret OR a secret enrolled in the admin).
    const totp = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorRequired"])().catch(()=>config.totp);
    // Lets the login page lead with the passkey button, and drop the password form once passkey-only is on.
    const passkey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["passkeyPublicState"])().catch(()=>({
            count: 0,
            passwordlessOnly: false
        }));
    // Passkey-only also switches Google sign-in off (it is another way in that does not use a passkey).
    return {
        ...config,
        google: config.google && !passkey.passwordlessOnly,
        totp,
        passkey
    };
}
async function authConfigHandler() {
    return json(await loginConfig());
}
async function sessionHandler(request) {
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])(request);
    return json(session ? {
        authenticated: true,
        user: session.sub,
        method: session.method
    } : {
        authenticated: false
    });
}
async function loginHandler(request) {
    try {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sameOriginMutation"])(request)) return json({
            error: "forbidden"
        }, 403);
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authConfig"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["publicAuthConfig"])().password) return json({
            error: "config",
            message: "Admin password login is not configured."
        }, 503);
        // Passkey-only policy: password and authenticator-code sign-in are OFF. Fails closed if the policy cannot be read.
        if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["passwordlessOnly"])()) return json({
            error: "passwordless",
            message: "Password sign-in is turned off. Sign in with your passkey."
        }, 403);
        const ip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clientIp"])(request);
        const blocked = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginBlockedFor"])(ip);
        if (blocked) return json({
            error: "locked",
            message: `Too many attempts. Try again in ${Math.ceil(blocked / 60)} minutes.`
        }, 429, {
            "Retry-After": String(blocked)
        });
        const body = await request.json().catch(()=>({}));
        const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
        const totp = typeof body.totp === "string" ? body.totp.trim() : "";
        // Fail closed: if we cannot tell whether 2FA is on (store down), nobody gets in.
        const needsSecondFactor = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorRequired"])();
        const passwordOk = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyPassword"])(password, config.passwordHash);
        // The code is only checked (and a recovery code only consumed) once the password is right.
        const second = !needsSecondFactor ? {
            ok: true,
            method: undefined
        } : passwordOk ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifySecondFactor"])(totp) : {
            ok: false
        };
        if (!passwordOk || !second.ok) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordLoginFailure"])(ip);
            await sleep(500);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeAudit"])("anonymous", "login-failed", `ip ${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(ip).digest("hex").slice(0, 8)}`).catch(()=>{});
            // Same message whichever factor failed, so nothing is revealed.
            return json({
                error: "invalid",
                message: "Invalid credentials."
            }, 401);
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearLoginFailures"])(ip);
        const how = !needsSecondFactor ? "password" : second.method === "recovery" ? `password+recovery (${second.recoveryRemaining} left)` : "password+totp";
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeAudit"])("admin", "login", how).catch(()=>{});
        return json({
            ok: true,
            ...second.method === "recovery" ? {
                recoveryRemaining: second.recoveryRemaining
            } : {}
        }, 200, {
            "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSessionCookie"])(request, {
                sub: "admin",
                method: "password"
            })
        });
    } catch (error) {
        return errorResponse(error);
    }
}
async function logoutHandler(request) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sameOriginMutation"])(request)) return json({
        error: "forbidden"
    }, 403);
    return json({
        ok: true
    }, 200, {
        "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearSessionCookie"])(request)
    });
}
async function twoFactorStatusHandler(request) {
    const auth = guard(request, false);
    if (!auth.ok) return auth.response;
    try {
        const state = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorState"])();
        return json({
            ...state,
            passwordRequired: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["publicAuthConfig"])().password
        });
    } catch (error) {
        return errorResponse(error);
    }
}
const twoFactorMessages = {
    "already-enabled": [
        409,
        "Two-factor authentication is already on."
    ],
    "managed-by-env": [
        409,
        "Two-factor is set by the ADMIN_TOTP_SECRET environment variable. Remove that variable to manage it here."
    ],
    "not-enabled": [
        409,
        "Two-factor authentication is not on."
    ],
    "no-pending": [
        409,
        "The setup expired. Start again to get a new QR code."
    ],
    "invalid-code": [
        400,
        "That code is not valid. Check the time on your phone and try the next code."
    ]
};
async function twoFactorActionHandler(request) {
    const auth = guard(request, true);
    if (!auth.ok) return auth.response;
    try {
        const body = await request.json().catch(()=>({}));
        const action = typeof body.action === "string" ? body.action : "";
        const code = typeof body.code === "string" ? body.code.slice(0, 40) : "";
        const blocked = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorBlockedFor"])(auth.actor);
        if (blocked) return json({
            error: "locked",
            message: `Too many wrong codes. Try again in ${Math.ceil(blocked / 60)} minutes.`
        }, 429, {
            "Retry-After": String(blocked)
        });
        try {
            if (action === "start") {
                // Starting (re)enrolment needs the password again, so a left-open session alone cannot add a second factor.
                const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authConfig"])();
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["publicAuthConfig"])().password) {
                    const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
                    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyPassword"])(password, config.passwordHash)) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorRecordFailure"])(auth.actor);
                        return json({
                            error: "invalid-password",
                            message: "That password is not correct."
                        }, 400);
                    }
                }
                return json(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startEnrollment"])());
            }
            if (action === "confirm") {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["confirmEnrollment"])(code);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorClearFailures"])(auth.actor);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, "2fa-enabled", "authenticator app").catch(()=>{});
                return json(result);
            }
            if (action === "disable") {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["disableTwoFactor"])(code);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorClearFailures"])(auth.actor);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, "2fa-disabled").catch(()=>{});
                return json({
                    ok: true
                });
            }
            if (action === "recovery") {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["regenerateRecoveryCodes"])(code);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorClearFailures"])(auth.actor);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, "2fa-recovery-regenerated").catch(()=>{});
                return json(result);
            }
            return json({
                error: "bad-request",
                message: "Unknown action"
            }, 400);
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TwoFactorError"]) {
                if (error.code === "invalid-code") await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twoFactorRecordFailure"])(auth.actor);
                const [status, message] = twoFactorMessages[error.code];
                return json({
                    error: error.code,
                    message
                }, status);
            }
            throw error;
        }
    } catch (error) {
        return errorResponse(error);
    }
}
// ---- Google OAuth (authorization code + PKCE) ----------------------------------------
const oauthCookie = "admin_oauth";
const siteOrigin = (request)=>process.env.SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin;
async function googleStartHandler(request) {
    try {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authConfig"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["publicAuthConfig"])().google) return Response.redirect(new URL("/admin/login?error=google-config", request.url), 302);
        // Passkey-only policy: Google sign-in is OFF too. Fails closed if the policy cannot be read.
        if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["passwordlessOnly"])()) return Response.redirect(new URL("/admin/login?error=google-passwordless", request.url), 302);
        const state = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
        const nonce = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
        const verifier = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("base64url");
        const challenge = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(verifier).digest("base64url");
        const params = new URLSearchParams({
            client_id: config.googleId,
            redirect_uri: `${siteOrigin(request)}/api/admin/google/callback`,
            response_type: "code",
            scope: "openid email",
            state,
            nonce,
            code_challenge: challenge,
            code_challenge_method: "S256",
            prompt: "select_account"
        });
        const secure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSecureRequest"])(request);
        return new Response(null, {
            status: 302,
            headers: {
                Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
                "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildCookie"])(oauthCookie, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signToken"])({
                    state,
                    nonce,
                    verifier
                }, 600), {
                    secure,
                    maxAge: 600,
                    path: "/api/admin/google"
                }),
                ...baseHeaders
            }
        });
    } catch (error) {
        return errorResponse(error);
    }
}
async function googleCallbackHandler(request) {
    const fail = (code)=>new Response(null, {
            status: 302,
            headers: {
                Location: `/admin/login?error=${code}`,
                "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildCookie"])(oauthCookie, "", {
                    secure: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSecureRequest"])(request),
                    maxAge: 0,
                    path: "/api/admin/google"
                }),
                ...baseHeaders
            }
        });
    try {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authConfig"])();
        if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["passwordlessOnly"])()) return fail("google-passwordless");
        const url = new URL(request.url);
        const saved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyToken"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["readCookie"])(request, oauthCookie));
        const code = url.searchParams.get("code");
        if (!saved || !code || url.searchParams.get("state") !== saved.state) return fail("google-state");
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            cache: "no-store",
            body: new URLSearchParams({
                code,
                client_id: config.googleId,
                client_secret: config.googleSecret,
                redirect_uri: `${siteOrigin(request)}/api/admin/google/callback`,
                grant_type: "authorization_code",
                code_verifier: saved.verifier
            })
        });
        if (!tokenResponse.ok) return fail("google-token");
        const { id_token: idToken } = await tokenResponse.json();
        // The ID token came straight from Google over TLS in exchange for our secret, so its claims can be trusted.
        const claims = JSON.parse(Buffer.from((idToken || "").split(".")[1] || "", "base64url").toString("utf8"));
        const validIssuer = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
        if (claims.aud !== config.googleId || !validIssuer || !claims.exp || claims.exp * 1000 < Date.now() || claims.nonce !== saved.nonce) return fail("google-token");
        const email = (claims.email || "").toLowerCase();
        if (!claims.email_verified || !config.adminEmails.includes(email)) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeAudit"])("anonymous", "google-denied", email.slice(0, 80)).catch(()=>{});
            return fail("google-denied");
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeAudit"])(email, "login", "google").catch(()=>{});
        // Respond with a page (not a redirect) so the next request to /admin is same-site and carries the cookie.
        const headers = new Headers({
            "Content-Type": "text/html; charset=utf-8",
            ...baseHeaders
        });
        headers.append("Set-Cookie", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSessionCookie"])(request, {
            sub: email,
            method: "google"
        }));
        headers.append("Set-Cookie", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildCookie"])(oauthCookie, "", {
            secure: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSecureRequest"])(request),
            maxAge: 0,
            path: "/api/admin/google"
        }));
        return new Response(`<!doctype html><meta charset="utf-8"><title>Signing in…</title><script>location.replace("/admin")</script><noscript><a href="/admin">Continue</a></noscript>`, {
            status: 200,
            headers
        });
    } catch  {
        return fail("google-error");
    }
}
async function contentGetHandler(request) {
    const auth = guard(request, false);
    if (!auth.ok) return auth.response;
    try {
        const [content, history] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getContent"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getHistory"])()
        ]);
        return json({
            content,
            history: history.map(({ version, savedAt, by })=>({
                    version,
                    savedAt,
                    by
                }))
        });
    } catch (error) {
        return errorResponse(error);
    }
}
async function contentPutHandler(request) {
    const auth = guard(request, true);
    if (!auth.ok) return auth.response;
    try {
        const body = await request.json();
        if (typeof body.baseVersion !== "number") return json({
            error: "validation",
            issues: [
                {
                    path: "baseVersion",
                    message: "Required"
                }
            ]
        }, 422);
        const content = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveContent"])(body.content, body.baseVersion, auth.actor);
        return json({
            content
        });
    } catch (error) {
        return errorResponse(error);
    }
}
async function contentRestoreHandler(request) {
    const auth = guard(request, true);
    if (!auth.ok) return auth.response;
    try {
        const body = await request.json();
        if (typeof body.version !== "number" || typeof body.baseVersion !== "number") return json({
            error: "validation",
            issues: [
                {
                    path: "version",
                    message: "Required"
                }
            ]
        }, 422);
        return json({
            content: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["restoreVersion"])(body.version, body.baseVersion, auth.actor)
        });
    } catch (error) {
        return errorResponse(error);
    }
}
async function mediaUploadHandler(request) {
    const auth = guard(request, true);
    if (!auth.ok) return auth.response;
    try {
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof Blob)) return json({
            error: "validation",
            issues: [
                {
                    path: "file",
                    message: "No file"
                }
            ]
        }, 422);
        return json({
            url: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveMedia"])(Buffer.from(await file.arrayBuffer()), auth.actor)
        });
    } catch (error) {
        return errorResponse(error);
    }
}
async function auditHandler(request) {
    const auth = guard(request, false);
    if (!auth.ok) return auth.response;
    try {
        return json({
            audit: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAudit"])()
        });
    } catch (error) {
        return errorResponse(error);
    }
}
async function mediaGetHandler(id) {
    const media = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["readMedia"])(id);
    if (!media) return new Response("Not found", {
        status: 404
    });
    return new Response(new Uint8Array(media.bytes), {
        headers: {
            "Content-Type": media.mime,
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Security-Policy": "default-src 'none'; sandbox"
        }
    });
}
}),
"[project]/lib/server/passkey.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_PASSKEYS",
    ()=>MAX_PASSKEYS,
    "PasskeyError",
    ()=>PasskeyError,
    "RP_NAME",
    ()=>RP_NAME,
    "beginLogin",
    ()=>beginLogin,
    "beginRegistration",
    ()=>beginRegistration,
    "challengeCookieName",
    ()=>challengeCookieName,
    "cleanName",
    ()=>cleanName,
    "clearChallengeCookie",
    ()=>clearChallengeCookie,
    "consumeRecoveryCode",
    ()=>consumeRecoveryCode,
    "expectedUserHandle",
    ()=>expectedUserHandle,
    "finishLogin",
    ()=>finishLogin,
    "finishRegistration",
    ()=>finishRegistration,
    "getEngine",
    ()=>getEngine,
    "passkeyPublicState",
    ()=>passkeyPublicState,
    "passkeyStatus",
    ()=>passkeyStatus,
    "passwordlessOnly",
    ()=>passwordlessOnly,
    "regenerateRecovery",
    ()=>regenerateRecovery,
    "removePasskey",
    ()=>removePasskey,
    "renamePasskey",
    ()=>renamePasskey,
    "setEngineForTests",
    ()=>setEngineForTests,
    "setPasswordlessOnly",
    ()=>setPasswordlessOnly,
    "webauthnConfig",
    ()=>webauthnConfig
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/twofa.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-rsc] (ecmascript)");
;
;
;
;
let engineOverride = null;
function setEngineForTests(engine) {
    engineOverride = engine;
}
async function getEngine() {
    if (engineOverride) return engineOverride;
    return (await __turbopack_context__.A("[project]/lib/server/webauthn-engine.ts [app-rsc] (ecmascript, async loader)")).realEngine;
}
const RP_NAME = "Portfolio Admin";
function webauthnConfig(request) {
    const pinned = (process.env.WEBAUTHN_ORIGIN || process.env.SITE_URL || "").trim().replace(/\/$/, "");
    let origin = pinned;
    if (!origin) {
        // Without a pinned origin only local development is accepted: a deployed site must set SITE_URL.
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
        origin = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSecureRequest"])(request) ? "https" : "http"}://${host}`;
    }
    let url;
    try {
        url = new URL(origin);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConfigError"]("SITE_URL / WEBAUTHN_ORIGIN is not a valid origin.");
    }
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConfigError"]("Passkeys need https (http is only allowed on localhost).");
    }
    const rpID = (process.env.WEBAUTHN_RP_ID || "").trim() || url.hostname;
    if (url.hostname !== rpID && !url.hostname.endsWith("." + rpID)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConfigError"]("WEBAUTHN_RP_ID must equal the site's domain (or a parent of it).");
    }
    return {
        origin: url.origin,
        rpID,
        rpName: RP_NAME
    };
}
const STATE_KEY = "admin:passkeys";
const MAX_PASSKEYS = 10;
const emptyState = ()=>({
        v: 1,
        userHandle: "",
        creds: [],
        passwordlessOnly: false,
        passwordlessSince: null,
        recovery: [],
        recoveryAt: null
    });
async function readState() {
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().get(STATE_KEY);
    if (!raw) return emptyState();
    let state;
    try {
        state = JSON.parse(raw);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConfigError"]("The stored passkey record is damaged.");
    }
    if (state?.v !== 1 || !Array.isArray(state.creds) || !Array.isArray(state.recovery)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConfigError"]("The stored passkey record is damaged.");
    }
    return state;
}
const writeState = (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().set(STATE_KEY, JSON.stringify(state));
async function passkeyPublicState() {
    const s = await readState();
    return {
        count: s.creds.length,
        passwordlessOnly: s.passwordlessOnly
    };
}
async function passwordlessOnly() {
    return (await readState()).passwordlessOnly;
}
const summarize = (c)=>({
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        lastUsedAt: c.lastUsedAt,
        deviceType: c.deviceType,
        backedUp: c.backedUp
    });
const requirementsOf = (s)=>({
        hasPasskey: s.creds.length > 0,
        tested: s.creds.some((c)=>c.lastUsedAt !== null),
        hasRecovery: s.recovery.length > 0
    });
async function passkeyStatus() {
    const s = await readState();
    return {
        passkeys: s.creds.map(summarize),
        passwordlessOnly: s.passwordlessOnly,
        passwordlessSince: s.passwordlessSince,
        recoveryRemaining: s.recovery.length,
        recoveryAt: s.recoveryAt,
        requirements: requirementsOf(s),
        max: MAX_PASSKEYS
    };
}
class PasskeyError extends Error {
    code;
    constructor(code){
        super(code), this.code = code;
    }
}
// ---- challenges: single use, 2-minute life, bound to the browser that asked --------------------------
const CHALLENGE_TTL_MS = 120_000;
const challengeKey = (cid)=>`pk:chal:${cid}`;
const challengeCookieName = (secure)=>secure ? "__Host-admin_pk" : "admin_pk";
async function issueChallenge(request, challenge, purpose, sub, now) {
    const cid = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(18).toString("base64url");
    const record = {
        challenge,
        purpose,
        sub,
        exp: now + CHALLENGE_TTL_MS
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().set(challengeKey(cid), JSON.stringify(record));
    const secure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSecureRequest"])(request);
    // The cookie carries only the lookup id; without THIS browser's cookie the stored challenge cannot be claimed.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildCookie"])(challengeCookieName(secure), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signToken"])({
        cid,
        purpose
    }, CHALLENGE_TTL_MS / 1000), {
        secure,
        maxAge: CHALLENGE_TTL_MS / 1000
    });
}
function clearChallengeCookie(request) {
    const secure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSecureRequest"])(request);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildCookie"])(challengeCookieName(secure), "", {
        secure,
        maxAge: 0
    });
}
/** Reads AND deletes the challenge in one go: whatever happens next, it can never be used a second time. */ async function claimChallenge(request, purpose, now) {
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyToken"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["readCookie"])(request, challengeCookieName((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSecureRequest"])(request))));
    if (!token || typeof token.cid !== "string" || token.purpose !== purpose) {
        return null;
    }
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().take(challengeKey(token.cid));
    // atomic read+delete: a challenge can be claimed exactly once
    if (!raw) return null;
    try {
        const record = JSON.parse(raw);
        return record.purpose === purpose && record.exp > now && typeof record.challenge === "string" ? record : null;
    } catch  {
        return null;
    }
}
async function beginLogin(request, now = Date.now()) {
    const state = await readState();
    if (state.creds.length === 0) {
        throw new PasskeyError("no-passkey");
    }
    const cfg = webauthnConfig(request);
    const options = await (await getEngine()).authenticationOptions({
        rpID: cfg.rpID
    });
    return {
        options,
        cookie: await issueChallenge(request, options.challenge, "login", null, now)
    };
}
async function finishLogin(request, response, now = Date.now()) {
    const record = await claimChallenge(request, "login", now);
    if (!record) return {
        ok: false,
        reason: "challenge"
    };
    const id = response?.id;
    if (typeof id !== "string" || id.length > 1400) {
        return {
            ok: false,
            reason: "bad-request"
        };
    }
    const state = await readState();
    const cred = state.creds.find((c)=>c.id === id);
    if (!cred) return {
        ok: false,
        reason: "unknown-credential"
    };
    // A discoverable credential reports which user it belongs to: it must be OUR admin's handle.
    const reportedHandle = response?.response?.userHandle;
    if (typeof reportedHandle === "string" && reportedHandle !== "" && state.userHandle && reportedHandle !== state.userHandle) {
        return {
            ok: false,
            reason: "verification"
        };
    }
    const cfg = webauthnConfig(request);
    let verified;
    try {
        // Every expected value comes from the server: the stored challenge, the pinned origin and RP ID, the stored public key.
        verified = await (await getEngine()).verifyAuthentication({
            response,
            expectedChallenge: record.challenge,
            expectedOrigin: cfg.origin,
            expectedRPID: cfg.rpID,
            credential: {
                id: cred.id,
                publicKey: cred.publicKey,
                counter: cred.counter,
                transports: cred.transports
            }
        });
    } catch  {
        return {
            ok: false,
            reason: "verification"
        };
    }
    if (!verified.verified) {
        return {
            ok: false,
            reason: "verification"
        };
    }
    // Cloned-authenticator defence (synced passkeys legitimately stay at 0).
    if ((verified.newCounter !== 0 || cred.counter !== 0) && verified.newCounter <= cred.counter) {
        return {
            ok: false,
            reason: "counter"
        };
    }
    const fresh = await readState();
    const target = fresh.creds.find((c)=>c.id === id);
    if (!target) return {
        ok: false,
        reason: "unknown-credential"
    };
    target.counter = verified.newCounter;
    target.lastUsedAt = new Date(now).toISOString();
    await writeState(fresh);
    return {
        ok: true,
        credentialId: cred.id,
        name: cred.name
    };
}
async function beginRegistration(request, actor, now = Date.now()) {
    const state = await readState();
    if (state.creds.length >= MAX_PASSKEYS) {
        throw new PasskeyError("limit");
    }
    const cfg = webauthnConfig(request);
    if (!state.userHandle) {
        state.userHandle = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("base64url");
        await writeState(state);
    }
    // stable WebAuthn user.id, created once
    const userHandle = state.userHandle;
    const options = await (await getEngine()).registrationOptions({
        rpName: cfg.rpName,
        rpID: cfg.rpID,
        userName: "admin",
        userID: new Uint8Array(Buffer.from(userHandle, "base64url")),
        excludeIds: state.creds.map((c)=>c.id)
    });
    return {
        options,
        cookie: await issueChallenge(request, options.challenge, "register", actor, now)
    };
}
const cleanName = (input)=>{
    if (typeof input !== "string") return null;
    const name = input.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").replace(/\s+/g, " ").trim();
    return name.length >= 1 && name.length <= 40 ? name : null;
};
async function finishRegistration(request, actor, response, name, now = Date.now()) {
    const record = await claimChallenge(request, "register", now);
    if (!record || record.sub !== actor) {
        throw new PasskeyError("challenge");
    }
    const cfg = webauthnConfig(request);
    let result;
    try {
        result = await (await getEngine()).verifyRegistration({
            response,
            expectedChallenge: record.challenge,
            expectedOrigin: cfg.origin,
            expectedRPID: cfg.rpID
        });
    } catch  {
        throw new PasskeyError("verification");
    }
    if (!result.verified || !result.credential) {
        throw new PasskeyError("verification");
    }
    const state = await readState();
    if (state.creds.length >= MAX_PASSKEYS) {
        throw new PasskeyError("limit");
    }
    if (state.creds.some((c)=>c.id === result.credential.id)) {
        throw new PasskeyError("duplicate");
    }
    const label = name === undefined || name === "" ? `Passkey ${state.creds.length + 1}` : cleanName(name);
    if (!label) throw new PasskeyError("bad-name");
    const created = {
        ...result.credential,
        name: label,
        createdAt: new Date(now).toISOString(),
        lastUsedAt: null
    };
    state.creds.push(created);
    await writeState(state);
    return summarize(created);
}
async function expectedUserHandle() {
    return (await readState()).userHandle;
}
async function renamePasskey(id, name) {
    const label = cleanName(name);
    if (!label) throw new PasskeyError("bad-name");
    const state = await readState();
    const cred = state.creds.find((c)=>c.id === id);
    if (!cred) throw new PasskeyError("not-found");
    cred.name = label;
    await writeState(state);
}
async function removePasskey(id) {
    const state = await readState();
    if (!state.creds.some((c)=>c.id === id)) {
        throw new PasskeyError("not-found");
    }
    if (state.passwordlessOnly && state.creds.length <= 1) {
        throw new PasskeyError("last-passkey") // would lock everyone out
        ;
    }
    state.creds = state.creds.filter((c)=>c.id !== id);
    await writeState(state);
}
// ---- recovery codes (keyed hashes, single use) ------------------------------------------------------------------------
const recoveryHash = (code)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deriveKey"])("passkey-recovery")).update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeRecovery"])(code)).digest("base64url");
async function regenerateRecovery(now = Date.now()) {
    const state = await readState();
    if (state.creds.length === 0) {
        throw new PasskeyError("no-passkey");
    }
    const codes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateRecoveryCodes"])();
    state.recovery = codes.map(recoveryHash);
    state.recoveryAt = new Date(now).toISOString();
    await writeState(state);
    return codes;
}
async function consumeRecoveryCode(input) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["looksLikeRecovery"])(input)) return null;
    const state = await readState();
    const given = Buffer.from(recoveryHash(input));
    let index = -1;
    // no early exit
    state.recovery.forEach((hash, i)=>{
        const stored = Buffer.from(hash);
        if (stored.length === given.length && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(stored, given)) {
            index = i;
        }
    });
    if (index < 0) return null;
    state.recovery = state.recovery.filter((_, i)=>i !== index);
    await writeState(state);
    return state.recovery.length;
}
async function setPasswordlessOnly(enabled, now = Date.now()) {
    const state = await readState();
    if (enabled) {
        const r = requirementsOf(state);
        if (!r.hasPasskey) throw new PasskeyError("no-passkey");
        if (!r.tested) throw new PasskeyError("not-tested");
        if (!r.hasRecovery) throw new PasskeyError("no-recovery");
    }
    state.passwordlessOnly = enabled;
    state.passwordlessSince = enabled ? new Date(now).toISOString() : null;
    await writeState(state);
}
}),
"[project]/lib/server/twofa.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACCOUNT",
    ()=>ACCOUNT,
    "ISSUER",
    ()=>ISSUER,
    "RECOVERY_CODE_COUNT",
    ()=>RECOVERY_CODE_COUNT,
    "TwoFactorError",
    ()=>TwoFactorError,
    "confirmEnrollment",
    ()=>confirmEnrollment,
    "decryptSecret",
    ()=>decryptSecret,
    "disableTwoFactor",
    ()=>disableTwoFactor,
    "encryptSecret",
    ()=>encryptSecret,
    "generateRecoveryCodes",
    ()=>generateRecoveryCodes,
    "looksLikeRecovery",
    ()=>looksLikeRecovery,
    "normalizeRecovery",
    ()=>normalizeRecovery,
    "regenerateRecoveryCodes",
    ()=>regenerateRecoveryCodes,
    "startEnrollment",
    ()=>startEnrollment,
    "twoFactorBlockedFor",
    ()=>twoFactorBlockedFor,
    "twoFactorClearFailures",
    ()=>twoFactorClearFailures,
    "twoFactorRecordFailure",
    ()=>twoFactorRecordFailure,
    "twoFactorRequired",
    ()=>twoFactorRequired,
    "twoFactorState",
    ()=>twoFactorState,
    "verifySecondFactor",
    ()=>verifySecondFactor
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$qr$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/qr.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-rsc] (ecmascript)");
;
;
;
;
/**
 * Google Authenticator (TOTP, RFC 6238) enrolment and verification.
 *
 *  • Source of truth: ADMIN_TOTP_SECRET (environment) wins; otherwise the secret enrolled in the admin (Security page).
 *  • The enrolled secret is stored AES-256-GCM encrypted with a key derived from SESSION_SECRET — never in plain text.
 *  • A new secret only becomes active after the owner proves the app works by typing a valid code.
 *  • A code can be used once (the time step is remembered); 10 single-use recovery codes are stored only as keyed hashes.
 *  • Both the encryption key and the recovery-code hashes derive from SESSION_SECRET: rotating it invalidates the enrolled 2FA.
 *    Break-glass for the server owner: `node scripts/admin-reset-2fa.mjs` (deletes the stored record, then enrol again).
 *  • Anything unexpected (store unreachable, secret cannot be decrypted) FAILS CLOSED — it never lets a login through.
 */ const RECORD_KEY = "admin:2fa";
const PENDING_KEY = "admin:2fa:pending";
const ENV_LAST_KEY = "admin:2fa:env-last";
const PENDING_TTL_MS = 10 * 60 * 1000;
const RECOVERY_CODE_COUNT = 10;
const ISSUER = "Portfolio Admin";
const ACCOUNT = "admin";
function encryptSecret(plain) {
    const iv = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(12);
    const cipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createCipheriv"])("aes-256-gcm", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deriveKey"])("2fa-secret"), iv);
    const ct = Buffer.concat([
        cipher.update(plain, "utf8"),
        cipher.final()
    ]);
    return `v1.${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${ct.toString("base64url")}`;
}
function decryptSecret(blob) {
    try {
        const [version, iv, tag, ct] = blob.split(".");
        if (version !== "v1" || !iv || !tag || !ct) throw new Error("format");
        const decipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createDecipheriv"])("aes-256-gcm", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deriveKey"])("2fa-secret"), Buffer.from(iv, "base64url"));
        decipher.setAuthTag(Buffer.from(tag, "base64url"));
        return Buffer.concat([
            decipher.update(Buffer.from(ct, "base64url")),
            decipher.final()
        ]).toString("utf8");
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConfigError"]("The stored two-factor secret cannot be read (was SESSION_SECRET changed?). On the server run: node scripts/admin-reset-2fa.mjs");
    }
}
// ---- recovery codes ---------------------------------------------------------------------
const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // 32 symbols, no I/O/0/1 — 256 % 32 == 0 so no modulo bias
;
const normalizeRecovery = (input)=>input.toUpperCase().replace(/[^A-Z0-9]/g, "");
const looksLikeRecovery = (input)=>/^[A-HJ-NP-Z2-9]{10}$/.test(normalizeRecovery(input));
const recoveryHash = (code)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deriveKey"])("2fa-recovery")).update(normalizeRecovery(code)).digest("base64url");
function generateRecoveryCodes(count = RECOVERY_CODE_COUNT) {
    return Array.from({
        length: count
    }, ()=>{
        const chars = Array.from((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(10), (b)=>RECOVERY_ALPHABET[b % 32]).join("");
        return `${chars.slice(0, 5)}-${chars.slice(5)}`;
    });
}
// ---- storage ------------------------------------------------------------------------------
async function readRecord() {
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().get(RECORD_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw);
    if (record?.v !== 1 || typeof record.secret !== "string" || !Array.isArray(record.recovery)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConfigError"]("The stored two-factor record is damaged.");
    return record;
}
const writeRecord = (record)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().set(RECORD_KEY, JSON.stringify(record));
async function twoFactorState() {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authConfig"])().totpSecret) return {
        enabled: true,
        source: "env",
        recoveryRemaining: 0,
        enabledAt: null
    };
    const record = await readRecord();
    return record ? {
        enabled: true,
        source: "app",
        recoveryRemaining: record.recovery.length,
        enabledAt: record.enabledAt
    } : {
        enabled: false,
        source: null,
        recoveryRemaining: 0,
        enabledAt: null
    };
}
const twoFactorRequired = async ()=>(await twoFactorState()).enabled;
async function verifySecondFactor(input, now = Date.now()) {
    const code = input.trim();
    const envSecret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authConfig"])().totpSecret;
    if (envSecret) {
        const step = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyTotpStep"])(envSecret, code, now);
        if (step === null) return {
            ok: false
        };
        try {
            const last = Number(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().get(ENV_LAST_KEY) ?? 0);
            if (step <= last) return {
                ok: false
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().set(ENV_LAST_KEY, String(step));
        } catch  {}
        return {
            ok: true,
            method: "totp"
        };
    }
    const record = await readRecord();
    if (!record) return {
        ok: false
    };
    if (/^\d{6}$/.test(code)) {
        const step = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyTotpStep"])(decryptSecret(record.secret), code, now);
        if (step === null || step <= record.lastStep) return {
            ok: false
        };
        await writeRecord({
            ...record,
            lastStep: step
        });
        return {
            ok: true,
            method: "totp"
        };
    }
    if (looksLikeRecovery(code)) {
        const given = Buffer.from(recoveryHash(code));
        let index = -1;
        record.recovery.forEach((hash, i)=>{
            const stored = Buffer.from(hash);
            if (stored.length === given.length && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(stored, given)) index = i;
        }); // no early exit
        if (index < 0) return {
            ok: false
        };
        const recovery = record.recovery.filter((_, i)=>i !== index);
        await writeRecord({
            ...record,
            recovery
        });
        return {
            ok: true,
            method: "recovery",
            recoveryRemaining: recovery.length
        };
    }
    return {
        ok: false
    };
}
class TwoFactorError extends Error {
    code;
    constructor(code){
        super(code), this.code = code;
    }
}
async function startEnrollment() {
    const state = await twoFactorState();
    if (state.source === "env") throw new TwoFactorError("managed-by-env");
    if (state.enabled) throw new TwoFactorError("already-enabled");
    const secret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateTotpSecret"])();
    const uri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["totpUri"])(secret, ACCOUNT, ISSUER);
    const pending = {
        secret: encryptSecret(secret),
        createdAt: Date.now()
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().set(PENDING_KEY, JSON.stringify(pending));
    return {
        secret,
        uri,
        qr: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$qr$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["qrRows"])(uri),
        expiresAt: new Date(pending.createdAt + PENDING_TTL_MS).toISOString()
    };
}
async function confirmEnrollment(code, now = Date.now()) {
    const state = await twoFactorState();
    if (state.source === "env") throw new TwoFactorError("managed-by-env");
    if (state.enabled) throw new TwoFactorError("already-enabled");
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().get(PENDING_KEY);
    const pending = raw ? JSON.parse(raw) : null;
    if (!pending || pending.createdAt + PENDING_TTL_MS < now) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().del(PENDING_KEY).catch(()=>{});
        throw new TwoFactorError("no-pending");
    }
    const step = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyTotpStep"])(decryptSecret(pending.secret), code.trim(), now);
    if (step === null) throw new TwoFactorError("invalid-code");
    const recoveryCodes = generateRecoveryCodes();
    await writeRecord({
        v: 1,
        secret: pending.secret,
        enabledAt: new Date(now).toISOString(),
        lastStep: step,
        recovery: recoveryCodes.map(recoveryHash)
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().del(PENDING_KEY);
    return {
        recoveryCodes
    };
}
async function disableTwoFactor(code) {
    const state = await twoFactorState();
    if (state.source === "env") throw new TwoFactorError("managed-by-env");
    if (!state.enabled) throw new TwoFactorError("not-enabled");
    if (!(await verifySecondFactor(code)).ok) throw new TwoFactorError("invalid-code");
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().del(RECORD_KEY);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().del(PENDING_KEY).catch(()=>{});
}
async function regenerateRecoveryCodes(code) {
    const state = await twoFactorState();
    if (state.source === "env") throw new TwoFactorError("managed-by-env");
    if (!state.enabled) throw new TwoFactorError("not-enabled");
    if (!(await verifySecondFactor(code)).ok) throw new TwoFactorError("invalid-code");
    const record = await readRecord();
    if (!record) throw new TwoFactorError("not-enabled");
    const recoveryCodes = generateRecoveryCodes();
    await writeRecord({
        ...record,
        recovery: recoveryCodes.map(recoveryHash)
    });
    return {
        recoveryCodes
    };
}
// ---- brute-force limiter for the 2FA management endpoints (5 failures / 15 min per signed-in user) --------
const LIMIT = {
    max: 5,
    windowMs: 15 * 60 * 1000
};
const limiterKey = (actor)=>`rl:2fa:${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(actor).digest("hex").slice(0, 24)}`;
async function twoFactorBlockedFor(actor) {
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().get(limiterKey(actor));
    if (!raw) return 0;
    const a = JSON.parse(raw);
    const remaining = a.first + LIMIT.windowMs - Date.now();
    return a.count >= LIMIT.max && remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}
async function twoFactorRecordFailure(actor) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])();
    const raw = await store.get(limiterKey(actor));
    let a = raw ? JSON.parse(raw) : {
        count: 0,
        first: Date.now()
    };
    if (a.first + LIMIT.windowMs < Date.now()) a = {
        count: 0,
        first: Date.now()
    };
    a.count += 1;
    await store.set(limiterKey(actor), JSON.stringify(a));
}
const twoFactorClearFailures = (actor)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStore"])().del(limiterKey(actor));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1ddkk5nomhvlm._.js.map