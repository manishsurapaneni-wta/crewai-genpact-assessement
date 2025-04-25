"use client"

import { useEffect, useState } from "react"

interface BarChartData {
  name: string
  value: number
}

interface SimpleBarChartProps {
  data: BarChartData[]
  loading?: boolean
}

export function SimpleBarChart({ data, loading = false }: SimpleBarChartProps) {
  const [animatedData, setAnimatedData] = useState<BarChartData[]>(data.map((item) => ({ ...item, value: 0 })))

  useEffect(() => {
    if (loading) return

    // Animate the bars
    const duration = 1000 // ms
    const steps = 20
    const stepTime = duration / steps

    const initialValues = animatedData.map((item) => item.value)
    const targetValues = data.map((item) => item.value)
    const stepValues = targetValues.map((target, i) => (target - initialValues[i]) / steps)

    let step = 0
    const timer = setInterval(() => {
      step++
      if (step >= steps) {
        setAnimatedData(data)
        clearInterval(timer)
      } else {
        setAnimatedData(
          data.map((item, i) => ({
            ...item,
            value: initialValues[i] + stepValues[i] * step,
          })),
        )
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [data, loading])

  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="w-full h-full flex flex-col">
      {loading ? (
        <div className="flex-1 flex items-end space-x-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1">
              <div className="h-32 bg-gray-200 rounded-t animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-end space-x-6">
          {animatedData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center mb-2">
                <span className="text-sm font-medium">{Math.round(item.value)}ms</span>
              </div>
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-500 ease-out"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          ))}
        </div>
      )}
      <div className="h-8 flex justify-around items-center border-t mt-4 pt-2">
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>)
          : animatedData.map((item, index) => (
              <div key={index} className="text-sm text-gray-500">
                {item.name}
              </div>
            ))}
      </div>
    </div>
  )
}
