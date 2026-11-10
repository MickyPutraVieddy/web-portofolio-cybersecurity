"use client"

import { useEffect, useMemo, type ReactNode } from "react"
import useSWR, { SWRConfig } from "swr"
import { useContent } from "@/components/content-provider"
import type { Locale, PortfolioPreferences } from "@/lib/portfolio-types"

const preferencesKey = "portfolio-ui-preferences"
const defaults: PortfolioPreferences = {
  locale: "en", paused: false, reducedMotion: false,
  hidden: false, hydrated: false, introComplete: false,
}

export function usePortfolio() {
  const { copy } = useContent()
  const { data, mutate } = useSWR<PortfolioPreferences>(preferencesKey, null)
  const preferences = data ?? defaults

  function update(values: Partial<PortfolioPreferences>) {
    void mutate((current) => ({ ...(current ?? defaults), ...values }), { revalidate: false })
  }

  function setLocale(locale: Locale) {
    if (locale === preferences.locale) return
    const security = window.location.protocol === "https:"
      ? "; SameSite=None; Secure; Partitioned"
      : "; SameSite=Lax"
    document.cookie = `portfolio-language=${locale}; Path=/; Max-Age=31536000${security}`
    update({ locale, introComplete: true })
  }

  return {
    ...preferences,
    t: copy[preferences.locale],
    motionEnabled: !preferences.paused && !preferences.reducedMotion && !preferences.hidden,
    setLocale,
    update,
  }
}

function PreferenceEffects() {
  const { locale, update } = usePortfolio()
  const { copy } = useContent()

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotion = () => update({ reducedMotion: media.matches, ...(media.matches ? { introComplete: true } : {}) })
    const syncVisibility = () => update({ hidden: document.hidden })
    update({ hydrated: true, reducedMotion: media.matches, hidden: document.hidden })
    syncMotion()
    const timeout = window.setTimeout(() => update({ introComplete: true }), 4200)
    media.addEventListener("change", syncMotion)
    document.addEventListener("visibilitychange", syncVisibility)
    return () => {
      window.clearTimeout(timeout)
      media.removeEventListener("change", syncMotion)
      document.removeEventListener("visibilitychange", syncVisibility)
    }
    // This subscription owns the lifetime of the page, not each preference update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = copy[locale].title
    const values = [
      ['meta[name="description"]', copy[locale].metaDescription],
      ['meta[property="og:title"]', copy[locale].title],
      ['meta[property="og:description"]', copy[locale].metaDescription],
      ['meta[name="twitter:title"]', copy[locale].title],
      ['meta[name="twitter:description"]', copy[locale].metaDescription],
      ['meta[property="og:locale"]', locale === "en" ? "en_US" : "id_ID"],
    ]
    for (const [selector, content] of values) {
      document.querySelector(selector)?.setAttribute("content", content)
    }
  }, [locale, copy])

  return null
}

export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const configuration = useMemo(() => ({
    provider: () => new Map(),
    fallback: { [preferencesKey]: { ...defaults, locale: initialLocale } },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  }), [initialLocale])

  return (
    <SWRConfig value={configuration}>
      <PreferenceEffects />
      {children}
    </SWRConfig>
  )
}
