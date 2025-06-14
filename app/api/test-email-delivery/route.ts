import { NextResponse } from "next/server"
import { sendBrevoEmailFetch, verifyBrevoApiKey } from "@/lib/brevo-fetch"

export async function GET() {
  console.log("🧪 Starting comprehensive email delivery test...")

  try {
    // Step 1: Check environment variables
    console.log("🧪 Step 1: Checking environment variables...")
    const envCheck = {
      hasBrevoKey: !!process.env.BREVO_API_KEY,
      keyLength: process.env.BREVO_API_KEY?.length || 0,
      keyPreview: process.env.BREVO_API_KEY?.substring(0, 8) + "..." || "none",
    }

    console.log("🧪 Environment check:", envCheck)

    if (!envCheck.hasBrevoKey) {
      return NextResponse.json({
        success: false,
        error: "BREVO_API_KEY environment variable is missing",
        envCheck,
      })
    }

    // Step 2: Verify API key
    console.log("🧪 Step 2: Verifying Brevo API key...")
    const keyVerification = verifyBrevoApiKey()
    console.log("🧪 Key verification result:", keyVerification)

    // Step 3: Test API connectivity
    console.log("🧪 Step 3: Testing Brevo API connectivity...")
    const testResponse = await fetch("https://api.brevo.com/v3/account", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
    })

    const accountInfo = await testResponse.json()
    console.log("🧪 Brevo account response:", accountInfo)

    if (!testResponse.ok) {
      return NextResponse.json({
        success: false,
        error: "Brevo API key is invalid or account is not accessible",
        statusCode: testResponse.status,
        accountInfo,
        envCheck,
        keyVerification,
      })
    }

    // Step 4: Send test email
    console.log("🧪 Step 4: Sending test email...")
    const testEmailResult = await sendBrevoEmailFetch({
      to: "contact@euronegocetrade.com", // Correct email address
      subject: `🧪 Email Delivery Test - ${new Date().toISOString()}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">✅ Email Delivery Test Successful!</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Euro Negoce Trade - Email System Test</p>
          </div>
          
          <div style="padding: 20px;">
            <h3 style="color: #374151;">📧 Test Results:</h3>
            <ul style="color: #6b7280;">
              <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>API Key Status:</strong> ${keyVerification.message}</li>
              <li><strong>Account Email:</strong> ${accountInfo.email || "Not available"}</li>
              <li><strong>Account Plan:</strong> ${accountInfo.plan?.type || "Not available"}</li>
              <li><strong>Email Credits:</strong> ${accountInfo.plan?.creditsType || "Not available"}</li>
              <li><strong>Recipient:</strong> contact@euronegocetrade.com</li>
            </ul>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #0369a1;">
                <strong>✅ If you receive this email at contact@euronegocetrade.com, your Brevo integration is working correctly!</strong>
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This test email was sent from your Euro Negoce website to verify email delivery functionality using Brevo API.
            </p>
          </div>
        </div>
      `,
    })

    console.log("🧪 Test email result:", testEmailResult)

    return NextResponse.json({
      success: true,
      message: "Email delivery test completed successfully",
      results: {
        envCheck,
        keyVerification,
        accountInfo: {
          email: accountInfo.email,
          plan: accountInfo.plan?.type,
          credits: accountInfo.plan?.creditsType,
        },
        testEmailResult,
        recipientEmail: "contact@euronegocetrade.com",
      },
    })
  } catch (error) {
    console.error("🧪 Email delivery test failed:", error)

    return NextResponse.json({
      success: false,
      error: "Email delivery test failed",
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    })
  }
}
