"use client"

import { usePortfolio } from "@/components/language-provider"
import { cn } from "@/lib/utils"

/**
 * Public empty state ("COMING SOON"). Shown by a section / sub-section whose published data has zero items.
 * The skeleton behind is purely abstract shapes (no names, numbers, logos or dates) and is blurred;
 * the badge and text sit in the foreground, stay sharp, and follow the active language.
 * Never rendered inside the Admin editor.
 */
export function ComingSoon({ variant = "list", className }: { variant?: "list" | "grid"; className?: string }) {
  const { t } = usePortfolio()
  return (
    <div className={cn("soon", className)} data-variant={variant}>
      <div className="soon-skeleton" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div className="soon-card" key={i}>
            <span className="soon-thumb" />
            <span className="soon-lines"><i /><i /><i /></span>
          </div>
        ))}
      </div>
      <div className="soon-front">
        <span className="soon-badge">{t.emptyBadge}</span>
        <p className="soon-title">{t.emptyTitle}</p>
        <p className="soon-text">{t.emptyText}</p>
      </div>
    </div>
  )
}
