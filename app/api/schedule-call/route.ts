import { NextResponse } from "next/server"
import { z } from "zod"
import { saveScheduledCall, logEmail } from "@/lib/database"

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  date: z.string(),
  time: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const result = schema.safeParse(body)

    if (!result.success) {
      console.log(result.error)
      return NextResponse.json({ success: false, error: result.error.issues }, { status: 400 })
    }

    const { name, email, phone, date, time } = result.data

    const dateTimeString = `${date} ${time}`

    try {
      await saveScheduledCall({
        name,
        email,
        phone,
        dateTime: dateTimeString,
      })

      await logEmail({
        email,
        type: "scheduled-call",
        status: "pending",
      })

      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
      console.error("Error saving scheduled call:", error)
      return NextResponse.json({ success: false, error: "Failed to save scheduled call" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error parsing request body:", error)
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }
}
