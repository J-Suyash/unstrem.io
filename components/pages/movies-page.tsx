"use client"

import { useState } from "react"
import { Grid, List, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlexContentGrid } from "@/components/plex-content-grid"

interface MoviesPageProps {
  onContentSelect: (content: any) => void
}

const genres = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "History",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
]

const sortOptions = [
  { value: "title", label: "Title A-Z" },
  { value: "year", label: "Year" },
  { value: "rating", label: "Rating" },
  { value: "recently_added", label: "Recently Added" },
  { value: "duration", label: "Duration" },
]

export function MoviesPage({ onContentSelect }: MoviesPageProps) {
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [sortBy, setSortBy] = useState("recently_added")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="relative">
      {/* Movies Header */}
      <div className="px-8 py-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Movies</h1>
            <p className="text-gray-400">1,247 movies in your library</p>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="p-2"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="p-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="space-y-4">
              {/* Genre Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "secondary"}
                      className={`cursor-pointer transition-colors ${
                        selectedGenre === genre
                          ? "bg-yellow-500 text-black hover:bg-yellow-400"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Year Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="From"
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
                    />
                    <input
                      type="number"
                      placeholder="To"
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Rating</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white">
                    <option>Any Rating</option>
                    <option>9.0+ Excellent</option>
                    <option>8.0+ Very Good</option>
                    <option>7.0+ Good</option>
                    <option>6.0+ Fair</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Duration</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white">
                    <option>Any Duration</option>
                    <option>Under 90 min</option>
                    <option>90-120 min</option>
                    <option>120-150 min</option>
                    <option>Over 150 min</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(selectedGenre !== "All" || searchQuery) && (
        <div className="px-8 py-3 bg-gray-900/30 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {selectedGenre !== "All" && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {selectedGenre}
                <button onClick={() => setSelectedGenre("All")} className="ml-2 hover:text-yellow-300">
                  ×
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="ml-2 hover:text-yellow-300">
                  ×
                </button>
              </Badge>
            )}
            <button
              onClick={() => {
                setSelectedGenre("All")
                setSearchQuery("")
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Movies Content */}
      <div className="relative">
        {viewMode === "grid" ? (
          <PlexContentGrid category="Movies" onContentSelect={onContentSelect} />
        ) : (
          <div className="p-8">
            <div className="space-y-2">
              {/* List view would go here - simplified for now */}
              <div className="text-center py-12 text-gray-400">
                <List className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>List view coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
