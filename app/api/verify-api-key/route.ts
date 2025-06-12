import { NextResponse } from "next/server"
import { verifyApiKey, testEmailConfig } from "@/lib/email"

export async function GET() {
  try {
    const verification = verifyApiKey()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      verification,
      instructions: {
        message: "To set the API key correctly:",
        steps: [
          "1. Set environment variable: RESEND_API_KEY=re_5FM8T24R_5CiKQSRbHYX6FmDsBoEpUeTz",
          "2. For Vercel: Add in Project Settings > Environment Variables",
          "3. For local development: Add to .env.local file",
          "4. Redeploy after setting the environment variable",
        ],
      },
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

export async function POST() {
  try {
    const testResult = await testEmailConfig()
    return NextResponse.json(testResult)
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
