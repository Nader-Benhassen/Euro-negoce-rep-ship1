import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const calls = await sql`SELECT * FROM scheduled_calls ORDER BY created_at DESC`
    return NextResponse.json(calls)
  } catch (error) {
    console.error("Error fetching scheduled calls:", error)
    return NextResponse.json(
      { message: "Failed to fetch scheduled calls", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
