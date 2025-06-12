import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CookieConsent from "./components/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import { config } from "@/lib/config"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Euro Negoce - International Trade & Agricultural Products",
  description:
    "Euro Negoce is a premier international trade company specializing in the import and export of high-quality fresh fruits, vegetables, and premium edible oils.",
  metadataBase: new URL(config.site.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Euro Negoce - International Trade & Agricultural Products",
    description:
      "Euro Negoce is a premier international trade company specializing in the import and export of high-quality fresh fruits, vegetables, and premium edible oils.",
    url: config.site.url,
    siteName: "Euro Negoce Trade",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${config.site.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Euro Negoce - International Trade & Agricultural Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Euro Negoce - International Trade & Agricultural Products",
    description:
      "Euro Negoce is a premier international trade company specializing in the import and export of high-quality fresh fruits, vegetables, and premium edible oils.",
    images: [`${config.site.url}/og-image.jpg`],
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
    google: config.verification.google,
    yandex: config.verification.yandex,
    bing: config.verification.bing,
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
        <link
          rel="canonical"
          href={process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}
        />
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

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#organization`,
                  name: "Euro Negoce",
                  alternateName: ["Euro Negoce Trading", "EuroNegoce", "Euro Negoce Trade"],
                  url:
                    process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000",
                  logo: {
                    "@type": "ImageObject",
                    url: `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/favicon.png`,
                    width: 300,
                    height: 100,
                  },
                  description:
                    "Leading international trade company specializing in premium olive oil, fresh Mediterranean produce and edible oils export/import services worldwide.",
                  foundingDate: "2010",
                  address: [
                    {
                      "@type": "PostalAddress",
                      addressLocality: "Paris",
                      addressRegion: "Île-de-France",
                      addressCountry: "FR",
                      name: "Euro Negoce Paris Office",
                    },
                    {
                      "@type": "PostalAddress",
                      addressLocality: "Courneuve",
                      addressRegion: "Île-de-France",
                      addressCountry: "FR",
                      name: "Euro Negoce Headquarters",
                    },
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+33-1-48-11-65-91",
                    contactType: "customer service",
                    email: "euronegoce.mail@gmail.com",
                    availableLanguage: ["English", "French", "Arabic"],
                  },
                  sameAs: ["https://www.linkedin.com/company/euronegoce", "https://twitter.com/euronegoce"],
                  areaServed: ["Europe", "MENA", "North Africa", "Mediterranean", "Worldwide"],
                  knowsAbout: [
                    "Olive Oil Trading",
                    "Mediterranean Produce",
                    "Bulk Food Trading",
                    "International Food Export",
                    "Premium Edible Oils",
                    "Fresh Fruits Export",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#website`,
                  url:
                    process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000",
                  name: "Euro Negoce Trading",
                  description: "Premium olive oil and Mediterranean produce trading company",
                  publisher: {
                    "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#organization`,
                  },
                  potentialAction: [
                    {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate: `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/search?q={search_term_string}`,
                      },
                      "query-input": "required name=search_term_string",
                    },
                  ],
                },
                {
                  "@type": "WebPage",
                  "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#webpage`,
                  url:
                    process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000",
                  name: "Euro Negoce | Premium Olive Oil & Mediterranean Produce Export Import",
                  isPartOf: {
                    "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#website`,
                  },
                  about: {
                    "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#organization`,
                  },
                  description:
                    "Leading international trade company specializing in premium olive oil, fresh Mediterranean produce & edible oils export/import. Bulk trading worldwide.",
                  breadcrumb: {
                    "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#breadcrumb`,
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#breadcrumb`,
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item:
                        process.env.NODE_ENV === "production"
                          ? "https://www.euronegocetrade.com"
                          : "http://localhost:3000",
                    },
                  ],
                },
                {
                  "@type": "Service",
                  name: "Olive Oil Export Import",
                  provider: {
                    "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#organization`,
                  },
                  description: "Premium olive oil bulk trading and export/import services worldwide",
                  serviceType: "International Trade",
                  areaServed: "Worldwide",
                },
                {
                  "@type": "Service",
                  name: "Mediterranean Produce Trading",
                  provider: {
                    "@id": `${process.env.NODE_ENV === "production" ? "https://www.euronegocetrade.com" : "http://localhost:3000"}/#organization`,
                  },
                  description: "Fresh Mediterranean fruits and vegetables bulk trading services",
                  serviceType: "Agricultural Trading",
                  areaServed: "Worldwide",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <CookieConsent />
      </body>
    </html>
  )
}
