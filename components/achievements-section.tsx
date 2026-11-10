"use client"

import { useEffect, useId, useMemo, useState, type CSSProperties } from "react"
import { ExternalLink, Search, Trophy } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { ComingSoon } from "@/components/empty-state"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { useInView } from "@/components/use-in-view"
import type { Achievement } from "@/lib/content-schema"

const STEP = 10
type SortKey = "newest" | "oldest" | "name"
/** Undated entries always sort last, in both directions. */
const yearOf = (item: Achievement, missing: number) => item.year ?? missing

export function AchievementsSection() {
  const { t, locale } = usePortfolio()
  const { achievements } = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.1)
  const searchId = useId()

  // Only items marked visible count as published.
  const all = useMemo(() => achievements.items.filter((item) => item.visible), [achievements.items])
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("newest")
  const [limit, setLimit] = useState(STEP)
  useEffect(() => { setLimit(STEP) }, [query, sort])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = all.filter((item) => !q || [item.title, item.issuer, item.description[locale], item.description.en].some((value) => value.toLowerCase().includes(q)))
    return list.sort((a, b) => sort === "name" ? a.title.localeCompare(b.title) : sort === "oldest" ? yearOf(a, Infinity) - yearOf(b, Infinity) || a.title.localeCompare(b.title) : yearOf(b, -Infinity) - yearOf(a, -Infinity) || a.title.localeCompare(b.title))
  }, [all, query, sort, locale])
  const shown = rows.slice(0, limit)
  const latest = all.reduce<number | null>((max, item) => (item.year !== null && (max === null || item.year > max) ? item.year : max), null)

  return (
    <section id="achievements" className="page-section" aria-labelledby="achievements-title">
      <div className="portfolio-container">
        <SectionHeading id="achievements-title" index="09" label={t.achievementsLabel} file={t.achievementsFile} title={t.achievementsTitle} />
        <p className="cert-intro">{t.achievementsIntro}</p>

        {all.length === 0 ? <ComingSoon variant="grid" /> : (
          <div ref={ref} data-seen={seen} className="ach-wrap">
            <dl className="cert-stats">
              <div><dt>{t.achStatTotal}</dt><dd>{all.length}</dd></div>
              {latest !== null && <div><dt>{t.achStatLatest}</dt><dd>{latest}</dd></div>}
            </dl>

            <div className="cert-toolbar">
              <div className="cert-search">
                <Search aria-hidden="true" />
                <label htmlFor={`${searchId}-q`} className="sr-only">{t.achSearch}</label>
                <input id={`${searchId}-q`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.achSearchPlaceholder} maxLength={80} />
              </div>
              <label className="cert-sort"><span>{t.certSort}</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                  <option value="newest">{t.certSortNewest}</option><option value="oldest">{t.certSortOldest}</option><option value="name">{t.certSortName}</option>
                </select>
              </label>
            </div>

            {rows.length === 0 ? <p className="cert-empty">{t.achNoResults}</p> : (
              <>
                <table className="ach-table">
                  <caption className="sr-only">{t.achievementsTitle}</caption>
                  <thead><tr><th scope="col">{t.achColYear}</th><th scope="col">{t.achColTitle}</th><th scope="col">{t.achColDesc}</th><th scope="col">{t.achColProof}</th></tr></thead>
                  <tbody>
                    {shown.map((item, i) => (
                      <tr className="ach-row" key={item.id} style={{ "--i": i } as CSSProperties}>
                        <th scope="row" className="ach-year"><span>{item.year ?? t.achNoYear}</span></th>
                        <td data-label={t.achColTitle} className="ach-title">
                          <span className="ach-title-in"><Trophy aria-hidden="true" /><strong>{item.title}</strong></span>
                          {item.issuer && <span className="ach-issuer">{item.issuer}</span>}
                        </td>
                        <td data-label={t.achColDesc} className="ach-desc">{item.description[locale] || "—"}</td>
                        <td data-label={t.achColProof} className="ach-proof">
                          {item.proofUrl ? <a className="cert-link" href={item.proofUrl} target="_blank" rel="noopener noreferrer">{t.achViewProof}<ExternalLink aria-hidden="true" /></a> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > shown.length && (
                  <button type="button" className="train-more" onClick={() => setLimit((current) => current + STEP)}>{t.achShowMore} ({rows.length - shown.length})</button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
