"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnalysisResultsProps {
  results: Record<string, string>
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
      <div className="space-y-4">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-700">{key}</h4>
            <p className="mt-1 text-gray-600 whitespace-pre-line">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
