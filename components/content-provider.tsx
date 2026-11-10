"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { SiteContent } from "@/lib/content-schema"

const ContentContext = createContext<SiteContent | null>(null)

/** postMessage target: this site's origin; "*" only for opaque origins (file://, sandboxes), where source checks still apply. */
const targetOrigin = () => (/^https?:$/.test(window.location.protocol) ? window.location.origin : "*")
const trustedOrigin = (origin: string) => (/^https?:$/.test(window.location.protocol) ? origin === window.location.origin : origin === "null" || origin === window.location.origin)

export function useContent(): SiteContent {
  const content = useContext(ContentContext)
  if (!content) throw new Error("useContent must be used inside <ContentProvider>")
  return content
}

/** Renders children against a specific content document (the admin editor uses it so previews follow the unsaved draft). No side effects. */
export function ContentScope({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

/**
 * Serves the site content. Inside the admin preview iframe (`?preview=1`) it also accepts
 * draft content from its same-origin parent window, so edits show up live before they are saved.
 */
export function ContentProvider({ initial, children }: { initial: SiteContent; children: ReactNode }) {
  const [content, setContent] = useState(initial)

  useEffect(() => setContent(initial), [initial])

  useEffect(() => {
    const palettes = {
      blue: ["#55aaff", "#338cff"],
      red: ["#ff647c", "#dc365f"],
      purple: ["#b58cff", "#8957e8"],
      general: ["#45d6c0", "#229f91"],
      custom: [content.appearance.accentColor, content.appearance.secondaryColor],
    } as const
    const selected = palettes[content.appearance.preset]
    const toHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255
      const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
      const light = (max + min) / 2
      let h = 0, sat = 0
      if (d) {
        sat = d / (1 - Math.abs(2 * light - 1))
        switch (max) { case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: h = ((b - r) / d + 2) / 6; break; default: h = ((r - g) / d + 4) / 6 }
      }
      return `${Math.round(h * 360)} ${Math.round(sat * 100)}% ${Math.round(light * 100)}%`
    }
    const toRgb = (hex: string) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16)).join(", ")
    const root = document.documentElement
    const fontTarget = document.body
    const glowFactor = Math.max(0, Math.min(1, content.appearance.glow / 100))
    const cursorIntensityFactor = content.appearance.cursorEffect
      ? Math.max(0, Math.min(1, content.appearance.cursorIntensity / 100))
      : 0
    root.style.setProperty("--primary", toHsl(selected[0]))
    root.style.setProperty("--electric", toHsl(selected[1]))
    root.style.setProperty("--ring", toHsl(selected[0]))
    root.style.setProperty("--cyan", toHsl(selected[1]))
    root.style.setProperty("--glow-rgb", toRgb(selected[0]))
    root.style.setProperty("--theme-accent-rgb", toRgb(selected[0]))
    root.style.setProperty("--theme-secondary-rgb", toRgb(selected[1]))
    root.style.setProperty("--theme-glow-strength", String(content.appearance.glow))
    root.style.setProperty("--theme-glow-factor", String(glowFactor))
    root.style.setProperty("--theme-glow-size", `${Math.round(26 * glowFactor)}px`)
    root.style.setProperty("--theme-glow-blur", `${Math.round(22 * glowFactor)}px`)
    root.style.setProperty("--theme-glow-opacity", String(glowFactor))
    // Cursor feedback has its own independent control; never derive it from the global glow slider.
    root.style.setProperty("--cursor-intensity-factor", String(cursorIntensityFactor))
    root.style.setProperty("--cursor-glow-size", `${Math.round(18 * cursorIntensityFactor)}px`)
    root.style.setProperty("--cursor-glow-opacity", String(cursorIntensityFactor))
    root.dataset.cursorEffect = cursorIntensityFactor > 0 ? "on" : "off"
    const fontStacks = { inter: "var(--font-inter), Inter, sans-serif", "plex-mono": "var(--font-mono), monospace", system: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }
    // Next/font variables are declared on <body>; apply dependent stacks there so var() resolves.
    fontTarget.style.setProperty("--portfolio-heading-font", fontStacks[content.appearance.headingFont])
    fontTarget.style.setProperty("--portfolio-body-font", fontStacks[content.appearance.bodyFont])
    fontTarget.style.setProperty("--portfolio-mono-font", fontStacks[content.appearance.monoFont])
    fontTarget.style.setProperty("--portfolio-heading-weight", content.appearance.headingWeight)
  }, [content.appearance])

  useEffect(() => {
    if (window.parent === window || new URLSearchParams(window.location.search).get("preview") !== "1") return
    function onMessage(event: MessageEvent) {
      if (!trustedOrigin(event.origin) || event.source !== window.parent) return
      const data = event.data as { type?: string; content?: SiteContent; scrollTo?: string }
      if (data?.type === "draft-content" && data.content) setContent(data.content)
      if (data?.type === "scroll-to" && data.scrollTo) document.getElementById(data.scrollTo)?.scrollIntoView({ behavior: "smooth" })
    }
    window.addEventListener("message", onMessage)
    window.parent.postMessage({ type: "preview-ready" }, targetOrigin())
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}
