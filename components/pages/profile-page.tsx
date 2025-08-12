"use client"

import { useState } from "react"
import { User, Settings, Heart, Clock, Star, TrendingUp, Calendar, Award, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const profileStats = [
    { label: "Movies Watched", value: "1,247", icon: Star, change: "+23 this month" },
    { label: "TV Episodes", value: "3,891", icon: Clock, change: "+156 this month" },
    { label: "Watch Time", value: "2,847h", icon: Eye, change: "+89h this month" },
    { label: "Favorites", value: "156", icon: Heart, change: "+8 this month" },
  ]

  const recentActivity = [
    {
      title: "The Dark Knight",
      type: "Movie",
      time: "2 hours ago",
      progress: 100,
      poster: "https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      rating: 9.0,
    },
    {
      title: "Breaking Bad S5E14",
      type: "TV Show",
      time: "1 day ago",
      progress: 85,
      poster: "https://image.tmdb.org/t/p/w200/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
      rating: 9.5,
    },
    {
      title: "Inception",
      type: "Movie",
      time: "3 days ago",
      progress: 100,
      poster: "https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      rating: 8.8,
    },
    {
      title: "The Office S3E12",
      type: "TV Show",
      time: "1 week ago",
      progress: 100,
      poster: "https://image.tmdb.org/t/p/w200/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
      rating: 8.7,
    },
  ]

  const achievements = [
    { title: "Movie Marathon", description: "Watched 10 movies in a week", icon: Award, earned: true },
    { title: "Binge Watcher", description: "Completed 5 TV series", icon: TrendingUp, earned: true },
    { title: "Early Bird", description: "Watched 50 movies from the 1980s", icon: Calendar, earned: false },
    { title: "Genre Explorer", description: "Watched content from 15 different genres", icon: Star, earned: true },
  ]

  const watchingStats = {
    totalHours: 2847,
    averagePerDay: 3.2,
    longestSession: 8.5,
    favoriteGenre: "Drama",
    favoriteYear: "2019",
    mostWatchedActor: "Leonardo DiCaprio",
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Recent Activity" },
    { id: "achievements", label: "Achievements" },
    { id: "stats", label: "Statistics" },
  ]

  return (
    <div className="relative">
      {/* Profile Header */}
      <div className="px-8 py-6 border-b border-gray-800">
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" />
            <AvatarFallback className="text-2xl">
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">John Doe</h1>
            <div className="flex items-center space-x-4 mb-3">
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Plex Pass Premium
              </Badge>
              <span className="text-gray-400">Member since March 2020</span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-800 bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-800 bg-transparent">
                Privacy Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8 mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {profileStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="h-6 w-6 text-yellow-500" />
                      <span className="text-xs text-green-400">{stat.change}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">This Month</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Movies watched</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">TV episodes</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hours watched</span>
                    <span className="font-medium">89.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average per day</span>
                    <span className="font-medium">2.9h</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Favorite genre</span>
                    <span className="font-medium">Drama</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Preferred decade</span>
                    <span className="font-medium">2010s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average rating</span>
                    <span className="font-medium">8.2/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Completion rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-800 last:border-b-0">
                  <img
                    src={item.poster || "/placeholder.svg"}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=64&width=48&query=${encodeURIComponent(item.title)}`
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">{item.progress}%</div>
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div
                  key={index}
                  className={`bg-gray-900/50 rounded-lg p-6 border ${
                    achievement.earned ? "border-yellow-500/30" : "border-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${achievement.earned ? "bg-yellow-500/20" : "bg-gray-800"}`}>
                      <Icon className={`h-6 w-6 ${achievement.earned ? "text-yellow-500" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.earned ? "text-white" : "text-gray-400"}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Watch Time</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total hours</span>
                  <span className="font-medium">{watchingStats.totalHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily average</span>
                  <span className="font-medium">{watchingStats.averagePerDay}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Longest session</span>
                  <span className="font-medium">{watchingStats.longestSession}h</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Favorite genre</span>
                  <span className="font-medium">{watchingStats.favoriteGenre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Favorite year</span>
                  <span className="font-medium">{watchingStats.favoriteYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Top actor</span>
                  <span className="font-medium">{watchingStats.mostWatchedActor}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">This Year</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Movies</span>
                  <span className="font-medium">287</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TV episodes</span>
                  <span className="font-medium">1,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">New discoveries</span>
                  <span className="font-medium">89</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
