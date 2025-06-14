import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Deployment successful!",
    timestamp: new Date().toISOString(),
    node_version: process.version,
    environment: process.env.NODE_ENV || "development",
  })
}
