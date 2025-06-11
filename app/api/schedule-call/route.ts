export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, timezone, selectedDate, selectedTime } = body

    // Send call scheduling notification to company
    const callEmailData = {
      from: "noreply@euronegocetrade.com",
      to: ["euronegoce.mail@gmail.com"],
      subject: `New Call Scheduled - ${name} from ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Call Scheduled</h2>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📞 Call Details</h3>
            <p><strong>Date:</strong> ${selectedDate}</p>
            <p><strong>Time:</strong> ${selectedTime} (${timezone})</p>
            <p><strong>Duration:</strong> 30 minutes</p>
            <p><strong>Type:</strong> Phone Consultation</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Call Agenda</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; color: #92400e;">
              <strong>⏰ Reminder: Call ${name} at ${phone} on ${selectedDate} at ${selectedTime}</strong>
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
      body: JSON.stringify(callEmailData),
    })

    if (!response.ok) {
      throw new Error("Failed to send call notification")
    }

    // Send confirmation to customer
    const confirmationEmail = {
      from: "noreply@euronegocetrade.com",
      to: [email],
      subject: "Call Scheduled - Euro Negoce Trade",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Call Scheduled Successfully</h2>
          
          <p>Dear ${name},</p>
          
          <p>Your call has been scheduled successfully. We look forward to speaking with you!</p>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📞 Your Call Details</h3>
            <p><strong>Date:</strong> ${selectedDate}</p>
            <p><strong>Time:</strong> ${selectedTime} (${timezone})</p>
            <p><strong>Duration:</strong> 30 minutes</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #166534;">
              <strong>What to expect:</strong><br>
              • We'll call you at the scheduled time<br>
              • Have your questions ready<br>
              • We'll discuss your business needs<br>
              • Follow-up materials will be sent after the call
            </p>
          </div>
          
          <p>If you need to reschedule, please contact us at euronegoce.mail@gmail.com</p>
          
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

    return Response.json({ success: true, message: "Call scheduled successfully" })
  } catch (error) {
    console.error("Call scheduling error:", error)
    return Response.json({ success: false, error: "Failed to schedule call" }, { status: 500 })
  }
}
