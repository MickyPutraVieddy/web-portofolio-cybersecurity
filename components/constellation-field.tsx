"use client"

import { useEffect, useRef } from "react"
import { usePortfolio } from "@/components/language-provider"
import { useContent } from "@/components/content-provider"
import { visualSettings } from "@/lib/portfolio-content"

type Point = [number, number]
interface Constellation {
  name: string
  /** star positions, normalised 0..1 of the hero canvas */
  stars: Point[]
  /** index pairs joined by a line */
  edges: [number, number][]
}

/** Stylised zodiac constellations. Shapes are simplified, not astronomical charts. */
const constellations: Constellation[] = [
  { name: "Aries", stars: [[0.06, 0.2], [0.1, 0.17], [0.14, 0.18], [0.165, 0.23]], edges: [[0, 1], [1, 2], [2, 3]] },
  { name: "Taurus", stars: [[0.22, 0.74], [0.27, 0.78], [0.31, 0.74], [0.35, 0.7], [0.3, 0.66], [0.26, 0.62], [0.33, 0.83]], edges: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [1, 6]] },
  { name: "Gemini", stars: [[0.46, 0.1], [0.48, 0.17], [0.47, 0.25], [0.5, 0.31], [0.55, 0.09], [0.55, 0.17], [0.56, 0.26], [0.59, 0.3]], edges: [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [1, 5]] },
  { name: "Leo", stars: [[0.7, 0.14], [0.73, 0.09], [0.77, 0.08], [0.8, 0.12], [0.79, 0.18], [0.75, 0.21], [0.85, 0.23], [0.92, 0.19], [0.9, 0.29]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [6, 7], [7, 8], [6, 8]] },
  { name: "Libra", stars: [[0.9, 0.55], [0.95, 0.5], [0.97, 0.59], [0.92, 0.66]], edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] },
  { name: "Scorpius", stars: [[0.58, 0.86], [0.62, 0.82], [0.66, 0.85], [0.7, 0.88], [0.74, 0.86], [0.77, 0.9], [0.8, 0.95], [0.84, 0.93], [0.85, 0.88]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]] },
  { name: "Sagittarius", stars: [[0.4, 0.5], [0.44, 0.46], [0.48, 0.5], [0.47, 0.56], [0.42, 0.57], [0.52, 0.43]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 5]] },
]

const INFLUENCE = 240 // px: how far the pointer lights up the sky

