import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Navigation from "@/components/navigation"
import "./globals.css"
import "cesium/Build/Cesium/Widgets/widgets.css"


export const metadata: Metadata = {
  title: "EXONOVA - Protecting Tomorrow, Today",
  description:
    "Futuristic space-themed platform for city health, urban planning, disaster management, and community engagement",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-black text-white`}>
        <Navigation />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
