"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Search, FileText, Database, BarChart } from "lucide-react"

interface AddAgentDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddAgent: (agent: any) => void
}

export function AddAgentDialog({ isOpen, onClose, onAddAgent }: AddAgentDialogProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [priority, setPriority] = useState("medium")
  const [model, setModel] = useState("gpt-4o")
  const [icon, setIcon] = useState("User")

  const handleSubmit = () => {
    if (!name || !role) return

    const iconComponent = getIconComponent(icon)

    onAddAgent({
      name,
      role,
      priority,
      model,
      icon: iconComponent,
    })

    // Reset form
    setName("")
    setRole("")
    setPriority("medium")
    setModel("gpt-4o")
    setIcon("User")
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "User":
        return User
      case "Search":
        return Search
      case "FileText":
        return FileText
      case "Database":
        return Database
      case "BarChart":
        return BarChart
      default:
        return User
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Resume Analyzer"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role Description</Label>
            <Textarea
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Describe what this agent does..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger id="icon">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Search">Search</SelectItem>
                <SelectItem value="FileText">Document</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="BarChart">Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !role}>
            Add Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
