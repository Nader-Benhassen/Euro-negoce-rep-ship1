"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EmailDebugPanel() {
  const [debugResult, setDebugResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const runDebug = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-email")
      const result = await response.json()
      setDebugResult(result)
    } catch (error) {
      setDebugResult({ error: error.message })
    }
    setLoading(false)
  }

  const sendTestEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/send-simple-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          company: "Test Company",
          message: "This is a test email from the debug panel",
          type: "contact",
        }),
      })
      const result = await response.json()
      alert(result.success ? "Test email sent!" : `Error: ${result.error}`)
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Email System Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={runDebug} disabled={loading}>
            {loading ? "Running..." : "🔍 Run Email Debug"}
          </Button>
          <Button onClick={sendTestEmail} disabled={loading} variant="outline">
            {loading ? "Sending..." : "📧 Send Test Email"}
          </Button>
        </div>

        {debugResult && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Debug Results:</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(debugResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800">📋 Troubleshooting Steps:</h4>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-blue-700">
            <li>Run the debug test above to check your configuration</li>
            <li>Check if emails are in the spam folder of euronegoce.mail@gmail.com</li>
            <li>Verify your RESEND_API_KEY is set in your hosting environment</li>
            <li>Make sure euronegocetrade.com is verified in your Resend dashboard</li>
            <li>Check your DNS records (SPF, DKIM) for the domain</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
