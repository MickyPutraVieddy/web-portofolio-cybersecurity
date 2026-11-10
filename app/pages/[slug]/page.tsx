import { redirect } from "next/navigation"

/** Custom content is rendered as a section in the single-page homepage. */
export default function LegacyCustomPageRoute() {
  redirect("/")
}
