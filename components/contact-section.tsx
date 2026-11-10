"use client"

import { useId, useRef, useState, type ChangeEvent, type CSSProperties, type FormEvent } from "react"
import { AlertCircle, CheckCircle2, ExternalLink, Mail, Send } from "lucide-react"
import { SocialIcon, platformName } from "@/components/social-icon"
import { SectionHeading } from "@/components/section-heading"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { useInView } from "@/components/use-in-view"
import { contactFields, contactLimits, validateContact, type ContactErrorCode, type ContactErrors, type ContactField, type ContactInput } from "@/lib/contact"

type Failure = "invalid" | "not-configured" | "rate" | "delivery" | "network"
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "error"; failure: Failure }
const EMPTY: ContactInput = { name: "", email: "", subject: "", message: "" }
const KNOWN_CODES: ContactErrorCode[] = ["required", "too-short", "too-long", "invalid-email", "invalid-chars"]

function ContactFormPanel({ email }: { email: string }) {
  const { t } = usePortfolio()
  const uid = useId()
  const [values, setValues] = useState<ContactInput>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const refs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const sending = status.kind === "sending"

  const label: Record<ContactField, string> = { name: t.cfName, email: t.cfEmail, subject: t.cfSubject, message: t.cfMessage }
  const placeholder: Record<ContactField, string> = { name: t.cfNamePlaceholder, email: t.cfEmailPlaceholder, subject: t.cfSubjectPlaceholder, message: t.cfMessagePlaceholder }
  const maxLength: Record<ContactField, number> = { name: contactLimits.name, email: contactLimits.email, subject: contactLimits.subject, message: contactLimits.messageMax }
  const message: Record<ContactErrorCode, string> = {
    required: t.cfErrRequired, "too-short": t.cfErrTooShort, "too-long": t.cfErrTooLong, "invalid-email": t.cfErrInvalidEmail, "invalid-chars": t.cfErrInvalidChars,
  }
  const failureText: Record<Failure, string> = {
    invalid: t.cfFixErrors, "not-configured": t.cfErrNotConfigured, rate: t.cfErrRate, delivery: t.cfErrDelivery, network: t.cfErrNetwork,
  }

  const setField = (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value }
    setValues(next)
    // Re-check a field that is already showing an error, so it clears as soon as it becomes valid.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateContact(next)[field] }))
  }
  const blurField = (field: ContactField) => () => {
    if (values[field] === "" && !errors[field]) return // do not nag about fields the visitor has not touched
    setErrors((current) => ({ ...current, [field]: validateContact(values)[field] }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (sending) return
    const found = validateContact(values)
    setErrors(found)
    const first = contactFields.find((field) => found[field])
    if (first) { setStatus({ kind: "error", failure: "invalid" }); refs.current[first]?.focus(); return }

    setStatus({ kind: "sending" })
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, website: honeypot }) })
      const body = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; fields?: Record<string, string> } | null
      // Success is shown ONLY when the server confirmed it.
      if (response.ok && body?.ok === true) { setValues(EMPTY); setErrors({}); setHoneypot(""); setStatus({ kind: "success" }); return }
      if (response.status === 422 && body?.fields) {
        const server: ContactErrors = {}
        for (const field of contactFields) { const code = body.fields[field] as ContactErrorCode | undefined; if (code && KNOWN_CODES.includes(code)) server[field] = code }
        setErrors(server); setStatus({ kind: "error", failure: "invalid" }); return
      }
      setStatus({ kind: "error", failure: response.status === 429 ? "rate" : response.status === 503 ? "not-configured" : "delivery" })
    } catch {
      setStatus({ kind: "error", failure: "network" }) // the text stays in the form
    }
  }

  if (status.kind === "success") {
    return (
      <div className="ct-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <h4>{t.cfSuccessTitle}</h4>
        <p>{t.cfSuccessBody}</p>
        <button type="button" className="ct-secondary" onClick={() => setStatus({ kind: "idle" })}>{t.cfSendAnother}</button>
      </div>
    )
  }

  return (
    <form className="ct-form" onSubmit={submit} noValidate aria-busy={sending}>
      {contactFields.map((field) => {
        const id = `${uid}-${field}`
        const error = errors[field]
        const common = {
          id, name: field, value: values[field], onBlur: blurField(field), placeholder: placeholder[field], maxLength: maxLength[field],
          required: true, readOnly: sending, "aria-required": "true" as const, "aria-invalid": error ? ("true" as const) : undefined,
          "aria-describedby": error ? `${id}-err` : undefined, autoComplete: field === "name" ? "name" : field === "email" ? "email" : "off",
        }
        return (
          <div className="ct-field" key={field} data-field={field}>
            <label htmlFor={id}>{label[field]}</label>
            {field === "message"
              ? <textarea {...common} rows={6} onChange={setField(field)} ref={(node) => { refs.current.message = node }} />
              : <input {...common} type={field === "email" ? "email" : "text"} onChange={setField(field)} ref={(node) => { refs.current[field] = node }} />}
            {field === "message" && <span className="ct-count" aria-hidden="true">{values.message.length}/{contactLimits.messageMax}</span>}
            {error && <p className="ct-error" id={`${id}-err`}>{message[error]}</p>}
          </div>
        )
      })}

      {/* Honeypot: invisible to people, tempting to bots. Anything typed here makes the server discard the message. */}
      <div className="ct-hp" aria-hidden="true">
        <label>{t.cfHoneypot}<input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label>
      </div>

      {status.kind === "error" && (
        <div className="ct-alert" role="alert">
          <AlertCircle aria-hidden="true" />
          <div>
            <p>{failureText[status.failure]}</p>
            {email && status.failure !== "invalid" && <a href={`mailto:${email}`}>{t.cfErrFallback}</a>}
          </div>
        </div>
      )}

      <button type="submit" className="ct-submit" disabled={sending}>
        <Send aria-hidden="true" />{sending ? t.cfSending : t.cfSend}
      </button>
      <p className="ct-privacy">{t.cfPrivacy}</p>
    </form>
  )
}

