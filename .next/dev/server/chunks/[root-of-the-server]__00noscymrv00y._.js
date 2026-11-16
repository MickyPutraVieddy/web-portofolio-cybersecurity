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
"[project]/app/api/admin/passkey/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2d$handlers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/passkey-handlers.ts [app-route] (ecmascript)");
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const GET = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2d$handlers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["passkeyStatusHandler"];
const POST = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2d$handlers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["passkeyActionHandler"];
}),
"[project]/lib/contact.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Contact-form rules shared by the browser (instant feedback) and the server (the authority).
 * No imports, so it is safe in both places. The server always re-validates; the client copy is only for UX.
 */ __turbopack_context__.s([
    "cleanContact",
    ()=>cleanContact,
    "contactFields",
    ()=>contactFields,
    "contactLimits",
    ()=>contactLimits,
    "isValidEmail",
    ()=>isValidEmail,
    "readContactBody",
    ()=>readContactBody,
    "validateContact",
    ()=>validateContact
]);
const contactLimits = {
    name: 100,
    email: 254,
    subject: 150,
    messageMin: 10,
    messageMax: 5000
};
const contactFields = [
    "name",
    "email",
    "subject",
    "message"
];
const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const isValidEmail = (value)=>value.length <= contactLimits.email && EMAIL.test(value);
/** Single-line fields must not contain any control character (blocks CR/LF header injection) or line separators. */ // eslint-disable-next-line no-control-regex
const SINGLE_LINE_BAD = /[\u0000-\u001F\u007F\u2028\u2029]/;
/** The message may contain line breaks and tabs, but no other control characters. */ // eslint-disable-next-line no-control-regex
const MESSAGE_BAD = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
function validateContact(input) {
    const errors = {};
    const name = input.name.trim(), email = input.email.trim(), subject = input.subject.trim(), message = input.message.trim();
    if (!name) errors.name = "required";
    else if (name.length > contactLimits.name) errors.name = "too-long";
    else if (SINGLE_LINE_BAD.test(name)) errors.name = "invalid-chars";
    if (!email) errors.email = "required";
    else if (SINGLE_LINE_BAD.test(email)) errors.email = "invalid-chars";
    else if (!isValidEmail(email)) errors.email = email.length > contactLimits.email ? "too-long" : "invalid-email";
    if (!subject) errors.subject = "required";
    else if (subject.length > contactLimits.subject) errors.subject = "too-long";
    else if (SINGLE_LINE_BAD.test(subject)) errors.subject = "invalid-chars";
    if (!message) errors.message = "required";
    else if (message.length < contactLimits.messageMin) errors.message = "too-short";
    else if (message.length > contactLimits.messageMax) errors.message = "too-long";
    else if (MESSAGE_BAD.test(message)) errors.message = "invalid-chars";
    return errors;
}
const cleanContact = (input)=>({
        name: input.name.trim(),
        email: input.email.trim(),
        subject: input.subject.trim(),
        message: input.message.trim()
    });
function readContactBody(raw) {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
    const body = raw;
    const text = (key)=>typeof body[key] === "string" ? body[key] : "";
    return {
        values: {
            name: text("name"),
            email: text("email"),
            subject: text("subject"),
            message: text("message")
        },
        honeypot: text("website")
    };
}
}),
"[project]/lib/content-schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appearanceSchema",
    ()=>appearanceSchema,
    "certCategories",
    ()=>certCategories,
    "certKinds",
    ()=>certKinds,
    "certValidity",
    ()=>certValidity,
    "customPageSchema",
    ()=>customPageSchema,
    "customPagesSchema",
    ()=>customPagesSchema,
    "customTemplateSchema",
    ()=>customTemplateSchema,
    "isSafeUrl",
    ()=>isSafeUrl,
    "mitreExposures",
    ()=>mitreExposures,
    "mitreTacticCodes",
    ()=>mitreTacticCodes,
    "mitreTacticIds",
    ()=>mitreTacticIds,
    "projectDomains",
    ()=>projectDomains,
    "projectKinds",
    ()=>projectKinds,
    "projectStatuses",
    ()=>projectStatuses,
    "sectionIds",
    ()=>sectionIds,
    "siteContentSchema",
    ()=>siteContentSchema,
    "skillCategories",
    ()=>skillCategories,
    "socialPlatforms",
    ()=>socialPlatforms,
    "toolDomains",
    ()=>toolDomains,
    "toolGroups",
    ()=>toolGroups,
    "toolLevels",
    ()=>toolLevels,
    "toolTypes",
    ()=>toolTypes,
    "trainingDomains",
    ()=>trainingDomains,
    "trainingKinds",
    ()=>trainingKinds,
    "trainingStatuses",
    ()=>trainingStatuses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .boolean>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .number>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .array>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .enum>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .record>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$ZodIssueCode$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .ZodIssueCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$discriminatedUnion$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .discriminatedUnion>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z .literal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contact$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/contact.ts [app-route] (ecmascript)");
;
;
function isSafeUrl(value) {
    if (value === "") return true;
    if (value.startsWith("/") && !value.startsWith("//")) return !/[\\\s]/.test(value);
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:";
    } catch  {
        return false;
    }
}
const text = (max = 400)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(max);
const url = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(2000).refine(isSafeUrl, "Unsafe or invalid URL");
const localized = (schema)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        en: schema,
        id: schema
    });
