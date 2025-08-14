"use client"

import { useEffect, useState } from "react"
import {
  X,
  Play,
  Pause,
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
  ArrowLeft,
  Menu,
  ChevronLeft,
  ChevronRight,
  Camera,
  Captions,
  Volume2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlexSidebar } from "./plex-sidebar"
import { resolveImageUrl } from "@/lib/utils"
import { invoke } from "@tauri-apps/api/core"
import { Slider } from "@/components/ui/slider"

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

interface PlexPreviewPanelProps {
  content: ContentItem
  onClose: () => void
}

export function PlexPreviewPanel({ content, onClose }: PlexPreviewPanelProps) {
  const [showStreamOptions, setShowStreamOptions] = useState(false)
  const [streams, setStreams] = useState<any[]>([])
  const [selectedStreamUrl, setSelectedStreamUrl] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  
  useEffect(() => {
    if (!selectedStreamUrl) return
    let mounted = true
    const init = async () => {
      try {
        const vol = await invoke<number>("player_get_volume")
        if (mounted && typeof vol === "number") setVolume(Math.round(vol))
        const dur = await invoke<number>("player_duration")
        if (mounted && typeof dur === "number" && isFinite(dur)) setDuration(dur)
      } catch (e) {
        // noop
      }
    }
    init()

    const id = setInterval(async () => {
      try {
        const pos = await invoke<number>("player_position")
        if (mounted && typeof pos === "number" && isFinite(pos)) setPosition(pos)
        const dur = await invoke<number>("player_duration")
        if (mounted && typeof dur === "number" && isFinite(dur)) setDuration(dur)
      } catch (e) {
        // noop
      }
    }, 500)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [selectedStreamUrl])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handlePlay = async () => {
    if (!content.imdb_id) {
      console.error("IMDB ID not available for this content.")
      return
    }
    const streamId = `${content.imdb_id}` // Assuming movie for now
    const streamData: any = await invoke("get_streams", { id: streamId, type: "movie" })
    setStreams(streamData.streams)
    setShowStreamOptions(true)
  }

  const handleStreamSelect = (stream: any) => {
    setSelectedStreamUrl(stream.url)
    setShowStreamOptions(false)
    invoke("player_load", { url: stream.url, start_time: 0 }).catch(console.error)
  }

  const renderMovieContent = () => (
    <main className="flex-1 overflow-y-auto relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${resolveImageUrl(content.backdrop_path, "w1280")})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/70" />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-200 hover:scale-110"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-200 hover:scale-110"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="text-white text-lg font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
          {currentTime}
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 px-8 pb-8 pt-24">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold text-white mb-4">{content.title}</h1>

            <div className="flex items-center space-x-6 text-white mb-4">
              <span className="text-xl font-medium">
                {new Date(content.release_date).getFullYear()}
              </span>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-lg">{content.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-white text-xl leading-relaxed mb-8 max-w-2xl">
              {content.overview}
            </p>
          </div>
        </div>

        <div className="flex-none bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 rounded-full w-14 h-14 p-0 transition-all duration-200 hover:scale-110 shadow-lg"
                onClick={handlePlay}
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
    </main>
  )

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden flex">
      <PlexSidebar
        isOpen={isSidebarOpen}
        isPinned={false} // for now, we can make this dynamic later
        activeCategory=""
        onCategorySelect={() => {}}
        onTogglePin={() => {}}
        onClose={() => setIsSidebarOpen(false)}
      />
      {selectedStreamUrl ? (
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {/* mpv renders in its own window; this pane serves as remote controls */}
          <div className="absolute inset-0 flex flex-col items-center justify-end p-6 pointer-events-none">
            <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md rounded-xl p-4 space-y-3 pointer-events-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                    onClick={async () => {
                      await invoke("player_seek_relative", { seconds: -10 })
                    }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full w-12 h-12"
                    onClick={async () => {
                      await invoke("player_pause_toggle")
                      setPaused((p) => !p)
                    }}
                  >
                    {paused ? <Play className="h-6 w-6 ml-0.5" /> : <Pause className="h-6 w-6" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                    onClick={async () => {
                      await invoke("player_seek_relative", { seconds: 10 })
                    }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                    onClick={async () => {
                      await invoke("player_cycle_audio")
                    }}
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                    onClick={async () => {
                      await invoke("player_cycle_subtitle")
                    }}
                  >
                    <Captions className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                    onClick={async () => {
                      const ts = Date.now()
                      await invoke("player_screenshot", { file: `/tmp/unstrem-shot-${ts}.png`, include_subs: true })
                    }}
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white text-sm tabular-nums min-w-[60px] text-right">
                  {new Date(position * 1000).toISOString().substr(11, 8)}
                </span>
                <Slider
                  value={[Number.isFinite(position) ? position : 0]}
                  max={Number.isFinite(duration) && duration > 0 ? duration : 100}
                  step={1}
                  className="flex-1"
                  onValueCommit={async (v) => {
                    const value = Array.isArray(v) ? v[0] : v
                    await invoke("player_seek_absolute", { seconds: value })
                  }}
                />
                <span className="text-white text-sm tabular-nums min-w-[60px]">
                  {Number.isFinite(duration) && duration > 0
                    ? new Date(duration * 1000).toISOString().substr(11, 8)
                    : "--:--:--"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-white/80" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="w-56"
                  onValueChange={async (v) => {
                    const value = Array.isArray(v) ? v[0] : v
                    setVolume(value as number)
                    await invoke("player_set_volume", { volume: value })
                  }}
                />
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await invoke("player_stop")
                    setSelectedStreamUrl(null)
                    setPaused(false)
                  }}
                  className="text-white hover:bg-white/20 rounded-full px-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        renderMovieContent()
      )}

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
                {streams.map((stream, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600"
                    onClick={() => handleStreamSelect(stream)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                            {stream.name}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {stream.streamData.addon}
                          </Badge>
                          {stream.streamData.service.cached && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <Download className="h-3 w-3" />
                              <span className="text-xs">Cached</span>
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-white mb-1">{stream.behaviorHints.filename}</h4>
                        <p className="text-sm text-gray-400">{stream.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">{(stream.streamData.size / 1024 / 1024 / 1024).toFixed(2)} GB</div>
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
