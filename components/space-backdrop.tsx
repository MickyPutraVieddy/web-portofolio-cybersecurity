"use client"

import { useEffect, useRef, useState } from "react"
import { usePortfolio } from "@/components/language-provider"
import { ConstellationField } from "@/components/constellation-field"
import { useContent } from "@/components/content-provider"

type Meteor = { id: number; top: number; left: number; duration: number; delay: number }


function CelestialCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const { appearance } = useContent()
  const { motionEnabled } = usePortfolio()

  useEffect(() => {
    const node = ref.current
    if (!node || !appearance.cursorEffect || appearance.cursorIntensity <= 0 || !motionEnabled || !window.matchMedia("(pointer: fine)").matches) return
    let raf = 0
    let x = -100, y = -100
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      x = event.clientX; y = event.clientY
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => { if (node) node.style.transform = `translate3d(${x}px, ${y}px, 0)` })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => { window.removeEventListener("pointermove", onMove); if (raf) cancelAnimationFrame(raf) }
  }, [appearance.cursorEffect, appearance.cursorIntensity, motionEnabled])

  if (!appearance.cursorEffect || appearance.cursorIntensity <= 0 || !motionEnabled) return null
  return <div ref={ref} className="celestial-cursor" aria-hidden="true"><span className="celestial-cursor-ring" /><span className="celestial-cursor-core" /></div>
}

/** Shared decorative sky for every public section; never intercepts page interaction. */
export function SpaceBackdrop() {
  const { motionEnabled } = usePortfolio()
  const [meteor, setMeteor] = useState<Meteor | null>(null)

  useEffect(() => {
    if (!motionEnabled) { setMeteor(null); return }
    let timer: ReturnType<typeof setTimeout>
    let id = 0
    let alive = true
    const schedule = () => {
      // A new shooting star appears after a deliberately irregular 7–24 second interval.
      timer = setTimeout(() => {
        if (!alive) return
        setMeteor({ id: ++id, top: 5 + Math.random() * 66, left: 48 + Math.random() * 48, duration: 900 + Math.random() * 850, delay: 0 })
        timer = setTimeout(() => { if (alive) setMeteor(null); if (alive) schedule() }, 1900)
      }, 7000 + Math.random() * 17000)
    }
    schedule()
    return () => { alive = false; clearTimeout(timer) }
  }, [motionEnabled])

  return (
    <>
    <div className="space-backdrop" aria-hidden="true" data-motion={motionEnabled ? "on" : "off"}>
      <div className="space-nebula space-nebula-a" />
      <div className="space-nebula space-nebula-b" />
      <div className="space-starfield space-starfield-far" />
      <div className="space-starfield space-starfield-near" />
      <div className="space-constellation space-constellation-one" />
      <div className="space-constellation space-constellation-two" />
      <div className="space-constellation space-constellation-three" />
      <div className="space-constellation space-constellation-four" />
      {/* The zodiac sky lives HERE (fixed to the viewport, behind every section) so it is one continuous background from the top of the page to the footer. */}
      <ConstellationField />
      <svg className="space-zodiac-network" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g className="zodiac-network-lines">
          <path d="M42 186 L138 142 L226 164 L294 242 L390 224 L474 286" />
          <path d="M890 96 L972 142 L1060 112 L1162 166 L1265 132 L1374 208" />
          <path d="M120 690 L218 620 L310 658 L394 584 L488 622 L570 548" />
          <path d="M824 740 L916 674 L1008 714 L1094 634 L1194 680 L1320 606" />
          <path d="M570 80 L632 166 L712 140 L782 226 L854 202" />
        </g>
        <g className="zodiac-network-stars">
          {[[42,186],[138,142],[226,164],[294,242],[390,224],[474,286],[890,96],[972,142],[1060,112],[1162,166],[1265,132],[1374,208],[120,690],[218,620],[310,658],[394,584],[488,622],[570,548],[824,740],[916,674],[1008,714],[1094,634],[1194,680],[1320,606],[570,80],[632,166],[712,140],[782,226],[854,202]].map(([cx,cy], index) => <circle key={index} cx={cx} cy={cy} r={index % 4 === 0 ? 2.2 : 1.5} />)}
        </g>
      </svg>
      {meteor && <span key={meteor.id} className="shooting-star" style={{ top: `${meteor.top}%`, left: `${meteor.left}%`, animationDuration: `${meteor.duration}ms` }} />}
      {motionEnabled && <div className="spacecraft"><span className="spacecraft-flame" /><span className="spacecraft-body" /><span className="spacecraft-wing" /></div>}
    </div>
    {/* Keep the cursor in the portfolio stacking context, not inside the backdrop's negative z-index layer. */}
    <CelestialCursor />
    </>
  )
}
