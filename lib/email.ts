import { Resend } from "resend"

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Email configuration
const FROM_EMAIL = "noreply@euronegocetrade.com"
const TO_EMAIL = "contact@euronegocetrade.com" // Primary and only recipient

// Email sending function with enhanced error handling and logging
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
  // Validate Resend API key
  if (!resend) {
    console.error("❌ CRITICAL: Resend API key is not configured")
    throw new Error("Email service not configured")
  }

  try {
    console.log(`📧 Attempting to send email: "${subject}" to ${to}`)

    const emailData = {
      from,
      to: [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML if text not provided
      ...(replyTo ? { reply_to: replyTo } : {}),
    }

    // Send email with timeout
    const response = await Promise.race([
      resend.emails.send(emailData),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Email sending timed out after 10s")), 10000)),
    ])

    console.log(`✅ Email sent successfully: ${JSON.stringify(response)}`)
    return { success: true, data: response }
  } catch (error) {
    // Detailed error logging
    console.error("❌ Email sending failed:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))

    // Additional diagnostics
    console.log("📊 Diagnostics:")
    console.log("- API Key configured:", !!resendApiKey)
    console.log("- API Key length:", resendApiKey?.length || 0)
    console.log("- From email:", from)
    console.log("- To email:", to)
    console.log("- Subject:", subject)

    throw error
  }
}

// Test function to verify email configuration
export async function testEmailConfig() {
  try {
    if (!resend) {
      return { success: false, message: "Resend API key not configured" }
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
