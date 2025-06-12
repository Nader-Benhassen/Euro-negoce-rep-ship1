import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, date, time, timezone, topic, message } = body

    // Validate required fields
    if (!name || !email || !date || !time || !topic) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedName = String(name).trim().replace(/[<>]/g, "")
    const sanitizedEmail = String(email).trim().replace(/[<>]/g, "")
    const sanitizedCompany = company ? String(company).trim().replace(/[<>]/g, "") : ""
    const sanitizedPhone = phone ? String(phone).trim().replace(/[<>]/g, "") : ""
    const sanitizedTopic = String(topic).trim().replace(/[<>]/g, "")
    const sanitizedMessage = message ? String(message).trim().replace(/[<>]/g, "") : ""
    const sanitizedTimezone = timezone ? String(timezone).trim().replace(/[<>]/g, "") : "CET"

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

    // Send email to contact@euronegocetrade.com
    await sendEmail({
      subject: `Call Scheduled: ${sanitizedName} - ${sanitizedTopic}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">New Call Scheduled</h2>
            <p style="margin: 5px 0 0 0;">${formattedDate} at ${formattedTime} ${sanitizedTimezone}</p>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Call Details</h3>
              <p><strong>Topic:</strong> ${sanitizedTopic}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime} ${sanitizedTimezone}</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
              <p><strong>Name:</strong> ${sanitizedName}</p>
              <p><strong>Email:</strong> ${sanitizedEmail}</p>
              <p><strong>Company:</strong> ${sanitizedCompany || "Not provided"}</p>
              <p><strong>Phone:</strong> ${sanitizedPhone || "Not provided"}</p>
            </div>
            
            ${
              sanitizedMessage
                ? `
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">Additional Notes</h3>
              <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            `
                : ""
            }
          </div>
        </div>
      `,
      replyTo: sanitizedEmail,
    })

    // Send confirmation to customer
    await sendEmail({
      to: sanitizedEmail,
      subject: "Your Call with Euro Negoce Trade is Scheduled",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Your Call is Scheduled</h2>
            <p style="margin: 5px 0 0 0;">${formattedDate} at ${formattedTime} ${sanitizedTimezone}</p>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Dear ${sanitizedName},</p>
            
            <p>Thank you for scheduling a call with Euro Negoce Trade. We have received your request and will contact you at the scheduled time.</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Call Details</h3>
              <p><strong>Topic:</strong> ${sanitizedTopic}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime} ${sanitizedTimezone}</p>
            </div>
            
            <div style="background: #e0e7ff; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; color: #4338ca;">
                <strong>What happens next?</strong><br>
                Our team will call you at the scheduled time. Please ensure your phone is available.
              </p>
            </div>
            
            <p>Best regards,<br>Euro Negoce Trade Team</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: "Call scheduled successfully" })
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
