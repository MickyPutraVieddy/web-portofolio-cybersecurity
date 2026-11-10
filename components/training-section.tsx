"use client"

import { useEffect, useId, useMemo, useState, type CSSProperties } from "react"
import { Calendar, ExternalLink, FlaskConical, GraduationCap, Search } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { ComingSoon } from "@/components/empty-state"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { useInView } from "@/components/use-in-view"
import type { TrainingItem } from "@/lib/content-schema"

const STEP = 8
type Kind = TrainingItem["kind"]
type Domain = TrainingItem["domain"]
type Status = TrainingItem["status"]

function useStrings() {
  const { t, locale } = usePortfolio()
  const domain: Record<Domain, string> = { red: t.certCatRed, blue: t.certCatBlue, purple: t.certCatPurple, general: t.projDomainGeneral }
  const status = (value: Status) => t[`trainStatus_${value}`]
  return { t, locale, domain, status }
}

const clean = (list: string[]) => list.map((value) => value.trim()).filter(Boolean)
const yearKey = (item: TrainingItem) => item.endYear ?? item.startYear
/** Dates are shown exactly as stored. "present" is only appended when the owner set the status to In Progress. */
function whenLabel(item: TrainingItem, present: string, none: string) {
  const { startYear: a, endYear: b } = item
  if (a !== null && b !== null) return a === b ? String(a) : `${a} – ${b}`
  if (a !== null) return item.status === "in-progress" ? `${a} – ${present}` : String(a)
  if (b !== null) return String(b)
  return none
}

