"use client"

import { useMemo, useState, type CSSProperties } from "react"
import { ExternalLink } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { ComingSoon } from "@/components/empty-state"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { useInView } from "@/components/use-in-view"
import { mitreExposures, mitreTacticCodes, mitreTacticIds, type MitreTechnique } from "@/lib/content-schema"

type Tactic = (typeof mitreTacticIds)[number]
type Exposure = MitreTechnique["exposure"]

/** Official technique page. Built only from a validated ID (T#### or T####.###), never from free text. */
function techniqueUrl(id: string) {
  return /^T\d{4}(\.\d{3})?$/.test(id) ? `https://attack.mitre.org/techniques/${id.replace(".", "/")}/` : null
}

export function MitreSection() {
  const { t, locale } = usePortfolio()
  const { mitre } = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.15)
  const [exposure, setExposure] = useState<"all" | Exposure>("all")
  const [picked, setPicked] = useState<Tactic | null>(null)

  // Only items marked visible count as published.
  const all = useMemo(() => mitre.items.filter((item) => item.visible), [mitre.items])
  const byTactic = useMemo(() => {
    const map = new Map<Tactic, MitreTechnique[]>()
    for (const item of all) map.set(item.tactic, [...(map.get(item.tactic) ?? []), item])
    return map
  }, [all])
  const covered = byTactic.size
  const firstWithData = mitreTacticIds.find((id) => byTactic.has(id)) ?? null
  const active: Tactic | null = picked && byTactic.has(picked) ? picked : firstWithData
  const list = active ? (byTactic.get(active) ?? []).filter((item) => exposure === "all" || item.exposure === exposure) : []
  const exposureLabel = (value: Exposure) => t[`mitreExp_${value}`]

  return (
    <section id="mitre" className="page-section" aria-labelledby="mitre-title">
      <div className="portfolio-container">
        <SectionHeading id="mitre-title" index="05" label={t.mitreLabel} file={t.mitreFile} title={t.mitreTitle} />
        <p className="cert-intro">{t.mitreIntro}</p>

        {all.length === 0 ? <ComingSoon variant="grid" /> : (
          <div ref={ref} data-seen={seen}>
            <dl className="cert-stats mitre-stats">
              <div><dt>{t.mitreStatTech}</dt><dd>{all.length}</dd></div>
              <div><dt>{t.mitreStatTactics}</dt><dd>{covered}<span className="mitre-of"> / {mitreTacticIds.length}</span></dd></div>
            </dl>

            <div className="mitre-grid" role="group" aria-label={t.mitreTactics}>
              {mitreTacticIds.map((id, i) => {
                const n = byTactic.get(id)?.length ?? 0
                return (
                  <button type="button" key={id} className="mitre-box" data-has={n > 0} data-active={active === id} disabled={n === 0}
                    aria-pressed={active === id} style={{ "--i": i, "--lvl": Math.min(n, 5) } as CSSProperties} onClick={() => setPicked(id)}>
                    <span className="mitre-code">{mitreTacticCodes[id]}</span>
                    <span className="mitre-name">{t[`mitreTac_${id}`]}</span>
                    <span className="mitre-n">{n} <span>{n === 1 ? t.mitreCountOne : t.mitreCount}</span></span>
                  </button>
                )
              })}
            </div>

            <div className="mitre-panel" aria-live="polite">
              <div className="mitre-panel-head">
                <h3>{active ? `${t.mitreTechniquesOf} ${t[`mitreTac_${active}`]}` : t.mitreTactics}</h3>
                <div className="cert-chips" role="group" aria-label={t.mitreExposure}>
                  <button type="button" aria-pressed={exposure === "all"} onClick={() => setExposure("all")}>{t.mitreAllExposure}</button>
                  {mitreExposures.map((value) => <button type="button" key={value} aria-pressed={exposure === value} onClick={() => setExposure(value)}>{exposureLabel(value)}</button>)}
                </div>
              </div>
              {list.length === 0 ? <p className="cert-empty">{t.mitreNoMatch}</p> : (
                <ul className="mitre-list" key={`${active}-${exposure}`}>
                  {list.map((item, i) => {
                    const url = techniqueUrl(item.techniqueId)
                    return (
                      <li className="mitre-card" key={item.id} data-exp={item.exposure} style={{ "--i": i } as CSSProperties}>
                        <div className="mitre-card-top">
                          {item.techniqueId && <span className="mitre-tid">{item.techniqueId}</span>}
                          <span className="mitre-exp" data-exp={item.exposure}>{exposureLabel(item.exposure)}</span>
                        </div>
                        <h4>{item.name}</h4>
                        {item.description[locale] && <p>{item.description[locale]}</p>}
                        {url && <a className="cert-link" href={url} target="_blank" rel="noopener noreferrer">{t.mitreView}<ExternalLink aria-hidden="true" /></a>}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <p className="mitre-note">{t.mitreNote}</p>
          </div>
        )}
      </div>
    </section>
  )
}
