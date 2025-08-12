"use client"

import { useState, useEffect } from "react"
import { Search, Clock, X, Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchPageProps {
  onContentSelect: (content: any) => void
}

const searchSuggestions = [
  "Breaking Bad",
  "The Dark Knight",
  "Stranger Things",
  "Inception",
  "Game of Thrones",
  "The Office",
  "Marvel",
  "Christopher Nolan",
  "Action movies",
  "Comedy series",
]

const recentSearches = ["The Bear", "Dune", "Leonardo DiCaprio", "Sci-fi movies", "HBO series"]

const searchFilters = [
  { id: "all", label: "All", count: 1247 },
  { id: "movies", label: "Movies", count: 856 },
  { id: "shows", label: "TV Shows", count: 391 },
  { id: "people", label: "People", count: 0 },
  { id: "collections", label: "Collections", count: 0 },
]

const mockSearchResults = {
  movies: [
    {
      id: "search-1",
      title: "The Dark Knight",
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
      rating: 9.0,
      year: 2008,
      runtime: "152 min",
      genre: ["Action", "Crime", "Drama"],
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    },
    {
      id: "search-2",
      title: "Dark Phoenix",
      poster: "https://image.tmdb.org/t/p/w500/kZv92eTc0Gg3mKxqjjDAM73z9cy.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/cCTJPelKGlWSqAYII3r3XuDha8q.jpg",
      rating: 5.7,
      year: 2019,
      runtime: "114 min",
      genre: ["Action", "Adventure", "Sci-Fi"],
      description: "Jean Grey begins to develop incredible powers that corrupt and turn her into a Dark Phoenix.",
    },
  ],
  shows: [
    {
      id: "search-3",
      title: "Dark",
      subtitle: "Complete Series",
      poster: "https://image.tmdb.org/t/p/w500/5cUf9VoydOJFMJr6dD8bFL9B3ni.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/bGSqTIhWTBQhQAp2QPTfgUiLbpL.jpg",
      rating: 8.8,
      status: "ENDED",
      network: "Netflix",
      year: 2017,
      runtime: "60 min",
      genre: ["Drama", "Mystery", "Sci-Fi"],
      description:
        "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.",
    },
  ],
  people: [],
  collections: [],
}

export function SearchPage({ onContentSelect }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>({})

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        // Simulate search API call
        const results = {
          movies: mockSearchResults.movies.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
          shows: mockSearchResults.shows.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())),
          people: [],
          collections: [],
        }
        setSearchResults(results)
        setIsSearching(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSearchResults({})
      setIsSearching(false)
    }
  }, [searchQuery])

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false)
    // Add to recent searches (in real app, this would be stored)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults({})
    setShowSuggestions(false)
  }

  const getFilteredResults = () => {
    if (!searchResults || Object.keys(searchResults).length === 0) return []

    switch (activeFilter) {
      case "movies":
        return searchResults.movies || []
      case "shows":
        return searchResults.shows || []
      case "people":
        return searchResults.people || []
      case "collections":
        return searchResults.collections || []
      default:
        return [
          ...(searchResults.movies || []),
          ...(searchResults.shows || []),
          ...(searchResults.people || []),
          ...(searchResults.collections || []),
        ]
    }
  }

  const getTotalResults = () => {
    if (!searchResults || Object.keys(searchResults).length === 0) return 0
    return Object.values(searchResults).reduce((total: number, items: any) => total + (items?.length || 0), 0)
  }

  return (
    <div className="relative">
      {/* Search Header */}
      <div className="px-8 py-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold mb-4">Search</h1>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search movies, TV shows, actors, and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Search Suggestions Dropdown */}
          {showSuggestions && !searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="w-full text-left px-2 py-1 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.slice(0, 6).map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                      onClick={() => handleSearchSubmit(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Filters */}
        {searchQuery && (
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filter by:</span>
            </div>
            <div className="flex space-x-2">
              {searchFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    activeFilter === filter.id
                      ? "bg-yellow-500 text-black hover:bg-yellow-400"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                  {searchQuery && (
                    <span className="ml-1 opacity-75">
                      ({activeFilter === filter.id ? getTotalResults() : filter.count})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="px-8 py-6">
        {!searchQuery ? (
          // Empty State
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">Discover your content</h2>
            <p className="text-gray-500 mb-6">Search for movies, TV shows, actors, directors, and more</p>

            {/* Popular Searches */}
            <div className="max-w-md mx-auto">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Popular right now</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchSuggestions.slice(0, 8).map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => handleSearchSubmit(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : isSearching ? (
          // Loading State
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Searching...</p>
          </div>
        ) : getTotalResults() > 0 ? (
          // Results
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {getTotalResults()} result{getTotalResults() !== 1 ? "s" : ""} for "{searchQuery}"
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Sort by:</span>
                <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm">
                  <option>Relevance</option>
                  <option>Title A-Z</option>
                  <option>Year (Newest)</option>
                  <option>Rating (Highest)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {getFilteredResults().map((item) => (
                <div key={item.id} className="cursor-pointer group" onClick={() => onContentSelect(item)}>
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <img
                      src={item.poster || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(item.title + " poster")}`
                      }}
                    />

                    {/* Rating badge */}
                    <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{item.rating}</span>
                    </div>

                    {/* Type badge */}
                    <Badge variant="secondary" className="absolute top-2 right-2 bg-black/80 text-white text-xs">
                      {item.subtitle ? "TV" : "Movie"}
                    </Badge>
                  </div>

                  {/* Title */}
                  <div className="mt-2 space-y-1">
                    <h3 className="font-medium text-white truncate text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-400">
                      {item.year} • {item.runtime || item.network}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // No Results
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">No results found</h2>
            <p className="text-gray-500 mb-4">Try searching for something else or check your spelling</p>
            <Button
              variant="outline"
              onClick={clearSearch}
              className="border-gray-600 hover:bg-gray-800 bg-transparent"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />}
    </div>
  )
}
