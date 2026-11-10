(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/components/translation-layer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TranslationLayer",
    ()=>TranslationLayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@22.20.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/content-provider'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$language$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/language-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/translate.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function TranslationLayer({ initial, children }) {
    _s();
    const base = useContent();
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$language$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePortfolio"])();
    const [dict, setDict] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial);
    const busy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const missing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TranslationLayer.useMemo[missing]": ()=>locale === "id" ? [
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectMissing"])(base, dict).keys()
            ] : []
    }["TranslationLayer.useMemo[missing]"], [
        base,
        dict,
        locale
    ]);
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TranslationLayer.useMemo[content]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fillContent"])(base, locale === "id" ? dict : {})
    }["TranslationLayer.useMemo[content]"], [
        base,
        dict,
        locale
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TranslationLayer.useEffect": ()=>{
            if (locale !== "id" || missing.length === 0 || busy.current) return;
            let cancelled = false;
            busy.current = true;
            void ({
                "TranslationLayer.useEffect": async ()=>{
                    let queue = missing;
                    for(let round = 0; round < 40 && queue.length && !cancelled; round++){
                        let result;
                        try {
                            const response = await fetch("/api/translate", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    hashes: queue.slice(0, 60)
                                })
                            });
                            if (!response.ok) break;
                            result = await response.json();
                        } catch  {
                            break;
                        }
                        const got = result.translations ?? {};
                        const gotKeys = Object.keys(got);
                        if (gotKeys.length) {
                            setDict({
                                "TranslationLayer.useEffect": (current)=>({
                                        ...current,
                                        ...got
                                    })
                            }["TranslationLayer.useEffect"]);
                            queue = queue.filter({
                                "TranslationLayer.useEffect": (hash)=>!(hash in got)
                            }["TranslationLayer.useEffect"]);
                        }
                        // Stop when nothing came back (quota used up, or draft text that is not saved yet) — retry on the next visit.
                        if (result.blocked || gotKeys.length === 0) break;
                    }
                    busy.current = false;
                }
            })["TranslationLayer.useEffect"]();
            return ({
                "TranslationLayer.useEffect": ()=>{
                    cancelled = true;
                    busy.current = false;
                }
            })["TranslationLayer.useEffect"];
        }
    }["TranslationLayer.useEffect"], [
        locale,
        missing
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$22$2e$20$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContentScope, {
        content: content,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/translation-layer.tsx",
        lineNumber: 51,
        columnNumber: 10
    }, this);
}
_s(TranslationLayer, "Rk5wrgJaYkvVSJh5CcMK5u2ILqE=", false, function() {
    return [
        useContent,
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$language$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePortfolio"]
    ];
});
_c = TranslationLayer;
var _c;
__turbopack_context__.k.register(_c, "TranslationLayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/translate.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_TEXT",
    ()=>MAX_TEXT,
    "PROTECTED_TERMS",
    ()=>PROTECTED_TERMS,
    "chunkText",
    ()=>chunkText,
    "collectMissing",
    ()=>collectMissing,
    "collectTexts",
    ()=>collectTexts,
    "decodeEntities",
    ()=>decodeEntities,
    "fillContent",
    ()=>fillContent,
    "hashText",
    ()=>hashText,
    "isTranslatable",
    ()=>isTranslatable,
    "protectTerms",
    ()=>protectTerms,
    "restoreTerms",
    ()=>restoreTerms,
    "sourceOf",
    ()=>sourceOf,
    "splitShape",
    ()=>splitShape
]);
const PROTECTED_TERMS = [
    "CompTIA Security+",
    "Google Cybersecurity",
    "MITRE ATT&CK",
    "TryHackMe",
    "HackTheBox",
    "Hack The Box",
    "Blue Team",
    "Red Team",
    "Purple Team",
    "InfoSec",
    "Cisco",
    "Splunk",
    "Wireshark",
    "Burp Suite",
    "Nmap",
    "Metasploit",
    "Kali Linux",
    "Elastic",
    "Sentinel",
    "CrowdStrike",
    "VirusTotal",
    "n8n",
    "SIEM",
    "DFIR",
    "SOAR",
    "EDR",
    "XDR",
    "OSINT",
    "SOC",
    "CTF",
    "CVE",
    "CGPA"
];
/** Object keys inside a translatable subtree whose values are data, never prose. */ const SKIP_KEYS = new Set([
    "id",
    "url",
    "href",
    "image",
    "icon",
    "platform",
    "slug",
    "type",
    "kind",
    "color",
    "category",
    "tag",
    "techniqueId",
    "email"
]);
const MAX_TEXT = 1500;
function hashText(text) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for(let i = 0; i < text.length; i++){
        const ch = text.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
function splitShape(text) {
    const command = /^(\s*\S+\s{2,})(\S.*?)(\s*)$/s.exec(text);
    if (command && /^\s+/.test(text)) return {
        prefix: command[1],
        body: command[2],
        suffix: command[3]
    };
    const plain = /^(\s*)(.*?)(\s*)$/s.exec(text);
    return {
        prefix: plain[1],
        body: plain[2],
        suffix: plain[3]
    };
}
function isTranslatable(text) {
    const body = splitShape(text).body;
    if (body.length < 2 || body.length > MAX_TEXT) return false;
    if (!/\p{L}{2,}/u.test(body)) return false;
    if (/^(https?:\/\/|mailto:|\/|#|data:)/i.test(body)) return false;
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(body)) return false;
    if (/^[\w.-]+\.(txt|png|jpe?g|webp|svg|pdf)$/i.test(body)) return false;
    return true;
}
const sourceOf = (text)=>splitShape(text).body;
const isRecord = (value)=>typeof value === "object" && value !== null && !Array.isArray(value);
/** `{ en, id }` and nothing else. */ const isPair = (value)=>{
    if (!isRecord(value)) return false;
    const keys = Object.keys(value);
    return keys.length === 2 && "en" in value && "id" in value;
};
function visitStrings(node, visit) {
    if (typeof node === "string") {
        if (isTranslatable(node)) visit(sourceOf(node));
        return;
    }
    if (Array.isArray(node)) {
        for (const item of node)visitStrings(item, visit);
        return;
    }
    if (isRecord(node)) {
        for (const [key, value] of Object.entries(node))if (!SKIP_KEYS.has(key)) visitStrings(value, visit);
    }
}
function mapStrings(node, dict) {
    if (typeof node === "string") {
        if (!isTranslatable(node)) return node;
        const { prefix, body, suffix } = splitShape(node);
        const done = dict[hashText(body)];
        return done ? prefix + done + suffix : node;
    }
    if (Array.isArray(node)) return node.map((item)=>mapStrings(item, dict));
    if (isRecord(node)) {
        const out = {};
        for (const [key, value] of Object.entries(node))out[key] = SKIP_KEYS.has(key) ? value : mapStrings(value, dict);
        return out;
    }
    return node;
}
function walk(node, onPair) {
    if (Array.isArray(node)) return node.map((item)=>walk(item, onPair));
    if (isPair(node)) return {
        en: node.en,
        id: onPair(node.en)
    };
    if (isRecord(node)) {
        const out = {};
        for (const [key, value] of Object.entries(node))out[key] = walk(value, onPair);
        return out;
    }
    return node;
}
function walkReadOnly(node, onPair) {
    if (Array.isArray(node)) {
        for (const item of node)walkReadOnly(item, onPair);
        return;
    }
    if (isPair(node)) {
        onPair(node.en);
        return;
    }
    if (isRecord(node)) for (const value of Object.values(node))walkReadOnly(value, onPair);
}
function collectTexts(content) {
    const found = new Map();
    walkReadOnly(content, (en)=>visitStrings(en, (text)=>found.set(hashText(text), text)));
    return found;
}
function collectMissing(content, dict) {
    const missing = new Map();
    for (const [hash, text] of collectTexts(content))if (!dict[hash]) missing.set(hash, text);
    return missing;
}
function fillContent(content, dict) {
    return walk(content, (en)=>mapStrings(en, dict));
}
// ---- protecting terms ----------------------------------------------------------------
const escapeRegExp = (value)=>value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TERM_PATTERN = new RegExp(`(?<![\\p{L}\\p{N}])(${[
    ...PROTECTED_TERMS
].sort((a, b)=>b.length - a.length).map(escapeRegExp).join("|")})(?![\\p{L}\\p{N}])`, "gu");
function protectTerms(text) {
    const terms = [];
    const out = text.replace(TERM_PATTERN, (match)=>{
        terms.push(match);
        return `ZQ${terms.length - 1}Q`;
    });
    return {
        text: out,
        terms
    };
}
function restoreTerms(text, terms) {
    let ok = true;
    const out = text.replace(/ZQ(\d+)Q/gi, (_m, n)=>{
        const term = terms[Number(n)];
        if (term === undefined) {
            ok = false;
            return "";
        }
        return term;
    });
    if (!ok) return null;
    for(let i = 0; i < terms.length; i++)if (!new RegExp(`ZQ${i}Q`, "i").test(text)) return null;
    return out;
}
function chunkText(text, maxBytes = 420) {
    const bytes = (value)=>new TextEncoder().encode(value).length;
    if (bytes(text) <= maxBytes) return [
        text
    ];
    const pieces = text.split(/(?<=[.!?;:])\s+/);
    const chunks = [];
    let current = "";
    const push = (piece)=>{
        if (!current) {
            current = piece;
            return;
        }
        if (bytes(`${current} ${piece}`) <= maxBytes) current = `${current} ${piece}`;
        else {
            chunks.push(current);
            current = piece;
        }
    };
    for (const piece of pieces){
        if (bytes(piece) <= maxBytes) {
            push(piece);
            continue;
        }
        for (const word of piece.split(/\s+/))push(word);
    }
    if (current) chunks.push(current);
    return chunks;
}
function decodeEntities(text) {
    return text.replace(/&#(\d+);/g, (_m, code)=>String.fromCodePoint(Number(code))).replace(/&#x([0-9a-f]+);/gi, (_m, code)=>String.fromCodePoint(parseInt(code, 16))).replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0cc4fufox6dng._.js.map