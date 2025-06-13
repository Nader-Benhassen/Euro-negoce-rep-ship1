// Alternative Brevo implementation using fetch API
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
const FROM_EMAIL = "contact@euronegocetrade.com"
const FROM_NAME = "Euro Negoce Trade"
const TO_EMAIL = "contact@euronegocetrade.com"

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

export async function sendBrevoEmailFetch({
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
  console.log("📧 Starting Brevo email send process via Fetch API...")

  try {
    // Step 1: Verify API key
    const keyVerification = verifyBrevoApiKey()
    if (!keyVerification.hasApiKey) {
      throw new Error(`Brevo API key verification failed: ${keyVerification.message}`)
    }

    // Step 2: Prepare email payload
    const emailPayload = {
      sender: { name: fromName, email: from },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
      ...(textContent && { textContent }),
      ...(replyTo && { replyTo: { email: replyTo } }),
    }

    console.log("📧 Email payload prepared:", {
      from: `${fromName} <${from}>`,
      to: to,
      subject: subject,
      hasHtml: !!htmlContent,
      hasReplyTo: !!replyTo,
    })

    // Step 3: Send email via Brevo API
    console.log("📧 Sending email via Brevo Fetch API...")

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify(emailPayload),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("❌ Brevo API Error Response:", errorData)
      throw new Error(`Brevo API Error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()
    console.log("✅ Email sent successfully via Brevo Fetch API!")
    console.log("📧 Brevo response:", result)

    return {
      success: true,
      data: {
        id: result.messageId,
        messageId: result.messageId,
      },
    }
  } catch (error) {
    console.error("❌ Brevo email sending failed:")

    if (error instanceof Error) {
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
    }

    throw new Error(`Brevo email sending failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}
