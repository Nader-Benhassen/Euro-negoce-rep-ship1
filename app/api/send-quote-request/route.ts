import { type NextRequest, NextResponse } from "next/server"
import { sendBrevoEmailFetch } from "@/lib/brevo-fetch"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, companyName, phoneNumber, productOfInterest, quantity, message } = body

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">🔥 URGENT Quote Request</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Priority response required within 24 hours</p>
        </div>
        
        <div style="padding: 20px;">
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-weight: bold;">
              ⚡ HIGH PRIORITY: Customer expects quote within 24 hours
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold;">Name:</td><td style="padding: 5px 0;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Email:</td><td style="padding: 5px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Company:</td><td style="padding: 5px 0;">${companyName}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Phone:</td><td style="padding: 5px 0;">${phoneNumber || "Not provided"}</td></tr>
            </table>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">📦 Product Requirements</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold;">Product of Interest:</td><td style="padding: 5px 0;">${productOfInterest}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Quantity:</td><td style="padding: 5px 0; color: #dc2626; font-weight: bold;">${quantity}</td></tr>
            </table>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">💬 Additional Requirements</h3>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #dc2626;">
              <p style="white-space: pre-wrap; margin: 0;">${message || "No additional requirements specified"}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #fee2e2; border-radius: 8px; border-left: 4px solid #dc2626;">
            <p style="margin: 0; color: #dc2626; font-weight: bold;">
              ⚡ ACTION REQUIRED: Respond within 24 hours<br>
              📧 Reply directly to this email to respond to ${firstName} ${lastName}
            </p>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            📅 Sent: ${new Date().toLocaleString()}<br>
            🌐 From: Euro Negoce Trade Website (via Brevo)
          </p>
        </div>
      </div>
    `

    const result = await sendBrevoEmailFetch({
      subject: "🔥 URGENT Quote Request - Euro Negoce Trade",
      htmlContent: htmlContent,
      replyTo: email,
    })

    return NextResponse.json({
      status: "success",
      message: "Email sent successfully via Brevo!",
      data: result.data,
    })
  } catch (error) {
    console.error("❌ Quote request email failed:", error)
    return NextResponse.json({
      status: "error",
      message: "Failed to send email via Brevo.",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
