export async function GET() {
  try {
    // Test email configuration
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        resendKeyLength: process.env.RESEND_API_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV,
      },
      tests: [],
    }

    // Test 1: Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      testResults.tests.push({
        test: "Resend API Key",
        status: "FAIL",
        message: "RESEND_API_KEY environment variable not found",
      })
      return Response.json(testResults)
    }

    testResults.tests.push({
      test: "Resend API Key",
      status: "PASS",
      message: "API key found",
    })

    // Test 2: Try to send a test email
    const testEmailData = {
      from: "noreply@euronegocetrade.com",
      to: ["euronegoce.mail@gmail.com"],
      subject: "🧪 Email System Test - Euro Negoce Trade",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Email System Test</h2>
          <p>This is a test email to verify the email system is working correctly.</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <p><strong>Test Details:</strong></p>
            <p>Time: ${new Date().toLocaleString()}</p>
            <p>System: Euro Negoce Trade Website</p>
            <p>Status: Email delivery successful ✅</p>
          </div>
          <p>If you receive this email, the system is working correctly.</p>
        </div>
      `,
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEmailData),
    })

    const responseData = await response.json()

    if (!response.ok) {
      testResults.tests.push({
        test: "Send Test Email",
        status: "FAIL",
        message: `Resend API Error: ${responseData.message || "Unknown error"}`,
        details: responseData,
      })
    } else {
      testResults.tests.push({
        test: "Send Test Email",
        status: "PASS",
        message: `Email sent successfully. ID: ${responseData.id}`,
        emailId: responseData.id,
      })
    }

    return Response.json(testResults)
  } catch (error) {
    return Response.json({
      timestamp: new Date().toISOString(),
      error: "Test failed with exception",
      message: error.message,
      stack: error.stack,
    })
  }
}

export async function POST() {
  // Send a test email to a specific address
  try {
    const testEmail = {
      from: "noreply@euronegocetrade.com",
      to: ["euronegoce.mail@gmail.com"],
      subject: "Manual Email Test - Euro Negoce Trade",
      html: `
        <h2>Manual Email Test</h2>
        <p>This email was sent manually to test the email system.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>If you receive this, the email system is working!</p>
      `,
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEmail),
    })

    const result = await response.json()

    return Response.json({
      success: response.ok,
      status: response.status,
      result,
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    })
  }
}
