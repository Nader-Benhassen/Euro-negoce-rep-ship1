export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, selectedProduct } = body

    // Using Resend API for actual email sending
    const emailData = {
      from: "noreply@euronegocetrade.com",
      to: ["euronegoce.mail@gmail.com"],
      reply_to: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">New Contact Form Submission</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || "Not provided"}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            ${selectedProduct ? `<p><strong>Product of Interest:</strong> ${selectedProduct}</p>` : ""}
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #dcfce7; border-radius: 8px;">
            <p style="margin: 0; color: #166534;">
              <strong>Reply directly to this email to respond to ${name}</strong>
            </p>
          </div>
        </div>
      `,
    }

    // Send email using fetch to Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    // Send confirmation email to the customer
    const confirmationEmail = {
      from: "noreply@euronegocetrade.com",
      to: [email],
      subject: "Thank you for contacting Euro Negoce Trade",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Thank you for contacting Euro Negoce Trade</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your inquiry. We have received your message and our team will contact you within 24 hours.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${selectedProduct ? `Inquiry about ${selectedProduct}` : "General Inquiry"}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #166534;">
              <strong>Contact Information:</strong><br>
              Email: euronegoce.mail@gmail.com<br>
              Website: www.euronegocetrade.com
            </p>
          </div>
          
          <p>Best regards,<br>Euro Negoce Trade Team</p>
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

    return Response.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Email sending error:", error)
    return Response.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
