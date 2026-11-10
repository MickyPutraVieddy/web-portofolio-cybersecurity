"use client"

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { Award, ArrowRight, Calendar, ChevronLeft, ChevronRight, ExternalLink, Eye, Globe, Maximize2, Search, Shield, ShieldAlert, ShieldCheck, X } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { ComingSoon } from "@/components/empty-state"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { cn } from "@/lib/utils"
import type { Certification } from "@/lib/content-schema"

const PAGE_SIZE = 6
type Kind = Certification["kind"]
type Category = Certification["category"]
type Status = "active" | "expired" | "lifetime" | "unspecified"
type SortKey = "newest" | "oldest" | "name"

/** Validity is computed from stored data only — never guessed. */
function statusOf(item: Certification, year: number): Status {
  if (item.validity === "lifetime") return "lifetime"
  if (item.validity === "not-specified" || item.expiryYear === null) return "unspecified"
  return item.expiryYear >= year ? "active" : "expired"
}
const CATEGORY_ICON = { red: ShieldAlert, blue: Shield, purple: ShieldCheck, general: Globe } as const
const yearOf = (item: Certification) => item.acquiredYear ?? item.issuedYear ?? 0

function useDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const sync = () => setDesktop(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])
  return desktop
}

function useStrings() {
  const { t, locale } = usePortfolio()
  const category: Record<Category, string> = { red: t.certCatRed, blue: t.certCatBlue, purple: t.certCatPurple, general: t.certCatGeneral }
  const status: Record<Status, string> = { active: t.certStatusActive, expired: t.certStatusExpired, lifetime: t.certStatusLifetime, unspecified: t.certStatusUnspecified }
  return { t, locale, category, status }
}

function Thumb({ item, className }: { item: Certification; className?: string }) {
  const { t, locale } = useStrings()
  if (!item.image) return <span className={cn("cert-placeholder", className)}><Award aria-hidden="true" /><span>{t.certNoImage}</span></span>
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={item.image} alt={item.imageAlt[locale] || item.name} loading="lazy" decoding="async" />
}

function Facts({ item, now, part = "all" }: { item: Certification; now: number; part?: "all" | "meta" | "dates" }) {
  const { t, status } = useStrings()
  const state = statusOf(item, now)
  const until = state === "lifetime" ? status.lifetime : item.expiryYear !== null && item.validity === "by-expiry" ? String(item.expiryYear) : "—"
  const issued = item.issuedYear ?? item.acquiredYear
  const meta = part !== "dates"
  const dates = part !== "meta"
  const rows = [
    meta && item.issuer && <div key="i"><dt>{t.certIssuer}</dt><dd>{item.issuer}</dd></div>,
    meta && item.credential && <div key="c"><dt>{t.certCredential}</dt><dd>{item.credential}</dd></div>,
    meta && item.acquiredYear !== null && part === "all" && <div key="a"><dt>{t.certAcquired}</dt><dd>{item.acquiredYear}</dd></div>,
    dates && issued !== null && <div key="d"><dt>{t.certIssued}</dt><dd>{issued}</dd></div>,
    dates && <div key="v"><dt>{t.certValidUntil}</dt><dd>{until}</dd></div>,
  ].filter(Boolean)
  if (rows.length === 0) return null
  return <dl className="cert-facts" data-part={part}>{rows}</dl>
}

function StatusBadge({ item, now }: { item: Certification; now: number }) {
  const { status } = useStrings()
  const state = statusOf(item, now)
  return <span className="cert-status" data-status={state}>{status[state]}</span>
}

