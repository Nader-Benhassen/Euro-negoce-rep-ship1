import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Types for our database operations
export interface ContactData {
  name: string
  email: string
  company?: string | null
  phone?: string | null
  message: string
  selected_product?: string | null
  // status?: string | null; // Add if you plan to use the status column from contacts table
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
  resend_email_id?: string | null // Changed from brevo_email_id to match schema
  related_contact_id?: string | null // Changed type from number to string for UUID
  related_call_id?: string | null // Changed type from number to string for UUID
  related_quote_id?: string | null // Added for quote requests, type string for UUID
  error_message?: string | null // Added to match schema
}

// Create a singleton Supabase client
let supabaseServerClient: SupabaseClient | null = null // Renamed for clarity

// Function to get Supabase client for SERVER-SIDE operations (uses service_role key)
export function getSupabaseServerClient(): SupabaseClient {
  if (!supabaseServerClient) {
    const supabaseUrl = process.env.EURONEGOCE_DB_SUPABASE_URL
    // IMPORTANT: Use the SERVICE_ROLE key for server-side operations to bypass RLS
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
      supabaseServerClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          // Disable auto-refreshing of tokens for service role client
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
  return supabaseServerClient
}

// --- Data saving and logging functions ---
// These functions will now use the server client
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
  // Ensure the object keys match the column names exactly, especially resend_email_id
  const payload = {
    email_type: emailData.email_type,
    recipient_email: emailData.recipient_email,
    subject: emailData.subject,
    status: emailData.status,
    resend_email_id: emailData.resend_email_id, // Ensure this matches the interface and table
    related_contact_id: emailData.related_contact_id,
    related_call_id: emailData.related_call_id,
    related_quote_id: emailData.related_quote_id,
    error_message: emailData.error_message,
  }
  const { data, error } = await supabase.from("email_logs").insert([payload]).select().single()
  if (error) console.error("DB_ERROR logEmail:", error.message, "Payload:", payload)
  return { data, error, success: !error }
}

// --- Admin data fetching functions ---
// These also need to use the server client to bypass RLS
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
