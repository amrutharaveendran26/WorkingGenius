"use client"

import { Bell, User, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  selectedBoard: string
  onBoardChange: (board: string) => void
}

export function Header({ selectedBoard, onBoardChange }: HeaderProps) {
  const teamName = "Marketing Team"
  const boards = ["All Projects", "Marketing Team Meetings", "Social Media", "Content Strategy", "Brand Development"]

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{teamName}</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <span className="text-sm font-medium">{selectedBoard}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {boards.map((board) => (
              <DropdownMenuItem
                key={board}
                onClick={() => onBoardChange(board)}
                className={selectedBoard === board ? "bg-accent" : ""}
              >
                {board}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-blue-600">
              <Plus className="h-4 w-4" />
              Create New Board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>

        {/* Profile */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="/professional-profile.png" alt="Profile" />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
