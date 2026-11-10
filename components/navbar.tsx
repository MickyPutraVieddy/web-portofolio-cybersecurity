"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, Shield, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { usePortfolio } from "@/components/language-provider"
import { Flag } from "@/components/flags"
import { useContent } from "@/components/content-provider"
import { buildSectionPlan } from "@/lib/section-plan"
import { cn } from "@/lib/utils"

function LanguageFlag({ locale }: { locale: "en" | "id" }) {
  return <Flag locale={locale} className="language-flag" />
}


/** Highlights the nav link of the section currently in the middle of the viewport. */
function useActiveSection(anchors: string[]) {
  const [active, setActive] = useState<string>("intro")
  const anchorKey = anchors.join("|")
  useEffect(() => {
    const elements = (anchorKey ? anchorKey.split("|") : []).map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
    }, { rootMargin: "-40% 0px -55% 0px" })
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [anchorKey])
  return active
}

export function Navbar() {
  const { locale, setLocale, t, hydrated } = usePortfolio()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { profile, sections, customPages } = useContent()
  const pathname = usePathname()
  const navDefinitions = [
    { id: "intro", label: t.introduction },
    { id: "about", label: t.navAbout },
    { id: "education", label: t.navEducation },
    { id: "experience", label: t.navExperience },
    { id: "certifications", label: t.navCertifications },
    { id: "skills", label: t.navSkills },
    { id: "mitre", label: t.navMitre },
    { id: "projects", label: t.navProjects },
    { id: "training", label: t.navTraining },
    { id: "tools", label: t.navTools },
    { id: "achievements", label: t.navAchievements },
    { id: "writeups", label: t.navWriteups },
    { id: "contact", label: t.navContact },
  ]
  // Same ordered list the page renders and the headings are numbered from, so nav number == heading number.
  const plan = buildSectionPlan(sections, customPages.pages)
  const active = useActiveSection(plan.map((entry) => entry.anchor))
  const labelOf = new Map(navDefinitions.map((link) => [link.id, link.label]))
  const links = plan.flatMap((entry) => {
    if (entry.kind === "built-in") {
      const label = labelOf.get(entry.id)
      return label ? [{ id: entry.anchor, label, number: entry.number, href: pathname === "/" ? `#${entry.anchor}` : `/#${entry.anchor}` }] : []
    }
    const page = customPages.pages.find((item) => item.id === entry.id)
    if (!page || !page.showInNav) return []
    return [{ id: entry.anchor, label: page.title[locale] || page.title.en, number: entry.number, href: pathname === "/" ? `#${entry.anchor}` : `/#${entry.anchor}` }]
  })

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={cn("site-header", isScrolled && "is-scrolled")} data-hydrated={hydrated}>
      <a href="#intro" className="skip-link">{t.skip}</a>
      <div className="header-inner">
        <a href="#intro" className="brand" aria-label={t.backHome}>
          <span className="brand-mark" aria-hidden="true">
            {profile.brandLogo ? <img src={profile.brandLogo} alt="" /> : <><Shield /><span className="brand-cross">+</span></>}
          </span>
          <span className="brand-text">{profile.handle}<span className="brand-dot">.</span></span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-descriptor">{t.portfolio}</span>
        </a>
        <nav aria-label="Sections" className="desktop-navigation">
          {links.map((link) => (
            <a key={link.id} href={link.href} className={cn("nav-link", pathname === "/" && active === link.id && "active-nav")} aria-current={pathname === "/" && active === link.id ? "page" : undefined}>
              <span>{link.number}</span> {link.label}
              {pathname === "/" && active === link.id && <span className="nav-indicator" aria-hidden="true" />}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label={t.language} className="gap-2.5">
                <LanguageFlag locale={locale} />
                <span>{locale === "en" ? "EN" : "ID"}</span>
                <ChevronDown data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t.language}</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value === "id" ? "id" : "en")}>
                  <DropdownMenuRadioItem value="en" className="gap-3 py-3"><LanguageFlag locale="en" /> English</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="id" className="gap-3 py-3"><LanguageFlag locale="id" /> Bahasa Indonesia</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <a href="/admin/login" target="_top" className="admin-entry" aria-label={t.adminLabel} title={t.adminLabel}>
            {profile.adminLogo ? <img src={profile.adminLogo} alt="" /> : <User aria-hidden="true" />}
          </a>
          <span className="header-availability"><span className="status-dot" />{t.availableShort}</span>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? t.menuClose : t.menuOpen} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-navigation" aria-label="Sections" onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false) }}>
          {links.map((link) => (
            <a key={link.id} href={link.href} aria-current={pathname === "/" && active === link.id ? "page" : undefined} onClick={() => setMenuOpen(false)}><span>{link.number} /</span> {link.label}</a>
          ))}
          <span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="status-dot" />{t.availableShort}</span>
        </nav>
      )}
    </header>
  )
}
