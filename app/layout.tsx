import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import { Inter, IBM_Plex_Mono } from "next/font/google"
import { ContentProvider } from "@/components/content-provider"
import { LanguageProvider } from "@/components/language-provider"
import { parseLocale } from "@/lib/portfolio-content"
import { getContent } from "@/lib/server/content"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" })

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const locale = parseLocale(cookieStore.get("portfolio-language")?.value)
  const content = await getContent()
  const t = content.copy[locale]
  const name = content.profile.name
  return {
    title: t.title,
    description: t.metaDescription,
    applicationName: `${name} Portfolio`,
    authors: [{ name }],
    keywords: [name, "Cybersecurity", "SOC Analyst", "Information Security", "Blue Team", "Pune"],
    openGraph: { title: t.title, description: t.metaDescription, type: "website", locale: locale === "en" ? "en_US" : "id_ID" },
    twitter: { card: "summary", title: t.title, description: t.metaDescription },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  themeColor: "#060b17",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const locale = parseLocale(cookieStore.get("portfolio-language")?.value)
  const content = await getContent()
  // Public pages never receive unpublished custom homepage sections or the private template library.
  // The authenticated Admin reads the full document through its protected content API.
  const publicContent = { ...content, customPages: { pages: content.customPages.pages.filter((page) => page.visible), templates: [] } }
  return (
    <html lang={locale} className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <ContentProvider initial={publicContent}>
          <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
        </ContentProvider>
      </body>
    </html>
  )
}
