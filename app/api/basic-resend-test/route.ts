import { NextResponse } from "next/server"

export async function POST() {
  console.log("🔥 BASIC RESEND TEST STARTED")

  try {
    // Step 1: Check environment
    console.log("🔥 Step 1: Checking environment...")
    const apiKey = process.env.RESEND_API_KEY
    console.log("🔥 API Key exists:", !!apiKey)
    console.log("🔥 API Key length:", apiKey?.length || 0)

    if (!apiKey) {
      console.error("🔥 NO API KEY FOUND!")
      return NextResponse.json({ error: "No API key found" }, { status: 500 })
    }

    // Step 2: Import Resend
    console.log("🔥 Step 2: Importing Resend...")
    const { Resend } = await import("resend")
    console.log("🔥 Resend imported successfully")

    // Step 3: Initialize Resend
    console.log("🔥 Step 3: Initializing Resend...")
    const resend = new Resend(apiKey)
    console.log("🔥 Resend initialized")

    // Step 4: Prepare email data
    console.log("🔥 Step 4: Preparing email...")
    const emailData = {
      from: "contact@euronegocetrade.com",
      to: ["contact@euronegocetrade.com"],
      subject: "🔥 BASIC TEST EMAIL",
      html: "<h1>This is a basic test email</h1><p>If you see this, the basic email system works!</p>",
    }
    console.log("🔥 Email data:", emailData)

    // Step 5: Send email
    console.log("🔥 Step 5: Sending email...")
    console.log("🔥 About to call resend.emails.send()...")

    const result = await resend.emails.send(emailData)

    console.log("🔥 EMAIL SENT SUCCESSFULLY!")
    console.log("🔥 Result:", JSON.stringify(result, null, 2))

    return NextResponse.json({
      success: true,
      message: "Basic email test successful",
      result,
    })
  } catch (error) {
    console.error("🔥 BASIC RESEND TEST FAILED:")
    console.error("🔥 Error type:", typeof error)
    console.error("🔥 Error:", error)

    if (error instanceof Error) {
      console.error("🔥 Error name:", error.name)
      console.error("🔥 Error message:", error.message)
      console.error("🔥 Error stack:", error.stack)
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        errorType: typeof error,
      },
      { status: 500 },
    )
  }
}
