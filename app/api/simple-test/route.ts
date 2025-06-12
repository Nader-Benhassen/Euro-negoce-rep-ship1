import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔥 SIMPLE TEST ENDPOINT CALLED - GET")
  console.log("🔥 Timestamp:", new Date().toISOString())
  console.log("🔥 Environment:", process.env.NODE_ENV)

  return NextResponse.json({
    message: "Simple test endpoint working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}

export async function POST() {
  console.log("🔥 SIMPLE TEST ENDPOINT CALLED - POST")
  console.log("🔥 Timestamp:", new Date().toISOString())

  try {
    // Test environment variables
    const hasResendKey = !!process.env.RESEND_API_KEY
    const keyLength = process.env.RESEND_API_KEY?.length || 0

    console.log("🔥 Environment check:")
    console.log("🔥 - Has RESEND_API_KEY:", hasResendKey)
    console.log("🔥 - Key length:", keyLength)

    return NextResponse.json({
      message: "POST test successful",
      timestamp: new Date().toISOString(),
      hasResendKey,
      keyLength,
    })
  } catch (error) {
    console.error("🔥 Error in simple test:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
