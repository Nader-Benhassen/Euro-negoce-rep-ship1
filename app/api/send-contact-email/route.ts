export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, selectedProduct } = body

    // Enhanced logging
    console.log("=== EMAIL SEND ATTEMPT ===")
    console.log("Timestamp:", new Date().toISOString())
    console.log("From:", email)
    console.log("Name:", name)
    console.log("Has Resend Key:", !!process.env.RESEND_API_KEY)

    // Validate required fields
    if (!name || !email || !message) {
      console.log("❌ Validation failed: Missing required fields")
      return Response.json(
        {
          success: false,
          error: "Missing required fields: name, email, and message are required",
        },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Validation failed: Invalid email format")
      return Response.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Check if Resend API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not found in environment variables")
      return Response.json(
        {
          success: false,
          error: "Email service not configured. Please contact support.",
        },
        { status: 500 },
      )
    }

    const emailData = {
      from: "noreply@euronegocetrade.com",
      to: ["euronegoce.mail@gmail.com"],
      reply_to: email,
      subject: `🔔 New Contact: ${name} - ${company || "Individual"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🔔 New Contact Form Submission</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Euro Negoce Trade Website</p>
          </div>
          
          <div style="padding: 20px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 5px 0; font-weight: bold;">Name:</td><td style="padding: 5px 0;">${name}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Email:</td><td style="padding: 5px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Company:</td><td style="padding: 5px 0;">${company || "Not provided"}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Phone:</td><td style="padding: 5px 0;">${phone || "Not provided"}</td></tr>
                ${selectedProduct ? `<tr><td style="padding: 5px 0; font-weight: bold;">Product Interest:</td><td style="padding: 5px 0;">${selectedProduct}</td></tr>` : ""}
              </table>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">💬 Message</h3>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #16a34a;">
                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #dcfce7; border-radius: 8px; border-left: 4px solid #16a34a;">
              <p style="margin: 0; color: #166534;">
                <strong>📧 Quick Reply:</strong> Reply directly to this email to respond to ${name}
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              📅 Sent: ${new Date().toLocaleString()}<br>
              🌐 From: Euro Negoce Trade Website<br>
              🔍 IP: ${request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"}
            </p>
          </div>
        </div>
      `,
    }

    console.log("📧 Attempting to send email via Resend...")
    console.log("To:", emailData.to)
    console.log("From:", emailData.from)

    // Send email using Resend API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const responseData = await response.json()

    console.log("📧 Resend API Response Status:", response.status)
    console.log("📧 Resend API Response:", responseData)

    if (!response.ok) {
      console.error("❌ Resend API error:", responseData)
      return Response.json(
        {
          success: false,
          error: `Email delivery failed: ${responseData.message || "Unknown error"}`,
          details: responseData,
        },
        { status: 500 },
      )
    }

    console.log("✅ Email sent successfully! ID:", responseData.id)

    // Send confirmation email to customer (optional, don't fail if this fails)
    try {
      const confirmationEmail = {
        from: "noreply@euronegocetrade.com",
        to: [email],
        subject: "✅ Message Received - Euro Negoce Trade",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">✅ Thank you for contacting Euro Negoce Trade</h2>
            </div>
            
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Dear ${name},</p>
              
              <p>Thank you for your inquiry. We have received your message and our team will contact you within 24 hours.</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">📋 Your Message Summary</h3>
                <p><strong>Subject:</strong> ${selectedProduct ? `Inquiry about ${selectedProduct}` : "General Inquiry"}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #166534;">
                  <strong>📞 Contact Information:</strong><br>
                  Email: euronegoce.mail@gmail.com<br>
                  Phone: +33 1 48 11 65 91<br>
                  Website: www.euronegocetrade.com
                </p>
              </div>
              
              <p>Best regards,<br><strong>Euro Negoce Trade Team</strong></p>
            </div>
          </div>
        `,
      }

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmationEmail),
      })

      console.log("✅ Confirmation email sent to customer")
    } catch (confirmError) {
      console.warn("⚠️ Failed to send confirmation email:", confirmError.message)
    }

    return Response.json({
      success: true,
      message: "Your message has been sent successfully! We will contact you within 24 hours.",
      emailId: responseData.id,
    })
  } catch (error) {
    console.error("❌ Email sending error:", error)

    if (error.name === "AbortError") {
      return Response.json(
        {
          success: false,
          error: "Email sending timed out. Please try again or contact us directly.",
        },
        { status: 408 },
      )
    }

    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again or contact us directly at euronegoce.mail@gmail.com",
      },
      { status: 500 },
    )
  }
}
