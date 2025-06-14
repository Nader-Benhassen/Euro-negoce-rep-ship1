"use server"

import { sendTransactionalEmail } from "@/lib/brevo-email" // This import should now work

export async function sendQuoteRequest(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const selectedProducts = formData.get("selectedProducts") as string
    const customProducts = formData.get("customProducts") as string
    const totalQuantity = formData.get("totalQuantity") as string
    const deliveryLocation = formData.get("deliveryLocation") as string
    const timeline = formData.get("timeline") as string
    const message = formData.get("message") as string

    if (!name || !email || !company || !totalQuantity || !deliveryLocation || !message) {
      return { success: false, message: "Please fill out all required fields." }
    }

    const subject = `New Quote Request from ${name} (${company})`
    const htmlContent = `
      <h1>New Quote Request from Website</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <hr>
      <h2>Order Details</h2>
      <p><strong>Selected Products:</strong> ${selectedProducts || "None"}</p>
      <p><strong>Other Products:</strong> ${customProducts || "None"}</p>
      <p><strong>Total Estimated Quantity:</strong> ${totalQuantity}</p>
      <p><strong>Delivery Location:</strong> ${deliveryLocation}</p>
      <p><strong>Preferred Timeline:</strong> ${timeline || "Not specified"}</p>
      <hr>
      <h2>Additional Message</h2>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `

    // Ensure the parameters match the SendTransactionalEmailParams interface
    await sendTransactionalEmail({
      to: [{ email: "contact@euronegocetrade.com", name: "Euro Negoce Trade" }],
      subject,
      htmlContent,
      sender: { email: "noreply@euronegocetrade.com", name: "Euro Negoce Website" },
      replyTo: { email, name },
    })

    return {
      success: true,
      message: "Your quote request has been sent successfully! We will get back to you shortly.",
    }
  } catch (error) {
    console.error("Error in sendQuoteRequest action:", error)
    return {
      success: false,
      message: `An unexpected error occurred while sending your request: ${error instanceof Error ? error.message : String(error)}. Please try again later or contact us directly.`,
    }
  }
}
