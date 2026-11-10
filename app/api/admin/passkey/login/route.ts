import { passkeyLoginHandler } from "@/lib/server/passkey-handlers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const POST = passkeyLoginHandler
