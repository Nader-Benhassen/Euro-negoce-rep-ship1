import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CookieConsent from "./components/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Euro Negoce - International Trade Company",
  description:
    "Premier international trade company specializing in high-quality fresh fruits, vegetables, and premium edible oils.",
  alternates: {
    canonical: "https://www.euronegocetrade.com",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
