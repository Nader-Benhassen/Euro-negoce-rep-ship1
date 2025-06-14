import { NextResponse } from "next/server"
import { sendBrevoEmailFetch } from "@/lib/brevo-fetch"
import { saveContact, logEmail } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const startTime = Date.now()
  console.log("🚀 Contact form submission started at:", new Date().toISOString())

  try {
    // Step 1: Parse and validate form data
    console.log("🚀 Step 1: Parsing form data...")
    const formData = await request.json()
    const { name, email, company, phone, message } = formData
    console.log("🚀 Raw form data received:", JSON.stringify(formData, null, 2))

    // Validation - Removed Brevo Key Verification

    if (!name?.trim()) {
      console.error("❌ Step 1 failed: Name validation failed")
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    if (!email?.trim() || !email.includes("@")) {
      console.error("❌ Step 1 failed: Email validation failed")
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
    }

    if (!message?.trim()) {
      console.error("❌ Step 1 failed: Message validation failed")
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    console.log("✅ Step 1 completed: Form data validated")

    // Step 2: Sanitize inputs
    console.log("🚀 Step 2: Sanitizing form data...")
    const sanitizedData = {
      name: String(name).trim().replace(/[<>]/g, ""),
      email: String(email).trim().replace(/[<>]/g, ""),
      company: company ? String(company).trim().replace(/[<>]/g, "") : "",
      phone: phone ? String(phone).trim().replace(/[<>]/g, "") : "",
      message: String(message).trim().replace(/[<>]/g, ""),
      product: "", //selectedProduct ? String(selectedProduct).trim().replace(/[<>]/g, "") : "", // Removed selectedProduct
    }

    console.log("✅ Step 2 completed: Form data sanitized")

    // Step 3: Save to database
    console.log("🚀 Step 3: Saving contact to database...")
    const contactResult = await saveContact({
      name: sanitizedData.name,
      email: sanitizedData.email,
      company: sanitizedData.company || null,
      phone: sanitizedData.phone || null,
      message: sanitizedData.message,
      selected_product: null, //sanitizedData.product || null, // Removed selectedProduct
    })

    if (!contactResult.success) {
      console.error("❌ Step 3 failed: Database save failed:", contactResult.error)
      // Continue with email sending even if database fails
    } else {
      console.log("✅ Step 3 completed: Contact saved to database with ID:", contactResult.data?.id)
    }

    // Step 4: Send email via Brevo
    const emailResult = await sendBrevoEmailFetch({
      to: "contact@euronegocetrade.com",
      subject: `New Contact Form Submission from ${name}`,
      htmlContent: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Company: ${company}</p><p>Phone: ${phone}</p><p>Message: ${message}</p>`,
      replyTo: email,
    })

    // Step 5: Log email status
    await logEmail({
      email_type: "contact_form",
      recipient_email: "contact@euronegocetrade.com",
      subject: `New Contact Form Submission from ${name}`,
      status: emailResult.success ? "sent" : "failed",
      brevo_email_id: emailResult.data?.id || null,
      related_contact_id: contactResult.data?.id,
    })

    if (!emailResult.success) {
      // Still return success to user, but log the error
      console.error("Failed to send contact email via Brevo:", emailResult.error)
      return NextResponse.json({ message: "Form submitted, but notification email failed." }, { status: 200 })
    }

    const totalTime = Date.now() - startTime
    console.log(`🎉 Contact form submission completed successfully in ${totalTime}ms`)

    return NextResponse.json({ message: "Contact form submitted successfully!" })
  } catch (error) {
    console.error("Error handling contact form:", error)
    return NextResponse.json({ error: "Failed to process contact form." }, { status: 500 })
  }
}
