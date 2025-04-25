"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ExternalLink, Search, Filter, Clock, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock API to simulate a complex backend process
const mockRunProcessAndGenerateTrace = async (): Promise<{
  success: boolean
  traceId: string
  traceUrl: string
  steps: Array<{
    id: string
    name: string
    status: "success" | "warning" | "error"
    duration: number
    timestamp: string
    details: string
  }>
}> => {
  // Simulate a complex process with a longer delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Generate a random trace ID
  const traceId = Math.random().toString(36).substring(2, 15)

  // Simulate a 5% chance of error
  if (Math.random() < 0.05) {
    throw new Error("Process execution failed")
  }

  // Generate mock trace steps
  const steps = [
    {
      id: "step-1",
      name: "Initialize Candidate Profile",
      status: "success" as const,
      duration: 120,
      timestamp: new Date(Date.now() - 3000).toISOString(),
      details: "Successfully loaded candidate profile data from database",
    },
    {
      id: "step-2",
      name: "Parse Resume",
      status: "success" as const,
      duration: 450,
      timestamp: new Date(Date.now() - 2500).toISOString(),
      details: "Extracted key information from resume using NLP",
    },
    {
      id: "step-3",
      name: "Match Skills",
      status: Math.random() < 0.3 ? ("warning" as const) : ("success" as const),
      duration: 780,
      timestamp: new Date(Date.now() - 2000).toISOString(),
      details: Math.random() < 0.3 ? "Partial match with required skills" : "Strong match with required skills",
    },
    {
      id: "step-4",
      name: "Background Verification",
      status: Math.random() < 0.2 ? ("error" as const) : ("success" as const),
      duration: 1200,
      timestamp: new Date(Date.now() - 1500).toISOString(),
      details: Math.random() < 0.2 ? "Failed to verify education credentials" : "All credentials verified successfully",
    },
    {
      id: "step-5",
      name: "Generate Report",
      status: "success" as const,
      duration: 350,
      timestamp: new Date(Date.now() - 1000).toISOString(),
      details: "Comprehensive candidate report generated",
    },
  ]

  // Return success with trace information
  return {
    success: true,
    traceId: traceId,
    traceUrl: `https://jaeger.example.com/trace/${traceId}`,
    steps,
  }
}

type ProcessStatus = "idle" | "processing" | "completed" | "error"

interface FlowTraceGeneratorProps {
  title: string
  description: string
}

export function FlowTraceGenerator({ title, description }: FlowTraceGeneratorProps) {
  const [status, setStatus] = useState<ProcessStatus>("idle")
  const [message, setMessage] = useState<string>("")
  const [traceUrl, setTraceUrl] = useState<string | null>(null)
  const [traceId, setTraceId] = useState<string | null>(null)
  const [traceSteps, setTraceSteps] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>(["success", "warning", "error"])

  const handleRunProcess = async () => {
    setStatus("processing")
    setMessage("Processing...")
    setTraceUrl(null)
    setTraceId(null)
    setTraceSteps([])

    try {
      const result = await mockRunProcessAndGenerateTrace()

      if (result.success) {
        setStatus("completed")
        setMessage("Process Complete. Trace generated.")
        setTraceUrl(result.traceUrl)
        setTraceId(result.traceId)
        setTraceSteps(result.steps)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Error: Process execution failed. Please try again.")
    }
  }

  // Filter trace steps based on search term and status filter
  const getFilteredSteps = () => {
    return traceSteps.filter((step) => {
      const matchesSearch =
        step.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        step.details.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter.includes(step.status)

      return matchesSearch && matchesStatus
    })
  }

  const filteredSteps = getFilteredSteps()

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={handleRunProcess}
          disabled={status === "processing"}
          className="w-full transition-all"
          size="lg"
        >
          {status === "processing" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Run Process & Generate Trace"
          )}
        </Button>

        <div
          className={cn(
            "p-4 rounded-md transition-all duration-300",
            status !== "idle" ? "opacity-100" : "opacity-0",
            status === "processing"
              ? "bg-blue-50"
              : status === "completed"
                ? "bg-green-50"
                : status === "error"
                  ? "bg-red-50"
                  : "",
          )}
        >
          <p
            className={cn(
              "font-medium mb-2",
              status === "processing"
                ? "text-blue-600"
                : status === "completed"
                  ? "text-green-600"
                  : status === "error"
                    ? "text-red-600"
                    : "",
            )}
          >
            {message}
          </p>

          {status === "completed" && traceUrl && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600">
                Trace ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{traceId}</span>
              </p>

              {/* Search and filter controls */}
              {traceSteps.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center mb-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search steps..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        Filter Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem
                        checked={statusFilter.includes("success")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStatusFilter([...statusFilter, "success"])
                          } else {
                            setStatusFilter(statusFilter.filter((s) => s !== "success"))
                          }
                        }}
                      >
                        Success
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilter.includes("warning")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStatusFilter([...statusFilter, "warning"])
                          } else {
                            setStatusFilter(statusFilter.filter((s) => s !== "warning"))
                          }
                        }}
                      >
                        Warning
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilter.includes("error")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStatusFilter([...statusFilter, "error"])
                          } else {
                            setStatusFilter(statusFilter.filter((s) => s !== "error"))
                          }
                        }}
                      >
                        Error
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Trace steps */}
              {filteredSteps.length > 0 ? (
                <div className="space-y-3 mt-4">
                  <h3 className="font-medium text-gray-700">Process Steps</h3>
                  <div className="space-y-2">
                    {filteredSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className={cn(
                          "p-3 rounded-md border",
                          step.status === "success"
                            ? "border-green-200 bg-green-50"
                            : step.status === "warning"
                              ? "border-amber-200 bg-amber-50"
                              : "border-red-200 bg-red-50",
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{step.name}</h4>
                            <p className="text-sm mt-1">{step.details}</p>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-xs font-mono">{step.duration}ms</span>
                          </div>
                        </div>
                        {index < filteredSteps.length - 1 && (
                          <div className="flex justify-center my-1">
                            <ArrowDown className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchTerm || statusFilter.length < 3 ? (
                <p className="text-sm text-gray-500 italic">No matching steps found</p>
              ) : null}

              <div className="flex items-center">
                <a
                  href={traceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  View Execution Trace
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The trace link will open in Jaeger or your organization's tracing system to view the detailed execution
                flow.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
