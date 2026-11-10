"use client"

import { ArrowUpRight, Check, ChevronRight, Code2, MapPin, Pause, Play, ShieldCheck, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedText } from "@/components/animated-text"
import { CelestialBackground } from "@/components/celestial-background"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"

export function HeroSection() {
  const { locale, t, paused, reducedMotion, introComplete, update } = usePortfolio()
  const { profile } = useContent()
  const resume = profile.resume[locale]

  return (
    <main id="intro" tabIndex={-1} className="intro-section" data-intro-complete={introComplete}>
      <div className="portfolio-container">
        <div className="section-heading">
          <div className="file-path"><Terminal aria-hidden="true" /><span>~/portfolio</span><span className="path-divider">/</span><span className="path-current">intro.txt</span></div>
          <div className="section-number"><span className="section-number-line" /><span>00 — {t.introduction}</span></div>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="intro-eyebrow"><span className="eyebrow-line" /><AnimatedText text={t.introducing} delay={100} step={40} /></p>
            <p className="hero-greeting"><AnimatedText text={t.hello} delay={300} step={60} /></p>
            <h1 className="hero-name">
              <span className="block"><AnimatedText text={profile.givenNames} delay={500} step={70} /></span>
              <span className="hero-family-name"><AnimatedText text={profile.familyName} delay={750} /><span className="name-period">.</span></span>
            </h1>
            <div className="hero-role"><ChevronRight aria-hidden="true" /><p><AnimatedText text={profile.role[locale]} characters delay={1100} step={47} /><span className="typing-cursor" aria-hidden="true" /></p></div>
            <p className="hero-description"><AnimatedText text={profile.description[locale]} delay={1500} step={16} /></p>
            <ul className="credential-list" aria-label={locale === "en" ? "Certifications" : "Sertifikasi"}>
              {profile.credentials.map((credential, n) => <li key={`${n}-${credential}`}><ShieldCheck aria-hidden="true" /><span>{credential}</span></li>)}
            </ul>
            <div className="hero-actions">
              <div className="resume-action">
                {resume ? (
                  <Button variant="resume" size="lg" asChild className="h-12 gap-6 rounded-sm">
                    <a href={resume} target="_blank" rel="noopener noreferrer">{t.resume}<ArrowUpRight data-icon="inline-end" /></a>
                  </Button>
                ) : (
                  <Button variant="resume" size="lg" disabled aria-describedby="resume-status" className="h-12 gap-6 rounded-sm">{t.resume}<ArrowUpRight data-icon="inline-end" /></Button>
                )}
                {!resume && <span id="resume-status" className="resume-status">{t.resumeUnavailable}</span>}
              </div>
              <div className="location-info"><MapPin aria-hidden="true" /><div><span>{t.locationLabel}</span><p>{profile.location[locale]}</p></div></div>
            </div>
          </div>
          <CelestialBackground />
        </div>
        <div className="intro-bottom">
          <div className="focus-summary"><span className="focus-label">{t.focusLabel}</span><ul>{profile.focus[locale].map((item, n) => <li key={`${n}-${item}`}><span aria-hidden="true" />{item}</li>)}</ul></div>
          <div className="motion-control">
            <Button variant="ghost" size="sm" onClick={() => update({ paused: !paused, introComplete: true })} aria-pressed={paused} aria-label={reducedMotion ? t.reducedMotionHint : paused ? t.play : t.pause} disabled={reducedMotion}>
              {paused || reducedMotion ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}
              <span>{reducedMotion ? t.reducedMotion : paused ? t.motionOff : t.motionOn}</span>
            </Button>
          </div>
        </div>
        <div className="intro-note"><span><Code2 aria-hidden="true" />{t.philosophy} <span className="philosophy-extra">{t.philosophyEnd}</span></span><span className="note-signature"><Check aria-hidden="true" />{t.signature}</span></div>
      </div>
    </main>
  )
}