function Chips({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null
  return (
    <div className="train-chipset">
      <span className="train-label">{label}</span>
      <ul className="proj-stack" aria-label={label}>{values.map((value, n) => <li key={`${n}-${value}`}>{value}</li>)}</ul>
    </div>
  )
}

function Evidence({ item }: { item: TrainingItem }) {
  const { t } = useStrings()
  if (!item.evidenceUrl) return null
  return <a className="cert-link train-evidence" href={item.evidenceUrl} target="_blank" rel="noopener noreferrer">{item.kind === "lab" ? t.trainEvidenceLab : t.trainEvidenceTraining}<ExternalLink aria-hidden="true" /></a>
}

function StatusBadge({ item }: { item: TrainingItem }) {
  const { status } = useStrings()
  return <span className="train-status" data-status={item.status}>{status(item.status)}</span>
}

function TrainingCard({ item, index }: { item: TrainingItem; index: number }) {
  const { t, locale } = useStrings()
  const modules = clean(item.modules)
  return (
    <li className="train-item" data-status={item.status} style={{ "--i": index } as CSSProperties}>
      <article className="train-card">
        <header>
          <span className="train-platform"><GraduationCap aria-hidden="true" />{item.platform}</span>
          <StatusBadge item={item} />
        </header>
        <h5>{item.name}</h5>
        <p className="train-when"><Calendar aria-hidden="true" />{whenLabel(item, t.trainPresent, t.trainNoDate)}</p>
        {item.focus[locale] && <p className="train-focus"><span className="train-label">{t.trainFocus}</span>{item.focus[locale]}</p>}
        {item.description[locale] && <p className="train-text">{item.description[locale]}</p>}
        {modules.length > 0 && (
          <details className="train-modules">
            <summary>{t.trainModules} · {modules.length} {t.trainModulesCount}</summary>
            <ul>{modules.map((value, n) => <li key={`${n}-${value}`}>{value}</li>)}</ul>
          </details>
        )}
        <Chips label={t.trainSkills} values={clean(item.skills)} />
        <Evidence item={item} />
      </article>
    </li>
  )
}

function LabCard({ item, index }: { item: TrainingItem; index: number }) {
  const { t, locale, domain } = useStrings()
  return (
    <li className="lab-card" data-cat={item.domain} style={{ "--i": index } as CSSProperties}>
      <header>
        <span className="cert-tag" data-cat={item.domain}>{domain[item.domain]}</span>
        <StatusBadge item={item} />
      </header>
      <h5>{item.name}</h5>
      <p className="train-when"><Calendar aria-hidden="true" />{whenLabel(item, t.trainPresent, t.trainNoDate)}</p>
      {item.objective[locale] && <p className="train-focus"><span className="train-label">{t.trainObjective}</span>{item.objective[locale]}</p>}
      {item.description[locale] && <p className="train-text"><span className="train-label">{t.trainActivities}</span>{item.description[locale]}</p>}
      <Chips label={t.trainTools} values={clean(item.tools)} />
      <Chips label={t.trainSkills} values={clean(item.skills)} />
      <Evidence item={item} />
    </li>
  )
}

export function TrainingSection() {
  const { t, locale, domain: domainLabel, status: statusLabel } = useStrings()
  const { training } = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.1)
  const searchId = useId()

  // Only items marked visible count as published.
  const all = useMemo(() => training.items.filter((item) => item.visible), [training.items])
  const [platform, setPlatform] = useState("")
  const [domain, setDomain] = useState<"all" | Domain>("all")
  const [status, setStatus] = useState<"all" | Status>("all")
  const [query, setQuery] = useState("")
  const [limits, setLimits] = useState<Record<Kind, number>>({ training: STEP, lab: STEP })
  useEffect(() => { setLimits({ training: STEP, lab: STEP }) }, [platform, domain, status, query])

  const platforms = useMemo(() => Array.from(new Set(all.map((item) => item.platform))).sort((a, b) => a.localeCompare(b)), [all])
  useEffect(() => { if (platform && !platforms.includes(platform)) setPlatform("") }, [platforms, platform])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all
      .filter((item) =>
        (!platform || item.platform === platform) && (domain === "all" || item.domain === domain) && (status === "all" || item.status === status) &&
        (!q || [item.name, item.platform, item.focus[locale], item.focus.en, ...item.skills, ...item.tools].some((value) => value.toLowerCase().includes(q))))
      .sort((a, b) => (yearKey(b) ?? 0) - (yearKey(a) ?? 0) || a.name.localeCompare(b.name))
  }, [all, platform, domain, status, query, locale])

  const count = (pick: (item: TrainingItem) => boolean) => all.filter(pick).length
  const showMore = (kind: Kind) => setLimits((current) => ({ ...current, [kind]: current[kind] + STEP }))

  function moreButton(kind: Kind, total: number) {
    if (total <= limits[kind]) return null
    return <button type="button" className="train-more" onClick={() => showMore(kind)}>{t.trainShowMore} ({total - limits[kind]})</button>
  }

  function renderTraining() {
    const dataCount = count((item) => item.kind === "training")
    const rows = matches.filter((item) => item.kind === "training")
    const shown = rows.slice(0, limits.training)
    // group by year (newest first); undated items last
    const groups: { key: number | null; items: TrainingItem[] }[] = []
    for (const item of shown) {
      const key = yearKey(item)
      const group = groups.find((g) => g.key === key)
      if (group) group.items.push(item); else groups.push({ key, items: [item] })
    }
    groups.sort((a, b) => (b.key ?? -1) - (a.key ?? -1))
    let index = 0
    return (
      <section className="train-block" aria-labelledby={`${searchId}-training`}>
        <h3 id={`${searchId}-training`}><GraduationCap aria-hidden="true" />{t.trainSecTraining}{dataCount > 0 && <span className="cert-count">{rows.length}</span>}</h3>
        {dataCount === 0 ? <ComingSoon variant="list" /> : rows.length === 0 ? <p className="cert-empty">{t.trainNoResults}</p> : (
          <>
            <ol className="train-timeline">
              {groups.map((group) => (
                <li className="train-year-group" key={group.key ?? "none"}>
                  <h4 className="train-year">{group.key ?? t.trainNoDate}</h4>
                  <ul>{group.items.map((item) => <TrainingCard key={item.id} item={item} index={index++} />)}</ul>
                </li>
              ))}
            </ol>
            {moreButton("training", rows.length)}
          </>
        )}
      </section>
    )
  }

  function renderLabs() {
    const dataCount = count((item) => item.kind === "lab")
    const rows = matches.filter((item) => item.kind === "lab")
    const shown = rows.slice(0, limits.lab)
    const groups: { platform: string; items: TrainingItem[] }[] = []
    for (const item of shown) {
      const group = groups.find((g) => g.platform === item.platform)
      if (group) group.items.push(item); else groups.push({ platform: item.platform, items: [item] })
    }
    let index = 0
    return (
      <section className="train-block" aria-labelledby={`${searchId}-lab`}>
        <h3 id={`${searchId}-lab`}><FlaskConical aria-hidden="true" />{t.trainSecLab}{dataCount > 0 && <span className="cert-count">{rows.length}</span>}</h3>
        {dataCount === 0 ? <ComingSoon variant="list" /> : rows.length === 0 ? <p className="cert-empty">{t.trainNoResults}</p> : (
          <>
            {groups.map((group) => (
              <div className="lab-group" key={group.platform}>
                <h4 className="lab-platform">{group.platform}<span>{group.items.length}</span></h4>
                <ul className="lab-grid">{group.items.map((item) => <LabCard key={item.id} item={item} index={index++} />)}</ul>
              </div>
            ))}
            {moreButton("lab", rows.length)}
          </>
        )}
      </section>
    )
  }

  const domainButtons: { id: "all" | Domain; label: string; n: number }[] = [
    { id: "all", label: t.trainAllStatus, n: all.length },
    ...(["red", "blue", "purple", "general"] as Domain[]).map((id) => ({ id, label: domainLabel[id], n: count((item) => item.domain === id) })),
  ]
  const statusButtons: { id: "all" | Status; label: string }[] = [
    { id: "all", label: t.trainAllStatus }, ...(["completed", "in-progress", "planned"] as Status[]).map((id) => ({ id, label: statusLabel(id) })),
  ]

  return (
    <section id="training" className="page-section" aria-labelledby="training-title">
      <div className="portfolio-container">
        <SectionHeading id="training-title" index="07" label={t.trainingLabel} file={t.trainingFile} title={t.trainingTitle} />
        <p className="cert-intro">{t.trainingIntro}</p>

        {all.length === 0 ? <ComingSoon variant="grid" /> : (
          <div ref={ref} data-seen={seen} className="train-wrap">
            <dl className="cert-stats">
              <div><dt>{t.trainStatTraining}</dt><dd>{count((item) => item.kind === "training")}</dd></div>
              <div><dt>{t.trainStatLab}</dt><dd>{count((item) => item.kind === "lab")}</dd></div>
              <div><dt>{t.trainStatPlatforms}</dt><dd>{platforms.length}</dd></div>
              <div><dt>{t.trainStatDone}</dt><dd>{count((item) => item.status === "completed")}</dd></div>
            </dl>

            <div className="cert-toolbar">
              <div className="cert-chips" role="group" aria-label={t.trainFilterDomain}>
                {domainButtons.map((b) => <button type="button" key={b.id} aria-pressed={domain === b.id} data-cat={b.id} onClick={() => setDomain(b.id)}>{b.label}<span>{b.n}</span></button>)}
              </div>
              <div className="cert-chips" role="group" aria-label={t.trainFilterStatus}>
                {statusButtons.map((b) => <button type="button" key={b.id} aria-pressed={status === b.id} onClick={() => setStatus(b.id)}>{b.label}</button>)}
              </div>
              <label className="cert-sort"><span>{t.trainFilterPlatform}</span>
                <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
                  <option value="">{t.trainAllPlatforms}</option>
                  {platforms.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <div className="cert-search">
                <Search aria-hidden="true" />
                <label htmlFor={`${searchId}-q`} className="sr-only">{t.trainSearch}</label>
                <input id={`${searchId}-q`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.trainSearchPlaceholder} maxLength={80} />
              </div>
            </div>

            <div className="train-blocks">
              {renderTraining()}
              {renderLabs()}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
