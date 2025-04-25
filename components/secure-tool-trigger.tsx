"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, Lock, AlertCircle, CheckCircle, TrendingUp, Users, Building, Briefcase } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { StatusBadge } from "@/components/ui-status-badge"

// Mock API to simulate a secure backend operation
const mockSecureAnalysis = async (): Promise<{
  success: boolean
  results: {
    category: string
    icon: string
    summary: string
  }[]
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Simulate a 10% chance of error
  if (Math.random() < 0.1) {
    throw new Error("Secure operation failed")
  }

  // Return mock results (no sensitive data)
  return {
    success: true,
    results: [
      {
        category: "Hiring Trends",
        icon: "trending-up",
        summary: "Competitors increased technical hiring by 15% in AI/ML roles over the last quarter.",
      },
      {
        category: "Team Structure",
        icon: "users",
        summary: "Average team size is 8-12 engineers per product area, with 1:6 manager-to-IC ratio.",
      },
      {
        category: "Compensation",
        icon: "briefcase",
        summary: "Market rates for senior roles increased 7-10% YoY, with expanded equity offerings.",
      },
      {
        category: "Company Growth",
        icon: "building",
        summary: "Three major competitors opened new offices in emerging tech hubs (Austin, Raleigh, Toronto).",
      },
    ],
  }
}

type AnalysisStatus = "idle" | "fetching-credentials" | "analyzing" | "completed" | "error"

interface SecureToolTriggerProps {
  title: string
  description: string
}

export function SecureToolTrigger({ title, description }: SecureToolTriggerProps) {
  const [status, setStatus] = useState<AnalysisStatus>("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [results, setResults] = useState<any[] | null>(null)

  const handleStartAnalysis = async () => {
    setStatus("fetching-credentials")
    setStatusMessage("Securely retrieving credentials...")
    setResults(null)

    try {
      // Simulate fetching credentials securely
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus("analyzing")
      setStatusMessage("Analyzing competitor data...")

      const analysisResults = await mockSecureAnalysis()

      if (analysisResults.success) {
        setStatus("completed")
        setStatusMessage("Analysis completed successfully")
        setResults(analysisResults.results)
      }
    } catch (error) {
      setStatus("error")
      setStatusMessage("Error: Unable to complete secure analysis")
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "trending-up":
        return <TrendingUp className="h-5 w-5" />
      case "users":
        return <Users className="h-5 w-5" />
      case "briefcase":
        return <Briefcase className="h-5 w-5" />
      case "building":
        return <Building className="h-5 w-5" />
      default:
        return <TrendingUp className="h-5 w-5" />
    }
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Secure Operation</p>
            <p className="mt-1">
              This tool uses credentials securely stored in a vault. No sensitive information is ever exposed to the
              client or stored in the browser.
            </p>
          </div>
        </div>

        <Button
          onClick={handleStartAnalysis}
          disabled={status === "fetching-credentials" || status === "analyzing"}
          className="w-full transition-all"
          size="lg"
        >
          {status === "fetching-credentials" || status === "analyzing" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {status === "fetching-credentials" ? "Fetching Secure Credentials..." : "Analyzing Data..."}
            </>
          ) : (
            <>
              <Shield className="mr-2 h-5 w-5" />
              Start Secure Analysis
            </>
          )}
        </Button>

        <StatusBadge
          status={
            status === "fetching-credentials" || status === "analyzing"
              ? "loading"
              : status === "completed"
                ? "success"
                : status === "error"
                  ? "error"
                  : "idle"
          }
          message={statusMessage}
        />

        <AnimatePresence>
          {status === "completed" && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <h3 className="font-medium">Analysis Results</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white border rounded-md p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getIconComponent(result.icon)}
                      <h4 className="font-medium">{result.category}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{result.summary}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-xs text-gray-500 mt-4">
                <p>
                  <span className="font-medium">Last updated:</span> {new Date().toLocaleString()}
                </p>
                <p className="mt-1">
                  This analysis was performed securely using credentials stored in the server vault. No sensitive
                  information was transmitted to the client.
                </p>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 bg-red-50 border border-red-200 rounded-md p-4"
            >
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-medium">Analysis Failed</h3>
              </div>
              <p className="mt-2 text-sm text-red-600">
                The secure analysis operation could not be completed. This could be due to credential access issues or
                problems with the external API. Please try again or contact support if the issue persists.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
