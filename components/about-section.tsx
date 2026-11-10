"use client"

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { CornerDownLeft } from "lucide-react"
import { Prompt, ShellWindow } from "@/components/shell-window"
import { SectionHeading } from "@/components/section-heading"
import { useInView } from "@/components/use-in-view"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import type { SiteContent } from "@/lib/content-schema"
import { runCommand } from "@/lib/terminal-engine"
import type { Locale } from "@/lib/portfolio-types"

type Row = { label: string; value: string }
interface Step { command: string; rows?: Row[]; text?: string }

function buildSteps(content: SiteContent, locale: Locale): Step[] {
  return [
    { command: "cat about.txt", rows: content.aboutRows[locale] },
    { command: "echo $STATUS", text: content.statusLine[locale] },
  ]
}
const outLength = (step: Step) => (step.rows ? step.rows.length : 1)

/** Left shell: types its commands once when scrolled into view, then stays still. */
function AboutShell() {
  const { locale, t, reducedMotion } = usePortfolio()
  const content = useContent()
  const contentRef = useRef(content)
  contentRef.current = content
  const { ref, seen } = useInView<HTMLDivElement>(0.35)
  const [view, setView] = useState({ step: 0, typed: 0, shown: 0, done: false })
  const localeRef = useRef(locale)
  localeRef.current = locale
  const instant = reducedMotion

  useEffect(() => {
    if (!seen) return
    if (instant) { setView((v) => ({ ...v, done: true })); return }
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) => new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)))
    ;(async () => {
      const steps = buildSteps(contentRef.current, localeRef.current)
      for (let s = 0; s < steps.length; s++) {
        const command = steps[s].command
        for (let c = 1; c <= command.length; c++) {
          if (cancelled) return
          setView({ step: s, typed: c, shown: 0, done: false })
          await wait(55)
        }
        await wait(280)
        const total = outLength(buildSteps(contentRef.current, localeRef.current)[s])
        for (let l = 1; l <= total; l++) {
          if (cancelled) return
          setView({ step: s, typed: command.length, shown: l, done: false })
          await wait(130)
        }
        await wait(340)
      }
      if (!cancelled) setView((v) => ({ ...v, done: true }))
    })()
    return () => { cancelled = true; timers.forEach((id) => window.clearTimeout(id)) }
  }, [seen, instant])

  const steps = buildSteps(content, locale)

  return (
    <ShellWindow title={`${t.shellStatic}`} className="shell-static">
      <div className="shell-body" ref={ref} aria-label={t.aboutTitle}>
        <div className="sr-only">
          {steps[0].rows!.map((row, i) => <p key={i}>{row.label}: {row.value}</p>)}
          <p>{steps[1].text}</p>
        </div>
        <div aria-hidden="true">
          {steps.map((step, index) => {
            const active = !view.done && index === view.step
            const visible = view.done || index < view.step || active
            if (!visible && !(index === 0)) return null
            const typed = view.done || index < view.step ? step.command : active ? step.command.slice(0, view.typed) : ""
            const shown = view.done || index < view.step ? outLength(step) : active ? view.shown : 0
            return (
              <div key={step.command} className="shell-block">
                <p className="shell-line"><Prompt /> <span className="sh-command">{typed}</span>{active && shown === 0 && <span className="shell-cursor" />}</p>
                {step.rows && shown > 0 && (
                  <dl className="about-rows">
                    {step.rows.slice(0, shown).map((row, i) => (
                      <div key={i} className="shell-reveal"><dt>{row.label}:</dt><dd>{row.value}</dd></div>
                    ))}
                  </dl>
                )}
                {step.text && shown > 0 && <p className="sh-value shell-reveal">{step.text}</p>}
              </div>
            )
          })}
          {(view.done || (view.step === steps.length - 1 && view.shown === 1)) && (
            <p className="shell-line"><Prompt /> <span className="shell-cursor shell-cursor-idle" /></p>
          )}
        </div>
      </div>
    </ShellWindow>
  )
}

type Line = { kind: "cmd" | "out" | "err" | "note"; text: string }

/** Right shell: a safe, front-end-only command lookup. */
function InteractiveShell() {
  const { locale, t } = usePortfolio()
  const { terminalOutput, quickCommands } = useContent()
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState("")
  const [showIntro, setShowIntro] = useState(true)
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const bodyRef = useRef<HTMLDivElement>(null)

  function execute(raw: string) {
    const input = raw.trim()
    if (!input) return
    history.current = [input, ...history.current].slice(0, 30)
    cursor.current = -1
    const result = runCommand(input, locale, terminalOutput)
    if (result.clear) { setLines([]); setShowIntro(false); return }
    setLines((current) => [
      ...current.slice(-80),
      { kind: "cmd", text: input },
      ...result.lines.map((text): Line => ({ kind: result.error ? "err" : "out", text })),
    ])
  }

  // Keep the newest output visible inside the shell only (never scrolls the page).
  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [lines])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    execute(value)
    setValue("")
  }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    const list = history.current
    if (!list.length) return
    cursor.current = event.key === "ArrowUp" ? Math.min(cursor.current + 1, list.length - 1) : Math.max(cursor.current - 1, -1)
    setValue(cursor.current === -1 ? "" : list[cursor.current])
  }

  const intro = runCommand("help", locale, terminalOutput).lines

  return (
    <ShellWindow title={t.shellInteractive} badge={t.shellBadge} className="shell-interactive">
      <div className="shell-body" ref={bodyRef}>
        {showIntro && (
          <>
            <p className="shell-note">{t.shellNote}</p>
            <div className="shell-block">
              <p className="shell-line"><Prompt /> <span className="sh-command">help</span></p>
              {intro.map((text, index) => <p key={index} className="sh-out">{text}</p>)}
            </div>
          </>
        )}
        {lines.map((line, index) => line.kind === "cmd"
          ? <p key={index} className="shell-line shell-gap"><Prompt /> <span className="sh-command">{line.text}</span></p>
          : <p key={index} className={line.kind === "err" ? "sh-err" : "sh-out"}>{line.text}</p>)}
      </div>
      <form className="shell-input" onSubmit={onSubmit}>
        <Prompt />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.shellPlaceholder}
          aria-label={t.shellPlaceholder}
          maxLength={80}
          autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false}
        />
        <button type="submit" aria-label={t.shellRun}><CornerDownLeft aria-hidden="true" /></button>
      </form>
      <div className="shell-quick">
        <span>{t.shellQuick}</span>
        <ul>{quickCommands.map((command) => <li key={command}><button type="button" onClick={() => execute(command)}>{command}</button></li>)}</ul>
      </div>
      <p className="shell-hint">{t.shellHint}</p>
    </ShellWindow>
  )
}

export function AboutSection() {
  const { t } = usePortfolio()
  return (
    <section id="about" className="page-section" aria-labelledby="about-title">
      <div className="portfolio-container">
        <SectionHeading id="about-title" index="00" label={t.aboutLabel} file={t.aboutFile} title={t.aboutTitle} />
        <div className="about-grid">
          <AboutShell />
          <InteractiveShell />
        </div>
      </div>
    </section>
  )
}
