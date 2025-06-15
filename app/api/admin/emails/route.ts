import { NextResponse } from "next/server"

import { getEmailLogs, getSupabaseServerClient } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseServerClient()

    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("Error getting user:", userError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user?.user?.app_metadata?.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const emailLogs = await getEmailLogs()

    return NextResponse.json(emailLogs)
  } catch (error) {
    console.error("Error fetching email logs:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
