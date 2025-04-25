"use client"

import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "healthy" | "warning" | "critical"
  loading?: boolean
}

export function StatusIndicator({ status, loading = false }: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-amber-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "healthy":
        return "System Healthy"
      case "warning":
        return "Performance Degraded"
      case "critical":
        return "Critical Issues Detected"
      default:
        return "Unknown Status"
    }
  }

  const getStatusDescription = () => {
    switch (status) {
      case "healthy":
        return "All systems operating normally"
      case "warning":
        return "Some metrics indicate potential issues"
      case "critical":
        return "Immediate attention required"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded mt-4 animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-100",
              getStatusColor(),
            )}
          >
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
              <div className={cn("w-8 h-8 rounded-full", getStatusColor())}></div>
            </div>
          </div>
          <h3 className="text-xl font-bold mt-4">{getStatusText()}</h3>
          <p className="text-sm text-gray-500 text-center mt-1">{getStatusDescription()}</p>
        </>
      )}
    </div>
  )
}
