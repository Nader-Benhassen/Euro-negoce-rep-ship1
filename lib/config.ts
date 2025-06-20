// Environment configuration with validation
export const config = {
  // Email Configuration - Using Brevo
  brevo: {
    apiKey: process.env.BREVO_API_KEY || "",
    fromEmail: "contact@euronegocetrade.com",
    fromName: "Euro Negoce Trade",
    toEmail: "contact@euronegocetrade.com", // Correct receiving email
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
    google: process.env.GOOGLE_VERIFICATION_CODE || "",
    yandex: process.env.YANDEX_VERIFICATION_CODE || "",
    bing: process.env.BING_VERIFICATION_CODE || "",
  },
} as const

// Validation function
export function validateConfig() {
  const errors: string[] = []

  if (!config.brevo.apiKey && config.isProduction) {
    errors.push("BREVO_API_KEY is required in production")
  }

  if (config.isProduction && !config.site.url.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SITE_URL must use HTTPS in production")
  }

  if (errors.length > 0) {
    console.error("Configuration errors:", errors)
    return false
  }

  return true
}

// Runtime validation (only in development)
if (config.isDevelopment) {
  try {
    const isValid = validateConfig()
    if (isValid) {
      console.log("✅ Configuration validated successfully")
    }
  } catch (error) {
    console.error("❌ Configuration validation failed:", error)
  }
}
