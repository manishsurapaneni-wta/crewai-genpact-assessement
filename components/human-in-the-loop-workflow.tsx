"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, User, BarChart, FileText, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { HumanDecisionModal } from "@/components/human-decision-modal"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

// Mock candidate data
const mockCandidateData = {
  id: "CAND-" + Math.floor(Math.random() * 10000),
  name: "Alex Johnson",
  role: "Senior Software Engineer",
  fitScore: Math.floor(70 + Math.random() * 20), // 70-90%
  skills: [
    { name: "JavaScript", level: "Expert", match: "High" },
    { name: "React", level: "Expert", match: "High" },
    { name: "Node.js", level: "Advanced", match: "Medium" },
    { name: "AWS", level: "Intermediate", match: "Low" },
    { name: "Python", level: "Beginner", match: "Low" },
  ],
  experience: "8 years",
  education: "M.S. Computer Science",
  potentialConcerns: ["Limited cloud experience", "No experience with our tech stack", "Salary expectations high"],
  strengths: ["Strong problem-solving skills", "Team leadership experience", "Open source contributor"],
}

type WorkflowStatus = "idle" | "analyzing" | "awaiting_decision" | "processing_decision" | "completed"
type HumanDecision = "approve" | "reject" | "request_more_info" | null

interface HumanInTheLoopWorkflowProps {
  title: string
  description: string
}

