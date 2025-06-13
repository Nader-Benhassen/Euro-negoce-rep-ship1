import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ErrorBoundary from "./components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Euro Negoce - International Trade Company",
  description:
    "Premier international trade company specializing in fresh fruits, vegetables, and premium edible oils for wholesale and retail markets.",
  keywords: "international trade, fresh fruits, vegetables, edible oils, wholesale, retail, Tunisia, export, import",
  authors: [{ name: "Euro Negoce" }],
  creator: "Euro Negoce",
  publisher: "Euro Negoce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://euronegoce.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Euro Negoce - International Trade Company",
    description:
      "Premier international trade company specializing in fresh fruits, vegetables, and premium edible oils.",
    url: "https://euronegoce.com",
    siteName: "Euro Negoce",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Euro Negoce - International Trade Company",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Euro Negoce - International Trade Company",
    description:
      "Premier international trade company specializing in fresh fruits, vegetables, and premium edible oils.",
    images: ["/opengraph-image.png"],
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
  verification: {
    google: "fe009b203c155ab9",
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
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
