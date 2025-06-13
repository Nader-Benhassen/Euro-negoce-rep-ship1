import { NextResponse } from "next/server"
import { getScheduledCalls } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const status = url.searchParams.get("status") || undefined

    const result = await getScheduledCalls(limit, offset, status)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        limit,
        offset,
        total: result.data?.length || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching scheduled calls:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
