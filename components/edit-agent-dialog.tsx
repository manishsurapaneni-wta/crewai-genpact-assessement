"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Search, FileText, Database, BarChart } from "lucide-react"

interface EditAgentDialogProps {
  isOpen: boolean
  agent: any
  onClose: () => void
  onUpdateAgent: (agent: any) => void
}

export function EditAgentDialog({ isOpen, agent, onClose, onUpdateAgent }: EditAgentDialogProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [priority, setPriority] = useState("")
  const [model, setModel] = useState("")
  const [icon, setIcon] = useState("")

  // Initialize form with agent data
  useEffect(() => {
    if (agent) {
      setName(agent.name || "")
      setRole(agent.role || "")
      setPriority(agent.priority || "medium")
      setModel(agent.model || "gpt-4o")
      setIcon(getIconName(agent.icon) || "User")
    }
  }, [agent])

  const handleSubmit = () => {
    if (!name || !role) return

    const iconComponent = getIconComponent(icon)

    onUpdateAgent({
      ...agent,
      name,
      role,
      priority,
      model,
      icon: iconComponent,
    })
  }

  const getIconName = (iconComponent: any) => {
    if (iconComponent === User) return "User"
    if (iconComponent === Search) return "Search"
    if (iconComponent === FileText) return "FileText"
    if (iconComponent === Database) return "Database"
    if (iconComponent === BarChart) return "BarChart"
    return "User"
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
          <DialogTitle>Edit Agent</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Agent Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Resume Analyzer"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-role">Role Description</Label>
            <Textarea
              id="edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Describe what this agent does..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="edit-priority">
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
              <Label htmlFor="edit-model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="edit-model">
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
            <Label htmlFor="edit-icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger id="edit-icon">
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
            Update Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
