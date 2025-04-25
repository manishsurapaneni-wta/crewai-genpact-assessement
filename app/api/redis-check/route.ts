import { getRedisClient } from "@/lib/redis"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const client = await getRedisClient()
    await client.ping()
    return NextResponse.json({ status: "connected" })
  } catch (error) {
    console.error("Redis connection check failed:", error)
    return NextResponse.json({ status: "error", message: "Failed to connect to Redis" }, { status: 500 })
  }
}
