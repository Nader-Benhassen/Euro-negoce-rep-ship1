import { NextResponse } from "next/server"
import { sendBrevoEmailFetch } from "@/lib/brevo-fetch"
import { saveContact, logEmail } from "@/lib/database" // Correct: only imports what's needed

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const startTime = Date.now()
  console.log("✉️ CONTACT_FORM: Submission started at:", new Date().toISOString())
  let contactIdForLog: string | null = null
  let dbSaveSuccessful = false
  let dbErrorMessage: string | null = null

  try {
    const formData = await request.json()
    const { name, email, company, phone, message } = formData // Assuming selected_product is not used here
    console.log("✉️ CONTACT_FORM: Raw form data received:", JSON.stringify(formData, null, 2))

    if (!name?.trim() || !email?.trim() || !email.includes("@") || !message?.trim()) {
      console.error("✉️ CONTACT_FORM: Validation failed. Name, valid email, and message are required.")
      return NextResponse.json(
        { success: false, error: "Name, valid email, and message are required." },
        { status: 400 },
      )
    }
    console.log("✉️ CONTACT_FORM: Form data validated.")

    const sanitizedData = {
      name: String(name).trim(),
      email: String(email).trim(),
      company: company ? String(company).trim() : null,
      phone: phone ? String(phone).trim() : null,
      message: String(message).trim(),
      selected_product: null, // Explicitly null if not used
    }
    console.log("✉️ CONTACT_FORM: Form data sanitized.")

    console.log("✉️ CONTACT_FORM: Attempting to save contact to database...")
    try {
      const contactResult = await saveContact(sanitizedData) // This function uses getSupabaseServerClient internally
      if (contactResult.success && contactResult.data?.id) {
        contactIdForLog = contactResult.data.id
        dbSaveSuccessful = true
        console.log("✉️ CONTACT_FORM: Contact saved to database. Contact ID:", contactIdForLog)
      } else {
        dbErrorMessage = contactResult.error?.message || "Unknown DB error during saveContact"
        console.error("✉️ CONTACT_FORM: Database error saving contact:", dbErrorMessage)
      }
    } catch (dbCatchError: any) {
      dbErrorMessage = dbCatchError.message || "Exception during saveContact"
      console.error("✉️ CONTACT_FORM: Exception occurred while saving contact:", dbErrorMessage)
    }

    const emailSubject = `New Contact Form Submission from ${sanitizedData.name}`
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${sanitizedData.name}</p>
      <p><strong>Email (Reply-To):</strong> ${sanitizedData.email}</p>
      <p><strong>Company:</strong> ${sanitizedData.company || "N/A"}</p>
      <p><strong>Phone:</strong> ${sanitizedData.phone || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedData.message}</p>
    `
    const recipientEmail = "contact@euronegocetrade.com"

    console.log(
      `✉️ CONTACT_FORM: Attempting to send notification to ${recipientEmail} for ${sanitizedData.name} (${sanitizedData.email})`,
    )
    const emailResult = await sendBrevoEmailFetch({
      to: recipientEmail,
      subject: emailSubject,
      htmlContent,
      replyTo: sanitizedData.email,
    })
    console.log("✉️ CONTACT_FORM: Brevo email send attempt result:", emailResult)

    console.log("✉️ CONTACT_FORM: Logging email attempt status to database...")
    const emailLogStatusToSave = emailResult.success ? "sent" : "failed"
    const brevoMessageId = emailResult.data?.id || null

    const dbLogEmailOp = await logEmail({
      // This function uses getSupabaseServerClient internally
      email_type: "contact_form_submission",
      recipient_email: recipientEmail,
      subject: emailSubject,
      status: emailLogStatusToSave,
      resend_email_id: brevoMessageId,
      related_contact_id: contactIdForLog,
      error_message: emailResult.success ? null : emailResult.error,
    })
    console.log("✉️ CONTACT_FORM: Email log database operation status:", dbLogEmailOp)
    if (!dbLogEmailOp.success) {
      console.error("✉️ CONTACT_FORM: Failed to log email status to database. Error:", dbLogEmailOp.error?.message)
    }

    const totalTime = Date.now() - startTime
    console.log(`✉️ CONTACT_FORM: Processing completed in ${totalTime}ms.`)

    if (!emailResult.success) {
      console.error("✉️ CONTACT_FORM: Notification email FAILED. Brevo error:", emailResult.error)
      const responseMessage = dbSaveSuccessful
        ? "Form submitted and details saved, but notification email failed. We will contact you."
        : `Failed to save form details (DB Error: ${dbErrorMessage}) AND notification email failed (Email Error: ${emailResult.error}). Please try again or contact support.`
      const responseStatus = dbSaveSuccessful ? 207 : 500
      return NextResponse.json(
        { message: responseMessage, contactId: contactIdForLog, emailSent: false, dbSaved: dbSaveSuccessful },
        { status: responseStatus },
      )
    }

    if (!dbSaveSuccessful) {
      console.warn(
        `✉️ CONTACT_FORM: Notification email SENT, but failed to save contact details to DB. DB Error: ${dbErrorMessage}`,
      )
      return NextResponse.json(
        {
          message:
            "Your contact request notification has been sent, but there was an issue saving all details. We will contact you.",
          contactId: null,
          emailSent: true,
          dbSaved: false,
        },
        { status: 207 },
      )
    }

    console.log("✉️ CONTACT_FORM: Contact form submitted successfully and notification sent!")
    return NextResponse.json({
      message: "Contact form submitted successfully!",
      contactId: contactIdForLog,
      emailSent: true,
      dbSaved: true,
    })
  } catch (error: any) {
    console.error("✉️ CONTACT_FORM: CRITICAL UNHANDLED ERROR:", error.message, error.stack)
    return NextResponse.json(
      { error: "Failed to process contact form due to an unexpected server error." },
      { status: 500 },
    )
  }
}
