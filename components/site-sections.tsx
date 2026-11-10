"use client"

import type { ComponentType } from "react"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { EducationSection, ExperienceSection } from "@/components/timeline-section"
import { CertificationsSection } from "@/components/certifications-section"
import { SkillsSection } from "@/components/skills-section"
import { MitreSection } from "@/components/mitre-section"
import { ProjectsSection } from "@/components/projects-section"
import { TrainingSection } from "@/components/training-section"
import { AchievementsSection } from "@/components/achievements-section"
import { WriteupsSection } from "@/components/writeups-section"
import { ContactSection } from "@/components/contact-section"
import { ToolsSection } from "@/components/tools-section"
import { useContent } from "@/components/content-provider"
import type { SectionId } from "@/lib/portfolio-types"
import { CustomPageRenderer } from "@/components/custom-page-renderer"

/** Sections that are built so far. New stages register their component here. */
const registry: Partial<Record<SectionId, ComponentType>> = {
  intro: HeroSection,
  about: AboutSection,
  education: EducationSection,
  experience: ExperienceSection,
  certifications: CertificationsSection,
  skills: SkillsSection,
  mitre: MitreSection,
  projects: ProjectsSection,
  training: TrainingSection,
  tools: ToolsSection,
  achievements: AchievementsSection,
  writeups: WriteupsSection,
  contact: ContactSection,
}

export function SiteSections() {
  const { sections, customPages } = useContent()
  const builtInEntries = sections
    .filter((section) => section.visible && registry[section.id])
    .map((section) => ({ kind: "built-in" as const, id: section.id, order: section.order, section }))
  const customEntries = customPages.pages
    .filter((section) => section.visible)
    .map((section) => ({ kind: "custom" as const, id: section.id, order: section.order, section }))
  const entries = [...builtInEntries, ...customEntries].sort((a, b) => a.order - b.order)
  return (
    <>
      {entries.map((entry) => {
        if (entry.kind === "custom") return <CustomPageRenderer key={entry.id} page={entry.section} />
        const Component = registry[entry.section.id]
        return Component ? <Component key={entry.id} /> : null
      })}
    </>
  )
}
