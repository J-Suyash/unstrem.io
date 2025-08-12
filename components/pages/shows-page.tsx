"use client"

import { useState } from "react"
import { Grid, List, Search, SlidersHorizontal, Calendar, Clock, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlexContentGrid } from "@/components/plex-content-grid"

interface ShowsPageProps {
  onContentSelect: (content: any) => void
}

const showStatuses = ["All", "Continuing", "Ended", "Returning", "New Episodes", "In Production"]

const networks = [
  "All Networks",
  "Netflix",
  "HBO",
  "Disney+",
  "Amazon Prime",
  "Apple TV+",
  "Hulu",
  "FX",
  "AMC",
  "NBC",
  "CBS",
  "ABC",
]

const genres = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Reality",
  "Romance",
  "Sci-Fi",
  "Thriller",
]

const sortOptions = [
  { value: "title", label: "Title A-Z" },
  { value: "recently_watched", label: "Recently Watched" },
  { value: "recently_added", label: "Recently Added" },
  { value: "rating", label: "Rating" },
  { value: "year", label: "Year" },
  { value: "episodes_remaining", label: "Episodes Remaining" },
]

export function ShowsPage({ onContentSelect }: ShowsPageProps) {
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedNetwork, setSelectedNetwork] = useState("All Networks")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [sortBy, setSortBy] = useState("recently_watched")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const quickStats = [
    { label: "Total Shows", value: "156", icon: Tv },
    { label: "Currently Watching", value: "23", icon: Clock },
    { label: "New Episodes", value: "8", icon: Calendar },
  ]

  return (
    <div className="relative">
      {/* Shows Header */}
      <div className="px-8 py-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">TV Shows</h1>
            <p className="text-gray-400">Your complete series collection</p>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search TV shows..."
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
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {showStatuses.map((status) => (
                    <Badge
                      key={status}
                      variant={selectedStatus === status ? "default" : "secondary"}
                      className={`cursor-pointer transition-colors ${
                        selectedStatus === status
                          ? "bg-yellow-500 text-black hover:bg-yellow-400"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Network Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Network</h3>
                <div className="flex flex-wrap gap-2">
                  {networks.slice(0, 8).map((network) => (
                    <Badge
                      key={network}
                      variant={selectedNetwork === network ? "default" : "secondary"}
                      className={`cursor-pointer transition-colors ${
                        selectedNetwork === network
                          ? "bg-yellow-500 text-black hover:bg-yellow-400"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedNetwork(network)}
                    >
                      {network}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.slice(0, 10).map((genre) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Watch Progress</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white">
                    <option>Any Progress</option>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Up to Date</option>
                  </select>
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
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(selectedStatus !== "All" || selectedNetwork !== "All Networks" || selectedGenre !== "All" || searchQuery) && (
        <div className="px-8 py-3 bg-gray-900/30 border-b border-gray-800">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {selectedStatus !== "All" && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus("All")} className="ml-2 hover:text-yellow-300">
                  ×
                </button>
              </Badge>
            )}
            {selectedNetwork !== "All Networks" && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {selectedNetwork}
                <button onClick={() => setSelectedNetwork("All Networks")} className="ml-2 hover:text-yellow-300">
                  ×
                </button>
              </Badge>
            )}
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
                setSelectedStatus("All")
                setSelectedNetwork("All Networks")
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

      {/* Shows Content */}
      <div className="relative">
        {viewMode === "grid" ? (
          <PlexContentGrid category="Shows" onContentSelect={onContentSelect} />
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
