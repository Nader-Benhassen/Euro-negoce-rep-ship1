import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CookieConsent from "./components/cookie-consent"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Euro Negoce - International Trade & Agricultural Products",
  description:
    "Euro Negoce is a premier international trade company specializing in the import and export of high-quality fresh fruits, vegetables, and premium edible oils.",
  metadataBase: new URL("https://www.euronegocetrade.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Euro Negoce - International Trade & Agricultural Products",
    description:
      "Euro Negoce is a premier international trade company specializing in the import and export of high-quality fresh fruits, vegetables, and premium edible oils.",
    url: "https://www.euronegocetrade.com",
    siteName: "Euro Negoce Trade",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Euro Negoce - International Trade & Agricultural Products",
    description:
      "Euro Negoce is a premier international trade company specializing in the import and export of high-quality fresh fruits, vegetables, and premium edible oils.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://www.euronegocetrade.com" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
