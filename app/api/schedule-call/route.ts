import { NextResponse } from "next/server"
import { sendBrevoEmailFetch } from "@/lib/brevo-fetch"
import { saveScheduledCall, logEmail } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const { name, email, company, phone, preferred_date, preferred_time, timezone, message } = formData

    // 1. Save to database
    const { data: callData, error: dbError } = await saveScheduledCall({
      name,
      email,
      company,
      phone,
      preferred_date,
      preferred_time,
      timezone,
      message,
    })
    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    // 2. Send email via Brevo
    const subject = `New Call Scheduled by ${name}`
    const htmlContent = `<p>Name: ${name}</p><p>Email: ${email}</p><p>Company: ${company}</p><p>Phone: ${phone}</p><p>Date: ${preferred_date}</p><p>Time: ${preferred_time} (${timezone})</p><p>Message: ${message}</p>`
    const emailResult = await sendBrevoEmailFetch({
      to: "contact@euronegocetrade.com",
      subject,
      htmlContent,
      replyTo: email,
    })

    // 3. Log email status
    await logEmail({
      email_type: "schedule_call",
      recipient_email: "contact@euronegocetrade.com",
      subject,
      status: emailResult.success ? "sent" : "failed",
      brevo_email_id: emailResult.data?.id || null,
      related_call_id: callData?.id,
    })

    if (!emailResult.success) {
      console.error("Failed to send schedule call email via Brevo:", emailResult.error)
      return NextResponse.json({ message: "Call scheduled, but notification email failed." }, { status: 200 })
    }

    return NextResponse.json({ message: "Call scheduled successfully!" })
  } catch (error) {
    console.error("Error handling schedule call:", error)
    return NextResponse.json({ error: "Failed to process schedule call request." }, { status: 500 })
  }
}
