// Environment configuration with validation
export const config = {
  // Email Configuration
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: "noreply@euronegocetrade.com",
    toEmail: "contact@euronegocetrade.com",
  },

  // Site Configuration
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.euronegocetrade.com",
    name: "Euro Negoce Trade",
    description: "Premium agricultural products and international trade solutions",
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Verification Codes
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    bing: process.env.BING_VERIFICATION_CODE,
  },
} as const

// Validation function
export function validateConfig() {
  const errors: string[] = []

  if (!config.resend.apiKey) {
    errors.push("RESEND_API_KEY is required")
  }

  if (config.isProduction && !config.site.url.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SITE_URL must use HTTPS in production")
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join("\n")}`)
  }

  return true
}

// Runtime validation (only in development)
if (config.isDevelopment) {
  try {
    validateConfig()
    console.log("✅ Configuration validated successfully")
  } catch (error) {
    console.error("❌ Configuration validation failed:", error)
  }
}
