// Webhook endpoint that can be monitored externally
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, selectedProduct, type = "contact" } = body

    // Create a structured email notification
    const notification = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      type: type,
      urgent: type === "quote",
      contact: {
        name,
        email,
        company: company || "Not provided",
        phone: phone || "Not provided",
      },
      content: {
        message,
        selectedProduct: selectedProduct || null,
      },
      metadata: {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        source: "euro_negoce_website",
      },
    }

    // Log the notification (this can be monitored by external services)
    console.log("🔔 NEW WEBSITE NOTIFICATION:")
    console.log("=".repeat(50))
    console.log(JSON.stringify(notification, null, 2))
    console.log("=".repeat(50))

    // You can also write to a file or database here
    // For now, we'll just return the notification

    return Response.json({
      success: true,
      message: "Notification received and logged",
      notificationId: notification.id,
      instructions: [
        "Your message has been received and logged",
        "Our team monitors these notifications regularly",
        "You will be contacted within 24 hours",
        "For urgent matters, email euronegoce.mail@gmail.com directly",
      ],
    })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
