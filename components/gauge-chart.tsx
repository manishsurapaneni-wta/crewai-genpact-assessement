"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface GaugeChartProps {
  value: number
  min?: number
  max?: number
  loading?: boolean
}

export function GaugeChart({ value, min = 0, max = 100, loading = false }: GaugeChartProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (loading) return

    // Animate the gauge
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

  // Calculate the rotation angle based on the value
  const angle = ((displayValue - min) / (max - min)) * 180

  // Determine color based on value
  const getColor = () => {
    if (displayValue < 60) return "text-red-500"
    if (displayValue < 80) return "text-amber-500"
    return "text-green-500"
  }

  return (
    <div className="flex flex-col items-center justify-center h-[200px]">
      {loading ? (
        <div className="w-40 h-40 bg-gray-200 rounded-full animate-pulse"></div>
      ) : (
        <>
          <div className="relative w-40 h-20 overflow-hidden">
            {/* Gauge background */}
            <div className="absolute w-40 h-40 rounded-full border-[16px] border-gray-200 -top-20"></div>
            {/* Gauge fill */}
            <div
              className={cn(
                "absolute w-40 h-40 rounded-full border-[16px] -top-20 transition-all duration-1000 ease-out",
                getColor(),
              )}
              style={{
                clipPath: `polygon(50% 50%, 0 0, ${angle <= 90 ? angle * 1.1 : 100}% 0${
                  angle > 90 ? `, 100% ${((angle - 90) / 90) * 100}%` : ""
                })`,
                borderColor: "currentColor",
              }}
            ></div>
            {/* Gauge center point */}
            <div className="absolute w-4 h-4 bg-gray-700 rounded-full top-[60px] left-[72px] transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
          </div>
          <div className="mt-4 text-3xl font-bold">{displayValue}%</div>
          <div className="flex justify-between w-full mt-2 px-2 text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </>
      )}
    </div>
  )
}
