"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Copy, Download, GripVertical, ImagePlus, Layers3, Search, Trash2, Upload } from "lucide-react"
import { SocialIcon, platformName } from "@/components/social-icon"
import { CustomPageRenderer } from "@/components/custom-page-renderer"
import { AddButton, AdminEmpty, AreaField, Field, Group, ImageField, ItemCard, LinesField, SelectField, SwitchField, TextField, YearField, useConfirm } from "@/components/admin/ui"
import { ContentScope } from "@/components/content-provider"
import { isValidEmail } from "@/lib/contact"
import { isSafeUrl, socialPlatforms, mitreTacticCodes, mitreTacticIds, type Achievement, type Certification, type MitreTechnique, type Project, type SiteContent, type TrainingItem, type Tool, type SocialLink, type Writeup, type Skill, type TimelineItem, type CustomBlock, type CustomPage, type CustomTemplate, customPageSchema, customTemplateSchema } from "@/lib/content-schema"
import type { Locale } from "@/lib/portfolio-types"

export type Update = (mutate: (draft: SiteContent) => void) => void
export interface EditorProps { draft: SiteContent; update: Update; lang: Locale }

const LOCALES: Locale[] = ["en", "id"]
function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return
  const [item] = list.splice(from, 1)
  list.splice(to, 0, item)
}

function CopyField({ draft, update, lang, k, label, area }: EditorProps & { k: string; label: string; area?: boolean }) {
  const value = draft.copy[lang][k] ?? ""
  const set = (next: string) => update((d) => { d.copy[lang][k] = next })
  return area ? <AreaField label={label} value={value} onChange={set} max={500} rows={2} /> : <TextField label={label} value={value} onChange={set} max={500} />
}

// ---- Page Header ---------------------------------------------------------------------
const HEADER_NAV_ITEMS = [
  { id: "intro", key: "introduction", label: "Introduction" },
  { id: "about", key: "navAbout", label: "About" },
  { id: "education", key: "navEducation", label: "Education" },
  { id: "experience", key: "navExperience", label: "Experience" },
  { id: "certifications", key: "navCertifications", label: "Certifications" },
  { id: "skills", key: "navSkills", label: "Skills" },
  { id: "mitre", key: "navMitre", label: "MITRE ATT&CK" },
  { id: "projects", key: "navProjects", label: "Projects" },
  { id: "training", key: "navTraining", label: "Training & Labs" },
  { id: "tools", key: "navTools", label: "Tools" },
  { id: "achievements", key: "navAchievements", label: "Achievements" },
  { id: "writeups", key: "navWriteups", label: "Writeups" },
  { id: "contact", key: "navContact", label: "Contact" },
] as const

