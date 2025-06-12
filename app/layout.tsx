import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CookieConsent from "./components/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Euro Negoce | Premium Olive Oil & Mediterranean Produce Export Import | Bulk Trading Worldwide",
  description:
    "Euro Negoce - Leading international trade company specializing in premium olive oil, fresh fruits, vegetables & edible oils export/import. Bulk trading, wholesale distribution across Europe, MENA & worldwide. Trusted Mediterranean produce supplier since 2010.",
  keywords: [
    // Brand keywords
    "euronegoce",
    "euro negoce",
    "euronegocetrade",
    "euro negoce trade",
    // Product keywords
    "olive oil export",
    "olive oil import",
    "bulk olive oil",
    "premium olive oil",
    "tunisian olive oil",
    "rapeseed oil bulk",
    "edible oils trading",
    "cooking oils export",
    "fresh fruits export",
    "mediterranean fruits",
    "citrus fruits bulk",
    "vegetables export",
    "fresh produce trading",
    "organic produce",
    // Business keywords
    "international trade",
    "bulk trading",
    "wholesale trading",
    "export import",
    "food trading company",
    "agricultural trading",
    "commodity trading",
    "mediterranean trading",
    "europe trading",
    "mena trading",
    "bulk food supplier",
    "wholesale food distributor",
    "food export company",
    // Location keywords
    "france trading company",
    "paris trading",
    "courneuve headquarters",
    "tunisia export",
    "spain import",
    "italy trading",
    "morocco trading",
    // Industry keywords
    "food commodities",
    "agricultural commodities",
    "fresh produce supplier",
    "bulk food products",
    "wholesale food trading",
    "international food trade",
    "premium food products",
    "quality food supplier",
    "reliable food trader",
  ].join(", "),
  authors: [{ name: "Euro Negoce Trading Company" }],
  creator: "Euro Negoce",
  publisher: "Euro Negoce International Trading",
  metadataBase: new URL("https://www.euronegocetrade.com"),
  alternates: {
    canonical: "https://www.euronegocetrade.com",
    languages: {
      en: "https://www.euronegocetrade.com",
      fr: "https://www.euronegocetrade.com/fr",
      ar: "https://www.euronegocetrade.com/ar",
    },
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.euronegocetrade.com",
    title: "Euro Negoce | Premium Olive Oil Export Import | Bulk Mediterranean Trading",
    description:
      "Leading international trade company specializing in premium olive oil, fresh Mediterranean produce & edible oils. Bulk trading, export/import services worldwide. Trusted supplier since 2010.",
    siteName: "Euro Negoce Trading",
    images: [
      {
        url: "/favicon.png",
        width: 800,
        height: 800,
        alt: "Euro Negoce - Premium Olive Oil and Mediterranean Produce Trading",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@euronegoce",
    creator: "@euronegoce",
    title: "Euro Negoce | Premium Olive Oil Export Import | Bulk Trading",
    description:
      "Leading international trade company specializing in premium olive oil, Mediterranean produce & edible oils. Bulk trading worldwide.",
    images: ["/favicon.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    bing: "your-bing-verification-code",
  },
  category: "International Trade",
  classification: "Business",
  referrer: "origin-when-cross-origin",
  generator: "Euro Negoce Trading Platform",
  applicationName: "Euro Negoce",
  appleWebApp: {
    capable: true,
    title: "Euro Negoce Trading",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  other: {
    "geo.region": "FR-75",
    "geo.placename": "Paris, France",
    "geo.position": "48.8566;2.3522",
    ICBM: "48.8566, 2.3522",
    "business.contact_data.street_address": "Paris, France",
    "business.contact_data.locality": "Paris",
    "business.contact_data.region": "Île-de-France",
    "business.contact_data.postal_code": "75000",
    "business.contact_data.country_name": "France",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.euronegocetrade.com" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/favicon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.png" />
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
                  "@id": "https://www.euronegocetrade.com/#organization",
                  name: "Euro Negoce",
                  alternateName: ["Euro Negoce Trading", "EuroNegoce", "Euro Negoce Trade"],
                  url: "https://www.euronegocetrade.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.euronegocetrade.com/images/euronegoce-logo.png",
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
                    telephone: "+33-1-XX-XX-XX-XX",
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
                  "@id": "https://www.euronegocetrade.com/#website",
                  url: "https://www.euronegocetrade.com",
                  name: "Euro Negoce Trading",
                  description: "Premium olive oil and Mediterranean produce trading company",
                  publisher: {
                    "@id": "https://www.euronegocetrade.com/#organization",
                  },
                  potentialAction: [
                    {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate: "https://www.euronegocetrade.com/search?q={search_term_string}",
                      },
                      "query-input": "required name=search_term_string",
                    },
                  ],
                },
                {
                  "@type": "WebPage",
                  "@id": "https://www.euronegocetrade.com/#webpage",
                  url: "https://www.euronegocetrade.com",
                  name: "Euro Negoce | Premium Olive Oil & Mediterranean Produce Export Import",
                  isPartOf: {
                    "@id": "https://www.euronegocetrade.com/#website",
                  },
                  about: {
                    "@id": "https://www.euronegocetrade.com/#organization",
                  },
                  description:
                    "Leading international trade company specializing in premium olive oil, fresh Mediterranean produce & edible oils export/import. Bulk trading worldwide.",
                  breadcrumb: {
                    "@id": "https://www.euronegocetrade.com/#breadcrumb",
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://www.euronegocetrade.com/#breadcrumb",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://www.euronegocetrade.com",
                    },
                  ],
                },
                {
                  "@type": "Service",
                  name: "Olive Oil Export Import",
                  provider: {
                    "@id": "https://www.euronegocetrade.com/#organization",
                  },
                  description: "Premium olive oil bulk trading and export/import services worldwide",
                  serviceType: "International Trade",
                  areaServed: "Worldwide",
                },
                {
                  "@type": "Service",
                  name: "Mediterranean Produce Trading",
                  provider: {
                    "@id": "https://www.euronegocetrade.com/#organization",
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
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
