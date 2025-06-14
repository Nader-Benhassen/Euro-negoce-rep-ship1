import { NextResponse } from "next/server"
import { verifyBrevoApiKey } from "@/lib/brevo-fetch" // Correct import

export const dynamic = "force-dynamic"

export async function GET() {
  console.log("🔑 API Route: Verifying API Key (Brevo)...")
  const brevoVerification = verifyBrevoApiKey()

  if (brevoVerification.brevoInitialized) {
    return NextResponse.json({
      status: "success",
      message: "Brevo API key is configured and seems valid.",
      details: brevoVerification,
    })
  } else {
    return NextResponse.json(
      {
        status: "error",
        message: "Brevo API key is missing or not configured correctly.",
        details: brevoVerification,
      },
      { status: 500 },
    )
  }
}
