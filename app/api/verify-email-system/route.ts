import { NextResponse } from "next/server"
import { config } from "@/lib/config"
import { sql } from "@/lib/database"

async function checkBrevo() {
  if (!config.brevo.apiKey) {
    return { status: "❌ FAIL", message: "BREVO_API_KEY is not set." }
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": config.brevo.apiKey },
    })
    if (response.ok) {
      return { status: "✅ PASS", message: "Brevo API key is valid." }
    }
    return {
      status: "❌ FAIL",
      message: `Brevo API key is invalid. Status: ${response.status}`,
    }
  } catch (error) {
    return {
      status: "❌ FAIL",
      message: `Failed to connect to Brevo API. ${error.message}`,
    }
  }
}

async function checkDatabase() {
  try {
    await sql`SELECT 1`
    return { status: "✅ PASS", message: "Database connection is successful." }
  } catch (error) {
    return {
      status: "❌ FAIL",
      message: `Database connection failed. ${error.message}`,
    }
  }
}

export async function GET() {
  const checks = {
    brevo: await checkBrevo(),
    database: await checkDatabase(),
  }

  const overallStatus = Object.values(checks).every((check) => check.status.includes("✅"))

  return NextResponse.json({
    overallStatus: overallStatus ? "✅ All systems operational" : "❌ System check failed",
    checks,
  })
}
