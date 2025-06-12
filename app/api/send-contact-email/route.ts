import { NextResponse } from "next/server"
import { sendEmail, verifyApiKey } from "@/lib/email"

export async function POST(request: Request) {
  const startTime = Date.now()
  console.log("🚀 Contact form submission started at:", new Date().toISOString())

  try {
    // Verify API key first
    const keyVerification = verifyApiKey()
    console.log("🔑 API Key Verification:", keyVerification)

    if (!keyVerification.isCorrectKey || !keyVerification.resendInitialized) {
      console.error("❌ Email service not properly configured")
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

    const body = await request.json()
    const { name, email, company, phone, message, selectedProduct } = body

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
    }

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedData = {
      name: String(name).trim().replace(/[<>]/g, ""),
      email: String(email).trim().replace(/[<>]/g, ""),
      company: company ? String(company).trim().replace(/[<>]/g, "") : "",
      phone: phone ? String(phone).trim().replace(/[<>]/g, "") : "",
      message: String(message).trim().replace(/[<>]/g, ""),
      product: selectedProduct ? String(selectedProduct).trim().replace(/[<>]/g, "") : "",
    }

    console.log("✅ Form validation and sanitization completed")

    // Create email content
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
              Processing Time: ${Date.now() - startTime}ms<br>
              Email System: Resend SDK<br>
              API Key Status: ${keyVerification.message}
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

    console.log("📧 Attempting to send email via Resend SDK...")

    // Send email using Resend SDK
    const result = await sendEmail({
      subject: `🔔 New Contact: ${sanitizedData.name}${sanitizedData.company ? ` - ${sanitizedData.company}` : ""}`,
      html: htmlContent,
      replyTo: sanitizedData.email,
    })

    console.log("✅ Email sent successfully via Resend SDK")

    const totalTime = Date.now() - startTime
    console.log(`🎉 Contact form submission completed in ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully! We will contact you within 24 hours.",
      debug: {
        processingTime: totalTime,
        timestamp: new Date().toISOString(),
        emailId: result.data?.id,
        apiKeyStatus: keyVerification.message,
      },
    })
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error("❌ Contact form submission failed:")
    console.error("Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send your message. Please try again or contact us directly at contact@euronegocetrade.com",
        debug: {
          processingTime: totalTime,
          timestamp: new Date().toISOString(),
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    )
  }
}
