import { vercelAnalyticsHandler } from "@/lib/server/visitor-handlers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const GET = vercelAnalyticsHandler
