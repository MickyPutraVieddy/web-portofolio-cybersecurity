// Pure display helpers for the admin visitor panel (kept out of the component so they can be unit-tested).

/** "just now", "3 min ago", "2 h ago", then the date. */
export function ago(t: number, now: number): string {
  const s = Math.max(0, Math.round((now - t) / 1000))
  if (s < 45) return "just now"
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`
  if (s < 86_400) return `${Math.round(s / 3600)} h ago`
  return new Date(t).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
}

/** Change against the period before: a percentage, "new" when there was nothing before, or null when both are zero. */
export function delta(current: number, previous: number): { text: string; dir: "up" | "down" | "flat" } | null {
  if (current === 0 && previous === 0) return null
  if (previous === 0) return { text: "new", dir: "up" }
  const pct = Math.round(((current - previous) / previous) * 100)
  return pct === 0 ? { text: "0%", dir: "flat" } : { text: `${pct > 0 ? "+" : ""}${pct}%`, dir: pct > 0 ? "up" : "down" }
}
