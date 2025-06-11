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

    // Send quote request to company
    const quoteEmailData = {
      from: "noreply@euronegocetrade.com",
      to: ["euronegoce.mail@gmail.com"],
      reply_to: email,
      subject: `New Quote Request from ${name} - ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">New Quote Request</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Product Requirements</h3>
            ${selectedProducts ? `<p><strong>Selected Products:</strong> ${selectedProducts}</p>` : ""}
            ${customProducts ? `<p><strong>Custom Products:</strong> ${customProducts}</p>` : ""}
            <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
            <p><strong>Delivery Location:</strong> ${deliveryLocation}</p>
            <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Additional Requirements</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; color: #92400e;">
              <strong>⚡ Priority Quote Request - Respond within 24 hours</strong>
            </p>
          </div>
        </div>
      `,
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteEmailData),
    })

    if (!response.ok) {
      throw new Error("Failed to send quote request")
    }

    // Send confirmation to customer
    const confirmationEmail = {
      from: "noreply@euronegocetrade.com",
      to: [email],
      subject: "Quote Request Received - Euro Negoce Trade",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Quote Request Received</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your quote request. We have received your requirements and our team will prepare a personalized quote for you within 24 hours.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Your Request Summary</h3>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Quantity:</strong> ${totalQuantity}</p>
            <p><strong>Delivery:</strong> ${deliveryLocation}</p>
            ${selectedProducts ? `<p><strong>Products:</strong> ${selectedProducts}</p>` : ""}
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #166534;">
              <strong>What happens next?</strong><br>
              1. Our team reviews your requirements<br>
              2. We prepare a customized quote<br>
              3. You'll receive the quote within 24 hours<br>
              4. We schedule a call to discuss details
            </p>
          </div>
          
          <p>For urgent inquiries, contact us directly at euronegoce.mail@gmail.com</p>
          
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

    return Response.json({ success: true, message: "Quote request sent successfully" })
  } catch (error) {
    console.error("Quote request error:", error)
    return Response.json({ success: false, error: "Failed to send quote request" }, { status: 500 })
  }
}
