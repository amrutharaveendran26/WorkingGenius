"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  MessageSquare,
  Paperclip,
  ArrowUpDown,
  Eye,
  EyeOff,
  Plus,
  Square,
  GripHorizontal,
  FileText,
  Edit3,
} from "lucide-react"
import { useState, useRef, useCallback } from "react"
import { CardDetailModal } from "./card-detail-modal"

interface KanbanBoardProps {
  selectedBoard: string
}

const workingGeniusTypes = [
  { id: "wonder", title: "Wonder", color: "bg-chart-1", description: "Pondering and questioning" },
  { id: "invention", title: "Invention", color: "bg-chart-2", description: "Creating and brainstorming" },
  { id: "discernment", title: "Discernment", color: "bg-chart-3", description: "Evaluating and critiquing" },
  { id: "galvanizing", title: "Galvanizing", color: "bg-chart-4", description: "Rallying and inspiring" },
  { id: "enablement", title: "Enablement", color: "bg-chart-5", description: "Supporting and assisting" },
  { id: "tenacity", title: "Tenacity", color: "bg-primary", description: "Pushing to the finish" },
]

const stageTypes = [
  {
    id: "ideation",
    title: "Ideation",
    color: "bg-chart-1",
    description: "Wondering and inventing",
    geniuses: ["wonder", "invention"],
  },
  {
    id: "activation",
    title: "Activation",
    color: "bg-chart-3",
    description: "Discerning and galvanizing",
    geniuses: ["discernment", "galvanizing"],
  },
  {
    id: "implementation",
    title: "Implementation",
    color: "bg-chart-5",
    description: "Enabling and persevering",
    geniuses: ["enablement", "tenacity"],
  },
]

const sampleTasks = [
  {
    id: 1,
    title: "Research user pain points",
    description: "Conduct interviews to understand current workflow issues",
    assignee: "Sarah Chen",
    dueDate: "Dec 15",
    comments: 1,
    attachments: 2,
    priority: "high",
    status: "on-track",
    column: "wonder",
    completed: false,
    progress: 75,
    progressEnabled: true,
    boards: ["Marketing Team Meetings", "Product Development"],
    subtasks: [
      { id: 1, title: "Interview stakeholders", owner: "Sarah Chen", dueDate: "Dec 10", completed: true },
      { id: 2, title: "Analyze feedback", owner: "Mike Johnson", dueDate: "Dec 12", completed: false },
    ],
  },
  {
    id: 2,
    title: "Design new dashboard layout",
    description: "Create wireframes for improved user experience",
    assignee: "Mike Johnson",
    dueDate: "Dec 18",
    comments: 0,
    attachments: 1,
    priority: "medium",
    status: "at-risk",
    column: "invention",
    completed: false,
    progress: 45,
    progressEnabled: false,
    boards: ["Social Media"],
    subtasks: [],
  },
  {
    id: 3,
    title: "Review prototype feedback",
    description: "Analyze user testing results and iterate on design",
    assignee: "Alex Rivera",
    dueDate: "Dec 20",
    comments: 3,
    attachments: 0,
    priority: "high",
    status: "blocked",
    column: "discernment",
    completed: false,
    progress: 20,
    progressEnabled: true,
    boards: ["Marketing Team Meetings", "Social Media"],
    subtasks: [
      { id: 3, title: "Compile feedback", owner: "Alex Rivera", dueDate: "Dec 18", completed: true },
      { id: 4, title: "Create action items", owner: "Sarah Chen", dueDate: "Dec 19", completed: false },
    ],
  },
  {
    id: 4,
    title: "Implement authentication system",
    description: "Set up secure login and user management",
    assignee: "David Kim",
    dueDate: "Dec 22",
    comments: 2,
    attachments: 1,
    priority: "high",
    status: "on-track",
    column: "enablement",
    completed: false,
    progress: 60,
    progressEnabled: true,
    boards: ["Product Development"],
    subtasks: [],
  },
  {
    id: 5,
    title: "Create marketing materials",
    description: "Design brochures and digital assets for campaign",
    assignee: "Emma Wilson",
    dueDate: "Dec 25",
    comments: 1,
    attachments: 3,
    priority: "medium",
    status: "on-track",
    column: "galvanizing",
    completed: false,
    progress: 30,
    progressEnabled: false,
    boards: ["Marketing Team Meetings"],
    subtasks: [],
  },
  {
    id: 6,
    title: "Optimize database queries",
    description: "Improve application performance and response times",
    assignee: "Chris Taylor",
    dueDate: "Dec 28",
    comments: 0,
    attachments: 0,
    priority: "low",
    status: "on-track",
    column: "tenacity",
    completed: true,
    progress: 100,
    progressEnabled: true,
    boards: ["Product Development"],
    subtasks: [],
  },
]

