import { NextResponse } from "next/server"

import { getContacts, getSupabaseServerClient } from "@/lib/database"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    const { data: contacts, error } = await getContacts(supabase)

    if (error) {
      console.error("Error fetching contacts:", error)
      return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
    }

    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
