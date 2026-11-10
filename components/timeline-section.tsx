"use client"

import { useEffect, useState } from "react"
import { Prompt, ShellWindow } from "@/components/shell-window"
import { SectionHeading } from "@/components/section-heading"
import { useInView } from "@/components/use-in-view"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import type { Locale } from "@/lib/portfolio-types"

interface TimelineProps {
  id: "education" | "experience"
  index: string
  command: (locale: Locale) => string
}

/** One shell that types `cat <file>` once, then reveals its records. */
function TimelineSection({ id, index, command }: TimelineProps) {
  const { locale, t, reducedMotion } = usePortfolio()
  const content = useContent()
  const { ref, seen } = useInView<HTMLDivElement>(0.25)
  const [typed, setTyped] = useState(0)
  const [done, setDone] = useState(false)
  const full = command(locale)
  const entries = content[id][locale]
  const title = id === "education" ? t.educationTitle : t.experienceTitle
  const file = id === "education" ? t.educationFile : t.experienceFile
  const label = id === "education" ? t.educationLabel : t.experienceLabel

  useEffect(() => {
    if (!seen) return
    if (reducedMotion) { setDone(true); return }
    let cancelled = false
    let count = 0
    const timer = window.setInterval(() => {
      if (cancelled) return
      count += 1
      setTyped(count)
      if (count >= full.length) { window.clearInterval(timer); window.setTimeout(() => !cancelled && setDone(true), 260) }
    }, 55)
    return () => { cancelled = true; window.clearInterval(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reducedMotion])

  const shownCommand = done ? full : full.slice(0, typed)
  return (
    <section id={id} className="page-section" aria-labelledby={`${id}-title`}>
      <div className="portfolio-container">
        <SectionHeading id={`${id}-title`} index={index} label={label} file={file} title={title} />
        <ShellWindow title={file} className="shell-timeline">
          <div className="shell-body" ref={ref}>
            <p className="shell-line" aria-hidden="true"><Prompt /> <span className="sh-command">{shownCommand}</span>{!done && <span className="shell-cursor" />}</p>
            <ol className="timeline" data-ready={done}>
              {entries.map((entry, i) => (
                <li key={`${entry.title}-${i}`} className="timeline-item" style={{ "--i": i } as React.CSSProperties}>
                  <span className="timeline-period">{entry.period}</span>
                  <div className="timeline-card">
                    <h3>{entry.title}</h3>
                    <p className="timeline-org">{entry.org}</p>
                    {entry.detail && <p className="timeline-detail">{entry.detail}</p>}
                    {entry.points && <ul>{entry.points.map((point) => <li key={point}>{point}</li>)}</ul>}
                  </div>
                </li>
              ))}
            </ol>
            {done && <p className="shell-line"><Prompt /> <span className="shell-cursor shell-cursor-idle" /></p>}
          </div>
        </ShellWindow>
      </div>
    </section>
  )
}

export function EducationSection() {
  return <TimelineSection id="education" index="01" command={() => "cat education.txt"} />
}
export function ExperienceSection() {
  return <TimelineSection id="experience" index="02" command={(locale) => (locale === "id" ? "cat pengalaman.txt" : "cat experience.txt")} />
}
