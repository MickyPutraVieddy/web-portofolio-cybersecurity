import type { Locale } from "@/lib/portfolio-types"

/** Crisp SVG flags for the language switcher (3:2 ratio, no external assets). */
export function Flag({ locale, className }: { locale: Locale; className?: string }) {
  if (locale === "id") {
    return (
      <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false">
        <rect width="60" height="20" fill="#E70011" />
        <rect y="20" width="60" height="20" fill="#FFFFFF" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="2.6" />
      <path d="M30 0V40M0 20H60" stroke="#FFFFFF" strokeWidth="13" />
      <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  )
}
