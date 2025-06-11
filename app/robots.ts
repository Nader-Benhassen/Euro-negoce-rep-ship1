import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private/", "/admin/", "/api/", "/temp/", "/*.pdf$", "/search?*", "/internal/*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/private/", "/admin/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/private/", "/admin/"],
      },
    ],
    sitemap: "https://www.euronegocetrade.com/sitemap.xml",
    host: "https://www.euronegocetrade.com",
  }
}
