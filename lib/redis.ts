import { createClient } from "redis"

// Create Redis client singleton
let redisClient: ReturnType<typeof createClient> | null = null

export async function getRedisClient() {
  if (!redisClient) {
    // Create a new Redis client if one doesn't exist
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    })

    // Handle errors
    redisClient.on("error", (err) => {
      console.error("Redis client error:", err)
      redisClient = null
    })

    // Connect to Redis
    await redisClient.connect()
  }

  return redisClient
}

// Helper function to get a value from Redis
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient()
    const value = await client.get(key)
    return value ? (JSON.parse(value) as T) : null
  } catch (error) {
    console.error("Error getting from Redis cache:", error)
    return null
  }
}

// Helper function to set a value in Redis
export async function setInCache(key: string, value: any, expiryInSeconds = 3600): Promise<boolean> {
  try {
    const client = await getRedisClient()
    await client.set(key, JSON.stringify(value), { EX: expiryInSeconds })
    return true
  } catch (error) {
    console.error("Error setting Redis cache:", error)
    return false
  }
}
