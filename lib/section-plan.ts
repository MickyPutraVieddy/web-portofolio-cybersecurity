import type { CustomPage } from "@/lib/content-schema"
import type { SectionId } from "@/lib/portfolio-types"

/** Built-in sections that have a public component. Header and footer are pinned, never part of the flow. */
export const FLOW_SECTION_IDS = ["intro", "about", "education", "experience", "certifications", "skills", "mitre", "projects", "training", "tools", "achievements", "writeups", "contact"] as const

export interface PlanEntry {
  kind: "built-in" | "custom"
  /** Built-in section id, or the custom section id. */
  id: string
  /** DOM anchor of the section on the homepage. */
  anchor: string
  order: number
  /** Position in the visible flow, "00", "01", … — the SAME number the navbar and the section heading show. */
  number: string
}

type SectionRow = { id: SectionId; order: number; visible: boolean }

/** One ordered list for the whole homepage: visible built-in sections and visible custom sections together. */
export function buildSectionPlan(sections: SectionRow[], customs: Pick<CustomPage, "id" | "slug" | "order" | "visible">[]): PlanEntry[] {
  const flow = new Set<string>(FLOW_SECTION_IDS)
  const rows = [
    ...sections.filter((s) => s.visible && flow.has(s.id)).map((s) => ({ kind: "built-in" as const, id: s.id as string, anchor: s.id as string, order: s.order, rank: 0 })),
    ...customs.filter((c) => c.visible).map((c) => ({ kind: "custom" as const, id: c.id, anchor: `custom-${c.slug}`, order: c.order, rank: 1 })),
  ]
  rows.sort((a, b) => a.order - b.order || a.rank - b.rank)
  return rows.map((r, i) => ({ kind: r.kind, id: r.id, anchor: r.anchor, order: r.order, number: String(i).padStart(2, "0") }))
}
