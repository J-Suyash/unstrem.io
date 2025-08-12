"use client"

import { useState } from "react"
import {
  X,
  Play,
  Check,
  Star,
  Download,
  RotateCcw,
  Bookmark,
  Share,
  MoreHorizontal,
  Calendar,
  Clock,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  type: "movie" | "series" // Added content type differentiation
  director?: string
  cast?: string[]
  imdbRating?: number
  rottenTomatoes?: number
}

interface PlexPreviewPanelProps {
  content: ContentItem
  onClose: () => void
  isCompact?: boolean
}

interface StreamOption {
  name: string
  description: string
  url: string
  quality: string
  size: string
  language: string
  addon: string
  type: "debrid" | "direct" | "cached"
}

const getSeasonData = (contentId: string) => {
  const seasonData: Record<string, any[]> = {
    "criminal-minds": [
      {
        id: "s1",
        number: 1,
        title: "Season 1",
        episodes: [
          {
            id: "e18",
            number: "E18",
            title: "Somebody's Watching",
            description:
              "The BAU team investigates a series of murders that appear to be connected to a voyeuristic killer.",
            thumbnail: "https://image.tmdb.org/t/p/w300/68MNrwlkpF7WnmNPXLah69CR5cb.jpg",
            watched: true,
            progress: 100,
            runtime: "43 min",
          },
          {
            id: "e19",
            number: "E19",
            title: "Machismo",
            description: "The team heads to Mexico to investigate a series of murders involving American tourists.",
            thumbnail: "https://image.tmdb.org/t/p/w300/68MNrwlkpF7WnmNPXLah69CR5cb.jpg",
            watched: true,
            progress: 100,
            runtime: "43 min",
          },
          {
            id: "e20",
            number: "E20",
            title: "Charm and Harm",
            description: "A serial killer targets women in Seattle, and the BAU must profile the unsub's methodology.",
            thumbnail: "https://image.tmdb.org/t/p/w300/68MNrwlkpF7WnmNPXLah69CR5cb.jpg",
            watched: true,
            progress: 100,
            runtime: "43 min",
          },
          {
            id: "e21",
            number: "E21",
            title: "Secrets and Lies",
            description:
              "The BAU team investigates a CIA counter-terrorism unit to identify a traitor who had a fellow agent murdered and who is trying to find and kill the unit's informant, a Saudi woman with two children who are in...",
            thumbnail: "https://image.tmdb.org/t/p/w300/68MNrwlkpF7WnmNPXLah69CR5cb.jpg",
            watched: false,
            progress: 75,
            runtime: "43 min",
            selected: true,
          },
          {
            id: "e22",
            number: "E22",
            title: "The Fisher King (1)",
            description: "An unknown subject in a cloak and carrying a scythe appears in Penelope Garcia's apartment.",
            thumbnail: "https://image.tmdb.org/t/p/w300/68MNrwlkpF7WnmNPXLah69CR5cb.jpg",
            watched: false,
            progress: 0,
            runtime: "43 min",
          },
        ],
      },
      {
        id: "s2",
        number: 2,
        title: "Season 2",
        episodes: [
          {
            id: "s2e1",
            number: "E01",
            title: "The Fisher King (2)",
            description: "The BAU team continues their investigation into the Fisher King case.",
            thumbnail: "https://image.tmdb.org/t/p/w300/68MNrwlkpF7WnmNPXLah69CR5cb.jpg",
            watched: false,
            progress: 0,
            runtime: "43 min",
          },
        ],
      },
    ],
    "breaking-bad": [
      {
        id: "s1",
        number: 1,
        title: "Season 1",
        episodes: [
          {
            id: "bb1e1",
            number: "E01",
            title: "Pilot",
            description:
              "Walter White, a struggling high school chemistry teacher, is diagnosed with inoperable lung cancer.",
            thumbnail: "https://image.tmdb.org/t/p/w300/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            watched: true,
            progress: 100,
            runtime: "58 min",
          },
          {
            id: "bb1e2",
            number: "E02",
            title: "Cat's in the Bag...",
            description: "Walt and Jesse attempt to tie up loose ends. The desperate situation gets more complicated.",
            thumbnail: "https://image.tmdb.org/t/p/w300/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            watched: false,
            progress: 30,
            runtime: "48 min",
            selected: true,
          },
        ],
      },
    ],
  }

  return seasonData[contentId] || []
}

