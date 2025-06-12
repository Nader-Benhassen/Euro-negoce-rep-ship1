import { Resend } from "resend"

// Initialize Resend with proper error handling
const resendApiKey = process.env.RESEND_API_KEY
let resend: Resend | null = null

try {
  if (resendApiKey) {
    resend = new Resend(resendApiKey)
  }
} catch (error) {
  console.error("Failed to initialize Resend:", error)
}

// Email configuration - using the same email for both sending and receiving
const FROM_EMAIL = "contact@euronegocetrade.com" // Corrected to use contact@ as sender
const TO_EMAIL = "contact@euronegocetrade.com" // Same email for receiving

// Function to verify the correct API key is loaded
export function verifyApiKey() {
  const expectedKey = "re_5FM8T24R_5CiKQSRbHYX6FmDsBoEpUeTz"
  const isCorrectKey = resendApiKey === expectedKey

  return {
    hasApiKey: !!resendApiKey,
    keyLength: resendApiKey?.length || 0,
    keyPrefix: resendApiKey?.substring(0, 12) + "..." || "none",
    isCorrectKey,
    expectedPrefix: "re_5FM8T24R_...",
    message: isCorrectKey ? "✅ Correct API key is loaded" : "❌ API key mismatch or missing",
    resendInitialized: !!resend,
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
  // Verify API key and Resend initialization
  const keyVerification = verifyApiKey()
  console.log("🔑 API Key Verification:", keyVerification)

  if (!keyVerification.isCorrectKey) {
    throw new Error(`API key verification failed: ${keyVerification.message}`)
  }

  if (!resend) {
    throw new Error("Resend SDK not initialized properly")
  }

  try {
    // Prepare email data according to Resend SDK requirements
    const emailData = {
      from: from,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
      ...(text && { text }),
      ...(replyTo && { reply_to: replyTo }),
    }

    console.log("📧 Sending email with Resend SDK:")
    console.log("- From:", emailData.from)
    console.log("- To:", emailData.to)
    console.log("- Subject:", emailData.subject)
    console.log("- Has HTML:", !!emailData.html)
    console.log("- Has Reply-To:", !!replyTo)

    // Send email using Resend SDK
    const response = await resend.emails.send(emailData)

    console.log("✅ Email sent successfully via Resend SDK:")
    console.log("- Response:", JSON.stringify(response, null, 2))

    return { success: true, data: response }
  } catch (error) {
    console.error("❌ Email sending failed:")
    console.error("- Error:", error)
    console.error("- Error type:", typeof error)
    console.error("- Error name:", error instanceof Error ? error.constructor.name : "Unknown")

    if (error instanceof Error) {
      console.error("- Error message:", error.message)
      console.error("- Error stack:", error.stack)
    }

    // Re-throw with more context
    throw new Error(`Email sending failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Enhanced test function
export async function testEmailConfig() {
  const keyVerification = verifyApiKey()
  console.log("🧪 Testing email configuration...")

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
        message: "Resend SDK not initialized",
        keyVerification,
      }
    }

    console.log("📧 Sending test email...")

    // Send test email using your verified domain
    const testResult = await resend.emails.send({
      from: FROM_EMAIL, // Using contact@euronegocetrade.com as sender
      to: [TO_EMAIL], // Sending to contact@euronegocetrade.com
      subject: `🧪 Email Test - ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a;">✅ Email System Test Successful!</h2>
          <p>This test email confirms that your email system is working correctly with the Resend SDK.</p>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>API Key Status:</strong> ${keyVerification.message}</li>
              <li><strong>From Email:</strong> ${FROM_EMAIL}</li>
              <li><strong>To Email:</strong> ${TO_EMAIL}</li>
              <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>SDK Version:</strong> Resend SDK for Next.js</li>
            </ul>
          </div>
          
          <p style="color: #059669;">If you receive this email, your email system is working correctly! 🎉</p>
          
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            This email was sent from your Euro Negoce website's email testing system.
          </p>
        </div>
      `,
    })

    console.log("✅ Test email sent successfully:", testResult)

    return {
      success: true,
      message: "Email configuration is valid and test email sent",
      keyVerification,
      testResult,
    }
  } catch (error) {
    console.error("❌ Email test failed:", error)

    return {
      success: false,
      message: "Email configuration test failed",
      error: error instanceof Error ? error.message : String(error),
      keyVerification,
    }
  }
}