/** Accessible lightbox: Esc / close button / backdrop close it, focus is trapped and restored. */
function CertModal({ item, now, onClose }: { item: Certification; now: number; onClose: () => void }) {
  const { t, locale, category } = useStrings()
  const titleId = useId()
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButton.current?.focus()
    return () => { document.body.style.overflow = overflow; previous?.focus?.() }
  }, [])

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") { event.stopPropagation(); onClose(); return }
    if (event.key !== "Tab" || !dialog.current) return
    const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
    if (focusable.length === 0) return
    const first = focusable[0], last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return createPortal(
    <div className="cert-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} onKeyDown={onKeyDown}>
      <div className="cert-modal-card" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialog}>
        <button type="button" className="cert-modal-close" ref={closeButton} onClick={onClose} aria-label={t.certClose}><X aria-hidden="true" /></button>
        <div className="cert-modal-media"><Thumb item={item} /></div>
        <div className="cert-modal-body">
          <span className="cert-tag" data-cat={item.category}>{category[item.category]}</span>
          <h3 id={titleId}>{item.name}</h3>
          {item.description[locale] && <p className="cert-desc-full">{item.description[locale]}</p>}
          <Facts item={item} now={now} />
          <div className="cert-modal-actions">
            <StatusBadge item={item} now={now} />
            {item.verifyUrl && <a className="cert-link" href={item.verifyUrl} target="_blank" rel="noopener noreferrer">{t.certViewCert}<ExternalLink aria-hidden="true" /></a>}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  const { t } = useStrings()
  if (pages <= 1) return null
  return (
    <nav className="cert-pager" aria-label={t.certPage}>
      <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label={t.certPrev}><ChevronLeft aria-hidden="true" /></button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button type="button" key={n} onClick={() => onPage(n)} aria-current={n === page ? "page" : undefined} aria-label={`${t.certPage} ${n}`}>{n}</button>
      ))}
      <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages} aria-label={t.certNext}><ChevronRight aria-hidden="true" /></button>
    </nav>
  )
}

