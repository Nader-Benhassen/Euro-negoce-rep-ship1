import { NextResponse } from "next/server"

import { getScheduledCalls } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const scheduledCalls = await getScheduledCalls()

    return NextResponse.json({ scheduledCalls }, { status: 200 })
  } catch (error) {
    console.error("Error fetching scheduled calls:", error)
    return NextResponse.json({ error: "Failed to fetch scheduled calls" }, { status: 500 })
  }
}
