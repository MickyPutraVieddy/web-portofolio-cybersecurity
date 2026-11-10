import type { Locale } from "@/lib/portfolio-types"

export interface TerminalResult {
  lines: string[]
  clear?: boolean
  error?: boolean
}

const notFound: Record<Locale, (cmd: string) => string[]> = {
  en: (cmd) => [`command not found: ${cmd}`, "Type help to see available commands."],
  id: (cmd) => [`perintah tidak ditemukan: ${cmd}`, "Ketik help untuk melihat perintah yang tersedia."],
}

/**
 * Pure lookup — nothing here touches the device or a server.
 * Understands `cmd`, `cat <name>.txt` and `./<name>` as aliases of `cmd`.
 */
export function runCommand(raw: string, locale: Locale, output: Record<Locale, Record<string, string[]>>): TerminalResult {
  const input = raw.trim().slice(0, 80)
  if (!input) return { lines: [] }
  const table = output[locale]
  const parts = input.toLowerCase().split(/\s+/)
  let name = parts[0]
  if (name === "cat" && parts[1]) name = parts[1].replace(/\.txt$/, "")
  if (name === "pengalaman") name = "experience"
  if (name === "clear" || name === "cls") return { lines: [], clear: true }
  if (name === "experience") return { lines: [locale === "en" ? "See the Work Experience section below." : "Lihat bagian Pengalaman Kerja di bawah."] }
  if (name === "cert" || name === "certifications") name = "certs"
  if (name === "project") name = "projects"
  if (Object.prototype.hasOwnProperty.call(table, name)) return { lines: table[name] }
  return { lines: notFound[locale](input.split(/\s+/)[0].slice(0, 24)), error: true }
}
