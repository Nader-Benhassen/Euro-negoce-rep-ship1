import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CookieConsent from "./components/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Euro Negoce Global - Premium Agricultural Products Worldwide",
  description:
    "Euro Negoce Global specializes in sourcing and distributing premium agricultural products from Tunisia and across the globe. Quality guaranteed, worldwide delivery.",
  keywords:
    "agricultural products, Tunisia, olive oil, rapeseed oil, fruits, vegetables, global trade, premium quality",
  authors: [{ name: "Euro Negoce Global" }],
  creator: "Euro Negoce Global",
  publisher: "Euro Negoce Global",
  metadataBase: new URL("https://www.euronegoceglobal.com"),
  alternates: {
    canonical: "https://www.euronegoceglobal.com",
  },
  openGraph: {
    title: "Euro Negoce Global - Premium Agricultural Products Worldwide",
    description:
      "Specializing in premium agricultural products from Tunisia and worldwide. Quality guaranteed, global delivery.",
    url: "https://www.euronegoceglobal.com",
    siteName: "Euro Negoce Global",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Euro Negoce Global - Premium Agricultural Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Euro Negoce Global - Premium Agricultural Products Worldwide",
    description:
      "Specializing in premium agricultural products from Tunisia and worldwide. Quality guaranteed, global delivery.",
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
        <link rel="canonical" href="https://www.euronegoceglobal.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
