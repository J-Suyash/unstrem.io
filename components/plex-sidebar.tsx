"use client"

import { Search, Home, Film, Tv, MoreHorizontal, Settings, Pin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PlexSidebarProps {
  isOpen: boolean
  isPinned: boolean
  activeCategory: string
  onCategorySelect: (category: string) => void
  onTogglePin: () => void
  onClose: () => void
}

const menuItems = [
  { id: "Search", label: "Search", icon: Search },
  { id: "Home", label: "Home", icon: Home },
  { id: "Movies", label: "Movies", icon: Film },
  { id: "Shows", label: "TV Shows", icon: Tv },
  { id: "More", label: "More", icon: MoreHorizontal },
  { id: "Settings", label: "Settings", icon: Settings },
]

export function PlexSidebar({
  isOpen,
  isPinned,
  activeCategory,
  onCategorySelect,
  onTogglePin,
  onClose,
}: PlexSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && !isPinned && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-bold text-black">P</div>
            <span className="font-semibold text-lg">Plex</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePin}
              className={cn("p-1 h-8 w-8", isPinned ? "text-yellow-500" : "text-gray-400 hover:text-white")}
            >
              <Pin className="h-4 w-4" />
            </Button>
            {!isPinned && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-8 w-8 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeCategory === item.id

            return (
              <button
                key={item.id}
                onClick={() => onCategorySelect(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                  isActive ? "bg-white text-black font-medium" : "text-gray-300 hover:text-white hover:bg-gray-800/50",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
