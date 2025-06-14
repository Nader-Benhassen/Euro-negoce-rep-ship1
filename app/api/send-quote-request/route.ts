import { NextResponse } from "next/server"
import { sendBrevoEmailFetch } from "@/lib/brevo-fetch"
import { saveContact, logEmail } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const { name, email, company, phone, message, selected_product } = formData

    // 1. Save to database
    const { data: contactData, error: dbError } = await saveContact({
      name,
      email,
      company,
      phone,
      message,
      selected_product,
    })
    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    // 2. Send email via Brevo
    const subject = `New Quote Request for ${selected_product} from ${name}`
    const htmlContent = `<p>Name: ${name}</p><p>Email: ${email}</p><p>Company: ${company}</p><p>Phone: ${phone}</p><p>Product: ${selected_product}</p><p>Message: ${message}</p>`
    const emailResult = await sendBrevoEmailFetch({
      to: "contact@euronegocetrade.com",
      subject,
      htmlContent,
      replyTo: email,
    })

    // 3. Log email status
    await logEmail({
      email_type: "quote_request",
      recipient_email: "contact@euronegocetrade.com",
      subject,
      status: emailResult.success ? "sent" : "failed",
      brevo_email_id: emailResult.data?.id || null,
      related_contact_id: contactData?.id,
    })

    if (!emailResult.success) {
      console.error("Failed to send quote request email via Brevo:", emailResult.error)
      return NextResponse.json({ message: "Quote request submitted, but notification email failed." }, { status: 200 })
    }

    return NextResponse.json({ message: "Quote request submitted successfully!" })
  } catch (error) {
    console.error("Error handling quote request:", error)
    return NextResponse.json({ error: "Failed to process quote request." }, { status: 500 })
  }
}
