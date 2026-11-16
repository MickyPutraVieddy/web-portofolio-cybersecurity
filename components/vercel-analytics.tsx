"use client"

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next"

/**
 * Vercel Web Analytics (the "Analytics" tab of the Vercel project). It runs next to the built-in counter shown in Admin → Security & history.
 * Same rules as the built-in counter: /admin, the admin live preview and devices that set  localStorage.setItem("no-track", "1")  are not sent.
 * The script is served from this site's own /_vercel/insights path, so the CSP (script-src 'self') already allows it. It only runs on Vercel.
 */
function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    if (new URL(event.url, window.location.origin).pathname.startsWith("/admin")) return null
    if (window.self !== window.top || new URLSearchParams(window.location.search).has("preview")) return null
    if (window.localStorage.getItem("no-track")) return null
  } catch { /* storage blocked or odd URL: send the event */ }
  return event
}

export function VercelAnalytics() {
  return <Analytics beforeSend={beforeSend} />
}
