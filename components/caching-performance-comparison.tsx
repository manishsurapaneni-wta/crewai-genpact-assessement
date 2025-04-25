"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Zap, Clock, Database, ArrowRight, BarChartIcon } from "lucide-react"
import { motion } from "framer-motion"
import { processText } from "@/app/actions/process-text"

// Bar chart component to visualize latency difference
function LatencyBarChart({ noCacheTime, cachedTime }: { noCacheTime: number; cachedTime: number }) {
  const maxValue = Math.max(noCacheTime, cachedTime)
  const noCacheHeight = (noCacheTime / maxValue) * 100
  const cachedHeight = (cachedTime / maxValue) * 100

  return (
    <div className="w-full h-[200px] flex items-end justify-center gap-16 mt-4 mb-6">
      <div className="flex flex-col items-center">
        <div className="text-sm mb-2 font-medium">{noCacheTime} ms</div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${noCacheHeight}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-24 bg-gray-400 rounded-t-md relative group"
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded">
            No Cache
          </div>
        </motion.div>
        <div className="mt-2 flex items-center">
          <Clock className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-sm">No Cache</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-sm mb-2 font-medium text-blue-600">{cachedTime} ms</div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${cachedHeight}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="w-24 bg-blue-500 rounded-t-md relative group"
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-800 text-white text-xs px-2 py-1 rounded">
            Cached
          </div>
        </motion.div>
        <div className="mt-2 flex items-center">
          <Database className="h-4 w-4 text-blue-500 mr-1" />
          <span className="text-sm">Cached</span>
        </div>
      </div>
    </div>
  )
}

interface CachingPerformanceComparisonProps {
  title: string
  description: string
}

