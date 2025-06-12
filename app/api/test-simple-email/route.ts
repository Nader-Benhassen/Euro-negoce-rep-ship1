import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("🧪 Testing simple email send...")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("API Key exists:", !!process.env.RESEND_API_KEY)
    console.log("API Key length:", process.env.RESEND_API_KEY?.length || 0)

    // Direct fetch to Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "contact@euronegocetrade.com",
        subject: "Direct API Test - " + new Date().toISOString(),
        html: `
          <h2>Direct API Test</h2>
          <p>This email was sent directly via the Resend API to test connectivity.</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        `,
      }),
    })

    const responseData = await response.json()

    console.log("📧 Resend API Response Status:", response.status)
    console.log("📧 Resend API Response:", responseData)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Resend API error",
          status: response.status,
          response: responseData,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Direct API test successful",
      response: responseData,
    })
  } catch (error) {
    console.error("❌ Direct API test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
