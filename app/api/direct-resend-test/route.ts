import { NextResponse } from "next/server"

export async function POST() {
  console.log("🔥 DIRECT RESEND API TEST STARTED")

  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error("🔥 No API key found")
      return NextResponse.json({ error: "No API key" }, { status: 500 })
    }

    console.log("🔥 Making direct fetch to Resend API...")

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "contact@euronegocetrade.com",
        to: ["contact@euronegocetrade.com"],
        subject: "🔥 DIRECT API TEST",
        html: "<h1>Direct API Test</h1><p>This email was sent via direct fetch to Resend API</p>",
      }),
    })

    console.log("🔥 Response status:", response.status)
    console.log("🔥 Response headers:", Object.fromEntries(response.headers.entries()))

    const responseData = await response.json()
    console.log("🔥 Response data:", JSON.stringify(responseData, null, 2))

    if (!response.ok) {
      console.error("🔥 API call failed:", responseData)
      return NextResponse.json(
        {
          success: false,
          error: "API call failed",
          status: response.status,
          data: responseData,
        },
        { status: 500 },
      )
    }

    console.log("🔥 DIRECT API CALL SUCCESSFUL!")

    return NextResponse.json({
      success: true,
      message: "Direct API test successful",
      status: response.status,
      data: responseData,
    })
  } catch (error) {
    console.error("🔥 DIRECT API TEST FAILED:")
    console.error("🔥 Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
