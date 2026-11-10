"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { Activity, BarChart3, Shield, Swords, Zap } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { ComingSoon } from "@/components/empty-state"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { useInView } from "@/components/use-in-view"
import { cn } from "@/lib/utils"
import type { Skill } from "@/lib/content-schema"

type Category = Skill["category"]
const CATEGORIES: Category[] = ["red", "blue", "general"]
const CATEGORY_COLORS: Record<Category, string> = {
  red: "#ff6878",
  blue: "#58aaff",
  general: "#f3bd62",
}
const CATEGORY_ICONS = {
  red: Swords,
  blue: Shield,
  general: Zap,
} satisfies Record<Category, typeof Shield>

function useAnimatedCount(target: number, enabled: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setValue(0)
      return
    }

    const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion || target === 0) {
      setValue(target)
      return
    }

    let frame = 0
    let start: number | null = null
    const duration = 950
    const animate = (now: number) => {
      if (start === null) start = now
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = window.requestAnimationFrame(animate)
    }
    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [target, enabled])

  return value
}

function AnimatedNumber({ value, enabled }: { value: number; enabled: boolean }) {
  const count = useAnimatedCount(value, enabled)
  return <>{count.toLocaleString()}</>
}

function Level({ level, seen }: { level: number | null; seen: boolean }) {
  const { t } = usePortfolio()
  if (level === null) return <span className="skill-level-none">{t.skillLevel0}</span>
  const label = t[`skillLevel${level}`]
  return (
    <span className="skill-level" role="img" aria-label={`${label}, ${level} ${t.skillLevelOf}`}>
      <span className="skill-bars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => <i key={n} data-on={seen && n <= level} style={{ "--n": n } as CSSProperties} />)}
      </span>
      <span className="skill-level-text">{label}</span>
    </span>
  )
}

interface SkillGroup {
  category: Category
  rows: Skill[]
  count: number
  percentage: number
}

function SkillDistribution({ groups, total, seen }: { groups: SkillGroup[]; total: number; seen: boolean }) {
  const { t } = usePortfolio()
  const copy = {
    kicker: t.skillDistKicker, title: t.skillDistTitle, live: t.skillDistLive, published: t.skillDistPublished, indexed: t.skillDistIndexed,
    active: t.skillDistActive, skills: t.skillDistSkills, categories: t.skillDistCategories, entries: t.skillDistEntries,
  }
  const totalCount = useAnimatedCount(total, seen)
  const labels: Record<Category, string> = {
    red: t.skillGroupRed,
    blue: t.skillGroupBlue,
    general: t.skillGroupGeneral,
  }

  let angle = 0
  const segments = groups.filter((group) => group.count > 0).map((group) => {
    const start = angle
    angle += (group.count / Math.max(total, 1)) * 360
    return `${CATEGORY_COLORS[group.category]} ${start.toFixed(2)}deg ${angle.toFixed(2)}deg`
  })
  const donutStyle = {
    "--skills-gradient": segments.length ? `conic-gradient(${segments.join(", ")})` : "conic-gradient(#223653 0deg 360deg)",
  } as CSSProperties

  return (
    <aside className="skills-distribution" aria-label={t.skillVisual} data-seen={seen}>
      <div className="skills-distribution-head">
        <div>
          <span className="skills-visual-kicker"><BarChart3 aria-hidden="true" /> {copy.kicker}</span>
          <h3>{copy.title}</h3>
        </div>
        <span className="skills-live-indicator"><i aria-hidden="true" />{copy.live}</span>
      </div>

      <div className="skills-donut-stage">
        <span className="skills-donut-orbit" aria-hidden="true"><i /></span>
        <div className="skills-donut" style={donutStyle} aria-label={`${total} published skills`}>
          <div className="skills-donut-core">
            <span className="skills-total-count"><AnimatedNumber value={total} enabled={seen} /></span>
            <span className="skills-total-label">{copy.published}</span>
            <span className="skills-total-divider" />
            <span className="skills-total-state"><Activity aria-hidden="true" />{copy.indexed}</span>
          </div>
        </div>
      </div>

      <div className="skills-distribution-list" aria-label="Skill category ranking">
        {groups.map((group, index) => {
          const Icon = CATEGORY_ICONS[group.category]
          return (
            <article
              className="skills-distribution-row"
              key={group.category}
              data-cat={group.category}
              style={{ "--rank": index, "--bar-width": `${group.percentage}%` } as CSSProperties}
            >
              <div className="skills-distribution-row-top">
                <span className="skills-rank">0{index + 1}</span>
                <span className="skills-category-icon"><Icon aria-hidden="true" /></span>
                <span className="skills-category-name">{labels[group.category]}</span>
                <span className="skills-row-active"><i aria-hidden="true" /> {copy.active}</span>
              </div>
              <div className="skills-distribution-values">
                <strong><AnimatedNumber value={group.count} enabled={seen} /><small> {copy.skills}</small></strong>
                <b>{group.percentage.toFixed(1)}<small>%</small></b>
              </div>
              <div className="skills-stat-track" aria-hidden="true"><span /></div>
            </article>
          )
        })}
      </div>

      <div className="skills-distribution-foot">
        <span><i aria-hidden="true" /> {groups.filter((group) => group.count > 0).length} {copy.categories}</span>
        <span>{totalCount.toLocaleString()} / 120 {copy.entries}</span>
      </div>
    </aside>
  )
}

