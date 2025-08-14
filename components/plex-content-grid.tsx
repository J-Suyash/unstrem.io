"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, resolveImageUrl } from "@/lib/utils"

interface ContentItem {
  id: string
  imdb_id?: string
  title: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  release_date: string
  overview: string
}

interface PlexContentGridProps {
  category: string
  onContentSelect: (content: ContentItem) => void
  content: ContentItem[]
}

export function PlexContentGrid({ category, onContentSelect, content }: PlexContentGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">{category}</h2>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="relative group">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
            {content.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-48 cursor-pointer group/item"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onContentSelect(item)}
              >
                <div className="relative">
                  {/* Poster */}
                  <div
                    className={cn(
                      "relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300",
                      hoveredItem === item.id ? "scale-105 shadow-2xl" : "scale-100",
                    )}
                  >
                    <img
                      src={resolveImageUrl(item.poster_path, "w500")}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(
                          item.title + " poster"
                        )}`
                      }}
                    />

                    {/* Rating badge */}
                    <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>

                    {/* Hover overlay */}
                    {hoveredItem === item.id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-300">
                        <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="mt-2 space-y-1">
                    <h3 className="font-medium text-white truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500">{new Date(item.release_date).getFullYear()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll buttons */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