const commandName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z][a-z0-9_-]{0,19}$/, "Use lowercase letters, digits, - or _");
const timelineEntry = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    period: text(80),
    title: text(140),
    org: text(140),
    detail: text(240).optional(),
    points: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(text(240)).max(12).optional()
});
const certKinds = [
    "professional",
    "non-professional"
];
const certCategories = [
    "red",
    "blue",
    "purple",
    "general"
];
const certValidity = [
    "by-expiry",
    "lifetime",
    "not-specified"
];
const year = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(1990).max(2100).nullable();
const certification = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Name is required").max(140),
    kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(certKinds),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(certCategories),
    issuer: text(140),
    credential: text(200),
    acquiredYear: year,
    issuedYear: year,
    expiryYear: year,
    validity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(certValidity),
    description: localized(text(600)),
    image: url.nullable(),
    imageAlt: localized(text(200)),
    verifyUrl: url
}).superRefine((item, ctx)=>{
    if (item.issuedYear !== null && item.expiryYear !== null && item.expiryYear < item.issuedYear) {
        ctx.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$ZodIssueCode$3e$__["z"].ZodIssueCode.custom,
            path: [
                "expiryYear"
            ],
            message: "Expiry year cannot be before the issued year"
        });
    }
});
const skillCategories = [
    "red",
    "blue",
    "general"
];
const skill = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Name is required").max(100),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(skillCategories),
    /** 1 (beginner) … 5 (expert); null = not rated (no bar is drawn). */ level: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(1).max(5).nullable(),
    description: localized(text(300))
});
const mitreTacticIds = [
    "reconnaissance",
    "resource-development",
    "initial-access",
    "execution",
    "persistence",
    "privilege-escalation",
    "defense-evasion",
    "credential-access",
    "discovery",
    "lateral-movement",
    "collection",
    "command-and-control",
    "exfiltration",
    "impact"
];
const mitreTacticCodes = {
    "reconnaissance": "TA0043",
    "resource-development": "TA0042",
    "initial-access": "TA0001",
    "execution": "TA0002",
    "persistence": "TA0003",
    "privilege-escalation": "TA0004",
    "defense-evasion": "TA0005",
    "credential-access": "TA0006",
    "discovery": "TA0007",
    "lateral-movement": "TA0008",
    "collection": "TA0009",
    "command-and-control": "TA0011",
    "exfiltration": "TA0010",
    "impact": "TA0040"
};
const mitreExposures = [
    "studied",
    "lab",
    "project",
    "work"
];
const mitreTechnique = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    tactic: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(mitreTacticIds),
    /** Official ATT&CK technique ID, e.g. T1566 or T1566.001. Empty = unspecified (no link is drawn). */ techniqueId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^(T\d{4}(\.\d{3})?)?$/, "Use the format T1566 or T1566.001"),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Name is required").max(140),
    exposure: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(mitreExposures),
    description: localized(text(400))
});
const projectKinds = [
    "professional",
    "non-professional"
];
const projectDomains = [
    "red",
    "blue",
    "purple",
    "general"
];
const projectStatuses = [
    "completed",
    "in-progress",
    "archived"
];
const project = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    /** Highlighted in the "Featured" row on the public page (the first three are shown). */ featured: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Name is required").max(140),
    kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(projectKinds),
    domain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(projectDomains),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(projectStatuses),
    year: year,
    /** Free text such as "Jan – Mar 2025". Optional. */ period: text(80),
    summary: localized(text(300)),
    description: localized(text(1200)),
    role: localized(text(600)),
    method: localized(text(600)),
    outcome: localized(text(600)),
    /** Tool / technology names; not translated. */ stack: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(text(40)).max(20),
    thumbnail: url.nullable(),
    thumbnailAlt: localized(text(200)),
    repoUrl: url,
    demoUrl: url,
    reportUrl: url
});
const trainingKinds = [
    "training",
    "lab"
];
const trainingDomains = [
    "red",
    "blue",
    "purple",
    "general"
];
const trainingStatuses = [
    "completed",
    "in-progress",
    "planned"
];
const trainingItem = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(trainingKinds),
    platform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Platform is required").max(100),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Name is required").max(140),
    domain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(trainingDomains),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(trainingStatuses),
    startYear: year,
    endYear: year,
    focus: localized(text(200)),
    objective: localized(text(400)),
    description: localized(text(800)),
    /** Modules / rooms / lessons completed (optional). */ modules: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(text(120)).max(30),
    skills: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(text(60)).max(20),
    tools: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(text(40)).max(20),
    /** Certificate / badge / writeup / evidence link (optional). */ evidenceUrl: url
}).superRefine((item, ctx)=>{
    if (item.startYear !== null && item.endYear !== null && item.endYear < item.startYear) {
        ctx.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$ZodIssueCode$3e$__["z"].ZodIssueCode.custom,
            path: [
                "endYear"
            ],
            message: "End year cannot be before the start year"
        });
    }
});
const toolGroups = [
    "programming",
    "security"
];
const toolTypes = [
    "language",
    "scripting",
    "framework",
    "platform",
    "security-tool",
    "other"
];
const toolDomains = [
    "red",
    "blue",
    "purple",
    "general",
    "dfir",
    "web"
];
const toolLevels = [
    "familiar",
    "practicing",
    "proficient"
];
const tool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    group: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(toolGroups),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Name is required").max(100),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(toolTypes),
    domain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(toolDomains),
    purpose: localized(text(300)),
    /** Associated workflow or example usage (optional). */ workflow: localized(text(400)),
    level: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(toolLevels).nullable(),
    /** Optional logo / icon (uploaded through the Admin). Empty = a generic icon is drawn. */ icon: url.nullable()
});
const achievement = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Title is required").max(140),
    /** Year received; null = not stated. */ year: year,
    /** Awarding organisation, event or platform (optional, not translated). */ issuer: text(140),
    description: localized(text(600)),
    /** Optional link to evidence (announcement, certificate page, write-up). */ proofUrl: url
});
/** A write-up link must be a real web address (http/https), never a relative path or mailto. Empty = no button. */ const webUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(2000).refine((v)=>v === "" || /^https?:\/\//i.test(v) && isSafeUrl(v), "Use a full http(s) link");
const writeup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, "Title is required").max(140),
    /** Blog / platform name, e.g. the site hosting the write-up. Not translated. */ blog: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().max(100),
    year: year,
    summary: localized(text(300)),
    /** Short labels such as "web", "forensics". Not translated. */ tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(30)).max(8),
    url: webUrl
});
const socialPlatforms = [
    "discord",
    "linkedin",
    "github",
    "instagram",
    "x",
    "youtube",
    "facebook",
    "tiktok",
    "telegram",
    "whatsapp",
    "threads",
    "bluesky",
    "mastodon",
    "reddit",
    "twitch",
    "medium",
    "devto",
    "hashnode",
    "substack",
    "wordpress",
    "blogger",
    "ghost",
    "gitlab",
    "stackoverflow",
    "hackerone",
    "bugcrowd",
    "tryhackme",
    "hackthebox",
    "credly",
    "signal",
    "spotify",
    "kofi",
    "behance",
    "pinterest",
    "linktree",
    "other",
    "custom"
];
const social = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/, "Invalid id"),
    /** A link is only shown on the site when it is visible AND has a URL. */ visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    platform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(socialPlatforms),
    /** Only used when platform = "custom": your own icon image (PNG / JPEG / WebP / SVG). */ icon: url.nullable().default(null),
    /** Username / handle / label shown next to the icon. Empty = the platform name is shown. */ label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().max(80),
    url: webUrl,
    description: localized(text(160))
});
const contactEmail = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().max(254).refine((v)=>v === "" || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contact$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidEmail"])(v), "Use a valid email address");
const hexColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit HEX color");
const mediaUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().max(2000).refine((value)=>{
    if (value === "") return true;
    if (value.startsWith("/") && !value.startsWith("//")) return !/[\\\s]/.test(value);
    try {
        const parsed = new URL(value);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch  {
        return false;
    }
}, "Use an http(s) image URL or a safe relative path");
const customBlockBase = {
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/)
};
const customBlock = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$discriminatedUnion$3e$__["z"].discriminatedUnion("type", [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("hero"),
        eyebrow: localized(text(80)),
        heading: localized(text(140)),
        body: localized(text(1200))
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("text"),
        heading: localized(text(140)),
        body: localized(text(2400))
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("image"),
        image: mediaUrl.nullable(),
        alt: localized(text(200)),
        caption: localized(text(240))
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("cards"),
        heading: localized(text(140)),
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/),
            title: localized(text(120)),
            body: localized(text(600)),
            tag: text(40)
        })).max(12)
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("stats"),
        heading: localized(text(140)),
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/),
            value: text(32),
            label: localized(text(80))
        })).max(8)
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("timeline"),
        heading: localized(text(140)),
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/),
            period: text(80),
            title: localized(text(120)),
            body: localized(text(600))
        })).max(16)
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("gallery"),
        heading: localized(text(140)),
        images: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/),
            image: mediaUrl,
            alt: localized(text(200))
        })).max(12)
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("cta"),
        heading: localized(text(140)),
        body: localized(text(600)),
        buttonLabel: localized(text(80)),
        href: url
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        ...customBlockBase,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("divider")
    })
]);
function validateCustomBlockIds(blocks, ctx) {
    const ids = new Set();
    const add = (id, path)=>{
        if (ids.has(id)) ctx.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$ZodIssueCode$3e$__["z"].ZodIssueCode.custom,
            path,
            message: "Block and item IDs must be unique within a page or template"
        });
        ids.add(id);
    };
    blocks.forEach((block, index)=>{
        add(block.id, [
            "blocks",
            index,
            "id"
        ]);
        if (block.type === "cards" || block.type === "stats" || block.type === "timeline") block.items.forEach((item, itemIndex)=>add(item.id, [
                "blocks",
                index,
                "items",
                itemIndex,
                "id"
            ]));
        if (block.type === "gallery") block.images.forEach((item, itemIndex)=>add(item.id, [
                "blocks",
                index,
                "images",
                itemIndex,
                "id"
            ]));
    });
}
const customPageSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(48),
    title: localized(text(120)),
    summary: localized(text(400)),
    visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    /** Adds an in-page anchor link for this section to the navbar (same homepage, no separate route). */ showInNav: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(false),
    /** Position inside the single homepage section flow; not a separate route. */ order: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(0).max(99).default(50),
    accentColor: hexColor,
    secondaryColor: hexColor,
    blocks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(customBlock).max(40)
}).superRefine((page, ctx)=>validateCustomBlockIds(page.blocks, ctx));
const customTemplateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{4,48}$/),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(80),
    accentColor: hexColor,
    secondaryColor: hexColor,
    blocks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(customBlock).max(40)
}).superRefine((template, ctx)=>validateCustomBlockIds(template.blocks, ctx));
const customPagesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    pages: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(customPageSchema).max(24),
    templates: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(customTemplateSchema).max(24)
});
const appearanceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    preset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
        "blue",
        "red",
        "purple",
        "general",
        "custom"
    ]),
    accentColor: hexColor,
    secondaryColor: hexColor,
    glow: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(0).max(100),
    cursorEffect: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(true),
    cursorIntensity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(0).max(100).default(35),
    headingFont: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
        "inter",
        "plex-mono",
        "system"
    ]),
    bodyFont: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
        "inter",
        "plex-mono",
        "system"
    ]),
    monoFont: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
        "plex-mono",
        "inter",
        "system"
    ]),
    headingWeight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
        "600",
        "700",
        "800"
    ])
});
const sectionIds = [
    "header",
    "intro",
    "about",
    "education",
    "experience",
    "certifications",
    "skills",
    "mitre",
    "projects",
    "training",
    "tools",
    "achievements",
    "writeups",
    "contact",
    "footer"
];
const siteContentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().nonnegative(),
    appearance: appearanceSchema,
    customPages: customPagesSchema,
    profile: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        name: text(80),
        givenNames: text(80),
        familyName: text(60),
        handle: text(40),
        brandLogo: url.nullable(),
        role: localized(text(120)),
        location: localized(text(120)),
        description: localized(text(1200)),
        resume: localized(url.nullable()),
        portrait: url.nullable(),
        adminLogo: url.nullable(),
        credentials: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(text(80)).max(12),
        focus: localized(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(text(80)).max(12))
    }),
    copy: localized(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__["z"].record(text(500))),
    aboutRows: localized(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        label: text(60),
        value: text(400)
    })).max(20)),
    statusLine: localized(text(300)),
    terminalOutput: localized(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__["z"].record(commandName, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(text(300)).max(40))),
    quickCommands: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(commandName).max(10),
    education: localized(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(timelineEntry).max(20)),
    experience: localized(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(timelineEntry).max(20)),
    certifications: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(certification).max(60)
    }),
    skills: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        image: url.nullable(),
        imageAlt: localized(text(200)),
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(skill).max(120)
    }),
    mitre: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(mitreTechnique).max(200)
    }),
    projects: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(project).max(60)
    }),
    training: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(trainingItem).max(120)
    }),
    writeups: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(writeup).max(100)
    }),
    /** `email` is the address shown publicly (optional). The inbox that receives the form is a server env var, not stored here. */ contact: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        email: contactEmail,
        socials: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(social).max(12)
    }),
    /** Footer presentation settings. Social destinations are shared with Contact to avoid maintaining duplicate URLs. */ footer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        tagline: localized(text(240)),
        connectLabel: localized(text(80)),
        transmissionLabel: localized(text(80)),
        statusLabel: localized(text(80)),
        bottomNote: localized(text(180)),
        backToTopLabel: localized(text(60)),
        rightsText: localized(text(100)),
        copyrightName: text(100),
        showStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        showSocials: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        showEmail: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        showBottomNote: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        showBackToTop: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
        showCopyright: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean()
    }),
    achievements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(achievement).max(80)
    }),
    tools: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(tool).max(150)
    }),
    sections: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum(sectionIds),
        editorLabel: text(80),
        order: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(0).max(99),
        visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean()
    })).max(20)
}).superRefine((content, ctx)=>{
    const ids = new Set();
    const slugs = new Set();
    content.customPages.pages.forEach((page, index)=>{
        if (ids.has(page.id)) ctx.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$ZodIssueCode$3e$__["z"].ZodIssueCode.custom,
            path: [
                "customPages",
                "pages",
                index,
                "id"
            ],
            message: "Custom page IDs must be unique"
        });
        if (slugs.has(page.slug)) ctx.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$ZodIssueCode$3e$__["z"].ZodIssueCode.custom,
            path: [
                "customPages",
                "pages",
                index,
                "slug"
            ],
            message: "Custom homepage section slugs must be unique"
        });
        ids.add(page.id);
        slugs.add(page.slug);
    });
    const templateIds = new Set();
    content.customPages.templates.forEach((template, index)=>{
        if (templateIds.has(template.id)) ctx.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$ZodIssueCode$3e$__["z"].ZodIssueCode.custom,
            path: [
                "customPages",
                "templates",
                index,
                "id"
            ],
            message: "Template IDs must be unique"
        });
        templateIds.add(template.id);
    });
});
}),
"[project]/lib/portfolio-content.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aboutRows",
    ()=>aboutRows,
    "copy",
    ()=>copy,
    "education",
    ()=>education,
    "experience",
    ()=>experience,
    "parseLocale",
    ()=>parseLocale,
    "portfolioSections",
    ()=>portfolioSections,
    "profile",
    ()=>profile,
    "quickCommands",
    ()=>quickCommands,
    "statusLine",
    ()=>statusLine,
    "terminalOutput",
    ()=>terminalOutput,
    "visualSettings",
    ()=>visualSettings
]);
const profile = {
    name: "Micky Putra Vieddy",
    givenNames: "Micky",
    familyName: "Putra Vieddy",
    handle: "zains403",
    brandLogo: null,
    role: {
        en: "Information Security",
        id: ""
    },
    location: {
        en: "DKI Jakarta, South Jakarta",
        id: ""
    },
    description: {
        en: "Cybersecurity fresher with CompTIA Security+ and Google Cybersecurity certifications. Hands-on experience in SIEM alert triage, phishing analysis, and incident response. Built an n8n-based phishing analyzer that cut manual triage effort by ~50%.",
        id: ""
    },
    resume: {
        en: null,
        id: null
    },
    portrait: null,
    adminLogo: null,
    credentials: [
        "CompTIA Security+",
        "Google Cybersecurity"
    ],
    focus: {
        en: [
            "SOC Operations",
            "Threat Analysis",
            "Blue Team Automation"
        ],
        id: []
    }
};
const portfolioSections = [
    {
        id: "header",
        editorLabel: "Page Header",
        order: 0,
        visible: true
    },
    {
        id: "intro",
        editorLabel: "Page Intro",
        order: 1,
        visible: true
    },
    {
        id: "about",
        editorLabel: "Page 00 — About",
        order: 2,
        visible: true
    },
    {
        id: "education",
        editorLabel: "Page 00b — Education",
        order: 3,
        visible: true
    },
    {
        id: "experience",
        editorLabel: "Page 00c — Work Experience",
        order: 4,
        visible: true
    },
    {
        id: "certifications",
        editorLabel: "Page 01 — Certifications",
        order: 5,
        visible: true
    },
    {
        id: "skills",
        editorLabel: "Page 02 — Skills",
        order: 6,
        visible: true
    },
    {
        id: "mitre",
        editorLabel: "Page 03 — MITRE",
        order: 7,
        visible: true
    },
    {
        id: "projects",
        editorLabel: "Page 04 — Projects",
        order: 8,
        visible: true
    },
    {
        id: "training",
        editorLabel: "Page 05 — Training",
        order: 9,
        visible: true
    },
    {
        id: "tools",
        editorLabel: "Page 06 — Tools",
        order: 10,
        visible: true
    },
    {
        id: "achievements",
        editorLabel: "Page 07 — Achievements",
        order: 11,
        visible: true
    },
    {
        id: "writeups",
        editorLabel: "Page 08 — Writeups",
        order: 12,
        visible: true
    },
    {
        id: "contact",
        editorLabel: "Page 09 — Contact",
        order: 13,
        visible: true
    },
    {
        id: "footer",
        editorLabel: "Page Footer",
        order: 14,
        visible: false
    }
];
const visualSettings = {
    zodiacAsset: "/images/zodiac-celestial-bg.svg",
    orbitDurationSeconds: 180,
    parallaxStrength: 14,
    starCount: 68
};
const copy = {
    en: {
        skillDistKicker: "SKILL DISTRIBUTION",
        skillDistTitle: "Expertise index",
        skillDistLive: "LIVE",
        skillDistPublished: "PUBLISHED SKILLS",
        skillDistIndexed: "INDEXED",
        skillDistActive: "ACTIVE",
        skillDistSkills: "skills",
        skillDistCategories: "ACTIVE CATEGORIES",
        skillDistEntries: "ENTRIES",
        title: "Micky Putra Vieddy — Cybersecurity Portfolio",
        metaDescription: "Cybersecurity portfolio of Micky Putra Vieddy. SOC operations, threat analysis, incident response, and blue team automation. Based in Jakarta, Indonesia.",
        portfolio: "Personal security portfolio",
        introduction: "Introduction",
        introducing: "Introducing myself",
        hello: "Hello, I'm",
        availability: "Open to opportunities",
        availableShort: "Available for work",
        status: "Current status",
        resume: "View resume",
        resumeUnavailable: "Resume will be available soon",
        locationLabel: "Based in",
        language: "Choose language",
        backHome: "Back to introduction",
        skip: "Skip to content",
        sceneTitle: "The defender's orbit",
        sceneLabel: "Interactive celestial field",
        sceneCaption: "Curiosity. Precision. Protection.",
        interact: "Move your cursor to explore",
        touchHint: "A different perspective on security",
        blueTeam: "Blue team",
        defense: "Defense in depth",
        threatAnalysis: "Threat analysis",
        pause: "Pause animation",
        play: "Resume animation",
        motionOn: "Motion on",
        motionOff: "Motion paused",
        reducedMotion: "Reduced motion",
        reducedMotionHint: "Animation follows your device's reduced-motion setting",
        focusLabel: "Focused on",
        philosophy: "Integrity first. Evidence over opinions.",
        philosophyEnd: "Automate the boring stuff.",
        welcome: "Welcome to my corner of the internet.",
        signature: "Built with intent. Driven by curiosity.",
        menuOpen: "Open navigation",
        menuClose: "Close navigation",
        adminLabel: "Admin login",
        navAbout: "About",
        navEducation: "Education",
        navExperience: "Experience",
        aboutTitle: "About Me",
        aboutFile: "about.txt",
        aboutLabel: "About me",
        labelName: "Name",
        labelLocation: "Location",
        labelEducation: "Education",
        labelFocus: "Focus Areas",
        labelCerts: "Certifications",
        labelCurrently: "Currently",
        labelPhilosophy: "Philosophy",
        shellStatic: "about.txt",
        shellInteractive: "portfolio-shell",
        shellBadge: "Safe demo",
        shellPlaceholder: "type a command...",
        shellRun: "Run command",
        shellQuick: "Quick commands",
        shellHint: "Tap a quick command, or type one. This terminal is a safe front-end simulation.",
        shellNote: "A simulated portfolio shell. Commands never access your device or a server.",
        educationTitle: "Education",
        educationFile: "education.txt",
        educationLabel: "Education",
        experienceTitle: "Work Experience",
        experienceFile: "experience.txt",
        experienceLabel: "Work experience",
        navCertifications: "Certifications",
        navSkills: "Skills",
        navMitre: "MITRE ATT&CK",
        mitreTitle: "MITRE ATT&CK Exposure",
        mitreFile: "mitre.txt",
        mitreLabel: "MITRE ATT&CK exposure",
        mitreIntro: "The ATT&CK tactics and techniques I have studied or practised, and how I was exposed to each one.",
        mitreStatTech: "Techniques",
        mitreStatTactics: "Tactics covered",
        mitreTactics: "Tactics",
        mitreTechniquesOf: "Techniques for",
        mitreNone: "No techniques listed for this tactic yet.",
        mitreAllExposure: "All",
        mitreExposure: "Filter by exposure",
        mitreExp_studied: "Studied",
        mitreExp_lab: "Lab / CTF",
        mitreExp_project: "Project",
        mitreExp_work: "Work",
        mitreView: "View on MITRE ATT&CK",
        mitreCount: "techniques",
        mitreCountOne: "technique",
        mitreNoMatch: "No techniques match this exposure filter.",
        mitreNote: "Self-reported exposure. MITRE ATT&CK® is a registered trademark of The MITRE Corporation; this site is not affiliated with MITRE.",
        "mitreTac_reconnaissance": "Reconnaissance",
        "mitreTac_resource-development": "Resource Development",
        "mitreTac_initial-access": "Initial Access",
        "mitreTac_execution": "Execution",
        "mitreTac_persistence": "Persistence",
        "mitreTac_privilege-escalation": "Privilege Escalation",
        "mitreTac_defense-evasion": "Defense Evasion",
        "mitreTac_credential-access": "Credential Access",
        "mitreTac_discovery": "Discovery",
        "mitreTac_lateral-movement": "Lateral Movement",
        "mitreTac_collection": "Collection",
        "mitreTac_command-and-control": "Command and Control",
        "mitreTac_exfiltration": "Exfiltration",
        "mitreTac_impact": "Impact",
        skillsTitle: "Skills & Expertise",
        skillsFile: "skills.txt",
        skillsLabel: "Skills & expertise",
        skillsIntro: "The technical skills I use across offensive, defensive and general security work, with a self-assessed proficiency level.",
        skillGroupRed: "Red Team Skills",
        skillGroupBlue: "Blue Team Skills",
        skillGroupGeneral: "General Skills",
        skillColSkill: "Skill",
        skillColLevel: "Level",
        skillColDesc: "Description",
        skillLevel0: "Not rated",
        skillLevel1: "Beginner",
        skillLevel2: "Basic",
        skillLevel3: "Intermediate",
        skillLevel4: "Advanced",
        skillLevel5: "Expert",
        skillLevelOf: "out of 5",
        skillVisual: "Skills visual",
        emptyBadge: "COMING SOON",
        emptyTitle: "Content Coming Soon",
        emptyText: "Content will be added soon.",
        certTitle: "Certifications",
        certFile: "certifications.txt",
        certLabel: "Certifications",
        certIntro: "A collection of my professional and non-professional certifications in cybersecurity, covering various domains and skill sets.",
        certStatTotal: "Total",
        certStatPro: "Professional",
        certStatNon: "Non-professional",
        certStatCategories: "Categories",
        certFilterAll: "All",
        certCatRed: "Red Team",
        certCatBlue: "Blue Team",
        certCatPurple: "Purple Team",
        certCatGeneral: "General Cybersecurity",
        certTypePro: "Professional",
        certTypeNon: "Non-Professional",
        certGroupPro: "Professional Certifications",
        certGroupNon: "Non-Professional Certifications",
        certFilterCategory: "Filter by field",
        certFilterType: "Filter by type",
        certSearch: "Search certifications",
        certSearchPlaceholder: "Search by name, issuer or credential",
        certSort: "Sort by",
        certSortNewest: "Newest first",
        certSortOldest: "Oldest first",
        certSortName: "Name A–Z",
        certNoResults: "No certifications match these filters.",
        certStatusActive: "Active",
        certStatusExpired: "Expired",
        certStatusLifetime: "Lifetime",
        certStatusUnspecified: "Not specified",
        certIssued: "Issued",
        certAcquired: "Acquired",
        certValidUntil: "Valid until",
        certIssuer: "Issuer",
        certCredential: "Credential",
        certViewCert: "View certificate",
        certDetails: "View details",
        certPreview: "Certificate preview",
        certExpand: "Enlarge certificate",
        certClose: "Close",
        certNoImage: "No certificate image",
        certPrev: "Previous page",
        certNext: "Next page",
        certPage: "Page",
        certSelectHint: "Select a certification to preview it here.",
        navProjects: "Projects",
        projectsTitle: "Projects",
        projectsFile: "projects.txt",
        projectsLabel: "Projects",
        projectsIntro: "Security projects I have built or contributed to, split into professional work and personal or lab projects, with the goal, my role and the result of each.",
        projectsGroupPro: "Professional Projects",
        projectsGroupNon: "Non-Professional Projects",
        projFeatured: "Featured projects",
        projStatTotal: "Projects",
        projStatPro: "Professional",
        projStatNon: "Non-professional",
        projStatDone: "Completed",
        projDomainGeneral: "General",
        projFilterDomain: "Filter by domain",
        projSearch: "Search projects",
        projSearchPlaceholder: "Search by name, summary or tool",
        projColProject: "Project",
        projColDomain: "Domain",
        projColYear: "Year",
        projColStatus: "Status",
        projColStack: "Stack",
        "projStatus_completed": "Completed",
        "projStatus_in-progress": "In Progress",
        "projStatus_archived": "Archived",
        projOpen: "View details",
        projNoResults: "No projects match these filters.",
        projSecSummary: "Goal / problem",
        projSecScope: "Description & scope",
        projSecRole: "My contribution",
        projSecMethod: "Method / approach",
        projSecOutcome: "Result / output",
        projSecStack: "Tools & technology",
        projLinkRepo: "Repository",
        projLinkDemo: "Demo",
        projLinkReport: "Report",
        projMore: "more",
        navTraining: "Training & Labs",
        trainingTitle: "Training & Lab Experience",
        trainingFile: "training.txt",
        trainingLabel: "Training & lab experience",
        trainingIntro: "Structured course paths I followed, and the hands-on lab work I actually practised — kept apart so you can see learning and practice separately.",
        trainSecTraining: "Training / Course Paths",
        trainSecLab: "Lab Experience",
        trainStatTraining: "Training paths",
        trainStatLab: "Labs",
        trainStatPlatforms: "Platforms",
        trainStatDone: "Completed",
        trainFilterPlatform: "Platform",
        trainAllPlatforms: "All platforms",
        trainFilterDomain: "Filter by domain",
        trainFilterStatus: "Filter by status",
        trainAllStatus: "All",
        trainSearch: "Search training and labs",
        trainSearchPlaceholder: "Search by name, platform, skill or tool",
        "trainStatus_completed": "Completed",
        "trainStatus_in-progress": "In Progress",
        "trainStatus_planned": "Planned",
        trainFocus: "Focus",
        trainObjective: "Objective / scenario",
        trainActivities: "What I did",
        trainModules: "Modules, rooms and lessons",
        trainModulesCount: "completed items",
        trainSkills: "Skills practised",
        trainTools: "Tools used",
        trainEvidenceTraining: "Certificate / evidence",
        trainEvidenceLab: "Writeup / evidence",
        trainPresent: "present",
        trainNoDate: "Date not specified",
        trainShowMore: "Show more",
        trainNoResults: "No training or labs match these filters.",
        navTools: "Tools",
        navAchievements: "Achievements",
        navWriteups: "Writeups",
        writeupsTitle: "Security Writeups",
        writeupsFile: "writeup.txt",
        writeupsLabel: "Security writeups",
        writeupsIntro: "Articles and walkthroughs I have published, each with a short description and a link to read it.",
        wuStatTotal: "Writeups",
        wuStatBlogs: "Blogs / platforms",
        wuSearch: "Search writeups",
        wuSearchPlaceholder: "Search by title, blog, tag or description",
        wuFilterTag: "Filter by tag",
        wuRead: "Read writeup",
        wuNoLink: "Link not available",
        wuShowMore: "Show more",
        wuNoResults: "No writeups match these filters.",
        navContact: "Contact",
        contactTitle: "Get in touch",
        contactFile: "contact.txt",
        contactLabel: "Contact",
        contactIntro: "Questions, collaboration or just want to talk security? Send a message or reach me through one of the channels below.",
        contactLinksTitle: "Find me online",
        contactEmailTitle: "Email",
        contactEmailAction: "Send an email",
        contactNoLinks: "Contact links will appear here soon. In the meantime, the form on this page works.",
        contactFormTitle: "Send a message",
        cfName: "Name",
        cfEmail: "Email",
        cfSubject: "Subject",
        cfMessage: "Message",
        cfNamePlaceholder: "Your name",
        cfEmailPlaceholder: "you@example.com",
        cfSubjectPlaceholder: "What is this about?",
        cfMessagePlaceholder: "Write your message here",
        cfHoneypot: "Leave this field empty",
        cfSend: "Send message",
        cfSending: "Sending…",
        cfPrivacy: "Your message is emailed to me through an email provider and is not stored on this website. I only use your details to reply.",
        cfSuccessTitle: "Message sent",
        cfSuccessBody: "Thank you. I will get back to you by email.",
        cfSendAnother: "Send another message",
        cfErrRequired: "This field is required.",
        cfErrTooShort: "Please write a little more (at least 10 characters).",
        cfErrTooLong: "This is too long.",
        cfErrInvalidEmail: "Enter a valid email address.",
        cfErrInvalidChars: "This contains characters that are not allowed.",
        cfFixErrors: "Please fix the highlighted fields.",
        cfErrNotConfigured: "The contact form is not active yet. Please email me directly instead.",
        cfErrRate: "Too many messages from your connection. Please try again later.",
        cfErrDelivery: "The message could not be sent. Your text is still here, so you can try again.",
        cfErrNetwork: "Could not reach the server. Check your connection; your text is still here.",
        cfErrFallback: "Email me directly",
        wuNoYear: "—",
        achievementsTitle: "Achievements",
        achievementsFile: "achievements.txt",
        achievementsLabel: "Achievements",
        achievementsIntro: "Recognition, awards and milestones, listed with the year and what each one was for.",
        achStatTotal: "Achievements",
        achStatLatest: "Latest year",
        achSearch: "Search achievements",
        achSearchPlaceholder: "Search by title, organisation or description",
        achColYear: "Year",
        achColTitle: "Achievement",
        achColIssuer: "Organisation / event",
        achColDesc: "Description",
        achColProof: "Proof",
        achViewProof: "View proof",
        achNoYear: "—",
        achShowMore: "Show more",
        achNoResults: "No achievements match this search.",
        toolsTitle: "Programming & Specialized Tools",
        toolsFile: "tools.txt",
        toolsLabel: "Tools",
        toolsIntro: "Programming languages, scripting and frameworks I work with, and the security tools I have used or studied, with what each one is for.",
        toolsGroupProg: "Programming & Scripting",
        toolsGroupSec: "Security / Specialized Tools",
        toolsStatTotal: "Tools",
        toolsStatProg: "Programming & scripting",
        toolsStatSec: "Security tools",
        toolsStatDomains: "Domains covered",
        toolsSearch: "Search tools",
        toolsSearchPlaceholder: "Search by name, purpose or workflow",
        toolsFilterDomain: "Filter security tools by domain",
        toolsSort: "Sort by",
        toolsSortOrder: "My order",
        toolsSortName: "Name A–Z",
        toolsColTool: "Tool",
        toolsColType: "Type",
        toolsColDomain: "Domain",
        toolsColPurpose: "Purpose",
        toolsColWorkflow: "Workflow / example",
        toolsColLevel: "Proficiency",
        "toolType_language": "Programming language",
        "toolType_scripting": "Scripting",
        "toolType_framework": "Framework",
        "toolType_platform": "Platform",
        "toolType_security-tool": "Security tool",
        "toolType_other": "Other",
        toolDomain_red: "Red Team",
        toolDomain_blue: "Blue Team",
        toolDomain_purple: "Purple Team",
        toolDomain_general: "General",
        toolDomain_dfir: "DFIR",
        toolDomain_web: "Web Security",
        toolLevel_familiar: "Familiar",
        toolLevel_practicing: "Practicing",
        toolLevel_proficient: "Proficient",
        toolsLevelNone: "Not stated",
        toolsShowMore: "Show more",
        toolsNoResults: "No tools match these filters.",
        trainLabsOn: "labs on",
        recordCount: "records"
    }
};
function parseLocale(value) {
    return value === "id" ? "id" : "en";
}
const aboutRows = {
    en: [
        {
            label: "Name",
            value: "Micky Putra Vieddy"
        },
        {
            label: "Location",
            value: "DKI Jakarta, South Jakarta"
        },
        {
            label: "Education",
            value: "[Degree / program] — [University name]"
        },
        {
            label: "Focus Areas",
            value: "SOC Operations | Threat Analysis | DFIR | Blue Team Automation"
        },
        {
            label: "Certifications",
            value: "CompTIA Security+ | Google Cybersecurity | Cisco SOC"
        },
        {
            label: "Currently",
            value: "Seeking InfoSec Engineer / SOC Analyst L1 roles"
        },
        {
            label: "Philosophy",
            value: "\"Integrity first. Evidence over opinions. Automate the boring stuff.\""
        }
    ],
    id: []
};
const statusLine = {
    en: "Open to opportunities in DKI Jakarta, South Jakarta",
    id: ""
};
const terminalOutput = {
    en: {
        help: [
            "Available commands:",
            "  whoami      who I am",
            "  about       short bio",
            "  certs       certifications",
            "  skills      core skills",
            "  projects    featured work",
            "  education   academic background",
            "  status      current availability",
            "  ls          list files",
            "  clear       clear the screen"
        ],
        whoami: [
            "Micky Putra Vieddy",
            "Cybersecurity fresher — SOC Operations | Threat Analysis | DFIR"
        ],
        about: [
            "Cybersecurity fresher with hands-on SIEM alert triage, phishing analysis and incident response.",
            "\"Integrity first. Evidence over opinions. Automate the boring stuff.\""
        ],
        certs: [
            "CompTIA Security+",
            "Google Cybersecurity",
            "Cisco SOC"
        ],
        skills: [
            "SIEM alert triage",
            "Phishing analysis",
            "Incident response / DFIR",
            "Threat analysis",
            "Blue team automation (n8n)"
        ],
        projects: [
            "n8n phishing analyzer — cut manual triage effort by ~50%"
        ],
        education: [
            "[Degree / program] — [University name]"
        ],
        status: [
            "Open to opportunities in DKI Jakarta, South Jakarta",
            "Seeking InfoSec Engineer / SOC Analyst L1 roles"
        ],
        ls: [
            "about.txt  education.txt  experience.txt  certs.txt  skills.txt  projects.txt"
        ]
    },
    id: {}
};
const quickCommands = [
    "help",
    "whoami",
    "skills",
    "certs",
    "projects",
    "status"
];
const education = {
    en: [
        {
            period: "[Year] — [Year]",
            title: "[Degree / program]",
            org: "[University name]",
            detail: "[GPA / result]"
        },
        {
            period: "[Year] — [Year]",
            title: "[Higher secondary / diploma]",
            org: "[School name]",
            detail: "[Stream / result]"
        }
    ],
    id: []
};
const experience = {
    en: [
        {
            period: "[Month Year] — [Month Year]",
            title: "[Role title]",
            org: "[Company / internship]",
            points: [
                "SIEM alert triage",
                "Phishing analysis",
                "Incident response",
                "Built an n8n phishing analyzer that cut manual triage effort by ~50%"
            ]
        }
    ],
    id: []
};
}),
"[project]/lib/qr.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/server/content.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConflictError",
    ()=>ConflictError,
    "ValidationError",
    ()=>ValidationError,
    "getAudit",
    ()=>getAudit,
    "getContent",
    ()=>getContent,
    "getHistory",
    ()=>getHistory,
    "readMedia",
    ()=>readMedia,
    "restoreVersion",
    ()=>restoreVersion,
    "saveContent",
    ()=>saveContent,
    "saveMedia",
    ()=>saveMedia,
    "writeAudit",
    ()=>writeAudit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content-schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$site$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/site-content.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
