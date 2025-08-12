"use client"

import { useState } from "react"
import { User, DiscIcon as Display, Volume2, Wifi, Shield, ChevronRight, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SettingsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const settingsCategories = [
    {
      title: "Account",
      icon: User,
      description: "Profile, subscription, and account preferences",
      items: [
        { name: "Profile Settings", description: "Update your profile information", status: "configured" },
        { name: "Subscription", description: "Plex Pass Premium - Active", status: "active" },
        { name: "Privacy", description: "Control your data and privacy settings", status: "configured" },
        { name: "Sign Out", description: "Sign out of all devices", status: "action" },
      ],
    },
    {
      title: "Playback",
      icon: Display,
      description: "Video quality, audio, and playback preferences",
      items: [
        { name: "Video Quality", description: "Auto (Original/4K)", status: "configured" },
        { name: "Audio Settings", description: "5.1 Surround Sound", status: "configured" },
        { name: "Subtitles", description: "Auto-select English", status: "configured" },
        { name: "Auto-Play", description: "Next episode and trailers", status: "enabled" },
      ],
    },
    {
      title: "Audio & Video",
      icon: Volume2,
      description: "Advanced audio and video output settings",
      items: [
        { name: "Audio Output", description: "HDMI Audio Passthrough", status: "configured" },
        { name: "Video Resolution", description: "4K HDR when available", status: "configured" },
        { name: "HDR Settings", description: "HDR10 and Dolby Vision", status: "enabled" },
        { name: "Frame Rate", description: "Match content frame rate", status: "enabled" },
      ],
    },
    {
      title: "Network",
      icon: Wifi,
      description: "Connection, bandwidth, and remote access",
      items: [
        { name: "Connection", description: "Ethernet - 1 Gbps", status: "connected" },
        { name: "Bandwidth", description: "Unlimited (Local Network)", status: "configured" },
        { name: "Remote Access", description: "Enabled via plex.tv", status: "enabled" },
        { name: "DLNA", description: "Media server discovery", status: "enabled" },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      description: "Security, authentication, and device management",
      items: [
        { name: "Two-Factor Auth", description: "Authenticator app enabled", status: "enabled" },
        { name: "Secure Connections", description: "Required for all connections", status: "enabled" },
        { name: "Device Management", description: "5 authorized devices", status: "configured" },
        { name: "Activity Log", description: "View recent account activity", status: "action" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "Alerts, updates, and notification preferences",
      items: [
        { name: "New Content", description: "Notify when content is added", status: "enabled" },
        { name: "Playback Alerts", description: "Transcoding and quality warnings", status: "enabled" },
        { name: "Server Updates", description: "Plex Media Server updates", status: "enabled" },
        { name: "Mobile Push", description: "Push notifications on mobile", status: "configured" },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enabled":
      case "active":
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "configured":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "action":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "enabled":
        return "Enabled"
      case "active":
        return "Active"
      case "connected":
        return "Connected"
      case "configured":
        return "Configured"
      case "action":
        return "Action"
      default:
        return status
    }
  }

  return (
    <div className="relative">
      {/* Settings Header */}
      <div className="px-8 py-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your Plex experience and preferences</p>
      </div>

      {/* Settings Content */}
      <div className="p-8">
        {selectedCategory ? (
          // Detailed Category View
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
              className="mb-6 text-gray-400 hover:text-white"
            >
              ← Back to Settings
            </Button>

            {settingsCategories
              .filter((cat) => cat.title === selectedCategory)
              .map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.title}>
                    <div className="flex items-center mb-6">
                      <Icon className="h-8 w-8 text-yellow-500 mr-4" />
                      <div>
                        <h2 className="text-2xl font-bold">{category.title}</h2>
                        <p className="text-gray-400">{category.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {category.items.map((item) => (
                        <div key={item.name} className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                              <p className="text-gray-400 text-sm">{item.description}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant="secondary" className={getStatusColor(item.status)}>
                                {getStatusText(item.status)}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                Configure
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          // Category Overview
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsCategories.map((category) => {
              const Icon = category.icon
              return (
                <div
                  key={category.title}
                  className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group"
                  onClick={() => setSelectedCategory(category.title)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Icon className="h-6 w-6 text-yellow-500 mr-3" />
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.items.slice(0, 3).map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{item.name}</span>
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                    ))}
                    {category.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{category.items.length - 3} more settings</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