export function CachingPerformanceComparison({ title, description }: CachingPerformanceComparisonProps) {
  const [inputText, setInputText] = useState("")
  const [isProcessingNoCache, setIsProcessingNoCache] = useState(false)
  const [isProcessingCached, setIsProcessingCached] = useState(false)
  const [noCacheResult, setNoCacheResult] = useState<{ text: string; time: number } | null>(null)
  const [cachedResult, setCachedResult] = useState<{ text: string; time: number; cacheHit?: boolean } | null>(null)
  const [showPerformanceDifference, setShowPerformanceDifference] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "error" | "checking">("checking")
  const resultRef = useRef<HTMLDivElement>(null)

  // Update character count when input text changes
  useEffect(() => {
    setCharCount(inputText.length)
  }, [inputText])

  // Check Redis connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to check if Redis is connected
        const response = await fetch("/api/redis-check")
        if (response.ok) {
          setConnectionStatus("connected")
        } else {
          setConnectionStatus("error")
        }
      } catch (error) {
        console.error("Error checking Redis connection:", error)
        setConnectionStatus("error")
      }
    }

    checkConnection()
  }, [])

  const handleProcessNoCache = async () => {
    if (!inputText.trim() || isProcessingNoCache) return

    setIsProcessingNoCache(true)
    setNoCacheResult(null)
    setShowPerformanceDifference(false)

    try {
      const result = await processText(inputText, false)
      setNoCacheResult({
        text: result.result,
        time: result.timeTaken,
      })
    } catch (error) {
      console.error("Error processing text:", error)
    } finally {
      setIsProcessingNoCache(false)
    }
  }

  const handleProcessCached = async () => {
    if (!inputText.trim() || isProcessingCached) return

    setIsProcessingCached(true)
    setCachedResult(null)

    try {
      const result = await processText(inputText, true)
      setCachedResult({
        text: result.result,
        time: result.timeTaken,
        cacheHit: result.cacheHit,
      })

      // Only show performance difference when both results are available
      if (noCacheResult) {
        setShowPerformanceDifference(true)

        // Scroll to results if needed
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }, 100)
      }
    } catch (error) {
      console.error("Error processing text:", error)
    } finally {
      setIsProcessingCached(false)
    }
  }

  const calculateSpeedImprovement = () => {
    if (!noCacheResult || !cachedResult) return 0
    return Math.round(((noCacheResult.time - cachedResult.time) / noCacheResult.time) * 100)
  }

  const speedImprovement = calculateSpeedImprovement()

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {connectionStatus === "checking" ? (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Checking Redis...</span>
          ) : connectionStatus === "connected" ? (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Redis Connected</span>
          ) : (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Redis Error</span>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="input-text" className="text-sm font-medium">
              Input Text for Processing
            </label>
            <span className={`text-xs ${charCount > 500 ? "text-red-500" : "text-gray-500"}`}>
              {charCount}/1000 characters
            </span>
          </div>
          <Textarea
            id="input-text"
            placeholder="Enter candidate profile information to analyze..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px]"
            disabled={isProcessingNoCache || isProcessingCached}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500">
            Enter a description of a candidate to analyze. Try including terms like "engineering", "leadership", or
            "communication" to see how the analysis changes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleProcessNoCache}
            disabled={!inputText.trim() || isProcessingNoCache || isProcessingCached || connectionStatus === "error"}
            className="flex-1 flex items-center gap-2"
            variant="outline"
          >
            {isProcessingNoCache ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                Process (No Cache)
              </>
            )}
          </Button>
          <Button
            onClick={handleProcessCached}
            disabled={
              !inputText.trim() ||
              isProcessingCached ||
              isProcessingNoCache ||
              !noCacheResult ||
              connectionStatus === "error"
            }
            className="flex-1 flex items-center gap-2"
          >
            {isProcessingCached ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Process (Cached)
              </>
            )}
          </Button>
        </div>

        {/* Performance Visualization with Bar Chart */}
        {showPerformanceDifference && noCacheResult && cachedResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 border border-blue-100 rounded-md p-4"
          >
            <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
              <BarChartIcon className="h-5 w-5 text-blue-500" />
              Performance Comparison
            </h3>

            {/* Bar Chart Visualization */}
            <LatencyBarChart noCacheTime={noCacheResult.time} cachedTime={cachedResult.time} />

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-2">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm mr-1">No Cache:</span>
                <span className="font-mono font-medium">{noCacheResult.time} ms</span>
              </div>

              <ArrowRight className="hidden md:block h-5 w-5 text-gray-400" />

              <div className="flex items-center">
                <Database className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm mr-1">Cached:</span>
                <span className="font-mono font-medium">{cachedResult.time} ms</span>
                {cachedResult.cacheHit && (
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Cache Hit</span>
                )}
              </div>

              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                <span className="font-medium">{speedImprovement}% faster</span>
              </div>
            </div>

            <p className="text-sm text-blue-700 mt-2">
              {cachedResult.cacheHit
                ? "Redis cache hit! The result was retrieved directly from Redis without processing."
                : "First cache run - result stored in Redis for future requests."}{" "}
              Caching reduced processing time by {noCacheResult.time - cachedResult.time} milliseconds.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={resultRef}>
          {/* No Cache Result */}
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-gray-500" />
              Result (No Cache)
            </h3>

            {isProcessingNoCache ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                  <p className="text-sm text-gray-500">Processing without cache...</p>
                </div>
              </div>
            ) : noCacheResult ? (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-line h-[200px] overflow-y-auto">
                  {noCacheResult.text}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm">
                    Time Taken: <span className="font-mono font-medium">{noCacheResult.time} ms</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-400">
                <p>Click "Process (No Cache)" to see results</p>
              </div>
            )}
          </div>

          {/* Cached Result */}
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-blue-500" />
              Result (Cached)
            </h3>

            {isProcessingCached ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                  <p className="text-sm text-gray-500">Processing with cache...</p>
                </div>
              </div>
            ) : cachedResult ? (
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-md text-sm whitespace-pre-line h-[200px] overflow-y-auto">
                  {cachedResult.text}
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm">
                    Time Taken: <span className="font-mono font-medium text-blue-600">{cachedResult.time} ms</span>
                  </span>
                  {cachedResult.cacheHit && (
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Cache Hit</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-400">
                <p>Run "Process (No Cache)" first, then click "Process (Cached)"</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