export function SkillsSection() {
  const { t, locale } = usePortfolio()
  const { skills } = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.15)

  // Only skills explicitly marked for publication are included in the totals.
  const published = useMemo(() => skills.items.filter((item) => item.visible), [skills.items])
  const groups = useMemo<SkillGroup[]>(() => {
    return CATEGORIES.map((category) => {
      const rows = published.filter((item) => item.category === category)
      return {
        category,
        rows,
        count: rows.length,
        percentage: published.length ? (rows.length / published.length) * 100 : 0,
      }
    }).sort((a, b) => b.count - a.count || CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category))
  }, [published])

  const labels: Record<Category, string> = {
    red: t.skillGroupRed,
    blue: t.skillGroupBlue,
    general: t.skillGroupGeneral,
  }
  const activeLabel = t.skillDistActive

  return (
    <section id="skills" className="page-section" aria-labelledby="skills-title">
      <div className="portfolio-container">
        <SectionHeading id="skills-title" index="04" label={t.skillsLabel} file={t.skillsFile} title={t.skillsTitle} />
        <p className="cert-intro">{t.skillsIntro}</p>

        {published.length === 0 ? <ComingSoon variant="grid" /> : (
          <div className="skills-layout" ref={ref} data-seen={seen}>
            <SkillDistribution groups={groups} total={published.length} seen={seen} />
            <div className="skills-groups">
              {groups.map((group, rank) => (
                <section
                  className="skills-group"
                  data-cat={group.category}
                  data-rank={rank}
                  key={group.category}
                  aria-labelledby={`skills-g-${group.category}`}
                >
                  <h3 id={`skills-g-${group.category}`}>
                    <span className="skills-dot" aria-hidden="true" />
                    {labels[group.category]}
                    <span className="cert-count">{group.count}</span>
                    {group.count > 0 && <span className="skills-group-percentage">{group.percentage.toFixed(1)}%</span>}
                    {group.count > 0 && <span className="skills-group-active"><i aria-hidden="true" />{activeLabel}</span>}
                  </h3>
                  {group.rows.length === 0 ? <ComingSoon variant="list" /> : (
                    <table className="skills-table">
                      <caption className="sr-only">{labels[group.category]}</caption>
                      <thead><tr><th scope="col">{t.skillColSkill}</th><th scope="col">{t.skillColLevel}</th><th scope="col">{t.skillColDesc}</th></tr></thead>
                      <tbody>
                        {group.rows.map((item, i) => (
                          <tr key={item.id} style={{ "--i": i } as CSSProperties}>
                            <th scope="row" data-label={t.skillColSkill}>{item.name}</th>
                            <td data-label={t.skillColLevel}><Level level={item.level} seen={seen} /></td>
                            <td data-label={t.skillColDesc} className={cn(!item.description[locale] && "is-blank")}>{item.description[locale]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
