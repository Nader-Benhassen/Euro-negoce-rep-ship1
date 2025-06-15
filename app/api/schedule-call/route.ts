import { NextResponse } from "next/server"
import { sendBrevoEmailFetch } from "@/lib/brevo-fetch"
import { saveScheduledCall, logEmail } from "@/lib/database" // Correct: only imports what's needed

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  console.log("📞 SCHED_CALL: Received schedule call request")
  let callIdForLog: string | null = null
  let dbSaveSuccessful = false
  let dbErrorMessage: string | null = null

  try {
    const formData = await request.json()
    const { name, email, company, phone, preferred_date, preferred_time, timezone, message } = formData

    if (!name || !email || !preferred_date || !preferred_time || !timezone) {
      console.error("📞 SCHED_CALL: Missing required fields for scheduling a call and sending notification:", {
        nameExists: !!name,
        emailExists: !!email,
        dateExists: !!preferred_date,
        timeExists: !!preferred_time,
        timezoneExists: !!timezone,
      })
      return NextResponse.json(
        { error: "Missing required fields to schedule call or send notification." },
        { status: 400 },
      )
    }
    console.log("📞 SCHED_CALL: Form data received:", { name, email, preferred_date })

    console.log("📞 SCHED_CALL: Attempting to save call to database...")
    try {
      const {
        data: callData,
        error: dbError,
        success: dbSuccessOp,
      } = await saveScheduledCall({
        // This function uses getSupabaseServerClient internally
        name,
        email,
        company: company || null,
        phone: phone || null,
        preferred_date,
        preferred_time,
        timezone,
        message: message || null,
      })

      if (dbSuccessOp && callData?.id) {
        callIdForLog = callData.id
        dbSaveSuccessful = true
        console.log("📞 SCHED_CALL: Call saved to database successfully. Call ID:", callIdForLog)
      } else {
        dbErrorMessage = dbError?.message || "Unknown DB error during saveScheduledCall"
        console.error("📞 SCHED_CALL: Database error saving scheduled call:", dbErrorMessage)
      }
    } catch (dbCatchError: any) {
      dbErrorMessage = dbCatchError.message || "Exception during saveScheduledCall"
      console.error("📞 SCHED_CALL: Exception occurred while saving scheduled call:", dbErrorMessage)
    }

    const subject = `New Call Scheduled: ${name} - ${preferred_date}`
    const htmlContent = `
      <h2>New Call Scheduled</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email (Reply-To):</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "N/A"}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Preferred Date:</strong> ${preferred_date}</p>
      <p><strong>Preferred Time:</strong> ${preferred_time}</p>
      <p><strong>Timezone:</strong> ${timezone}</p>
      <p><strong>Message:</strong></p>
      <p>${message || "N/A"}</p>
    `
    const recipientEmail = "contact@euronegocetrade.com"

    console.log(
      `📞 SCHED_CALL: Attempting to send schedule call notification to ${recipientEmail} for user ${name} (${email})`,
    )
    const emailResult = await sendBrevoEmailFetch({
      to: recipientEmail,
      subject,
      htmlContent,
      replyTo: email,
    })
    console.log("📞 SCHED_CALL: Brevo email send attempt result:", emailResult)

    console.log("📞 SCHED_CALL: Logging email attempt status to database...")
    const emailLogStatusToSave = emailResult.success ? "sent" : "failed"
    const brevoMessageId = emailResult.data?.id || null

    const dbLogEmailOp = await logEmail({
      // This function uses getSupabaseServerClient internally
      email_type: "schedule_call_notification",
      recipient_email: recipientEmail,
      subject,
      status: emailLogStatusToSave,
      resend_email_id: brevoMessageId,
      related_call_id: callIdForLog,
      error_message: emailResult.success ? null : emailResult.error,
    })
    console.log("📞 SCHED_CALL: Email log database operation status:", dbLogEmailOp)
    if (!dbLogEmailOp.success) {
      console.error("📞 SCHED_CALL: Failed to log email status to database. Error:", dbLogEmailOp.error?.message)
    }

    if (!emailResult.success) {
      console.error("📞 SCHED_CALL: Notification email FAILED. Brevo error:", emailResult.error)
      const responseMessage = dbSaveSuccessful
        ? "Call details saved, but notification email failed. We will contact you."
        : `Failed to save call details (DB Error: ${dbErrorMessage}) AND notification email failed (Email Error: ${emailResult.error}). Please try again or contact support.`
      const responseStatus = dbSaveSuccessful ? 207 : 500
      return NextResponse.json(
        { message: responseMessage, callId: callIdForLog, emailSent: false, dbSaved: dbSaveSuccessful },
        { status: responseStatus },
      )
    }

    if (!dbSaveSuccessful) {
      console.warn(
        `📞 SCHED_CALL: Notification email SENT, but failed to save call details to DB. DB Error: ${dbErrorMessage}`,
      )
      return NextResponse.json(
        {
          message:
            "Your call request notification has been sent, but there was an issue saving all details. We will contact you.",
          callId: null,
          emailSent: true,
          dbSaved: false,
        },
        { status: 207 },
      )
    }

    console.log("📞 SCHED_CALL: Call scheduled successfully and notification sent!")
    return NextResponse.json({
      message: "Call scheduled successfully!",
      callId: callIdForLog,
      emailSent: true,
      dbSaved: true,
    })
  } catch (error: any) {
    console.error("📞 SCHED_CALL: CRITICAL UNHANDLED ERROR in schedule call route:", error.message, error.stack)
    return NextResponse.json(
      { error: "Failed to process schedule call request due to an unexpected server error." },
      { status: 500 },
    )
  }
}
