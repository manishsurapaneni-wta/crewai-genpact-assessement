import { cn } from "@/lib/utils"

type StatusType = "loading" | "success" | "idempotent" | "error" | "idle"

interface StatusBadgeProps {
  status: StatusType
  message: string
}

export function StatusBadge({ status, message }: StatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case "loading":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "success":
        return "text-green-600 bg-green-50 border-green-200"
      case "idempotent":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "error":
        return "text-red-600 bg-red-50 border-red-200"
      case "idle":
      default:
        return "hidden"
    }
  }

  return (
    <div
      className={cn(
        "px-3 py-2 rounded-md border text-sm font-medium transition-all duration-300",
        status !== "idle" ? "opacity-100" : "opacity-0",
        getStatusClasses(),
      )}
    >
      {message}
    </div>
  )
}
