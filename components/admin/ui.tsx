"use client"

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { AlertTriangle, ArrowDown, ArrowUp, ImageIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react"
import { ApiError, uploadImage } from "@/components/admin/api"

// ---- confirmation dialog (used before every save / delete / restore) ------------------
interface ConfirmOptions { title: string; body?: ReactNode; confirmLabel?: string; danger?: boolean }
const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(async () => false)
export const useConfirm = () => useContext(ConfirmContext)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ options: ConfirmOptions; resolve: (value: boolean) => void } | null>(null)
  const ask = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => setState({ options, resolve })), [])
  const close = (value: boolean) => { state?.resolve(value); setState(null) }
  return (
    <ConfirmContext.Provider value={ask}>
      {children}
      {state && (
        <div className="adm-modal" role="alertdialog" aria-modal="true" aria-labelledby="adm-confirm-title" onKeyDown={(event) => { if (event.key === "Escape") close(false) }}>
          <div className="adm-modal-card" data-danger={state.options.danger ? "true" : undefined}>
            <div className="adm-modal-icon"><AlertTriangle aria-hidden="true" /></div>
            <h2 id="adm-confirm-title">{state.options.title}</h2>
            {state.options.body && <div className="adm-modal-body">{state.options.body}</div>}
            <div className="adm-modal-actions">
              <button type="button" className="adm-btn" autoFocus onClick={() => close(false)}>Cancel</button>
              <button type="button" className={state.options.danger ? "adm-btn adm-btn-danger" : "adm-btn adm-btn-primary"} onClick={() => close(true)}>{state.options.confirmLabel || "Yes, continue"}</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

// ---- form fields ---------------------------------------------------------------------
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="adm-field"><span className="adm-label">{label}</span>{children}{hint && <span className="adm-hint">{hint}</span>}</label>
}

export function TextField({ label, value, onChange, max = 200, hint, placeholder, mono }: { label: string; value: string; onChange: (value: string) => void; max?: number; hint?: string; placeholder?: string; mono?: boolean }) {
  return <Field label={label} hint={hint}><input className={mono ? "adm-input adm-mono" : "adm-input"} value={value} maxLength={max} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></Field>
}

export function AreaField({ label, value, onChange, max = 1000, rows = 4, hint }: { label: string; value: string; onChange: (value: string) => void; max?: number; rows?: number; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className="adm-input" rows={rows} value={value} maxLength={max} onChange={(event) => onChange(event.target.value)} />
      <span className="adm-count">{value.length}/{max}</span>
    </Field>
  )
}

/** One item per line — used for lists of short strings (bullet points, credentials, ...). */
export function LinesField({ label, value, onChange, max = 240, rows = 4, hint }: { label: string; value: string[]; onChange: (value: string[]) => void; max?: number; rows?: number; hint?: string }) {
  return (
    <Field label={label} hint={hint ?? "One item per line"}>
      <textarea className="adm-input" rows={rows} value={value.join("\n")} onChange={(event) => onChange(event.target.value.split("\n").map((line) => line.slice(0, max)))} />
    </Field>
  )
}

export function Toggle({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} className="adm-toggle" onClick={() => onChange(!checked)}>
      <span className="adm-toggle-knob" />
    </button>
  )
}

export function ImageField({ label, value, onChange, hint }: { label: string; value: string | null; onChange: (value: string | null) => void; hint?: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const confirm = useConfirm()

  async function pick(file?: File) {
    if (!file) return
    setBusy(true); setError("")
    try { onChange(await uploadImage(file)) }
    catch (e) { setError(e instanceof ApiError ? (e.data.issues?.[0]?.message || e.message) : "Upload failed") }
    finally { setBusy(false); if (input.current) input.current.value = "" }
  }
  async function remove() {
    if (await confirm({ title: "Remove this image?", body: "The image is detached from the page. You can still discard the change before saving.", confirmLabel: "Remove", danger: true })) onChange(null)
  }
  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div className="adm-image">
        <div className="adm-image-preview">{value ? <img src={value} alt="" /> : <ImageIcon aria-hidden="true" />}</div>
        <div className="adm-image-actions">
          <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => pick(event.target.files?.[0])} />
          <button type="button" className="adm-btn" disabled={busy} onClick={() => input.current?.click()}>{busy ? <Loader2 className="adm-spin" aria-hidden="true" /> : <Upload aria-hidden="true" />}Upload</button>
          {value && <button type="button" className="adm-btn adm-btn-ghost" onClick={remove}><X aria-hidden="true" />Remove</button>}
        </div>
      </div>
      <span className="adm-hint">{error || hint || "PNG, JPEG or WebP, up to 700 KB"}</span>
    </div>
  )
}

// ---- lists: add / reorder / delete ----------------------------------------------------
export function ItemCard({ title, index, count, onMove, onDelete, deleteLabel, children }: { title: string; index: number; count: number; onMove: (from: number, to: number) => void; onDelete: () => void; deleteLabel?: string; children: ReactNode }) {
  const confirm = useConfirm()
  async function remove() {
    if (await confirm({ title: `Delete “${title || "this item"}”?`, body: deleteLabel || "It is removed from every language. You can still discard the change before saving.", confirmLabel: "Delete", danger: true })) onDelete()
  }
  return (
    <fieldset className="adm-card">
      <legend><span className="adm-mono">#{index + 1}</span> {title || "Untitled"}</legend>
      <div className="adm-card-tools">
        <button type="button" className="adm-icon" aria-label="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)}><ArrowUp aria-hidden="true" /></button>
        <button type="button" className="adm-icon" aria-label="Move down" disabled={index === count - 1} onClick={() => onMove(index, index + 1)}><ArrowDown aria-hidden="true" /></button>
        <button type="button" className="adm-icon adm-icon-danger" aria-label="Delete" onClick={remove}><Trash2 aria-hidden="true" /></button>
      </div>
      <div className="adm-grid">{children}</div>
    </fieldset>
  )
}

export function AddButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" className="adm-btn adm-btn-add" disabled={disabled} onClick={onClick}><Plus aria-hidden="true" />{label}</button>
}

export function Group({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  return <section className="adm-group"><h3>{title}</h3>{note && <p className="adm-note">{note}</p>}<div className="adm-grid">{children}</div></section>
}

/** Native select styled like the other admin inputs. */
export function SelectField<T extends string>({ label, value, onChange, options, hint }: { label: string; value: T; onChange: (value: T) => void; options: { value: T; label: string }[]; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <select className="adm-input" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </Field>
  )
}

/** Four-digit year or empty (null). Digits only; range is enforced by the server schema and flagged in the editor. */
export function YearField({ label, value, onChange, hint }: { label: string; value: number | null; onChange: (value: number | null) => void; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <input className="adm-input adm-mono" inputMode="numeric" placeholder="YYYY" maxLength={4} value={value ?? ""}
        onChange={(event) => { const raw = event.target.value.replace(/\D/g, "").slice(0, 4); onChange(raw === "" ? null : Number(raw)) }} />
    </Field>
  )
}

/** Labelled on/off switch for a boolean field. */
export function SwitchField({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (value: boolean) => void; hint?: string }) {
  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div className="adm-switch-row"><Toggle label={label} checked={checked} onChange={onChange} /><span className="adm-hint">{checked ? "On" : "Off"}{hint ? ` — ${hint}` : ""}</span></div>
    </div>
  )
}

/** Informative empty state for admin collections. Never blurred; always offers the Add action. */
export function AdminEmpty({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return <div className="adm-empty"><strong>{title}</strong><p>{body}</p>{children}</div>
}
