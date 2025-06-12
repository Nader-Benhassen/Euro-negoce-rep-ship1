import { Resend } from "resend"

// Get API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Email configuration
const FROM_EMAIL = "onboarding@resend.dev" // Use Resend's verified domain
const TO_EMAIL = "contact@euronegocetrade.com"

// Function to verify the correct API key is loaded
export function verifyApiKey() {
  const expectedKeyPrefix = "re_5FM8T24R_5CiKQSRbHYX6FmDsBoEpUeTz"
  const isCorrectKey = resendApiKey === expectedKeyPrefix

  return {
    hasApiKey: !!resendApiKey,
    keyLength: resendApiKey?.length || 0,
    keyPrefix: resendApiKey?.substring(0, 12) + "..." || "none",
    isCorrectKey,
    expectedPrefix: "re_5FM8T24R_...",
    message: isCorrectKey ? "✅ Correct API key is loaded" : "❌ API key mismatch or missing",
  }
}

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
  // Verify API key before sending
  const keyVerification = verifyApiKey()
  console.log("🔑 API Key Verification:", keyVerification)

  if (!keyVerification.isCorrectKey) {
    const error = `API key verification failed: ${keyVerification.message}`
    console.error("❌", error)
    throw new Error(error)
  }

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

    console.log("📧 Sending email with verified API key")
    console.log("- From:", from)
    console.log("- To:", to)
    console.log("- Subject:", subject)

    const response = await resend.emails.send(emailData)

    console.log("✅ Email sent successfully:", JSON.stringify(response, null, 2))
    return { success: true, data: response }
  } catch (error) {
    console.error("❌ Email sending failed:")
    console.error("Error:", error)

    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    throw error
  }
}

// Test function to verify email configuration with the correct API key
export async function testEmailConfig() {
  const keyVerification = verifyApiKey()

  try {
    if (!keyVerification.isCorrectKey) {
      return {
        success: false,
        message: "Incorrect API key configured",
        keyVerification,
      }
    }

    if (!resend) {
      return {
        success: false,
        message: "Resend not initialized",
        keyVerification,
      }
    }

    // Test the API key with a simple ping
    const pingResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "Email System Test - API Key Verification",
      html: `
        <h2>Email System Test</h2>
        <p>This is a test email to verify the email system is working with the correct API key.</p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>API Key Verification:</h3>
          <p><strong>Status:</strong> ${keyVerification.message}</p>
          <p><strong>Key Prefix:</strong> ${keyVerification.keyPrefix}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
    })

    return {
      success: true,
      message: "Email configuration is valid with correct API key",
      keyVerification,
      pingResult,
    }
  } catch (error) {
    return {
      success: false,
      message: "Email configuration test failed",
      error: error instanceof Error ? error.message : String(error),
      keyVerification,
    }
  }
}
