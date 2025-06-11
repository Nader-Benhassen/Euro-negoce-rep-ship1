"use server"

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string
  const selectedProduct = formData.get("selectedProduct") as string

  // In a real application, you would use a service like Nodemailer, SendGrid, or Resend
  // For now, we'll simulate the email sending

  const emailContent = `
    New Contact Form Submission
    
    Name: ${name}
    Email: ${email}
    Company: ${company || "Not provided"}
    Phone: ${phone || "Not provided"}
    Selected Product: ${selectedProduct || "General inquiry"}
    
    Message:
    ${message}
    
    ---
    This email was sent from the Euro Negoce website contact form.
  `

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In production, you would send the email here
  console.log("Email would be sent to: contact@euronegocetrade.com")
  console.log("Email content:", emailContent)

  return {
    success: true,
    message: "Your message has been sent successfully. We will contact you soon!",
  }
}

export async function sendQuoteRequest(formData: FormData) {
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

  const emailContent = `
    New Quote Request
    
    Contact Information:
    Name: ${name}
    Email: ${email}
    Company: ${company}
    Phone: ${phone || "Not provided"}
    
    Product Details:
    Selected Products: ${selectedProducts || "None selected"}
    Custom Products: ${customProducts || "None specified"}
    Total Quantity: ${totalQuantity}
    Delivery Location: ${deliveryLocation}
    Timeline: ${timeline || "Not specified"}
    
    Additional Requirements:
    ${message}
    
    ---
    This email was sent from the Euro Negoce website quote request form.
  `

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In production, you would send the email here
  console.log("Quote request would be sent to: contact@euronegocetrade.com")
  console.log("Email content:", emailContent)

  return {
    success: true,
    message: "Your quote request has been sent successfully. Our team will contact you within 24 hours.",
  }
}
