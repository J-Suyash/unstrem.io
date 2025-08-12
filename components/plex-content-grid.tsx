"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ContentItem {
  id: string
  title: string
  subtitle?: string
  poster: string
  backdrop: string
  rating: number
  progress?: number
  status?: string
  network?: string
  year: number
  runtime: string
  genre: string[]
  description: string
}

interface PlexContentGridProps {
  category: string
  onContentSelect: (content: ContentItem) => void
}

const mockContent: Record<string, ContentItem[]> = {
  Home: [
    {
      id: "1",
      title: "The Bear",
      subtitle: "Season 3",
      poster: "https://image.tmdb.org/t/p/w500/7vgUux0D6oFAR9pOqMx0aMQO9wV.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/zPIqnFz6OyLDiPOoNNdVrO2yCbh.jpg",
      rating: 8.7,
      progress: 65,
      status: "RETURNING",
      network: "FX",
      year: 2024,
      runtime: "30 min",
      genre: ["Comedy", "Drama"],
      description:
        "A young chef from the fine dining world returns to Chicago to run his deceased brother's Italian beef sandwich shop.",
    },
    {
      id: "2",
      title: "Dune: Part Two",
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
      rating: 8.9,
      year: 2024,
      runtime: "166 min",
      genre: ["Sci-Fi", "Adventure"],
      description:
        "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    },
    {
      id: "3",
      title: "House of the Dragon",
      subtitle: "Season 2",
      poster: "https://image.tmdb.org/t/p/w500/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg",
      rating: 8.4,
      progress: 80,
      status: "ENDED",
      network: "HBO",
      year: 2024,
      runtime: "60 min",
      genre: ["Fantasy", "Drama"],
      description: "The Targaryen civil war continues as dragons dance and the realm bleeds.",
    },
    {
      id: "4",
      title: "Stranger Things",
      subtitle: "Season 4",
      poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      rating: 8.7,
      progress: 45,
      status: "RETURNING",
      network: "Netflix",
      year: 2022,
      runtime: "75 min",
      genre: ["Horror", "Sci-Fi", "Thriller"],
      description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
    },
    {
      id: "5",
      title: "The Last of Us",
      subtitle: "Season 1",
      poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
      rating: 8.8,
      progress: 100,
      status: "RETURNING",
      network: "HBO",
      year: 2023,
      runtime: "60 min",
      genre: ["Drama", "Horror", "Thriller"],
      description:
        "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl.",
    },
    {
      id: "6",
      title: "Wednesday",
      subtitle: "Season 1",
      poster: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
      rating: 8.1,
      progress: 100,
      status: "RETURNING",
      network: "Netflix",
      year: 2022,
      runtime: "50 min",
      genre: ["Comedy", "Horror", "Mystery"],
      description: "Wednesday Addams navigates her years as a student at Nevermore Academy.",
    },
  ],
  Movies: [
    {
      id: "7",
      title: "Oppenheimer",
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
      rating: 8.6,
      year: 2023,
      runtime: "180 min",
      genre: ["Biography", "Drama", "History"],
      description:
        "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    },
    {
      id: "8",
      title: "Spider-Man: Across the Spider-Verse",
      poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg",
      rating: 8.8,
      year: 2023,
      runtime: "140 min",
      genre: ["Animation", "Action", "Adventure"],
      description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.",
    },
    {
      id: "9",
      title: "Top Gun: Maverick",
      poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
      rating: 8.3,
      year: 2022,
      runtime: "131 min",
      genre: ["Action", "Drama"],
      description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
    },
    {
      id: "10",
      title: "Everything Everywhere All at Once",
      poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/yF1eOkaYvwiORauRCPWznV9xVvi.jpg",
      rating: 8.1,
      year: 2022,
      runtime: "139 min",
      genre: ["Action", "Adventure", "Comedy"],
      description:
        "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence.",
    },
    {
      id: "11",
      title: "Avatar: The Way of Water",
      poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
      rating: 7.6,
      year: 2022,
      runtime: "192 min",
      genre: ["Action", "Adventure", "Fantasy"],
      description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
    },
    {
      id: "12",
      title: "The Batman",
      poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/b0PlSFdDpaOJQvQ.jpg",
      rating: 7.8,
      year: 2022,
      runtime: "176 min",
      genre: ["Action", "Crime", "Drama"],
      description:
        "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.",
    },
  ],
  Shows: [
    {
      id: "13",
      title: "Breaking Bad",
      subtitle: "Complete Series",
      poster: "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      rating: 9.5,
      progress: 100,
      status: "ENDED",
      network: "AMC",
      year: 2008,
      runtime: "47 min",
      genre: ["Crime", "Drama", "Thriller"],
      description:
        "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
    },
    {
      id: "14",
      title: "Game of Thrones",
      subtitle: "Complete Series",
      poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
      rating: 9.2,
      progress: 100,
      status: "ENDED",
      network: "HBO",
      year: 2011,
      runtime: "57 min",
      genre: ["Action", "Adventure", "Drama"],
      description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.",
    },
    {
      id: "15",
      title: "The Office",
      subtitle: "Complete Series",
      poster: "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7GywNxCy4QLLnTYgVfxHqBdVKRl.jpg",
      rating: 8.7,
      progress: 85,
      status: "ENDED",
      network: "NBC",
      year: 2005,
      runtime: "22 min",
      genre: ["Comedy"],
      description:
        "A mockumentary on a group of typical office workers, where the workday consists of ego clashes and inappropriate behavior.",
    },
  ],
  Search: [],
}

const contentRows = [
  { title: "Continue Watching", key: "continue" },
  { title: "Recently Added", key: "recent" },
  { title: "Trending Now", key: "trending" },
  { title: "Popular Movies", key: "popular" },
  { title: "Binge-Worthy TV Shows", key: "binge" },
]

export function PlexContentGrid({ category, onContentSelect }: PlexContentGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const getContentForRow = (rowKey: string) => {
    const allContent = [...mockContent.Home, ...mockContent.Movies, ...mockContent.Shows]

    switch (rowKey) {
      case "continue":
        return allContent.filter((item) => item.progress && item.progress > 0 && item.progress < 100)
      case "recent":
        return allContent.filter((item) => item.year >= 2023)
      case "trending":
        return allContent.filter((item) => item.rating >= 8.5)
      case "popular":
        return mockContent.Movies
      case "binge":
        return mockContent.Shows
      default:
        return mockContent[category] || mockContent.Home
    }
  }

  return (
    <div className="p-6 space-y-8">
      {contentRows.map((row) => {
        const rowContent = getContentForRow(row.key)

        if (rowContent.length === 0) return null

        return (
          <div key={row.key} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">{row.title}</h2>
              <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors">
                View All
              </button>
            </div>

            <div className="relative group">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                {rowContent.slice(0, 8).map((item) => (
                  <div
                    key={`${row.key}-${item.id}`}
                    className="flex-shrink-0 w-48 cursor-pointer group/item"
                    onMouseEnter={() => setHoveredItem(`${row.key}-${item.id}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => onContentSelect(item)}
                  >
                    <div className="relative">
                      {/* Poster */}
                      <div
                        className={cn(
                          "relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300",
                          hoveredItem === `${row.key}-${item.id}` ? "scale-105 shadow-2xl" : "scale-100",
                        )}
                      >
                        <img
                          src={item.poster || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(item.title + " poster")}`
                          }}
                        />

                        {/* Progress bar */}
                        {item.progress && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                            <div
                              className="h-full bg-yellow-500 transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}

                        {/* Status badge */}
                        {item.status && (
                          <Badge variant="secondary" className="absolute top-2 left-2 bg-black/80 text-white text-xs">
                            {item.status}
                          </Badge>
                        )}

                        {/* Rating badge */}
                        <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{item.rating}</span>
                        </div>

                        {/* Network badge */}
                        {item.network && (
                          <Badge
                            variant="outline"
                            className="absolute top-2 right-2 bg-black/80 border-gray-600 text-white text-xs"
                          >
                            {item.network}
                          </Badge>
                        )}

                        {/* Hover overlay */}
                        {hoveredItem === `${row.key}-${item.id}` && (
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
                        {item.subtitle && <p className="text-sm text-gray-400 truncate">{item.subtitle}</p>}
                        <p className="text-xs text-gray-500">
                          {item.year} • {item.runtime}
                        </p>
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
        )
      })}
    </div>
  )
}