const teamMembers = [
  {
    name: "Sarah Chen",
    wonder: "genius",
    invention: "competency",
    discernment: "frustration",
    galvanizing: "frustration",
    enablement: "competency",
    tenacity: "genius",
  },
  {
    name: "Mike Johnson",
    wonder: "competency",
    invention: "genius",
    discernment: "genius",
    galvanizing: "competency",
    enablement: "frustration",
    tenacity: "frustration",
  },
  {
    name: "Lisa Park",
    wonder: "frustration",
    invention: "frustration",
    discernment: "competency",
    galvanizing: "genius",
    enablement: "genius",
    tenacity: "competency",
  },
  {
    name: "Alex Rodriguez",
    wonder: "genius",
    invention: "frustration",
    discernment: "competency",
    galvanizing: "competency",
    enablement: "genius",
    tenacity: "frustration",
  },
  {
    name: "Emma Wilson",
    wonder: "competency",
    invention: "genius",
    discernment: "frustration",
    galvanizing: "frustration",
    enablement: "competency",
    tenacity: "genius",
  },
]

export function KanbanBoard({ selectedBoard }: KanbanBoardProps) {
  const [sortBy, setSortBy] = useState<string>("dueDate")
  const [showCompleted, setShowCompleted] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"genius" | "stage">("genius")
  const [tasks, setTasks] = useState(sampleTasks)
  const [selectedTask, setSelectedTask] = useState<(typeof sampleTasks)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [draggedTask, setDraggedTask] = useState<(typeof sampleTasks)[0] | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [kanbanHeight, setKanbanHeight] = useState(600)
  const [isResizing, setIsResizing] = useState(false)
  const [showDraftZone, setShowDraftZone] = useState(false)
  const [showArchiveZone, setShowArchiveZone] = useState(false)
  const [isDraftPanelOpen, setIsDraftPanelOpen] = useState(false)
  const [isArchivePanelOpen, setIsArchivePanelOpen] = useState(false)
  const [dragOverEdge, setDragOverEdge] = useState<"left" | "right" | null>(null)
  const resizeRef = useRef<HTMLDivElement>(null)

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (resizeRef.current) {
        const rect = resizeRef.current.getBoundingClientRect()
        const newHeight = Math.max(400, Math.min(1200, e.clientY - rect.top))
        setKanbanHeight(newHeight)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [])

  const sortTasks = (tasks: typeof sampleTasks) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "dueDate":
          return new Date(a.dueDate + ", 2024").getTime() - new Date(b.dueDate + ", 2024").getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (
            priorityOrder[b.priority as keyof typeof priorityOrder] -
            priorityOrder[a.priority as keyof typeof priorityOrder]
          )
        case "status":
          const statusOrder = { blocked: 3, "at-risk": 2, "on-track": 1 }
          return statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder]
        default:
          return 0
      }
    })
  }

  const filterTasksByBoard = (tasks: typeof sampleTasks) => {
    if (selectedBoard === "All Projects") {
      return tasks
    }
    return tasks.filter((task) => task.boards?.includes(selectedBoard))
  }

  const filterTasks = (tasks: typeof sampleTasks) => {
    const boardFiltered = filterTasksByBoard(tasks)
    return showCompleted ? boardFiltered : boardFiltered.filter((task) => !task.completed)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-500"
      case "at-risk":
        return "bg-yellow-500"
      case "blocked":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "on-track":
        return "On Track"
      case "at-risk":
        return "At Risk"
      case "blocked":
        return "Blocked"
      default:
        return "Unknown"
    }
  }

  const handleCardClick = (task: (typeof sampleTasks)[0]) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = (updatedTask: (typeof sampleTasks)[0]) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleDuplicateTask = (taskToDuplicate: (typeof sampleTasks)[0]) => {
    setTasks([...tasks, taskToDuplicate])
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleCreateCard = (columnId: string) => {
    let assignedColumn = columnId
    if (viewMode === "stage") {
      const stage = stageTypes.find((s) => s.id === columnId)
      assignedColumn = stage?.geniuses[0] || columnId
    }

    const newTask = {
      id: Math.max(...tasks.map((t) => t.id)) + 1,
      title: "New Task",
      description: "Add description...",
      assignee: "You",
      dueDate: "Dec 31",
      comments: 0,
      attachments: 0,
      priority: "medium" as const,
      status: "on-track" as const,
      column: assignedColumn,
      completed: false,
      progress: 0,
      progressEnabled: false,
      boards: selectedBoard === "All Projects" ? ["Marketing Team Meetings"] : [selectedBoard],
      subtasks: [],
    }
    setTasks([...tasks, newTask])
    setSelectedTask(newTask)
    setIsModalOpen(true)
  }

  const handleDragStart = (e: React.DragEvent, task: (typeof sampleTasks)[0]) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverColumn(columnId)
  }

  const handleColumnDragLeave = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null)
      setDragOverIndex(null)
    }
  }

  const handleCardDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const threshold = rect.top + rect.height * 0.8
    const dropIndex = e.clientY < threshold ? index : index + 1
    setDragOverIndex(dropIndex)

    // Ensure we maintain the column drag over state
    const columnElement = (e.currentTarget as HTMLElement).closest("[data-column-id]")
    if (columnElement) {
      const columnId = columnElement.getAttribute("data-column-id")
      if (columnId) {
        setDragOverColumn(columnId)
      }
    }
  }

  const handleCardDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string, dropIndex?: number) => {
    e.preventDefault()
    if (!draggedTask) return

    let newColumn = targetColumnId
    if (viewMode === "stage") {
      const stage = stageTypes.find((s) => s.id === targetColumnId)
      newColumn = stage?.geniuses[0] || targetColumnId
    }

    if (draggedTask.column !== newColumn || dropIndex !== undefined) {
      let updatedTasks = [...tasks]
      updatedTasks = updatedTasks.filter((task) => task.id !== draggedTask.id)
      const updatedTask = { ...draggedTask, column: newColumn }

      if (dropIndex !== undefined) {
        const columnTasks = updatedTasks.filter((task) => task.column === newColumn)
        const insertIndex = Math.min(dropIndex, columnTasks.length)

        let actualIndex = 0
        let columnTaskCount = 0
        for (let i = 0; i < updatedTasks.length; i++) {
          if (updatedTasks[i].column === newColumn) {
            if (columnTaskCount === insertIndex) {
              actualIndex = i
              break
            }
            columnTaskCount++
          }
          if (i === updatedTasks.length - 1) {
            actualIndex = updatedTasks.length
          }
        }

        updatedTasks.splice(actualIndex, 0, updatedTask)
      } else {
        updatedTasks.push(updatedTask)
      }

      setTasks(updatedTasks)
    }

    setDraggedTask(null)
    setDragOverIndex(null)
    setDragOverColumn(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverIndex(null)
    setDragOverColumn(null)
  }

  const getTasksForStage = (stageGeniuses: string[]) => {
    return tasks.filter((task) => stageGeniuses.includes(task.column))
  }

  const handleDragOverEdge = (e: React.DragEvent, edge: "left" | "right") => {
    e.preventDefault()
    if (draggedTask) {
      setDragOverEdge(edge)
      if (edge === "left") {
        setShowDraftZone(true)
      } else {
        setShowArchiveZone(true)
      }
    }
  }

  const handleDragLeaveEdge = () => {
    setDragOverEdge(null)
    setShowDraftZone(false)
    setShowArchiveZone(false)
  }

  const handleDropToDraft = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedTask) {
      const updatedTask = { ...draggedTask, column: "draft" }
      setTasks(tasks.map((task) => (task.id === draggedTask.id ? updatedTask : task)))
      setDraggedTask(null)
      setShowDraftZone(false)
      setDragOverEdge(null)
    }
  }

  const handleDropToArchive = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedTask) {
      const updatedTask = { ...draggedTask, column: "archive" }
      setTasks(tasks.map((task) => (task.id === draggedTask.id ? updatedTask : task)))
      setDraggedTask(null)
      setShowArchiveZone(false)
      setDragOverEdge(null)
    }
  }

  const getDraftTasks = () => tasks.filter((task) => task.column === "draft")
  const getArchiveTasks = () => tasks.filter((task) => task.column === "archive")

  const restoreFromDraft = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      const updatedTask = { ...task, column: "wonder" }
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)))
    }
  }

  const restoreFromArchive = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      const updatedTask = { ...task, column: "wonder" }
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)))
    }
  }

  const displayColumns = viewMode === "genius" ? workingGeniusTypes : stageTypes

  const userGeniusResults = {
    wonder: "frustration",
    invention: "genius",
    discernment: "competency",
    galvanizing: "genius",
    enablement: "frustration",
    tenacity: "competency",
  }

  const getGeniusResultStyle = (geniusId: string) => {
    const result = userGeniusResults[geniusId as keyof typeof userGeniusResults]
    switch (result) {
      case "genius":
        return "bg-green-50 border border-green-200"
      case "frustration":
        return "bg-red-50 border border-red-200"
      case "competency":
        return "border border-gray-200"
      default:
        return ""
    }
  }

  const getStageResultStyle = (stageGeniuses: string[]) => {
    const results = stageGeniuses.map((g) => userGeniusResults[g as keyof typeof userGeniusResults])
    const geniusCount = results.filter((r) => r === "genius").length
    const frustrationCount = results.filter((r) => r === "frustration").length

    if (geniusCount === 2) return "bg-green-50 border border-green-200"
    if (frustrationCount === 2) return "bg-red-50 border border-red-200"
    if (geniusCount === 1 && frustrationCount === 1)
      return "bg-gradient-to-r from-green-50 to-red-50 border border-gray-200"
    if (geniusCount === 1) return "bg-gradient-to-r from-green-50 to-white border border-gray-200"
    if (frustrationCount === 1) return "bg-gradient-to-r from-red-50 to-white border border-gray-200"
    return "border border-gray-200"
  }

  const getTeamCountsForGenius = (geniusId: string) => {
    const counts = { genius: 0, competency: 0, frustration: 0 }
    teamMembers.forEach((member) => {
      const result = member[geniusId as keyof typeof member]
      if (result && typeof result === "string") {
        counts[result as keyof typeof counts]++
      }
    })
    return counts
  }

  const getTeamCountsForStage = (stageGeniuses: string[]) => {
    const counts = { genius: 0, competency: 0, frustration: 0 }
    stageGeniuses.forEach((geniusId) => {
      const geniusCounts = getTeamCountsForGenius(geniusId)
      counts.genius += geniusCounts.genius
      counts.competency += geniusCounts.competency
      counts.frustration += geniusCounts.frustration
    })
    return counts
  }

  const handleDraftHover = (show: boolean) => {
    if (!draggedTask) {
      setShowDraftZone(show)
    }
  }

  const handleArchiveHover = (show: boolean) => {
    if (!draggedTask) {
      setShowArchiveZone(show)
    }
  }

  return (
    <div className="p-6 relative">
      {(showDraftZone || draggedTask) && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30"
          onMouseEnter={() => handleDraftHover(true)}
          onMouseLeave={() => handleDraftHover(false)}
          onDragOver={(e) => handleDragOverEdge(e, "left")}
          onDragLeave={handleDragLeaveEdge}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-r-md px-2 py-4 shadow-sm border border-gray-200 min-h-[80px] flex flex-col items-center justify-center">
            {draggedTask ? (
              <div
                className="text-gray-600 text-xs font-medium cursor-pointer text-center"
                onDrop={handleDropToDraft}
                onDragOver={(e) => e.preventDefault()}
              >
                <Edit3 className="h-4 w-4 mx-auto mb-1" />
                <span className="text-xs font-medium block mb-2">{getDraftTasks().length}</span>
                {dragOverEdge === "left" && <div className="text-xs">Drop to Draft</div>}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDraftPanelOpen(true)}
                className="text-gray-600 hover:bg-gray-100 p-2 h-auto flex flex-col items-center gap-1"
              >
                <Edit3 className="h-4 w-4" />
                <span className="text-xs font-medium">{getDraftTasks().length}</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {(showArchiveZone || draggedTask) && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30"
          onMouseEnter={() => handleArchiveHover(true)}
          onMouseLeave={() => handleArchiveHover(false)}
          onDragOver={(e) => handleDragOverEdge(e, "right")}
          onDragLeave={handleDragLeaveEdge}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-l-md px-2 py-4 shadow-sm border border-gray-200 min-h-[80px] flex flex-col items-center justify-center">
            {draggedTask ? (
              <div
                className="text-gray-600 text-xs font-medium cursor-pointer text-center"
                onDrop={handleDropToArchive}
                onDragOver={(e) => e.preventDefault()}
              >
                <FileText className="h-4 w-4 mx-auto mb-1" />
                <span className="text-xs font-medium block mb-2">{getArchiveTasks().length}</span>
                {dragOverEdge === "right" && <div className="text-xs">Drop to Archive</div>}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsArchivePanelOpen(true)}
                className="text-gray-600 hover:bg-gray-100 p-2 h-auto flex flex-col items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                <span className="text-xs font-medium">{getArchiveTasks().length}</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {isDraftPanelOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex">
          <div className="bg-white w-96 h-full shadow-xl overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">Draft Cards</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsDraftPanelOpen(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {getDraftTasks().map((task) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => restoreFromDraft(task.id)}>
                        Restore
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleCardClick(task)}>
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getDraftTasks().length === 0 && <p className="text-center text-muted-foreground py-8">No draft cards</p>}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsDraftPanelOpen(false)} />
        </div>
      )}

      {isArchivePanelOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="flex-1" onClick={() => setIsArchivePanelOpen(false)} />
          <div className="bg-white w-96 h-full shadow-xl overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">Archived Cards</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsArchivePanelOpen(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {getArchiveTasks().map((task) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => restoreFromArchive(task.id)}>
                        Restore
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleCardClick(task)}>
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getArchiveTasks().length === 0 && (
                <p className="text-center text-muted-foreground py-8">No archived cards</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-40 z-20"
        onMouseEnter={() => handleDraftHover(true)}
        onMouseLeave={() => handleDraftHover(false)}
        onDragOver={(e) => handleDragOverEdge(e, "left")}
        onDragLeave={handleDragLeaveEdge}
      />

      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-40 z-20"
        onMouseEnter={() => handleArchiveHover(true)}
        onMouseLeave={() => handleArchiveHover(false)}
        onDragOver={(e) => handleDragOverEdge(e, "right")}
        onDragLeave={handleDragLeaveEdge}
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Project Overview</h2>
          <p className="text-muted-foreground">
            {viewMode === "genius" ? "Organize tasks by Working Genius types" : "Organize tasks by Work Stages"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "genius" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("genius")}
              className={`px-3 py-1 text-xs font-medium transition-all ${
                viewMode === "genius"
                  ? "bg-background shadow-sm text-foreground"
                  : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              Genius
            </Button>
            <Button
              variant={viewMode === "stage" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("stage")}
              className={`px-3 py-1 text-xs font-medium transition-all ${
                viewMode === "stage"
                  ? "bg-background shadow-sm text-foreground"
                  : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              Stage
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2"
          >
            {showCompleted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showCompleted ? "Hide" : "Show"} Completed
          </Button>
        </div>
      </div>

      <div ref={resizeRef} className="relative">
        <div className={`grid gap-4 mb-8 ${viewMode === "genius" ? "grid-cols-6" : "grid-cols-3"}`}>
          {displayColumns.map((column) => {
            const columnTasks =
              viewMode === "genius"
                ? tasks.filter((task) => task.column === column.id)
                : getTasksForStage((column as any).geniuses || [column.id])

            const filteredAndSortedTasks = sortTasks(filterTasks(columnTasks))

            const teamCounts =
              viewMode === "genius"
                ? getTeamCountsForGenius(column.id)
                : getTeamCountsForStage((column as any).geniuses || [column.id])

            return (
              <div key={column.id} className="space-y-4 flex flex-col" style={{ height: `${kanbanHeight}px` }}>
                <div
                  className={`p-3 rounded-lg ${
                    viewMode === "genius"
                      ? getGeniusResultStyle(column.id)
                      : getStageResultStyle((column as any).geniuses || [column.id])
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-foreground">{column.title}</h3>
                      <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                        <span className="text-xs font-medium text-muted-foreground">
                          {filteredAndSortedTasks.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{column.description}</p>
                </div>

                <div
                  className="space-y-3 flex-1 relative overflow-y-auto"
                  data-column-id={column.id}
                  onMouseEnter={() => setHoveredColumn(column.id)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  onDragOver={(e) => handleColumnDragOver(e, column.id)}
                  onDragLeave={(e) => handleColumnDragLeave(e, column.id)}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {hoveredColumn === column.id && !draggedTask && (
                    <div className="mb-3 z-10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8 border-dashed border-muted-foreground/50 bg-background/80 backdrop-blur-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCreateCard(column.id)}
                        onMouseEnter={() => setHoveredColumn(column.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Card
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {filteredAndSortedTasks.map((task, index) => (
                      <div key={task.id} className="relative">
                        {dragOverIndex === index && draggedTask && dragOverColumn === column.id && (
                          <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full z-20 shadow-lg animate-pulse" />
                        )}

                        <Card
                          className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                            task.completed ? "opacity-60 bg-muted/50" : ""
                          } ${draggedTask?.id === task.id ? "opacity-50 rotate-2 scale-105" : ""} ${
                            dragOverIndex === index && draggedTask && dragOverColumn === column.id ? "mt-4" : ""
                          }`}
                          onClick={() => handleCardClick(task)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleCardDragOver(e, index)}
                          onDragLeave={handleCardDragLeave}
                          onDrop={(e) => {
                            e.stopPropagation()
                            handleDrop(e, column.id, dragOverIndex ?? index)
                          }}
                        >
                          <CardHeader className="pb-0">
                            <CardTitle className="text-sm font-medium text-balance w-full mb-2 line-clamp-3">
                              {task.title}
                            </CardTitle>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                                <span className="text-xs text-muted-foreground">{getStatusLabel(task.status)}</span>
                              </div>

                              {task.progressEnabled && task.progress !== undefined && task.progress > 0 && (
                                <div className="mt-5 mb-0">
                                  <div className="w-full bg-white rounded-full h-1.5 border border-gray-300">
                                    <div
                                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                      style={{ width: `${task.progress}%` }}
                                    />
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">{task.progress}% complete</div>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="-mt-2 pt-0">
                            <p className="text-xs text-muted-foreground mb-5">{task.description}</p>

                            <div className="flex items-center justify-start">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="/diverse-team-member.png" alt={task.assignee} />
                                    <AvatarFallback className="text-xs">
                                      {task.assignee
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
                                </div>

                                <div className="flex items-center justify-start gap-1.5 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-0.5">
                                    <Clock className="h-3 w-3" />
                                    <span className="whitespace-nowrap min-w-0 text-xs">{task.dueDate}</span>
                                  </div>
                                  {task.comments > 0 && (
                                    <div className="flex items-center gap-0.5">
                                      <MessageSquare className="h-2.5 w-2.5" />
                                      <span className="text-xs">{task.comments}</span>
                                    </div>
                                  )}
                                  {task.subtasks && task.subtasks.length > 0 && (
                                    <div className="flex items-center gap-0.5">
                                      <Square className="h-2.5 w-2.5" />
                                      <span className="text-xs">{task.subtasks.length}</span>
                                    </div>
                                  )}
                                  {task.attachments > 0 && (
                                    <div className="flex items-center gap-0.5">
                                      <Paperclip className="h-2 w-2" />
                                      <span className="text-xs">{task.attachments}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {index === filteredAndSortedTasks.length - 1 &&
                          dragOverIndex === filteredAndSortedTasks.length &&
                          draggedTask &&
                          dragOverColumn === column.id && (
                            <div className="mt-4 h-1 bg-primary rounded-full shadow-lg animate-pulse z-20" />
                          )}
                      </div>
                    ))}

                    {filteredAndSortedTasks.length === 0 && draggedTask && dragOverColumn === column.id && (
                      <div
                        className="h-20 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center text-primary/50"
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onDrop={(e) => {
                          e.stopPropagation()
                          handleDrop(e, column.id, 0)
                        }}
                      >
                        Drop here
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 py-2 border-t border-muted bg-background/80 backdrop-blur-sm mb-2">
                  {teamCounts.genius > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-300" />
                      <span className="text-xs font-medium text-green-600">{teamCounts.genius}</span>
                    </div>
                  )}
                  {teamCounts.competency > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <span className="text-xs font-medium text-gray-500">{teamCounts.competency}</span>
                    </div>
                  )}
                  {teamCounts.frustration > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-300" />
                      <span className="text-xs font-medium text-red-600">{teamCounts.frustration}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 h-2 cursor-row-resize group hover:bg-primary/20 transition-colors ${
            isResizing ? "bg-primary/30" : ""
          }`}
          onMouseDown={handleResizeStart}
        >
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
            <GripHorizontal
              className={`h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ${
                isResizing ? "text-primary" : ""
              }`}
            />
          </div>
        </div>
      </div>

      <CardDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDuplicate={handleDuplicateTask}
        onDelete={handleDeleteTask}
        isNewCard={selectedTask?.title === "New Task"}
      />
    </div>
  )
}
