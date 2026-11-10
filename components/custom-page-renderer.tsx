"use client"

import type { CSSProperties } from "react"
import { ArrowUpRight, Image as ImageIcon } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { usePortfolio } from "@/components/language-provider"
import type { CustomBlock, CustomPage } from "@/lib/content-schema"

const tr = (value: { en: string; id: string }, locale: "en" | "id") => value[locale] || value.en

export function CustomPageRenderer({ page }: { page: CustomPage }) {
  const { locale } = usePortfolio()
  const style = { "--custom-accent": page.accentColor, "--custom-secondary": page.secondaryColor } as CSSProperties
  return (
    <section id={`custom-${page.slug}`} className="page-section custom-home-section" style={style} aria-labelledby={`custom-heading-${page.id}`}>
      <div className="portfolio-container">
        <SectionHeading id={`custom-heading-${page.id}`} anchor={`custom-${page.slug}`} label={tr(page.title, locale).toUpperCase()} file={`${page.slug}.txt`} title={tr(page.title, locale)} />
        {page.summary[locale] && <p className="cert-intro">{tr(page.summary, locale)}</p>}
        <div className="custom-page-blocks">
          {page.blocks.map((block) => <CustomBlockView key={block.id} block={block} locale={locale} />)}
        </div>
      </div>
    </section>
  )
}

function CustomBlockView({ block, locale }: { block: CustomBlock; locale: "en" | "id" }) {
  if (block.type === "divider") return <div className="custom-divider" aria-hidden="true" />
  if (block.type === "hero") return <section className="custom-block custom-block-hero">{block.eyebrow[locale] && <span className="custom-eyebrow">{tr(block.eyebrow, locale)}</span>}<h2>{tr(block.heading, locale)}</h2><p>{tr(block.body, locale)}</p></section>
  if (block.type === "text") return <section className="custom-block custom-block-text">{block.heading[locale] && <h2>{tr(block.heading, locale)}</h2>}<p>{tr(block.body, locale)}</p></section>
  if (block.type === "image") return <figure className="custom-block custom-image-block">{block.image ? <img src={block.image} alt={tr(block.alt, locale)} loading="lazy" /> : <div className="custom-image-placeholder"><ImageIcon /> Image placeholder</div>}{block.caption[locale] && <figcaption>{tr(block.caption, locale)}</figcaption>}</figure>
  if (block.type === "cards") return <section className="custom-block"><h2>{tr(block.heading, locale)}</h2><div className="custom-card-grid">{block.items.map((item) => <article className="custom-content-card" key={item.id}>{item.tag && <span>{item.tag}</span>}<h3>{tr(item.title, locale)}</h3><p>{tr(item.body, locale)}</p></article>)}</div></section>
  if (block.type === "stats") return <section className="custom-block"><h2>{tr(block.heading, locale)}</h2><div className="custom-stat-grid">{block.items.map((item) => <div className="custom-stat" key={item.id}><strong>{item.value}</strong><span>{tr(item.label, locale)}</span></div>)}</div></section>
  if (block.type === "timeline") return <section className="custom-block"><h2>{tr(block.heading, locale)}</h2><div className="custom-timeline">{block.items.map((item) => <article key={item.id}><time>{item.period}</time><div><h3>{tr(item.title, locale)}</h3><p>{tr(item.body, locale)}</p></div></article>)}</div></section>
  if (block.type === "gallery") return <section className="custom-block"><h2>{tr(block.heading, locale)}</h2><div className="custom-gallery">{block.images.filter((item) => item.image.trim()).map((item) => <figure key={item.id}><img src={item.image} alt={tr(item.alt, locale)} loading="lazy" /></figure>)}</div></section>
  if (block.type === "cta") return <section className="custom-block custom-cta"><h2>{tr(block.heading, locale)}</h2><p>{tr(block.body, locale)}</p>{block.href && <a href={block.href} target={block.href.startsWith("http") ? "_blank" : undefined} rel={block.href.startsWith("http") ? "noopener noreferrer" : undefined}>{tr(block.buttonLabel, locale)} <ArrowUpRight aria-hidden="true" /></a>}</section>
  return null
}
