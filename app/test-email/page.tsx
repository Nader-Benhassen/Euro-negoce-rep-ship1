"use client"

import { useState } from "react"

export default function TestEmailPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<string | null>(null)

  const runTest = async (endpoint: string, method = "GET") => {
    setLoading(endpoint)
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          data,
          timestamp: new Date().toISOString(),
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>🔥 Email System Diagnostic</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Step 1: Basic API Test</h2>
        <button
          onClick={() => runTest("simple-test", "GET")}
          disabled={loading === "simple-test"}
          style={{ marginRight: "10px", padding: "10px" }}
        >
          {loading === "simple-test" ? "Testing..." : "Test GET Endpoint"}
        </button>

        <button
          onClick={() => runTest("simple-test", "POST")}
          disabled={loading === "simple-test"}
          style={{ padding: "10px" }}
        >
          {loading === "simple-test" ? "Testing..." : "Test POST Endpoint"}
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Step 2: Basic Resend Test</h2>
        <button
          onClick={() => runTest("basic-resend-test", "POST")}
          disabled={loading === "basic-resend-test"}
          style={{ padding: "10px" }}
        >
          {loading === "basic-resend-test" ? "Testing..." : "Test Resend SDK"}
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Step 3: Direct API Test</h2>
        <button
          onClick={() => runTest("direct-resend-test", "POST")}
          disabled={loading === "direct-resend-test"}
          style={{ padding: "10px" }}
        >
          {loading === "direct-resend-test" ? "Testing..." : "Test Direct API"}
        </button>
      </div>

      <div>
        <h2>Results:</h2>
        <pre style={{ background: "#f5f5f5", padding: "20px", overflow: "auto" }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  )
}
