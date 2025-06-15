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

export interface QuoteRequestData {
  name: string
  email: string
  company?: string | null
  phone?: string | null
  product: string
  quantity: string
  delivery_location: string
  message?: string | null
}

export interface EmailLogData {
  email_type: string
  recipient_email: string
  subject: string
  status: "sent" | "failed" | "pending"
  resend_email_id?: string | null
  related_contact_id?: string | null
  related_call_id?: string | null
  related_quote_id?: string | null
  error_message?: string | null
}

let supabaseServerClientInstance: SupabaseClient | null = null

export function getSupabaseServerClient(): SupabaseClient {
  if (!supabaseServerClientInstance) {
    const supabaseUrl = process.env.EURONEGOCE_DB_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.EURONEGOCE_DB_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error(
        "❌ Supabase credentials for server client not found in environment variables (URL or SERVICE_ROLE_KEY)",
      )
      throw new Error(
        "Supabase server credentials not found. Ensure EURONEGOCE_DB_SUPABASE_URL and EURONEGOCE_DB_SUPABASE_SERVICE_ROLE_KEY are set.",
      )
    }

    try {
      supabaseServerClientInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
      console.log("✅ Supabase server client initialized successfully.")
    } catch (error) {
      console.error("❌ Failed to initialize Supabase server client:", error)
      throw new Error(
        `Failed to initialize Supabase server client: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }
  return supabaseServerClientInstance
}

// ALIAS: Export getSupabaseClient as an alias to getSupabaseServerClient
// This is to satisfy any lingering imports during the build process.
// All new code should use getSupabaseServerClient directly or via helper functions.
export function getSupabaseClient(): SupabaseClient {
  console.warn(
    "⚠️ DEPRECATION WARNING: getSupabaseClient() is deprecated. Use getSupabaseServerClient() or helper functions. This call is being redirected.",
  )
  return getSupabaseServerClient()
}

export async function saveContact(contactData: ContactData) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("contacts").insert([contactData]).select().single()
  if (error) console.error("DB_ERROR saveContact:", error.message)
  return { data, error, success: !error }
}

export async function saveScheduledCall(callData: CallData) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("scheduled_calls").insert([callData]).select().single()
  if (error) console.error("DB_ERROR saveScheduledCall:", error.message)
  return { data, error, success: !error }
}

export async function saveQuoteRequest(quoteData: QuoteRequestData) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("quote_requests").insert([quoteData]).select().single()
  if (error) console.error("DB_ERROR saveQuoteRequest:", error.message)
  return { data, error, success: !error }
}

export async function logEmail(emailData: EmailLogData) {
  const supabase = getSupabaseServerClient()
  const payload = {
    email_type: emailData.email_type,
    recipient_email: emailData.recipient_email,
    subject: emailData.subject,
    status: emailData.status,
    resend_email_id: emailData.resend_email_id,
    related_contact_id: emailData.related_contact_id,
    related_call_id: emailData.related_call_id,
    related_quote_id: emailData.related_quote_id,
    error_message: emailData.error_message,
  }
  const { data, error } = await supabase.from("email_logs").insert([payload]).select().single()
  if (error) console.error("DB_ERROR logEmail:", error.message, "Payload:", payload)
  return { data, error, success: !error }
}

export async function getContacts(limit = 100, offset = 0) {
  const supabase = getSupabaseServerClient()
  const { data, error, count } = await supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error, count, success: !error }
}

export async function getScheduledCalls(limit = 100, offset = 0) {
  const supabase = getSupabaseServerClient()
  const { data, error, count } = await supabase
    .from("scheduled_calls")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error, count, success: !error }
}

export async function getEmailLogs(limit = 100, offset = 0) {
  const supabase = getSupabaseServerClient()
  const { data, error, count } = await supabase
    .from("email_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error, count, success: !error }
}

export async function getQuoteRequests(limit = 100, offset = 0) {
  const supabase = getSupabaseServerClient()
  const { data, error, count } = await supabase
    .from("quote_requests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error, count, success: !error }
}
