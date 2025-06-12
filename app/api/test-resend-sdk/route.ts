import { NextResponse } from "next/server"
import { testEmailConfig, verifyApiKey } from "@/lib/email"

export async function GET() {
  try {
    console.log("🧪 Starting comprehensive Resend SDK test...")

    const verification = verifyApiKey()
    const testResult = await testEmailConfig()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      verification,
      testResult,
      instructions: {
        message: "Resend SDK Test Results",
        nextSteps: [
          "1. Check contact@euronegocetrade.com inbox",
          "2. Look in spam/junk folder if not in inbox",
          "3. Check Resend dashboard for delivery logs",
          "4. Verify domain status in Resend console",
        ],
      },
    })
  } catch (error) {
    console.error("❌ Resend SDK test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("📧 Sending direct test email via Resend SDK...")

    const testResult = await testEmailConfig()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      testResult,
      message: testResult.success
        ? "Test email sent! Check contact@euronegocetrade.com"
        : "Test email failed - check logs for details",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
