"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatisticCardProps {
  title: string
  value: number
  description: string
  trend?: "positive" | "negative" | "neutral"
  unit?: string
  loading?: boolean
}

export function StatisticCard({ title, value, description, trend, unit = "", loading = false }: StatisticCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (loading) return

    // Animate the counter
    const duration = 1000 // ms
    const steps = 20
    const stepValue = value / steps
    const stepTime = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value, loading])

  return (
    <Card className={cn(loading && "opacity-70")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <>
                {displayValue.toLocaleString()}
                {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
              </>
            )}
          </div>
          <div className="flex items-center mt-1">
            {trend && !loading && (
              <div
                className={cn(
                  "flex items-center mr-2 text-xs font-medium",
                  trend === "positive" && "text-green-600",
                  trend === "negative" && "text-red-600",
                )}
              >
                {trend === "positive" && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                {trend === "negative" && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                {trend === "positive" ? "+12.5%" : trend === "negative" ? "-4.3%" : "0%"}
              </div>
            )}
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
