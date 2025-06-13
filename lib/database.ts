import { getSupabaseClient, type Contact, type ScheduledCall, type QuoteRequest, type EmailLog } from "./supabase"

// Contact form functions
export async function saveContact(contact: Omit<Contact, "id" | "status" | "created_at" | "updated_at">) {
  try {
    console.log("🚀 Saving contact to database:", contact.name)
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("contacts")
      .insert({
        name: contact.name,
        email: contact.email,
        company: contact.company,
        phone: contact.phone,
        message: contact.message,
        selected_product: contact.selected_product,
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Database error saving contact:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Contact saved successfully with ID:", data.id)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Exception saving contact:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

export async function getContacts(limit = 100, offset = 0, status?: string) {
  try {
    const supabase = getSupabaseClient()

    let query = supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("❌ Database error getting contacts:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("❌ Exception getting contacts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Scheduled call functions
export async function saveScheduledCall(call: Omit<ScheduledCall, "id" | "status" | "created_at" | "updated_at">) {
  try {
    console.log("🚀 Saving scheduled call to database:", call.name)
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("scheduled_calls")
      .insert({
        name: call.name,
        email: call.email,
        company: call.company,
        phone: call.phone,
        call_date: call.call_date,
        call_time: call.call_time,
        timezone: call.timezone,
        topic: call.topic,
        message: call.message,
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Database error saving scheduled call:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Scheduled call saved successfully with ID:", data.id)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Exception saving scheduled call:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

export async function getScheduledCalls(limit = 100, offset = 0, status?: string) {
  try {
    const supabase = getSupabaseClient()

    let query = supabase
      .from("scheduled_calls")
      .select("*")
      .order("call_date", { ascending: true })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("❌ Database error getting scheduled calls:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("❌ Exception getting scheduled calls:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Quote request functions
export async function saveQuoteRequest(quote: Omit<QuoteRequest, "id" | "status" | "created_at" | "updated_at">) {
  try {
    console.log("🚀 Saving quote request to database:", quote.name)
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        name: quote.name,
        email: quote.email,
        company: quote.company,
        phone: quote.phone,
        product: quote.product,
        quantity: quote.quantity,
        delivery_location: quote.delivery_location,
        additional_requirements: quote.additional_requirements,
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Database error saving quote request:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Quote request saved successfully with ID:", data.id)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Exception saving quote request:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Email logging functions
export async function logEmail(log: Omit<EmailLog, "id" | "created_at">) {
  try {
    console.log("🚀 Logging email delivery:", log.email_type)
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("email_logs")
      .insert({
        email_type: log.email_type,
        recipient_email: log.recipient_email,
        subject: log.subject,
        status: log.status,
        resend_email_id: log.resend_email_id,
        error_message: log.error_message,
        related_contact_id: log.related_contact_id,
        related_call_id: log.related_call_id,
        related_quote_id: log.related_quote_id,
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Database error logging email:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Email log saved successfully with ID:", data.id)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Exception logging email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

export async function getEmailLogs(limit = 100, offset = 0, emailType?: string) {
  try {
    const supabase = getSupabaseClient()

    let query = supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (emailType) {
      query = query.eq("email_type", emailType)
    }

    const { data, error } = await query

    if (error) {
      console.error("❌ Database error getting email logs:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("❌ Exception getting email logs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}
