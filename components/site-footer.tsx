"use client"

import { ArrowUpRight, Mail } from "lucide-react"
import { SocialIcon, platformName } from "@/components/social-icon"
import { useContent } from "@/components/content-provider"
import { usePortfolio } from "@/components/language-provider"

export function SiteFooter() {
  const { contact, profile, footer } = useContent()
  const { locale } = usePortfolio()
  const socials = footer.showSocials ? contact.socials.filter((item) => item.visible && item.url.trim()) : []
  const showConnect = footer.showSocials || footer.showEmail
  const year = new Date().getFullYear()
  return (
    <footer id="footer" className="site-footer">
      <div className="footer-inner">
        <div className="footer-topline"><span className="footer-kicker">{footer.transmissionLabel[locale]}</span>{footer.showStatus && <span className="footer-signal"><i /> {footer.statusLabel[locale]}</span>}</div>
        <div className="footer-main">
          <div className="footer-brand-block">
            <a href="#intro" className="footer-brand"><span className="footer-brand-mark">✳</span>{profile.handle}<span>.</span></a>
            <p>{footer.tagline[locale]}</p>
          </div>
          {showConnect && <div className="footer-connect">
            <span className="footer-label">{footer.connectLabel[locale]}</span>
            <div className="footer-socials">
              {socials.map((item) => {
                const name = item.label || platformName(item.platform) || item.url.replace(/^https?:\/\//i, "").split("/")[0]
                return <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}><SocialIcon platform={item.platform} icon={item.icon} /><span>{name}</span><ArrowUpRight className="footer-social-arrow" /></a>
              })}
              {footer.showEmail && contact.email.trim() && <a href={`mailto:${contact.email.trim()}`}><Mail /><span>Email</span><ArrowUpRight className="footer-social-arrow" /></a>}
              {!socials.length && !(footer.showEmail && contact.email.trim()) && <span className="footer-empty">Social links can be configured in Admin → Contact.</span>}
            </div>
          </div>}
        </div>
        <div className="footer-bottom">
          {footer.showCopyright && <span>© {year} {footer.copyrightName}. {footer.rightsText[locale]}</span>}
          {footer.showBackToTop && <a href="#intro">{footer.backToTopLabel[locale]}</a>}
          {footer.showBottomNote && <span className="footer-build">{footer.bottomNote[locale]}</span>}
        </div>
      </div>
    </footer>
  )
}
