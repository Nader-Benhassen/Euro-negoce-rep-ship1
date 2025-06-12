import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Email configuration
const FROM_EMAIL = "onboarding@resend.dev" // Use Resend's verified domain initially
const TO_EMAIL = "contact@euronegocetrade.com"

export async function sendEmail({
  to = TO_EMAIL,
  from = FROM_EMAIL,
  subject,
  html,
  text,
  replyTo,
}: {
  to?: string
  from?: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}) {
  console.log("🔍 Email Debug Info:")
  console.log("- API Key exists:", !!resendApiKey)
  console.log("- API Key length:", resendApiKey?.length || 0)
  console.log("- API Key prefix:", resendApiKey?.substring(0, 8) + "..." || "none")
  console.log("- Resend instance:", !!resend)
  console.log("- From:", from)
  console.log("- To:", to)
  console.log("- Subject:", subject)

  if (!resend) {
    const error = "Resend not initialized - RESEND_API_KEY missing or invalid"
    console.error("❌", error)
    throw new Error(error)
  }

  try {
    const emailData = {
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
      ...(replyTo ? { reply_to: replyTo } : {}),
    }

    console.log("📧 Sending email with data:", JSON.stringify(emailData, null, 2))

    const response = await resend.emails.send(emailData)

    console.log("✅ Email sent successfully:", JSON.stringify(response, null, 2))
    return { success: true, data: response }
  } catch (error) {
    console.error("❌ Email sending failed:")
    console.error("Error:", error)
    console.error("Error type:", typeof error)
    console.error("Error constructor:", error?.constructor?.name)

    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    throw error
  }
}

// Test function to verify email configuration
export async function testEmailConfig() {
  try {
    if (!resend) {
      return {
        success: false,
        message: "Resend API key not configured",
        apiKeyConfigured: !!resendApiKey,
        apiKeyLength: resendApiKey?.length || 0,
      }
    }

    // Test the API key with a simple ping
    const pingResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "Email System Test",
      html: "<p>This is a test email to verify the email system is working.</p>",
    })

    return {
      success: true,
      message: "Email configuration is valid",
      apiKeyConfigured: !!resendApiKey,
      apiKeyLength: resendApiKey?.length || 0,
      pingResult,
    }
  } catch (error) {
    return {
      success: false,
      message: "Email configuration test failed",
      error: error instanceof Error ? error.message : String(error),
      apiKeyConfigured: !!resendApiKey,
      apiKeyLength: resendApiKey?.length || 0,
    }
  }
}
