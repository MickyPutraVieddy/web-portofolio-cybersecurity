import { Navbar } from "@/components/navbar"
import { SiteSections } from "@/components/site-sections"
import { SpaceBackdrop } from "@/components/space-backdrop"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="portfolio-shell">
      <SpaceBackdrop />
      <Navbar />
      <SiteSections />
      <SiteFooter />
    </div>
  )
}
