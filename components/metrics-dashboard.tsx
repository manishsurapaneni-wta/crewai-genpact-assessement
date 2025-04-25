"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle, ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatisticCard } from "@/components/statistic-card"
import { GaugeChart } from "@/components/gauge-chart"
import { SimpleBarChart } from "@/components/simple-bar-chart"
import { StatusIndicator } from "@/components/status-indicator"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock metrics data
const mockFetchMetrics = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate a 5% chance of error
  if (Math.random() < 0.05) {
    throw new Error("Failed to fetch metrics")
  }

  // Generate some random metrics data
  const successRate = Math.floor(85 + Math.random() * 15)
  const totalTasks = Math.floor(1000 + Math.random() * 500)
  const completedTasks = Math.floor((totalTasks * successRate) / 100)
  const failedTasks = totalTasks - completedTasks
  const avgExecutionTime = Math.floor(200 + Math.random() * 100)
  const systemHealth = successRate > 95 ? "healthy" : successRate > 85 ? "warning" : "critical"

  // Agent execution times for the bar chart
  const agentExecutionTimes = [
    { name: "Research", value: Math.floor(100 + Math.random() * 150) },
    { name: "Analysis", value: Math.floor(150 + Math.random() * 200) },
    { name: "Screening", value: Math.floor(180 + Math.random() * 220) },
    { name: "Reporting", value: Math.floor(120 + Math.random() * 180) },
  ]

  // Generate detailed task data for the table
  const taskData = Array.from({ length: 20 }, (_, i) => ({
    id: `task-${1000 + i}`,
    name: `Task ${i + 1}`,
    type: ["Analysis", "Research", "Screening", "Reporting"][Math.floor(Math.random() * 4)],
    status: ["Completed", "Failed", "In Progress"][Math.floor(Math.random() * 3)],
    executionTime: Math.floor(100 + Math.random() * 300),
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
  }))

  return {
    successRate,
    totalTasks,
    completedTasks,
    failedTasks,
    avgExecutionTime,
    systemHealth,
    agentExecutionTimes,
    taskData,
    lastUpdated: new Date().toISOString(),
  }
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const fetchMetrics = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await mockFetchMetrics()
      setMetrics(data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError("Failed to fetch metrics. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort task data
  const getFilteredAndSortedTasks = () => {
    if (!metrics?.taskData) return []

    const filtered = metrics.taskData.filter(
      (task: any) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const sorted = [...filtered].sort((a: any, b: any) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }

  // Paginate tasks
  const getPaginatedTasks = () => {
    const filteredAndSorted = getFilteredAndSortedTasks()
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSorted.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = metrics?.taskData ? Math.ceil(getFilteredAndSortedTasks().length / itemsPerPage) : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Metrics Dashboard</h2>
        <div className="flex items-center gap-4">
          {lastUpdated && <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>}
          <Button
            onClick={fetchMetrics}
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {loading && !metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-32 rounded-lg"></div>
          ))}
          <div className="bg-gray-100 h-64 rounded-lg md:col-span-2"></div>
          <div className="bg-gray-100 h-64 rounded-lg md:col-span-2"></div>
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Top row - Statistic cards */}
          <StatisticCard
            title="Total Tasks"
            value={metrics.totalTasks}
            description="Total number of tasks executed"
            loading={loading}
          />
          <StatisticCard
            title="Completed Tasks"
            value={metrics.completedTasks}
            description="Successfully completed tasks"
            trend="positive"
            loading={loading}
          />
          <StatisticCard
            title="Failed Tasks"
            value={metrics.failedTasks}
            description="Tasks that failed to complete"
            trend="negative"
            loading={loading}
          />
          <StatisticCard
            title="Avg. Execution Time"
            value={metrics.avgExecutionTime}
            unit="ms"
            description="Average task execution time"
            loading={loading}
          />

          {/* Middle row - Gauge and status */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Success Rate</CardTitle>
              <CardDescription>Percentage of successfully completed tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <GaugeChart value={metrics.successRate} loading={loading} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Health</CardTitle>
              <CardDescription>Overall system status based on metrics</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px]">
              <StatusIndicator status={metrics.systemHealth} loading={loading} />
            </CardContent>
          </Card>

          {/* Bottom row - Chart */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Agent Execution Times</CardTitle>
              <CardDescription>Average execution time by agent type (milliseconds)</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <SimpleBarChart data={metrics.agentExecutionTimes} loading={loading} />
            </CardContent>
          </Card>

          {/* Task Data Table with Sorting */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Tasks</CardTitle>
              <CardDescription>Details of recently executed tasks</CardDescription>
              <div className="mt-2">
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page on search
                  }}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("name")}>
                        <div className="flex items-center">
                          Task Name
                          {sortField === "name" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ArrowDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("type")}>
                        <div className="flex items-center">
                          Type
                          {sortField === "type" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ArrowDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("status")}>
                        <div className="flex items-center">
                          Status
                          {sortField === "status" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ArrowDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50 text-right"
                        onClick={() => handleSort("executionTime")}
                      >
                        <div className="flex items-center justify-end">
                          Time (ms)
                          {sortField === "executionTime" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ArrowDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedTasks().map((task: any) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{task.type}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              task.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : task.status === "Failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800",
                            )}
                          >
                            {task.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{task.executionTime}</TableCell>
                      </TableRow>
                    ))}
                    {getPaginatedTasks().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          No tasks found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, getFilteredAndSortedTasks().length)} of{" "}
                    {getFilteredAndSortedTasks().length} tasks
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
