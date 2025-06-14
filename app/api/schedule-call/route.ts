import { NextResponse } from "next/server"
import { sendBrevoEmailFetch } from "@/lib/brevo-fetch" // Corrected path
import { saveScheduledCall, logEmail } from "@/lib/database" // Corrected path

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  console.log("📞 Received schedule call request")
  try {
    const formData = await request.json()
    const { name, email, company, phone, preferred_date, preferred_time, timezone, message } = formData

    if (!name || !email || !preferred_date || !preferred_time || !timezone) {
      console.error("📞 Missing required fields for scheduling a call:", {
        name,
        email,
        preferred_date,
        preferred_time,
        timezone,
      })
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    console.log("📞 Form data:", formData)

    // 1. Save to database
    console.log("📞 Saving call to database...")
    const {
      data: callData,
      error: dbError,
      success: dbSuccess,
    } = await saveScheduledCall({
      name,
      email,
      company: company || null,
      phone: phone || null,
      preferred_date,
      preferred_time,
      timezone,
      message: message || null,
    })

    if (!dbSuccess || dbError) {
      console.error("📞 Database error saving scheduled call:", dbError?.message)
      // Still attempt to send email if critical info is present, but log the DB error
      // Depending on business logic, you might choose to return an error here.
      // For now, we'll proceed to email sending if core details are available.
      if (!callData?.id) {
        // If ID is not available, we can't link email log properly
        return NextResponse.json(
          { error: `Database error: ${dbError?.message || "Unknown DB error"}` },
          { status: 500 },
        )
      }
    }
    console.log("📞 Call saved to database. Call ID:", callData?.id)

    // 2. Send email via Brevo
    const subject = `New Call Scheduled: ${name} - ${preferred_date}`
    const htmlContent = `
      <h2>New Call Scheduled</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "N/A"}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Preferred Date:</strong> ${preferred_date}</p>
      <p><strong>Preferred Time:</strong> ${preferred_time}</p>
      <p><strong>Timezone:</strong> ${timezone}</p>
      <p><strong>Message:</strong></p>
      <p>${message || "N/A"}</p>
    `
    const recipientEmail = "contact@euronegocetrade.com" // Your notification email

    console.log(`📞 Attempting to send schedule call notification to ${recipientEmail} for ${name}`)
    const emailResult = await sendBrevoEmailFetch({
      to: recipientEmail,
      subject,
      htmlContent,
      replyTo: email, // User's email as replyTo
    })

    console.log("📞 Brevo email send result:", emailResult)

    // 3. Log email status
    console.log("📞 Logging email status...")
    const logStatus = await logEmail({
      email_type: "schedule_call_notification", // More specific type
      recipient_email: recipientEmail,
      subject,
      status: emailResult.success ? "sent" : "failed",
      brevo_email_id: emailResult.data?.id || null,
      related_call_id: callData?.id || null, // Ensure callData.id is available
    })
    console.log("📞 Email log status:", logStatus)

    if (!emailResult.success) {
      console.error("📞 Failed to send schedule call notification email via Brevo:", emailResult.error)
      // If DB save was successful but email failed, inform user appropriately
      if (dbSuccess) {
        return NextResponse.json(
          { message: "Call scheduled, but notification email failed. We will contact you.", callId: callData?.id },
          { status: 207 },
        ) // 207 Multi-Status
      } else {
        // If both DB and email failed
        return NextResponse.json(
          {
            error: `Failed to process schedule call request. DB Error: ${dbError?.message}, Email Error: ${emailResult.error}`,
          },
          { status: 500 },
        )
      }
    }

    console.log("📞 Call scheduled successfully and notification sent!")
    return NextResponse.json({ message: "Call scheduled successfully!", callId: callData?.id })
  } catch (error: any) {
    console.error("📞 CRITICAL ERROR handling schedule call:", error.message, error.stack)
    return NextResponse.json(
      { error: "Failed to process schedule call request due to an unexpected error." },
      { status: 500 },
    )
  }
}
