import { NextResponse } from "next/server"

export async function GET() {
  try {
    const deploymentInfo = {
      status: "READY",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      platform: process.env.VERCEL ? "Vercel" : process.env.NETLIFY ? "Netlify" : "Other",
      version: "1.0.0",
      build: {
        node: process.version,
        nextjs: "14.0.3",
        ready: true,
      },
      services: {
        database: !!process.env.EURONEGOCE_DB_SUPABASE_URL,
        email: !!process.env.BREVO_API_KEY,
        domain: !!process.env.NEXT_PUBLIC_SITE_URL,
      },
      endpoints: [
        "/api/send-contact-email",
        "/api/send-quote-request",
        "/api/schedule-call",
        "/api/deployment-check",
        "/api/verify-email-system",
      ],
    }

    return NextResponse.json({
      ...deploymentInfo,
      message: "🚀 Deployment is ready and available!",
      deploymentAvailable: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "ERROR",
        deploymentAvailable: false,
        error: error instanceof Error ? error.message : String(error),
        message: "❌ Deployment configuration error",
      },
      { status: 500 },
    )
  }
}
