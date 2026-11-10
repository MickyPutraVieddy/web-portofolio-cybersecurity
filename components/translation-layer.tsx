"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { ContentScope, useContent } from "@/components/content-provider"
import { usePortfolio } from "@/components/language-provider"
import { collectMissing, fillContent, type Dictionary } from "@/lib/translate"

interface Response { translations?: Dictionary; pending?: number; blocked?: boolean }

/**
 * Gives every component the content in the visitor's language. English is the source; the Indonesian side is
 * filled from a shared translation cache (DeepL, see lib/server/translate.ts). Anything not translated yet
 * shows in English and is swapped in as soon as it arrives.
 */
export function TranslationLayer({ initial, children }: { initial: Dictionary; children: ReactNode }) {
  const base = useContent()
  const { locale } = usePortfolio()
  const [dict, setDict] = useState<Dictionary>(initial)
  const busy = useRef(false)

  const missing = useMemo(() => (locale === "id" ? [...collectMissing(base, dict).keys()] : []), [base, dict, locale])
  const content = useMemo(() => fillContent(base, locale === "id" ? dict : {}), [base, dict, locale])

  useEffect(() => {
    if (locale !== "id" || missing.length === 0 || busy.current) return
    let cancelled = false
    busy.current = true
    void (async () => {
      let queue = missing
      for (let round = 0; round < 40 && queue.length && !cancelled; round++) {
        let result: Response
        try {
          const response = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hashes: queue.slice(0, 60) }) })
          if (!response.ok) break
          result = (await response.json()) as Response
        } catch { break }
        const got = result.translations ?? {}
        const gotKeys = Object.keys(got)
        if (gotKeys.length) {
          setDict((current) => ({ ...current, ...got }))
          queue = queue.filter((hash) => !(hash in got))
        }
        // Stop when nothing came back (quota used up, or draft text that is not saved yet) — retry on the next visit.
        if (result.blocked || gotKeys.length === 0) break
      }
      busy.current = false
    })()
    return () => { cancelled = true; busy.current = false }
  }, [locale, missing])

  return <ContentScope content={content}>{children}</ContentScope>
}
