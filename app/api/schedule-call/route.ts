import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, preferredTime, message } = body

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailData = {
      from: "noreply@euronegocetrade.com",
      to: "euronegoce.mail@gmail.com",
      subject: `New Call Schedule Request from ${name}`,
      html: `
        <h2>New Call Schedule Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No additional message"}</p>
      `,
    }

    await resend.emails.send(emailData)

    return NextResponse.json({ message: "Call scheduled successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error scheduling call:", error)
    return NextResponse.json({ error: "Failed to schedule call" }, { status: 500 })
  }
}
