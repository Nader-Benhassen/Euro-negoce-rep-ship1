"use server"

import { sendBrevoEmailFetch } from "@/lib/brevo-fetch"
import { saveContact, logEmail } from "@/lib/database"
import { z } from "zod"

// Define a schema for validating form data for robustness
const QuoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  phone: z.string().optional(),
  selectedProducts: z.string().optional(),
  customProducts: z.string().optional(),
  totalQuantity: z.string().min(1, "Estimated quantity is required"),
  deliveryLocation: z.string().min(1, "Delivery location is required"),
  timeline: z.string().optional(),
  message: z.string().min(1, "Message is required"),
})

export async function sendQuoteRequest(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries())
    const validation = QuoteSchema.safeParse(data)

    if (!validation.success) {
      const errorMessages = validation.error.errors.map((e) => e.message).join(", ")
      console.error("Validation failed:", errorMessages)
      return { success: false, message: `Validation failed: ${errorMessages}` }
    }

    const {
      name,
      email,
      company,
      phone,
      selectedProducts,
      customProducts,
      totalQuantity,
      deliveryLocation,
      timeline,
      message,
    } = validation.data

    const allProducts = [selectedProducts, customProducts].filter(Boolean).join(", ")

    // 1. Save contact to database
    const contactResult = await saveContact({
      name,
      email,
      company,
      phone: phone || null,
      message,
      selected_product: allProducts || null,
    })

    if (!contactResult.success) {
      console.error("Database save failed:", contactResult.error)
      // Log the error but continue to send the email to not lose the lead
    }

    // 2. Construct and send email via Brevo using the fetch-based utility
    const subject = `New Quote Request from ${company}`
    const htmlContent = `
      <h1>New Quote Request</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <hr>
      <h2>Order Details</h2>
      <p><strong>Products:</strong> ${allProducts || "Not specified"}</p>
      <p><strong>Estimated Quantity:</strong> ${totalQuantity}</p>
      <p><strong>Delivery Location:</strong> ${deliveryLocation}</p>
      <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
      <hr>
      <h2>Message</h2>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `

    const emailResult = await sendBrevoEmailFetch({
      to: "contact@euronegocetrade.com",
      subject,
      htmlContent,
      replyTo: email,
    })

    // 3. Log the email sending status to the database
    await logEmail({
      email_type: "quote_request",
      recipient_email: "contact@euronegocetrade.com",
      subject,
      status: emailResult.success ? "sent" : "failed",
      brevo_email_id: emailResult.data?.id || null,
      related_contact_id: contactResult.data?.id,
    })

    if (!emailResult.success) {
      console.error("Failed to send quote request email via Brevo:", emailResult.error)
      return {
        success: false,
        message:
          "Your request was submitted, but we had an issue sending the notification email. Our team will still review your request.",
      }
    }

    return {
      success: true,
      message: "Thank you! Your quote request has been sent successfully. Our team will get back to you shortly.",
    }
  } catch (error) {
    console.error("Error in sendQuoteRequest action:", error)
    return { success: false, message: "An unexpected server error occurred. Please try again later." }
  }
}
