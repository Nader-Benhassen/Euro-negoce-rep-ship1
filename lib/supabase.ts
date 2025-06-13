import { createClient } from "@supabase/supabase-js"

// Types for database tables
export type Contact = {
  id?: string
  name: string
  email: string
  company: string | null
  phone: string | null
  message: string
  selected_product: string | null
  status?: string
  created_at?: string
  updated_at?: string
}

export type ScheduledCall = {
  id?: string
  name: string
  email: string
  company: string | null
  phone: string | null
  call_date: string
  call_time: string
  timezone: string
  topic: string
  message: string | null
  status?: string
  created_at?: string
  updated_at?: string
}

export type QuoteRequest = {
  id?: string
  name: string
  email: string
  company: string | null
  phone: string | null
  product: string
  quantity: string | null
  delivery_location: string | null
  additional_requirements: string | null
  status?: string
  created_at?: string
  updated_at?: string
}

export type EmailLog = {
  id?: string
  email_type: string
  recipient_email: string
  subject: string | null
  status: string
  resend_email_id: string | null
  error_message: string | null
  related_contact_id?: string | null
  related_call_id?: string | null
  related_quote_id?: string | null
  created_at?: string
}

// Create a singleton Supabase client
let supabase: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabase) return supabase

  const supabaseUrl = process.env.EURONEGOCE_DB_SUPABASE_URL
  const supabaseKey = process.env.EURONEGOCE_DB_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase credentials not found in environment variables")
    throw new Error("Supabase credentials not found")
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log("✅ Supabase client initialized successfully")
    return supabase
  } catch (error) {
    console.error("❌ Failed to initialize Supabase client:", error)
    throw new Error("Failed to initialize Supabase client")
  }
}
