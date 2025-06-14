// Brevo email implementation using fetch API
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
const FROM_EMAIL = "contact@euronegocetrade.com"
const FROM_NAME = "Euro Negoce Trade"
const TO_EMAIL = "contact@euronegocetrade.com" // Default TO for some functions

export function verifyBrevoApiKey() {
  // console.log("🔑 Verifying Brevo API key...") // Keep console logs minimal
  const hasApiKey = !!process.env.BREVO_API_KEY
  const verification = {
    hasApiKey,
    keyLength: process.env.BREVO_API_KEY?.length || 0,
    keyPrefix: process.env.BREVO_API_KEY?.substring(0, 12) + "..." || "none",
    message: hasApiKey ? "✅ Brevo API key is loaded." : "❌ Brevo API key is missing.",
    brevoInitialized: hasApiKey, // Simple check for presence
  }
  // console.log("🔑 Brevo API Key verification result:", verification)
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
  // console.log("📧 Starting Brevo email send process...")
  const keyVerification = verifyBrevoApiKey()
  if (!keyVerification.hasApiKey) {
    throw new Error(`Brevo API key verification failed: ${keyVerification.message}`)
  }

  const emailPayload = {
    sender: { name: fromName, email: from },
    to: [{ email: to }], // Brevo expects an array for 'to'
    subject: subject,
    htmlContent: htmlContent,
    ...(textContent && { textContent }),
    ...(replyTo && { replyTo: { email: replyTo } }),
  }

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
  // console.log("✅ Email sent successfully via Brevo API. Brevo response:", result)
  return { success: true, data: { id: result.messageId, messageId: result.messageId } }
}
