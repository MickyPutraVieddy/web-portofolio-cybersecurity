import { mediaGetHandler } from "@/lib/server/handlers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ id: string }> | { id: string }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  return mediaGetHandler(id)
}
