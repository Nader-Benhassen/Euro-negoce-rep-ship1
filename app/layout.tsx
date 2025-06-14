import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "./components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Euro Negoce Trade - Premium Agricultural Products",
  description:
    "Leading supplier of premium agricultural products from Tunisia and across the Mediterranean. Quality fruits, vegetables, oils, and specialty products.",
  keywords: "agricultural products, Tunisia, Mediterranean, fruits, vegetables, olive oil, export, import, trade",
  authors: [{ name: "Euro Negoce Trade" }],
  creator: "Euro Negoce Trade",
  publisher: "Euro Negoce Trade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.euronegocetrade.com"),
  alternates: {
    canonical: "https://www.euronegocetrade.com",
  },
  openGraph: {
    title: "Euro Negoce Trade - Premium Agricultural Products",
    description: "Leading supplier of premium agricultural products from Tunisia and across the Mediterranean.",
    url: "https://www.euronegocetrade.com",
    siteName: "Euro Negoce Trade",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Euro Negoce Trade - Premium Agricultural Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Euro Negoce Trade - Premium Agricultural Products",
    description: "Leading supplier of premium agricultural products from Tunisia and across the Mediterranean.",
    images: ["/placeholder.jpg"],
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
