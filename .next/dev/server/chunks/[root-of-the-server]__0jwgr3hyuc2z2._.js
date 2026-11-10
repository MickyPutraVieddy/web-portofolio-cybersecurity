module.exports = [
"[externals]/node:crypto [external] (node:crypto, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[externals]/node:crypto [external] (node:crypto, cjs)");
    });
});
}),
"[project]/lib/server/webauthn-engine.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/0zzf_@simplewebauthn_server_esm_0nx2o7rdi3x8_._.js",
  "server/chunks/1oua_asn1js_build_index_es_1nf5i4v55t7qy.js",
  "server/chunks/0nn0_@peculiar_utils_build_esm_1laax74x256wm._.js",
  "server/chunks/1x8t_@peculiar_asn1-x509_build_es2015_1o-2nn0ebvfdx._.js",
  "server/chunks/1e7n_@peculiar_asn1-cms_build_es2015_01fr2ecioci5x._.js",
  "server/chunks/0k9c_@peculiar_asn1-x509-attr_build_es2015_1nyz022h0aj29._.js",
  "server/chunks/1f3z_@peculiar_x509_build_x509_es_1pd-5yvb3zkfk.js",
  "server/chunks/node_modules__pnpm_12se75fvppm5t._.js",
  "server/chunks/lib_server_webauthn-engine_ts_1a6vh41sefbuw._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/server/webauthn-engine.ts [app-route] (ecmascript)");
    });
});
}),
];