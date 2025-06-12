import { NextResponse } from "next/server"
import { debugEmailConfig, sendTestEmail } from "@/lib/email-debug"

export async function GET() {
  try {
    const debugInfo = await debugEmailConfig()
    return NextResponse.json(debugInfo)
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
    const testResult = await sendTestEmail()
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
