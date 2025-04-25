"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { User, BarChart, AlertTriangle } from "lucide-react"

interface HumanDecisionModalProps {
  isOpen: boolean
  candidateData: any
  onClose: () => void
  onSubmit: (decision: "approve" | "reject" | "request_more_info", comments: string) => void
}

export function HumanDecisionModal({ isOpen, candidateData, onClose, onSubmit }: HumanDecisionModalProps) {
  const [decision, setDecision] = useState<"approve" | "reject" | "request_more_info" | null>(null)
  const [comments, setComments] = useState("")

  const handleSubmit = () => {
    if (decision) {
      onSubmit(decision, comments)
      // Reset form
      setDecision(null)
      setComments("")
    }
  }

  if (!candidateData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Review Candidate Fit Score</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Context Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-medium">
              <User className="h-5 w-5 text-blue-500" />
              <h3>Candidate: {candidateData.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-500">Role</p>
                <p>{candidateData.role}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">AI Fit Score</p>
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="font-medium">{candidateData.fitScore}%</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Potential Concerns</p>
                  <ul className="list-disc pl-5 text-sm text-amber-700 mt-1 space-y-1">
                    {candidateData.potentialConcerns.map((concern: string) => (
                      <li key={concern}>{concern}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Input */}
          <div className="space-y-4">
            <div>
              <Label className="text-base">Your Decision</Label>
              <RadioGroup value={decision || ""} onValueChange={(value) => setDecision(value as any)}>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="font-normal">
                    Approve - Candidate is a good fit
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="font-normal">
                    Reject - Candidate is not suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="request_more_info" id="request_more_info" />
                  <Label htmlFor="request_more_info" className="font-normal">
                    Request More Information
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="comments" className="text-base">
                Comments (Optional)
              </Label>
              <Textarea
                id="comments"
                placeholder="Add any additional comments or reasoning for your decision..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!decision}>
            Submit Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
