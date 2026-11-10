"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Check, ExternalLink, History, Loader2, LogOut, Monitor, Save, ShieldCheck, Smartphone, Tablet, Undo2 } from "lucide-react"
import { ApiError, api } from "@/components/admin/api"
import { AboutEditor, AchievementsEditor, CertificationsEditor, ContactEditor, FooterEditor, HeaderEditor, IntroEditor, MitreEditor, ProjectsEditor, SectionsEditor, SkillsEditor, ToolsEditor, WriteupsEditor, TrainingEditor, TerminalEditor, TextsEditor, TimelineEditor, StudioEditor, type EditorProps } from "@/components/admin/pages"
import { ConfirmProvider, useConfirm } from "@/components/admin/ui"
import { TwoFactorPanel } from "@/components/admin/two-factor"
import { PasskeyPanel } from "@/components/admin/passkeys"
import { Flag } from "@/components/flags"
import type { SiteContent } from "@/lib/content-schema"
import type { Locale } from "@/lib/portfolio-types"

type Cap = "Edit" | "Add" | "Delete"
interface PageDef { id: string; label: string; file: string; caps: Cap[]; target?: string; render?: (p: EditorProps) => ReactNode }

const pages: PageDef[] = [
  { id: "studio", label: "Theme & Appearance", file: "theme", caps: ["Edit"], render: (p) => <StudioEditor {...p} mode="theme" /> },
  { id: "header", label: "Page Header", file: "header", caps: ["Edit", "Add"], target: "intro", render: (p) => <HeaderEditor {...p} /> },
  { id: "intro", label: "Page Intro", file: "intro.txt", caps: ["Edit"], target: "intro", render: (p) => <IntroEditor {...p} /> },
  { id: "about", label: "Page 00 — About Me", file: "about.txt", caps: ["Edit", "Add", "Delete"], target: "about", render: (p) => <AboutEditor {...p} /> },
  { id: "terminal", label: "Page 00 — Interactive shell", file: "portfolio-shell", caps: ["Edit", "Add"], target: "about", render: (p) => <TerminalEditor {...p} /> },
  { id: "education", label: "Page Education", file: "education.txt", caps: ["Edit", "Add", "Delete"], target: "education", render: (p) => <TimelineEditor kind="education" {...p} /> },
  { id: "experience", label: "Page Work Experience", file: "experience.txt", caps: ["Edit", "Add", "Delete"], target: "experience", render: (p) => <TimelineEditor kind="experience" {...p} /> },
  { id: "certifications", label: "Page 01 — Certifications", file: "certifications.txt", caps: ["Edit", "Add", "Delete"], target: "certifications", render: (p) => <CertificationsEditor {...p} /> },
  { id: "skills", label: "Page 02 — Skills", file: "skills.txt", caps: ["Edit", "Add", "Delete"], target: "skills", render: (p) => <SkillsEditor {...p} /> },
  { id: "mitre", label: "Page 03 — MITRE ATT&CK", file: "mitre.txt", caps: ["Edit", "Add", "Delete"], target: "mitre", render: (p) => <MitreEditor {...p} /> },
  { id: "projects", label: "Page 04 — Projects", file: "projects.txt", caps: ["Edit", "Add", "Delete"], target: "projects", render: (p) => <ProjectsEditor {...p} /> },
  { id: "training", label: "Page 05 — Training & Labs", file: "training.txt", caps: ["Edit", "Add", "Delete"], target: "training", render: (p) => <TrainingEditor {...p} /> },
  { id: "tools", label: "Page 06 — Tools", file: "tools.txt", caps: ["Edit", "Add", "Delete"], target: "tools", render: (p) => <ToolsEditor {...p} /> },
  { id: "achievements", label: "Page 07 — Achievements", file: "achievements.txt", caps: ["Edit", "Add", "Delete"], target: "achievements", render: (p) => <AchievementsEditor {...p} /> },
  { id: "writeups", label: "Page 08 — Writeups", file: "writeup.txt", caps: ["Edit", "Add", "Delete"], target: "writeups", render: (p) => <WriteupsEditor {...p} /> },
  { id: "contact", label: "Page 09 — Contact", file: "contact.txt", caps: ["Edit", "Add", "Delete"], target: "contact", render: (p) => <ContactEditor {...p} /> },
  { id: "footer", label: "Page Footer", file: "footer", caps: ["Edit"], target: "footer", render: (p) => <FooterEditor {...p} /> },
  { id: "sections", label: "Pages & order", file: "layout", caps: ["Edit"], render: (p) => <SectionsEditor {...p} /> },
  { id: "texts", label: "All texts", file: "copy", caps: ["Edit"], render: (p) => <TextsEditor {...p} /> },
  { id: "security", label: "Security & history", file: "admin", caps: [] },
]

