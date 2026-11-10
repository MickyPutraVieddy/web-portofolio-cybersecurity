"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import Image from "next/image"
import { Crosshair, MousePointer2, ShieldCheck, UserRound } from "lucide-react"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { visualSettings } from "@/lib/portfolio-content"

export function CelestialBackground() {
  const layerRef = useRef<HTMLDivElement>(null)
  const { t, motionEnabled } = usePortfolio()
  const { profile } = useContent()

  useEffect(() => {
    const element = layerRef.current
    if (!element || !motionEnabled) return
    let frame = 0
    let x = 0
    let y = 0
    function onPointer(event: PointerEvent) {
      if (event.pointerType === "touch") return
      x = (event.clientX / window.innerWidth - 0.5) * visualSettings.parallaxStrength
      y = (event.clientY / window.innerHeight - 0.5) * visualSettings.parallaxStrength
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        element?.style.setProperty("--parallax-x", `${x}px`)
        element?.style.setProperty("--parallax-y", `${y}px`)
      })
    }
    window.addEventListener("pointermove", onPointer, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onPointer)
    }
  }, [motionEnabled])

  return (
    <figure className="celestial-figure" data-motion={motionEnabled ? "running" : "paused"}>
      <div className="scene-index"><span className="scene-index-line" /><span>FIG. 01</span><span className="scene-index-divider">/</span><span>{t.sceneLabel}</span></div>
      <div className="celestial-visual" aria-hidden="true">
        <div className="celestial-parallax" ref={layerRef}>
          <div className="celestial-halo" />
          <div className="celestial-float">
            <div className="celestial-rotor" style={{ "--orbit-duration": `${visualSettings.orbitDurationSeconds}s` } as CSSProperties}>
              <Image src={visualSettings.zodiacAsset} alt="" width={1000} height={1000} priority className="celestial-asset" />
            </div>
            <div className="orbit-dial" />
            <div className="orbit-dial orbit-dial-inner" />
            <div className="celestial-core">
              <span className="core-crosshair core-crosshair-horizontal" />
              <span className="core-crosshair core-crosshair-vertical" />
              <div className="core-disc"><ShieldCheck strokeWidth={1.1} /><span>{t.blueTeam}</span></div>
            </div>
            <span className="orbit-spark orbit-spark-one" />
            <span className="orbit-spark orbit-spark-two" />
          </div>
          <div className="orbit-label orbit-label-top"><ShieldCheck /><span>{t.defense}</span><span className="orbit-label-dot" /></div>
          <div className="orbit-label orbit-label-bottom"><Crosshair /><span>{t.threatAnalysis}</span></div>
          <span className="scene-coordinate scene-coordinate-left">270°</span>
          <span className="scene-coordinate scene-coordinate-right">090°</span>
        </div>
      </div>
      <div className="intro-portrait-frame" aria-label={profile.portrait ? `${profile.name} profile portrait` : "Profile photo placeholder"}>
        <span className="intro-portrait-orbit" aria-hidden="true" />
        <span className="intro-portrait-led" aria-hidden="true" />
        {profile.portrait
          ? <Image src={profile.portrait} alt={profile.name} width={320} height={320} className="intro-portrait-image" />
          : <div className="intro-portrait-placeholder" aria-hidden="true"><UserRound /><span>PROFILE</span></div>}
      </div>
      <figcaption className="scene-caption">
        <span className="scene-caption-rule" />
        <span className="pointer-instruction"><MousePointer2 aria-hidden="true" />{t.interact}</span>
        <span className="touch-instruction">{t.touchHint}</span>
        <span className="scene-caption-rule" />
      </figcaption>
    </figure>
  )
}
