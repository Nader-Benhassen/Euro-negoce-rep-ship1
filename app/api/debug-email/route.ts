export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPreview: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 8)}...` : "NOT_SET",
    },
    tests: [],
  }

  // Test 1: Environment check
  if (!process.env.RESEND_API_KEY) {
    debugInfo.tests.push({
      test: "Environment Variables",
      status: "❌ FAIL",
      issue: "RESEND_API_KEY is not set",
      solution: "Add RESEND_API_KEY to your environment variables in one-com hosting panel",
    })
    return Response.json(debugInfo)
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
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
    })

    if (testResponse.ok) {
      const domains = await testResponse.json()
      debugInfo.tests.push({
        test: "Resend API Connection",
        status: "✅ PASS",
        message: "Successfully connected to Resend API",
        domains: domains.data?.map((d) => ({ name: d.name, status: d.status })) || [],
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
      issue: `Network error: ${error.message}`,
      solution: "Check internet connectivity or firewall settings",
    })
  }

  // Test 3: Send actual test email
  try {
    const testEmail = {
      from: "noreply@euronegocetrade.com",
      to: ["euronegoce.mail@gmail.com"],
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

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEmail),
    })

    const emailResult = await emailResponse.json()

    if (emailResponse.ok) {
      debugInfo.tests.push({
        test: "Send Test Email",
        status: "✅ PASS",
        message: "Test email sent successfully",
        emailId: emailResult.id,
        checkInstructions: "Check euronegoce.mail@gmail.com inbox and spam folder",
      })
    } else {
      debugInfo.tests.push({
        test: "Send Test Email",
        status: "❌ FAIL",
        issue: `Failed to send: ${emailResult.message}`,
        details: emailResult,
        solution: "Check domain verification and DNS settings",
      })
    }
  } catch (error) {
    debugInfo.tests.push({
      test: "Send Test Email",
      status: "❌ FAIL",
      issue: `Exception: ${error.message}`,
      solution: "Check network connectivity and API configuration",
    })
  }

  return Response.json(debugInfo)
}
