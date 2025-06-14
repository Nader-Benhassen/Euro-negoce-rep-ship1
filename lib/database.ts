import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Types for our database operations
export interface ContactData {
  name: string
  email: string
  company?: string | null
  phone?: string | null
  message: string
  selected_product?: string | null
}

export interface CallData {
  name: string
  email: string
  company?: string | null
  phone?: string | null
  preferred_date: string
  preferred_time: string
  timezone: string
  message?: string | null
}

export interface EmailLogData {
  email_type: string
  recipient_email: string
  subject: string
  status: "sent" | "failed" | "pending"
  brevo_email_id?: string | null
  related_contact_id?: number | null
  related_call_id?: number | null
}

// Create a singleton Supabase client
let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.EURONEGOCE_DB_SUPABASE_URL
    const supabaseKey = process.env.EURONEGOCE_DB_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Supabase credentials not found in environment variables (URL or ANON_KEY)")
      throw new Error(
        "Supabase credentials not found. Ensure EURONEGOCE_DB_SUPABASE_URL and EURONEGOCE_DB_SUPABASE_ANON_KEY are set.",
      )
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey)
      console.log("✅ Supabase client initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize Supabase client:", error)
      throw new Error(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  return supabaseClient
}

// --- Data saving and logging functions ---
export async function saveContact(contactData: ContactData) {
  const supabase = getSupabaseClient()
  return await supabase.from("contacts").insert([contactData]).select().single()
}

export async function saveScheduledCall(callData: CallData) {
  const supabase = getSupabaseClient()
  return await supabase.from("scheduled_calls").insert([callData]).select().single()
}

export async function logEmail(emailData: EmailLogData) {
  const supabase = getSupabaseClient()
  return await supabase.from("email_logs").insert([emailData]).select().single()
}

// --- Admin data fetching functions ---
export async function getContacts(limit = 100, offset = 0) {
  const supabase = getSupabaseClient()
  return await supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
}

export async function getScheduledCalls(limit = 100, offset = 0) {
  const supabase = getSupabaseClient()
  return await supabase
    .from("scheduled_calls")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
}

export async function getEmailLogs(limit = 100, offset = 0) {
  const supabase = getSupabaseClient()
  return await supabase
    .from("email_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
}
