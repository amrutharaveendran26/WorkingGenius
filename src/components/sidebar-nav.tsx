"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Home,
  FolderKanban,
  BarChart3,
  BookOpen,
  Users,
  Settings,
  Plus,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigationItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: BarChart3, label: "Results", href: "/results" },
  { icon: BookOpen, label: "Learn", href: "/learn" },
  { icon: Users, label: "My Team", href: "/team" },
]

const teams = ["Design Team", "Development Team", "Marketing Team"]

export function SidebarNav() {
  const [isTeamExpanded, setIsTeamExpanded] = useState(false)

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">WorkingGenius</h1>
            <p className="text-xs text-muted-foreground">Project Suite</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-gray-100 border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        {/* Team Selector */}
        <Collapsible open={isTeamExpanded} onOpenChange={setIsTeamExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                Select Team
              </span>
              {isTeamExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            {teams.map((team) => (
              <Button
                key={team}
                variant="ghost"
                size="sm"
                className="w-full justify-start pl-8 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                {team}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start pl-8 text-sm text-accent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Settings */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  )
}
