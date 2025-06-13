import { testBrevoEmailConfig, verifyBrevoApiKey } from "@/lib/brevo-email"

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
    const testResult = await testBrevoEmailConfig()

    if (!testResult.success) {
      testResults.tests.push({
        test: "Send Test Email",
        status: "FAIL",
        message: `Brevo API Error: ${testResult.error || "Unknown error"}`,
        details: testResult,
      })
    } else {
      testResults.tests.push({
        test: "Send Test Email",
        status: "PASS",
        message: `Email sent successfully via Brevo. ID: ${testResult.testResult?.data?.id}`,
        emailId: testResult.testResult?.data?.id,
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

export async function POST() {
  // Send a test email to a specific address
  try {
    const testResult = await testBrevoEmailConfig()

    return Response.json({
      success: testResult.success,
      result: testResult,
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
