import { NextResponse } from "next/server"
import { sendBrevoEmailFetch } from "@/lib/brevo-fetch"
import { saveQuoteRequest, logEmail, type QuoteRequestData } from "@/lib/database" // Correct: only imports what's needed

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  console.log("💰 QUOTE_REQUEST: Submission started")
  let quoteRequestIdForLog: string | null = null
  let dbSaveSuccessful = false
  let dbErrorMessage: string | null = null

  try {
    const formData = (await request.json()) as QuoteRequestData // Cast to ensure type
    const { name, email, company, phone, product, quantity, delivery_location, message } = formData
    console.log("💰 QUOTE_REQUEST: Raw form data received:", JSON.stringify(formData, null, 2))

    if (
      !name?.trim() ||
      !email?.trim() ||
      !email.includes("@") ||
      !product?.trim() ||
      !quantity?.trim() ||
      !delivery_location?.trim()
    ) {
      console.error(
        "💰 QUOTE_REQUEST: Validation failed. Name, email, product, quantity, delivery location are required.",
      )
      return NextResponse.json(
        {
          success: false,
          error: "Name, valid email, product, quantity, and delivery location are required.",
        },
        { status: 400 },
      )
    }
    console.log("💰 QUOTE_REQUEST: Form data validated.")

    const sanitizedData: QuoteRequestData = {
      name: String(name).trim(),
      email: String(email).trim(),
      company: company ? String(company).trim() : null,
      phone: phone ? String(phone).trim() : null,
      product: String(product).trim(),
      quantity: String(quantity).trim(),
      delivery_location: String(delivery_location).trim(),
      message: message ? String(message).trim() : null,
    }
    console.log("💰 QUOTE_REQUEST: Form data sanitized.")

    console.log("💰 QUOTE_REQUEST: Attempting to save quote request to database...")
    try {
      const quoteResult = await saveQuoteRequest(sanitizedData) // This function uses getSupabaseServerClient internally
      if (quoteResult.success && quoteResult.data?.id) {
        quoteRequestIdForLog = quoteResult.data.id
        dbSaveSuccessful = true
        console.log("💰 QUOTE_REQUEST: Quote request saved to database. Quote ID:", quoteRequestIdForLog)
      } else {
        dbErrorMessage = quoteResult.error?.message || "Unknown DB error during saveQuoteRequest"
        console.error("💰 QUOTE_REQUEST: Database error saving quote request:", dbErrorMessage)
      }
    } catch (dbCatchError: any) {
      dbErrorMessage = dbCatchError.message || "Exception during saveQuoteRequest"
      console.error("💰 QUOTE_REQUEST: Exception occurred while saving quote request:", dbErrorMessage)
    }

    const emailSubject = `New Quote Request for ${sanitizedData.product} from ${sanitizedData.name}`
    const htmlContent = `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${sanitizedData.name}</p>
      <p><strong>Email (Reply-To):</strong> ${sanitizedData.email}</p>
      <p><strong>Company:</strong> ${sanitizedData.company || "N/A"}</p>
      <p><strong>Phone:</strong> ${sanitizedData.phone || "N/A"}</p>
      <p><strong>Product:</strong> ${sanitizedData.product}</p>
      <p><strong>Quantity:</strong> ${sanitizedData.quantity}</p>
      <p><strong>Delivery Location:</strong> ${sanitizedData.delivery_location}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedData.message || "N/A"}</p>
    `
    const recipientEmail = "contact@euronegocetrade.com"

    console.log(
      `💰 QUOTE_REQUEST: Attempting to send notification to ${recipientEmail} for ${sanitizedData.name} (${sanitizedData.email})`,
    )
    const emailResult = await sendBrevoEmailFetch({
      to: recipientEmail,
      subject: emailSubject,
      htmlContent,
      replyTo: sanitizedData.email,
    })
    console.log("💰 QUOTE_REQUEST: Brevo email send attempt result:", emailResult)

    console.log("💰 QUOTE_REQUEST: Logging email attempt status to database...")
    const emailLogStatusToSave = emailResult.success ? "sent" : "failed"
    const brevoMessageId = emailResult.data?.id || null

    const dbLogEmailOp = await logEmail({
      // This function uses getSupabaseServerClient internally
      email_type: "quote_request_submission",
      recipient_email: recipientEmail,
      subject: emailSubject,
      status: emailLogStatusToSave,
      resend_email_id: brevoMessageId,
      related_quote_id: quoteRequestIdForLog,
      error_message: emailResult.success ? null : emailResult.error,
    })
    console.log("💰 QUOTE_REQUEST: Email log database operation status:", dbLogEmailOp)
    if (!dbLogEmailOp.success) {
      console.error("💰 QUOTE_REQUEST: Failed to log email status to database. Error:", dbLogEmailOp.error?.message)
    }

    if (!emailResult.success) {
      console.error("💰 QUOTE_REQUEST: Notification email FAILED. Brevo error:", emailResult.error)
      const responseMessage = dbSaveSuccessful
        ? "Quote request submitted and details saved, but notification email failed. We will contact you."
        : `Failed to save quote request (DB Error: ${dbErrorMessage}) AND notification email failed (Email Error: ${emailResult.error}). Please try again or contact support.`
      const responseStatus = dbSaveSuccessful ? 207 : 500
      return NextResponse.json(
        { message: responseMessage, quoteId: quoteRequestIdForLog, emailSent: false, dbSaved: dbSaveSuccessful },
        { status: responseStatus },
      )
    }

    if (!dbSaveSuccessful) {
      console.warn(
        `💰 QUOTE_REQUEST: Notification email SENT, but failed to save quote request to DB. DB Error: ${dbErrorMessage}`,
      )
      return NextResponse.json(
        {
          message:
            "Your quote request notification has been sent, but there was an issue saving all details. We will contact you.",
          quoteId: null,
          emailSent: true,
          dbSaved: false,
        },
        { status: 207 },
      )
    }

    console.log("💰 QUOTE_REQUEST: Quote request submitted successfully and notification sent!")
    return NextResponse.json({
      message: "Quote request submitted successfully!",
      quoteId: quoteRequestIdForLog,
      emailSent: true,
      dbSaved: true,
    })
  } catch (error: any) {
    console.error("💰 QUOTE_REQUEST: CRITICAL UNHANDLED ERROR:", error.message, error.stack)
    return NextResponse.json(
      { error: "Failed to process quote request due to an unexpected server error." },
      { status: 500 },
    )
  }
}
