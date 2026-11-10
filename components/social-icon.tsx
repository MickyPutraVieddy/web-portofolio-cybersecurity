import { Link2 } from "lucide-react"
import { BRAND_ICONS } from "@/lib/brand-icons"
import type { SocialLink } from "@/lib/content-schema"

/** Display name of a platform ("" for generic / custom links, which have no brand name). */
export function platformName(platform: SocialLink["platform"]): string {
  return BRAND_ICONS[platform]?.label ?? ""
}

/**
 * Icon for a social / blog link: the platform's own logo, a generic link icon ("other"),
 * or the owner's uploaded image ("custom"). Decorative: the link text carries the meaning.
 */
export function SocialIcon({ platform, icon, tinted = false }: { platform: SocialLink["platform"]; icon?: string | null; tinted?: boolean }) {
  if (platform === "custom" && icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={icon} alt="" className="social-icon-img" loading="lazy" decoding="async" />
  }
  const brand = BRAND_ICONS[platform]
  if (!brand) return <Link2 className="social-icon-generic" aria-hidden="true" />
  return (
    <svg className="social-icon-brand" viewBox={brand.viewBox} fill={tinted ? brand.color : "currentColor"} aria-hidden="true" focusable="false">
      <path d={brand.path} />
    </svg>
  )
}
