import { Resend } from "resend"

// Initialize Resend with proper error handling
const resendApiKey = process.env.RESEND_API_KEY
let resend: Resend | null = null

console.log("🔧 Initializing Resend SDK...")
console.log("- API Key exists:", !!resendApiKey)
console.log("- API Key length:", resendApiKey?.length || 0)
console.log("- API Key prefix:", resendApiKey?.substring(0, 12) + "..." || "none")

try {
  if (resendApiKey) {
    resend = new Resend(resendApiKey)
    console.log("✅ Resend SDK initialized successfully")
  } else {
    console.error("❌ No API key found - Resend SDK not initialized")
  }
} catch (error) {
  console.error("❌ Failed to initialize Resend SDK:", error)
  console.error("Error details:", {
    name: error instanceof Error ? error.name : "Unknown",
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : "No stack trace",
  })
}

// Email configuration
const FROM_EMAIL = "contact@euronegocetrade.com"
const TO_EMAIL = "contact@euronegocetrade.com"

// Function to verify the correct API key is loaded
export function verifyApiKey() {
  console.log("🔑 Verifying API key...")

  const expectedKey = "re_5FM8T24R_5CiKQSRbHYX6FmDsBoEpUeTz"
  const isCorrectKey = resendApiKey === expectedKey

  const verification = {
    hasApiKey: !!resendApiKey,
    keyLength: resendApiKey?.length || 0,
    keyPrefix: resendApiKey?.substring(0, 12) + "..." || "none",
    isCorrectKey,
    expectedPrefix: "re_5FM8T24R_...",
    message: isCorrectKey ? "✅ Correct API key is loaded" : "❌ API key mismatch or missing",
    resendInitialized: !!resend,
  }

  console.log("🔑 API Key verification result:", verification)
  return verification
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
  console.log("📧 Starting email send process...")

  try {
    // Step 1: Verify API key and Resend initialization
    console.log("📧 Step 1: Verifying configuration...")
    const keyVerification = verifyApiKey()

    if (!keyVerification.isCorrectKey) {
      const error = `API key verification failed: ${keyVerification.message}`
      console.error("❌ Step 1 failed:", error)
      throw new Error(error)
    }

    if (!resend) {
      const error = "Resend SDK not initialized properly"
      console.error("❌ Step 1 failed:", error)
      throw new Error(error)
    }

    console.log("✅ Step 1 completed: Configuration verified")

    // Step 2: Prepare email data
    console.log("📧 Step 2: Preparing email data...")
    const emailData = {
      from: from,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
      ...(text && { text }),
      ...(replyTo && { reply_to: replyTo }),
    }

    console.log("📧 Email data prepared:", {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      hasHtml: !!emailData.html,
      htmlLength: emailData.html?.length || 0,
      hasText: !!emailData.text,
      hasReplyTo: !!replyTo,
    })

    console.log("✅ Step 2 completed: Email data prepared")

    // Step 3: Send email using Resend SDK
    console.log("📧 Step 3: Sending email via Resend SDK...")
    console.log("📧 About to call resend.emails.send()...")

    const response = await resend.emails.send(emailData)

    console.log("✅ Step 3 completed: Email sent successfully!")
    console.log("📧 Resend response:", JSON.stringify(response, null, 2))

    return { success: true, data: response }
  } catch (error) {
    console.error("❌ Email sending failed at some step:")
    console.error("❌ Error type:", typeof error)
    console.error("❌ Error constructor:", error instanceof Error ? error.constructor.name : "Unknown")

    if (error instanceof Error) {
      console.error("❌ Error name:", error.name)
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
    } else {
      console.error("❌ Non-Error object thrown:", error)
    }

    // Additional debugging for specific error types
    if (error && typeof error === "object" && "response" in error) {
      console.error("❌ HTTP Response error:", error.response)
    }

    if (error && typeof error === "object" && "status" in error) {
      console.error("❌ Status code:", error.status)
    }

    // Re-throw with more context
    throw new Error(`Email sending failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Enhanced test function with extensive logging
export async function testEmailConfig() {
  console.log("🧪 Starting email configuration test...")

  try {
    // Step 1: Verify configuration
    console.log("🧪 Test Step 1: Verifying configuration...")
    const keyVerification = verifyApiKey()

    if (!keyVerification.isCorrectKey) {
      console.error("❌ Test failed at Step 1: Incorrect API key")
      return {
        success: false,
        message: "Incorrect API key configured",
        keyVerification,
      }
    }

    if (!resend) {
      console.error("❌ Test failed at Step 1: Resend not initialized")
      return {
        success: false,
        message: "Resend SDK not initialized",
        keyVerification,
      }
    }

    console.log("✅ Test Step 1 completed: Configuration verified")

    // Step 2: Prepare test email
    console.log("🧪 Test Step 2: Preparing test email...")
    const testEmailData = {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
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
    }

    console.log("🧪 Test email data:", {
      from: testEmailData.from,
      to: testEmailData.to,
      subject: testEmailData.subject,
      hasHtml: !!testEmailData.html,
    })

    console.log("✅ Test Step 2 completed: Test email prepared")

    // Step 3: Send test email
    console.log("🧪 Test Step 3: Sending test email...")
    console.log("🧪 About to call resend.emails.send() for test...")

    const testResult = await resend.emails.send(testEmailData)

    console.log("✅ Test Step 3 completed: Test email sent successfully!")
    console.log("🧪 Test result:", JSON.stringify(testResult, null, 2))

    return {
      success: true,
      message: "Email configuration is valid and test email sent",
      keyVerification,
      testResult,
    }
  } catch (error) {
    console.error("❌ Email configuration test failed:")
    console.error("❌ Error type:", typeof error)
    console.error("❌ Error constructor:", error instanceof Error ? error.constructor.name : "Unknown")

    if (error instanceof Error) {
      console.error("❌ Error name:", error.name)
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
    } else {
      console.error("❌ Non-Error object thrown:", error)
    }

    return {
      success: false,
      message: "Email configuration test failed",
      error: error instanceof Error ? error.message : String(error),
      keyVerification: verifyApiKey(),
    }
  }
}