export function CertificationsSection() {
  const { t, locale, category: categoryLabel } = useStrings()
  const { certifications } = useContent()
  const desktop = useDesktop()
  const searchId = useId()
  const now = new Date().getFullYear()

  // Only items the owner marked visible count as published.
  const all = useMemo(() => certifications.items.filter((item) => item.visible), [certifications.items])
  const [category, setCategory] = useState<"all" | Category>("all")
  const [kind, setKind] = useState<"all" | Kind>("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("newest")
  const [pages, setPages] = useState<Record<Kind, number>>({ professional: 1, "non-professional": 1 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modal, setModal] = useState<Certification | null>(null)

  useEffect(() => { setPages({ professional: 1, "non-professional": 1 }) }, [category, kind, query, sort])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = all.filter((item) =>
      (category === "all" || item.category === category) &&
      (kind === "all" || item.kind === kind) &&
      (!q || [item.name, item.issuer, item.credential].some((value) => value.toLowerCase().includes(q))))
    return list.sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "oldest" ? yearOf(a) - yearOf(b) || a.name.localeCompare(b.name) : yearOf(b) - yearOf(a) || a.name.localeCompare(b.name))
  }, [all, category, kind, query, sort])

  const selected = matches.find((item) => item.id === selectedId) ?? matches[0] ?? null
  const choose = (item: Certification) => { if (desktop) setSelectedId(item.id); else setModal(item) }

  const count = (pick: (item: Certification) => boolean) => all.filter(pick).length
  const usedCategories = new Set(all.map((item) => item.category)).size

  function renderGroup(groupKind: Kind, title: string) {
    const dataCount = count((item) => item.kind === groupKind)
    if (kind !== "all" && kind !== groupKind && dataCount > 0) return null
    const rows = matches.filter((item) => item.kind === groupKind)
    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
    const page = Math.min(pages[groupKind], pageCount)
    const slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    return (
      <section className="cert-group" key={groupKind} aria-labelledby={`${searchId}-${groupKind}`}>
        <h3 id={`${searchId}-${groupKind}`}>{title}{dataCount > 0 && <span className="cert-count">{rows.length}</span>}</h3>
        {dataCount === 0 ? <ComingSoon variant="list" /> : rows.length === 0 ? <p className="cert-empty">{t.certNoResults}</p> : (
          <>
            <ul className="cert-list">
              {slice.map((item, i) => (
                <li key={item.id} className={cn("cert-row", selected?.id === item.id && desktop && "is-selected")} data-cat={item.category} style={{ "--i": i } as CSSProperties} aria-current={selected?.id === item.id && desktop ? "true" : undefined}>
                  <button type="button" className="cert-thumb" onClick={() => (item.image ? setModal(item) : choose(item))} aria-label={item.image ? `${t.certExpand}: ${item.name}` : `${t.certDetails}: ${item.name}`}>
                    <Thumb item={item} />
                  </button>
                  <div className="cert-main">
                    <span className="cert-tag" data-cat={item.category}>{categoryLabel[item.category]}</span>
                    <h4>{item.name}</h4>
                    {item.issuer && <p className="cert-issuer">{item.issuer}</p>}
                    {item.description[locale] && <p className="cert-desc">{item.description[locale]}</p>}
                    <div className="cert-foot">
                      {yearOf(item) > 0 && <span className="cert-year"><Calendar aria-hidden="true" />{yearOf(item)}</span>}
                      <StatusBadge item={item} now={now} />
                      <button type="button" className="cert-go" onClick={() => choose(item)} aria-label={`${t.certDetails}: ${item.name}`}><ArrowRight aria-hidden="true" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Pager page={page} pages={pageCount} onPage={(n) => setPages((current) => ({ ...current, [groupKind]: n }))} />
          </>
        )}
      </section>
    )
  }

  const categoryButtons: { id: "all" | Category; label: string; n: number }[] = [
    { id: "all", label: t.certFilterAll, n: all.length },
    ...(["red", "blue", "purple", "general"] as Category[]).map((id) => ({ id, label: categoryLabel[id], n: count((item) => item.category === id) })),
  ]
  const kindButtons: { id: "all" | Kind; label: string }[] = [
    { id: "all", label: t.certFilterAll }, { id: "professional", label: t.certTypePro }, { id: "non-professional", label: t.certTypeNon },
  ]

  return (
    <section id="certifications" className="page-section" aria-labelledby="certifications-title">
      <div className="portfolio-container">
        <SectionHeading id="certifications-title" index="03" label={t.certLabel} file={t.certFile} title={t.certTitle} />
        <p className="cert-intro">{t.certIntro}</p>

        {all.length === 0 ? <ComingSoon variant="grid" /> : (
          <>
            <dl className="cert-stats">
              <div><dt>{t.certStatTotal}</dt><dd>{all.length}</dd></div>
              <div><dt>{t.certStatPro}</dt><dd>{count((item) => item.kind === "professional")}</dd></div>
              <div><dt>{t.certStatNon}</dt><dd>{count((item) => item.kind === "non-professional")}</dd></div>
              <div><dt>{t.certStatCategories}</dt><dd>{usedCategories}</dd></div>
            </dl>

            <div className="cert-toolbar">
              <div className="cert-chips" role="group" aria-label={t.certFilterCategory}>
                {categoryButtons.map((b) => (
                  <button type="button" key={b.id} aria-pressed={category === b.id} data-cat={b.id} onClick={() => setCategory(b.id)}>{b.id !== "all" && (() => { const Icon = CATEGORY_ICON[b.id]; return <Icon className="cert-chip-icon" aria-hidden="true" /> })()}{b.label}<span>{b.n}</span></button>
                ))}
              </div>
              <div className="cert-chips" role="group" aria-label={t.certFilterType}>
                {kindButtons.map((b) => <button type="button" key={b.id} aria-pressed={kind === b.id} onClick={() => setKind(b.id)}>{b.label}</button>)}
              </div>
              <div className="cert-search">
                <Search aria-hidden="true" />
                <label htmlFor={`${searchId}-q`} className="sr-only">{t.certSearch}</label>
                <input id={`${searchId}-q`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.certSearchPlaceholder} maxLength={80} />
              </div>
              <label className="cert-sort"><span>{t.certSort}</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                  <option value="newest">{t.certSortNewest}</option><option value="oldest">{t.certSortOldest}</option><option value="name">{t.certSortName}</option>
                </select>
              </label>
            </div>

            <div className="cert-layout" data-panel={desktop && !!selected}>
              <div className="cert-groups">
                {renderGroup("professional", t.certGroupPro)}
                {renderGroup("non-professional", t.certGroupNon)}
              </div>
              {desktop && (
                <aside className="cert-panel" aria-label={t.certPreview}>
                  <header><span><Eye aria-hidden="true" />{t.certPreview}</span>{selected?.image && <button type="button" onClick={() => setModal(selected)} aria-label={t.certExpand}><Maximize2 aria-hidden="true" /></button>}</header>
                  {selected ? (
                    <>
                      <div className="cert-panel-body" key={selected.id}>
                      <div className="cert-panel-media"><Thumb item={selected} /></div>
                      <h4>{selected.name}</h4>
                      {selected.description[locale] && <p className="cert-desc-full">{selected.description[locale]}</p>}
                      <Facts item={selected} now={now} part="meta" />
                      <div className="cert-panel-foot">
                        <Facts item={selected} now={now} part="dates" />
                        {selected.verifyUrl && <a className="cert-link" href={selected.verifyUrl} target="_blank" rel="noopener noreferrer">{t.certViewCert}<ExternalLink aria-hidden="true" /></a>}
                      </div>
                      <StatusBadge item={selected} now={now} />
                    </div>
                    </>
                  ) : <p className="cert-empty">{t.certSelectHint}</p>}
                </aside>
              )}
            </div>
          </>
        )}
      </div>
      {modal && <CertModal item={modal} now={now} onClose={() => setModal(null)} />}
    </section>
  )
}
