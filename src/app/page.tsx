"use client"

import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { RecentModules } from "@/components/recent-modules"
import { useState } from "react"

// Lazy-load KanbanBoard without SSR
const KanbanBoard = dynamic(() => import("@/components/kanban-board").then(mod => mod.KanbanBoard), {
  ssr: false,
})

export default function HomePage() {
  const [selectedBoard, setSelectedBoard] = useState("All Projects")

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header selectedBoard={selectedBoard} onBoardChange={setSelectedBoard} />

        <main className="flex-1 overflow-auto">
          <KanbanBoard selectedBoard={selectedBoard} />
          <div className="-mt-12">
            <RecentModules />
          </div>
        </main>
      </div>
    </div>
  )
}
