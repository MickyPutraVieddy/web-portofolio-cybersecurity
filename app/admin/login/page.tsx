import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/admin/login-form"
import { getSession } from "@/lib/server/auth"
import { loginConfig } from "@/lib/server/handlers"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } }

export default async function LoginPage() {
  // Already signed in → straight to the admin (one redirect, no form flash).
  const requestHeaders = await headers()
  const request = new Request("http://localhost/admin/login", { headers: new Headers(requestHeaders as unknown as Headers) })
  if (getSession(request)) redirect("/admin")
  // The form is drawn on the server with its real configuration, so the fields are in the very first paint.
  // If the configuration cannot be read here, fall back to the old behaviour (the browser asks the API).
  const initialConfig = await loginConfig().catch(() => null)
  return <LoginForm initialConfig={initialConfig} />
}
