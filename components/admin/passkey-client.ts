import { startAuthentication, startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser"
import { ApiError, api } from "@/components/admin/api"

type AuthOptions = Parameters<typeof startAuthentication>[0]["optionsJSON"]
type RegOptions = Parameters<typeof startRegistration>[0]["optionsJSON"]

export const passkeysSupported = () => typeof window !== "undefined" && browserSupportsWebAuthn()

/** Turns the browser's / library's errors into something a person can act on. */
export function passkeyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  const e = error as { name?: string; code?: string; cause?: { name?: string } } | null
  const name = e?.cause?.name || e?.name
  if (name === "NotAllowedError" || e?.code === "ERROR_CEREMONY_ABORTED") return "The passkey prompt was cancelled or timed out. Try again."
  if (name === "InvalidStateError" || e?.code === "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED") return "This device already has a passkey for this site."
  if (name === "SecurityError") return "This page's address does not match the passkey settings (check SITE_URL)."
  return "Could not use a passkey on this device."
}

/** Sign in. `crossDevice` asks the browser to go straight to “use a phone / another device” (it shows its own short-lived QR code). */
export async function signInWithPasskey(crossDevice = false): Promise<void> {
  const optionsJSON = await api<AuthOptions>("/api/admin/passkey/login", { method: "POST", body: { action: "options", crossDevice } })
  const response = await startAuthentication({ optionsJSON })
  await api("/api/admin/passkey/login", { method: "POST", body: { action: "verify", response } })
}

export async function signInWithRecoveryCode(code: string): Promise<number> {
  return (await api<{ recoveryRemaining: number }>("/api/admin/passkey/login", { method: "POST", body: { action: "recovery", code } })).recoveryRemaining
}

export async function registerPasskey(name: string): Promise<void> {
  const optionsJSON = await api<RegOptions>("/api/admin/passkey", { method: "POST", body: { action: "register-options" } })
  const response = await startRegistration({ optionsJSON })
  await api("/api/admin/passkey", { method: "POST", body: { action: "register-verify", response, name } })
}

/** Proves a registered passkey really works (needed before passkey-only sign-in can be switched on). */
export async function testPasskey(): Promise<string> {
  const optionsJSON = await api<AuthOptions>("/api/admin/passkey", { method: "POST", body: { action: "test-options" } })
  const response = await startAuthentication({ optionsJSON })
  return (await api<{ name: string }>("/api/admin/passkey", { method: "POST", body: { action: "test-verify", response } })).name
}
