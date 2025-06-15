import { NextResponse } from "next/server"
import { z } from "zod"
import { saveQuoteRequest, logEmail } from "@/lib/database"

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = schema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validation.error.issues, { status: 400 })
    }

    const { name, email, phone, company, message } = validation.data

    // Save to database
    await saveQuoteRequest({ name, email, phone, company, message })

    // Log email
    await logEmail({
      to: process.env.EMAIL_TO_ADDRESS || "",
      subject: "New Quote Request",
      body: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Company: ${company || "N/A"}
        Message: ${message}
      `,
    })

    return NextResponse.json({ message: "Quote request sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending quote request:", error)
    return NextResponse.json({ message: "Failed to send quote request" }, { status: 500 })
  }
}
