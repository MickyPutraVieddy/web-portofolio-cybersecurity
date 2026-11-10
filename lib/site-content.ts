import { siteContentSchema, type SiteContent } from "@/lib/content-schema"
import { aboutRows, copy, education, experience, portfolioSections, profile, quickCommands, statusLine, terminalOutput } from "@/lib/portfolio-content"

/** The content the site ships with. Admin edits are stored as a full document and merged over this. */
export const defaultContent: SiteContent = {
  version: 0,
  appearance: { preset: "blue", accentColor: "#55aaff", secondaryColor: "#48c8e8", glow: 35, cursorEffect: true, cursorIntensity: 35, headingFont: "inter", bodyFont: "inter", monoFont: "plex-mono", headingWeight: "700" },
  customPages: { pages: [], templates: [] },
  profile: JSON.parse(JSON.stringify(profile)),
  copy: JSON.parse(JSON.stringify(copy)),
  aboutRows: JSON.parse(JSON.stringify(aboutRows)),
  statusLine: JSON.parse(JSON.stringify(statusLine)),
  terminalOutput: JSON.parse(JSON.stringify(terminalOutput)),
  quickCommands: [...quickCommands],
  education: JSON.parse(JSON.stringify(education)),
  experience: JSON.parse(JSON.stringify(experience)),
  certifications: { items: [] },
  mitre: { items: [] },
  projects: { items: [] },
  training: { items: [] },
  tools: { items: [] },
  achievements: { items: [] },
  writeups: { items: [] },
  contact: { email: "", socials: [] },
  footer: {
    tagline: {
      en: "Thanks for exploring my security portfolio. Built with intent, driven by curiosity.",
      id: "Terima kasih sudah menjelajahi portofolio keamanan saya. Dibangun dengan tujuan, didorong rasa ingin tahu.",
    },
    connectLabel: { en: "CONNECT WITH ME", id: "TERHUBUNG DENGAN SAYA" },
    transmissionLabel: { en: "END OF TRANSMISSION", id: "AKHIR TRANSMISI" },
    statusLabel: { en: "SECURE CHANNEL ONLINE", id: "KANAL AMAN AKTIF" },
    bottomNote: { en: "DESIGNED FOR THE CURIOUS · BUILT WITH INTENT", id: "DIRANCANG UNTUK YANG INGIN TAHU · DIBANGUN DENGAN TUJUAN" },
    backToTopLabel: { en: "BACK TO TOP ↑", id: "KEMBALI KE ATAS ↑" },
    rightsText: { en: "All rights reserved.", id: "Hak cipta dilindungi." },
    copyrightName: profile.name,
    showStatus: true,
    showSocials: true,
    showEmail: true,
    showBottomNote: true,
    showBackToTop: true,
    showCopyright: true,
  },
  skills: { image: null, imageAlt: { en: "", id: "" }, items: [] },
  sections: JSON.parse(JSON.stringify(portfolioSections)),
}

const isPlain = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

/** Objects merge key by key (so new default keys appear); arrays and primitives from `stored` win. */
function deepMerge(base: unknown, stored: unknown): unknown {
  if (isPlain(base) && isPlain(stored)) {
    const result: Record<string, unknown> = { ...base }
    for (const key of Object.keys(stored)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue
      result[key] = key in base ? deepMerge(base[key], stored[key]) : stored[key]
    }
    return result
  }
  return stored === undefined ? base : stored
}

/** Never throws: invalid or missing stored data falls back to the defaults. */
export function mergeContent(stored: unknown): SiteContent {
  if (!isPlain(stored)) return defaultContent
  const parsed = siteContentSchema.safeParse(deepMerge(defaultContent, stored))
  return parsed.success ? parsed.data : defaultContent
}
