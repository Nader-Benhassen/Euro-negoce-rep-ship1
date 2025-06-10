import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Euro Negoce - Premium Mediterranean Produce & Edible Oils | International Trade",
  description:
    "Euro Negoce specializes in importing and exporting high-quality fresh fruits, vegetables, and premium edible oils from Mediterranean regions. Trusted by leading retailers worldwide for quality, reliability, and exceptional service.",
  keywords:
    "Mediterranean produce, olive oil, fresh fruits, vegetables, international trade, wholesale, retail, Tunisia, Spain, Italy, premium quality, organic, export, import",
  authors: [{ name: "Euro Negoce" }],
  creator: "Euro Negoce",
  publisher: "Euro Negoce",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://euronegoce.com",
    title: "Euro Negoce - Premium Mediterranean Produce & Edible Oils",
    description:
      "Premier international trade company specializing in high-quality fresh fruits, vegetables, and premium edible oils from Mediterranean regions.",
    siteName: "Euro Negoce",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Euro Negoce - Premium Mediterranean Produce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Euro Negoce - Premium Mediterranean Produce & Edible Oils",
    description:
      "Premier international trade company specializing in high-quality fresh fruits, vegetables, and premium edible oils.",
    images: ["/images/og-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-verification-code",
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
      <head>
        <link rel="canonical" href="https://euronegoce.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
