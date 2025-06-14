import { NextResponse } from "next/server"
import { verifyBrevoApiKey } from "@/lib/brevo-fetch" // Correct Brevo verification
import { getSupabaseClient } from "@/lib/database" // Correct Supabase client getter

export const dynamic = "force-dynamic"

export async function GET() {
  const results = {
    brevo: { status: "PENDING", message: "Checking Brevo configuration..." },
    supabase: { status: "PENDING", message: "Checking Supabase connection..." },
    overallStatus: "PENDING",
    timestamp: new Date().toISOString(),
  }

  // Check Brevo
  try {
    const brevoVerification = verifyBrevoApiKey()
    if (brevoVerification.brevoInitialized) {
      results.brevo = { status: "OK", message: "Brevo API key is present and client initialized." }
    } else {
      // brevoInitialized is false if hasApiKey is false
      results.brevo = { status: "ERROR", message: brevoVerification.message }
    }
  } catch (e) {
    results.brevo = { status: "ERROR", message: `Brevo check failed: ${e instanceof Error ? e.message : String(e)}` }
  }

  // Check Supabase
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from("contacts").select("id", { count: "exact", head: true }) // Test query
    if (error && error.code !== "42P01") {
      // "42P01" is undefined_table
      throw error
    }
    results.supabase = { status: "OK", message: "Supabase client initialized and test query successful." }
  } catch (e) {
    results.supabase = {
      status: "ERROR",
      message: `Supabase check failed: ${e instanceof Error ? e.message : String(e)}`,
    }
  }

  if (results.brevo.status === "OK" && results.supabase.status === "OK") {
    results.overallStatus = "ALL_SYSTEMS_OPERATIONAL"
  } else {
    results.overallStatus = "ISSUES_DETECTED"
  }

  return NextResponse.json(results)
}
