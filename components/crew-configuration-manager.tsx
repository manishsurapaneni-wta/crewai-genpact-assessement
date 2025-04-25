"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  GripVertical,
  Trash2,
  Edit,
  Plus,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Search,
  FileText,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AddAgentDialog } from "@/components/add-agent-dialog"
import { EditAgentDialog } from "@/components/edit-agent-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { JSX } from "react"

// Mock agent data
const mockAgents = [
  {
    id: "agent-1",
    name: "Resume Analyzer",
    role: "Analyzes resumes to extract key information and skills",
    priority: "high",
    model: "gpt-4o",
    icon: FileText,
  },
  {
    id: "agent-2",
    name: "Candidate Researcher",
    role: "Researches candidates across public profiles and databases",
    priority: "medium",
    model: "gpt-4o",
    icon: Search,
  },
  {
    id: "agent-3",
    name: "Interview Question Generator",
    role: "Creates tailored interview questions based on candidate profile",
    priority: "medium",
    model: "gpt-4o",
    icon: User,
  },
  {
    id: "agent-4",
    name: "Data Aggregator",
    role: "Combines and normalizes data from multiple sources",
    priority: "low",
    model: "gpt-3.5-turbo",
    icon: Database,
  },
]

// Mock API call to update crew configuration
const mockUpdateCrewConfiguration = async (agents: any[]) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate a 10% chance of error
  if (Math.random() < 0.1) {
    throw new Error("Failed to update crew configuration")
  }

  // Return success
  return {
    success: true,
    message: "Crew configuration updated successfully",
  }
}

interface CrewConfigurationManagerProps {
  title: string
  description: string
}

export function CrewConfigurationManager({ title, description }: CrewConfigurationManagerProps) {
  const [agents, setAgents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [isAddAgentDialogOpen, setIsAddAgentDialogOpen] = useState(false)
  const [isEditAgentDialogOpen, setIsEditAgentDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Initialize with mock data
  useEffect(() => {
    setAgents(mockAgents)
  }, [])

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = agents.findIndex((agent) => agent.id === active.id)
      const newIndex = agents.findIndex((agent) => agent.id === over.id)

      const newAgents = [...agents]
      const [movedAgent] = newAgents.splice(oldIndex, 1)
      newAgents.splice(newIndex, 0, movedAgent)

      setAgents(newAgents)
      setHasUnsavedChanges(true)
    }
  }

  // Handle save changes
  const handleSaveChanges = async () => {
    setIsLoading(true)
    setStatusMessage({ type: "info", text: "Saving changes..." })

    try {
      await mockUpdateCrewConfiguration(agents)
      setStatusMessage({ type: "success", text: "Crew configuration updated successfully" })
      setHasUnsavedChanges(false)
    } catch (error) {
      setStatusMessage({ type: "error", text: "Failed to update crew configuration" })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle add agent
  const handleAddAgent = (newAgent: any) => {
    const agentWithId = {
      ...newAgent,
      id: `agent-${Date.now()}`,
    }
    setAgents([...agents, agentWithId])
    setHasUnsavedChanges(true)
    setIsAddAgentDialogOpen(false)
  }

  // Handle edit agent
  const handleEditAgent = (agent: any) => {
    setCurrentAgent(agent)
    setIsEditAgentDialogOpen(true)
  }

  // Handle update agent
  const handleUpdateAgent = (updatedAgent: any) => {
    const updatedAgents = agents.map((agent) => (agent.id === updatedAgent.id ? updatedAgent : agent))
    setAgents(updatedAgents)
    setHasUnsavedChanges(true)
    setIsEditAgentDialogOpen(false)
  }

  // Handle delete agent
  const handleDeleteAgent = (agent: any) => {
    setCurrentAgent(agent)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete agent
  const confirmDeleteAgent = () => {
    const updatedAgents = agents.filter((agent) => agent.id !== currentAgent.id)
    setAgents(updatedAgents)
    setHasUnsavedChanges(true)
    setIsDeleteDialogOpen(false)
  }

  // Get icon for agent
  const getAgentIcon = (iconName: any) => {
    const IconComponent = iconName || User
    return <IconComponent className="h-5 w-5" />
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Agents</h3>
          <Button onClick={() => setIsAddAgentDialogOpen(true)} size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Agent
          </Button>
        </div>

        {/* Agent List */}
        <div className="border rounded-md">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={agents.map((agent) => agent.id)} strategy={verticalListSortingStrategy}>
              <ul className="divide-y">
                {agents.map((agent) => (
                  <SortableAgentItem
                    key={agent.id}
                    agent={agent}
                    onEdit={handleEditAgent}
                    onDelete={handleDeleteAgent}
                    getAgentIcon={getAgentIcon}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          {agents.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>No agents configured. Click "Add Agent" to create your crew.</p>
            </div>
          )}
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveChanges}
            disabled={isLoading || !hasUnsavedChanges}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={cn(
              "p-3 rounded-md flex items-center gap-2",
              statusMessage.type === "success"
                ? "bg-green-50 text-green-600"
                : statusMessage.type === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-blue-50 text-blue-600",
            )}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : statusMessage.type === "error" ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Add Agent Dialog */}
        <AddAgentDialog
          isOpen={isAddAgentDialogOpen}
          onClose={() => setIsAddAgentDialogOpen(false)}
          onAddAgent={handleAddAgent}
        />

        {/* Edit Agent Dialog */}
        {currentAgent && (
          <EditAgentDialog
            isOpen={isEditAgentDialogOpen}
            agent={currentAgent}
            onClose={() => setIsEditAgentDialogOpen(false)}
            onUpdateAgent={handleUpdateAgent}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the agent "{currentAgent?.name}" from your crew. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteAgent} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

interface SortableAgentItemProps {
  agent: any
  onEdit: (agent: any) => void
  onDelete: (agent: any) => void
  getAgentIcon: (iconName: any) => JSX.Element
}

function SortableAgentItem({ agent, onEdit, onDelete, getAgentIcon }: SortableAgentItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: agent.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center p-4 bg-white",
        isDragging ? "shadow-md rounded-md border" : "",
        agent.priority === "high"
          ? "border-l-4 border-l-blue-500"
          : agent.priority === "medium"
            ? "border-l-4 border-l-amber-500"
            : "border-l-4 border-l-gray-300",
      )}
    >
      <div className="cursor-move touch-none" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="ml-3 flex-1">
        <div className="flex items-center">
          <div className="mr-2">{getAgentIcon(agent.icon)}</div>
          <div>
            <h4 className="font-medium">{agent.name}</h4>
            <p className="text-sm text-gray-500">{agent.role}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{agent.model}</div>
        <div
          className={cn(
            "text-xs px-2 py-1 rounded-full",
            agent.priority === "high"
              ? "bg-blue-100 text-blue-700"
              : agent.priority === "medium"
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-700",
          )}
        >
          {agent.priority} priority
        </div>
      </div>
      <div className="flex items-center gap-1 ml-4">
        <Button variant="ghost" size="icon" onClick={() => onEdit(agent)} className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(agent)} className="h-8 w-8 text-red-500">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  )
}
