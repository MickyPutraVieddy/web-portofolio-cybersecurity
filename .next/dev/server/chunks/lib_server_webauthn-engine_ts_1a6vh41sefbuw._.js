module.exports = [
"[project]/lib/server/webauthn-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "realEngine",
    ()=>realEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@simplewebauthn+server@13.3.3/node_modules/@simplewebauthn/server/esm/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$authentication$2f$generateAuthenticationOptions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@simplewebauthn+server@13.3.3/node_modules/@simplewebauthn/server/esm/authentication/generateAuthenticationOptions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$registration$2f$generateRegistrationOptions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@simplewebauthn+server@13.3.3/node_modules/@simplewebauthn/server/esm/registration/generateRegistrationOptions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$authentication$2f$verifyAuthenticationResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@simplewebauthn+server@13.3.3/node_modules/@simplewebauthn/server/esm/authentication/verifyAuthenticationResponse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$registration$2f$verifyRegistrationResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@simplewebauthn+server@13.3.3/node_modules/@simplewebauthn/server/esm/registration/verifyRegistrationResponse.js [app-route] (ecmascript)");
;
const toBytes = (b64url)=>new Uint8Array(Buffer.from(b64url, "base64url"));
const toB64 = (bytes)=>Buffer.from(bytes).toString("base64url");
const TIMEOUT_MS = 120_000;
const realEngine = {
    async registrationOptions ({ rpName, rpID, userName, userID, excludeIds }) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$registration$2f$generateRegistrationOptions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRegistrationOptions"])({
            rpName,
            rpID,
            userName,
            userID: new Uint8Array(userID),
            timeout: TIMEOUT_MS,
            attestationType: "none",
            excludeCredentials: excludeIds.map((id)=>({
                    id
                })),
            authenticatorSelection: {
                residentKey: "required",
                userVerification: "required"
            }
        });
    },
    async verifyRegistration ({ response, expectedChallenge, expectedOrigin, expectedRPID }) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$registration$2f$verifyRegistrationResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyRegistrationResponse"])({
            response: response,
            expectedChallenge,
            expectedOrigin,
            expectedRPID,
            requireUserVerification: true
        });
        if (!result.verified || !result.registrationInfo) {
            return {
                verified: false
            };
        }
        const { credential, credentialDeviceType, credentialBackedUp } = result.registrationInfo;
        return {
            verified: true,
            credential: {
                id: credential.id,
                publicKey: toB64(credential.publicKey),
                counter: credential.counter,
                transports: credential.transports ?? [],
                deviceType: credentialDeviceType,
                backedUp: credentialBackedUp
            }
        };
    },
    async authenticationOptions ({ rpID }) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$authentication$2f$generateAuthenticationOptions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateAuthenticationOptions"])({
            rpID,
            userVerification: "required",
            timeout: TIMEOUT_MS
        });
    },
    async verifyAuthentication ({ response, expectedChallenge, expectedOrigin, expectedRPID, credential }) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$simplewebauthn$2b$server$40$13$2e$3$2e$3$2f$node_modules$2f40$simplewebauthn$2f$server$2f$esm$2f$authentication$2f$verifyAuthenticationResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAuthenticationResponse"])({
            response: response,
            expectedChallenge,
            expectedOrigin,
            expectedRPID,
            requireUserVerification: true,
            credential: {
                id: credential.id,
                publicKey: toBytes(credential.publicKey),
                counter: credential.counter,
                transports: credential.transports
            }
        });
        return {
            verified: result.verified,
            newCounter: result.authenticationInfo.newCounter
        };
    }
};
}),
];

//# sourceMappingURL=lib_server_webauthn-engine_ts_1a6vh41sefbuw._.js.map