export function HumanInTheLoopWorkflow({ title, description }: HumanInTheLoopWorkflowProps) {
  const [status, setStatus] = useState<WorkflowStatus>("idle")
  const [candidateData, setCandidateData] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [decision, setDecision] = useState<HumanDecision>(null)
  const [comments, setComments] = useState("")
  const [finalRecommendation, setFinalRecommendation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSkills, setFilteredSkills] = useState<any[]>([])
  const [filteredConcerns, setFilteredConcerns] = useState<string[]>([])
  const [filteredStrengths, setFilteredStrengths] = useState<string[]>([])

  // Filter candidate data based on search term
  useEffect(() => {
    if (!candidateData) return

    // Filter skills
    const skills = candidateData.skills.filter(
      (skill: any) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.match.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSkills(skills)

    // Filter concerns
    const concerns = candidateData.potentialConcerns.filter((concern: string) =>
      concern.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredConcerns(concerns)

    // Filter strengths
    const strengths = candidateData.strengths.filter((strength: string) =>
      strength.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStrengths(strengths)
  }, [searchTerm, candidateData])

  const startWorkflow = async () => {
    setStatus("analyzing")
    setCandidateData(null)
    setDecision(null)
    setComments("")
    setFinalRecommendation(null)
    setSearchTerm("")

    // Simulate initial analysis
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Set candidate data and await human decision
    setCandidateData(mockCandidateData)
    setFilteredSkills(mockCandidateData.skills)
    setFilteredConcerns(mockCandidateData.potentialConcerns)
    setFilteredStrengths(mockCandidateData.strengths)
    setStatus("awaiting_decision")
    setIsModalOpen(true)
  }

  const handleDecisionSubmit = async (selectedDecision: HumanDecision, userComments: string) => {
    setIsModalOpen(false)
    setDecision(selectedDecision)
    setComments(userComments)
    setStatus("processing_decision")

    // Simulate processing the decision
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate final recommendation based on decision
    let recommendation = ""
    switch (selectedDecision) {
      case "approve":
        recommendation = "Proceed with technical interview. Candidate shows strong potential for the role."
        break
      case "reject":
        recommendation = "Do not proceed. Candidate does not meet the required criteria for this position."
        break
      case "request_more_info":
        recommendation = "Request additional information before proceeding. Schedule a preliminary screening call."
        break
      default:
        recommendation = "No decision was made. Please review the candidate again."
    }

    setFinalRecommendation(recommendation)
    setStatus("completed")
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={startWorkflow}
          disabled={status !== "idle" && status !== "completed"}
          className="w-full transition-all"
          size="lg"
        >
          {status === "analyzing" || status === "processing_decision" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {status === "analyzing" ? "Analyzing Candidate..." : "Processing Decision..."}
            </>
          ) : status === "awaiting_decision" ? (
            "Awaiting Human Decision..."
          ) : status === "completed" ? (
            "Start New Evaluation"
          ) : (
            "Start Candidate Evaluation"
          )}
        </Button>

        {/* Workflow Status Indicator */}
        {status !== "idle" && (
          <div className="flex justify-between items-center mt-6 px-2">
            <WorkflowStep
              number={1}
              title="Initial Analysis"
              status={status !== "idle" ? "completed" : "pending"}
              icon={BarChart}
            />
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div
                className={cn(
                  "h-full bg-blue-500 transition-all duration-500",
                  status === "analyzing" ? "w-1/2" : status !== "idle" ? "w-full" : "w-0",
                )}
              ></div>
            </div>
            <WorkflowStep
              number={2}
              title="Human Review"
              status={
                status === "awaiting_decision"
                  ? "active"
                  : status === "processing_decision" || status === "completed"
                    ? "completed"
                    : "pending"
              }
              icon={User}
            />
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div
                className={cn(
                  "h-full bg-blue-500 transition-all duration-500",
                  status === "processing_decision" ? "w-1/2" : status === "completed" ? "w-full" : "w-0",
                )}
              ></div>
            </div>
            <WorkflowStep
              number={3}
              title="Final Recommendation"
              status={status === "completed" ? "completed" : "pending"}
              icon={FileText}
            />
          </div>
        )}

        {/* Candidate Data Display with Search Filter */}
        {candidateData &&
          (status === "awaiting_decision" || status === "processing_decision" || status === "completed") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border rounded-lg p-4 mt-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Candidate Profile
                </h3>

                {/* Search filter */}
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Filter candidate info..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-medium">{candidateData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p>{candidateData.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p>{candidateData.experience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Education</p>
                  <p>{candidateData.education}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">AI Fit Score</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className={cn(
                          "h-2.5 rounded-full",
                          candidateData.fitScore >= 85
                            ? "bg-green-500"
                            : candidateData.fitScore >= 70
                              ? "bg-amber-500"
                              : "bg-red-500",
                        )}
                        style={{ width: `${candidateData.fitScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{candidateData.fitScore}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Key Skills</p>
                {filteredSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filteredSkills.map((skill: any) => (
                      <div
                        key={skill.name}
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          skill.match === "High"
                            ? "bg-green-100 text-green-800"
                            : skill.match === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {skill.name} ({skill.level})
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No matching skills found</p>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Potential Concerns</p>
                {filteredConcerns.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {filteredConcerns.map((concern: string) => (
                      <li key={concern}>{concern}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No matching concerns found</p>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Strengths</p>
                {filteredStrengths.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {filteredStrengths.map((strength: string) => (
                      <li key={strength}>{strength}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No matching strengths found</p>
                )}
              </div>
            </motion.div>
          )}

        {/* Human Decision Display (after decision is made) */}
        {decision && status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "border rounded-lg p-4",
              decision === "approve"
                ? "border-green-200 bg-green-50"
                : decision === "reject"
                  ? "border-red-200 bg-red-50"
                  : "border-amber-200 bg-amber-50",
            )}
          >
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Human Decision
            </h3>

            <div className="mb-3">
              <p className="text-sm font-medium text-gray-500">Decision</p>
              <p className="font-medium">
                {decision === "approve"
                  ? "Approve Candidate"
                  : decision === "reject"
                    ? "Reject Candidate"
                    : "Request More Information"}
              </p>
            </div>

            {comments && (
              <div>
                <p className="text-sm font-medium text-gray-500">Comments</p>
                <p className="text-sm italic">"{comments}"</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Final Recommendation */}
        {finalRecommendation && status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="border border-blue-200 bg-blue-50 rounded-lg p-4"
          >
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Final Recommendation
            </h3>
            <p>{finalRecommendation}</p>
          </motion.div>
        )}

        {/* Human Decision Modal */}
        <HumanDecisionModal
          isOpen={isModalOpen}
          candidateData={candidateData}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleDecisionSubmit}
        />
      </CardContent>
    </Card>
  )
}

interface WorkflowStepProps {
  number: number
  title: string
  status: "pending" | "active" | "completed"
  icon: React.ElementType
}

function WorkflowStep({ number, title, status, icon: Icon }: WorkflowStepProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white mb-2",
          status === "pending" ? "bg-gray-300" : status === "active" ? "bg-blue-500" : "bg-green-500",
        )}
      >
        {status === "completed" ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>
      <span className="text-xs text-center">{title}</span>
    </div>
  )
}
