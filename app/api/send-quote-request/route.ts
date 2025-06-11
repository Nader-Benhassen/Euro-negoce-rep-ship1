import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import QuoteRequestEmail from "@/emails/quote-request"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, companyName, phoneNumber, productOfInterest, quantity, message } = body

    const emailData = {
      from: "noreply@euronegocetrade.com",
      to: ["contact@euronegocetrade.com"],
      reply_to: email,
      subject: "Quote Request - Euro Negoce Trade",
      react: QuoteRequestEmail({
        firstName: firstName,
        lastName: lastName,
        email: email,
        companyName: companyName,
        phoneNumber: phoneNumber,
        productOfInterest: productOfInterest,
        quantity: quantity,
        message: message,
      }),
    }

    const data = await resend.emails.send(emailData)

    return NextResponse.json({
      status: "success",
      message: "Email sent successfully!",
      data,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to send email.",
      error,
    })
  }
}