/** Sidebar page -> website section it belongs to. Deleting such a page removes that section from the website. */
const sectionOfPage: Record<string, string> = {
  intro: "intro", about: "about", terminal: "about", education: "education", experience: "experience", certifications: "certifications", skills: "skills",
  mitre: "mitre", projects: "projects", training: "training", tools: "tools", achievements: "achievements", writeups: "writeups", contact: "contact",
}

const areaOf: [keyof SiteContent, string][] = [
  ["appearance", "Global appearance"], ["customPages", "Custom pages & templates"],
  ["profile", "Page Header / Page Intro"], ["copy", "Texts"], ["aboutRows", "Page 00 — About Me"], ["statusLine", "Page 00 — About Me"],
  ["terminalOutput", "Interactive shell"], ["quickCommands", "Interactive shell"], ["education", "Page Education"], ["experience", "Page Work Experience"], ["certifications", "Page 01 — Certifications"], ["skills", "Page 02 — Skills"], ["mitre", "Page 03 — MITRE ATT&CK"], ["projects", "Page 04 — Projects"], ["training", "Page 05 — Training & Labs"], ["tools", "Page 06 — Tools"], ["achievements", "Page 07 — Achievements"], ["writeups", "Page 08 — Writeups"], ["contact", "Page 09 — Contact"], ["footer", "Page Footer"], ["sections", "Sections & order"],
]
function changedAreas(saved: SiteContent, draft: SiteContent): string[] {
  const out = new Set<string>()
  for (const [key, label] of areaOf) if (JSON.stringify(saved[key]) !== JSON.stringify(draft[key])) out.add(label)
  return [...out]
}

interface HistoryRow { version: number; savedAt: string; by: string }
interface AuditRow { at: string; actor: string; action: string; detail?: string }
type Device = "desktop" | "tablet" | "mobile"

