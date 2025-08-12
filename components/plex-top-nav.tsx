"use client"

import { Menu, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface PlexTopNavProps {
  activeTab: string
  onTabSelect: (tab: string) => void
  onMenuToggle: () => void
}

const topNavItems = [
  { id: "Home", label: "Home" },
  { id: "Trending", label: "Trending" },
  { id: "Activity", label: "Activity" },
  { id: "Profile", label: "Profile" },
]

export function PlexTopNav({ activeTab, onTabSelect, onMenuToggle }: PlexTopNavProps) {
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <header className="relative z-20 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="sm" onClick={onMenuToggle} className="text-gray-400 hover:text-white p-2">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Navigation tabs */}
          <nav className="flex items-center space-x-8">
            {topNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabSelect(item.id)}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors duration-200",
                  activeTab === item.id ? "text-white" : "text-gray-400 hover:text-white",
                )}
              >
                {item.label}
                {activeTab === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-mono">{currentTime}</span>
          </div>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
