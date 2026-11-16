"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Sends ONE tiny same-origin request per page view to /api/hit (the path, plus where the visitor came from on the first view — no cookies are set, nothing is stored in the browser,
 * nothing is read from it except an opt-out flag). Skipped on /admin, inside the admin live preview (iframe / ?preview=1) and when
 * the owner has set the opt-out flag:  localStorage.setItem("no-track", "1").
 * Same-origin, so the existing CSP (connect-src 'self') already allows it. The server ignores Do-Not-Track and bots on its own.
 */
let referrerSent = false // document.referrer only describes how the visitor ARRIVED, so it is sent with the first page view of a load, not with in-site navigation

export function VisitBeacon() {
  const pathname = usePathname()
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return
    if (window.self !== window.top || new URLSearchParams(window.location.search).has("preview")) return
    try { if (window.localStorage.getItem("no-track")) return } catch { /* storage blocked: just count the visit */ }
    const body = JSON.stringify({ p: pathname, r: referrerSent ? "" : document.referrer.slice(0, 300) })
    referrerSent = true
    try { if (navigator.sendBeacon?.("/api/hit", new Blob([body], { type: "text/plain" }))) return } catch { /* fall through to fetch */ }
    void fetch("/api/hit", { method: "POST", body, headers: { "Content-Type": "text/plain" }, keepalive: true, credentials: "same-origin" }).catch(() => undefined)
  }, [pathname])
  return null
}