function HeaderNavigationEditor(p: EditorProps) {
  const { draft, update } = p
  const [editingId, setEditingId] = useState<string | null>(null)
  const itemIds = HEADER_NAV_ITEMS.map((item) => item.id)
  const allItems = [...draft.sections]
    .filter((section) => itemIds.includes(section.id as typeof itemIds[number]))
    .sort((a, b) => a.order - b.order)
  const visibleItems = allItems.filter((section) => section.visible)
  const hiddenItems = allItems.filter((section) => !section.visible)

  function applyVisibleOrder(ids: string[]) {
    update((d) => {
      const hidden = [...d.sections]
        .filter((section) => itemIds.includes(section.id as typeof itemIds[number]) && !ids.includes(section.id))
        .sort((a, b) => a.order - b.order)
      const ordered = [...ids, ...hidden.map((section) => section.id)]
      ordered.forEach((id, index) => {
        const section = d.sections.find((entry) => entry.id === id)
        if (section) section.order = index + 1
      })
    })
  }

  function moveVisible(id: string, direction: -1 | 1) {
    const ids: string[] = visibleItems.map((section) => section.id)
    const index = ids.indexOf(id)
    const target = index + direction
    if (index < 0 || target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    applyVisibleOrder(ids)
  }

  function setVisible(id: SiteContent["sections"][number]["id"], visible: boolean) {
    const ids = visibleItems.map((section) => section.id).filter((itemId) => itemId !== id)
    if (visible) ids.push(id)
    update((d) => {
      const section = d.sections.find((entry) => entry.id === id)
      if (section) section.visible = visible
      const hidden = [...d.sections]
        .filter((entry) => itemIds.includes(entry.id as typeof itemIds[number]) && !ids.includes(entry.id))
        .sort((a, b) => a.order - b.order)
      ;[...ids, ...hidden.map((entry) => entry.id)].forEach((itemId, index) => {
        const entry = d.sections.find((candidate) => candidate.id === itemId)
        if (entry) entry.order = index + 1
      })
    })
  }

  return (
    <Group title="Navigation menu" note="Keep the header simple. Open the manager only when you want to edit, reorder, add or remove menu links.">
      <details className="adm-header-nav-details">
        <summary>Manage navigation links <span>{visibleItems.length} visible</span></summary>
        <div className="adm-header-nav-content">
      <div className="adm-header-nav-list">
        {visibleItems.map((section, index) => {
          const item = HEADER_NAV_ITEMS.find((entry) => entry.id === section.id)
          if (!item) return null
          return (
            <div className="adm-header-nav-item" key={section.id}>
              <div className="adm-header-nav-row">
                <div className="adm-header-nav-name"><span className="adm-mono">{String(index + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong><span>{draft.copy[p.lang][item.key] || item.label}</span></div></div>
                <div className="adm-header-nav-actions">
                  <button type="button" className="adm-icon" aria-label={`Move ${item.label} up`} disabled={index === 0} onClick={() => moveVisible(section.id, -1)}>↑</button>
                  <button type="button" className="adm-icon" aria-label={`Move ${item.label} down`} disabled={index === visibleItems.length - 1} onClick={() => moveVisible(section.id, 1)}>↓</button>
                  <button type="button" className="adm-btn adm-btn-small" aria-expanded={editingId === section.id} onClick={() => setEditingId(editingId === section.id ? null : section.id)}>Edit</button>
                  <button type="button" className="adm-btn adm-btn-small adm-btn-danger" aria-label={`Remove ${item.label} from header`} onClick={() => setVisible(section.id, false)}>Remove</button>
                </div>
              </div>
              {editingId === section.id && (
                <div className="adm-header-nav-edit">
                  <TextField label={`${item.label} label (EN)`} value={draft.copy.en[item.key] ?? ""} max={80} onChange={(v) => update((d) => { d.copy.en[item.key] = v })} />
                  <TextField label={`${item.label} label (ID)`} value={draft.copy.id[item.key] ?? ""} max={80} onChange={(v) => update((d) => { d.copy.id[item.key] = v })} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {hiddenItems.length > 0 && (
        <details className="adm-header-add">
          <summary>Add a page to the header <span>{hiddenItems.length} hidden</span></summary>
          <div className="adm-header-add-list">
            {hiddenItems.map((section) => {
              const item = HEADER_NAV_ITEMS.find((entry) => entry.id === section.id)
              if (!item) return null
              return <button type="button" key={section.id} className="adm-btn" onClick={() => setVisible(section.id, true)}>＋ Add {item.label}</button>
            })}
          </div>
        </details>
      )}
      <CopyField {...p} k="language" label="Language menu title" />
        </div>
      </details>
    </Group>
  )
}

export function HeaderEditor(p: EditorProps) {
  const { draft, update } = p
  return (
    <>
      <Group title="Brand identity" note="This logo sits immediately beside your zains403 handle. It is independent from the round admin-login icon.">
        <ImageField label="Brand logo (next to handle)" value={draft.profile.brandLogo} onChange={(v) => update((d) => { d.profile.brandLogo = v })} hint="PNG, JPEG or WebP. Leave empty to use the default shield." />
        <TextField label="Handle" value={draft.profile.handle} max={40} onChange={(v) => update((d) => { d.profile.handle = v })} />
        <CopyField {...p} k="portfolio" label="Small descriptor beside the brand" />
        <CopyField {...p} k="availableShort" label="Availability badge text" />
      </Group>
      <Group title="Admin login icon" note="This round profile icon opens /admin. It stays separate from the brand logo above; upload here only if you want to customize the login shortcut avatar.">
        <ImageField label="Admin avatar (optional)" value={draft.profile.adminLogo} onChange={(v) => update((d) => { d.profile.adminLogo = v })} />
        <CopyField {...p} k="adminLabel" label="Icon tooltip text" />
      </Group>
      <HeaderNavigationEditor {...p} />
    </>
  )
}

// ---- Page Intro ----------------------------------------------------------------------
export function IntroEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const profile = draft.profile
  return (
    <>
      <Group title="Name">
        <TextField label="First + middle name (big, white)" value={profile.givenNames} max={80} onChange={(v) => update((d) => { d.profile.givenNames = v })} />
        <TextField label="Family name (big, blue)" value={profile.familyName} max={60} onChange={(v) => update((d) => { d.profile.familyName = v })} />
        <TextField label="Full name (browser title & SEO)" value={profile.name} max={80} onChange={(v) => update((d) => { d.profile.name = v })} />
      </Group>
      <Group title={`Intro text (${lang.toUpperCase()})`}>
        <CopyField {...p} k="introducing" label="Small line above the greeting" />
        <CopyField {...p} k="hello" label="Greeting" />
        <TextField label="Role (typed line)" value={profile.role[lang]} max={120} onChange={(v) => update((d) => { d.profile.role[lang] = v })} />
        <AreaField label="Description" value={profile.description[lang]} max={1200} rows={5} onChange={(v) => update((d) => { d.profile.description[lang] = v })} />
        <TextField label="Location" value={profile.location[lang]} max={120} onChange={(v) => update((d) => { d.profile.location[lang] = v })} />
        <CopyField {...p} k="locationLabel" label="Location label" />
      </Group>
      <Group title="View resume button">
        <CopyField {...p} k="resume" label="Button text" />
        <TextField label={`Resume link (${lang.toUpperCase()})`} mono value={profile.resume[lang] ?? ""} max={2000} placeholder="https://… (leave empty to disable)" hint="Link to your PDF (Google Drive, Dropbox, your own site). Empty = button disabled."
          onChange={(v) => update((d) => { d.profile.resume[lang] = v.trim() ? v.trim() : null })} />
        <CopyField {...p} k="resumeUnavailable" label="Text shown when no link is set" />
      </Group>
      <Group title="Certifications & focus">
        <LinesField label="Certification badges (same in both languages)" max={80} value={profile.credentials} onChange={(v) => update((d) => { d.profile.credentials = v.slice(0, 12) })} />
        <LinesField label={`Focus areas (${lang.toUpperCase()})`} max={80} value={profile.focus[lang]} onChange={(v) => update((d) => { d.profile.focus[lang] = v.slice(0, 12) })} />
        <CopyField {...p} k="focusLabel" label="Focus label" />
      </Group>
      <Group title="Photo" note="Your portrait appears inside a blue circular frame beside the celestial orbital graphic. If no photo is uploaded, a matching placeholder is shown.">
        <ImageField label="Profile photo" value={profile.portrait} onChange={(v) => update((d) => { d.profile.portrait = v })} />
      </Group>
      <Group title="Bottom line">
        <CopyField {...p} k="philosophy" label="Quote, first part" />
        <CopyField {...p} k="philosophyEnd" label="Quote, second part" />
        <CopyField {...p} k="signature" label="Signature" />
      </Group>
    </>
  )
}

// ---- Page 00 About -------------------------------------------------------------------
export function AboutEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const rows = draft.aboutRows[lang]
  return (
    <>
      <Group title="Section heading">
        <CopyField {...p} k="aboutTitle" label="Title" />
        <CopyField {...p} k="aboutLabel" label="Small label (top right)" />
      </Group>
      <Group title="Left shell — cat about.txt" note="Each row is one line of the typed output. Add, delete and reorder apply to both languages; text is edited per language.">
        {rows.map((row, i) => (
          <ItemCard key={i} title={row.label} index={i} count={rows.length} onMove={(a, b) => update((d) => LOCALES.forEach((l) => move(d.aboutRows[l], a, b)))} onDelete={() => update((d) => LOCALES.forEach((l) => d.aboutRows[l].splice(i, 1)))}>
            <TextField label="Label" value={row.label} max={60} onChange={(v) => update((d) => { d.aboutRows[lang][i].label = v })} />
            <TextField label="Value" value={row.value} max={400} onChange={(v) => update((d) => { d.aboutRows[lang][i].value = v })} />
          </ItemCard>
        ))}
        <AddButton label="Add row" disabled={rows.length >= 20} onClick={() => update((d) => LOCALES.forEach((l) => d.aboutRows[l].push({ label: "New", value: "" })))} />
        <TextField label={`Status line (echo $STATUS, ${lang.toUpperCase()})`} value={draft.statusLine[lang]} max={300} onChange={(v) => update((d) => { d.statusLine[lang] = v })} />
      </Group>
      <Group title="Shell texts">
        <CopyField {...p} k="shellNote" label="Right shell — note" area />
        <CopyField {...p} k="shellBadge" label="Right shell — badge" />
        <CopyField {...p} k="shellPlaceholder" label="Input placeholder" />
        <CopyField {...p} k="shellQuick" label="Quick commands label" />
        <CopyField {...p} k="shellHint" label="Hint under the shell" area />
      </Group>
    </>
  )
}

// ---- Interactive shell commands ------------------------------------------------------
const COMMAND_NAME = /^[a-z][a-z0-9_-]{0,19}$/
export function TerminalEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const names = Object.keys(draft.terminalOutput[lang])
  const [newName, setNewName] = useState("")
  const [error, setError] = useState("")
  const confirm = useConfirm()

  function add() {
    const name = newName.trim().toLowerCase()
    if (!COMMAND_NAME.test(name)) return setError("Use a lowercase name: letters, digits, - or _ (max 20).")
    if (names.includes(name) || ["clear", "cls", "cat", "ls"].includes(name)) return setError("That command already exists or is reserved.")
    if (names.length >= 40) return setError("Maximum 40 commands.")
    update((d) => LOCALES.forEach((l) => { d.terminalOutput[l][name] = ["…"] }))
    setNewName(""); setError("")
  }
  async function remove(name: string) {
    if (name === "help") return
    if (await confirm({ title: `Delete command “${name}”?`, body: "Removed from both languages and from the quick commands.", confirmLabel: "Delete", danger: true })) {
      update((d) => { LOCALES.forEach((l) => { delete d.terminalOutput[l][name] }); d.quickCommands = d.quickCommands.filter((c) => c !== name) })
    }
  }
  function toggleQuick(name: string) {
    update((d) => { d.quickCommands = d.quickCommands.includes(name) ? d.quickCommands.filter((c) => c !== name) : [...d.quickCommands, name].slice(0, 10) })
  }
  return (
    <>
      <Group title="Quick command buttons" note="Click a command to show or hide it as a button under the shell (max 10).">
        <div className="adm-chips">{names.map((name) => <button key={name} type="button" className="adm-chip" aria-pressed={draft.quickCommands.includes(name)} onClick={() => toggleQuick(name)}>{name}</button>)}</div>
      </Group>
      <Group title={`Commands (${lang.toUpperCase()})`} note="Visitors type these in the safe demo shell. The output is plain text, one line per row. The built-ins ls and clear always exist.">
        {names.map((name) => (
          <fieldset className="adm-card" key={name}>
            <legend><span className="adm-mono">$ {name}</span></legend>
            <div className="adm-card-tools">{name !== "help" && <button type="button" className="adm-icon adm-icon-danger" aria-label={`Delete ${name}`} onClick={() => remove(name)}>×</button>}</div>
            <LinesField label="Output" max={300} rows={Math.min(8, Math.max(2, draft.terminalOutput[lang][name].length))} value={draft.terminalOutput[lang][name]} onChange={(v) => update((d) => { d.terminalOutput[lang][name] = v.slice(0, 40) })} />
          </fieldset>
        ))}
        <div className="adm-inline">
          <TextField label="New command name" value={newName} max={20} placeholder="e.g. contact" mono onChange={(v) => { setNewName(v); setError("") }} hint={error} />
          <AddButton label="Add command" onClick={add} />
        </div>
      </Group>
    </>
  )
}

// ---- Education / Work experience -----------------------------------------------------
export function TimelineEditor({ kind, ...p }: EditorProps & { kind: "education" | "experience" }) {
  const { draft, update, lang } = p
  const entries = draft[kind][lang]
  const blank = (): TimelineItem => ({ period: "", title: "New entry", org: "", detail: "", points: [] })
  return (
    <>
      <Group title="Section heading">
        <CopyField {...p} k={kind === "education" ? "educationTitle" : "experienceTitle"} label="Title" />
        <CopyField {...p} k={kind === "education" ? "educationLabel" : "experienceLabel"} label="Small label (top right)" />
      </Group>
      <Group title={kind === "education" ? "Education records" : "Work experience records"} note="Add, delete and reorder apply to both languages; text is edited per language. Anything in [brackets] is a placeholder to replace.">
        {entries.map((entry, i) => (
          <ItemCard key={i} title={entry.title} index={i} count={entries.length} onMove={(a, b) => update((d) => LOCALES.forEach((l) => move(d[kind][l], a, b)))} onDelete={() => update((d) => LOCALES.forEach((l) => d[kind][l].splice(i, 1)))}>
            <TextField label="Period" value={entry.period} max={80} onChange={(v) => update((d) => { d[kind][lang][i].period = v })} />
            <TextField label={kind === "education" ? "Degree / program" : "Role"} value={entry.title} max={140} onChange={(v) => update((d) => { d[kind][lang][i].title = v })} />
            <TextField label={kind === "education" ? "School / university" : "Company"} value={entry.org} max={140} onChange={(v) => update((d) => { d[kind][lang][i].org = v })} />
            <TextField label="Detail (grade, stream, …)" value={entry.detail ?? ""} max={240} onChange={(v) => update((d) => { d[kind][lang][i].detail = v })} />
            <LinesField label="Bullet points" value={entry.points ?? []} onChange={(v) => update((d) => { d[kind][lang][i].points = v.slice(0, 12) })} />
          </ItemCard>
        ))}
        <AddButton label="Add record" disabled={entries.length >= 20} onClick={() => update((d) => LOCALES.forEach((l) => d[kind][l].push(blank())))} />
      </Group>
    </>
  )
}

// ---- Certifications ------------------------------------------------------------------
const newId = () => "c-" + (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "").slice(0, 12) : Math.random().toString(36).slice(2, 14).padEnd(12, "0"))
const blankCertification = (): Certification => ({
  id: newId(), visible: false, name: "New certification", kind: "professional", category: "general", issuer: "", credential: "",
  acquiredYear: null, issuedYear: null, expiryYear: null, validity: "by-expiry",
  description: { en: "", id: "" }, image: null, imageAlt: { en: "", id: "" }, verifyUrl: "",
})
const yearOk = (value: number | null) => value === null || (value >= 1990 && value <= 2100)
function certificationIssues(item: Certification): string[] {
  const issues: string[] = []
  if (!item.name.trim()) issues.push("Name is required.")
  for (const [label, value] of [["Acquired", item.acquiredYear], ["Issued", item.issuedYear], ["Expiry", item.expiryYear]] as const) if (!yearOk(value)) issues.push(`${label} year must be between 1990 and 2100.`)
  if (item.issuedYear !== null && item.expiryYear !== null && item.expiryYear < item.issuedYear) issues.push("Expiry year cannot be before the issued year.")
  if (item.verifyUrl && !isSafeUrl(item.verifyUrl)) issues.push("Verification link must start with https://, http:// or mailto:.")
  if (item.image && !isSafeUrl(item.image)) issues.push("Image link is not valid.")
  return issues
}

export function CertificationsEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const items = draft.certifications.items
  const published = items.filter((item) => item.visible).length
  const set = (i: number, change: (item: Certification) => void) => update((d) => { change(d.certifications.items[i]) })
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph. The “Coming soon” texts and filter labels are in All texts.">
        <CopyField {...p} k="certTitle" label="Title" />
        <CopyField {...p} k="certLabel" label="Small label (top right)" />
        <CopyField {...p} k="certIntro" label="Intro paragraph" area />
      </Group>
      <Group title={`Certifications (${items.length}) — ${published} shown on the site`} note="Switch “Show on site” on for every certification that should be public. While none is shown, visitors see the “Coming soon” panel. Add, delete and reorder apply to both languages; descriptions and image text are edited per language.">
        {items.length === 0 && <AdminEmpty title="No certifications yet" body="Nothing is published for this page. Add your first certification, switch it on, then publish — the “Coming soon” panel disappears automatically."><AddButton label="Add certification" onClick={() => update((d) => { d.certifications.items.push(blankCertification()) })} /></AdminEmpty>}
        {items.map((item, i) => {
          const issues = certificationIssues(item)
          return (
            <ItemCard key={item.id} title={item.name} index={i} count={items.length}
              onMove={(a, b) => update((d) => move(d.certifications.items, a, b))}
              onDelete={() => update((d) => { d.certifications.items.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <TextField label="Certificate name" value={item.name} max={140} onChange={(v) => set(i, (c) => { c.name = v })} />
              <SelectField label="Type" value={item.kind} onChange={(v) => set(i, (c) => { c.kind = v })} options={[{ value: "professional", label: "Professional" }, { value: "non-professional", label: "Non-Professional" }]} />
              <SelectField label="Field" value={item.category} onChange={(v) => set(i, (c) => { c.category = v })} options={[{ value: "red", label: "Red Team" }, { value: "blue", label: "Blue Team" }, { value: "purple", label: "Purple Team" }, { value: "general", label: "General Cybersecurity" }]} />
              <TextField label="Issuer" value={item.issuer} max={140} onChange={(v) => set(i, (c) => { c.issuer = v })} />
              <TextField label="Credential earned (badge, credential ID, …)" value={item.credential} max={200} onChange={(v) => set(i, (c) => { c.credential = v })} />
              <YearField label="Year acquired" value={item.acquiredYear} onChange={(v) => set(i, (c) => { c.acquiredYear = v })} />
              <YearField label="Year issued (validity starts)" value={item.issuedYear} onChange={(v) => set(i, (c) => { c.issuedYear = v })} />
              <YearField label="Year expires" value={item.expiryYear} onChange={(v) => set(i, (c) => { c.expiryYear = v })} />
              <SelectField label="Validity status" value={item.validity} onChange={(v) => set(i, (c) => { c.validity = v })}
                options={[{ value: "by-expiry", label: "From expiry year (Active / Expired)" }, { value: "lifetime", label: "Lifetime" }, { value: "not-specified", label: "Not specified" }]}
                hint="Active/Expired is calculated from the expiry year — never guessed." />
              <AreaField label={`Description (${lang.toUpperCase()})`} value={item.description[lang]} max={600} rows={3} onChange={(v) => set(i, (c) => { c.description[lang] = v })} />
              <ImageField label="Certificate image" value={item.image} onChange={(v) => set(i, (c) => { c.image = v })} />
              <TextField label={`Image description for screen readers (${lang.toUpperCase()})`} value={item.imageAlt[lang]} max={200} hint="Leave empty to use the certificate name." onChange={(v) => set(i, (c) => { c.imageAlt[lang] = v })} />
              <TextField label="Verification / credential link" mono value={item.verifyUrl} max={2000} placeholder="https://…" onChange={(v) => set(i, (c) => { c.verifyUrl = v.trim() })} />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {items.length > 0 && <AddButton label="Add certification" disabled={items.length >= 60} onClick={() => update((d) => { d.certifications.items.push(blankCertification()) })} />}
      </Group>
    </>
  )
}

// ---- Projects ------------------------------------------------------------------------
const blankProject = (): Project => ({
  id: "p-" + newId().slice(2), visible: false, featured: false, name: "New project", kind: "professional", domain: "general", status: "completed",
  year: null, period: "", summary: { en: "", id: "" }, description: { en: "", id: "" }, role: { en: "", id: "" }, method: { en: "", id: "" }, outcome: { en: "", id: "" },
  stack: [], thumbnail: null, thumbnailAlt: { en: "", id: "" }, repoUrl: "", demoUrl: "", reportUrl: "",
})
function projectIssues(item: Project): string[] {
  const issues: string[] = []
  if (!item.name.trim()) issues.push("Name is required.")
  if (!yearOk(item.year)) issues.push("Year must be between 1990 and 2100.")
  for (const [label, value] of [["Repository", item.repoUrl], ["Demo", item.demoUrl], ["Report", item.reportUrl], ["Thumbnail", item.thumbnail ?? ""]] as const) if (value && !isSafeUrl(value)) issues.push(`${label} link must start with https://, http:// or mailto:.`)
  return issues
}
/** Non-blocking reminders: the page must never publish private addresses, credentials or sensitive detail. */
const PRIVATE_IP = /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/
const SECRET_LIKE = /\b(password|passwd|pwd|secret|api[_-]?key|token|bearer)\b\s*[:=]/i
function sensitiveWarnings(fields: [string, string][]): string[] {
  const out: string[] = []
  for (const [label, value] of fields) {
    if (PRIVATE_IP.test(value)) out.push(`“${label}” looks like it contains a private IP address — remove it.`)
    if (SECRET_LIKE.test(value)) out.push(`“${label}” looks like it contains a credential or token — remove it.`)
  }
  return out
}
function projectWarnings(item: Project): string[] {
  const fields: [string, string][] = [["Name", item.name], ["Period", item.period], ["Stack", item.stack.join(" ")]]
  for (const key of ["summary", "description", "role", "method", "outcome"] as const) for (const l of LOCALES) fields.push([`${key[0].toUpperCase()}${key.slice(1)} (${l.toUpperCase()})`, item[key][l]])
  return sensitiveWarnings(fields)
}

export function ProjectsEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const items = draft.projects.items
  const published = items.filter((item) => item.visible).length
  const set = (i: number, change: (item: Project) => void) => update((d) => { change(d.projects.items[i]) })
  const add = () => update((d) => { d.projects.items.push(blankProject()) })
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph. Table headings, filters and status labels are in All texts.">
        <CopyField {...p} k="projectsTitle" label="Title" />
        <CopyField {...p} k="projectsLabel" label="Small label (top right)" />
        <CopyField {...p} k="projectsIntro" label="Intro paragraph" area />
      </Group>
      <Group title={`Projects (${items.length}) — ${published} shown on the site`} note="Switch “Show on site” on for every project that should be public. Only describe results you can show — never invent impact. Do not include credentials, private IP addresses, targets you had no permission to test, or exploit details. The first three projects marked Featured appear in the Featured row. While none is shown, visitors see the “Coming soon” panel.">
        {items.length === 0 && <AdminEmpty title="No projects yet" body="Nothing is published for this page. Add your first project, switch it on, then publish — the “Coming soon” panel disappears automatically."><AddButton label="Add project" onClick={add} /></AdminEmpty>}
        {items.map((item, i) => {
          const issues = projectIssues(item)
          const warnings = projectWarnings(item)
          return (
            <ItemCard key={item.id} title={item.name} index={i} count={items.length}
              onMove={(a, b) => update((d) => move(d.projects.items, a, b))}
              onDelete={() => update((d) => { d.projects.items.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <SwitchField label="Featured" checked={item.featured} onChange={(v) => set(i, (c) => { c.featured = v })} hint="shown in the Featured row (max 3)" />
              <TextField label="Project name" value={item.name} max={140} onChange={(v) => set(i, (c) => { c.name = v })} />
              <SelectField label="Type" value={item.kind} onChange={(v) => set(i, (c) => { c.kind = v })} options={[{ value: "professional", label: "Professional" }, { value: "non-professional", label: "Non-Professional" }]} />
              <SelectField label="Domain" value={item.domain} onChange={(v) => set(i, (c) => { c.domain = v })} options={[{ value: "red", label: "Red Team" }, { value: "blue", label: "Blue Team" }, { value: "purple", label: "Purple Team" }, { value: "general", label: "General Cybersecurity" }]} />
              <SelectField label="Status" value={item.status} onChange={(v) => set(i, (c) => { c.status = v })} options={[{ value: "completed", label: "Completed" }, { value: "in-progress", label: "In Progress" }, { value: "archived", label: "Archived" }]} />
              <YearField label="Year" value={item.year} onChange={(v) => set(i, (c) => { c.year = v })} />
              <TextField label="Period (optional)" value={item.period} max={80} placeholder="e.g. Jan – Mar 2025" hint="Shown instead of the year when filled." onChange={(v) => set(i, (c) => { c.period = v })} />
              <AreaField label={`Goal / problem (${lang.toUpperCase()})`} value={item.summary[lang]} max={300} rows={2} onChange={(v) => set(i, (c) => { c.summary[lang] = v })} />
              <AreaField label={`Description & scope (${lang.toUpperCase()})`} value={item.description[lang]} max={1200} rows={4} onChange={(v) => set(i, (c) => { c.description[lang] = v })} />
              <AreaField label={`My contribution (${lang.toUpperCase()})`} value={item.role[lang]} max={600} rows={3} onChange={(v) => set(i, (c) => { c.role[lang] = v })} />
              <AreaField label={`Method / approach (${lang.toUpperCase()})`} value={item.method[lang]} max={600} rows={3} onChange={(v) => set(i, (c) => { c.method[lang] = v })} />
              <AreaField label={`Result / output (${lang.toUpperCase()})`} value={item.outcome[lang]} max={600} rows={3} hint="Only results you can back up." onChange={(v) => set(i, (c) => { c.outcome[lang] = v })} />
              <LinesField label="Tools & technology" value={item.stack} max={40} rows={3} hint="One tool per line (max 20). Not translated." onChange={(v) => set(i, (c) => { c.stack = v.slice(0, 20) })} />
              <ImageField label="Thumbnail / screenshot (optional)" value={item.thumbnail} onChange={(v) => set(i, (c) => { c.thumbnail = v })} hint="PNG, JPEG or WebP, up to 700 KB. Make sure it shows no sensitive data." />
              <TextField label={`Image description for screen readers (${lang.toUpperCase()})`} value={item.thumbnailAlt[lang]} max={200} hint="Leave empty to use the project name." onChange={(v) => set(i, (c) => { c.thumbnailAlt[lang] = v })} />
              <TextField label="Repository link (optional)" mono value={item.repoUrl} max={2000} placeholder="https://…" onChange={(v) => set(i, (c) => { c.repoUrl = v.trim() })} />
              <TextField label="Demo link (optional)" mono value={item.demoUrl} max={2000} placeholder="https://…" onChange={(v) => set(i, (c) => { c.demoUrl = v.trim() })} />
              <TextField label="Report link (optional)" mono value={item.reportUrl} max={2000} placeholder="https://…" onChange={(v) => set(i, (c) => { c.reportUrl = v.trim() })} />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
              {warnings.length > 0 && <ul className="adm-warn" role="note">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {items.length > 0 && <AddButton label="Add project" disabled={items.length >= 60} onClick={add} />}
      </Group>
    </>
  )
}

// ---- Training & Labs -----------------------------------------------------------------
const blankTraining = (): TrainingItem => ({
  id: "t-" + newId().slice(2), visible: false, kind: "training", platform: "New platform", name: "New entry", domain: "general", status: "planned",
  startYear: null, endYear: null, focus: { en: "", id: "" }, objective: { en: "", id: "" }, description: { en: "", id: "" },
  modules: [], skills: [], tools: [], evidenceUrl: "",
})
function trainingIssues(item: TrainingItem): string[] {
  const issues: string[] = []
  if (!item.name.trim()) issues.push("Name is required.")
  if (!item.platform.trim()) issues.push("Platform is required.")
  for (const [label, value] of [["Start", item.startYear], ["End", item.endYear]] as const) if (!yearOk(value)) issues.push(`${label} year must be between 1990 and 2100.`)
  if (item.startYear !== null && item.endYear !== null && item.endYear < item.startYear) issues.push("End year cannot be before the start year.")
  if (item.evidenceUrl && !isSafeUrl(item.evidenceUrl)) issues.push("Evidence link must start with https://, http:// or mailto:.")
  return issues
}
function trainingWarnings(item: TrainingItem): string[] {
  const fields: [string, string][] = [["Name", item.name], ["Platform", item.platform], ["Modules", item.modules.join(" ")], ["Skills", item.skills.join(" ")], ["Tools", item.tools.join(" ")]]
  for (const key of ["focus", "objective", "description"] as const) for (const l of LOCALES) fields.push([`${key[0].toUpperCase()}${key.slice(1)} (${l.toUpperCase()})`, item[key][l]])
  return sensitiveWarnings(fields)
}

export function TrainingEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const items = draft.training.items
  const published = items.filter((item) => item.visible).length
  const set = (i: number, change: (item: TrainingItem) => void) => update((d) => { change(d.training.items[i]) })
  const add = () => update((d) => { d.training.items.push(blankTraining()) })
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph. Filter, status and card labels are in All texts.">
        <CopyField {...p} k="trainingTitle" label="Title" />
        <CopyField {...p} k="trainingLabel" label="Small label (top right)" />
        <CopyField {...p} k="trainingIntro" label="Intro paragraph" area />
      </Group>
      <Group title={`Training & labs (${items.length}) — ${published} shown on the site`} note="Each entry is either a Training / Course Path or a Lab. Status is exactly what you choose: Planned and In Progress are never turned into Completed automatically, so update them yourself. Only list what you really did. Do not include credentials, private IP addresses, targets you had no permission to test, or exploit details. While nothing is shown, visitors see the “Coming soon” panel.">
        {items.length === 0 && <AdminEmpty title="No training or labs yet" body="Nothing is published for this page. Add your first entry, switch it on, then publish — the “Coming soon” panel disappears automatically."><AddButton label="Add training / lab" onClick={add} /></AdminEmpty>}
        {items.map((item, i) => {
          const issues = trainingIssues(item)
          const warnings = trainingWarnings(item)
          return (
            <ItemCard key={item.id} title={`${item.kind === "lab" ? "Lab" : "Training"}: ${item.name}`} index={i} count={items.length}
              onMove={(a, b) => update((d) => move(d.training.items, a, b))}
              onDelete={() => update((d) => { d.training.items.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <SelectField label="Entry type" value={item.kind} onChange={(v) => set(i, (c) => { c.kind = v })} options={[{ value: "training", label: "Training / Course Path" }, { value: "lab", label: "Lab experience" }]} />
              <TextField label="Platform / provider" value={item.platform} max={100} placeholder="e.g. TryHackMe, Hack The Box, PortSwigger…" onChange={(v) => set(i, (c) => { c.platform = v })} />
              <TextField label={item.kind === "lab" ? "Lab / room name" : "Course / path name"} value={item.name} max={140} onChange={(v) => set(i, (c) => { c.name = v })} />
              <SelectField label="Domain" value={item.domain} onChange={(v) => set(i, (c) => { c.domain = v })} options={[{ value: "red", label: "Red Team" }, { value: "blue", label: "Blue Team" }, { value: "purple", label: "Purple Team" }, { value: "general", label: "General" }]} />
              <SelectField label="Status" value={item.status} onChange={(v) => set(i, (c) => { c.status = v })} options={[{ value: "completed", label: "Completed" }, { value: "in-progress", label: "In Progress" }, { value: "planned", label: "Planned" }]} hint="Never changed automatically." />
              <YearField label="Start year" value={item.startYear} onChange={(v) => set(i, (c) => { c.startYear = v })} />
              <YearField label="End year" value={item.endYear} onChange={(v) => set(i, (c) => { c.endYear = v })} />
              <TextField label={`Focus / topic (${lang.toUpperCase()})`} value={item.focus[lang]} max={200} onChange={(v) => set(i, (c) => { c.focus[lang] = v })} />
              {item.kind === "lab" && <AreaField label={`Objective / scenario (${lang.toUpperCase()})`} value={item.objective[lang]} max={400} rows={2} onChange={(v) => set(i, (c) => { c.objective[lang] = v })} />}
              <AreaField label={`${item.kind === "lab" ? "What I actually did" : "Description of the material / activities"} (${lang.toUpperCase()})`} value={item.description[lang]} max={800} rows={4} onChange={(v) => set(i, (c) => { c.description[lang] = v })} />
              {item.kind === "training" && <LinesField label="Modules / rooms / lessons completed (optional)" value={item.modules} max={120} rows={4} hint="One per line (max 30)." onChange={(v) => set(i, (c) => { c.modules = v.slice(0, 30) })} />}
              {item.kind === "lab" && <LinesField label="Tools used" value={item.tools} max={40} rows={3} hint="One per line (max 20)." onChange={(v) => set(i, (c) => { c.tools = v.slice(0, 20) })} />}
              <LinesField label={item.kind === "lab" ? "Skills / techniques practised" : "Skills learned"} value={item.skills} max={60} rows={3} hint="One per line (max 20)." onChange={(v) => set(i, (c) => { c.skills = v.slice(0, 20) })} />
              <TextField label={item.kind === "lab" ? "Writeup / evidence link (optional)" : "Certificate / badge / evidence link (optional)"} mono value={item.evidenceUrl} max={2000} placeholder="https://…" onChange={(v) => set(i, (c) => { c.evidenceUrl = v.trim() })} />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
              {warnings.length > 0 && <ul className="adm-warn" role="note">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {items.length > 0 && <AddButton label="Add training / lab" disabled={items.length >= 120} onClick={add} />}
      </Group>
    </>
  )
}

// ---- Sections & order ----------------------------------------------------------------
// ---- Skills --------------------------------------------------------------------------
const blankSkill = (): Skill => ({ id: "s-" + newId().slice(2), visible: false, name: "New skill", category: "general", level: null, description: { en: "", id: "" } })
function skillIssues(item: Skill): string[] {
  const issues: string[] = []
  if (!item.name.trim()) issues.push("Name is required.")
  return issues
}
export function SkillsEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const skills = draft.skills
  const items = skills.items
  const published = items.filter((item) => item.visible).length
  const set = (i: number, change: (item: Skill) => void) => update((d) => { change(d.skills.items[i]) })
  const add = () => update((d) => { d.skills.items.push(blankSkill()) })
  const categoryLabel = { red: "Red Team", blue: "Blue Team", general: "General" } as const
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph. The table headings and level names are in All texts.">
        <CopyField {...p} k="skillsTitle" label="Title" />
        <CopyField {...p} k="skillsLabel" label="Small label (top right)" />
        <CopyField {...p} k="skillsIntro" label="Intro paragraph" area />
      </Group>
      <Group title="Automatic skill distribution" note="No image upload is needed. The public visual is generated from skills switched on for the site, sorted from the largest category to the smallest. Percentages are calculated automatically from the published total.">
        <div className="adm-skill-distribution" aria-live="polite">
          {(["red", "blue", "general"] as const).map((category) => {
            const count = items.filter((item) => item.visible && item.category === category).length
            const percentage = published ? (count / published) * 100 : 0
            const label = category === "red" ? "Red Team" : category === "blue" ? "Blue Team" : "General"
            return { category, count, percentage, label }
          }).sort((a, b) => b.count - a.count || (["red", "blue", "general"] as const).indexOf(a.category) - (["red", "blue", "general"] as const).indexOf(b.category)).map((group, index) => (
            <div className="adm-skill-stat" data-cat={group.category} key={group.category}>
              <div className="adm-skill-stat-head"><span><i />0{index + 1} · {group.label}</span><strong>{group.count}</strong></div>
              <div className="adm-skill-stat-meta"><span>{group.count} published</span><b>{group.percentage.toFixed(1)}%</b></div>
              <div className="adm-skill-stat-track"><span style={{ width: `${group.percentage}%` }} /></div>
            </div>
          ))}
        </div>
      </Group>
      <Group title={`Skills (${items.length}) — ${published} shown on the site`} note="Switch “Show on site” on to include a skill in the public totals. Categories are automatically sorted by published count (highest first); percentages use only published skills. Add, delete and reorder apply to both languages; descriptions are edited per language.">
        {items.length === 0 && <AdminEmpty title="No skills yet" body="Nothing is published for this page. Add your first skill, switch it on, then publish — the “Coming soon” panel for that table disappears automatically."><AddButton label="Add skill" onClick={add} /></AdminEmpty>}
        {items.map((item, i) => {
          const issues = skillIssues(item)
          return (
            <ItemCard key={item.id} title={`${item.name} · ${categoryLabel[item.category]}`} index={i} count={items.length}
              onMove={(a, b) => update((d) => move(d.skills.items, a, b))}
              onDelete={() => update((d) => { d.skills.items.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <TextField label="Skill name" value={item.name} max={100} onChange={(v) => set(i, (c) => { c.name = v })} />
              <SelectField label="Table" value={item.category} onChange={(v) => set(i, (c) => { c.category = v })} options={[{ value: "red", label: "Red Team" }, { value: "blue", label: "Blue Team" }, { value: "general", label: "General" }]} />
              <SelectField label="Level" value={item.level === null ? "none" : String(item.level)} onChange={(v) => set(i, (c) => { c.level = v === "none" ? null : Number(v) })}
                options={[{ value: "none", label: "Not rated (no bar)" }, { value: "1", label: "1 — Beginner" }, { value: "2", label: "2 — Basic" }, { value: "3", label: "3 — Intermediate" }, { value: "4", label: "4 — Advanced" }, { value: "5", label: "5 — Expert" }]} />
              <AreaField label={`Description (${lang.toUpperCase()})`} value={item.description[lang]} max={300} rows={2} onChange={(v) => set(i, (c) => { c.description[lang] = v })} />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {items.length > 0 && <AddButton label="Add skill" disabled={items.length >= 120} onClick={add} />}
      </Group>
    </>
  )
}

// ---- MITRE ATT&CK exposure -----------------------------------------------------------
const blankTechnique = (): MitreTechnique => ({ id: "m-" + newId().slice(2), visible: false, tactic: "initial-access", techniqueId: "", name: "New technique", exposure: "studied", description: { en: "", id: "" } })
function techniqueIssues(item: MitreTechnique): string[] {
  const issues: string[] = []
  if (!item.name.trim()) issues.push("Name is required.")
  if (!/^(T\d{4}(\.\d{3})?)?$/.test(item.techniqueId)) issues.push("Technique ID must look like T1566 or T1566.001 (or be empty).")
  return issues
}
const tacticName = (id: string) => id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")
export function MitreEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const items = draft.mitre.items
  const published = items.filter((item) => item.visible).length
  const set = (i: number, change: (item: MitreTechnique) => void) => update((d) => { change(d.mitre.items[i]) })
  const add = () => update((d) => { d.mitre.items.push(blankTechnique()) })
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph. Tactic names and exposure labels are in All texts.">
        <CopyField {...p} k="mitreTitle" label="Title" />
        <CopyField {...p} k="mitreLabel" label="Small label (top right)" />
        <CopyField {...p} k="mitreIntro" label="Intro paragraph" area />
      </Group>
      <Group title={`Techniques (${items.length}) — ${published} shown on the site`} note="Each technique appears under its tactic box. Only add techniques you really studied or practised. While none is shown, visitors see the “Coming soon” panel. The ATT&CK link is built automatically from the technique ID.">
        {items.length === 0 && <AdminEmpty title="No techniques yet" body="Nothing is published for this page. Add your first technique, switch it on, then publish — the “Coming soon” panel disappears automatically."><AddButton label="Add technique" onClick={add} /></AdminEmpty>}
        {items.map((item, i) => {
          const issues = techniqueIssues(item)
          return (
            <ItemCard key={item.id} title={`${item.techniqueId || "—"} ${item.name}`} index={i} count={items.length}
              onMove={(a, b) => update((d) => move(d.mitre.items, a, b))}
              onDelete={() => update((d) => { d.mitre.items.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <TextField label="Technique name" value={item.name} max={140} onChange={(v) => set(i, (c) => { c.name = v })} />
              <TextField label="ATT&CK technique ID" mono value={item.techniqueId} max={9} placeholder="T1566 or T1566.001" onChange={(v) => set(i, (c) => { c.techniqueId = v.trim().toUpperCase() })} />
              <SelectField label="Tactic" value={item.tactic} onChange={(v) => set(i, (c) => { c.tactic = v })} options={mitreTacticIds.map((id) => ({ value: id, label: `${mitreTacticCodes[id]} — ${tacticName(id)}` }))} />
              <SelectField label="How I was exposed" value={item.exposure} onChange={(v) => set(i, (c) => { c.exposure = v })} options={[{ value: "studied", label: "Studied" }, { value: "lab", label: "Lab / CTF" }, { value: "project", label: "Project" }, { value: "work", label: "Work" }]} />
              <AreaField label={`Description (${lang.toUpperCase()})`} value={item.description[lang]} max={400} rows={3} onChange={(v) => set(i, (c) => { c.description[lang] = v })} />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {items.length > 0 && <AddButton label="Add technique" disabled={items.length >= 200} onClick={add} />}
      </Group>
    </>
  )
}

// ---- Tools ---------------------------------------------------------------------------
const blankTool = (group: Tool["group"] = "security"): Tool => ({
  id: "tl-" + newId().slice(2), visible: false, group, name: "New tool", type: group === "programming" ? "language" : "security-tool", domain: "general",
  purpose: { en: "", id: "" }, workflow: { en: "", id: "" }, level: null, icon: null,
})
function toolIssues(item: Tool): string[] {
  const issues: string[] = []
  if (!item.name.trim()) issues.push("Name is required.")
  if (item.icon && !isSafeUrl(item.icon)) issues.push("Icon must be an uploaded image or an https:// link.")
  return issues
}
function toolWarnings(item: Tool): string[] {
  const fields: [string, string][] = [["Name", item.name]]
  for (const key of ["purpose", "workflow"] as const) for (const l of LOCALES) fields.push([`${key[0].toUpperCase()}${key.slice(1)} (${l.toUpperCase()})`, item[key][l]])
  return sensitiveWarnings(fields)
}

export function ToolsEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const items = draft.tools.items
  const published = items.filter((item) => item.visible).length
  const set = (i: number, change: (item: Tool) => void) => update((d) => { change(d.tools.items[i]) })
  const add = (group: Tool["group"]) => update((d) => { d.tools.items.push(blankTool(group)) })
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph. Column headings, type, domain and proficiency names are in All texts.">
        <CopyField {...p} k="toolsTitle" label="Title" />
        <CopyField {...p} k="toolsLabel" label="Small label (top right)" />
        <CopyField {...p} k="toolsIntro" label="Intro paragraph" area />
      </Group>
      <Group title={`Tools (${items.length}) — ${published} shown on the site`} note="Each tool goes into the Programming & Scripting table or the Security / Specialized Tools table, chosen by “Table”. List only tools you really use or have studied. Proficiency is optional and yours to set — leave it on “Not stated” if unsure. A logo is only shown if you upload one (use an official logo you may display); otherwise a generic icon is used. A table with nothing shown displays the “Coming soon” panel.">
        {items.length === 0 && <AdminEmpty title="No tools yet" body="Nothing is published for this page. Add your first tool, switch it on, then publish — the “Coming soon” panel disappears automatically."><AddButton label="Add programming / scripting" onClick={() => add("programming")} /><AddButton label="Add security tool" onClick={() => add("security")} /></AdminEmpty>}
        {items.map((item, i) => {
          const issues = toolIssues(item)
          const warnings = toolWarnings(item)
          return (
            <ItemCard key={item.id} title={`${item.group === "programming" ? "Programming" : "Security"}: ${item.name}`} index={i} count={items.length}
              onMove={(a, b) => update((d) => move(d.tools.items, a, b))}
              onDelete={() => update((d) => { d.tools.items.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <SelectField label="Table" value={item.group} onChange={(v) => set(i, (c) => { c.group = v })} options={[{ value: "programming", label: "Programming & Scripting" }, { value: "security", label: "Security / Specialized Tools" }]} />
              <TextField label="Tool name" value={item.name} max={100} hint="Use the tool’s official spelling." onChange={(v) => set(i, (c) => { c.name = v })} />
              <SelectField label="Type" value={item.type} onChange={(v) => set(i, (c) => { c.type = v })} options={[{ value: "language", label: "Programming language" }, { value: "scripting", label: "Scripting" }, { value: "framework", label: "Framework" }, { value: "platform", label: "Platform" }, { value: "security-tool", label: "Security tool" }, { value: "other", label: "Other" }]} />
              <SelectField label="Domain" value={item.domain} onChange={(v) => set(i, (c) => { c.domain = v })} options={[{ value: "red", label: "Red Team" }, { value: "blue", label: "Blue Team" }, { value: "purple", label: "Purple Team" }, { value: "general", label: "General" }, { value: "dfir", label: "DFIR" }, { value: "web", label: "Web Security" }]} />
              <AreaField label={`Purpose / how it is used (${lang.toUpperCase()})`} value={item.purpose[lang]} max={300} rows={2} onChange={(v) => set(i, (c) => { c.purpose[lang] = v })} />
              <AreaField label={`Workflow or example (optional, ${lang.toUpperCase()})`} value={item.workflow[lang]} max={400} rows={3} onChange={(v) => set(i, (c) => { c.workflow[lang] = v })} />
              <SelectField label="Proficiency (optional)" value={item.level ?? "none"} onChange={(v) => set(i, (c) => { c.level = v === "none" ? null : v })} hint="Never filled in automatically."
                options={[{ value: "none", label: "Not stated" }, { value: "familiar", label: "Familiar" }, { value: "practicing", label: "Practicing" }, { value: "proficient", label: "Proficient" }]} />
              <ImageField label="Logo / icon (optional)" value={item.icon} onChange={(v) => set(i, (c) => { c.icon = v })} hint="PNG, JPEG or WebP, up to 700 KB. Leave empty to use the generic icon." />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
              {warnings.length > 0 && <ul className="adm-warn" role="note">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {items.length > 0 && <><AddButton label="Add programming / scripting" disabled={items.length >= 150} onClick={() => add("programming")} /><AddButton label="Add security tool" disabled={items.length >= 150} onClick={() => add("security")} /></>}
      </Group>
    </>
  )
}

// ---- Achievements --------------------------------------------------------------------
const blankAchievement = (): Achievement => ({ id: "a-" + newId().slice(2), visible: false, title: "New achievement", year: null, issuer: "", description: { en: "", id: "" }, proofUrl: "" })
function achievementIssues(item: Achievement): string[] {
  const issues: string[] = []
  if (!item.title.trim()) issues.push("Title is required.")
  if (!yearOk(item.year)) issues.push("Year must be between 1990 and 2100.")
  if (item.proofUrl && !isSafeUrl(item.proofUrl)) issues.push("Proof link must start with https://, http:// or mailto:.")
  return issues
}
function achievementWarnings(item: Achievement): string[] {
  const fields: [string, string][] = [["Title", item.title], ["Organisation", item.issuer]]
  for (const l of LOCALES) fields.push([`Description (${l.toUpperCase()})`, item.description[l]])
  return sensitiveWarnings(fields)
}
export function AchievementsEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const items = draft.achievements.items
  const published = items.filter((item) => item.visible).length
  const set = (i: number, change: (item: Achievement) => void) => update((d) => { change(d.achievements.items[i]) })
  const add = () => update((d) => { d.achievements.items.push(blankAchievement()) })
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph. Column headings are in All texts.">
        <CopyField {...p} k="achievementsTitle" label="Title" />
        <CopyField {...p} k="achievementsLabel" label="Small label (top right)" />
        <CopyField {...p} k="achievementsIntro" label="Intro paragraph" area />
      </Group>
      <Group title={`Achievements (${items.length}) — ${published} shown on the site`} note="This page starts empty on purpose. Add only real achievements; switch “Show on site” on for each one that should be public. While none is shown, visitors see the “Coming soon” panel, which disappears automatically after the first one is published. Add, delete and reorder apply to both languages; descriptions are edited per language.">
        {items.length === 0 && <AdminEmpty title="No achievements yet" body="Nothing is published for this page. Add your first achievement with its year and description, switch it on, then publish."><AddButton label="Add achievement" onClick={add} /></AdminEmpty>}
        {items.map((item, i) => {
          const issues = achievementIssues(item)
          const warnings = achievementWarnings(item)
          return (
            <ItemCard key={item.id} title={`${item.year ?? "—"} · ${item.title}`} index={i} count={items.length}
              onMove={(a, b) => update((d) => move(d.achievements.items, a, b))}
              onDelete={() => update((d) => { d.achievements.items.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <TextField label="Achievement title" value={item.title} max={140} onChange={(v) => set(i, (c) => { c.title = v })} />
              <YearField label="Year" value={item.year} onChange={(v) => set(i, (c) => { c.year = v })} />
              <TextField label="Organisation / event (optional)" value={item.issuer} max={140} onChange={(v) => set(i, (c) => { c.issuer = v })} />
              <AreaField label={`Description (${lang.toUpperCase()})`} value={item.description[lang]} max={600} rows={3} onChange={(v) => set(i, (c) => { c.description[lang] = v })} />
              <TextField label="Proof link (optional)" mono value={item.proofUrl} max={2000} placeholder="https://…" onChange={(v) => set(i, (c) => { c.proofUrl = v.trim() })} />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
              {warnings.length > 0 && <ul className="adm-warn" role="note">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {items.length > 0 && <AddButton label="Add achievement" disabled={items.length >= 80} onClick={add} />}
      </Group>
    </>
  )
}

// ---- Security writeups ---------------------------------------------------------------
const blankWriteup = (): Writeup => ({ id: "w-" + newId().slice(2), visible: false, title: "New writeup", blog: "", year: null, summary: { en: "", id: "" }, tags: [], url: "" })
function writeupIssues(item: Writeup): string[] {
  const issues: string[] = []
  if (!item.title.trim()) issues.push("Title is required.")
  if (!yearOk(item.year)) issues.push("Year must be between 1990 and 2100.")
  if (item.url && !/^https?:\/\//i.test(item.url)) issues.push("Link must be a full address starting with https:// or http://.")
  else if (item.url && !isSafeUrl(item.url)) issues.push("This link is not allowed.")
  if (item.tags.length > 8) issues.push("At most 8 tags.")
  return issues
}
function writeupWarnings(item: Writeup): string[] {
  const fields: [string, string][] = [["Title", item.title], ["Blog", item.blog]]
  for (const l of LOCALES) fields.push([`Summary (${l.toUpperCase()})`, item.summary[l]])
  return sensitiveWarnings(fields)
}
export function WriteupsEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const items = draft.writeups.items
  const published = items.filter((item) => item.visible).length
  const set = (i: number, change: (item: Writeup) => void) => update((d) => { change(d.writeups.items[i]) })
  const add = () => update((d) => { d.writeups.items.push(blankWriteup()) })
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph. Button and filter texts are in All texts.">
        <CopyField {...p} k="writeupsTitle" label="Title" />
        <CopyField {...p} k="writeupsLabel" label="Small label (top right)" />
        <CopyField {...p} k="writeupsIntro" label="Intro paragraph" area />
      </Group>
      <Group title={`Writeups (${items.length}) — ${published} shown on the site`} note="Add only write-ups you really published. Each card shows the blog name, a short description and a “Read writeup” button that opens your link in a new tab. Never include credentials, private IP addresses or exploit details for targets you had no permission to test. While none is shown, visitors see the “Coming soon” panel.">
        {items.length === 0 && <AdminEmpty title="No writeups yet" body="Nothing is published for this page. Add your first writeup with its blog name and link, switch it on, then publish."><AddButton label="Add writeup" onClick={add} /></AdminEmpty>}
        {items.map((item, i) => {
          const issues = writeupIssues(item)
          const warnings = writeupWarnings(item)
          return (
            <ItemCard key={item.id} title={`${item.blog ? item.blog + " · " : ""}${item.title}`} index={i} count={items.length}
              onMove={(a, b) => update((d) => move(d.writeups.items, a, b))}
              onDelete={() => update((d) => { d.writeups.items.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <TextField label="Writeup title" value={item.title} max={140} onChange={(v) => set(i, (c) => { c.title = v })} />
              <TextField label="Blog / platform name" value={item.blog} max={100} hint="Example: the name of the site where it is published." onChange={(v) => set(i, (c) => { c.blog = v })} />
              <YearField label="Year" value={item.year} onChange={(v) => set(i, (c) => { c.year = v })} />
              <AreaField label={`Short description (${lang.toUpperCase()})`} value={item.summary[lang]} max={300} rows={3} onChange={(v) => set(i, (c) => { c.summary[lang] = v })} />
              <TextField label="Tags (comma separated, max 8)" value={item.tags.join(", ")} max={240} hint="Example: web, forensics, active-directory" onChange={(v) => set(i, (c) => { c.tags = v.split(",").map((x) => x.trim().slice(0, 30)).filter(Boolean).slice(0, 8) })} />
              <TextField label="Link to the writeup" mono value={item.url} max={2000} placeholder="https://…" onChange={(v) => set(i, (c) => { c.url = v.trim() })} />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
              {warnings.length > 0 && <ul className="adm-warn" role="note">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {items.length > 0 && <AddButton label="Add writeup" disabled={items.length >= 100} onClick={add} />}
      </Group>
    </>
  )
}

// ---- Contact -------------------------------------------------------------------------
const blankSocial = (): SocialLink => ({ id: "s-" + newId().slice(2), visible: false, platform: "github", icon: null, label: "", url: "", description: { en: "", id: "" } })
function socialIssues(item: SocialLink): string[] {
  const issues: string[] = []
  if (item.url && !/^https?:\/\//i.test(item.url)) issues.push("Link must be a full address starting with https:// or http://.")
  else if (item.url && !isSafeUrl(item.url)) issues.push("This link is not allowed.")
  return issues
}
function socialWarnings(item: SocialLink): string[] {
  const warnings: string[] = []
  if (item.visible && !item.url.trim()) warnings.push("Switched on but has no link yet, so it is NOT shown on the site.")
  return warnings.concat(sensitiveWarnings([["Username / label", item.label], ...LOCALES.map((l): [string, string] => [`Description (${l.toUpperCase()})`, item.description[l]])]))
}

const PLATFORM_CHOICES = [...socialPlatforms.filter((k) => k !== "other" && k !== "custom"), "other", "custom"] as const
/** Icon grid instead of a plain dropdown, so you see the logo you are choosing. */
function PlatformPicker({ value, onChange }: { value: SocialLink["platform"]; onChange: (v: SocialLink["platform"]) => void }) {
  const nameOf = (k: SocialLink["platform"]) => k === "other" ? "Website / Blog" : k === "custom" ? "Custom image" : platformName(k)
  return (
    <div className="adm-field">
      <span className="adm-label">Platform (decides the icon) — {nameOf(value)}</span>
      <div className="adm-platform-grid" role="radiogroup" aria-label="Platform">
        {PLATFORM_CHOICES.map((k) => (
          <button key={k} type="button" role="radio" aria-checked={value === k} data-on={value === k} title={nameOf(k)} onClick={() => onChange(k)}>
            <span className="adm-platform-ico">{k === "custom" ? <ImagePlus aria-hidden="true" /> : <SocialIcon platform={k} tinted />}</span>
            <span>{nameOf(k)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ContactEditor(p: EditorProps) {
  const { draft, update, lang } = p
  const contact = draft.contact
  const shown = contact.socials.filter((item) => item.visible && item.url.trim()).length
  const set = (i: number, change: (item: SocialLink) => void) => update((d) => { change(d.contact.socials[i]) })
  const emailInvalid = contact.email.trim() !== "" && !isValidEmail(contact.email.trim())
  return (
    <>
      <Group title="Section heading" note="The page title, small label and intro paragraph.">
        <CopyField {...p} k="contactTitle" label="Title" />
        <CopyField {...p} k="contactLabel" label="Small label (top right)" />
        <CopyField {...p} k="contactIntro" label="Intro paragraph" area />
      </Group>
      <Group title="Email shown on the page" note="This is only the address visitors see (with a “Send an email” link). Leave it empty to hide the email card. Where the contact FORM delivers its messages is NOT set here: it is the server setting CONTACT_TO_EMAIL, so no inbox address or provider key is ever stored in the site content.">
        <TextField label="Public email address (optional)" mono value={contact.email} max={254} placeholder="you@example.com" onChange={(v) => update((d) => { d.contact.email = v.trim() })} />
        {emailInvalid && <ul className="adm-issues" role="alert"><li>Enter a valid email address.</li></ul>}
      </Group>
      <Group title="Form texts" note="Field labels, error messages and button texts are under All texts (keys starting with “cf”). These two are the ones you will most likely want to adjust.">
        <CopyField {...p} k="contactFormTitle" label="Form heading" />
        <CopyField {...p} k="cfPrivacy" label="Privacy note under the form" area />
        <CopyField {...p} k="cfSuccessBody" label="Text after a message is sent" area />
      </Group>
      <Group title={`Social links (${contact.socials.length}) — ${shown} shown on the site`} note="A link appears only when it is switched on AND has a full https:// (or http://) address. Do not add accounts or links you do not own. Order here is the order on the site. Pick the platform to get its official-style icon automatically. For a personal blog or any site not in the list choose “Website / Blog” (generic link icon) or “Custom image” to upload your own icon.">
        {contact.socials.length === 0 && <AdminEmpty title="No social links yet" body="Nothing is published. Add LinkedIn, GitHub, Discord, Instagram or any other platform, switch it on, then publish."><AddButton label="Add social link" onClick={() => update((d) => { d.contact.socials.push(blankSocial()) })} /></AdminEmpty>}
        {contact.socials.map((item, i) => {
          const issues = socialIssues(item)
          const warnings = socialWarnings(item)
          return (
            <ItemCard key={item.id} title={`${item.platform}${item.label ? " · " + item.label : ""}`} index={i} count={contact.socials.length}
              onMove={(a, b) => update((d) => move(d.contact.socials, a, b))}
              onDelete={() => update((d) => { d.contact.socials.splice(i, 1) })}>
              <SwitchField label="Show on site" checked={item.visible} onChange={(v) => set(i, (c) => { c.visible = v })} hint={item.visible ? "published with the next Publish" : "hidden from visitors"} />
              <PlatformPicker value={item.platform} onChange={(v) => set(i, (c) => { c.platform = v })} />
              {item.platform === "custom" && <ImageField label="Your own icon (logo of this blog / site)" value={item.icon} onChange={(v) => set(i, (c) => { c.icon = v })} hint="PNG, JPEG or WebP, ideally square. Without an image the generic link icon is shown." />}
              <TextField label="Username / label" value={item.label} max={80} hint="Shown as the title. Empty = the platform name." onChange={(v) => set(i, (c) => { c.label = v })} />
              <TextField label="Link (URL)" mono value={item.url} max={2000} placeholder="https://…" onChange={(v) => set(i, (c) => { c.url = v.trim() })} />
              <TextField label={`Short description (optional, ${lang.toUpperCase()})`} value={item.description[lang]} max={160} onChange={(v) => set(i, (c) => { c.description[lang] = v })} />
              {issues.length > 0 && <ul className="adm-issues" role="alert">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
              {warnings.length > 0 && <ul className="adm-warn" role="note">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
            </ItemCard>
          )
        })}
        {contact.socials.length > 0 && <AddButton label="Add social link" disabled={contact.socials.length >= 12} onClick={() => update((d) => { d.contact.socials.push(blankSocial()) })} />}
      </Group>
    </>
  )
}

// ---- Page Footer ---------------------------------------------------------------------
export function FooterEditor({ draft, update, lang }: EditorProps) {
  const footer = draft.footer
  const set = (key: "showStatus" | "showSocials" | "showEmail" | "showBottomNote" | "showBackToTop" | "showCopyright", value: boolean) => update((d) => { d.footer[key] = value })

  return (
    <>
      <Group title="Footer identity & message" note="This controls the closing footer at the very bottom of the public website. The copyright owner is independent from the profile / SEO name. Changes appear in the live preview and are published with the main Publish button.">
        <AreaField label={`Closing message (${lang.toUpperCase()})`} value={footer.tagline[lang]} max={240} rows={3} onChange={(v) => update((d) => { d.footer.tagline[lang] = v })} />
        <TextField label={`Top footer label (${lang.toUpperCase()})`} value={footer.transmissionLabel[lang]} max={80} onChange={(v) => update((d) => { d.footer.transmissionLabel[lang] = v })} />
        <TextField label={`Connect heading (${lang.toUpperCase()})`} value={footer.connectLabel[lang]} max={80} onChange={(v) => update((d) => { d.footer.connectLabel[lang] = v })} />
        <TextField label={`Online status text (${lang.toUpperCase()})`} value={footer.statusLabel[lang]} max={80} onChange={(v) => update((d) => { d.footer.statusLabel[lang] = v })} />
        <TextField label={`Bottom signature (${lang.toUpperCase()})`} value={footer.bottomNote[lang]} max={180} onChange={(v) => update((d) => { d.footer.bottomNote[lang] = v })} />
        <TextField label={`Back-to-top link (${lang.toUpperCase()})`} value={footer.backToTopLabel[lang]} max={60} onChange={(v) => update((d) => { d.footer.backToTopLabel[lang] = v })} />
        <TextField label="Copyright owner / name (public footer only)" value={footer.copyrightName} max={100} onChange={(v) => update((d) => { d.footer.copyrightName = v })} />
        <TextField label={`Copyright suffix (${lang.toUpperCase()})`} value={footer.rightsText[lang]} max={100} onChange={(v) => update((d) => { d.footer.rightsText[lang] = v })} />
      </Group>
      <Group title="Footer components" note="Hide or show individual footer elements without deleting their text or social accounts.">
        <SwitchField label="Online status indicator" checked={footer.showStatus} onChange={(v) => set("showStatus", v)} />
        <SwitchField label="Social links" checked={footer.showSocials} onChange={(v) => set("showSocials", v)} hint="Accounts and URLs are managed in Page 09 — Contact." />
        <SwitchField label="Email link" checked={footer.showEmail} onChange={(v) => set("showEmail", v)} hint="Uses the public email from Page 09 — Contact." />
        <SwitchField label="Bottom signature" checked={footer.showBottomNote} onChange={(v) => set("showBottomNote", v)} />
        <SwitchField label="Back to top" checked={footer.showBackToTop} onChange={(v) => set("showBackToTop", v)} />
        <SwitchField label="Copyright line" checked={footer.showCopyright} onChange={(v) => set("showCopyright", v)} />
      </Group>
      <Group title="Social destinations" note="To add, edit, reorder or remove GitHub, LinkedIn, email and other destinations, open Page 09 — Contact → Social links. The footer reuses those same verified links, so you only maintain them once.">
        <div className="adm-hint">{draft.contact.socials.filter((item) => item.visible && item.url.trim()).length} active social link(s) · {draft.contact.email.trim() ? "Public email configured" : "No public email configured"}</div>
      </Group>
    </>
  )
}

export const BUILT_SECTIONS = ["header", "intro", "about", "education", "experience", "certifications", "skills", "mitre", "projects", "training", "tools", "achievements", "writeups", "contact", "footer"]
export function SectionsEditor({ draft, update }: EditorProps) {
  type Entry = { key: string; kind: "built-in" | "custom"; id: string; label: string; order: number; visible: boolean }
  const confirm = useConfirm()
  const entries: Entry[] = [
    ...draft.sections.filter((section) => section.id !== "header" && section.id !== "footer" && BUILT_SECTIONS.includes(section.id)).map((section) => ({ key: `built-in:${section.id}`, kind: "built-in" as const, id: section.id, label: section.editorLabel, order: section.order, visible: section.visible })),
    ...draft.customPages.pages.map((section) => ({ key: `custom:${section.id}`, kind: "custom" as const, id: section.id, label: section.title["en"] || section.slug, order: section.order, visible: section.visible })),
  ].sort((a, b) => a.order - b.order)

  function persistOrder(next: Entry[]) {
    update((d) => {
      next.forEach((entry, index) => {
        const target = entry.kind === "built-in" ? d.sections.find((section) => section.id === entry.id) : d.customPages.pages.find((section) => section.id === entry.id)
        if (target) target.order = index + 1
      })
      const header = d.sections.find((section) => section.id === "header")
      const footer = d.sections.find((section) => section.id === "footer")
      if (header) header.order = 0
      if (footer) footer.order = 99
    })
  }
  function move(key: string, direction: -1 | 1) {
    const from = entries.findIndex((entry) => entry.key === key)
    const to = from + direction
    if (from < 0 || to < 0 || to >= entries.length) return
    const next = [...entries]
    ;[next[from], next[to]] = [next[to], next[from]]
    persistOrder(next)
  }
  function setVisibility(entry: Entry, visible: boolean) {
    update((d) => {
      const target = entry.kind === "built-in" ? d.sections.find((section) => section.id === entry.id) : d.customPages.pages.find((section) => section.id === entry.id)
      if (target) target.visible = visible
    })
  }
  async function deleteEntry(entry: Entry) {
    if (entry.kind === "custom") {
      if (!(await confirm({ title: `Delete the page “${entry.label}”?`, body: "This permanently deletes this page and all of its components from the draft. Other pages are not affected.", confirmLabel: "Delete page", danger: true }))) return
      update((d) => { d.customPages.pages = d.customPages.pages.filter((item) => item.id !== entry.id) })
      return
    }
    if (!(await confirm({ title: `Delete “${entry.label}”?`, body: "The page disappears from the website and from the page list on the left. Its content is kept, so you can bring it back any time with Restore (under Deleted pages).", confirmLabel: "Delete page", danger: true }))) return
    setVisibility(entry, false)
  }
  const shown = entries.filter((entry) => entry.visible)

  return (
    <>
      <Group title="Pages — order, delete, restore" note="All pages of your website, built-in and your own, in one list. Move a page up or down, delete it, or restore a deleted one. The number on each heading and in the top menu follows this order automatically. A deleted built-in page keeps its content, so Restore brings it back exactly as it was. Create new pages with “New page” at the bottom of the page list on the left.">
        <div className="adm-row"><strong>Header / navigation</strong><span className="adm-hint">Pinned at the top</span></div>
        {entries.map((entry, index) => {
          const position = shown.findIndex((item) => item.key === entry.key)
          return (
            <div className="adm-row" key={entry.key} data-muted={!entry.visible}>
              <div>
                <strong>{entry.visible ? `${String(position).padStart(2, "0")} · ` : ""}{entry.label}</strong>
                <span className="adm-hint">{entry.kind === "custom" ? "Your page" : "Built-in page"}{entry.visible ? "" : entry.kind === "custom" ? " · hidden (not on the website)" : " · deleted (not on the website)"}</span>
              </div>
              <div className="adm-row-tools">
                <button type="button" className="adm-icon" aria-label={`Move ${entry.label} up`} disabled={index === 0} onClick={() => move(entry.key, -1)}>↑</button>
                <button type="button" className="adm-icon" aria-label={`Move ${entry.label} down`} disabled={index === entries.length - 1} onClick={() => move(entry.key, 1)}>↓</button>
                {entry.visible
                  ? <button type="button" className="adm-btn adm-btn-small adm-btn-danger" onClick={() => void deleteEntry(entry)}>Delete</button>
                  : <button type="button" className="adm-btn adm-btn-small" onClick={() => setVisibility(entry, true)}>Restore</button>}
              </div>
            </div>
          )
        })}
        <div className="adm-row"><strong>Footer</strong><span className="adm-hint">Pinned at the bottom</span></div>
      </Group>
    </>
  )
}

// ---- Every UI text -------------------------------------------------------------------
const prettify = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
export function TextsEditor(p: EditorProps) {
  const { draft, lang } = p
  const [query, setQuery] = useState("")
  const keys = Object.keys(draft.copy.en).sort().filter((k) => !query || k.toLowerCase().includes(query.toLowerCase()) || (draft.copy[lang][k] || "").toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <div className="adm-search"><Search aria-hidden="true" /><input className="adm-input" placeholder="Search texts…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search texts" /></div>
      <Group title={`${keys.length} texts (${lang.toUpperCase()})`} note="Every label, button and message on the site. Page-specific texts are also on their own page.">
        {keys.map((k) => <CopyField key={k} {...p} k={k} label={prettify(k)} area={(draft.copy[lang][k] || "").length > 70} />)}
      </Group>
    </>
  )
}

export function PageIntro({ children }: { children: ReactNode }) { return <>{children}</> }


// ---- Theme & Custom Page Studio ------------------------------------------------------
type StarterKind = "blank" | "portfolio" | "article" | "research" | "gallery"
type BlockKind = CustomBlock["type"]
const makeStudioId = (prefix: string) => `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "").slice(0, 12) : Math.random().toString(36).slice(2, 14).padEnd(12, "0")}`
const studioText = (en = "", id = ""): { en: string; id: string } => ({ en, id })
const palettes = {
  blue: { accent: "#55aaff", secondary: "#338cff" },
  red: { accent: "#ff647c", secondary: "#dc365f" },
  purple: { accent: "#b58cff", secondary: "#8957e8" },
  general: { accent: "#45d6c0", secondary: "#229f91" },
} as const
function HexColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [inputValue, setInputValue] = useState(value)
  useEffect(() => setInputValue(value), [value])
  const valid = /^#[0-9a-fA-F]{6}$/.test(inputValue)
  return <Field label={label} hint={!valid ? "Enter a six-digit HEX value, for example #55AAFF" : undefined}>
    <div className="adm-inline">
      <input className="adm-input" type="color" aria-label={`Choose ${label}`} value={value} onChange={(event) => onChange(event.target.value)} />
      <input className="adm-input adm-mono" aria-label={`${label} value`} value={inputValue} maxLength={7} spellCheck={false} onChange={(event) => setInputValue(event.target.value)} onBlur={() => { if (valid) onChange(inputValue); else setInputValue(value) }} onKeyDown={(event) => { if (event.key === "Enter" && valid) onChange(inputValue) }} />
    </div>
  </Field>
}
function makeStudioBlock(kind: BlockKind): CustomBlock {
  const id = makeStudioId("blk")
  if (kind === "hero") return { id, type: "hero", eyebrow: studioText("NEW PAGE", "HALAMAN BARU"), heading: studioText("A new chapter", "Bab baru"), body: studioText("Add an introduction for this page.", "Tambahkan pengantar untuk halaman ini.") }
  if (kind === "text") return { id, type: "text", heading: studioText("Section heading", "Judul bagian"), body: studioText("Write your content here.", "Tulis konten di sini.") }
  if (kind === "image") return { id, type: "image", image: null, alt: studioText("", ""), caption: studioText("", "") }
  if (kind === "cards") return { id, type: "cards", heading: studioText("Highlights", "Sorotan"), items: [{ id: makeStudioId("item"), title: studioText("New card", "Kartu baru"), body: studioText("Describe this item.", "Jelaskan item ini."), tag: "FEATURE" }] }
  if (kind === "stats") return { id, type: "stats", heading: studioText("At a glance", "Sekilas"), items: [{ id: makeStudioId("item"), value: "03", label: studioText("Highlights", "Sorotan") }] }
  if (kind === "timeline") return { id, type: "timeline", heading: studioText("Timeline", "Linimasa"), items: [{ id: makeStudioId("item"), period: "2026", title: studioText("Milestone", "Pencapaian"), body: studioText("Describe this milestone.", "Jelaskan pencapaian ini.") }] }
  if (kind === "gallery") return { id, type: "gallery", heading: studioText("Gallery", "Galeri"), images: [] }
  if (kind === "cta") return { id, type: "cta", heading: studioText("Let's connect", "Mari terhubung"), body: studioText("Add a short call to action.", "Tambahkan ajakan singkat."), buttonLabel: studioText("Contact me", "Hubungi saya"), href: "/#contact" }
  return { id, type: "divider" }
}
/** Builds a new custom homepage section placed after every existing section. Shared by Studio and Sections & order. */
function newCustomSection(draft: SiteContent, title: string, kind: StarterKind, fromTemplate?: CustomTemplate): CustomPage {
  const clean = title.trim() || "New page"
  const basePalette = draft.appearance.preset === "custom" ? { accent: draft.appearance.accentColor, secondary: draft.appearance.secondaryColor } : palettes[draft.appearance.preset]
  const orders = [
    ...draft.sections.filter((item) => item.id !== "header" && item.id !== "footer").map((item) => item.order),
    ...draft.customPages.pages.map((item) => item.order),
  ]
  return {
    id: makeStudioId("section"), slug: uniqueStudioSlug(clean, new Set(draft.customPages.pages.map((item) => item.slug))),
    title: studioText(clean, clean), summary: studioText("", ""), visible: true, showInNav: true,
    order: Math.min(98, Math.max(0, ...orders) + 1),
    accentColor: fromTemplate?.accentColor || basePalette.accent,
    secondaryColor: fromTemplate?.secondaryColor || basePalette.secondary,
    blocks: structuredClone(fromTemplate?.blocks || starterBlocks(kind)),
  }
}
function starterBlocks(kind: StarterKind): CustomBlock[] {
  if (kind === "blank") return []
  if (kind === "portfolio") return [makeStudioBlock("hero"), makeStudioBlock("cards"), makeStudioBlock("stats"), makeStudioBlock("cta")]
  if (kind === "article") return [makeStudioBlock("hero"), makeStudioBlock("text"), makeStudioBlock("text"), makeStudioBlock("image"), makeStudioBlock("cta")]
  if (kind === "research") return [makeStudioBlock("hero"), makeStudioBlock("stats"), makeStudioBlock("timeline"), makeStudioBlock("text")]
  return [makeStudioBlock("hero"), makeStudioBlock("gallery"), makeStudioBlock("text")]
}
const slugifyStudio = (value: string) => value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "new-page"
function uniqueStudioSlug(value: string, used: Set<string>) {
  const base = slugifyStudio(value)
  if (!used.has(base)) return base
  let suffix = 2
  while (suffix < 10000) {
    const ending = `-${suffix++}`
    const candidate = `${base.slice(0, 48 - ending.length)}${ending}`
    if (!used.has(candidate)) return candidate
  }
  throw new Error("Could not generate a unique page URL")
}

/**
 * One component, three jobs (all state shared):
 *  - "theme": global appearance only (colors, glow, cursor, fonts)
 *  - "new":   create a new page from a starter layout / saved template / imported JSON
 *  - "page":  edit one custom page (`pageId`): settings, components, templates, preview, delete
 * Custom pages are normal pages of the same one-page website, ordered in Sections & order.
 */
export function StudioEditor({ draft, update, lang, mode = "theme", pageId = "", onCreated, onDeleted }: EditorProps & { mode?: "theme" | "new" | "page"; pageId?: string; onCreated?: (id: string) => void; onDeleted?: () => void }) {
  const [selectedId, setSelectedId] = useState(pageId || draft.customPages.pages[0]?.id || "")
  const [starter, setStarter] = useState<StarterKind>("portfolio")
  const [newTitle, setNewTitle] = useState("")
  const [newTemplateId, setNewTemplateId] = useState("")
  const [templateName, setTemplateName] = useState("")
  const [templateToApply, setTemplateToApply] = useState("")
  const [blockKind, setBlockKind] = useState<BlockKind>("text")
  const [draggingBlockIndex, setDraggingBlockIndex] = useState<number | null>(null)
  const [importError, setImportError] = useState("")
  const importRef = useRef<HTMLInputElement>(null)
  const confirm = useConfirm()
  const section = draft.customPages.pages.find((item) => item.id === (mode === "page" ? pageId : selectedId)) || null

  function nextSectionOrder() {
    const orders = [
      ...draft.sections.filter((item) => item.id !== "header" && item.id !== "footer").map((item) => item.order),
      ...draft.customPages.pages.map((item) => item.order),
    ]
    return Math.min(99, Math.max(0, ...orders) + 1)
  }

  function createSection(kind: StarterKind, fromTemplate?: CustomTemplate) {
    if (draft.customPages.pages.length >= 24) return
    const next = newCustomSection(draft, newTitle, kind, fromTemplate)
    update((d) => { d.customPages.pages.push(next) })
    setSelectedId(next.id)
    setNewTitle("")
    onCreated?.(next.id)
  }

  function updateSection(mutate: (item: CustomPage) => void) {
    if (!section) return
    update((d) => { const item = d.customPages.pages.find((entry) => entry.id === section.id); if (item) mutate(item) })
  }
  function updateBlock(index: number, mutate: (block: CustomBlock) => void) {
    updateSection((item) => { const target = item.blocks[index]; if (target) mutate(target) })
  }
  function patchBlock(index: number, patch: Partial<CustomBlock>) {
    updateBlock(index, (block) => Object.assign(block, patch))
  }
  function reorderBlock(from: number, to: number) {
    if (!section || to < 0 || to >= section.blocks.length) return
    updateSection((item) => { const [block] = item.blocks.splice(from, 1); item.blocks.splice(to, 0, block) })
  }
  async function deleteSection() {
    if (!section || !(await confirm({ title: `Delete the page “${section.title.en || section.slug}”?`, body: "This permanently deletes this page and all of its components from the draft. Other pages are not affected. (Until you press Publish, Discard brings it back.)", confirmLabel: "Delete page", danger: true }))) return
    update((d) => { d.customPages.pages = d.customPages.pages.filter((item) => item.id !== section.id) })
    onDeleted?.()
  }
  function duplicateSection() {
    if (!section || draft.customPages.pages.length >= 24) return
    const slug = uniqueStudioSlug(`${section.slug}-copy`, new Set(draft.customPages.pages.map((item) => item.slug)))
    const copy = { ...structuredClone(section), id: makeStudioId("section"), slug, title: studioText(`${section.title.en || "Custom section"} Copy`, `${section.title.id || "Bagian kustom"} Salinan`), visible: false, showInNav: false, order: nextSectionOrder() }
    update((d) => { d.customPages.pages.push(copy) })
    setSelectedId(copy.id)
    onCreated?.(copy.id)
  }
  function saveTemplate() {
    if (!section || !templateName.trim() || draft.customPages.templates.length >= 24) return
    update((d) => { d.customPages.templates.push({ id: makeStudioId("tpl"), name: templateName.trim().slice(0, 80), accentColor: section.accentColor, secondaryColor: section.secondaryColor, blocks: structuredClone(section.blocks) }) })
    setTemplateName("")
  }
  function applyTemplate(templateId = templateToApply) {
    const template = draft.customPages.templates.find((item) => item.id === templateId)
    if (!template || !section) return
    updateSection((item) => { item.blocks = structuredClone(template.blocks); item.accentColor = template.accentColor; item.secondaryColor = template.secondaryColor })
  }
  function downloadJson(filename: string, value: unknown) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" })
    const href = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = href; link.download = filename; link.click()
    window.setTimeout(() => URL.revokeObjectURL(href), 1000)
  }
  function exportSection() { if (section) downloadJson(`${section.slug}-section.json`, section) }
  function exportTemplate(template: CustomTemplate) { downloadJson(`${slugifyStudio(template.name)}-template.json`, template) }
  async function importJson(file?: File) {
    setImportError(""); if (!file) return
    try {
      if (file.size > 500_000) throw new Error("JSON file must be smaller than 500 KB.")
      const raw: unknown = JSON.parse(await file.text())
      const asTemplate = customTemplateSchema.safeParse(raw)
      if (asTemplate.success) {
        if (draft.customPages.templates.length >= 24) throw new Error("Maximum of 24 saved templates reached.")
        const imported = { ...asTemplate.data, id: makeStudioId("tpl"), name: `${asTemplate.data.name} (Imported)`.slice(0, 80) }
        update((d) => { d.customPages.templates.push(imported) })
        setTemplateToApply(imported.id)
        setImportError("Template imported. Use it under “Start from saved template”.")
      } else {
        const parsed = customPageSchema.safeParse(raw)
        if (!parsed.success) throw new Error(`Invalid section/template JSON: ${parsed.error.issues[0]?.path.join(".") || "document"} — ${parsed.error.issues[0]?.message || "Invalid data"}`)
        if (draft.customPages.pages.length >= 24) throw new Error("Maximum of 24 custom pages reached.")
        const imported = { ...parsed.data, id: makeStudioId("section"), slug: uniqueStudioSlug(parsed.data.slug, new Set(draft.customPages.pages.map((item) => item.slug))), visible: false, showInNav: false, order: nextSectionOrder() }
        update((d) => { d.customPages.pages.push(imported) })
        setSelectedId(imported.id)
        onCreated?.(imported.id)
      }
    } catch (error) { setImportError(error instanceof Error ? error.message : "Import failed") }
    finally { if (importRef.current) importRef.current.value = "" }
  }

  const presets = ["blue", "red", "purple", "general", "custom"] as const
  return (
    <>
      {mode === "theme" && (
        <>
      <Group title="Global appearance" note="One adaptive visual identity for the existing one-page portfolio. Theme colors drive accent typography and zodiac lines. Global Glow intensity and Cursor animation intensity are independent controls. The galaxy layout and existing animations stay in place.">
        <div className="adm-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))" }}>
          {presets.map((preset) => {
            const color = preset === "custom" ? draft.appearance.accentColor : palettes[preset].accent
            return <button key={preset} type="button" className="adm-chip" aria-pressed={draft.appearance.preset === preset} onClick={() => update((d) => { d.appearance.preset = preset; if (preset !== "custom") { d.appearance.accentColor = palettes[preset].accent; d.appearance.secondaryColor = palettes[preset].secondary } })} style={{ display: "flex", alignItems: "center", gap: 8, borderColor: draft.appearance.preset === preset ? color : undefined }}><span style={{ width: 12, height: 12, borderRadius: 99, background: color, display: "inline-block" }} />{preset === "blue" ? "Blue Team" : preset === "red" ? "Red Team" : preset === "purple" ? "Purple Team" : preset === "general" ? "General" : "Custom"}</button>
          })}
        </div>
        {draft.appearance.preset === "custom" && <div className="adm-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}><HexColorField label="Primary accent HEX" value={draft.appearance.accentColor} onChange={(value) => update((d) => { d.appearance.accentColor = value })} /><HexColorField label="Secondary accent HEX" value={draft.appearance.secondaryColor} onChange={(value) => update((d) => { d.appearance.secondaryColor = value })} /></div>}
        <Field label={`Glow intensity (${draft.appearance.glow}%)`} hint="Controls the ambient zodiac bloom, section shadows and general accent glow. It does not change cursor animation intensity."><input className="adm-input" type="range" min={0} max={100} step={1} value={draft.appearance.glow} onChange={(e) => update((d) => { d.appearance.glow = Number(e.target.value) })} /></Field>
        <SwitchField label="Enable celestial cursor animation" checked={draft.appearance.cursorEffect} onChange={(value) => update((d) => { d.appearance.cursorEffect = value })} hint="Turn the orbit cursor and pointer-reactive constellation effect on or off. It is hidden on touch devices and when reduced motion is enabled; it is independent from Glow intensity." />
        <Field label={`Cursor animation intensity (${draft.appearance.cursorIntensity}%)`} hint="Controls only the cursor aura and pointer-reactive constellation response. Set to 0% for no cursor effect, or turn the switch off to disable it completely."><input className="adm-input" type="range" min={0} max={100} step={1} value={draft.appearance.cursorIntensity} disabled={!draft.appearance.cursorEffect} onChange={(e) => update((d) => { d.appearance.cursorIntensity = Number(e.target.value) })} /></Field>
        <div className="adm-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
          <SelectField label="Heading font" value={draft.appearance.headingFont} onChange={(v) => update((d) => { d.appearance.headingFont = v })} options={[{ value: "inter", label: "Inter — clean" }, { value: "plex-mono", label: "IBM Plex Mono — technical" }, { value: "system", label: "System — native" }]} />
          <SelectField label="Body font" value={draft.appearance.bodyFont} onChange={(v) => update((d) => { d.appearance.bodyFont = v })} options={[{ value: "inter", label: "Inter — clean" }, { value: "plex-mono", label: "IBM Plex Mono — technical" }, { value: "system", label: "System — native" }]} />
          <SelectField label="Terminal / code font" value={draft.appearance.monoFont} onChange={(v) => update((d) => { d.appearance.monoFont = v })} options={[{ value: "plex-mono", label: "IBM Plex Mono" }, { value: "inter", label: "Inter" }, { value: "system", label: "System monospace" }]} />
          <SelectField label="Heading weight" value={draft.appearance.headingWeight} onChange={(v) => update((d) => { d.appearance.headingWeight = v })} options={[{ value: "600", label: "Semibold" }, { value: "700", label: "Bold" }, { value: "800", label: "Extra bold" }]} />
        </div>
      </Group>
        </>
      )}
      {mode === "new" && (
        <Group title="New page" note="A new page is added to your website like every other page (Page 00, Education, Skills …): it appears in the page list on the left, you can edit it, delete it, and move it up or down in Sections & order. Start from a ready-made layout or one of your saved templates, then customize everything.">
        <div className="adm-studio-toolbar">
          <div className="adm-inline">
            <TextField label="Page title" value={newTitle} max={120} placeholder="e.g. Bug bounty highlights" onChange={setNewTitle} />
            <Field label="Starter layout"><select className="adm-input" value={starter} onChange={(e) => setStarter(e.target.value as StarterKind)}><option value="blank">Blank section</option><option value="portfolio">Portfolio showcase</option><option value="article">Technical article</option><option value="research">Research / timeline</option><option value="gallery">Gallery showcase</option></select></Field>
          </div>
          {draft.customPages.templates.length > 0 && <Field label="Start from saved template"><select className="adm-input" value={newTemplateId} onChange={(e) => setNewTemplateId(e.target.value)}><option value="">Use starter layout above</option>{draft.customPages.templates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>}
          <AddButton label="Create page" disabled={draft.customPages.pages.length >= 24 || !newTitle.trim()} onClick={() => createSection(starter, draft.customPages.templates.find((item) => item.id === newTemplateId))} />
          <div className="adm-row-tools"><button type="button" className="adm-btn" onClick={() => importRef.current?.click()}><Upload />Import page / template JSON</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(e) => void importJson(e.target.files?.[0])} /></div>
          {importError && <p className="adm-issues" role="alert">{importError}</p>}
          <p className="adm-hint">{draft.customPages.pages.length}/24 custom pages · {draft.customPages.templates.length}/24 reusable templates.</p>
        </div>
        </Group>
      )}
      {mode === "page" && (
        <>
          {section ? <div className="adm-studio-editor">
            <div className="adm-row-tools" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}><button type="button" className="adm-btn" onClick={duplicateSection}><Copy />Duplicate page</button><button type="button" className="adm-btn" onClick={exportSection}><Download />Export JSON</button><button type="button" className="adm-btn adm-btn-danger" onClick={() => void deleteSection()}><Trash2 />Delete page</button></div>
            <Group title="Page settings">
              <TextField label={`Page title (${lang.toUpperCase()})`} value={section.title[lang]} max={120} onChange={(v) => updateSection((item) => { item.title[lang] = v })} />
              <AreaField label={`Short introduction (${lang.toUpperCase()})`} value={section.summary[lang]} max={400} rows={2} onChange={(v) => updateSection((item) => { item.summary[lang] = v })} />
              <div className="adm-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}><HexColorField label="Section accent" value={section.accentColor} onChange={(v) => updateSection((item) => { item.accentColor = v })} /><HexColorField label="Section secondary" value={section.secondaryColor} onChange={(v) => updateSection((item) => { item.secondaryColor = v })} /></div>
              <SwitchField label="Show in the top menu" checked={section.showInNav} onChange={(v) => updateSection((item) => { item.showInNav = v })} hint="Adds a link to this section in the top menu (same page, no new route)." />
              <SwitchField label="Show on the website" checked={section.visible} onChange={(v) => updateSection((item) => { item.visible = v })} hint="Off = the page is not on the website but stays here." />
            </Group>
            <Group title="Page components" note="Add safe prebuilt blocks, edit their content, and drag them to change the order inside this page.">
              {section.blocks.map((block, index) => <fieldset className="adm-studio-block" key={block.id} draggable onDragStart={() => setDraggingBlockIndex(index)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (draggingBlockIndex !== null) reorderBlock(draggingBlockIndex, index); setDraggingBlockIndex(null) }} onDragEnd={() => setDraggingBlockIndex(null)}>
                <legend><span className="adm-studio-grip"><GripVertical /> {index + 1}. {block.type.toUpperCase()}</span></legend>
                <div className="adm-row-tools"><button type="button" className="adm-icon" aria-label="Move component up" disabled={index === 0} onClick={() => reorderBlock(index, index - 1)}>↑</button><button type="button" className="adm-icon" aria-label="Move component down" disabled={index === section.blocks.length - 1} onClick={() => reorderBlock(index, index + 1)}>↓</button><button type="button" className="adm-icon adm-icon-danger" aria-label="Delete component" onClick={() => updateSection((item) => { item.blocks.splice(index, 1) })}>×</button></div>
                <div className="adm-studio-block-fields">
                  {block.type === "hero" && <><TextField label={`Eyebrow (${lang.toUpperCase()})`} value={block.eyebrow[lang]} onChange={(v) => patchBlock(index, { eyebrow: { ...block.eyebrow, [lang]: v } })} /><TextField label={`Heading (${lang.toUpperCase()})`} value={block.heading[lang]} onChange={(v) => patchBlock(index, { heading: { ...block.heading, [lang]: v } })} /><AreaField label={`Body (${lang.toUpperCase()})`} value={block.body[lang]} onChange={(v) => patchBlock(index, { body: { ...block.body, [lang]: v } })} /></>}
                  {block.type === "text" && <><TextField label={`Heading (${lang.toUpperCase()})`} value={block.heading[lang]} onChange={(v) => patchBlock(index, { heading: { ...block.heading, [lang]: v } })} /><AreaField label={`Text (${lang.toUpperCase()})`} value={block.body[lang]} max={2400} rows={5} onChange={(v) => patchBlock(index, { body: { ...block.body, [lang]: v } })} /></>}
                  {block.type === "image" && <><ImageField label="Image" value={block.image} onChange={(v) => patchBlock(index, { image: v })} /><TextField label={`Alt text (${lang.toUpperCase()})`} value={block.alt[lang]} onChange={(v) => patchBlock(index, { alt: { ...block.alt, [lang]: v } })} /><TextField label={`Caption (${lang.toUpperCase()})`} value={block.caption[lang]} onChange={(v) => patchBlock(index, { caption: { ...block.caption, [lang]: v } })} /></>}
                  {block.type === "cards" && <><TextField label={`Page title (${lang.toUpperCase()})`} value={block.heading[lang]} onChange={(v) => patchBlock(index, { heading: { ...block.heading, [lang]: v } })} />{block.items.map((item, itemIndex) => <div className="adm-card" key={item.id}><strong>Card {itemIndex + 1}</strong><TextField label={`Title (${lang.toUpperCase()})`} value={item.title[lang]} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "cards") b.items[itemIndex].title[lang] = v })} /><TextField label="Tag" value={item.tag} max={40} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "cards") b.items[itemIndex].tag = v })} /><AreaField label={`Description (${lang.toUpperCase()})`} value={item.body[lang]} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "cards") b.items[itemIndex].body[lang] = v })} /><button type="button" className="adm-btn adm-btn-ghost" onClick={() => updateSection((p) => { const b = p.blocks[index]; if (b.type === "cards") b.items.splice(itemIndex, 1) })}>Remove card</button></div>)}<AddButton label="Add card" disabled={block.items.length >= 12} onClick={() => updateSection((p) => { const b = p.blocks[index]; if (b.type === "cards") b.items.push({ id: makeStudioId("item"), title: studioText("New card", "Kartu baru"), body: studioText("", ""), tag: "" }) })} /></>}
                  {block.type === "stats" && <><TextField label={`Page title (${lang.toUpperCase()})`} value={block.heading[lang]} onChange={(v) => patchBlock(index, { heading: { ...block.heading, [lang]: v } })} />{block.items.map((item, itemIndex) => <div className="adm-inline" key={item.id}><TextField label="Value" value={item.value} max={32} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "stats") b.items[itemIndex].value = v })} /><TextField label={`Label (${lang.toUpperCase()})`} value={item.label[lang]} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "stats") b.items[itemIndex].label[lang] = v })} /></div>)}<AddButton label="Add statistic" disabled={block.items.length >= 8} onClick={() => updateSection((p) => { const b = p.blocks[index]; if (b.type === "stats") b.items.push({ id: makeStudioId("item"), value: "01", label: studioText("New metric", "Metrik baru") }) })} /></>}
                  {block.type === "timeline" && <><TextField label={`Page title (${lang.toUpperCase()})`} value={block.heading[lang]} onChange={(v) => patchBlock(index, { heading: { ...block.heading, [lang]: v } })} />{block.items.map((item, itemIndex) => <div className="adm-card" key={item.id}><TextField label="Period" value={item.period} max={80} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "timeline") b.items[itemIndex].period = v })} /><TextField label={`Title (${lang.toUpperCase()})`} value={item.title[lang]} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "timeline") b.items[itemIndex].title[lang] = v })} /><AreaField label={`Description (${lang.toUpperCase()})`} value={item.body[lang]} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "timeline") b.items[itemIndex].body[lang] = v })} /><button type="button" className="adm-btn adm-btn-ghost" onClick={() => updateSection((p) => { const b = p.blocks[index]; if (b.type === "timeline") b.items.splice(itemIndex, 1) })}>Remove entry</button></div>)}<AddButton label="Add timeline item" disabled={block.items.length >= 16} onClick={() => updateSection((p) => { const b = p.blocks[index]; if (b.type === "timeline") b.items.push({ id: makeStudioId("item"), period: "2026", title: studioText("New milestone", "Pencapaian baru"), body: studioText("", "") }) })} /></>}
                  {block.type === "gallery" && <><TextField label={`Page title (${lang.toUpperCase()})`} value={block.heading[lang]} onChange={(v) => patchBlock(index, { heading: { ...block.heading, [lang]: v } })} />{block.images.map((item, itemIndex) => <div className="adm-card" key={item.id}><ImageField label={`Gallery image ${itemIndex + 1}`} value={item.image} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "gallery" && v) b.images[itemIndex].image = v })} /><TextField label={`Alt text (${lang.toUpperCase()})`} value={item.alt[lang]} onChange={(v) => updateSection((p) => { const b = p.blocks[index]; if (b.type === "gallery") b.images[itemIndex].alt[lang] = v })} /><button type="button" className="adm-btn adm-btn-ghost" onClick={() => updateSection((p) => { const b = p.blocks[index]; if (b.type === "gallery") b.images.splice(itemIndex, 1) })}>Remove image</button></div>)}<AddButton label="Add image slot" disabled={block.images.length >= 12} onClick={() => updateSection((p) => { const b = p.blocks[index]; if (b.type === "gallery") b.images.push({ id: makeStudioId("item"), image: "", alt: studioText("", "") }) })} /></>}
                  {block.type === "cta" && <><TextField label={`Heading (${lang.toUpperCase()})`} value={block.heading[lang]} onChange={(v) => patchBlock(index, { heading: { ...block.heading, [lang]: v } })} /><AreaField label={`Description (${lang.toUpperCase()})`} value={block.body[lang]} onChange={(v) => patchBlock(index, { body: { ...block.body, [lang]: v } })} /><TextField label={`Button label (${lang.toUpperCase()})`} value={block.buttonLabel[lang]} onChange={(v) => patchBlock(index, { buttonLabel: { ...block.buttonLabel, [lang]: v } })} /><TextField label="Safe link (https:// or /path)" value={block.href} max={2000} onChange={(v) => patchBlock(index, { href: v })} /></>}
                  {block.type === "divider" && <p className="adm-hint">A subtle divider using the section accent color.</p>}
                </div>
              </fieldset>)}
              <div className="adm-inline"><Field label="Component type"><select className="adm-input" value={blockKind} onChange={(e) => setBlockKind(e.target.value as BlockKind)}>{["hero", "text", "image", "cards", "stats", "timeline", "gallery", "cta", "divider"].map((type) => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}</select></Field><AddButton label="Add component" disabled={section.blocks.length >= 40} onClick={() => updateSection((item) => { item.blocks.push(makeStudioBlock(blockKind)) })} /></div>
            </Group>
            <Group title="Reusable templates" note="Save the selected section's component structure and local accent colors. Apply it to any other custom section later.">
              <div className="adm-inline"><TextField label="Template name" value={templateName} max={80} onChange={setTemplateName} placeholder="e.g. DFIR Case Study" /><AddButton label="Save template" disabled={!templateName.trim() || draft.customPages.templates.length >= 24} onClick={saveTemplate} /></div>
              {draft.customPages.templates.length > 0 && <div className="adm-inline"><Field label="Apply saved template"><select className="adm-input" value={templateToApply} onChange={(e) => setTemplateToApply(e.target.value)}><option value="">Choose a template</option>{draft.customPages.templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></Field><button type="button" className="adm-btn" disabled={!templateToApply} onClick={() => applyTemplate()}><Layers3 />Apply to section</button></div>}
              {draft.customPages.templates.map((t) => <div className="adm-row" key={t.id}><div><strong>{t.name}</strong><span className="adm-hint">{t.blocks.length} components</span></div><div className="adm-row-tools"><button type="button" className="adm-icon" aria-label={`Apply ${t.name}`} onClick={() => applyTemplate(t.id)}>↗</button><button type="button" className="adm-icon" aria-label={`Export ${t.name}`} onClick={() => exportTemplate(t)}><Download /></button><button type="button" className="adm-icon adm-icon-danger" aria-label={`Delete ${t.name}`} onClick={() => update((d) => { d.customPages.templates = d.customPages.templates.filter((item) => item.id !== t.id) })}>×</button></div></div>)}
            </Group>
            <div className="adm-group"><h3>Live page preview</h3><p className="adm-note">This is how the page looks inside the website. Use the main Publish button to publish all changes. Its position among the other pages is set in Sections & order.</p><div className="adm-studio-public-preview"><ContentScope content={draft}><CustomPageRenderer page={section} /></ContentScope></div></div>
          </div> : <AdminEmpty title="This page no longer exists" body="Pick another page from the list on the left." />}
        </>
      )}
    </>
  )
}

