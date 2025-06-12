import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function debugEmailConfig() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasResendKey: !!resendApiKey,
      resendKeyLength: resendApiKey?.length || 0,
      resendKeyPrefix: resendApiKey ? `${resendApiKey.substring(0, 8)}...` : "NOT_SET",
    },
    tests: [] as any[],
  }

  // Test 1: Environment check
  if (!resendApiKey) {
    debugInfo.tests.push({
      test: "Environment Variables",
      status: "❌ FAIL",
      issue: "RESEND_API_KEY is not set",
      solution: "Add RESEND_API_KEY to your environment variables",
    })
    return debugInfo
  }

  debugInfo.tests.push({
    test: "Environment Variables",
    status: "✅ PASS",
    message: "RESEND_API_KEY is configured",
  })

  // Test 2: API connectivity
  try {
    const testResponse = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
      },
    })

    if (testResponse.ok) {
      const domains = await testResponse.json()
      debugInfo.tests.push({
        test: "Resend API Connection",
        status: "✅ PASS",
        message: "Successfully connected to Resend API",
        domains: domains.data?.map((d: any) => ({ name: d.name, status: d.status })) || [],
      })
    } else {
      const error = await testResponse.json()
      debugInfo.tests.push({
        test: "Resend API Connection",
        status: "❌ FAIL",
        issue: `API returned ${testResponse.status}: ${error.message}`,
        solution: "Check if your RESEND_API_KEY is valid",
      })
    }
  } catch (error) {
    debugInfo.tests.push({
      test: "Resend API Connection",
      status: "❌ FAIL",
      issue: `Network error: ${error instanceof Error ? error.message : String(error)}`,
      solution: "Check internet connectivity or firewall settings",
    })
  }

  return debugInfo
}

export async function sendTestEmail() {
  if (!resend) {
    return {
      success: false,
      message: "Resend not initialized",
      error: "RESEND_API_KEY not configured",
    }
  }

  try {
    const testEmail = {
      from: "onboarding@resend.dev",
      to: ["contact@euronegocetrade.com"],
      subject: `🧪 Email Test - ${new Date().toLocaleString()}`,
      html: `
        <h2>🧪 Email System Test</h2>
        <p><strong>This is a test email from your Euro Negoce website.</strong></p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Time: ${new Date().toLocaleString()}</li>
            <li>From: Euro Negoce Trade Website</li>
            <li>Test ID: ${Math.random().toString(36).substring(7)}</li>
          </ul>
        </div>
        <p>If you receive this email, your email system is working correctly! ✅</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          This email was sent from your website's email testing system.
        </p>
      `,
    }

    const emailResult = await resend.emails.send(testEmail)

    return {
      success: true,
      message: "Test email sent successfully",
      emailId: emailResult.data?.id,
      checkInstructions: "Check contact@euronegocetrade.com inbox and spam folder",
      result: emailResult,
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : String(error),
      solution: "Check API key and domain configuration",
    }
  }
}
