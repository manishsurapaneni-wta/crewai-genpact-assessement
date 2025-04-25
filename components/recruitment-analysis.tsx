"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { AnalysisResults } from "@/components/analysis-results"

// Mock API call to simulate backend processing
const mockAnalysisApi = async (topic: string): Promise<Record<string, string>> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Return mock data based on the topic
  return {
    "Forecasted Roles": `AI Ethics Officer, Quantum Computing Analyst, ${topic} Specialist`,
    "Key Trends": "Decentralization, AI Augmentation, Remote-first Collaboration",
    "Critical Skills": `Data Analysis, Ethical Decision Making, ${topic} Knowledge`,
    "Emerging Technologies": "Blockchain, Quantum Computing, Extended Reality",
    "Recommended Training": `${topic} Certification, AI Ethics Course, Leadership Development`,
  }
}

export function RecruitmentAnalysis() {
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalysis = async () => {
    if (!topic.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const analysisResults = await mockAnalysisApi(topic)
      setResults(analysisResults)
    } catch (err) {
      setError("An error occurred during analysis. Please try again.")
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Start a New Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Analysis Topic
          </label>
          <Input
            id="topic"
            placeholder="e.g., Future Skills in FinTech"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleAnalysis}
          className="w-full transition-all hover:bg-blue-600 bg-blue-500"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Start Analysis"
          )}
        </Button>

        <div className="mt-6">
          {error && <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>}

          {!results && !error && !isLoading && (
            <div className="text-gray-500 text-center p-8 bg-gray-50 rounded-md">Results will appear here...</div>
          )}

          {isLoading && !results && (
            <div className="flex justify-center items-center p-8 bg-gray-50 rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}

          {results && !isLoading && <AnalysisResults results={results} />}
        </div>
      </CardContent>
    </Card>
  )
}
