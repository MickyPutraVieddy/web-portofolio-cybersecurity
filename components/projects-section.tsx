"use client"

import { useEffect, useId, useMemo, useState, type CSSProperties } from "react"
import { ArrowRight, ExternalLink, Folder, Search, Star } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { ComingSoon } from "@/components/empty-state"
import { ModalShell } from "@/components/modal-shell"
import { Pager } from "@/components/certifications-section"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { useInView } from "@/components/use-in-view"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/content-schema"

const PAGE_SIZE = 6
type Kind = Project["kind"]
type Domain = Project["domain"]
type SortKey = "newest" | "oldest" | "name"
const yearOf = (item: Project) => item.year ?? 0
const stackOf = (item: Project) => item.stack.map((value) => value.trim()).filter(Boolean)

function useStrings() {
  const { t, locale } = usePortfolio()
  const domain: Record<Domain, string> = { red: t.certCatRed, blue: t.certCatBlue, purple: t.certCatPurple, general: t.projDomainGeneral }
  const status = (value: Project["status"]) => t[`projStatus_${value}`]
  return { t, locale, domain, status }
}

function Thumb({ item, className }: { item: Project; className?: string }) {
  const { t, locale } = useStrings()
  if (!item.thumbnail) return <span className={cn("cert-placeholder", className)} aria-hidden="true"><Folder /><span>{t.certNoImage}</span></span>
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={item.thumbnail} alt={item.thumbnailAlt[locale] || item.name} loading="lazy" decoding="async" />
}

function StatusBadge({ item }: { item: Project }) {
  const { status } = useStrings()
  return <span className="proj-status" data-status={item.status}>{status(item.status)}</span>
}

function StackChips({ item, limit }: { item: Project; limit?: number }) {
  const { t } = useStrings()
  const all = stackOf(item)
  const shown = limit ? all.slice(0, limit) : all
  return (
    <ul className="proj-stack" aria-label={t.projColStack}>
      {shown.map((tool) => <li key={tool}>{tool}</li>)}
      {limit && all.length > limit && <li className="proj-more">+{all.length - limit}</li>}
    </ul>
  )
}

function yearLabel(item: Project) { return item.period.trim() || (item.year !== null ? String(item.year) : "—") }

function ProjectModal({ item, onClose }: { item: Project; onClose: () => void }) {
  const { t, locale, domain } = useStrings()
  const titleId = useId()
  const blocks: [string, string][] = [
    [t.projSecSummary, item.summary[locale]], [t.projSecScope, item.description[locale]], [t.projSecRole, item.role[locale]],
    [t.projSecMethod, item.method[locale]], [t.projSecOutcome, item.outcome[locale]],
  ]
  const links: [string, string][] = [[t.projLinkRepo, item.repoUrl], [t.projLinkDemo, item.demoUrl], [t.projLinkReport, item.reportUrl]]
  return (
    <ModalShell onClose={onClose} labelledBy={titleId} closeLabel={t.certClose} className="proj-modal">
      {item.thumbnail && <div className="cert-modal-media"><Thumb item={item} /></div>}
      <div className="cert-modal-body">
        <div className="proj-badges">
          <span className="cert-tag" data-cat={item.domain}>{domain[item.domain]}</span>
          <span className="cert-tag proj-kind">{item.kind === "professional" ? t.certTypePro : t.certTypeNon}</span>
          <StatusBadge item={item} />
          <span className="proj-when">{yearLabel(item)}</span>
        </div>
        <h3 id={titleId}>{item.name}</h3>
        {blocks.filter(([, value]) => value.trim()).map(([label, value]) => <section key={label} className="proj-block"><h4>{label}</h4><p>{value}</p></section>)}
        {stackOf(item).length > 0 && <section className="proj-block"><h4>{t.projSecStack}</h4><StackChips item={item} /></section>}
        {links.some(([, href]) => href) && (
          <div className="cert-modal-actions proj-links">
            {links.filter(([, href]) => href).map(([label, href]) => <a key={label} className="cert-link" href={href} target="_blank" rel="noopener noreferrer">{label}<ExternalLink aria-hidden="true" /></a>)}
          </div>
        )}
      </div>
    </ModalShell>
  )
}

