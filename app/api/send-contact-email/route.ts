import { NextResponse } from "next/server"
import { Resend } from "resend"
import * as z from "zod"
import { saveContact, logEmail, getSupabaseServerClient } from "@/lib/database"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = contactSchema.parse(body)

    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Contact Form Submission",
      react: (
        <>
          <h1>Contact Form Submission</h1>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Message: {message}</p>
        </>
      ),
    })

    const supabase = getSupabaseServerClient()

    await saveContact({ supabaseClient: supabase, name, email, message })
    await logEmail({ supabaseClient: supabase, emailId: data.id, emailType: "contact-form", recipient: email })

    return NextResponse.json({ data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
