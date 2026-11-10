/**
 * Contact-form rules shared by the browser (instant feedback) and the server (the authority).
 * No imports, so it is safe in both places. The server always re-validates; the client copy is only for UX.
 */
export const contactLimits = { name: 100, email: 254, subject: 150, messageMin: 10, messageMax: 5000 } as const

export type ContactField = "name" | "email" | "subject" | "message"
export type ContactErrorCode = "required" | "too-short" | "too-long" | "invalid-email" | "invalid-chars"
export type ContactInput = Record<ContactField, string>
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>

export const contactFields: ContactField[] = ["name", "email", "subject", "message"]

const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/
export const isValidEmail = (value: string): boolean => value.length <= contactLimits.email && EMAIL.test(value)

/** Single-line fields must not contain any control character (blocks CR/LF header injection) or line separators. */
// eslint-disable-next-line no-control-regex
const SINGLE_LINE_BAD = /[\u0000-\u001F\u007F\u2028\u2029]/
/** The message may contain line breaks and tabs, but no other control characters. */
// eslint-disable-next-line no-control-regex
const MESSAGE_BAD = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {}
  const name = input.name.trim(), email = input.email.trim(), subject = input.subject.trim(), message = input.message.trim()

  if (!name) errors.name = "required"
  else if (name.length > contactLimits.name) errors.name = "too-long"
  else if (SINGLE_LINE_BAD.test(name)) errors.name = "invalid-chars"

  if (!email) errors.email = "required"
  else if (SINGLE_LINE_BAD.test(email)) errors.email = "invalid-chars"
  else if (!isValidEmail(email)) errors.email = email.length > contactLimits.email ? "too-long" : "invalid-email"

  if (!subject) errors.subject = "required"
  else if (subject.length > contactLimits.subject) errors.subject = "too-long"
  else if (SINGLE_LINE_BAD.test(subject)) errors.subject = "invalid-chars"

  if (!message) errors.message = "required"
  else if (message.length < contactLimits.messageMin) errors.message = "too-short"
  else if (message.length > contactLimits.messageMax) errors.message = "too-long"
  else if (MESSAGE_BAD.test(message)) errors.message = "invalid-chars"

  return errors
}

/** Trimmed copy of a validated input. */
export const cleanContact = (input: ContactInput): ContactInput => ({
  name: input.name.trim(), email: input.email.trim(), subject: input.subject.trim(), message: input.message.trim(),
})

/** Reads an untrusted JSON body. Anything that is not a string becomes "" (and then fails as "required"). */
export function readContactBody(raw: unknown): { values: ContactInput; honeypot: string } | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null
  const body = raw as Record<string, unknown>
  const text = (key: string) => (typeof body[key] === "string" ? (body[key] as string) : "")
  return { values: { name: text("name"), email: text("email"), subject: text("subject"), message: text("message") }, honeypot: text("website") }
}
