"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Accessible modal dialog: portal to <body>, Esc / backdrop / close button close it,
 * focus moves into the dialog, is trapped while open and is restored on close, page scroll is locked.
 * Reuses the .cert-modal look so every page's dialog matches.
 */
export function ModalShell({ onClose, labelledBy, closeLabel, className, children }: { onClose: () => void; labelledBy: string; closeLabel: string; className?: string; children: ReactNode }) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButton.current?.focus()
    return () => { document.body.style.overflow = overflow; previous?.focus?.() }
  }, [])

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") { event.stopPropagation(); onClose(); return }
    if (event.key !== "Tab" || !dialog.current) return
    const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
    if (focusable.length === 0) return
    const first = focusable[0], last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return createPortal(
    <div className="cert-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} onKeyDown={onKeyDown}>
      <div className={cn("cert-modal-card", className)} role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={dialog}>
        <button type="button" className="cert-modal-close" ref={closeButton} onClick={onClose} aria-label={closeLabel}><X aria-hidden="true" /></button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
