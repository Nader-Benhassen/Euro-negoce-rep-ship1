import { NextResponse } from "next/server"
import { sendBrevoEmailFetch, verifyBrevoApiKey } from "@/lib/brevo-fetch" // Updated import
import { logEmail } from "@/lib/database" // Assuming this is for logging the test email

export async function POST(request: Request) {
  console.log("🚀 Test email delivery process started via POST")

  try {
    const body = await request.json()
    const { testRecipientEmail, testSubject, testMessage } = body

    if (!testRecipientEmail || !testRecipientEmail.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid testRecipientEmail is required." }, { status: 400 })
    }
    if (!testSubject) {
      return NextResponse.json({ success: false, error: "testSubject is required." }, { status: 400 })
    }
    if (!testMessage) {
      return NextResponse.json({ success: false, error: "testMessage is required." }, { status: 400 })
    }

    console.log("🚀 Verifying Brevo API key for test email delivery...")
    const keyVerification = verifyBrevoApiKey()
    if (!keyVerification.brevoInitialized) {
      console.error("❌ Brevo not initialized for test email:", keyVerification)
      return NextResponse.json(
        { success: false, error: "Brevo email service not configured for test.", details: keyVerification },
        { status: 500 },
      )
    }
    console.log("✅ Brevo API key verified for test email delivery.")

    const htmlContent = `
      <h1>Test Email</h1>
      <p>This is a test email sent from the Euro Negoce Trade website.</p>
      <p><b>Message:</b> ${testMessage}</p>
      <p><b>Sent at:</b> ${new Date().toISOString()}</p>
    `

    console.log(`🚀 Sending test email to ${testRecipientEmail} via Brevo...`)
    const emailResult = await sendBrevoEmailFetch({
      to: testRecipientEmail,
      subject: `TEST: ${testSubject}`,
      htmlContent: htmlContent,
      // replyTo: "noreply@euronegocetrade.com", // Optional: set a noreply
    })

    if (!emailResult.success) {
      console.error("❌ Failed to send test email via Brevo:", emailResult.error)
      await logEmail({
        email_type: "test_delivery_failure",
        recipient_email: testRecipientEmail,
        subject: `TEST: ${testSubject}`,
        status: "failed",
        // brevo_email_id: null, // No ID if it failed before sending
      })
      return NextResponse.json(
        { success: false, error: "Failed to send test email.", details: emailResult.error },
        { status: 500 },
      )
    }

    console.log("✅ Test email sent successfully via Brevo:", emailResult.data)
    await logEmail({
      email_type: "test_delivery_success",
      recipient_email: testRecipientEmail,
      subject: `TEST: ${testSubject}`,
      status: "sent",
      brevo_email_id: emailResult.data?.id || null,
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully via Brevo.",
      details: emailResult.data,
    })
  } catch (error) {
    console.error("❌ Error in test email delivery process:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { success: false, error: "Internal server error during test email delivery.", details: errorMessage },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  console.log("🚀 Test email delivery configuration check process started via GET")
  try {
    const keyVerification = verifyBrevoApiKey()
    if (!keyVerification.brevoInitialized) {
      return NextResponse.json(
        {
          success: false,
          message: "Brevo email service is not properly configured.",
          details: {
            hasApiKey: keyVerification.hasApiKey,
            brevoInitialized: keyVerification.brevoInitialized,
            checkedAt: new Date().toISOString(),
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message:
        "Brevo email service appears to be configured (API key present). Send a POST request to test actual delivery.",
      details: {
        hasApiKey: keyVerification.hasApiKey,
        brevoInitialized: keyVerification.brevoInitialized,
        checkedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ Error in test email config check:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { success: false, error: "Internal server error during test email config check.", details: errorMessage },
      { status: 500 },
    )
  }
}
