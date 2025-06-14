import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/database" // Correct way to use database functions
import { verifyBrevoApiKey } from "@/lib/brevo-fetch" // Correct way to use Brevo functions

export async function GET() {
  const checks = []
  let overallStatus = "OK"

  // Check Environment Variables
  const requiredEnvVars = [
    "BREVO_API_KEY",
    "EURONEGOCE_DB_SUPABASE_URL",
    "EURONEGOCE_DB_SUPABASE_ANON_KEY",
    // Add other critical env vars if necessary
  ]
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
    checks.push({
      name: "Supabase Client Initialization",
      status: "OK",
      message: "Supabase client can be initialized (URL/Key present).",
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
  } else if (brevoCheck.hasApiKey) {
    checks.push({
      name: "Brevo API Key",
      status: "WARNING",
      message: "Brevo API key is present but client not initialized.",
    })
    // overallStatus might remain 'OK' or be set to 'WARNING' depending on strictness
  } else {
    checks.push({ name: "Brevo API Key", status: "ERROR", message: "Brevo API key is missing." })
    overallStatus = "ERROR"
  }

  // Add more checks as needed, e.g., trying a simple DB query or sending a test email (carefully)

  return NextResponse.json({
    overallStatus,
    checks,
    timestamp: new Date().toISOString(),
  })
}
