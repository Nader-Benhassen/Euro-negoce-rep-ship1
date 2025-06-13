import { sendBrevoEmailFetch, verifyBrevoApiKey } from "@/lib/brevo-fetch"

export async function GET() {
  try {
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: {
        hasBrevoKey: !!process.env.BREVO_API_KEY,
        brevoKeyLength: process.env.BREVO_API_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV,
      },
      tests: [],
    }

    // Test 1: Check if Brevo API key exists
    const keyVerification = verifyBrevoApiKey()

    if (!keyVerification.hasApiKey) {
      testResults.tests.push({
        test: "Brevo API Key",
        status: "FAIL",
        message: "BREVO_API_KEY environment variable not found",
      })
      return Response.json(testResults)
    }

    testResults.tests.push({
      test: "Brevo API Key",
      status: "PASS",
      message: "API key found",
    })

    // Test 2: Try to send a test email
    try {
      const testResult = await sendBrevoEmailFetch({
        subject: `🧪 Brevo Test Email - ${new Date().toISOString()}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #16a34a;">✅ Brevo Email System Test Successful!</h2>
            <p>This test email confirms that your email system is working correctly with the Brevo API.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Email Service:</strong> Brevo (via Fetch API)</p>
            <p style="color: #059669;">If you receive this email, your Brevo email system is working correctly! 🎉</p>
          </div>
        `,
      })

      testResults.tests.push({
        test: "Send Test Email",
        status: "PASS",
        message: `Email sent successfully via Brevo. ID: ${testResult.data?.id}`,
        emailId: testResult.data?.id,
      })
    } catch (emailError) {
      testResults.tests.push({
        test: "Send Test Email",
        status: "FAIL",
        message: `Brevo API Error: ${emailError instanceof Error ? emailError.message : String(emailError)}`,
      })
    }

    return Response.json(testResults)
  } catch (error) {
    return Response.json({
      timestamp: new Date().toISOString(),
      error: "Test failed with exception",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
