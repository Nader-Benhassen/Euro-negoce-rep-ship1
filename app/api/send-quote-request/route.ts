export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      company,
      phone,
      selectedProducts,
      customProducts,
      totalQuantity,
      deliveryLocation,
      timeline,
      message,
    } = body

    // Enhanced logging
    console.log("=== QUOTE REQUEST ATTEMPT ===")
    console.log("Timestamp:", new Date().toISOString())
    console.log("Company:", company)
    console.log("Email:", email)

    // Validate required fields
    if (!name || !email || !company || !totalQuantity || !deliveryLocation) {
      console.log("❌ Validation failed: Missing required fields")
      return Response.json(
        {
          success: false,
          error: "Missing required fields: name, email, company, quantity, and delivery location are required",
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

    const quoteEmailData = {
      from: "noreply@euronegocetrade.com",
      to: ["euronegoce.mail@gmail.com"],
      reply_to: email,
      subject: `🔥 URGENT Quote Request: ${company} - ${totalQuantity}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🔥 URGENT Quote Request</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Priority response required within 24 hours</p>
          </div>
          
          <div style="padding: 20px;">
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">
                ⚡ HIGH PRIORITY: Customer expects quote within 24 hours
              </p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 5px 0; font-weight: bold;">Name:</td><td style="padding: 5px 0;">${name}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Email:</td><td style="padding: 5px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Company:</td><td style="padding: 5px 0;">${company}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Phone:</td><td style="padding: 5px 0;">${phone || "Not provided"}</td></tr>
              </table>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">📦 Product Requirements</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${selectedProducts ? `<tr><td style="padding: 5px 0; font-weight: bold;">Selected Products:</td><td style="padding: 5px 0;">${selectedProducts}</td></tr>` : ""}
                ${customProducts ? `<tr><td style="padding: 5px 0; font-weight: bold;">Custom Products:</td><td style="padding: 5px 0;">${customProducts}</td></tr>` : ""}
                <tr><td style="padding: 5px 0; font-weight: bold;">Total Quantity:</td><td style="padding: 5px 0; color: #dc2626; font-weight: bold;">${totalQuantity}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Delivery Location:</td><td style="padding: 5px 0;">${deliveryLocation}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Timeline:</td><td style="padding: 5px 0;">${timeline || "Not specified"}</td></tr>
              </table>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">💬 Additional Requirements</h3>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #dc2626;">
                <p style="white-space: pre-wrap; margin: 0;">${message || "No additional requirements specified"}</p>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fee2e2; border-radius: 8px; border-left: 4px solid #dc2626;">
              <p style="margin: 0; color: #dc2626; font-weight: bold;">
                ⚡ ACTION REQUIRED: Respond within 24 hours<br>
                📧 Reply directly to this email to respond to ${name}
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

    console.log("📧 Attempting to send quote request via Resend...")

    // Send email with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteEmailData),
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
          error: `Quote request failed: ${responseData.message || "Unknown error"}`,
          details: responseData,
        },
        { status: 500 },
      )
    }

    console.log("✅ Quote request sent successfully! ID:", responseData.id)

    // Send confirmation to customer
    try {
      const confirmationEmail = {
        from: "noreply@euronegocetrade.com",
        to: [email],
        subject: "✅ Quote Request Received - Euro Negoce Trade",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">✅ Quote Request Received</h2>
            </div>
            
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Dear ${name},</p>
              
              <p>Thank you for your quote request. We have received your requirements and our team will prepare a personalized quote for you within 24 hours.</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">📋 Your Request Summary</h3>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Quantity:</strong> ${totalQuantity}</p>
                <p><strong>Delivery:</strong> ${deliveryLocation}</p>
                ${selectedProducts ? `<p><strong>Products:</strong> ${selectedProducts}</p>` : ""}
                <p><strong>Timeline:</strong> ${timeline || "To be discussed"}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #166534;">
                  <strong>What happens next?</strong><br>
                  ✅ Our team reviews your requirements<br>
                  ✅ We prepare a customized quote<br>
                  ✅ You'll receive the quote within 24 hours<br>
                  ✅ We schedule a call to discuss details
                </p>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;">
                  <strong>Need immediate assistance?</strong><br>
                  📧 Email: euronegoce.mail@gmail.com<br>
                  📞 Phone: +33 1 48 11 65 91
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
      message:
        "Your quote request has been sent successfully! Our team will contact you within 24 hours with a personalized quote.",
      emailId: responseData.id,
    })
  } catch (error) {
    console.error("❌ Quote request error:", error)

    if (error.name === "AbortError") {
      return Response.json(
        {
          success: false,
          error: "Quote request timed out. Please try again or contact us directly.",
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
