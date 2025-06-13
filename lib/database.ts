import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.EURONEGOCE_DB_SUPABASE_URL!
const supabaseKey = process.env.EURONEGOCE_DB_SUPABASE_ANON_KEY!

// Create a singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseClient
}

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

// Save contact form submission
export async function saveContact(contactData: ContactData) {
  try {
    console.log("💾 Saving contact to database:", contactData)

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("contacts").insert([contactData]).select().single()

    if (error) {
      console.error("❌ Database error saving contact:", error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    console.log("✅ Contact saved successfully:", data)
    return {
      success: true,
      error: null,
      data,
    }
  } catch (error) {
    console.error("❌ Exception saving contact:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    }
  }
}

// Save scheduled call
export async function saveScheduledCall(callData: CallData) {
  try {
    console.log("💾 Saving scheduled call to database:", callData)

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("scheduled_calls").insert([callData]).select().single()

    if (error) {
      console.error("❌ Database error saving call:", error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    console.log("✅ Scheduled call saved successfully:", data)
    return {
      success: true,
      error: null,
      data,
    }
  } catch (error) {
    console.error("❌ Exception saving call:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    }
  }
}

// Log email delivery
export async function logEmail(emailData: EmailLogData) {
  try {
    console.log("📧 Logging email to database:", emailData)

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("email_logs").insert([emailData]).select().single()

    if (error) {
      console.error("❌ Database error logging email:", error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    console.log("✅ Email logged successfully:", data)
    return {
      success: true,
      error: null,
      data,
    }
  } catch (error) {
    console.error("❌ Exception logging email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    }
  }
}

// Get all contacts (for admin) - with both function names for compatibility
export async function getAllContacts() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Database error fetching contacts:", error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      error: null,
      data,
    }
  } catch (error) {
    console.error("❌ Exception fetching contacts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    }
  }
}

// Export with the expected name for admin APIs
export const getContacts = getAllContacts

// Get all scheduled calls (for admin) - with both function names for compatibility
export async function getAllScheduledCalls() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("scheduled_calls").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Database error fetching calls:", error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      error: null,
      data,
    }
  } catch (error) {
    console.error("❌ Exception fetching calls:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    }
  }
}

// Export with the expected name for admin APIs
export const getScheduledCalls = getAllScheduledCalls

// Get all email logs (for admin) - with both function names for compatibility
export async function getAllEmailLogs() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("email_logs").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Database error fetching email logs:", error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      error: null,
      data,
    }
  } catch (error) {
    console.error("❌ Exception fetching email logs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    }
  }
}

// Export with the expected name for admin APIs
export const getEmailLogs = getAllEmailLogs
