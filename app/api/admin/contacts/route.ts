import { NextResponse } from "next/server"
import { getContacts } from "@/lib/database" // Correct import

export const dynamic = "force-dynamic" // Ensure dynamic rendering

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const status = url.searchParams.get("status") || undefined

    const result = await getContacts(limit, offset, status) // Uses the imported function

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
    console.error("Error fetching contacts:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
