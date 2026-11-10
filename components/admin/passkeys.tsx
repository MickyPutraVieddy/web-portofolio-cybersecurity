"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Check, Copy, Download, Fingerprint, KeyRound, Loader2, ShieldCheck, ShieldOff, X } from "lucide-react"
import { api } from "@/components/admin/api"
import { passkeyErrorMessage, passkeysSupported, registerPasskey, testPasskey } from "@/components/admin/passkey-client"
import { useConfirm } from "@/components/admin/ui"

interface Summary { id: string; name: string; createdAt: string; lastUsedAt: string | null; deviceType: string; backedUp: boolean }
interface Status {
  passkeys: Summary[]; passwordlessOnly: boolean; passwordlessSince: string | null; recoveryRemaining: number; recoveryAt: string | null
  requirements: { hasPasskey: boolean; tested: boolean; hasRecovery: boolean }; max: number; rpID: string | null; configError: string | null
  session: { method: string; recent: boolean }
}
const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString() : null)

export function PasskeyPanel({ onNotice }: { onNotice: (kind: "ok" | "error", text: string) => void }) {
  const confirm = useConfirm()
  const [status, setStatus] = useState<Status | null>(null)
  const [loadError, setLoadError] = useState("")
  const [name, setName] = useState("")
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [codes, setCodes] = useState<string[] | null>(null)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const supported = passkeysSupported()

  const load = useCallback(async () => {
    try { setStatus(await api<Status>("/api/admin/passkey")); setLoadError("") } catch (e) { setLoadError(passkeyErrorMessage(e)) }
  }, [])
  useEffect(() => { void load() }, [load])

  async function run(label: string, work: () => Promise<void>) {
    setBusy(label); setError("")
    try { await work(); await load() } catch (e) { setError(passkeyErrorMessage(e)) } finally { setBusy("") }
  }
  const add = (event: FormEvent) => { event.preventDefault(); void run("add", async () => { await registerPasskey(name.trim()); setName(""); onNotice("ok", "Passkey added. Now use “Test sign-in” to confirm it works.") }) }
  const test = () => run("test", async () => { const used = await testPasskey(); onNotice("ok", `Passkey “${used}” works.`) })
  const remove = async (item: Summary) => {
    if (!(await confirm({ title: `Remove “${item.name}”?`, body: "That device can no longer sign in to the admin.", confirmLabel: "Remove passkey", danger: true }))) return
    void run("remove", async () => { await api("/api/admin/passkey", { method: "POST", body: { action: "remove", id: item.id } }); onNotice("ok", "Passkey removed.") })
  }
  const makeCodes = async () => {
    if (status && status.recoveryRemaining > 0 && !(await confirm({ title: "Replace your recovery codes?", body: "The old codes stop working immediately.", confirmLabel: "Generate new codes" }))) return
    void run("codes", async () => { const r = await api<{ recoveryCodes: string[] }>("/api/admin/passkey", { method: "POST", body: { action: "recovery-codes" } }); setCodes(r.recoveryCodes); setSaved(false) })
  }
  const policy = async (enabled: boolean) => {
    const ok = await confirm(enabled
      ? { title: "Turn off password sign-in?", body: "From now on only passkeys (and your recovery codes) can sign in to the admin. Passwords and authenticator codes stop working. You can turn it back on here.", confirmLabel: "Yes, passkey-only", danger: true }
      : { title: "Turn password sign-in back on?", body: "Password (and authenticator code, if set) will work again next to passkeys.", confirmLabel: "Turn on" })
    if (ok) void run("policy", async () => { await api("/api/admin/passkey", { method: "POST", body: { action: "policy", enabled } }); onNotice("ok", enabled ? "Passkey-only sign-in is on." : "Password sign-in is available again.") })
  }
  async function copy(text: string) { try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 2000) } catch { onNotice("error", "Could not copy. Select the text and copy it by hand.") } }
  function download(list: string[]) {
    const url = URL.createObjectURL(new Blob([`Portfolio Admin — passkey recovery codes\nEach code works once. Keep them somewhere safe and private.\n\n${list.join("\n")}\n`], { type: "text/plain" }))
    const a = document.createElement("a"); a.href = url; a.download = "portfolio-admin-passkey-recovery-codes.txt"; a.click(); URL.revokeObjectURL(url)
  }

  const recent = status?.session.recent ?? true
  const disabled = !!busy || !supported || !!status?.configError
  const r = status?.requirements
  const check = (ok: boolean, text: string) => <li data-ok={ok}>{ok ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}{text}</li>

  return (
    <section className="adm-group adm-pkm" aria-labelledby="adm-pk-title">
      <h3 id="adm-pk-title"><Fingerprint aria-hidden="true" /> Passkeys — passwordless sign-in</h3>
      {!status && !loadError && <p className="adm-hint"><Loader2 className="adm-spin" aria-hidden="true" /> Loading…</p>}
      {loadError && <p className="adm-error" role="alert">{loadError} <button type="button" className="adm-btn" onClick={() => void load()}>Try again</button></p>}

      {status && (
        <>
          {status.configError && <p className="adm-error" role="alert">{status.configError}</p>}
          {!supported && <p className="adm-error" role="alert">This browser does not support passkeys. Open the admin in a current Safari, Chrome, Edge or Firefox.</p>}
          {!recent && <p className="adm-pkm-banner" role="status">For safety, adding or removing passkeys, recovery codes and the passkey-only switch need a sign-in from the last 15 minutes. Sign out and sign in again to change them.</p>}
          {status.session.method === "recovery" && <p className="adm-pkm-banner" role="status">You signed in with a recovery code. Add a new passkey now.</p>}

          <p className="adm-note">Sign in with Touch ID, Face ID, Windows Hello or a phone — no password to steal or phish. Register at least two devices so losing one never locks you out.{status.rpID && <> Passkeys are bound to <code>{status.rpID}</code>.</>}</p>

          <div className="adm-pkm-list" aria-label="Registered passkeys">
            {status.passkeys.length === 0 && <p className="adm-hint">No passkey yet. Add your first one below.</p>}
            {status.passkeys.map((item) => (
              <div className="adm-pkm-item" key={item.id}>
                <Fingerprint aria-hidden="true" />
                <div className="adm-pkm-meta"><strong>{item.name}</strong>
                  <span>{item.backedUp ? "Synced passkey" : "This device only"} · added {date(item.createdAt)} · {item.lastUsedAt ? `last used ${date(item.lastUsedAt)}` : "never used"}</span></div>
                <button type="button" className="adm-btn adm-btn-ghost" disabled={disabled || !recent} onClick={() => void remove(item)}>Remove</button>
              </div>
            ))}
          </div>

          {status.passkeys.length < status.max && (
            <form className="adm-pkm-add" onSubmit={add}>
              <label className="adm-field"><span className="adm-label">Name this passkey (optional)</span>
                <input className="adm-input" value={name} maxLength={40} placeholder="e.g. MacBook Touch ID" onChange={(e) => setName(e.target.value)} /></label>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={disabled || !recent}>{busy === "add" ? <Loader2 className="adm-spin" aria-hidden="true" /> : <Fingerprint aria-hidden="true" />}Add a passkey</button>
            </form>
          )}
          {status.passkeys.length === 1 && !status.passwordlessOnly && <p className="adm-note">Tip: add a second passkey (another device) as a backup.</p>}

          {status.passkeys.length > 0 && (
            <div className="adm-2fa-actions">
              <button type="button" className="adm-btn" disabled={disabled} onClick={() => void test()}>{busy === "test" ? <Loader2 className="adm-spin" aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}Test sign-in</button>
            </div>
          )}

          <p className="adm-pkm-sub">Recovery codes</p>
          <p className="adm-note">{status.recoveryRemaining > 0 ? `${status.recoveryRemaining} recovery code${status.recoveryRemaining === 1 ? "" : "s"} left (generated ${date(status.recoveryAt)}).` : "None yet. They are how you get back in if every passkey is lost."}</p>
          {codes ? (
            <div className="adm-2fa-codes">
              <p className="adm-note"><b>Shown only once.</b> Each code signs you in a single time. Store them in a password manager or print them.</p>
              <ul className="adm-2fa-grid" aria-label="Recovery codes">{codes.map((c) => <li key={c} className="adm-mono">{c}</li>)}</ul>
              <div className="adm-2fa-actions">
                <button type="button" className="adm-btn" onClick={() => void copy(codes.join("\n"))}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? "Copied" : "Copy all"}</button>
                <button type="button" className="adm-btn" onClick={() => download(codes)}><Download aria-hidden="true" />Download .txt</button>
              </div>
              <label className="adm-2fa-saved"><input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} /> I saved these codes in a safe place</label>
              <button type="button" className="adm-btn adm-btn-primary" disabled={!saved} onClick={() => setCodes(null)}>Done</button>
            </div>
          ) : (
            <div className="adm-2fa-actions">
              <button type="button" className="adm-btn" disabled={disabled || !recent || status.passkeys.length === 0} onClick={() => void makeCodes()}>{busy === "codes" ? <Loader2 className="adm-spin" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}{status.recoveryRemaining > 0 ? "New recovery codes" : "Generate recovery codes"}</button>
            </div>
          )}

          <p className="adm-pkm-sub">Passkey-only sign-in</p>
          {status.passwordlessOnly ? (
            <>
              <p className="adm-2fa-state" data-on="true"><ShieldCheck aria-hidden="true" /> On{status.passwordlessSince ? ` since ${date(status.passwordlessSince)}` : ""}. Password and authenticator-code sign-in are disabled.</p>
              <div className="adm-2fa-actions"><button type="button" className="adm-btn adm-btn-ghost" disabled={disabled || !recent} onClick={() => void policy(false)}><ShieldOff aria-hidden="true" />Turn password sign-in back on</button></div>
            </>
          ) : (
            <>
              <p className="adm-note">Password sign-in keeps working until you switch this on. It needs:</p>
              <ul className="adm-pkm-checks">
                {check(!!r?.hasPasskey, "At least one passkey registered")}
                {check(!!r?.tested, "A passkey used successfully (use “Test sign-in”)")}
                {check(!!r?.hasRecovery, "Recovery codes generated and saved")}
                {check((status?.passkeys.length ?? 0) >= 2, "A second passkey as a backup (recommended)")}
              </ul>
              <div className="adm-2fa-actions"><button type="button" className="adm-btn adm-btn-danger" disabled={disabled || !recent || !(r?.hasPasskey && r.tested && r.hasRecovery)} onClick={() => void policy(true)}>{busy === "policy" && <Loader2 className="adm-spin" aria-hidden="true" />}Turn off password sign-in</button></div>
            </>
          )}
          {error && <p className="adm-error" role="alert">{error}</p>}
        </>
      )}
    </section>
  )
}