const mockStreamOptions: StreamOption[] = [
  {
    name: "2160p - WEB-DL - HEVC - DV",
    description: "10.17 GB • Dolby Vision • Atmos 5.1",
    url: "stream1",
    quality: "2160p",
    size: "10.17 GB",
    language: "English",
    addon: "Torrentio",
    type: "debrid",
  },
  {
    name: "1080p - WEB-DL - H264",
    description: "4.2 GB • DD+ 5.1",
    url: "stream3",
    quality: "1080p",
    size: "4.2 GB",
    language: "English",
    addon: "Torrentio",
    type: "cached",
  },
]

export function PlexPreviewPanel({ content, onClose, isCompact = false }: PlexPreviewPanelProps) {
  const seasonData = getSeasonData(content.id)
  const [selectedSeason, setSelectedSeason] = useState(seasonData[0])
  const [selectedEpisode, setSelectedEpisode] = useState(
    seasonData[0]?.episodes?.find((e) => e.selected) || seasonData[0]?.episodes?.[0],
  )
  const [showStreamOptions, setShowStreamOptions] = useState(false)

  const handleStreamSelect = (stream: StreamOption) => {
    setShowStreamOptions(false)
    console.log("Starting stream:", stream)
  }

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const renderMovieContent = () => (
    <div className="flex-1 px-8 pb-8">
      <div className="max-w-3xl">
        <h1 className="text-6xl font-bold text-white mb-4">{content.title}</h1>

        <div className="flex items-center space-x-6 text-white mb-4">
          <span className="text-xl font-medium">{content.year}</span>
          <span className="text-lg">{content.runtime}</span>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-lg">{content.imdbRating || 8.5}</span>
          </div>
          {content.rottenTomatoes && (
            <div className="flex items-center space-x-2">
              <span className="text-red-500">🍅</span>
              <span>{content.rottenTomatoes}%</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {content.genre.map((g) => (
            <Badge key={g} variant="outline" className="border-gray-600 text-gray-300 bg-gray-800/50">
              {g}
            </Badge>
          ))}
        </div>

        {content.progress && content.progress > 0 && (
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                  style={{ width: `${content.progress}%` }}
                />
              </div>
              <span className="text-yellow-400 text-sm font-medium">{content.progress}%</span>
            </div>
            <span className="text-gray-400 text-sm">Continue watching</span>
          </div>
        )}

        <p className="text-white text-xl leading-relaxed mb-8 max-w-2xl">{content.description}</p>

        <div className="space-y-3 text-gray-300">
          {content.director && (
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-400" />
              <span>Directed by {content.director}</span>
            </div>
          )}
          {content.cast && (
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-400" />
              <span>Starring {content.cast.slice(0, 3).join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderSeriesContent = () => (
    <>
      <div className="flex-none pt-20 px-8">
        <div className="flex space-x-8 mb-8">
          {seasonData.map((season) => (
            <button
              key={season.id}
              onClick={() => {
                setSelectedSeason(season)
                setSelectedEpisode(season.episodes[0])
              }}
              className={`text-lg font-medium pb-2 border-b-3 transition-all duration-200 ${
                selectedSeason?.id === season.id
                  ? "text-white border-yellow-500 scale-105"
                  : "text-gray-400 border-transparent hover:text-white hover:border-gray-600"
              }`}
            >
              {season.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-8 pb-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold text-white mb-2">{content.title}</h1>
          <h2 className="text-3xl text-yellow-400 mb-4">{selectedEpisode?.title}</h2>

          <div className="flex items-center space-x-6 text-white mb-3">
            <span className="text-xl font-medium">
              S{selectedSeason?.number} {selectedEpisode?.number}
            </span>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>May 3, 2006</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{selectedEpisode?.runtime}</span>
            </div>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              TV-14
            </Badge>
            {selectedEpisode?.progress && selectedEpisode.progress > 0 && selectedEpisode.progress < 100 && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1 rounded-full text-sm font-medium">
                <span>{Math.round((100 - selectedEpisode.progress) * 0.43)} min left</span>
              </div>
            )}
          </div>

          {selectedEpisode?.progress && selectedEpisode.progress > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${selectedEpisode.progress}%` }}
                  />
                </div>
                <span className="text-yellow-400 text-sm font-semibold">{selectedEpisode.progress}%</span>
              </div>
              <div className="flex items-center space-x-2 text-white hover:text-yellow-400 cursor-pointer transition-colors">
                <Star className="h-4 w-4" />
                <span className="text-sm">Rate & Review</span>
              </div>
            </div>
          )}

          <p className="text-white text-xl leading-relaxed mb-6 max-w-2xl">{selectedEpisode?.description}</p>

          <p className="text-gray-300 mb-8 flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Directed by Matt Earl Beesley</span>
          </p>
        </div>
      </div>

      <div className="flex-none px-8 pb-8">
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          {selectedSeason?.episodes?.map((episode) => (
            <div
              key={episode.id}
              className={`flex-none cursor-pointer transition-all duration-300 group ${
                selectedEpisode?.id === episode.id
                  ? "ring-3 ring-yellow-500 scale-105 shadow-2xl shadow-yellow-500/20"
                  : "hover:scale-105 hover:shadow-xl hover:shadow-white/10"
              }`}
              onClick={() => setSelectedEpisode(episode)}
            >
              <div className="relative w-52 aspect-video bg-gray-800 rounded-xl overflow-hidden">
                <img
                  src={episode.thumbnail || "/placeholder.svg"}
                  alt={episode.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-black/90 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {episode.number}
                </div>
                {episode.watched && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                {episode.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-600">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                      style={{ width: `${episode.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-3 text-center">
                <div className="text-white font-semibold text-sm truncate w-52 mb-1">{episode.title.toUpperCase()}</div>
                <div className="text-gray-400 text-xs">
                  SEASON {selectedSeason?.number} • EPISODE {episode.number.replace("E", "")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${content.backdrop})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/70" />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="text-white text-lg font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
          {currentTime}
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {content.type === "movie" ? renderMovieContent() : renderSeriesContent()}

        <div className="flex-none bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 rounded-full w-14 h-14 p-0 transition-all duration-200 hover:scale-110 shadow-lg"
                onClick={() => setShowStreamOptions(true)}
              >
                <Play className="h-7 w-7 ml-1" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 transition-all duration-200 hover:scale-110"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 transition-all duration-200 hover:scale-110"
              >
                <Bookmark className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 transition-all duration-200 hover:scale-110"
              >
                <Check className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 transition-all duration-200 hover:scale-110"
              >
                <Share className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 transition-all duration-200 hover:scale-110"
              >
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-white bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm">
              <span className="font-medium">1080p</span>
              <div className="flex items-center space-x-2">
                <span>🔊</span>
                <span>5.1 EAC3</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💬</span>
                <span>English (SRT)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStreamOptions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Select Stream Quality</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStreamOptions(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-3">
                {mockStreamOptions.map((stream, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600"
                    onClick={() => handleStreamSelect(stream)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                            {stream.quality}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {stream.addon}
                          </Badge>
                          {stream.type === "debrid" && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <Download className="h-3 w-3" />
                              <span className="text-xs">Cached</span>
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-white mb-1">{stream.name}</h4>
                        <p className="text-sm text-gray-400">{stream.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">{stream.size}</div>
                        <div className="text-xs text-gray-500">{stream.language}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
