import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  const startTime = Date.now()
  console.log("🚀 Contact form submission started at:", new Date().toISOString())

  try {
    const body = await request.json()
    console.log("📝 Form data received:", JSON.stringify(body, null, 2))

    const { name, email, company, phone, message, selectedProduct } = body

    // Enhanced validation
    if (!name || !name.trim()) {
      console.log("❌ Validation failed: Name missing")
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    if (!email || !email.trim() || !email.includes("@")) {
      console.log("❌ Validation failed: Invalid email")
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
    }

    if (!message || !message.trim()) {
      console.log("❌ Validation failed: Message missing")
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    console.log("✅ Form validation passed")

    // Sanitize inputs
    const sanitizedName = String(name).trim().replace(/[<>]/g, "")
    const sanitizedEmail = String(email).trim().replace(/[<>]/g, "")
    const sanitizedCompany = company ? String(company).trim().replace(/[<>]/g, "") : ""
    const sanitizedPhone = phone ? String(phone).trim().replace(/[<>]/g, "") : ""
    const sanitizedMessage = String(message).trim().replace(/[<>]/g, "")
    const sanitizedProduct = selectedProduct ? String(selectedProduct).trim().replace(/[<>]/g, "") : ""

    console.log("✅ Input sanitization completed")

    // Create email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">New Contact Form Submission</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Euro Negoce Trade Website</p>
        </div>
        
        <div style="padding: 20px;">
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold;">Name:</td><td style="padding: 5px 0;">${sanitizedName}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Email:</td><td style="padding: 5px 0;"><a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Company:</td><td style="padding: 5px 0;">${sanitizedCompany || "Not provided"}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Phone:</td><td style="padding: 5px 0;">${sanitizedPhone || "Not provided"}</td></tr>
              ${sanitizedProduct ? `<tr><td style="padding: 5px 0; font-weight: bold;">Product Interest:</td><td style="padding: 5px 0;">${sanitizedProduct}</td></tr>` : ""}
            </table>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #16a34a;">
              <p style="white-space: pre-wrap; margin: 0;">${sanitizedMessage}</p>
            </div>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #0369a1; font-size: 12px;">
              <strong>Submission Details:</strong><br>
              Timestamp: ${new Date().toLocaleString()}<br>
              Processing Time: ${Date.now() - startTime}ms<br>
              User Agent: ${request.headers.get("user-agent") || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    `

    console.log("📧 Attempting to send email to contact@euronegocetrade.com")

    // Send email to contact@euronegocetrade.com
    const result = await sendEmail({
      subject: `New Contact: ${sanitizedName} - ${sanitizedCompany || "Individual"}`,
      html: htmlContent,
      replyTo: sanitizedEmail,
    })

    console.log("✅ Main email sent successfully")

    // Send confirmation to customer
    try {
      console.log("📧 Sending confirmation email to customer")
      await sendEmail({
        to: sanitizedEmail,
        subject: "Thank you for contacting Euro Negoce Trade",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">Thank you for contacting Euro Negoce Trade</h2>
            </div>
            
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Dear ${sanitizedName},</p>
              
              <p>Thank you for your inquiry. We have received your message and our team will contact you within 24 hours.</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Your Message Summary</h3>
                <p><strong>Subject:</strong> ${sanitizedProduct ? `Inquiry about ${sanitizedProduct}` : "General Inquiry"}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #166534;">
                  <strong>Contact Information:</strong><br>
                  Email: contact@euronegocetrade.com<br>
                  Phone: +33 1 48 11 65 91<br>
                  Website: www.euronegocetrade.com
                </p>
              </div>
              
              <p>Best regards,<br><strong>Euro Negoce Trade Team</strong></p>
            </div>
          </div>
        `,
      })
      console.log("✅ Confirmation email sent successfully")
    } catch (confirmError) {
      console.warn("⚠️ Failed to send confirmation email:", confirmError)
      // Don't fail the request if confirmation email fails
    }

    const totalTime = Date.now() - startTime
    console.log(`🎉 Contact form submission completed successfully in ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully! We will contact you within 24 hours.",
      debug: {
        processingTime: totalTime,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error("❌ Contact form submission failed:")
    console.error("Error:", error)
    console.error("Processing time:", totalTime + "ms")

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
