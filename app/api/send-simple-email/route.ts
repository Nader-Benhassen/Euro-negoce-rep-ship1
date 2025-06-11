// Alternative email method using a simple HTTP service
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, selectedProduct, type = "contact" } = body

    console.log("=== SIMPLE EMAIL SEND ===")
    console.log("Type:", type)
    console.log("From:", email)
    console.log("Name:", name)

    // Create a simple email content
    const emailContent = {
      to: "euronegoce.mail@gmail.com",
      subject: type === "quote" ? `🔥 QUOTE REQUEST: ${company}` : `📧 CONTACT: ${name}`,
      content: `
NEW ${type.toUpperCase()} FROM WEBSITE
================================

Contact Information:
- Name: ${name}
- Email: ${email}
- Company: ${company || "Not provided"}
- Phone: ${phone || "Not provided"}
${selectedProduct ? `- Product Interest: ${selectedProduct}` : ""}

Message:
${message}

Sent: ${new Date().toLocaleString()}
Type: ${type}
================================

Reply to: ${email}
      `,
    }

    // Try multiple email methods
    const methods = []

    // Method 1: Resend (if available)
    if (process.env.RESEND_API_KEY) {
      try {
        const resendData = {
          from: "noreply@euronegocetrade.com",
          to: ["euronegoce.mail@gmail.com"],
          reply_to: email,
          subject: emailContent.subject,
          text: emailContent.content,
          html: `
            <div style="font-family: monospace; white-space: pre-wrap; background: #f9f9f9; padding: 20px; border-radius: 8px;">
              ${emailContent.content.replace(/\n/g, "<br>")}
            </div>
          `,
        }

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resendData),
        })

        const resendResult = await resendResponse.json()

        methods.push({
          method: "Resend",
          success: resendResponse.ok,
          result: resendResult,
          status: resendResponse.status,
        })

        if (resendResponse.ok) {
          console.log("✅ Email sent via Resend:", resendResult.id)
          return Response.json({
            success: true,
            message: "Email sent successfully via Resend",
            method: "Resend",
            emailId: resendResult.id,
          })
        }
      } catch (resendError) {
        methods.push({
          method: "Resend",
          success: false,
          error: resendError.message,
        })
      }
    }

    // Method 2: Webhook/HTTP notification (fallback)
    try {
      // This creates a log that can be monitored
      const logData = {
        timestamp: new Date().toISOString(),
        type: "email_fallback",
        data: emailContent,
        source: "euro_negoce_website",
      }

      console.log("📧 EMAIL FALLBACK LOG:", JSON.stringify(logData, null, 2))

      methods.push({
        method: "Console Log",
        success: true,
        message: "Email logged to console - check server logs",
      })

      // Return success with instructions
      return Response.json({
        success: true,
        message: "Message received! We will contact you within 24 hours.",
        methods: methods,
        fallback: true,
        instructions: "Email has been logged. Check server console logs or contact support.",
      })
    } catch (fallbackError) {
      methods.push({
        method: "Fallback",
        success: false,
        error: fallbackError.message,
      })
    }

    // If all methods fail
    console.error("❌ All email methods failed:", methods)

    return Response.json(
      {
        success: false,
        error: "All email delivery methods failed",
        methods: methods,
        support: "Please contact euronegoce.mail@gmail.com directly",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("❌ Simple email error:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
