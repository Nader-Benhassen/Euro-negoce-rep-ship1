import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"
import { saveScheduledCall, logEmail } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, date, time, timezone, topic, message } = body

    // Validate required fields
    if (!name || !email || !date || !time || !topic) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedData = {
      name: String(name).trim().replace(/[<>]/g, ""),
      email: String(email).trim().replace(/[<>]/g, ""),
      company: company ? String(company).trim().replace(/[<>]/g, "") : "",
      phone: phone ? String(phone).trim().replace(/[<>]/g, "") : "",
      topic: String(topic).trim().replace(/[<>]/g, ""),
      message: message ? String(message).trim().replace(/[<>]/g, "") : "",
      timezone: timezone ? String(timezone).trim().replace(/[<>]/g, "") : "CET",
      date: String(date).trim(),
      time: String(time).trim(),
    }

    // Save to database
    const callResult = await saveScheduledCall({
      name: sanitizedData.name,
      email: sanitizedData.email,
      company: sanitizedData.company || null,
      phone: sanitizedData.phone || null,
      call_date: sanitizedData.date,
      call_time: sanitizedData.time,
      timezone: sanitizedData.timezone,
      topic: sanitizedData.topic,
      message: sanitizedData.message || null,
    })

    // Format the date and time for display
    const formattedDate = new Date(`${sanitizedData.date}T${sanitizedData.time}`).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const formattedTime = new Date(`${sanitizedData.date}T${sanitizedData.time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    // Send email to contact@euronegocetrade.com
    const emailResult = await sendEmail({
      subject: `📅 Call Scheduled: ${sanitizedData.name} - ${sanitizedData.topic}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">📅 New Call Scheduled</h2>
            <p style="margin: 5px 0 0 0;">${formattedDate} at ${formattedTime} ${sanitizedData.timezone}</p>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">📞 Call Details</h3>
              <p><strong>Topic:</strong> ${sanitizedData.topic}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime} ${sanitizedData.timezone}</p>
              <p><strong>Call ID:</strong> ${callResult.data?.id || "Not saved"}</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
              <p><strong>Name:</strong> ${sanitizedData.name}</p>
              <p><strong>Email:</strong> ${sanitizedData.email}</p>
              <p><strong>Company:</strong> ${sanitizedData.company || "Not provided"}</p>
              <p><strong>Phone:</strong> ${sanitizedData.phone || "Not provided"}</p>
            </div>
            
            ${
              sanitizedData.message
                ? `
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">📝 Additional Notes</h3>
              <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
            </div>
            `
                : ""
            }
          </div>
        </div>
      `,
      replyTo: sanitizedData.email,
    })

    // Log email delivery
    await logEmail({
      email_type: "call_scheduled",
      recipient_email: "contact@euronegocetrade.com",
      subject: `📅 Call Scheduled: ${sanitizedData.name} - ${sanitizedData.topic}`,
      status: "sent",
      resend_email_id: emailResult.data?.id || null,
      related_call_id: callResult.data?.id || null,
    })

    // Send confirmation to customer
    await sendEmail({
      to: sanitizedData.email,
      subject: "📅 Your Call with Euro Negoce Trade is Scheduled",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">📅 Your Call is Scheduled</h2>
            <p style="margin: 5px 0 0 0;">${formattedDate} at ${formattedTime} ${sanitizedData.timezone}</p>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Dear ${sanitizedData.name},</p>
            
            <p>Thank you for scheduling a call with Euro Negoce Trade. We have received your request and will contact you at the scheduled time.</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">📞 Call Details</h3>
              <p><strong>Topic:</strong> ${sanitizedData.topic}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime} ${sanitizedData.timezone}</p>
              <p><strong>Reference ID:</strong> ${callResult.data?.id || "N/A"}</p>
            </div>
            
            <div style="background: #e0e7ff; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; color: #4338ca;">
                <strong>📞 What happens next?</strong><br>
                Our team will call you at the scheduled time. Please ensure your phone is available.
              </p>
            </div>
            
            <p>Best regards,<br><strong>Euro Negoce Trade Team</strong></p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Call scheduled successfully",
      callId: callResult.data?.id,
    })
  } catch (error) {
    console.error("Call scheduling error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to schedule call. Please try again or contact us directly at contact@euronegocetrade.com",
      },
      { status: 500 },
    )
  }
}
