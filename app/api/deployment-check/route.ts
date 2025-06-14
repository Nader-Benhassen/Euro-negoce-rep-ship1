import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/database" // Correct import
import { verifyBrevoApiKey } from "@/lib/brevo-fetch" // Correct import

export const dynamic = "force-dynamic"

export async function GET() {
  const checks = []
  let overallStatus = "OK"

  // Check Environment Variables
  const requiredEnvVars = ["BREVO_API_KEY", "EURONEGOCE_DB_SUPABASE_URL", "EURONEGOCE_DB_SUPABASE_ANON_KEY"]
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])
  if (missingEnvVars.length > 0) {
    checks.push({ name: "Environment Variables", status: "ERROR", message: `Missing: ${missingEnvVars.join(", ")}` })
    overallStatus = "ERROR"
  } else {
    checks.push({
      name: "Environment Variables",
      status: "OK",
      message: "All critical environment variables are present.",
    })
  }

  // Check Supabase Connection
  try {
    getSupabaseClient() // This will throw if Supabase URL/Key are missing
    // Optionally, perform a light read query if necessary, but getSupabaseClient() itself checks env vars.
    checks.push({
      name: "Supabase Client Initialization",
      status: "OK",
      message: "Supabase client can be initialized.",
    })
  } catch (error) {
    checks.push({
      name: "Supabase Client Initialization",
      status: "ERROR",
      message: error instanceof Error ? error.message : "Failed to initialize Supabase client.",
    })
    overallStatus = "ERROR"
  }

  // Check Brevo API Key
  const brevoCheck = verifyBrevoApiKey()
  if (brevoCheck.brevoInitialized) {
    checks.push({ name: "Brevo API Key", status: "OK", message: "Brevo API key is present and client initialized." })
  } else {
    checks.push({
      name: "Brevo API Key",
      status: "ERROR",
      message: brevoCheck.message, // Use message from verifyBrevoApiKey
    })
    overallStatus = "ERROR"
  }

  return NextResponse.json({
    overallStatus,
    checks,
    timestamp: new Date().toISOString(),
  })
}
