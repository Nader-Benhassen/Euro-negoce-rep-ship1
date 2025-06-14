import { NextResponse } from "next/server"
import { sendBrevoEmailFetch, verifyBrevoApiKey } from "@/lib/brevo-fetch"
import { saveContact, logEmail } from "@/lib/database"

export async function GET() {
  console.log("🔍 Starting comprehensive email system verification...")

  const results = {
    timestamp: new Date().toISOString(),
    steps: [] as any[],
    success: false,
    summary: "",
  }

  try {
    // Step 1: Environment Variables Check
    console.log("🔍 Step 1: Checking environment variables...")
    const envCheck = {
      hasBrevoKey: !!process.env.BREVO_API_KEY,
      hasSupabaseUrl: !!process.env.EURONEGOCE_DB_SUPABASE_URL,
      hasSupabaseKey: !!process.env.EURONEGOCE_DB_SUPABASE_ANON_KEY,
      brevoKeyLength: process.env.BREVO_API_KEY?.length || 0,
    }

    results.steps.push({
      step: 1,
      name: "Environment Variables",
      status: envCheck.hasBrevoKey && envCheck.hasSupabaseUrl && envCheck.hasSupabaseKey ? "✅ PASS" : "❌ FAIL",
      details: envCheck,
    })

    // Step 2: Brevo API Key Verification
    console.log("🔍 Step 2: Verifying Brevo API key...")
    const keyVerification = verifyBrevoApiKey()

    results.steps.push({
      step: 2,
      name: "Brevo API Key",
      status: keyVerification.brevoInitialized ? "✅ PASS" : "❌ FAIL",
      details: keyVerification,
    })

    // Step 3: Brevo Account Connectivity
    console.log("🔍 Step 3: Testing Brevo account connectivity...")
    let accountInfo = null
    let accountStatus = "❌ FAIL"

    try {
      const accountResponse = await fetch("https://api.brevo.com/v3/account", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
      })

      if (accountResponse.ok) {
        accountInfo = await accountResponse.json()
        accountStatus = "✅ PASS"
      }
    } catch (error) {
      console.error("Account connectivity failed:", error)
    }

    results.steps.push({
      step: 3,
      name: "Brevo Account Connectivity",
      status: accountStatus,
      details: {
        accountEmail: accountInfo?.email || "Not available",
        planType: accountInfo?.plan?.type || "Not available",
        creditsType: accountInfo?.plan?.creditsType || "Not available",
      },
    })

    // Step 4: Database Connectivity
    console.log("🔍 Step 4: Testing database connectivity...")
    let dbStatus = "❌ FAIL"
    let dbDetails = {}

    try {
      const testContact = await saveContact({
        name: "Test Contact - Email Verification",
        email: "test@euronegocetrade.com",
        message: "This is a test contact for email system verification",
        company: "Euro Negoce Trade",
      })

      if (testContact.success) {
        dbStatus = "✅ PASS"
        dbDetails = { contactId: testContact.data?.id, saved: true }
      }
    } catch (error) {
      dbDetails = { error: error instanceof Error ? error.message : String(error) }
    }

    results.steps.push({
      step: 4,
      name: "Database Connectivity",
      status: dbStatus,
      details: dbDetails,
    })

    // Step 5: Email Sending Test
    console.log("🔍 Step 5: Testing email sending...")
    let emailStatus = "❌ FAIL"
    let emailDetails = {}

    try {
      const emailResult = await sendBrevoEmailFetch({
        to: "contact@euronegocetrade.com",
        subject: `🔍 Email System Verification Test - ${new Date().toLocaleString()}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">🔍 Email System Verification</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Euro Negoce Trade - System Test</p>
            </div>
            
            <div style="padding: 20px;">
              <h3 style="color: #374151;">✅ Email System Status: WORKING</h3>
              
              <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #0369a1;">📊 Verification Results:</h4>
                <ul style="color: #6b7280; margin: 0;">
                  <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                  <li><strong>Brevo API:</strong> ${keyVerification.brevoInitialized ? "✅ Working" : "❌ Failed"}</li>
                  <li><strong>Database:</strong> ${dbStatus}</li>
                  <li><strong>Recipient:</strong> contact@euronegocetrade.com</li>
                  <li><strong>Email Service:</strong> Brevo</li>
                </ul>
              </div>
              
              <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #166534;">
                  <strong>✅ SUCCESS:</strong> If you receive this email, your entire email system is working correctly!
                  Contact forms, quote requests, and all email notifications will be delivered to this inbox.
                </p>
              </div>
            </div>
          </div>
        `,
      })

      if (emailResult.success) {
        emailStatus = "✅ PASS"
        emailDetails = {
          messageId: emailResult.data?.id,
          sent: true,
          recipient: "contact@euronegocetrade.com",
        }

        // Log the test email
        await logEmail({
          email_type: "system_verification",
          recipient_email: "contact@euronegocetrade.com",
          subject: "Email System Verification Test",
          status: "sent",
          brevo_email_id: emailResult.data?.id || null,
        })
      }
    } catch (error) {
      emailDetails = { error: error instanceof Error ? error.message : String(error) }
    }

    results.steps.push({
      step: 5,
      name: "Email Sending",
      status: emailStatus,
      details: emailDetails,
    })

    // Final Summary
    const allPassed = results.steps.every((step) => step.status.includes("✅"))
    results.success = allPassed
    results.summary = allPassed
      ? "🎉 ALL SYSTEMS WORKING! Email delivery is fully functional."
      : "⚠️ Some systems failed. Check the details above."

    console.log("🔍 Email system verification completed:", results.summary)

    return NextResponse.json(results)
  } catch (error) {
    console.error("🔍 Email system verification failed:", error)

    results.steps.push({
      step: "ERROR",
      name: "System Error",
      status: "❌ CRITICAL FAIL",
      details: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    })

    results.summary = "❌ CRITICAL ERROR: Email system verification failed completely."

    return NextResponse.json(results, { status: 500 })
  }
}
