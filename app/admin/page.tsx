import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AdminApp } from "@/components/admin/admin-app"
import { getSession } from "@/lib/server/auth"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin", robots: { index: false, follow: false } }

export default async function AdminPage() {
  // Server-side gate: no valid session cookie → login. The API re-checks on every call.
  const requestHeaders = await headers()
  const request = new Request("http://localhost/admin", { headers: new Headers(requestHeaders as unknown as Headers) })
  const session = getSession(request)
  if (!session) redirect("/admin/login")
  return <AdminApp user={session.sub} method={session.method} />
}
