import * as SibApiV3Sdk from "sib-api-v3-sdk"

// Initialize Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications["api-key"]
apiKey.apiKey = process.env.BREVO_API_KEY || ""

// Email configuration
const FROM_EMAIL = "contact@euronegocetrade.com"
const FROM_NAME = "Euro Negoce Trade"
const TO_EMAIL = "contact@euronegocetrade.com"

// Function to verify the API key is loaded
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

export async function sendBrevoEmail({
  to = TO_EMAIL,
  from = FROM_EMAIL,
  fromName = FROM_NAME,
  subject,
  htmlContent,
  textContent,
  replyTo,
}: {
  to?: string
  from?: string
  fromName?: string
  subject: string
  htmlContent: string
  textContent?: string
  replyTo?: string
}) {
  console.log("📧 Starting Brevo email send process...")

  try {
    // Step 1: Verify API key
    console.log("📧 Step 1: Verifying Brevo configuration...")
    const keyVerification = verifyBrevoApiKey()

    if (!keyVerification.hasApiKey) {
      const error = `Brevo API key verification failed: ${keyVerification.message}`
      console.error("❌ Step 1 failed:", error)
      throw new Error(error)
    }

    console.log("✅ Step 1 completed: Brevo configuration verified")

    // Step 2: Initialize Brevo API instance
    console.log("📧 Step 2: Initializing Brevo API...")
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    console.log("✅ Step 2 completed: Brevo API initialized")

    // Step 3: Prepare email data
    console.log("📧 Step 3: Preparing email data...")
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.sender = { name: fromName, email: from }
    sendSmtpEmail.to = [{ email: to }]
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = htmlContent

    if (textContent) {
      sendSmtpEmail.textContent = textContent
    }

    if (replyTo) {
      sendSmtpEmail.replyTo = { email: replyTo }
    }

    console.log("📧 Email data prepared:", {
      from: `${fromName} <${from}>`,
      to: to,
      subject: subject,
      hasHtml: !!htmlContent,
      htmlLength: htmlContent?.length || 0,
      hasText: !!textContent,
      hasReplyTo: !!replyTo,
    })

    console.log("✅ Step 3 completed: Email data prepared")

    // Step 4: Send email using Brevo API
    console.log("📧 Step 4: Sending email via Brevo API...")
    console.log("📧 About to call apiInstance.sendTransacEmail()...")

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)

    console.log("✅ Step 4 completed: Email sent successfully!")
    console.log("📧 Brevo response:", JSON.stringify(response, null, 2))

    return {
      success: true,
      data: {
        id: response.messageId,
        messageId: response.messageId,
      },
    }
  } catch (error) {
    console.error("❌ Brevo email sending failed:")
    console.error("❌ Error type:", typeof error)
    console.error("❌ Error constructor:", error instanceof Error ? error.constructor.name : "Unknown")

    if (error instanceof Error) {
      console.error("❌ Error name:", error.name)
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
    } else {
      console.error("❌ Non-Error object thrown:", error)
    }

    // Additional debugging for Brevo-specific errors
    if (error && typeof error === "object" && "response" in error) {
      console.error("❌ Brevo API Response error:", error.response)
    }

    if (error && typeof error === "object" && "status" in error) {
      console.error("❌ Status code:", error.status)
    }

    // Re-throw with more context
    throw new Error(`Brevo email sending failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Enhanced test function for Brevo
export async function testBrevoEmailConfig() {
  console.log("🧪 Starting Brevo email configuration test...")

  try {
    // Step 1: Verify configuration
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

    // Step 2: Prepare test email
    console.log("🧪 Test Step 2: Preparing test email...")
    const testEmailData = {
      to: TO_EMAIL,
      subject: `🧪 Brevo Email Test - ${new Date().toISOString()}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a;">✅ Brevo Email System Test Successful!</h2>
          <p>This test email confirms that your email system is working correctly with the Brevo API.</p>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>API Status:</strong> ${keyVerification.message}</li>
              <li><strong>From Email:</strong> ${FROM_EMAIL}</li>
              <li><strong>To Email:</strong> ${TO_EMAIL}</li>
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

    // Step 3: Send test email
    console.log("🧪 Test Step 3: Sending test email...")
    const testResult = await sendBrevoEmail(testEmailData)

    console.log("✅ Test Step 3 completed: Test email sent successfully!")

    return {
      success: true,
      message: "Brevo email configuration is valid and test email sent",
      keyVerification,
      testResult,
    }
  } catch (error) {
    console.error("❌ Brevo email configuration test failed:")

    if (error instanceof Error) {
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
    }

    return {
      success: false,
      message: "Brevo email configuration test failed",
      error: error instanceof Error ? error.message : String(error),
      keyVerification: verifyBrevoApiKey(),
    }
  }
}
