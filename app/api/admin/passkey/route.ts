import { passkeyActionHandler, passkeyStatusHandler } from "@/lib/server/passkey-handlers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const GET = passkeyStatusHandler
export const POST = passkeyActionHandler
