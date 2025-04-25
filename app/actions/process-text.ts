"use server"

import { getFromCache, setInCache } from "@/lib/redis"
import { createHash } from "crypto"

// Generate a cache key based on the input text
function generateCacheKey(text: string, useCache: boolean): string {
  const hash = createHash("sha256").update(text).digest("hex")
  return `text-processing:${hash}`
}

// Process text with optional caching
export async function processText(
  text: string,
  useCache: boolean,
): Promise<{
  result: string
  timeTaken: number
  cacheHit: boolean
}> {
  const startTime = performance.now()

  // Generate cache key
  const cacheKey = generateCacheKey(text, useCache)

  // Try to get from cache if useCache is true
  if (useCache) {
    const cachedResult = await getFromCache<{ result: string }>(cacheKey)

    if (cachedResult) {
      const endTime = performance.now()
      return {
        result: cachedResult.result,
        timeTaken: Math.round(endTime - startTime),
        cacheHit: true,
      }
    }
  }

  // If not in cache or not using cache, process the text
  // Simulate processing delay - in a real app, this would be an LLM call
  const delay = 2000 // Consistent delay for processing
  await new Promise((resolve) => setTimeout(resolve, delay))

  // Simple text processing - in a real app, this would be an LLM call
  const processedText = `Analysis of candidate profile:

Key strengths:
- Strong technical background in ${text.includes("engineering") ? "engineering" : "technology"}
- ${text.includes("experience") ? "Extensive experience in the field" : "Promising skill set"}
- ${text.includes("leadership") ? "Leadership qualities" : "Collaborative team player"}

Areas for development:
- ${text.includes("communication") ? "Advanced communication skills" : "Communication skills could be improved"}
- ${text.includes("management") ? "Project management expertise" : "Project management experience"}

Recommendation: ${
    text.length > 100
      ? "Strong candidate, proceed to next interview round"
      : "Potential candidate, consider additional screening"
  }
`

  const result = { result: processedText }

  // Store in cache if useCache is true
  if (useCache) {
    await setInCache(cacheKey, result, 3600) // Cache for 1 hour
  }

  const endTime = performance.now()

  return {
    result: processedText,
    timeTaken: Math.round(endTime - startTime),
    cacheHit: false,
  }
}
