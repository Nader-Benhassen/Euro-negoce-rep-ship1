import { NextResponse } from "next/server"
import { getScheduledCalls } from "@/lib/database" // Correct: only imports what's needed

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    const result = await getScheduledCalls(limit, offset) // This function uses getSupabaseServerClient internally

    if (!result.success) {
      console.error("Error fetching scheduled calls from database:", result.error)
      return NextResponse.json(
        { success: false, error: result.error?.message || "Failed to fetch scheduled calls" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        limit,
        offset,
        total: result.count || 0,
      },
    })
  } catch (error) {
    console.error("Error in /api/admin/calls route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error fetching scheduled calls",
      },
      { status: 500 },
    )
  }
}
