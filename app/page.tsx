"use client"

import { useState } from "react"
import { PlexSidebar } from "@/components/plex-sidebar"
import { PlexTopNav } from "@/components/plex-top-nav"
import { HomePage } from "@/components/pages/home-page"
import { MoviesPage } from "@/components/pages/movies-page"
import { ShowsPage } from "@/components/pages/shows-page"
import { SearchPage } from "@/components/pages/search-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { PlexPreviewPanel } from "@/components/plex-preview-panel"

export default function PlexHTPC() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarPinned, setSidebarPinned] = useState(false)
  const [activeCategory, setActiveCategory] = useState("Home")
  const [activeTopTab, setActiveTopTab] = useState("Home")
  const [selectedContent, setSelectedContent] = useState<any>(null)

  const renderCurrentPage = () => {
    // Top nav takes priority for main navigation
    if (activeTopTab === "Profile") return <ProfilePage />
    if (activeTopTab === "Activity")
      return <div className="p-8 text-center text-gray-400">Activity page coming soon...</div>
    if (activeTopTab === "Trending")
      return <div className="p-8 text-center text-gray-400">Trending page coming soon...</div>

    // Sidebar navigation
    switch (activeCategory) {
      case "Search":
        return <SearchPage onContentSelect={setSelectedContent} />
      case "Movies":
        return <MoviesPage onContentSelect={setSelectedContent} />
      case "Shows":
        return <ShowsPage onContentSelect={setSelectedContent} />
      case "Settings":
        return <SettingsPage />
      case "Home":
      default:
        return <HomePage onContentSelect={setSelectedContent} />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <PlexSidebar
        isOpen={sidebarOpen || sidebarPinned}
        isPinned={sidebarPinned}
        activeCategory={activeCategory}
        onCategorySelect={(category) => {
          setActiveCategory(category)
          setActiveTopTab("Home")
          setSelectedContent(null)
          if (!sidebarPinned) setSidebarOpen(false)
        }}
        onTogglePin={() => setSidebarPinned(!sidebarPinned)}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen || sidebarPinned ? "ml-64" : "ml-0"}`}>
        {/* Top Navigation */}
        <PlexTopNav
          activeTab={activeTopTab}
          onTabSelect={(tab) => {
            setActiveTopTab(tab)
            if (tab !== "Home") setActiveCategory("Home")
            setSelectedContent(null)
          }}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Content Area */}
        <div className="relative z-10">{renderCurrentPage()}</div>
      </div>

      {selectedContent && <PlexPreviewPanel content={selectedContent} onClose={() => setSelectedContent(null)} />}
    </div>
  )
}
