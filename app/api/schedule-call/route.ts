export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, date, time, timezone, topic, message } = body

    // Validate required fields
    if (!name || !email || !date || !time || !topic) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
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
      console.error("RESEND_API_KEY not found in environment variables")
      return Response.json(
        {
          success: false,
          error: "Email service not configured properly",
        },
        { status: 500 },
      )
    }

    // Format the date and time for display
    const formattedDate = new Date(`${date}T${time}`).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const formattedTime = new Date(`${date}T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    // Send email to company
    const emailData = {
      from: "noreply@euronegocetrade.com",
      to: ["contact@euronegocetrade.com"],
      reply_to: email,
      subject: `📅 Call Scheduled: ${name} - ${topic}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">📅 New Call Scheduled</h2>
            <p style="margin: 5px 0 0 0;">${formattedDate} at ${formattedTime} ${timezone}</p>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Call Details</h3>
              <p><strong>Topic:</strong> ${topic}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime} ${timezone}</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Company:</strong> ${company || "Not provided"}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            </div>
            
            ${
              message
                ? `
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">Additional Notes</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            `
                : ""
            }
            
            <div style="margin-top: 20px; padding: 15px; background: #e0e7ff; border-radius: 8px;">
              <p style="margin: 0; color: #4338ca;">
                <strong>Action Required:</strong> Please confirm this appointment by replying to this email.
              </p>
            </div>
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
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    // Send confirmation to customer
    const confirmationEmail = {
      from: "noreply@euronegocetrade.com",
      to: [email],
      subject: "📅 Your Call with Euro Negoce Trade is Scheduled",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">📅 Your Call is Scheduled</h2>
            <p style="margin: 5px 0 0 0;">${formattedDate} at ${formattedTime} ${timezone}</p>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Dear ${name},</p>
            
            <p>Thank you for scheduling a call with Euro Negoce Trade. We have received your request and will contact you at the scheduled time.</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Call Details</h3>
              <p><strong>Topic:</strong> ${topic}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime} ${timezone}</p>
            </div>
            
            <div style="background: #e0e7ff; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; color: #4338ca;">
                <strong>What happens next?</strong><br>
                Our team will call you at the scheduled time. Please ensure your phone is available.
              </p>
            </div>
            
            <p style="margin-top: 20px;">If you need to reschedule or have any questions, please reply to this email or contact us at contact@euronegocetrade.com.</p>
            
            <p>Best regards,<br>Euro Negoce Trade Team</p>
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

    return Response.json({ success: true, message: "Call scheduled successfully" })
  } catch (error) {
    console.error("Call scheduling error:", error)
    return Response.json({ success: false, error: "Failed to schedule call" }, { status: 500 })
  }
}
