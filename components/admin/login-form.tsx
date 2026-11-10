"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Fingerprint, KeyRound, Loader2, Lock, QrCode, ShieldCheck } from "lucide-react"
import { ApiError, api } from "@/components/admin/api"
import { passkeyErrorMessage, passkeysSupported, signInWithPasskey, signInWithRecoveryCode } from "@/components/admin/passkey-client"

const errors: Record<string, string> = {
  "google-denied": "That Google account is not allowed to access the admin.",
  "google-state": "The Google sign-in expired. Please try again.",
  "google-token": "Google sign-in could not be verified. Please try again.",
  "google-config": "Google sign-in is not configured.",
  "google-passwordless": "Google sign-in is turned off because passkey-only sign-in is on. Use your passkey.",
  "google-error": "Google sign-in failed. Please try again.",
}
interface Config { password: boolean; totp: boolean; google: boolean; passkey?: { count: number; passwordlessOnly: boolean } }

export function LoginForm({ initialConfig = null }: { initialConfig?: Config | null }) {
  const [config, setConfig] = useState<Config | null>(initialConfig)
  const [supported, setSupported] = useState(true)
  const [mode, setMode] = useState<"passkey" | "password" | "recovery">("passkey")
  const [password, setPassword] = useState("")
  const [totp, setTotp] = useState("")
  const [recovery, setRecovery] = useState("")
  const [busy, setBusy] = useState<"" | "passkey" | "device" | "form">("")
  const [error, setError] = useState("")

  useEffect(() => {
    setSupported(passkeysSupported())
    if (!initialConfig) fetch("/api/admin/config", { cache: "no-store" }).then((r) => r.json()).then(setConfig).catch(() => setConfig({ password: false, totp: false, google: false }))
    const code = new URLSearchParams(window.location.search).get("error")
    if (code) setError(errors[code] || "Sign-in failed.")
  }, [initialConfig])

  const passkeys = config?.passkey?.count ?? 0
  const onlyPasskeys = !!config?.passkey?.passwordlessOnly
  const passkeyMode = passkeys > 0
  const canUsePassword = !!config?.password && !onlyPasskeys

  async function passkey(crossDevice: boolean) {
    setBusy(crossDevice ? "device" : "passkey"); setError("")
    try { await signInWithPasskey(crossDevice); window.location.href = "/admin" }
    catch (e) { setError(passkeyErrorMessage(e)) } finally { setBusy("") }
  }
  async function submitRecovery(event: FormEvent) {
    event.preventDefault(); setBusy("form"); setError("")
    try {
      const left = await signInWithRecoveryCode(recovery)
      try { sessionStorage.setItem("adm-recovery-left", String(left)) } catch { /* ignore */ }
      window.location.href = "/admin"
    } catch (e) { setError(e instanceof ApiError ? e.message : "Could not sign in."); setRecovery("") } finally { setBusy("") }
  }
  async function submitPassword(event: FormEvent) {
    event.preventDefault(); setBusy("form"); setError("")
    try {
      const result = await api<{ recoveryRemaining?: number }>("/api/admin/login", { method: "POST", body: { password, totp } })
      if (typeof result.recoveryRemaining === "number") { try { sessionStorage.setItem("adm-recovery-left", String(result.recoveryRemaining)) } catch { /* ignore */ } }
      window.location.href = "/admin"
    } catch (e) { setError(e instanceof ApiError ? e.message : "Could not sign in."); setPassword(""); setTotp("") } finally { setBusy("") }
  }

  const errorLine = error && <p className="adm-error" role="alert">{error}</p>
  const googleBlock = config?.google && (
    <>
      <div className="adm-or"><span>or</span></div>
      <a className="adm-btn adm-wide" href="/api/admin/google/start">Continue with Google</a>
    </>
  )

  // ---- passkey-first sign-in (once at least one passkey is registered) ----------------------------------------------------
  if (config && passkeyMode) {
    return (
      <main className="adm-login">
        <div className="adm-login-card adm-pk-card">
          <div className="adm-pk-head">
            <div className="adm-modal-icon"><ShieldCheck aria-hidden="true" /></div>
            <h1>Admin Authentication</h1>
            <p className="adm-note">Secure access · Passkey protected</p>
          </div>

          {mode === "passkey" && (
            <section className="adm-pk-panel" aria-label="Sign in with a passkey">
              <Fingerprint className="adm-pk-fp" aria-hidden="true" />
              <h2>Welcome back, Admin</h2>
              <p className="adm-note">Authenticate securely using your registered device.</p>
              {supported ? (
                <>
                  <button type="button" className="adm-btn adm-btn-primary adm-wide adm-pk-main" disabled={!!busy} onClick={() => void passkey(false)}>
                    {busy === "passkey" ? <Loader2 className="adm-spin" aria-hidden="true" /> : <Fingerprint aria-hidden="true" />}Sign in with Passkey
                  </button>
                  <p className="adm-hint">Use Touch ID, Face ID, Windows Hello or security key</p>
                  <div className="adm-pk-rule" />
                  <button type="button" className="adm-pk-link" disabled={!!busy} onClick={() => void passkey(true)}>
                    {busy === "device" ? <Loader2 className="adm-spin" aria-hidden="true" /> : <QrCode aria-hidden="true" />}Use a passkey from another device
                  </button>
                </>
              ) : <p className="adm-error" role="alert">This browser does not support passkeys. Use a current version of Safari, Chrome, Edge or Firefox{canUsePassword ? ", or sign in with your password below" : ", or use a recovery code"}.</p>}
            </section>
          )}

          {mode === "recovery" && (
            <form className="adm-pk-panel adm-pk-form" onSubmit={submitRecovery}>
              <h2>Use a recovery code</h2>
              <p className="adm-note">Lost your device? Enter one of the recovery codes you saved. Each works once.</p>
              <label className="adm-field"><span className="adm-label">Recovery code</span>
                <input className="adm-input adm-mono" autoCapitalize="characters" autoComplete="off" spellCheck={false} maxLength={14} required placeholder="XXXXX-XXXXX" value={recovery} onChange={(e) => setRecovery(e.target.value.replace(/[^0-9A-Za-z -]/g, ""))} />
              </label>
              <button type="submit" className="adm-btn adm-btn-primary adm-wide" disabled={!!busy || recovery.trim().length < 10}>{busy === "form" && <Loader2 className="adm-spin" aria-hidden="true" />}Sign in</button>
            </form>
          )}

          {mode === "password" && canUsePassword && (
            <form className="adm-pk-panel adm-pk-form" onSubmit={submitPassword} autoComplete="off">
              <h2>Sign in with password</h2>
              <p className="adm-note">Still available until you switch to passkey-only in Security.</p>
              <label className="adm-field"><span className="adm-label">Password</span><input className="adm-input" type="password" autoComplete="current-password" required value={password} maxLength={200} onChange={(e) => setPassword(e.target.value)} /></label>
              {config.totp && (
                <label className="adm-field"><span className="adm-label">Authenticator code or recovery code</span>
                  <input className="adm-input adm-mono" autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} maxLength={14} required placeholder="123456" value={totp} onChange={(e) => setTotp(e.target.value.replace(/[^0-9A-Za-z -]/g, ""))} />
                </label>
              )}
              <button type="submit" className="adm-btn adm-btn-primary adm-wide" disabled={!!busy}>{busy === "form" ? <Loader2 className="adm-spin" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}Sign in</button>
            </form>
          )}

          {errorLine}
          <nav className="adm-pk-alt" aria-label="Other ways to sign in">
            {mode !== "passkey" && <button type="button" onClick={() => { setMode("passkey"); setError("") }}>← Back to passkey</button>}
            {mode !== "recovery" && <button type="button" onClick={() => { setMode("recovery"); setError("") }}>Use a recovery code</button>}
            {mode !== "password" && canUsePassword && <button type="button" onClick={() => { setMode("password"); setError("") }}>Use password instead</button>}
          </nav>
          {googleBlock}
          <p className="adm-pk-foot"><Lock aria-hidden="true" /> Encrypted authentication · Protected session</p>
          <a className="adm-back" href="/">← Back to the site</a>
        </div>
      </main>
    )
  }

  // ---- no passkey registered yet: the classic form (password + optional authenticator code) ---------------------------------
  return (
    <main className="adm-login">
      <form className="adm-login-card" onSubmit={submitPassword} autoComplete="off">
        <div className="adm-modal-icon"><ShieldCheck aria-hidden="true" /></div>
        <h1>Admin sign in</h1>
        <p className="adm-note">Only the site owner can edit this portfolio.</p>
        {config && !config.password && !config.google && <p className="adm-error" role="alert">Admin is not configured yet. Run <code>node scripts/admin-setup.mjs</code> and add the values to your environment.</p>}
        {config?.password && (
          <>
            <label className="adm-field"><span className="adm-label">Password</span><input className="adm-input" type="password" autoComplete="current-password" required value={password} maxLength={200} onChange={(e) => setPassword(e.target.value)} /></label>
            {config.totp && (
              <label className="adm-field"><span className="adm-label">Authenticator code or recovery code</span>
                <input className="adm-input adm-mono" autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} maxLength={14} required placeholder="123456" value={totp} onChange={(e) => setTotp(e.target.value.replace(/[^0-9A-Za-z -]/g, ""))} aria-describedby="adm-totp-hint" />
                <span className="adm-hint" id="adm-totp-hint">The 6-digit code from Google Authenticator. Lost your phone? Use one of your recovery codes (XXXXX-XXXXX).</span>
              </label>
            )}
            <button type="submit" className="adm-btn adm-btn-primary adm-wide" disabled={!!busy}>{busy ? <Loader2 className="adm-spin" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}Sign in</button>
          </>
        )}
        {googleBlock}
        {errorLine}
        <a className="adm-back" href="/">← Back to the site</a>
      </form>
    </main>
  )
}
