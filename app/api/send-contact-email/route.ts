import { NextResponse } from "next/server"
import { sendBrevoEmailFetch, verifyBrevoApiKey } from "@/lib/brevo-fetch"
import { saveContact, logEmail } from "@/lib/database"

export async function POST(request: Request) {
  const startTime = Date.now()
  console.log("🚀 Contact form submission started at:", new Date().toISOString())

  try {
    // Step 1: Verify Brevo API key first
    console.log("🚀 Step 1: Verifying Brevo API key configuration...")
    const keyVerification = verifyBrevoApiKey()

    if (!keyVerification.hasApiKey || !keyVerification.brevoInitialized) {
      console.error("❌ Step 1 failed: Brevo email service not properly configured")
      console.error("❌ Key verification details:", keyVerification)

      return NextResponse.json(
        {
          success: false,
          error: "Email service configuration error. Please contact support.",
          debug: {
            keyVerification,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 500 },
      )
    }

    console.log("✅ Step 1 completed: Brevo API key verified")

    // Step 2: Parse and validate form data
    console.log("🚀 Step 2: Parsing form data...")
    const body = await request.json()
    console.log("🚀 Raw form data received:", JSON.stringify(body, null, 2))

    const { name, email, company, phone, message, selectedProduct } = body

    // Validation
    if (!name?.trim()) {
      console.error("❌ Step 2 failed: Name validation failed")
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    if (!email?.trim() || !email.includes("@")) {
      console.error("❌ Step 2 failed: Email validation failed")
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
    }

    if (!message?.trim()) {
      console.error("❌ Step 2 failed: Message validation failed")
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    console.log("✅ Step 2 completed: Form data validated")

    // Step 3: Sanitize inputs
    console.log("🚀 Step 3: Sanitizing form data...")
    const sanitizedData = {
      name: String(name).trim().replace(/[<>]/g, ""),
      email: String(email).trim().replace(/[<>]/g, ""),
      company: company ? String(company).trim().replace(/[<>]/g, "") : "",
      phone: phone ? String(phone).trim().replace(/[<>]/g, "") : "",
      message: String(message).trim().replace(/[<>]/g, ""),
      product: selectedProduct ? String(selectedProduct).trim().replace(/[<>]/g, "") : "",
    }

    console.log("✅ Step 3 completed: Form data sanitized")

    // Step 4: Save to database
    console.log("🚀 Step 4: Saving contact to database...")
    const contactResult = await saveContact({
      name: sanitizedData.name,
      email: sanitizedData.email,
      company: sanitizedData.company || null,
      phone: sanitizedData.phone || null,
      message: sanitizedData.message,
      selected_product: sanitizedData.product || null,
    })

    if (!contactResult.success) {
      console.error("❌ Step 4 failed: Database save failed:", contactResult.error)
      // Continue with email sending even if database fails
    } else {
      console.log("✅ Step 4 completed: Contact saved to database with ID:", contactResult.data?.id)
    }

    // Step 5: Create email content
    console.log("🚀 Step 5: Creating email content...")
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">🔔 New Contact Form Submission</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Euro Negoce Trade Website</p>
        </div>
        
        <div style="padding: 20px;">
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px 0;">${sanitizedData.name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${sanitizedData.email}" style="color: #16a34a;">${sanitizedData.email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Company:</td><td style="padding: 8px 0;">${sanitizedData.company || "Not provided"}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${sanitizedData.phone || "Not provided"}</td></tr>
              ${sanitizedData.product ? `<tr><td style="padding: 8px 0; font-weight: bold;">Product Interest:</td><td style="padding: 8px 0;">${sanitizedData.product}</td></tr>` : ""}
            </table>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">💬 Message</h3>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #16a34a;">
              <p style="white-space: pre-wrap; margin: 0; line-height: 1.5;">${sanitizedData.message}</p>
            </div>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #0369a1; font-size: 12px;">
              <strong>📊 Submission Details:</strong><br>
              Timestamp: ${new Date().toLocaleString()}<br>
              Contact ID: ${contactResult.data?.id || "Not saved"}<br>
              Processing Time: ${Date.now() - startTime}ms<br>
              Email System: Brevo API
            </p>
          </div>
        </div>
        
        <div style="background: #dcfce7; padding: 15px; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #166534; font-size: 14px;">
            <strong>📧 Quick Reply:</strong> Reply directly to this email to respond to ${sanitizedData.name}
          </p>
        </div>
      </div>
    `

    console.log("✅ Step 5 completed: Email content created")

    // Step 6: Send email using Brevo API
    console.log("🚀 Step 6: Attempting to send email via Brevo API...")
    const result = await sendBrevoEmailFetch({
      subject: `🔔 New Contact: ${sanitizedData.name}${sanitizedData.company ? ` - ${sanitizedData.company}` : ""}`,
      htmlContent: htmlContent,
      replyTo: sanitizedData.email,
    })

    console.log("✅ Step 6 completed: Email sent successfully via Brevo API")

    // Step 7: Log email delivery
    console.log("🚀 Step 7: Logging email delivery...")
    await logEmail({
      email_type: "contact_form",
      recipient_email: "contact@euronegocetrade.com",
      subject: `🔔 New Contact: ${sanitizedData.name}${sanitizedData.company ? ` - ${sanitizedData.company}` : ""}`,
      status: "sent",
      brevo_email_id: result.data?.id || null,
      related_contact_id: contactResult.data?.id || null,
    })

    console.log("✅ Step 7 completed: Email delivery logged")

    const totalTime = Date.now() - startTime
    console.log(`🎉 Contact form submission completed successfully in ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully! We will contact you within 24 hours.",
      debug: {
        processingTime: totalTime,
        timestamp: new Date().toISOString(),
        emailId: result.data?.id,
        contactId: contactResult.data?.id,
        databaseSaved: contactResult.success,
        emailService: "Brevo",
      },
    })
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error("❌ Contact form submission failed:")
    console.error("❌ Error occurred at:", new Date().toISOString())
    console.error("❌ Processing time before error:", totalTime + "ms")

    if (error instanceof Error) {
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send your message. Please try again or contact us directly at contact@euronegocetrade.com",
        debug: {
          processingTime: totalTime,
          timestamp: new Date().toISOString(),
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          errorMessage: error instanceof Error ? error.message : String(error),
          emailService: "Brevo",
        },
      },
      { status: 500 },
    )
  }
}
