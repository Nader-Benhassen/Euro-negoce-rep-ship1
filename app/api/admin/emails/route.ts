import { NextResponse } from "next/server"
import { getEmailLogs } from "@/lib/database" // Correct import

export const dynamic = "force-dynamic" // Ensure dynamic rendering

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const emailType = url.searchParams.get("type") || undefined

    const result = await getEmailLogs(limit, offset, emailType) // Uses the imported function

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        limit,
        offset,
        total: result.count || 0, // Use count from the result
      },
    })
  } catch (error) {
    console.error("Error fetching email logs:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
