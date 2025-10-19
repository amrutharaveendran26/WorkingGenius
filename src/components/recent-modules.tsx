"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"

const recentProjects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "In Progress",
    progress: 75,
    team: ["Sarah Chen", "Mike Johnson", "Lisa Park"],
    lastActivity: "2 hours ago",
    dueDate: "Dec 20, 2024",
  },
  {
    id: 2,
    name: "Mobile App Launch",
    status: "Review",
    progress: 90,
    team: ["Alex Kim", "Emma Wilson"],
    lastActivity: "1 day ago",
    dueDate: "Jan 15, 2025",
  },
  {
    id: 3,
    name: "Brand Guidelines",
    status: "Planning",
    progress: 25,
    team: ["David Lee", "Sophie Brown", "Tom Garcia"],
    lastActivity: "3 days ago",
    dueDate: "Feb 1, 2025",
  },
]

const recentActivity = [
  {
    id: 1,
    user: "Sarah Chen",
    action: "completed task",
    target: "User research interviews",
    time: "2 hours ago",
    project: "Website Redesign",
  },
  {
    id: 2,
    user: "Mike Johnson",
    action: "uploaded file",
    target: "Dashboard wireframes.fig",
    time: "4 hours ago",
    project: "Mobile App Launch",
  },
  {
    id: 3,
    user: "Lisa Park",
    action: "commented on",
    target: "Prototype feedback review",
    time: "6 hours ago",
    project: "Website Redesign",
  },
  {
    id: 4,
    user: "Alex Kim",
    action: "moved task",
    target: "API integration to Testing",
    time: "1 day ago",
    project: "Mobile App Launch",
  },
  {
    id: 5,
    user: "Emma Wilson",
    action: "created task",
    target: "Performance optimization",
    time: "1 day ago",
    project: "Mobile App Launch",
  },
]

export function RecentModules() {
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Projects</CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="space-y-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{project.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {project.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{project.progress}% complete</span>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src="/diverse-team-member.png" alt={member} />
                      <AvatarFallback className="text-xs">
                        {member
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due {project.dueDate}
                </div>
                <span>Updated {project.lastActivity}</span>
              </div>

              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-team-member.png" alt={activity.user} />
                <AvatarFallback className="text-xs">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <span className="font-medium text-foreground">{activity.user}</span>
                  <span className="text-muted-foreground"> {activity.action} </span>
                  <span className="font-medium text-foreground">{activity.target}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {activity.project}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
