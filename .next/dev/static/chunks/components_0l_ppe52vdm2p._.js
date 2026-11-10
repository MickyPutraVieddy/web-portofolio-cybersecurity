(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/content-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var e = new Error("Could not parse module '[project]/components/content-provider.tsx', file not found");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/components/language-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "usePortfolio",
    ()=>usePortfolio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$5$2e$1_react$40$19$2e$3$2e$1$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/swr@2.5.1_react@19.3.1/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript) <export u as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$5$2e$1_react$40$19$2e$3$2e$1$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__S__as__SWRConfig$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/swr@2.5.1_react@19.3.1/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript) <export S as SWRConfig>");
(()=>{
    const e = new Error("Cannot find module '@/components/content-provider'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$translation$2d$layer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/translation-layer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const preferencesKey = "portfolio-ui-preferences";
const defaults = {
    locale: "en",
    paused: false,
    reducedMotion: false,
    hidden: false,
    hydrated: false,
    introComplete: false
};
function usePortfolio() {
    _s();
    const { copy } = useContent();
    const { data, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$5$2e$1_react$40$19$2e$3$2e$1$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__["default"])(preferencesKey, null);
    const preferences = data ?? defaults;
    function update(values) {
        void mutate((current)=>({
                ...current ?? defaults,
                ...values
            }), {
            revalidate: false
        });
    }
    function setLocale(locale) {
        if (locale === preferences.locale) return;
        const security = window.location.protocol === "https:" ? "; SameSite=None; Secure; Partitioned" : "; SameSite=Lax";
        document.cookie = `portfolio-language=${locale}; Path=/; Max-Age=31536000${security}`;
        update({
            locale,
            introComplete: true
        });
    }
    return {
        ...preferences,
        t: copy[preferences.locale],
        motionEnabled: !preferences.paused && !preferences.reducedMotion && !preferences.hidden,
        setLocale,
        update
    };
}
_s(usePortfolio, "OY4Mx7SSJ6m+tSEls/rDLD4rl+w=", false, function() {
    return [
        useContent,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$5$2e$1_react$40$19$2e$3$2e$1$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__["default"]
    ];
});
function PreferenceEffects() {
    _s1();
    const { locale, update } = usePortfolio();
    const { copy } = useContent();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PreferenceEffects.useEffect": ()=>{
            const media = window.matchMedia("(prefers-reduced-motion: reduce)");
            const syncMotion = {
                "PreferenceEffects.useEffect.syncMotion": ()=>update({
                        reducedMotion: media.matches,
                        ...media.matches ? {
                            introComplete: true
                        } : {}
                    })
            }["PreferenceEffects.useEffect.syncMotion"];
            const syncVisibility = {
                "PreferenceEffects.useEffect.syncVisibility": ()=>update({
                        hidden: document.hidden
                    })
            }["PreferenceEffects.useEffect.syncVisibility"];
            update({
                hydrated: true,
                reducedMotion: media.matches,
                hidden: document.hidden
            });
            syncMotion();
            const timeout = window.setTimeout({
                "PreferenceEffects.useEffect.timeout": ()=>update({
                        introComplete: true
                    })
            }["PreferenceEffects.useEffect.timeout"], 4200);
            media.addEventListener("change", syncMotion);
            document.addEventListener("visibilitychange", syncVisibility);
            return ({
                "PreferenceEffects.useEffect": ()=>{
                    window.clearTimeout(timeout);
                    media.removeEventListener("change", syncMotion);
                    document.removeEventListener("visibilitychange", syncVisibility);
                }
            })["PreferenceEffects.useEffect"];
        // This subscription owns the lifetime of the page, not each preference update.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["PreferenceEffects.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PreferenceEffects.useEffect": ()=>{
            document.documentElement.lang = locale;
            document.title = copy[locale].title;
            const values = [
                [
                    'meta[name="description"]',
                    copy[locale].metaDescription
                ],
                [
                    'meta[property="og:title"]',
                    copy[locale].title
                ],
                [
                    'meta[property="og:description"]',
                    copy[locale].metaDescription
                ],
                [
                    'meta[name="twitter:title"]',
                    copy[locale].title
                ],
                [
                    'meta[name="twitter:description"]',
                    copy[locale].metaDescription
                ],
                [
                    'meta[property="og:locale"]',
                    locale === "en" ? "en_US" : "id_ID"
                ]
            ];
            for (const [selector, content] of values){
                document.querySelector(selector)?.setAttribute("content", content);
            }
        }
    }["PreferenceEffects.useEffect"], [
        locale,
        copy
    ]);
    return null;
}
_s1(PreferenceEffects, "3RT0QpjbIV4yK/f6Xz2usgMmgvU=", false, function() {
    return [
        usePortfolio,
        useContent
    ];
});
_c = PreferenceEffects;
function LanguageProvider({ initialLocale, initialTranslations = {}, children }) {
    _s2();
    const configuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LanguageProvider.useMemo[configuration]": ()=>({
                provider: ({
                    "LanguageProvider.useMemo[configuration]": ()=>new Map()
                })["LanguageProvider.useMemo[configuration]"],
                fallback: {
                    [preferencesKey]: {
                        ...defaults,
                        locale: initialLocale
                    }
                },
                revalidateOnFocus: false,
                revalidateOnReconnect: false
            })
    }["LanguageProvider.useMemo[configuration]"], [
        initialLocale
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$5$2e$1_react$40$19$2e$3$2e$1$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__S__as__SWRConfig$3e$__["SWRConfig"], {
        value: configuration,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$translation$2d$layer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TranslationLayer"], {
            initial: initialTranslations,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PreferenceEffects, {}, void 0, false, {
                    fileName: "[project]/components/language-provider.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/components/language-provider.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/language-provider.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_s2(LanguageProvider, "SpPwM3LPocFHp3jpRgsUDESe/vI=");
_c1 = LanguageProvider;
var _c, _c1;
__turbopack_context__.k.register(_c, "PreferenceEffects");
__turbopack_context__.k.register(_c1, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_0l_ppe52vdm2p._.js.map