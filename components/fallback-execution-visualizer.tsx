"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, AlertTriangle, ArrowRight, ArrowDown, Database, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Mock API to simulate an operation that might fail
const mockExecuteOperation = async (): Promise<{
  success: boolean
  usedFallback: boolean
  result: any
}> => {
  // Simulate network delay for primary operation
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate a 70% chance of failure for the primary operation
  const primaryFailed = Math.random() < 0.7

  if (!primaryFailed) {
    // Primary operation succeeded
    return {
      success: true,
      usedFallback: false,
      result: {
        profileId: "PRF-" + Math.floor(Math.random() * 10000),
        enrichmentLevel: "Advanced",
        dataPoints: 42,
        confidenceScore: 0.95,
        sources: ["LinkedIn", "GitHub", "Academic Database", "Industry Publications"],
        skills: ["Machine Learning", "Data Science", "Python", "TensorFlow", "Research"],
        lastUpdated: new Date().toISOString(),
      },
    }
  }

  // Primary operation failed, simulate fallback
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Fallback operation (always succeeds in this demo)
  return {
    success: true,
    usedFallback: true,
    result: {
      profileId: "PRF-" + Math.floor(Math.random() * 10000),
      enrichmentLevel: "Basic",
      dataPoints: 18,
      confidenceScore: 0.72,
      sources: ["LinkedIn", "Public Records"],
      skills: ["Data Analysis", "Python", "SQL"],
      lastUpdated: new Date().toISOString(),
    },
  }
}

type OperationStatus = "idle" | "processing" | "failed" | "fallback" | "completed"

interface FallbackExecutionVisualizerProps {
  title: string
  description: string
}

export function FallbackExecutionVisualizer({ title, description }: FallbackExecutionVisualizerProps) {
  const [status, setStatus] = useState<OperationStatus>("idle")
  const [result, setResult] = useState<any>(null)
  const [usedFallback, setUsedFallback] = useState(false)

  const handleStartOperation = async () => {
    setStatus("processing")
    setResult(null)
    setUsedFallback(false)

    try {
      const operationResult = await mockExecuteOperation()

      if (operationResult.usedFallback) {
        setStatus("failed")
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Pause to show the failure state
        setStatus("fallback")
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Pause to show the fallback state
      }

      setStatus("completed")
      setResult(operationResult.result)
      setUsedFallback(operationResult.usedFallback)
    } catch (error) {
      setStatus("failed")
      console.error("Operation failed completely:", error)
    }
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={handleStartOperation}
          disabled={status === "processing" || status === "failed" || status === "fallback"}
          className="w-full transition-all"
          size="lg"
        >
          {status === "processing" || status === "failed" || status === "fallback" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Start Operation"
          )}
        </Button>

        {/* Execution Flow Visualization */}
        {status !== "idle" && (
          <div className="mt-8 mb-4">
            <h3 className="text-lg font-medium mb-4">Execution Flow</h3>
            <div className="relative flex flex-col items-center">
              {/* Primary Operation Node */}
              <ExecutionNode
                title="Advanced Enrichment"
                icon={Database}
                status={
                  status === "processing"
                    ? "processing"
                    : usedFallback
                      ? "failed"
                      : status === "completed"
                        ? "success"
                        : "idle"
                }
              />

              {/* Connector Line */}
              <div className="h-10 w-0.5 bg-gray-200 my-1 relative">
                {usedFallback && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>

              {/* Decision Node (only visible when primary fails) */}
              {(status === "failed" || status === "fallback" || usedFallback) && (
                <>
                  <ExecutionNode
                    title="Failure Detected"
                    icon={AlertTriangle}
                    status={status === "failed" ? "processing" : "failed"}
                    variant="decision"
                  />
                  <div className="h-10 w-0.5 bg-gray-200 my-1">
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                      <ArrowDown className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                </>
              )}

              {/* Fallback Node (only visible when fallback is triggered) */}
              {(status === "fallback" || (status === "completed" && usedFallback)) && (
                <ExecutionNode
                  title="Basic Enrichment (Fallback)"
                  icon={FileText}
                  status={status === "fallback" ? "processing" : "success"}
                  variant="fallback"
                />
              )}
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "border rounded-lg p-4",
              usedFallback ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50",
            )}
          >
            <div className="flex items-center mb-3">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full mr-2",
                  usedFallback ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600",
                )}
              >
                {usedFallback ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              </div>
              <h3 className="text-lg font-medium">
                {usedFallback ? "Fallback Result (Basic Enrichment)" : "Primary Result (Advanced Enrichment)"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Profile ID</p>
                <p className="font-mono">{result.profileId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Enrichment Level</p>
                <p className="font-medium">{result.enrichmentLevel}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data Points</p>
                <p>{result.dataPoints}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Confidence Score</p>
                <p>{result.confidenceScore.toFixed(2)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Sources</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.sources.map((source: string) => (
                    <span
                      key={source}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Skills</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

interface ExecutionNodeProps {
  title: string
  icon: React.ElementType
  status: "idle" | "processing" | "success" | "failed"
  variant?: "primary" | "decision" | "fallback"
}

function ExecutionNode({ title, icon: Icon, status, variant = "primary" }: ExecutionNodeProps) {
  const getNodeColors = () => {
    if (status === "processing") {
      return "border-blue-200 bg-blue-50 text-blue-600"
    }
    if (status === "success") {
      return "border-green-200 bg-green-50 text-green-600"
    }
    if (status === "failed") {
      return "border-red-200 bg-red-50 text-red-600"
    }

    // Default/idle colors based on variant
    switch (variant) {
      case "decision":
        return "border-amber-200 bg-amber-50 text-amber-600"
      case "fallback":
        return "border-amber-200 bg-amber-50 text-amber-600"
      default:
        return "border-gray-200 bg-gray-50 text-gray-600"
    }
  }

  const getStatusIcon = () => {
    if (status === "processing") {
      return <Loader2 className="h-5 w-5 animate-spin" />
    }
    if (status === "success") {
      return <CheckCircle className="h-5 w-5" />
    }
    if (status === "failed") {
      return <XCircle className="h-5 w-5" />
    }
    return <Icon className="h-5 w-5" />
  }

  // Add pulsating effect for processing nodes
  const isPulsating = status === "processing"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: isPulsating
          ? [
              "0px 0px 0px rgba(59, 130, 246, 0)",
              "0px 0px 15px rgba(59, 130, 246, 0.5)",
              "0px 0px 0px rgba(59, 130, 246, 0)",
            ]
          : "none",
      }}
      transition={{
        duration: 0.3,
        boxShadow: {
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      }}
      className={cn("flex items-center border rounded-lg p-3 min-w-[250px]", getNodeColors())}
    >
      <div className="mr-3">{getStatusIcon()}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs">
          {status === "processing"
            ? "Processing..."
            : status === "success"
              ? "Completed successfully"
              : status === "failed"
                ? "Failed to complete"
                : "Waiting to execute"}
        </p>
      </div>
    </motion.div>
  )
}
