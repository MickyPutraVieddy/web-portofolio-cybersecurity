"use client"

import { Terminal } from "lucide-react"
import { useContent } from "@/components/content-provider"
import { buildSectionPlan } from "@/lib/section-plan"

/**
 * The number is computed from the live section order, so it always matches the navbar,
 * even after sections are moved, removed or custom sections are added in Sections & order.
 * `anchor` defaults to the heading id without its "-title" suffix (e.g. "about-title" -> "about").
 */
export function SectionHeading({ id, index, label, file, title, anchor }: { id: string; index?: string; label: string; file: string; title: string; anchor?: string }) {
  const { sections, customPages } = useContent()
  const key = anchor ?? id.replace(/-title$/, "")
  const found = buildSectionPlan(sections, customPages.pages).find((entry) => entry.anchor === key)
  const number = found?.number ?? index ?? "--"
  return (
    <div className="section-head">
      <div className="section-heading">
        <div className="file-path"><Terminal aria-hidden="true" /><span>~/portfolio</span><span className="path-divider">/</span><span className="path-current">{file}</span></div>
        <div className="section-number"><span className="section-number-line" /><span>{number} — {label}</span></div>
      </div>
      <h2 id={id} className="section-title"><span aria-hidden="true">{"//"}</span> {title}</h2>
    </div>
  )
}
