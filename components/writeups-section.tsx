"use client"

import { useEffect, useId, useMemo, useState, type CSSProperties } from "react"
import { ExternalLink, FileText, Search } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { ComingSoon } from "@/components/empty-state"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { useInView } from "@/components/use-in-view"
import type { Writeup } from "@/lib/content-schema"

const STEP = 9
type SortKey = "newest" | "oldest" | "name"
/** Undated entries always sort last, in both directions. */
const yearOf = (item: Writeup, missing: number) => item.year ?? missing

export function WriteupsSection() {
  const { t, locale } = usePortfolio()
  const { writeups } = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.1)
  const searchId = useId()

  // Only items marked visible count as published.
  const all = useMemo(() => writeups.items.filter((item) => item.visible), [writeups.items])
  const [tag, setTag] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("newest")
  const [limit, setLimit] = useState(STEP)
  useEffect(() => { setLimit(STEP) }, [tag, query, sort])

  const tags = useMemo(() => Array.from(new Set(all.flatMap((item) => item.tags))).sort((a, b) => a.localeCompare(b)), [all])
  // A tag that no longer exists (after an edit) must not leave the list empty.
  useEffect(() => { if (tag !== "all" && !tags.includes(tag)) setTag("all") }, [tags, tag])
  const blogs = useMemo(() => new Set(all.map((item) => item.blog.trim()).filter(Boolean)).size, [all])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = all.filter((item) =>
      (tag === "all" || item.tags.includes(tag)) &&
      (!q || [item.title, item.blog, item.summary[locale], item.summary.en, ...item.tags].some((value) => value.toLowerCase().includes(q))))
    return list.sort((a, b) => sort === "name" ? a.title.localeCompare(b.title) : sort === "oldest" ? yearOf(a, Infinity) - yearOf(b, Infinity) || a.title.localeCompare(b.title) : yearOf(b, -Infinity) - yearOf(a, -Infinity) || a.title.localeCompare(b.title))
  }, [all, tag, query, sort, locale])
  const shown = rows.slice(0, limit)

  return (
    <section id="writeups" className="page-section" aria-labelledby="writeups-title">
      <div className="portfolio-container">
        <SectionHeading id="writeups-title" index="10" label={t.writeupsLabel} file={t.writeupsFile} title={t.writeupsTitle} />
        <p className="cert-intro">{t.writeupsIntro}</p>

        {all.length === 0 ? <ComingSoon variant="grid" /> : (
          <div ref={ref} data-seen={seen} className="wu-wrap">
            <dl className="cert-stats">
              <div><dt>{t.wuStatTotal}</dt><dd>{all.length}</dd></div>
              {blogs > 0 && <div><dt>{t.wuStatBlogs}</dt><dd>{blogs}</dd></div>}
            </dl>

            <div className="cert-toolbar">
              {tags.length > 0 && (
                <div className="cert-chips" role="group" aria-label={t.wuFilterTag}>
                  <button type="button" aria-pressed={tag === "all"} onClick={() => setTag("all")}>{t.certFilterAll}<span>{all.length}</span></button>
                  {tags.map((name) => <button type="button" key={name} aria-pressed={tag === name} onClick={() => setTag(name)}>{name}<span>{all.filter((item) => item.tags.includes(name)).length}</span></button>)}
                </div>
              )}
              <div className="cert-search">
                <Search aria-hidden="true" />
                <label htmlFor={`${searchId}-q`} className="sr-only">{t.wuSearch}</label>
                <input id={`${searchId}-q`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.wuSearchPlaceholder} maxLength={80} />
              </div>
              <label className="cert-sort"><span>{t.certSort}</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                  <option value="newest">{t.certSortNewest}</option><option value="oldest">{t.certSortOldest}</option><option value="name">{t.certSortName}</option>
                </select>
              </label>
            </div>

            {rows.length === 0 ? <p className="cert-empty">{t.wuNoResults}</p> : (
              <>
                <ul className="wu-grid">
                  {shown.map((item, i) => (
                    <li className="wu-card" key={item.id} style={{ "--i": i } as CSSProperties}>
                      <div className="wu-meta">
                        <span className="wu-blog"><FileText aria-hidden="true" />{item.blog || t.writeupsLabel}</span>
                        <span className="wu-year">{item.year ?? t.wuNoYear}</span>
                      </div>
                      <h3>{item.title}</h3>
                      {item.summary[locale] && <p>{item.summary[locale]}</p>}
                      {item.tags.length > 0 && <ul className="proj-stack" aria-label={t.wuFilterTag}>{item.tags.map((name, n) => <li key={`${n}-${name}`}>{name}</li>)}</ul>}
                      {item.url
                        ? <a className="cert-link wu-read" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.wuRead}: ${item.title}`}>{t.wuRead}<ExternalLink aria-hidden="true" /></a>
                        : <span className="wu-nolink">{t.wuNoLink}</span>}
                    </li>
                  ))}
                </ul>
                {rows.length > shown.length && <button type="button" className="train-more" onClick={() => setLimit((current) => current + STEP)}>{t.wuShowMore} ({rows.length - shown.length})</button>}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
