import type { ReactNode } from "react"
import { Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

export const PROMPT_USER = "zains403@root"

export function Prompt({ path = "~" }: { path?: string }) {
  return <span className="sh-prompt">{PROMPT_USER}:{path}$</span>
}

export function ShellWindow({ title, badge, className, children, id }: { title: string; badge?: string; className?: string; children: ReactNode; id?: string }) {
  return (
    <div className={cn("shell-window", className)} id={id}>
      <div className="shell-bar">
        <span className="shell-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="shell-title"><Terminal aria-hidden="true" />{title}</span>
        {badge ? <span className="shell-badge">{badge}</span> : <span className="shell-badge-spacer" />}
      </div>
      {children}
    </div>
  )
}
