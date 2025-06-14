import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      deployment: "ready",
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
