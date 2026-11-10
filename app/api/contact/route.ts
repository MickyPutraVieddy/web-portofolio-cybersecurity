import { handleContact } from "@/lib/server/contact"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Public endpoint for the contact form. Everything is validated and rate limited in lib/server/contact.ts. */
export const POST = (request: Request) => handleContact(request)
