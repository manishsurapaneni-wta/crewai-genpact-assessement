"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, Info, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock API to simulate an idempotent backend action
const mockIdempotentAction = async (
  actionId: string,
  email: string,
  hasBeenExecuted: boolean,
): Promise<{
  success: boolean
  idempotent: boolean
  message: string
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // If the action has been executed before, return idempotent response
  if (hasBeenExecuted) {
    return {
      success: true,
      idempotent: true,
      message: "Email Already Sent (Idempotent)",
    }
  }

  // Simulate a 10% chance of error
  if (Math.random() < 0.1) {
    throw new Error("Failed to send email")
  }

  // Return success response for first-time execution
  return {
    success: true,
    idempotent: false,
    message: `Email Sent Successfully to ${email}`,
  }
}

type ActionStatus = "idle" | "loading" | "success" | "idempotent" | "error"

interface IdempotentActionTriggerProps {
  title: string
  description: string
  actionId: string
}

export function IdempotentActionTrigger({ title, description, actionId }: IdempotentActionTriggerProps) {
  const [status, setStatus] = useState<ActionStatus>("idle")
  const [message, setMessage] = useState<string>("")
  const [hasBeenExecuted, setHasBeenExecuted] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isValid, setIsValid] = useState(false)

  // Validate email in real-time
  useEffect(() => {
    if (!email) {
      setEmailError("")
      setIsValid(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      setIsValid(false)
    } else {
      setEmailError("")
      setIsValid(true)
    }
  }, [email])

  const handleAction = async () => {
    if (!isValid) return

    setStatus("loading")
    setMessage("Sending...")

    try {
      const result = await mockIdempotentAction(actionId, email, hasBeenExecuted)

      if (result.idempotent) {
        setStatus("idempotent")
      } else {
        setStatus("success")
        setHasBeenExecuted(true)
      }

      setMessage(result.message)
    } catch (error) {
      setStatus("error")
      setMessage("Error Sending Email")
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "idempotent":
        return <Info className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusClasses = () => {
    switch (status) {
      case "loading":
        return "text-blue-600 bg-blue-50"
      case "success":
        return "text-green-600 bg-green-50"
      case "idempotent":
        return "text-amber-600 bg-amber-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "hidden"
    }
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Recipient Email <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter recipient email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn("pr-10", emailError && email ? "border-red-500 focus-visible:ring-red-500" : "")}
              disabled={status === "loading"}
            />
            {email && (
              <div className="absolute right-3 top-2.5">
                {emailError ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            )}
          </div>
          {emailError && email && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        <Button onClick={handleAction} disabled={status === "loading" || !isValid} className="w-full transition-all">
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </>
          )}
        </Button>

        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-md transition-all duration-300",
            status !== "idle" ? "opacity-100" : "opacity-0",
            getStatusClasses(),
          )}
        >
          {getStatusIcon()}
          <span className="font-medium">{message}</span>
        </div>
      </CardContent>
    </Card>
  )
}
