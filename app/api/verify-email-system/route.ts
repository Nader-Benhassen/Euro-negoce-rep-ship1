import { NextResponse } from "next/server"
import { verifyBrevoApiKey } from "@/lib/brevo-fetch" // Correct import for Brevo
import { getSupabaseClient } from "@/lib/database" // For Supabase check

export async function GET() {
  console.log("🚀 Starting email and system verification...")
  const results = {
    brevo: {
      configured: false,
      apiKeyPresent: false,
      message: "Brevo API key not found or service not initialized.",
    },
    supabase: {
      connected: false,
      message: "Supabase client not initialized or connection failed.",
    },
    overallStatus: "ISSUES_DETECTED",
    timestamp: new Date().toISOString(),
  }

  // Verify Brevo configuration
  try {
    const brevoVerification = verifyBrevoApiKey()
    results.brevo.apiKeyPresent = brevoVerification.hasApiKey
    results.brevo.configured = brevoVerification.brevoInitialized
    if (brevoVerification.brevoInitialized) {
      results.brevo.message = "Brevo email service is configured and API key is present."
      console.log("✅ Brevo verification successful.")
    } else if (brevoVerification.hasApiKey) {
      results.brevo.message = "Brevo API key is present, but service could not be initialized (check SDK setup)."
      console.warn("⚠️ Brevo API key present, but initialization failed.")
    } else {
      console.error("❌ Brevo API key not found.")
    }
  } catch (error) {
    results.brevo.message = `Error verifying Brevo: ${error instanceof Error ? error.message : "Unknown error"}`
    console.error("❌ Error during Brevo verification:", error)
  }

  // Verify Supabase connection
  try {
    const supabase = getSupabaseClient() // This will throw if not configured
    // Attempt a simple query to test connection (optional, getSupabaseClient already checks env vars)
    const { data, error } = await supabase.from("contacts").select("id").limit(1) // Use a table you know exists
    if (error && error.code !== "42P01") {
      // 42P01 is table not found, which is fine if DB is empty but schema exists
      throw new Error(`Supabase query failed: ${error.message}`)
    }
    results.supabase.connected = true
    results.supabase.message = "Supabase client initialized and seems connected."
    console.log("✅ Supabase verification successful.")
  } catch (error) {
    results.supabase.message = `Error verifying Supabase: ${error instanceof Error ? error.message : "Unknown error"}`
    console.error("❌ Error during Supabase verification:", error)
  }

  if (results.brevo.configured && results.supabase.connected) {
    results.overallStatus = "ALL_SYSTEMS_OPERATIONAL"
    console.log("🎉 All systems operational.")
  } else {
    console.warn("🚨 Issues detected in system verification.")
  }

  return NextResponse.json(results)
}
