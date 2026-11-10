"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Check, Copy, Download, KeyRound, Loader2, ShieldAlert, ShieldCheck, Smartphone } from "lucide-react"
import { ApiError, api } from "@/components/admin/api"
import { useConfirm } from "@/components/admin/ui"

interface Status { enabled: boolean; source: "env" | "app" | null; recoveryRemaining: number; enabledAt: string | null; passwordRequired: boolean }
interface Enrolment { secret: string; uri: string; qr: string[]; expiresAt: string }

/** QR drawn as plain SVG paths (always black on white, with the 4-module quiet zone, so any scanner reads it in dark mode too). */
export function QrCode({ rows, label }: { rows: string[]; label: string }) {
  const n = rows.length, quiet = 4
  let path = ""
  rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === "1") path += `M${x + quiet} ${y + quiet}h1v1h-1z` })
  return (
    <svg className="adm-qr" viewBox={`0 0 ${n + quiet * 2} ${n + quiet * 2}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width="100%" height="100%" fill="#fff" /><path d={path} fill="#000" />
    </svg>
  )
}

const groupSecret = (secret: string) => secret.replace(/(.{4})/g, "$1 ").trim()
const messageOf = (e: unknown, fallback: string) => (e instanceof ApiError ? e.message : fallback)

export function TwoFactorPanel({ onNotice }: { onNotice: (kind: "ok" | "error", text: string) => void }) {
  const confirm = useConfirm()
  const [status, setStatus] = useState<Status | null>(null)
  const [loadError, setLoadError] = useState("")
  const [step, setStep] = useState<"idle" | "password" | "scan" | "codes">("idle")
  const [enrol, setEnrol] = useState<Enrolment | null>(null)
  const [recovery, setRecovery] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [manage, setManage] = useState<null | "disable" | "recovery">(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try { setStatus(await api<Status>("/api/admin/2fa")); setLoadError("") } catch (e) { setLoadError(messageOf(e, "Could not load the two-factor status.")) }
  }, [])
  useEffect(() => { void load() }, [load])

  const reset = () => { setStep("idle"); setEnrol(null); setPassword(""); setCode(""); setManage(null); setError("") }

  async function start(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("")
    try { setEnrol(await api<Enrolment>("/api/admin/2fa", { method: "POST", body: { action: "start", password } })); setPassword(""); setCode(""); setStep("scan") }
    catch (e) { setError(messageOf(e, "Could not start the setup.")) } finally { setBusy(false) }
  }
  async function verify(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("")
    try {
      const result = await api<{ recoveryCodes: string[] }>("/api/admin/2fa", { method: "POST", body: { action: "confirm", code } })
      setRecovery(result.recoveryCodes); setSaved(false); setEnrol(null); setCode(""); setStep("codes"); void load()
    } catch (e) { setError(messageOf(e, "Could not verify the code.")); setCode("") } finally { setBusy(false) }
  }
  async function manageSubmit(event: FormEvent) {
    event.preventDefault()
    if (manage === "disable" && !(await confirm({ title: "Turn off two-factor authentication?", body: "Signing in will need only the password until you set it up again.", confirmLabel: "Yes, turn off", danger: true }))) return
    setBusy(true); setError("")
    try {
      if (manage === "disable") { await api("/api/admin/2fa", { method: "POST", body: { action: "disable", code } }); reset(); onNotice("ok", "Two-factor authentication is off."); void load() }
      else { const r = await api<{ recoveryCodes: string[] }>("/api/admin/2fa", { method: "POST", body: { action: "recovery", code } }); setRecovery(r.recoveryCodes); setSaved(false); setManage(null); setCode(""); setStep("codes"); void load() }
    } catch (e) { setError(messageOf(e, "That did not work.")); setCode("") } finally { setBusy(false) }
  }

  const [copied, setCopied] = useState<"secret" | "codes" | null>(null)
  async function copy(text: string, what: "secret" | "codes") {
    try { await navigator.clipboard.writeText(text); setCopied(what); window.setTimeout(() => setCopied(null), 2000) } catch { onNotice("error", "Could not copy. Select the text and copy it by hand.") }
  }
  function download() {
    const body = `Portfolio Admin — recovery codes\nEach code works once. Keep them somewhere safe and private.\n\n${recovery.join("\n")}\n`
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain" }))
    const a = document.createElement("a"); a.href = url; a.download = "portfolio-admin-recovery-codes.txt"; a.click(); URL.revokeObjectURL(url)
  }

  const codeInput = (id: string, label: string, hint?: string) => (
    <label className="adm-field" htmlFor={id}>
      <span className="adm-label">{label}</span>
      <input id={id} className="adm-input adm-mono" value={code} onChange={(e) => setCode(manage ? e.target.value.slice(0, 14) : e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode={manage ? "text" : "numeric"} autoComplete="one-time-code" maxLength={manage ? 14 : 6} required placeholder={manage ? "123456 or XXXXX-XXXXX" : "123456"} aria-describedby={error ? `${id}-err` : undefined} />
      {hint && <span className="adm-hint">{hint}</span>}
    </label>
  )
  const errorLine = (id: string) => error && <p id={id} className="adm-error" role="alert">{error}</p>

  return (
    <section className="adm-group adm-2fa" aria-labelledby="adm-2fa-title">
      <h3 id="adm-2fa-title"><Smartphone aria-hidden="true" /> Two-factor authentication (Google Authenticator)</h3>
      {!status && !loadError && <p className="adm-hint"><Loader2 className="adm-spin" aria-hidden="true" /> Loading…</p>}
      {loadError && <p className="adm-error" role="alert">{loadError} <button type="button" className="adm-btn" onClick={() => void load()}>Try again</button></p>}

      {status && step === "idle" && !manage && (
        status.source === "env" ? (
          <>
            <p className="adm-2fa-state" data-on="true"><ShieldCheck aria-hidden="true" /> On — fixed by the <code>ADMIN_TOTP_SECRET</code> environment variable.</p>
            <p className="adm-note">Recovery codes and the controls on this page are only used when the secret is set up here. To manage it from the admin, remove that variable from your environment and redeploy.</p>
          </>
        ) : status.enabled ? (
          <>
            <p className="adm-2fa-state" data-on="true"><ShieldCheck aria-hidden="true" /> On{status.enabledAt ? ` since ${new Date(status.enabledAt).toLocaleDateString()}` : ""}. Signing in needs your password and a 6-digit code.</p>
            <p className="adm-note" data-low={status.recoveryRemaining <= 3}>{status.recoveryRemaining === 0 ? "No recovery codes left. Generate new ones now, so a lost phone cannot lock you out." : `${status.recoveryRemaining} recovery code${status.recoveryRemaining === 1 ? "" : "s"} left.`}{status.recoveryRemaining > 0 && status.recoveryRemaining <= 3 ? " Running low — generate new ones." : ""}</p>
            <div className="adm-2fa-actions">
              <button type="button" className="adm-btn" onClick={() => { setManage("recovery"); setError(""); setCode("") }}><KeyRound aria-hidden="true" />New recovery codes</button>
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => { setManage("disable"); setError(""); setCode("") }}>Turn off</button>
            </div>
          </>
        ) : (
          <>
            <p className="adm-2fa-state" data-on="false"><ShieldAlert aria-hidden="true" /> Off — only the password protects the admin.</p>
            <p className="adm-note">Use Google Authenticator (or any authenticator app) so a stolen password alone is not enough. Takes about a minute.</p>
            <button type="button" className="adm-btn adm-btn-primary" onClick={() => { setStep("password"); setError("") }}><Smartphone aria-hidden="true" />Set up authenticator</button>
          </>
        )
      )}

      {status && step === "password" && (
        <form className="adm-2fa-form" onSubmit={start}>
          {status.passwordRequired ? (
            <label className="adm-field"><span className="adm-label">Confirm your admin password to continue</span>
              <input className="adm-input" type="password" autoComplete="current-password" required value={password} maxLength={200} onChange={(e) => setPassword(e.target.value)} autoFocus />
            </label>
          ) : <p className="adm-note">You are signed in with Google, so no password is needed.</p>}
          {errorLine("adm-2fa-err")}
          <div className="adm-2fa-actions">
            <button type="submit" className="adm-btn adm-btn-primary" disabled={busy}>{busy && <Loader2 className="adm-spin" aria-hidden="true" />}Show QR code</button>
            <button type="button" className="adm-btn adm-btn-ghost" onClick={reset}>Cancel</button>
          </div>
        </form>
      )}

      {status && step === "scan" && enrol && (
        <form className="adm-2fa-scan" onSubmit={verify}>
          <ol className="adm-2fa-steps">
            <li>Open <b>Google Authenticator</b> on your phone and tap <b>+</b> → <b>Scan a QR code</b>.</li>
            <li>Scan this code. It is not turned on until you enter a code in step 3.</li>
          </ol>
          <div className="adm-2fa-qrbox"><QrCode rows={enrol.qr} label="QR code to add this admin to Google Authenticator" /></div>
          <div className="adm-2fa-manual">
            <span className="adm-label">Cannot scan? Enter this key by hand (time-based, 6 digits)</span>
            <div className="adm-2fa-secret"><code className="adm-mono" aria-label="Setup key">{groupSecret(enrol.secret)}</code>
              <button type="button" className="adm-btn" onClick={() => void copy(enrol.secret, "secret")}>{copied === "secret" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied === "secret" ? "Copied" : "Copy"}</button></div>
          </div>
          {codeInput("adm-2fa-verify", "3. Enter the 6-digit code shown in the app", `This setup expires at ${new Date(enrol.expiresAt).toLocaleTimeString()}.`)}
          {errorLine("adm-2fa-verify-err")}
          <div className="adm-2fa-actions">
            <button type="submit" className="adm-btn adm-btn-primary" disabled={busy || code.length !== 6}>{busy && <Loader2 className="adm-spin" aria-hidden="true" />}Verify and turn on</button>
            <button type="button" className="adm-btn adm-btn-ghost" onClick={reset}>Cancel</button>
          </div>
        </form>
      )}

      {manage && (
        <form className="adm-2fa-form" onSubmit={manageSubmit}>
          <p className="adm-note">{manage === "disable" ? "Enter a current code from the app (or a recovery code) to turn two-factor off." : "Enter a current code from the app (or a recovery code). The old recovery codes stop working."}</p>
          {codeInput("adm-2fa-manage", "Authenticator or recovery code")}
          {errorLine("adm-2fa-manage-err")}
          <div className="adm-2fa-actions">
            <button type="submit" className={manage === "disable" ? "adm-btn adm-btn-danger" : "adm-btn adm-btn-primary"} disabled={busy || code.trim().length < 6}>{busy && <Loader2 className="adm-spin" aria-hidden="true" />}{manage === "disable" ? "Turn off" : "Generate new codes"}</button>
            <button type="button" className="adm-btn adm-btn-ghost" onClick={reset}>Cancel</button>
          </div>
        </form>
      )}

      {step === "codes" && (
        <div className="adm-2fa-codes">
          <p className="adm-2fa-state" data-on="true"><ShieldCheck aria-hidden="true" /> Two-factor is on. Save your recovery codes now.</p>
          <p className="adm-note"><b>They are shown only once.</b> Each code signs you in a single time if you lose your phone. Store them in a password manager or print them.</p>
          <ul className="adm-2fa-grid" aria-label="Recovery codes">{recovery.map((c) => <li key={c} className="adm-mono">{c}</li>)}</ul>
          <div className="adm-2fa-actions">
            <button type="button" className="adm-btn" onClick={() => void copy(recovery.join("\n"), "codes")}>{copied === "codes" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied === "codes" ? "Copied" : "Copy all"}</button>
            <button type="button" className="adm-btn" onClick={download}><Download aria-hidden="true" />Download .txt</button>
          </div>
          <label className="adm-2fa-saved"><input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} /> I saved these codes in a safe place</label>
          <button type="button" className="adm-btn adm-btn-primary" disabled={!saved} onClick={() => { setRecovery([]); reset() }}>Done</button>
        </div>
      )}
    </section>
  )
}
