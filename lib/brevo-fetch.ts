// Brevo email implementation using fetch API
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
const FROM_EMAIL = "contact@euronegocetrade.com" // Your verified sender email
const FROM_NAME = "Euro Negoce Trade"
const TO_EMAIL = "contact@euronegocetrade.com" // Default TO for internal notifications

export function verifyBrevoApiKey() {
  const hasApiKey = !!process.env.BREVO_API_KEY
  const verification = {
    hasApiKey,
    keyLength: process.env.BREVO_API_KEY?.length || 0,
    keyPrefix: process.env.BREVO_API_KEY?.substring(0, 12) + "..." || "none",
    message: hasApiKey ? "✅ Brevo API key is loaded." : "❌ Brevo API key is missing.",
    brevoInitialized: hasApiKey,
  }
  return verification
}

// Basic function to strip HTML tags for a plain text version
function stripHtml(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>?/gm, "")
}

export async function sendBrevoEmailFetch({
  to = TO_EMAIL,
  from = FROM_EMAIL,
  fromName = FROM_NAME,
  subject,
  htmlContent,
  textContent, // Allow explicit textContent
  replyTo, // This should be the submitter's email for contact/quote forms
}: {
  to?: string
  from?: string
  fromName?: string
  subject: string
  htmlContent: string
  textContent?: string
  replyTo?: string
}) {
  const keyVerification = verifyBrevoApiKey()
  if (!keyVerification.hasApiKey) {
    const errorMessage = `Brevo API key verification failed: ${keyVerification.message}`
    console.error("BREVO_FETCH:", errorMessage)
    return { success: false, error: errorMessage, data: null }
  }

  const effectiveTextContent = textContent || stripHtml(htmlContent)

  const emailPayload: {
    sender: { name: string; email: string }
    to: { email: string }[]
    subject: string
    htmlContent: string
    textContent: string
    replyTo?: { email: string; name?: string }
  } = {
    sender: { name: fromName, email: from },
    to: [{ email: to }],
    subject: subject,
    htmlContent: htmlContent,
    textContent: effectiveTextContent,
  }

  if (replyTo) {
    emailPayload.replyTo = { email: replyTo }
  }

  try {
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
      console.error("❌ BREVO_FETCH: Brevo API Error Response:", {
        status: response.status,
        body: errorData,
        to,
        subject,
      })
      return { success: false, error: `Brevo API Error: ${response.status} - ${errorData}`, data: null }
    }

    const result = await response.json()
    // console.log("✅ BREVO_FETCH: Email sent successfully via Brevo API. Brevo response:", result);
    return {
      success: true,
      data: { id: result.messageId || result.messageID, messageId: result.messageId || result.messageID }, // Brevo sometimes uses messageID
      error: null,
    }
  } catch (error: any) {
    console.error("❌ BREVO_FETCH: Error sending email via Brevo Fetch:", { error: error.message, to, subject })
    return { success: false, error: error.message || "Unknown error during fetch.", data: null }
  }
}
