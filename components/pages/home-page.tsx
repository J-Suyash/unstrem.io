"use client"

import { PlexContentGrid } from "@/components/plex-content-grid"
import { Play, Info, Plus, ThumbsUp } from "lucide-react"

interface HomePageProps {
  onContentSelect: (content: any) => void
}

export function HomePage({ onContentSelect }: HomePageProps) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-black via-black/50 to-transparent">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative z-10 flex items-center h-full px-8">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold">FEATURED</span>
            </div>
            <h1 className="text-6xl font-bold mb-4">Dune: Part Two</h1>
            <div className="flex items-center space-x-4 mb-4 text-gray-300">
              <span className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                8.9
              </span>
              <span>2024</span>
              <span>166 min</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">PG-13</span>
            </div>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who
              destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must
              prevent a terrible future only he can foresee.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Play Now
              </button>
              <button className="bg-gray-800/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center">
                <Info className="h-5 w-5 mr-2" />
                More Info
              </button>
              <button className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Watchlist
              </button>
              <button className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center">
                <ThumbsUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="relative -mt-32 z-20">
        <PlexContentGrid category="Home" onContentSelect={onContentSelect} />
      </div>
    </div>
  )
}
