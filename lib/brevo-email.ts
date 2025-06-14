const SibApiV3Sdk = require("sib-api-v3-sdk")

// Initialize Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKeyAuth = defaultClient.authentications["api-key"] // Corrected authentication key name
apiKeyAuth.apiKey = process.env.BREVO_API_KEY || ""

// Default sender/recipient for tests or specific cases if needed
const DEFAULT_SENDER_EMAIL = "noreply@euronegocetrade.com"
const DEFAULT_SENDER_NAME = "Euro Negoce Trade System"
const DEFAULT_RECIPIENT_EMAIL = "contact@euronegocetrade.com"

export function verifyBrevoApiKey() {
  console.log("🔑 Verifying Brevo API key...")
  const hasApiKey = !!process.env.BREVO_API_KEY
  const keyLength = process.env.BREVO_API_KEY?.length || 0
  const keyPrefix = process.env.BREVO_API_KEY?.substring(0, 12) + "..." || "none"
  const verification = {
    hasApiKey,
    keyLength,
    keyPrefix,
    message: hasApiKey ? "✅ Brevo API key is loaded" : "❌ Brevo API key is missing",
    brevoInitialized: hasApiKey,
  }
  console.log("🔑 Brevo API Key verification result:", verification)
  return verification
}

interface EmailAddress {
  email: string
  name?: string
}

interface SendTransactionalEmailParams {
  sender: EmailAddress
  to: EmailAddress[]
  subject: string
  htmlContent: string
  textContent?: string
  replyTo?: EmailAddress
  // Add other Brevo options like bcc, cc, headers, params, tags etc. if needed
}

export async function sendTransactionalEmail({
  sender,
  to,
  subject,
  htmlContent,
  textContent,
  replyTo,
}: SendTransactionalEmailParams) {
  console.log("📧 Starting Brevo transactional email send process...")

  try {
    console.log("📧 Step 1: Verifying Brevo configuration...")
    const keyVerification = verifyBrevoApiKey()
    if (!keyVerification.hasApiKey) {
      const error = `Brevo API key verification failed: ${keyVerification.message}`
      console.error("❌ Step 1 failed:", error)
      throw new Error(error)
    }
    console.log("✅ Step 1 completed: Brevo configuration verified")

    console.log("📧 Step 2: Initializing Brevo API...")
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    console.log("✅ Step 2 completed: Brevo API initialized")

    console.log("📧 Step 3: Preparing email data...")
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.sender = sender
    sendSmtpEmail.to = to
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = htmlContent
    if (textContent) {
      sendSmtpEmail.textContent = textContent
    }
    if (replyTo) {
      sendSmtpEmail.replyTo = replyTo
    }

    console.log("📧 Email data prepared:", {
      sender: sender,
      to: to,
      subject: subject,
      hasHtml: !!htmlContent,
      htmlLength: htmlContent?.length || 0,
      hasText: !!textContent,
      hasReplyTo: !!replyTo,
    })
    console.log("✅ Step 3 completed: Email data prepared")

    console.log("📧 Step 4: Sending email via Brevo API...")
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log("✅ Step 4 completed: Email sent successfully!")
    console.log("📧 Brevo response:", JSON.stringify(response, null, 2))

    return {
      success: true,
      data: response, // Brevo response often includes messageId etc.
    }
  } catch (error: any) {
    console.error("❌ Brevo email sending failed:")
    console.error("❌ Error type:", typeof error)
    console.error("❌ Error constructor:", error instanceof Error ? error.constructor.name : "Unknown")

    let errorMessage = "Unknown error during email sending"
    if (error instanceof Error) {
      console.error("❌ Error name:", error.name)
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
      errorMessage = error.message
    } else {
      console.error("❌ Non-Error object thrown:", error)
      errorMessage = String(error)
    }

    // Brevo often returns error details in error.response.body or error.body
    if (error.response && error.response.body) {
      console.error("❌ Brevo API Error Body:", JSON.stringify(error.response.body, null, 2))
      errorMessage = error.response.body.message || errorMessage
    } else if (error.body) {
      console.error("❌ Brevo API Error Body (fallback):", JSON.stringify(error.body, null, 2))
      errorMessage = error.body.message || errorMessage
    }

    if (error && typeof error === "object" && "status" in error) {
      console.error("❌ Status code:", error.status)
    }

    throw new Error(`Brevo email sending failed: ${errorMessage}`)
  }
}

export async function testBrevoEmailConfig() {
  console.log("🧪 Starting Brevo email configuration test...")
  try {
    console.log("🧪 Test Step 1: Verifying Brevo configuration...")
    const keyVerification = verifyBrevoApiKey()
    if (!keyVerification.hasApiKey) {
      console.error("❌ Test failed at Step 1: Missing Brevo API key")
      return {
        success: false,
        message: "Brevo API key not configured",
        keyVerification,
      }
    }
    console.log("✅ Test Step 1 completed: Configuration verified")

    console.log("🧪 Test Step 2: Preparing test email...")
    const testEmailData: SendTransactionalEmailParams = {
      sender: { email: DEFAULT_SENDER_EMAIL, name: DEFAULT_SENDER_NAME },
      to: [{ email: DEFAULT_RECIPIENT_EMAIL, name: "Test Recipient" }],
      subject: `🧪 Brevo Email Test - ${new Date().toISOString()}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a;">✅ Brevo Email System Test Successful!</h2>
          <p>This test email confirms that your email system is working correctly with the Brevo API.</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>API Status:</strong> ${keyVerification.message}</li>
              <li><strong>From Email:</strong> ${DEFAULT_SENDER_EMAIL}</li>
              <li><strong>To Email:</strong> ${DEFAULT_RECIPIENT_EMAIL}</li>
              <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Email Service:</strong> Brevo (formerly Sendinblue)</li>
            </ul>
          </div>
          <p style="color: #059669;">If you receive this email, your Brevo email system is working correctly! 🎉</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            This email was sent from your Euro Negoce website's Brevo email testing system.
          </p>
        </div>
      `,
    }
    console.log("✅ Test Step 2 completed: Test email prepared")

    console.log("🧪 Test Step 3: Sending test email...")
    const testResult = await sendTransactionalEmail(testEmailData)
    console.log("✅ Test Step 3 completed: Test email sent successfully!")

    return {
      success: true,
      message: "Brevo email configuration is valid and test email sent",
      keyVerification,
      testResult,
    }
  } catch (error: any) {
    console.error("❌ Brevo email configuration test failed:")
    if (error instanceof Error) {
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
    }
    return {
      success: false,
      message: `Brevo email configuration test failed: ${error.message || String(error)}`,
      error: error instanceof Error ? error.message : String(error),
      keyVerification: verifyBrevoApiKey(),
    }
  }
}