export function ProjectsSection() {
  const { t, locale, domain: domainLabel } = useStrings()
  const { projects } = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.12)
  const searchId = useId()

  // Only items marked visible count as published.
  const all = useMemo(() => projects.items.filter((item) => item.visible), [projects.items])
  const [domain, setDomain] = useState<"all" | Domain>("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("newest")
  const [pages, setPages] = useState<Record<Kind, number>>({ professional: 1, "non-professional": 1 })
  const [modal, setModal] = useState<Project | null>(null)

  useEffect(() => { setPages({ professional: 1, "non-professional": 1 }) }, [domain, query, sort])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = all.filter((item) =>
      (domain === "all" || item.domain === domain) &&
      (!q || [item.name, item.summary[locale], item.summary.en, ...item.stack].some((value) => value.toLowerCase().includes(q))))
    return list.sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "oldest" ? yearOf(a) - yearOf(b) || a.name.localeCompare(b.name) : yearOf(b) - yearOf(a) || a.name.localeCompare(b.name))
  }, [all, domain, query, sort, locale])

  const featured = all.filter((item) => item.featured).slice(0, 3)
  const count = (pick: (item: Project) => boolean) => all.filter(pick).length

  function renderGroup(kind: Kind, title: string) {
    const dataCount = count((item) => item.kind === kind)
    const rows = matches.filter((item) => item.kind === kind)
    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
    const page = Math.min(pages[kind], pageCount)
    const slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const headingId = `${searchId}-${kind}`
    return (
      <section className="cert-group proj-group" key={kind} aria-labelledby={headingId}>
        <h3 id={headingId}>{title}{dataCount > 0 && <span className="cert-count">{rows.length}</span>}</h3>
        {dataCount === 0 ? <ComingSoon variant="list" /> : rows.length === 0 ? <p className="cert-empty">{t.projNoResults}</p> : (
          <>
            <table className="proj-table" role="table">
              <caption className="sr-only">{title}</caption>
              <thead role="rowgroup">
                <tr role="row">
                  <th role="columnheader" scope="col">{t.projColProject}</th><th role="columnheader" scope="col">{t.projColDomain}</th>
                  <th role="columnheader" scope="col">{t.projColYear}</th><th role="columnheader" scope="col">{t.projColStatus}</th>
                  <th role="columnheader" scope="col">{t.projColStack}</th><th role="columnheader" scope="col"><span className="sr-only">{t.projOpen}</span></th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {slice.map((item, i) => (
                  <tr role="row" className="proj-row" key={item.id} style={{ "--i": i } as CSSProperties} onClick={() => setModal(item)}>
                    <td role="cell" className="proj-name">
                      <button type="button" className="proj-open" aria-haspopup="dialog" onClick={(event) => { event.stopPropagation(); setModal(item) }}>{item.name}</button>
                      {item.summary[locale] && <p className="proj-summary">{item.summary[locale]}</p>}
                    </td>
                    <td role="cell" data-label={t.projColDomain}><span className="cert-tag" data-cat={item.domain}>{domainLabel[item.domain]}</span></td>
                    <td role="cell" data-label={t.projColYear} className="proj-year">{yearLabel(item)}</td>
                    <td role="cell" data-label={t.projColStatus}><StatusBadge item={item} /></td>
                    <td role="cell" data-label={t.projColStack}><StackChips item={item} limit={3} /></td>
                    <td role="cell" className="proj-act" aria-hidden="true"><ArrowRight /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pager page={page} pages={pageCount} onPage={(n) => setPages((current) => ({ ...current, [kind]: n }))} />
          </>
        )}
      </section>
    )
  }

  const domainButtons: { id: "all" | Domain; label: string; n: number }[] = [
    { id: "all", label: t.certFilterAll, n: all.length },
    ...(["red", "blue", "purple", "general"] as Domain[]).map((id) => ({ id, label: domainLabel[id], n: count((item) => item.domain === id) })),
  ]

  return (
    <section id="projects" className="page-section" aria-labelledby="projects-title">
      <div className="portfolio-container">
        <SectionHeading id="projects-title" index="06" label={t.projectsLabel} file={t.projectsFile} title={t.projectsTitle} />
        <p className="cert-intro">{t.projectsIntro}</p>

        {all.length === 0 ? <ComingSoon variant="grid" /> : (
          <div ref={ref} data-seen={seen} className="proj-wrap">
            <dl className="cert-stats">
              <div><dt>{t.projStatTotal}</dt><dd>{all.length}</dd></div>
              <div><dt>{t.projStatPro}</dt><dd>{count((item) => item.kind === "professional")}</dd></div>
              <div><dt>{t.projStatNon}</dt><dd>{count((item) => item.kind === "non-professional")}</dd></div>
              <div><dt>{t.projStatDone}</dt><dd>{count((item) => item.status === "completed")}</dd></div>
            </dl>

            {featured.length > 0 && (
              <div className="proj-featured" aria-label={t.projFeatured}>
                <p className="proj-featured-label"><Star aria-hidden="true" />{t.projFeatured}</p>
                <ul>
                  {featured.map((item, i) => (
                    <li key={item.id} style={{ "--i": i } as CSSProperties}>
                      <button type="button" className="proj-feature" aria-haspopup="dialog" onClick={() => setModal(item)}>
                        {item.thumbnail && <span className="proj-feature-media"><Thumb item={item} /></span>}
                        <span className="proj-badges"><span className="cert-tag" data-cat={item.domain}>{domainLabel[item.domain]}</span><StatusBadge item={item} /></span>
                        <strong>{item.name}</strong>
                        {item.summary[locale] && <span className="proj-summary">{item.summary[locale]}</span>}
                        <span className="proj-feature-go">{t.projOpen}<ArrowRight aria-hidden="true" /></span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="cert-toolbar">
              <div className="cert-chips" role="group" aria-label={t.projFilterDomain}>
                {domainButtons.map((b) => <button type="button" key={b.id} aria-pressed={domain === b.id} data-cat={b.id} onClick={() => setDomain(b.id)}>{b.label}<span>{b.n}</span></button>)}
              </div>
              <div className="cert-search">
                <Search aria-hidden="true" />
                <label htmlFor={`${searchId}-q`} className="sr-only">{t.projSearch}</label>
                <input id={`${searchId}-q`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.projSearchPlaceholder} maxLength={80} />
              </div>
              <label className="cert-sort"><span>{t.certSort}</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                  <option value="newest">{t.certSortNewest}</option><option value="oldest">{t.certSortOldest}</option><option value="name">{t.certSortName}</option>
                </select>
              </label>
            </div>

            <div className="cert-groups proj-groups">
              {renderGroup("professional", t.projectsGroupPro)}
              {renderGroup("non-professional", t.projectsGroupNon)}
            </div>
          </div>
        )}
      </div>
      {modal && <ProjectModal item={modal} onClose={() => setModal(null)} />}
    </section>
  )
}
