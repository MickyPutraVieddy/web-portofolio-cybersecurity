export type Locale = "en" | "id"
export type Localized<T = string> = Record<Locale, T>

export type SectionId =
  | "header" | "intro" | "about" | "education" | "experience"
  | "certifications" | "skills" | "mitre" | "projects" | "training"
  | "tools" | "achievements" | "writeups" | "contact" | "footer"

export interface PortfolioSection {
  id: SectionId
  editorLabel: string
  order: number
  visible: boolean
}

export interface PortfolioProfile {
  name: string
  givenNames: string
  familyName: string
  handle: string
  brandLogo: string | null
  role: Localized
  location: Localized
  description: Localized
  resume: Localized<string | null>
  portrait: string | null
  adminLogo: string | null
  credentials: string[]
  focus: Localized<string[]>
}

export interface PortfolioPreferences {
  locale: Locale
  paused: boolean
  reducedMotion: boolean
  hidden: boolean
  hydrated: boolean
  introComplete: boolean
}
