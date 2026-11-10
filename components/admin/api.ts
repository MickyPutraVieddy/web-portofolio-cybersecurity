export class ApiError extends Error {
  constructor(public status: number, public data: { error?: string; message?: string; issues?: { path: string; message: string }[] }) {
    super(data.message || data.error || `Request failed (${status})`)
  }
}

/** All admin calls go through here: same-origin cookie session + the custom header the server requires. */
export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown; form?: FormData } = {}): Promise<T> {
  const headers: Record<string, string> = { "X-Requested-With": "admin" }
  if (init.body !== undefined) headers["Content-Type"] = "application/json"
  const response = await fetch(path, {
    method: init.method || "GET", headers, credentials: "same-origin", cache: "no-store",
    body: init.form ?? (init.body !== undefined ? JSON.stringify(init.body) : undefined),
  })
  const data = await response.json().catch(() => ({}))
  if (response.status === 401 && !path.endsWith("/login")) { window.location.href = "/admin/login"; throw new ApiError(401, data) }
  if (!response.ok) throw new ApiError(response.status, data)
  return data as T
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append("file", file)
  return (await api<{ url: string }>("/api/admin/media", { method: "POST", form })).url
}
