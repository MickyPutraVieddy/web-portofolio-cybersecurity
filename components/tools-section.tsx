"use client"

import { useEffect, useId, useMemo, useState, type CSSProperties } from "react"
import { Boxes, Code2, Layers, Search, ShieldCheck, Terminal, Wrench } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { ComingSoon } from "@/components/empty-state"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { useInView } from "@/components/use-in-view"
import { toolDomains, toolLevels, type Tool } from "@/lib/content-schema"

const STEP = 12
type Group = Tool["group"]
type Domain = Tool["domain"]
type SortKey = "order" | "name"

const ICONS: Record<Tool["type"], typeof Code2> = {
  language: Code2, scripting: Terminal, framework: Boxes, platform: Layers, "security-tool": ShieldCheck, other: Wrench,
}

function useStrings() {
  const { t, locale } = usePortfolio()
  return { t, locale, type: (value: Tool["type"]) => t[`toolType_${value}`], domain: (value: Domain) => t[`toolDomain_${value}`], level: (value: NonNullable<Tool["level"]>) => t[`toolLevel_${value}`] }
}

/** A logo only appears when the owner uploaded one; otherwise a generic, consistent icon is drawn. */
function ToolIcon({ item }: { item: Tool }) {
  const Icon = ICONS[item.type]
  if (item.icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <span className="tool-icon"><img src={item.icon} alt="" loading="lazy" decoding="async" /></span>
  }
  return <span className="tool-icon" aria-hidden="true"><Icon /></span>
}

/** Text label plus a 3-step meter. Only rendered when the owner chose a level. */
function Level({ value }: { value: Tool["level"] }) {
  const { t, level } = useStrings()
  if (value === null) return <span className="tool-level-none">{t.toolsLevelNone}</span>
  const rank = toolLevels.indexOf(value) + 1
  return (
    <span className="tool-level" data-level={value}>
      <span className="tool-meter" aria-hidden="true">{toolLevels.map((name, i) => <i key={name} data-on={i < rank} />)}</span>
      {level(value)}
    </span>
  )
}

export function ToolsSection() {
  const { t, locale, type: typeLabel, domain: domainLabel } = useStrings()
  const { tools } = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.1)
  const searchId = useId()

  // Only items marked visible count as published.
  const all = useMemo(() => tools.items.filter((item) => item.visible), [tools.items])
  const [domain, setDomain] = useState<"all" | Domain>("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("order")
  const [limits, setLimits] = useState<Record<Group, number>>({ programming: STEP, security: STEP })
  useEffect(() => { setLimits({ programming: STEP, security: STEP }) }, [domain, query, sort])

  const securityDomains = useMemo(() => toolDomains.filter((id) => all.some((item) => item.group === "security" && item.domain === id)), [all])
  // A domain that no longer has any tool (e.g. after an edit) must not leave the table empty.
  useEffect(() => { if (domain !== "all" && !securityDomains.includes(domain)) setDomain("all") }, [securityDomains, domain])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = all.filter((item) =>
      (item.group === "programming" || domain === "all" || item.domain === domain) &&
      (!q || [item.name, item.purpose[locale], item.purpose.en, item.workflow[locale], item.workflow.en].some((value) => value.toLowerCase().includes(q))))
    return sort === "name" ? list.sort((a, b) => a.name.localeCompare(b.name)) : list
  }, [all, domain, query, sort, locale])

  const count = (pick: (item: Tool) => boolean) => all.filter(pick).length

  function renderGroup(group: Group, title: string) {
    const dataCount = count((item) => item.group === group)
    const rows = matches.filter((item) => item.group === group)
    const shown = rows.slice(0, limits[group])
    const headingId = `${searchId}-${group}`
    return (
      <section className="cert-group tool-group" key={group} aria-labelledby={headingId}>
        <h3 id={headingId}>{title}{dataCount > 0 && <span className="cert-count">{rows.length}</span>}</h3>
        {group === "security" && securityDomains.length > 0 && (
          <div className="cert-chips tool-domains" role="group" aria-label={t.toolsFilterDomain}>
            <button type="button" aria-pressed={domain === "all"} onClick={() => setDomain("all")}>{t.certFilterAll}<span>{dataCount}</span></button>
            {securityDomains.map((id) => (
              <button type="button" key={id} aria-pressed={domain === id} onClick={() => setDomain(id)}>{domainLabel(id)}<span>{count((item) => item.group === "security" && item.domain === id)}</span></button>
            ))}
          </div>
        )}
        {dataCount === 0 ? <ComingSoon variant="list" /> : rows.length === 0 ? <p className="cert-empty">{t.toolsNoResults}</p> : (
          <>
            <table className="tool-table">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.toolsColTool}</th><th scope="col">{t.toolsColType}</th><th scope="col">{t.toolsColDomain}</th>
                  <th scope="col">{t.toolsColPurpose}</th><th scope="col">{t.toolsColWorkflow}</th><th scope="col">{t.toolsColLevel}</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((item, i) => (
                  <tr className="tool-row" key={item.id} style={{ "--i": i } as CSSProperties}>
                    <th scope="row" className="tool-name"><span className="tool-name-in"><ToolIcon item={item} /><span>{item.name}</span></span></th>
                    <td data-label={t.toolsColType}><span className="tool-type">{typeLabel(item.type)}</span></td>
                    <td data-label={t.toolsColDomain}><span className="cert-tag" data-cat={item.domain}>{domainLabel(item.domain)}</span></td>
                    <td data-label={t.toolsColPurpose} className="tool-text">{item.purpose[locale] || "—"}</td>
                    <td data-label={t.toolsColWorkflow} className="tool-text">{item.workflow[locale] || "—"}</td>
                    <td data-label={t.toolsColLevel}><Level value={item.level} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > shown.length && (
              <button type="button" className="train-more" onClick={() => setLimits((current) => ({ ...current, [group]: current[group] + STEP }))}>{t.toolsShowMore} ({rows.length - shown.length})</button>
            )}
          </>
        )}
      </section>
    )
  }

  return (
    <section id="tools" className="page-section" aria-labelledby="tools-title">
      <div className="portfolio-container">
        <SectionHeading id="tools-title" index="08" label={t.toolsLabel} file={t.toolsFile} title={t.toolsTitle} />
        <p className="cert-intro">{t.toolsIntro}</p>

        {all.length === 0 ? <ComingSoon variant="grid" /> : (
          <div ref={ref} data-seen={seen} className="tool-wrap">
            <dl className="cert-stats">
              <div><dt>{t.toolsStatTotal}</dt><dd>{all.length}</dd></div>
              <div><dt>{t.toolsStatProg}</dt><dd>{count((item) => item.group === "programming")}</dd></div>
              <div><dt>{t.toolsStatSec}</dt><dd>{count((item) => item.group === "security")}</dd></div>
              <div><dt>{t.toolsStatDomains}</dt><dd>{securityDomains.length}</dd></div>
            </dl>

            <div className="cert-toolbar">
              <div className="cert-search">
                <Search aria-hidden="true" />
                <label htmlFor={`${searchId}-q`} className="sr-only">{t.toolsSearch}</label>
                <input id={`${searchId}-q`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.toolsSearchPlaceholder} maxLength={80} />
              </div>
              <label className="cert-sort"><span>{t.toolsSort}</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                  <option value="order">{t.toolsSortOrder}</option><option value="name">{t.toolsSortName}</option>
                </select>
              </label>
            </div>

            <div className="cert-groups tool-groups">
              {renderGroup("programming", t.toolsGroupProg)}
              {renderGroup("security", t.toolsGroupSec)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