;
;
;
const CURRENT = "content:current";
const HISTORY = "content:history";
const AUDIT = "audit:log";
const HISTORY_LIMIT = 10;
const AUDIT_LIMIT = 100;
async function readJson(key, fallback) {
    try {
        const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().get(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch  {
        return fallback;
    }
}
async function getContent() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$site$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeContent"])(await readJson(CURRENT, null));
}
async function getHistory() {
    return readJson(HISTORY, []);
}
async function getAudit() {
    return readJson(AUDIT, []);
}
async function writeAudit(actor, action, detail) {
    const log = await getAudit();
    log.unshift({
        at: new Date().toISOString(),
        actor,
        action,
        ...detail ? {
            detail: detail.slice(0, 200)
        } : {}
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().set(AUDIT, JSON.stringify(log.slice(0, AUDIT_LIMIT)));
}
class ConflictError extends Error {
}
class ValidationError extends Error {
    issues;
    constructor(issues){
        super("Invalid content"), this.issues = issues;
    }
}
/** Drops keys that do not exist in the built-in copy so the admin cannot invent new ones. */ function pruneCopy(content) {
    const next = {
        ...content,
        copy: {
            en: {},
            id: {}
        }
    };
    for (const locale of [
        "en",
        "id"
    ]){
        for (const key of Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$site$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultContent"].copy[locale])){
            next.copy[locale][key] = content.copy[locale][key] ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$site$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultContent"].copy[locale][key];
        }
    }
    return next;
}
async function saveContent(input, baseVersion, actor) {
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["siteContentSchema"].safeParse(input);
    if (!parsed.success) {
        throw new ValidationError(parsed.error.issues.slice(0, 8).map((issue)=>({
                path: issue.path.join("."),
                message: issue.message
            })));
    }
    const current = await getContent();
    if (baseVersion !== current.version) throw new ConflictError("Content was changed elsewhere. Reload before saving.");
    const history = await getHistory();
    history.unshift({
        version: current.version,
        savedAt: new Date().toISOString(),
        by: actor,
        content: current
    });
    const next = {
        ...pruneCopy(parsed.data),
        version: current.version + 1
    };
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    await store.set(HISTORY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
    await store.set(CURRENT, JSON.stringify(next));
    await writeAudit(actor, "save", `v${current.version} → v${next.version}`);
    return next;
}
async function restoreVersion(version, baseVersion, actor) {
    const target = (await getHistory()).find((item)=>item.version === version);
    if (!target) throw new ValidationError([
        {
            path: "version",
            message: "Version not found"
        }
    ]);
    const restored = await saveContent(target.content, baseVersion, actor);
    await writeAudit(actor, "restore", `restored content of v${version}`);
    return restored;
}
// ---- media ---------------------------------------------------------------------------
const MAX_IMAGE_BYTES = 700 * 1024;
const signatures = [
    {
        mime: "image/png",
        test: (b)=>b.length > 8 && b.subarray(0, 8).equals(Buffer.from([
                0x89,
                0x50,
                0x4e,
                0x47,
                0x0d,
                0x0a,
                0x1a,
                0x0a
            ]))
    },
    {
        mime: "image/jpeg",
        test: (b)=>b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
    },
    {
        mime: "image/webp",
        test: (b)=>b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP"
    }
];
async function saveMedia(bytes, actor) {
    if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) throw new ValidationError([
        {
            path: "file",
            message: "Image must be under 700 KB"
        }
    ]);
    const match = signatures.find((item)=>item.test(bytes));
    if (!match) throw new ValidationError([
        {
            path: "file",
            message: "Only PNG, JPEG or WebP images are allowed"
        }
    ]);
    const id = (await __turbopack_context__.A("[externals]/node:crypto [external] (node:crypto, cjs, async loader)")).randomBytes(12).toString("hex");
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().set(`media:${id}`, JSON.stringify({
        mime: match.mime,
        data: bytes.toString("base64")
    }));
    await writeAudit(actor, "upload", `${match.mime} ${Math.round(bytes.length / 1024)}KB`);
    return `/api/media/${id}`;
}
async function readMedia(id) {
    if (!/^[a-f0-9]{24}$/.test(id)) return null;
    const record = await readJson(`media:${id}`, null);
    return record ? {
        mime: record.mime,
        bytes: Buffer.from(record.data, "base64")
    } : null;
}
}),
"[project]/lib/server/passkey-handlers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "passkeyActionHandler",
    ()=>passkeyActionHandler,
    "passkeyLoginHandler",
    ()=>passkeyLoginHandler,
    "passkeyStatusHandler",
    ()=>passkeyStatusHandler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/content.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/passkey.ts [app-route] (ecmascript)");
;
;
;
;
;
const sleep = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
const RECENT_SECONDS = 15 * 60 // adding / removing a passkey, recovery codes and the policy need a sign-in from the last 15 minutes
;
function json(body, status = 200, extra = {}) {
    const headers = new Headers({
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
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
function errorResponse(error) {
    if (error instanceof SyntaxError) return json({
        error: "bad-request",
        message: "Malformed JSON"
    }, 400);
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ValidationError"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConflictError"]) return json({
        error: "conflict",
        message: "Conflict"
    }, 409);
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StorageNotConfigured"]) return json({
        error: "storage",
        message: error.message
    }, 503);
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"]) return json({
        error: "config",
        message: error.message
    }, 503);
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PasskeyError"]) {
        const [status, message] = passkeyMessages[error.code];
        return json({
            error: error.code,
            message
        }, status);
    }
    return json({
        error: "server",
        message: "Something went wrong"
    }, 500);
}
const passkeyMessages = {
    limit: [
        409,
        "The maximum number of passkeys is registered. Remove one first."
    ],
    challenge: [
        400,
        "The request expired or was already used. Please try again."
    ],
    verification: [
        400,
        "The passkey could not be verified."
    ],
    duplicate: [
        409,
        "This passkey is already registered."
    ],
    "not-found": [
        404,
        "That passkey does not exist."
    ],
    "last-passkey": [
        409,
        "This is your last passkey and passkey-only sign-in is on. Add another passkey first, or turn passkey-only off."
    ],
    "no-passkey": [
        409,
        "No passkey is registered yet."
    ],
    "not-tested": [
        409,
        "Sign in with a passkey once first (use “Test sign-in”), so we know it really works."
    ],
    "no-recovery": [
        409,
        "Generate and save your recovery codes first."
    ],
    "bad-name": [
        400,
        "Give the passkey a short name (1–40 characters)."
    ],
    "bad-request": [
        400,
        "Bad request."
    ]
};
const body = async (request)=>await request.json().catch(()=>({})) ?? {};
const hashed = (value)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(value).digest("hex").slice(0, 8);
async function passkeyLoginHandler(request) {
    try {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sameOriginMutation"])(request)) return json({
            error: "forbidden"
        }, 403);
        const ip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clientIp"])(request);
        const blocked = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loginBlockedFor"])(ip);
        if (blocked) return json({
            error: "locked",
            message: `Too many attempts. Try again in ${Math.ceil(blocked / 60)} minutes.`
        }, 429, {
            "Retry-After": String(blocked)
        });
        const input = await body(request);
        if (input.action === "options") {
            const { options, cookie } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["beginLogin"])(request);
            // "Use a passkey from another device": ask the browser to go straight to its phone / QR (hybrid) flow. The QR itself is drawn
            // by the browser / OS, is short-lived and bound to this very challenge; unsupported browsers simply ignore the hint.
            if (input.crossDevice === true) options.hints = [
                "hybrid"
            ];
            return json(options, 200, {
                "Set-Cookie": cookie
            });
        }
        if (input.action === "verify") {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finishLogin"])(request, input.response);
            if (!result.ok) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordLoginFailure"])(ip);
                await sleep(400);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])("anonymous", "login-failed", `passkey (${result.reason}) ip ${hashed(ip)}`).catch(()=>{});
                return json({
                    error: "invalid",
                    message: "Passkey sign-in failed."
                }, 401, {
                    "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearChallengeCookie"])(request)
                });
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearLoginFailures"])(ip);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])("admin", "login", `passkey "${result.name}"`).catch(()=>{});
            return json({
                ok: true
            }, 200, {
                "Set-Cookie": [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionCookie"])(request, {
                        sub: "admin",
                        method: "passkey"
                    }),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearChallengeCookie"])(request)
                ]
            });
        }
        if (input.action === "recovery") {
            const code = typeof input.code === "string" ? input.code.slice(0, 40) : "";
            const remaining = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["passkeyStatus"])()).passkeys.length === 0 ? null : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consumeRecoveryCode"])(code);
            if (remaining === null) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordLoginFailure"])(ip);
                await sleep(500);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])("anonymous", "login-failed", `recovery code ip ${hashed(ip)}`).catch(()=>{});
                return json({
                    error: "invalid",
                    message: "That recovery code is not valid."
                }, 401);
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearLoginFailures"])(ip);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])("admin", "login", `recovery code (${remaining} left)`).catch(()=>{});
            // A recovery sign-in is deliberately short (1 hour): its job is to let you register a new passkey.
            return json({
                ok: true,
                recoveryRemaining: remaining
            }, 200, {
                "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionCookie"])(request, {
                    sub: "admin",
                    method: "recovery"
                }, 3600)
            });
        }
        return json({
            error: "bad-request",
            message: "Unknown action"
        }, 400);
    } catch (error) {
        return errorResponse(error);
    }
}
// ---- signed in: manage ------------------------------------------------------------------------------------------------
function guard(request, mutation) {
    if (mutation && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sameOriginMutation"])(request)) return {
        ok: false,
        response: json({
            error: "forbidden"
        }, 403)
    };
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])(request);
    if (!session) return {
        ok: false,
        response: json({
            error: "unauthorized"
        }, 401)
    };
    return {
        ok: true,
        actor: session.sub,
        method: session.method,
        recent: typeof session.iat === "number" && Date.now() / 1000 - session.iat <= RECENT_SECONDS
    };
}
async function passkeyStatusHandler(request) {
    const auth = guard(request, false);
    if (!auth.ok) return auth.response;
    try {
        let rpID = null, configError = null;
        try {
            rpID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["webauthnConfig"])(request).rpID;
        } catch (e) {
            configError = e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"] ? e.message : "Passkeys are not configured.";
        }
        return json({
            ...await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["passkeyStatus"])(),
            rpID,
            configError,
            session: {
                method: auth.method,
                recent: auth.recent
            }
        });
    } catch (error) {
        return errorResponse(error);
    }
}
async function passkeyActionHandler(request) {
    const auth = guard(request, true);
    if (!auth.ok) return auth.response;
    try {
        const input = await body(request);
        const action = typeof input.action === "string" ? input.action : "";
        const ip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clientIp"])(request);
        const blocked = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loginBlockedFor"])(ip);
        if (blocked) return json({
            error: "locked",
            message: `Too many attempts. Try again in ${Math.ceil(blocked / 60)} minutes.`
        }, 429, {
            "Retry-After": String(blocked)
        });
        const needsRecent = [
            "register-options",
            "register-verify",
            "remove",
            "recovery-codes",
            "policy"
        ].includes(action);
        if (needsRecent && !auth.recent) return json({
            error: "reauth",
            message: "For safety, sign in again (within the last 15 minutes) to change sign-in methods."
        }, 403);
        switch(action){
            case "register-options":
                {
                    const { options, cookie } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["beginRegistration"])(request, auth.actor);
                    return json(options, 200, {
                        "Set-Cookie": cookie
                    });
                }
            case "register-verify":
                {
                    const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finishRegistration"])(request, auth.actor, input.response, input.name);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, "passkey-added", `"${created.name}"`).catch(()=>{});
                    return json({
                        ok: true,
                        passkey: created
                    }, 200, {
                        "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearChallengeCookie"])(request)
                    });
                }
            case "test-options":
                {
                    const { options, cookie } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["beginLogin"])(request);
                    return json(options, 200, {
                        "Set-Cookie": cookie
                    });
                }
            case "test-verify":
                {
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finishLogin"])(request, input.response);
                    if (!result.ok) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordLoginFailure"])(ip);
                        return json({
                            error: "verification",
                            message: "The passkey could not be verified."
                        }, 400, {
                            "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearChallengeCookie"])(request)
                        });
                    }
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, "passkey-tested", `"${result.name}"`).catch(()=>{});
                    return json({
                        ok: true,
                        name: result.name
                    }, 200, {
                        "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearChallengeCookie"])(request)
                    });
                }
            case "rename":
                {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renamePasskey"])(String(input.id ?? ""), input.name);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, "passkey-renamed").catch(()=>{});
                    return json({
                        ok: true
                    });
                }
            case "remove":
                {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["removePasskey"])(String(input.id ?? ""));
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, "passkey-removed").catch(()=>{});
                    return json({
                        ok: true
                    });
                }
            case "recovery-codes":
                {
                    const codes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["regenerateRecovery"])();
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, "passkey-recovery-regenerated").catch(()=>{});
                    return json({
                        recoveryCodes: codes
                    });
                }
            case "policy":
                {
                    const enabled = input.enabled === true;
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setPasswordlessOnly"])(enabled);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAudit"])(auth.actor, enabled ? "passwordless-on" : "passwordless-off", enabled ? "password and authenticator-code sign-in disabled" : "password sign-in available again").catch(()=>{});
                    return json({
                        ok: true
                    });
                }
            default:
                return json({
                    error: "bad-request",
                    message: "Unknown action"
                }, 400);
        }
    } catch (error) {
        return errorResponse(error);
    }
}
}),
"[project]/lib/server/passkey.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/twofa.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
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
    return (await __turbopack_context__.A("[project]/lib/server/webauthn-engine.ts [app-route] (ecmascript, async loader)")).realEngine;
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
        origin = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSecureRequest"])(request) ? "https" : "http"}://${host}`;
    }
    let url;
    try {
        url = new URL(origin);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"]("SITE_URL / WEBAUTHN_ORIGIN is not a valid origin.");
    }
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"]("Passkeys need https (http is only allowed on localhost).");
    }
    const rpID = (process.env.WEBAUTHN_RP_ID || "").trim() || url.hostname;
    if (url.hostname !== rpID && !url.hostname.endsWith("." + rpID)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"]("WEBAUTHN_RP_ID must equal the site's domain (or a parent of it).");
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
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().get(STATE_KEY);
    if (!raw) return emptyState();
    let state;
    try {
        state = JSON.parse(raw);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"]("The stored passkey record is damaged.");
    }
    if (state?.v !== 1 || !Array.isArray(state.creds) || !Array.isArray(state.recovery)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"]("The stored passkey record is damaged.");
    }
    return state;
}
const writeState = (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().set(STATE_KEY, JSON.stringify(state));
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
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().set(challengeKey(cid), JSON.stringify(record));
    const secure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSecureRequest"])(request);
    // The cookie carries only the lookup id; without THIS browser's cookie the stored challenge cannot be claimed.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildCookie"])(challengeCookieName(secure), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signToken"])({
        cid,
        purpose
    }, CHALLENGE_TTL_MS / 1000), {
        secure,
        maxAge: CHALLENGE_TTL_MS / 1000
    });
}
function clearChallengeCookie(request) {
    const secure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSecureRequest"])(request);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildCookie"])(challengeCookieName(secure), "", {
        secure,
        maxAge: 0
    });
}
/** Reads AND deletes the challenge in one go: whatever happens next, it can never be used a second time. */ async function claimChallenge(request, purpose, now) {
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readCookie"])(request, challengeCookieName((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSecureRequest"])(request))));
    if (!token || typeof token.cid !== "string" || token.purpose !== purpose) {
        return null;
    }
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().take(challengeKey(token.cid));
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
const recoveryHash = (code)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveKey"])("passkey-recovery")).update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeRecovery"])(code)).digest("base64url");
async function regenerateRecovery(now = Date.now()) {
    const state = await readState();
    if (state.creds.length === 0) {
        throw new PasskeyError("no-passkey");
    }
    const codes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRecoveryCodes"])();
    state.recovery = codes.map(recoveryHash);
    state.recoveryAt = new Date(now).toISOString();
    await writeState(state);
    return codes;
}
async function consumeRecoveryCode(input) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$twofa$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["looksLikeRecovery"])(input)) return null;
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
"[project]/lib/server/twofa.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$qr$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/qr.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
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
    const cipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createCipheriv"])("aes-256-gcm", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveKey"])("2fa-secret"), iv);
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
        const decipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createDecipheriv"])("aes-256-gcm", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveKey"])("2fa-secret"), Buffer.from(iv, "base64url"));
        decipher.setAuthTag(Buffer.from(tag, "base64url"));
        return Buffer.concat([
            decipher.update(Buffer.from(ct, "base64url")),
            decipher.final()
        ]).toString("utf8");
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"]("The stored two-factor secret cannot be read (was SESSION_SECRET changed?). On the server run: node scripts/admin-reset-2fa.mjs");
    }
}
// ---- recovery codes ---------------------------------------------------------------------
const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // 32 symbols, no I/O/0/1 — 256 % 32 == 0 so no modulo bias
;
const normalizeRecovery = (input)=>input.toUpperCase().replace(/[^A-Z0-9]/g, "");
const looksLikeRecovery = (input)=>/^[A-HJ-NP-Z2-9]{10}$/.test(normalizeRecovery(input));
const recoveryHash = (code)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveKey"])("2fa-recovery")).update(normalizeRecovery(code)).digest("base64url");
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
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().get(RECORD_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw);
    if (record?.v !== 1 || typeof record.secret !== "string" || !Array.isArray(record.recovery)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConfigError"]("The stored two-factor record is damaged.");
    return record;
}
const writeRecord = (record)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().set(RECORD_KEY, JSON.stringify(record));
async function twoFactorState() {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authConfig"])().totpSecret) return {
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
    const envSecret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authConfig"])().totpSecret;
    if (envSecret) {
        const step = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyTotpStep"])(envSecret, code, now);
        if (step === null) return {
            ok: false
        };
        try {
            const last = Number(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().get(ENV_LAST_KEY) ?? 0);
            if (step <= last) return {
                ok: false
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().set(ENV_LAST_KEY, String(step));
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
        const step = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyTotpStep"])(decryptSecret(record.secret), code, now);
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
    const secret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateTotpSecret"])();
    const uri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["totpUri"])(secret, ACCOUNT, ISSUER);
    const pending = {
        secret: encryptSecret(secret),
        createdAt: Date.now()
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().set(PENDING_KEY, JSON.stringify(pending));
    return {
        secret,
        uri,
        qr: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$qr$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["qrRows"])(uri),
        expiresAt: new Date(pending.createdAt + PENDING_TTL_MS).toISOString()
    };
}
async function confirmEnrollment(code, now = Date.now()) {
    const state = await twoFactorState();
    if (state.source === "env") throw new TwoFactorError("managed-by-env");
    if (state.enabled) throw new TwoFactorError("already-enabled");
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().get(PENDING_KEY);
    const pending = raw ? JSON.parse(raw) : null;
    if (!pending || pending.createdAt + PENDING_TTL_MS < now) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().del(PENDING_KEY).catch(()=>{});
        throw new TwoFactorError("no-pending");
    }
    const step = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyTotpStep"])(decryptSecret(pending.secret), code.trim(), now);
    if (step === null) throw new TwoFactorError("invalid-code");
    const recoveryCodes = generateRecoveryCodes();
    await writeRecord({
        v: 1,
        secret: pending.secret,
        enabledAt: new Date(now).toISOString(),
        lastStep: step,
        recovery: recoveryCodes.map(recoveryHash)
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().del(PENDING_KEY);
    return {
        recoveryCodes
    };
}
async function disableTwoFactor(code) {
    const state = await twoFactorState();
    if (state.source === "env") throw new TwoFactorError("managed-by-env");
    if (!state.enabled) throw new TwoFactorError("not-enabled");
    if (!(await verifySecondFactor(code)).ok) throw new TwoFactorError("invalid-code");
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().del(RECORD_KEY);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().del(PENDING_KEY).catch(()=>{});
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
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().get(limiterKey(actor));
    if (!raw) return 0;
    const a = JSON.parse(raw);
    const remaining = a.first + LIMIT.windowMs - Date.now();
    return a.count >= LIMIT.max && remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}
async function twoFactorRecordFailure(actor) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
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
const twoFactorClearFailures = (actor)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().del(limiterKey(actor));
}),
"[project]/lib/site-content.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultContent",
    ()=>defaultContent,
    "mergeContent",
    ()=>mergeContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content-schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/portfolio-content.ts [app-route] (ecmascript)");
;
;
const defaultContent = {
    version: 0,
    appearance: {
        preset: "blue",
        accentColor: "#55aaff",
        secondaryColor: "#48c8e8",
        glow: 35,
        cursorEffect: true,
        cursorIntensity: 35,
        headingFont: "inter",
        bodyFont: "inter",
        monoFont: "plex-mono",
        headingWeight: "700"
    },
    customPages: {
        pages: [],
        templates: []
    },
    profile: JSON.parse(JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["profile"])),
    copy: {
        en: JSON.parse(JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["copy"].en)),
        id: {}
    },
    aboutRows: JSON.parse(JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aboutRows"])),
    statusLine: JSON.parse(JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["statusLine"])),
    terminalOutput: JSON.parse(JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["terminalOutput"])),
    quickCommands: [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["quickCommands"]
    ],
    education: JSON.parse(JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["education"])),
    experience: JSON.parse(JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["experience"])),
    certifications: {
        items: []
    },
    mitre: {
        items: []
    },
    projects: {
        items: []
    },
    training: {
        items: []
    },
    tools: {
        items: []
    },
    achievements: {
        items: []
    },
    writeups: {
        items: []
    },
    contact: {
        email: "",
        socials: []
    },
    footer: {
        tagline: {
            en: "Thanks for exploring my security portfolio. Built with intent, driven by curiosity.",
            id: ""
        },
        connectLabel: {
            en: "CONNECT WITH ME",
            id: ""
        },
        transmissionLabel: {
            en: "END OF TRANSMISSION",
            id: ""
        },
        statusLabel: {
            en: "SECURE CHANNEL ONLINE",
            id: ""
        },
        bottomNote: {
            en: "DESIGNED FOR THE CURIOUS · BUILT WITH INTENT",
            id: ""
        },
        backToTopLabel: {
            en: "BACK TO TOP ↑",
            id: ""
        },
        rightsText: {
            en: "All rights reserved.",
            id: ""
        },
        copyrightName: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["profile"].name,
        showStatus: true,
        showSocials: true,
        showEmail: true,
        showBottomNote: true,
        showBackToTop: true,
        showCopyright: true
    },
    skills: {
        image: null,
        imageAlt: {
            en: "",
            id: ""
        },
        items: []
    },
    sections: JSON.parse(JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$portfolio$2d$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["portfolioSections"]))
};
const isPlain = (value)=>typeof value === "object" && value !== null && !Array.isArray(value);
/** Objects merge key by key (so new default keys appear); arrays and primitives from `stored` win. */ function deepMerge(base, stored) {
    if (isPlain(base) && isPlain(stored)) {
        const result = {
            ...base
        };
        for (const key of Object.keys(stored)){
            if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
            result[key] = key in base ? deepMerge(base[key], stored[key]) : stored[key];
        }
        return result;
    }
    return stored === undefined ? base : stored;
}
function mergeContent(stored) {
    if (!isPlain(stored)) return defaultContent;
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["siteContentSchema"].safeParse(deepMerge(defaultContent, stored));
    return parsed.success ? parsed.data : defaultContent;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__00noscymrv00y._.js.map