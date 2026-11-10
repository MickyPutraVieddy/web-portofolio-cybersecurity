"use client"

import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
  delay?: number
  step?: number
  characters?: boolean
}

export function AnimatedText({ text, className, delay = 0, step = 45, characters = false }: AnimatedTextProps) {
  const parts = characters ? Array.from(text) : text.split(/(\s+)/)
  return (
    <span className={cn("animated-text", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {parts.map((part, index) => (
          <span
            key={index}
            className={characters ? "type-character" : "reveal-word"}
            style={{ "--reveal-delay": `${delay + index * step}ms` } as CSSProperties}
          >{part}</span>
        ))}
      </span>
    </span>
  )
}

export default AnimatedText
