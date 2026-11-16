import { visitorsHandler, visitorsResetHandler } from "@/lib/server/visitor-handlers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const GET = visitorsHandler
export const POST = visitorsResetHandler
