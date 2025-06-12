import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function debugEmailConfig() {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    apiKey: {
      exists: !!resendApiKey,
      length: resendApiKey?.length || 0,
      prefix: resendApiKey?.substring(0, 8) + "..." || "none",
    },
    resendInstance: !!resend,
    errors: [] as string[],
  }

  // Test API key validity
  if (!resendApiKey) {
    debug.errors.push("RESEND_API_KEY environment variable not found")
    return debug
  }

  if (!resendApiKey.startsWith("re_")) {
    debug.errors.push("API key doesn't start with 're_' - invalid format")
    return debug
  }

  try {
    // Test with a simple API call
    const testResult = await resend?.emails.send({
      from: "onboarding@resend.dev", // Use Resend's default domain for testing
      to: "contact@euronegocetrade.com",
      subject: "Email System Test - " + new Date().toISOString(),
      html: `
        <h2>Email System Test</h2>
        <p>This is a test email to verify the email system is working.</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
        <p>Environment: ${process.env.NODE_ENV}</p>
      `,
    })

    return {
      ...debug,
      testResult,
      success: true,
    }
  } catch (error) {
    debug.errors.push(`API test failed: ${error instanceof Error ? error.message : String(error)}`)
    return {
      ...debug,
      error,
      success: false,
    }
  }
}

export async function sendTestEmail() {
  try {
    if (!resend) {
      throw new Error("Resend not initialized - check API key")
    }

    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Use Resend's verified domain
      to: "contact@euronegocetrade.com",
      subject: "Test Email from Euro Negoce Website",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Test Email Successful!</h2>
          <p>This test email confirms that your email system is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> Euro Negoce Website Email System</p>
          <p><strong>API Key Status:</strong> Valid and working</p>
        </div>
      `,
    })

    return { success: true, result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