function Inner({ user, method }: { user: string; method: string }) {
  const confirm = useConfirm()
  const [saved, setSaved] = useState<SiteContent | null>(null)
  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [history, setHistory] = useState<HistoryRow[]>([])
  const [audit, setAudit] = useState<AuditRow[]>([])
  const [loadError, setLoadError] = useState("")
  const [pageId, setPageId] = useState("studio")
  // English is the only language you write; Indonesian is generated automatically (DeepL).
  const lang: Locale = "en"
  const [translating, setTranslating] = useState(false)
  const [device, setDevice] = useState<Device>("desktop")
  const [view, setView] = useState<"edit" | "preview">("edit")
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const ready = useRef(false)

  const load = useCallback(async () => {
    try {
      const data = await api<{ content: SiteContent; history: HistoryRow[] }>("/api/admin/content")
      setSaved(data.content); setDraft(data.content); setHistory(data.history); setLoadError("")
    } catch (e) { setLoadError(e instanceof ApiError ? e.message : "Could not load content") }
  }, [])
  useEffect(() => { void load() }, [load])

  const dirty = useMemo(() => !!saved && !!draft && JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft])
  const changes = useMemo(() => (saved && draft ? changedAreas(saved, draft) : []), [saved, draft])

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  useEffect(() => {
    try {
      const left = sessionStorage.getItem("adm-recovery-left")
      if (left !== null) { sessionStorage.removeItem("adm-recovery-left"); setToast({ kind: "error", text: `You signed in with a recovery code. ${left} left — generate new ones in Security & history.` }) }
    } catch { /* storage unavailable */ }
  }, [])
  useEffect(() => { if (toast) { const id = window.setTimeout(() => setToast(null), 6000); return () => window.clearTimeout(id) } }, [toast])

  // ---- live preview: every keystroke is pushed into the iframe before anything is saved
  const post = useCallback((message: object) => { if (ready.current) frame.current?.contentWindow?.postMessage(message, /^https?:$/.test(window.location.protocol) ? window.location.origin : "*") }, [])
  useEffect(() => { if (draft) post({ type: "draft-content", content: draft }) }, [draft, post])
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return
      if ((event.data as { type?: string })?.type === "preview-ready") { ready.current = true; if (draft) post({ type: "draft-content", content: draft }) }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [draft, post])

  const update = useCallback((mutate: (d: SiteContent) => void) => {
    setDraft((current) => { if (!current) return current; const next = structuredClone(current); mutate(next); return next })
  }, [])

  // The page list = built-in pages that are not deleted + the owner's own pages (in website order) + tools.
  const removedSections = new Set((draft?.sections ?? []).filter((x) => !x.visible && x.id !== "footer").map((x) => x.id as string))
  const customList = [...(draft?.customPages.pages ?? [])].sort((a, b) => a.order - b.order)
  const customDefs: PageDef[] = customList.map((c) => ({
    id: `cp:${c.id}`, label: `Page — ${c.title.en || c.slug}`, file: `${c.slug}.txt`, caps: ["Edit", "Add", "Delete"], target: `custom-${c.slug}`,
    render: (p) => <StudioEditor {...p} mode="page" pageId={c.id} onDeleted={() => setPageId("sections")} onCreated={(id) => setPageId(`cp:${id}`)} />,
  }))
  const newPageDef: PageDef = { id: "new-page", label: "New page", file: "new-page", caps: [], render: (p) => <StudioEditor {...p} mode="new" onCreated={(id) => setPageId(`cp:${id}`)} /> }
  const contactAt = pages.findIndex((x) => x.id === "contact")
  const allPages: PageDef[] = [...pages.slice(0, contactAt + 1), ...customDefs, ...pages.slice(contactAt + 1), newPageDef]
  const visiblePages = allPages.filter((x) => !(sectionOfPage[x.id] && removedSections.has(sectionOfPage[x.id])))
  const deletedPages = pages.filter((x) => x.id in sectionOfPage && x.id !== "terminal" && removedSections.has(sectionOfPage[x.id]))

  function choose(id: string) {
    setPageId(id)
    const target = allPages.find((p) => p.id === id)?.target
    if (target) post({ type: "scroll-to", scrollTo: target })
  }

  async function deletePage(def: PageDef) {
    if (!draft) return
    if (def.id.startsWith("cp:")) {
      const cid = def.id.slice(3)
      if (!(await confirm({ title: `Delete “${def.label}”?`, body: "This permanently deletes this page and all of its components from the draft. Other pages are not affected. (Until you press Publish, Discard brings it back.)", confirmLabel: "Delete page", danger: true }))) return
      update((d) => { d.customPages.pages = d.customPages.pages.filter((item) => item.id !== cid) })
      if (pageId === def.id) setPageId("sections")
      return
    }
    const sid = sectionOfPage[def.id]
    if (!sid) return
    if (!(await confirm({ title: `Delete “${def.label}”?`, body: "The page disappears from the website and from this list. Its content is kept: bring it back any time with Restore under Deleted pages.", confirmLabel: "Delete page", danger: true }))) return
    update((d) => { const t = d.sections.find((x) => x.id === sid); if (t) t.visible = false })
    if (sectionOfPage[pageId] === sid) setPageId("sections")
  }
  function restorePage(def: PageDef) {
    const sid = sectionOfPage[def.id]
    if (sid) update((d) => { const t = d.sections.find((x) => x.id === sid); if (t) t.visible = true })
  }

  async function save() {
    if (!saved || !draft || !dirty) return
    const ok = await confirm({
      title: "Are you sure you want to publish these changes?",
      confirmLabel: "Yes, publish",
      body: (<><p>This updates the live website for every visitor. You changed:</p><ul>{changes.map((c) => <li key={c}>{c}</li>)}</ul><p>A copy of the current version is kept, so you can restore it later.</p></>),
    })
    if (!ok) return
    setBusy(true)
    try {
      const res = await api<{ content: SiteContent }>("/api/admin/content", { method: "PUT", body: { content: draft, baseVersion: saved.version } })
      setSaved(res.content); setDraft(res.content)
      void api<{ history: HistoryRow[] }>("/api/admin/content").then((d) => setHistory(d.history))
      setToast({ kind: "ok", text: `Published as version ${res.content.version}. The live site is updated.` })
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) setToast({ kind: "error", text: "The content was changed elsewhere. Copy what you need, then reload this page." })
      else if (e instanceof ApiError && e.data.issues?.length) setToast({ kind: "error", text: `Not saved: ${e.data.issues[0].path} — ${e.data.issues[0].message}` })
      else setToast({ kind: "error", text: e instanceof ApiError ? e.message : "Could not save. Try again." })
    } finally { setBusy(false) }
  }

  async function discard() {
    if (!saved || !dirty) return
    if (await confirm({ title: "Discard all unsaved changes?", body: "Your edits since the last publish are thrown away.", confirmLabel: "Discard", danger: true })) setDraft(saved)
  }

  async function restore(version: number) {
    if (!saved) return
    if (!(await confirm({ title: `Restore version ${version}?`, body: "Its content becomes the new live version. The current one stays in the history.", confirmLabel: "Yes, restore", danger: true }))) return
    try {
      const res = await api<{ content: SiteContent }>("/api/admin/content/restore", { method: "POST", body: { version, baseVersion: saved.version } })
      setSaved(res.content); setDraft(res.content); await load()
      setToast({ kind: "ok", text: `Version ${version} restored (now version ${res.content.version}).` })
    } catch (e) { setToast({ kind: "error", text: e instanceof ApiError ? e.message : "Restore failed" }) }
  }

  async function signOut() {
    if (dirty && !(await confirm({ title: "Sign out with unsaved changes?", body: "Your unpublished edits will be lost.", confirmLabel: "Sign out", danger: true }))) return
    await api("/api/admin/logout", { method: "POST", body: {} }).catch(() => {})
    window.location.href = "/admin/login"
  }

  useEffect(() => { if (pageId === "security") void api<{ audit: AuditRow[] }>("/api/admin/audit").then((d) => setAudit(d.audit)).catch(() => {}) }, [pageId])

  if (loadError) return <div className="adm-center"><p>{loadError}</p><button className="adm-btn" onClick={() => void load()}>Try again</button></div>
  if (!saved || !draft) return <div className="adm-center"><Loader2 className="adm-spin" aria-hidden="true" /> Loading…</div>

  async function translateNow() {
    setTranslating(true)
    try {
      let pending = 1, blocked = false, lastError = ""
      for (let round = 0; round < 60 && pending > 0 && !blocked; round++) {
        const response = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ warm: true }) })
        if (!response.ok) throw new Error(`Translate failed (${response.status})`)
        const result = (await response.json()) as { pending: number; blocked: boolean; error?: string }
        if (result.error) lastError = result.error
        pending = result.pending
        blocked = result.blocked
        if (result.error && !blocked) break
      }
      setToast(blocked ? { kind: "error", text: lastError || "Translation is paused. Try again later." } : pending > 0 ? { kind: "error", text: `${pending} texts still pending — press again.` } : { kind: "ok", text: "Indonesian translation is up to date." })
    } catch (error) {
      setToast({ kind: "error", text: error instanceof Error ? error.message : "Translation failed" })
    } finally { setTranslating(false) }
  }

  const page = visiblePages.find((p) => p.id === pageId) ?? visiblePages.find((p) => p.id === "sections")!
  const props: EditorProps = { draft, update, lang }

  return (
    <div className="adm-shell">
      <header className="adm-top">
        <div className="adm-brand"><ShieldCheck aria-hidden="true" /><span>Admin</span><small>{user} · {method}</small></div>
        <div className="adm-seg" role="group" aria-label="Editing language">
          <button type="button" aria-pressed="true"><Flag locale="en" className="language-flag" />EN</button>
          <button type="button" disabled={translating} title="Translate any new or edited text to Indonesian now (published content only)" onClick={translateNow}><Flag locale="id" className="language-flag" />{translating ? "Translating…" : "ID auto"}</button>
        </div>
        <div className="adm-top-actions">
          <span className="adm-state" data-dirty={dirty}>{dirty ? `${changes.length} area${changes.length > 1 ? "s" : ""} changed — not published` : <><Check aria-hidden="true" /> All published · v{saved.version}</>}</span>
          <button type="button" className="adm-btn" disabled={!dirty || busy} onClick={discard}><Undo2 aria-hidden="true" />Discard</button>
          <button type="button" className="adm-btn adm-btn-primary" disabled={!dirty || busy} onClick={save}>{busy ? <Loader2 className="adm-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}Publish</button>
          <a className="adm-btn" href="/" target="_blank" rel="noreferrer"><ExternalLink aria-hidden="true" />View site</a>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={signOut}><LogOut aria-hidden="true" />Sign out</button>
        </div>
      </header>

      <div className="adm-tabs-narrow" role="tablist">
        <button role="tab" aria-selected={view === "edit"} onClick={() => setView("edit")}>Edit</button>
        <button role="tab" aria-selected={view === "preview"} onClick={() => setView("preview")}>Live preview</button>
      </div>

      <div className="adm-body" data-view={view}>
        <nav className="adm-side" aria-label="Pages">
          <p className="adm-side-title">Pages</p>
          {visiblePages.filter((p) => p.id !== "new-page").map((p) => {
            const deletable = p.caps.includes("Delete")
            return (
              <div key={p.id} className="adm-side-entry" data-current={p.id === page.id ? "true" : undefined}>
                <button type="button" className="adm-side-main" aria-current={p.id === page.id ? "page" : undefined} onClick={() => choose(p.id)}>
                  <strong>{p.label}</strong>
                  <span className="adm-mono">{p.file}</span>
                </button>
                {p.caps.length > 0 && (
                  <span className="adm-caps">
                    {p.caps.map((c) => (
                      <button key={c} type="button" className="adm-cap" data-cap={c} aria-label={`${c} ${p.label}`} onClick={() => (c === "Delete" && deletable ? void deletePage(p) : choose(p.id))}>{c}</button>
                    ))}
                  </span>
                )}
              </div>
            )
          })}
          {deletedPages.length > 0 && (
            <div className="adm-side-deleted">
              <p className="adm-side-title">Deleted pages</p>
              {deletedPages.map((p) => (
                <div key={p.id} className="adm-side-entry" data-deleted="true">
                  <span className="adm-side-main"><strong>{p.label}</strong><span className="adm-mono">{p.file}</span></span>
                  <span className="adm-caps"><button type="button" className="adm-cap" data-cap="Add" aria-label={`Restore ${p.label}`} onClick={() => restorePage(p)}>Restore</button></span>
                </div>
              ))}
            </div>
          )}
          <button type="button" className="adm-newpage" aria-current={page.id === "new-page" ? "page" : undefined} onClick={() => choose("new-page")}>＋ New page</button>
        </nav>

        <main className="adm-editor">
          <div className="adm-editor-head">
            <div><p className="adm-eyebrow adm-mono">~/portfolio/{page.file}</p><h1>{page.label}</h1></div>
            {page.caps.length > 0 && <span className="adm-caps">{page.caps.map((c) => <i key={c} data-cap={c}>{c}</i>)}</span>}
          </div>
          {page.render ? page.render(props) : (
            <>
              <PasskeyPanel onNotice={(kind, text) => setToast({ kind, text })} />
              <TwoFactorPanel onNotice={(kind, text) => setToast({ kind, text })} />
              <section className="adm-group">
                <h3><History aria-hidden="true" /> Version history</h3>
                <p className="adm-note">Every publish keeps the previous version (last 10). Restoring is confirmed first.</p>
                {history.length === 0 && <p className="adm-hint">No previous versions yet.</p>}
                {history.map((h) => (
                  <div className="adm-row" key={h.version}><div><strong>Version {h.version}</strong><span className="adm-hint">{new Date(h.savedAt).toLocaleString()} · {h.by}</span></div><button type="button" className="adm-btn" onClick={() => restore(h.version)}>Restore</button></div>
                ))}
              </section>
              <section className="adm-group">
                <h3><ShieldCheck aria-hidden="true" /> Activity log</h3>
                {audit.length === 0 && <p className="adm-hint">Nothing yet.</p>}
                <ul className="adm-audit">{audit.slice(0, 30).map((a, i) => <li key={i}><span className="adm-mono">{new Date(a.at).toLocaleString()}</span> <b>{a.action}</b> {a.actor}{a.detail ? ` — ${a.detail}` : ""}</li>)}</ul>
              </section>
              <section className="adm-group">
                <h3>Security notes</h3>
                <ul className="adm-note-list">
                  <li>Sessions expire after 8 hours and live in an HttpOnly cookie.</li>
                  <li>Five wrong logins from one address lock it for 15 minutes.</li>
                  <li>Turn on Google Authenticator above: a stolen password alone then cannot sign in. Google sign-in has its own protection and does not ask for the code.</li>
                  <li>Every change needs your confirmation and is written to the activity log.</li>
                  <li>Images are checked by file signature; links must be http(s), mailto or relative.</li>
                </ul>
              </section>
            </>
          )}
        </main>

        <aside className="adm-preview" aria-label="Live preview">
          <div className="adm-preview-bar">
            <span>Live preview <small>(unsaved edits appear here instantly)</small></span>
            <div className="adm-seg" role="group" aria-label="Preview size">
              <button type="button" aria-label="Desktop" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}><Monitor aria-hidden="true" /></button>
              <button type="button" aria-label="Tablet" aria-pressed={device === "tablet"} onClick={() => setDevice("tablet")}><Tablet aria-hidden="true" /></button>
              <button type="button" aria-label="Mobile" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}><Smartphone aria-hidden="true" /></button>
            </div>
          </div>
          <div className="adm-frame-wrap"><iframe ref={frame} title="Site preview" src="/?preview=1" data-device={device} /></div>
        </aside>
      </div>

      {toast && <div className="adm-toast" data-kind={toast.kind} role="status">{toast.text}</div>}
    </div>
  )
}

export function AdminApp(props: { user: string; method: string }) {
  return <ConfirmProvider><Inner {...props} /></ConfirmProvider>
}