export function ContactSection() {
  const { t, locale } = usePortfolio()
  const { contact } = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.1)
  const email = contact.email.trim()
  // A link without a URL, or one switched off, is never shown.
  const socials = contact.socials.filter((item) => item.visible && item.url.trim())

  return (
    <section id="contact" className="page-section" aria-labelledby="contact-title">
      <div className="portfolio-container">
        <SectionHeading id="contact-title" index="11" label={t.contactLabel} file={t.contactFile} title={t.contactTitle} />
        <p className="cert-intro">{t.contactIntro}</p>

        <div ref={ref} data-seen={seen} className="ct-grid">
          <div className="ct-side">
            {email && (
              <div className="ct-card">
                <h3>{t.contactEmailTitle}</h3>
                <a className="ct-email" href={`mailto:${email}`}><Mail aria-hidden="true" /><span>{email}</span></a>
                <a className="cert-link ct-mailto" href={`mailto:${email}`}>{t.contactEmailAction}</a>
              </div>
            )}
            {socials.length > 0 && (
              <div className="ct-card">
                <h3>{t.contactLinksTitle}</h3>
                <ul className="ct-socials">
                  {socials.map((item, i) => {
                    const name = platformName(item.platform)
                    const title = item.label.trim() || name || item.url
                    const note = item.description[locale]
                    return (
                      <li key={item.id} style={{ "--i": i } as CSSProperties}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <span className="ct-icon" aria-hidden="true"><SocialIcon platform={item.platform} icon={item.icon} tinted /></span>
                          <span className="ct-social-text">
                            <strong>{title}</strong>
                            <span>{name && item.label.trim() ? name : ""}{note ? `${name && item.label.trim() ? " · " : ""}${note}` : ""}</span>
                          </span>
                          <ExternalLink className="ct-out" aria-hidden="true" />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {!email && socials.length === 0 && <p className="ct-none">{t.contactNoLinks}</p>}
          </div>

          <div className="ct-card ct-formcard">
            <h3>{t.contactFormTitle}</h3>
            <ContactFormPanel email={email} />
          </div>
        </div>
      </div>
    </section>
  )
}
