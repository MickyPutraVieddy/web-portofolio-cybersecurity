import { contentGetHandler, contentPutHandler } from "@/lib/server/handlers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const GET = contentGetHandler
export const PUT = contentPutHandler