export function ConstellationField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { motionEnabled } = usePortfolio()
  const { appearance } = useContent()
  const themePalettes = { blue: "#55aaff", red: "#ff647c", purple: "#b58cff", general: "#45d6c0" } as const
  const accentHex = appearance.preset === "custom" ? appearance.accentColor : themePalettes[appearance.preset]
  const cursorIntensityFactor = appearance.cursorEffect
    ? Math.max(0, Math.min(1, appearance.cursorIntensity / 100))
    : 0

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let frame = 0
    let target: { x: number; y: number } | null = null
    let current: { x: number; y: number } | null = null
    let strength = 0 // 0..1, fades the pointer effects in/out
    let seed = 403
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    const field = Array.from({ length: visualSettings.starCount }, () => ({
      x: random(), y: random(), radius: 0.4 + random() * 1.0,
      opacity: 0.1 + random() * 0.35, phase: random() * Math.PI * 2, speed: 0.4 + random() * 0.9,
    }))
    const glow = [1, 3, 5].map((index) => Number.parseInt(accentHex.slice(index, index + 2), 16)).join(", ")
    const star = "150, 190, 235"

    // Pixel positions of every constellation star, rebuilt on resize.
    let placed: { stars: Point[]; edges: [number, number][] }[] = []
    function layout() {
      placed = constellations.map((c) => ({
        stars: c.stars.map(([x, y]) => [x * width, y * height] as Point),
        edges: c.edges,
      }))
    }

    function drawFieldStars(time: number) {
      for (const s of field) {
        const twinkle = motionEnabled ? 0.65 + 0.35 * Math.sin(time * 0.001 * s.speed + s.phase) : 1
        context!.beginPath()
        context!.arc(s.x * width, s.y * height, s.radius, 0, Math.PI * 2)
        context!.fillStyle = `rgba(${star}, ${s.opacity * twinkle})`
        context!.fill()
      }
    }

    function drawConstellations() {
      const px = current?.x ?? -9999
      const py = current?.y ?? -9999
      for (const c of placed) {
        // Lines: faint at rest, bright where the pointer is close.
        for (const [a, b] of c.edges) {
          const [ax, ay] = c.stars[a]
          const [bx, by] = c.stars[b]
          const near = Math.max(0, 1 - Math.hypot((ax + bx) / 2 - px, (ay + by) / 2 - py) / INFLUENCE) * strength * cursorIntensityFactor
          context!.strokeStyle = `rgba(${glow}, ${0.075 + near * 0.58})`
          context!.lineWidth = 0.6 + near * 1.1
          context!.beginPath()
          context!.moveTo(ax, ay)
          context!.lineTo(bx, by)
          context!.stroke()
        }
        // Stars: swell and brighten near the pointer.
        for (const [x, y] of c.stars) {
          const near = Math.max(0, 1 - Math.hypot(x - px, y - py) / INFLUENCE) * strength * cursorIntensityFactor
          const radius = 1.3 + near * 2.4
          if (near > 0.05) {
            const halo = context!.createRadialGradient(x, y, 0, x, y, radius * 5)
            halo.addColorStop(0, `rgba(${glow}, ${0.35 * near})`)
            halo.addColorStop(1, `rgba(${glow}, 0)`)
            context!.fillStyle = halo
            context!.beginPath()
            context!.arc(x, y, radius * 5, 0, Math.PI * 2)
            context!.fill()
          }
          context!.beginPath()
          context!.arc(x, y, radius, 0, Math.PI * 2)
          context!.fillStyle = `rgba(${glow}, ${0.48 + near * 0.45})`
          context!.fill()
        }
      }
    }

    function drawPointer() {
      if (!current || strength < 0.01) return
      const { x, y } = current
      // Lines from the pointer to the closest constellation stars.
      const nearby: { x: number; y: number; d: number }[] = []
      for (const c of placed) for (const [sx, sy] of c.stars) {
        const d = Math.hypot(sx - x, sy - y)
        if (d < INFLUENCE) nearby.push({ x: sx, y: sy, d })
      }
      nearby.sort((a, b) => a.d - b.d)
      for (const n of nearby.slice(0, 4)) {
        context!.strokeStyle = `rgba(${glow}, ${(1 - n.d / INFLUENCE) * 0.5 * strength * cursorIntensityFactor})`
        context!.lineWidth = 0.7
        context!.setLineDash([3, 5])
        context!.beginPath()
        context!.moveTo(x, y)
        context!.lineTo(n.x, n.y)
        context!.stroke()
      }
      context!.setLineDash([])
      // Longitude (meridian) rings around the pointer, like a tiny celestial globe.
      context!.strokeStyle = `rgba(${glow}, ${0.38 * strength * cursorIntensityFactor})`
      context!.lineWidth = 0.8
      for (const rx of [26, 12]) {
        context!.beginPath()
        context!.ellipse(x, y, rx, 26, 0, 0, Math.PI * 2)
        context!.stroke()
      }
      context!.strokeStyle = `rgba(${glow}, ${0.22 * strength * cursorIntensityFactor})`
      context!.beginPath()
      context!.moveTo(x - 38, y); context!.lineTo(x + 38, y)
      context!.moveTo(x, y - 38); context!.lineTo(x, y + 38)
      context!.stroke()
      context!.beginPath()
      context!.arc(x, y, 2, 0, Math.PI * 2)
      context!.fillStyle = `rgba(${glow}, ${0.9 * strength * cursorIntensityFactor})`
      context!.fill()
    }

    function draw(time: number) {
      context!.clearRect(0, 0, width, height)
      if (target) {
        current = current ? { x: current.x + (target.x - current.x) * 0.16, y: current.y + (target.y - current.y) * 0.16 } : { ...target }
      }
      strength += ((target && motionEnabled && appearance.cursorEffect && cursorIntensityFactor > 0 ? 1 : 0) - strength) * 0.12
      drawFieldStars(time)
      drawConstellations()
      drawPointer()
    }

    function loop(time: number) {
      draw(time)
      const settled = !target && strength < 0.01
      // Keep animating while twinkling or while pointer effects are fading.
      frame = motionEnabled || !settled ? requestAnimationFrame(loop) : 0
    }
    function start() {
      if (!frame) frame = requestAnimationFrame(loop)
    }
    function resize() {
      if (!canvas || !context) return
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      layout()
      draw(performance.now())
    }
    function onPointer(event: PointerEvent) {
      if (!canvas || !motionEnabled || !appearance.cursorEffect || cursorIntensityFactor <= 0 || event.pointerType === "touch") return
      const rect = canvas.getBoundingClientRect()
      target = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      start()
    }
    function leave() { target = null; start() }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    if (motionEnabled) start()
    if (motionEnabled && appearance.cursorEffect && cursorIntensityFactor > 0) {
      window.addEventListener("pointermove", onPointer, { passive: true })
      document.documentElement.addEventListener("pointerleave", leave)
    }
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onPointer)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [motionEnabled, accentHex, appearance.cursorEffect, cursorIntensityFactor])

  return <canvas ref={canvasRef} aria-hidden="true" className="constellation-field" />
}
