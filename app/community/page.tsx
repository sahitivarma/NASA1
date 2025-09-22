"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    location: string
  }
  timestamp: string
  description: string
  image?: string
  validityScore: number
  likes: number
  comments: number
  location: {
    name: string
    coordinates: [number, number]
  }
}

interface TrendingIssue {
  id: string
  region: string
  issue: string
  severity: "low" | "medium" | "high"
  posts: number
  heatmapData: number[]
}

export default function CommunityPortal() {
  const [mounted, setMounted] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [newPost, setNewPost] = useState({
    description: "",
    location: "",
    image: null as File | null,
  })

  const [posts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        avatar: "/professional-woman-avatar.png",
        location: "San Francisco, CA",
      },
      timestamp: "2 hours ago",
      description: "Noticed unusual algae bloom in the bay area. Water quality seems compromised near Pier 39.",
      image: "/algae-bloom-in-bay-water.jpg",
      validityScore: 87,
      likes: 23,
      comments: 8,
      location: {
        name: "San Francisco Bay",
        coordinates: [37.7749, -122.4194],
      },
    },
    {
      id: "2",
      author: {
        name: "Marcus Rodriguez",
        avatar: "/young-man-avatar.png",
        location: "Phoenix, AZ",
      },
      timestamp: "4 hours ago",
      description:
        "Extreme heat wave continues. Recorded 118°F in my backyard. Air conditioning struggling to keep up.",
      validityScore: 92,
      likes: 45,
      comments: 12,
      location: {
        name: "Phoenix Metro",
        coordinates: [33.4484, -112.074],
      },
    },
    {
      id: "3",
      author: {
        name: "Dr. Emily Watson",
        avatar: "/scientist-woman-avatar.jpg",
        location: "Miami, FL",
      },
      timestamp: "6 hours ago",
      description:
        "Hurricane tracking shows potential Category 3 storm approaching. Residents should prepare evacuation plans.",
      image: "/hurricane-satellite-view.png",
      validityScore: 96,
      likes: 78,
      comments: 24,
      location: {
        name: "Miami-Dade County",
        coordinates: [25.7617, -80.1918],
      },
    },
    {
      id: "4",
      author: {
        name: "Jake Thompson",
        avatar: "/farmer-man-avatar.jpg",
        location: "Des Moines, IA",
      },
      timestamp: "8 hours ago",
      description:
        "Drought conditions worsening. Corn crops showing severe stress. Need immediate irrigation solutions.",
      validityScore: 84,
      likes: 34,
      comments: 15,
      location: {
        name: "Central Iowa",
        coordinates: [41.5868, -93.625],
      },
    },
  ])

  const [trendingIssues] = useState<TrendingIssue[]>([
    {
      id: "1",
      region: "West Coast",
      issue: "Wildfire Risk",
      severity: "high",
      posts: 127,
      heatmapData: [85, 92, 78, 89, 95],
    },
    {
      id: "2",
      region: "Gulf States",
      issue: "Hurricane Season",
      severity: "high",
      posts: 89,
      heatmapData: [76, 88, 92, 85, 79],
    },
    {
      id: "3",
      region: "Midwest",
      issue: "Drought Conditions",
      severity: "medium",
      posts: 64,
      heatmapData: [67, 72, 69, 74, 71],
    },
    {
      id: "4",
      region: "Northeast",
      issue: "Air Quality",
      severity: "medium",
      posts: 43,
      heatmapData: [58, 62, 65, 59, 61],
    },
    {
      id: "5",
      region: "Southwest",
      issue: "Water Scarcity",
      severity: "high",
      posts: 98,
      heatmapData: [82, 87, 91, 85, 89],
    },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const getValidityColor = (score: number) => {
    if (score >= 90) return "#22c55e"
    if (score >= 75) return "#f59e0b"
    if (score >= 60) return "#ef4444"
    return "#64748b"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "#dc2626"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#22c55e"
      default:
        return "#64748b"
    }
  }

  const handlePostSubmit = () => {
    if (!newPost.description.trim()) return

    alert("Post submitted successfully! Our AI is validating the information...")
    setNewPost({ description: "", location: "", image: null })
    setShowPostModal(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 z-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-30 fixed top-0 left-0 right-0 p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold neon-cyan">
            EXONOVA
          </Link>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/city-explorer" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              City Explorer
            </Link>
            <Link href="/urban-planner" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              Urban Planner
            </Link>
            <Link href="/disaster-command" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              Disaster Command
            </Link>
            <Link href="/student-hub" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              Student Hub
            </Link>
            <Link href="/about" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 pt-20 min-h-screen flex">
        {/* Main Feed */}
        <div className="flex-1 p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold neon-cyan">Community Portal</h1>
            <Button
              onClick={() => setShowPostModal(true)}
              className="bg-gradient-to-r from-[#00F0FF] to-[#9B59FF] hover:from-[#00F0FF]/80 hover:to-[#9B59FF]/80 text-black font-semibold px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              Create Post
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="holographic-panel p-6 rounded-lg">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.author.avatar || "/placeholder.svg"}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full border-2 border-[#00F0FF]/30"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{post.author.name}</h3>
                      <p className="text-sm text-white/60">{post.author.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-white/60">{post.timestamp}</span>
                    {/* Validity Badge */}
                    <div className="relative">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={getValidityColor(post.validityScore)}
                          strokeWidth="2"
                          strokeDasharray={`${post.validityScore}, 100`}
                          className="animate-pulse"
                          style={{ filter: `drop-shadow(0 0 5px ${getValidityColor(post.validityScore)})` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold" style={{ color: getValidityColor(post.validityScore) }}>
                          {post.validityScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-white/90 mb-4 leading-relaxed">{post.description}</p>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-[#00F0FF]/20">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post content"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Location Pin */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-[#9B59FF] animate-pulse shadow-[0_0_10px_#9B59FF]"></div>
                  <span className="text-sm text-[#9B59FF]">{post.location.name}</span>
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
                  <button className="flex items-center space-x-2 text-white/60 hover:text-[#00F0FF] transition-colors">
                    <span className="text-lg">👍</span>
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-white/60 hover:text-[#00F0FF] transition-colors">
                    <span className="text-lg">💬</span>
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-white/60 hover:text-[#00F0FF] transition-colors">
                    <span className="text-lg">📍</span>
                    <span className="text-sm">View Location</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Trending Issues */}
        <div className="w-80 p-6">
          <div className="holographic-panel p-6 rounded-lg">
            <h2 className="text-xl font-bold neon-purple mb-6">Trending Issues by Region</h2>
            <div className="space-y-4">
              {trendingIssues.map((issue) => (
                <div key={issue.id} className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{issue.issue}</h3>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${getSeverityColor(issue.severity)}20`,
                        color: getSeverityColor(issue.severity),
                      }}
                    >
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mb-3">{issue.region}</p>

                  {/* Mini Heatmap */}
                  <div className="flex items-center space-x-1 mb-2">
                    {issue.heatmapData.map((value, index) => (
                      <div
                        key={index}
                        className="w-4 h-8 rounded-sm"
                        style={{
                          backgroundColor: `${getSeverityColor(issue.severity)}${Math.round((value / 100) * 255)
                            .toString(16)
                            .padStart(2, "0")}`,
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{issue.posts} posts</span>
                    <span>Last 24h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Creation Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="holographic-panel p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold neon-cyan mb-6">Create New Post</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Description</label>
                <textarea
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  placeholder="Share your environmental observation or concern..."
                  className="w-full h-32 bg-black/50 border border-[#00F0FF]/30 rounded px-3 py-2 text-white placeholder-white/50 focus:border-[#00F0FF] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Location</label>
                <input
                  type="text"
                  value={newPost.location}
                  onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                  placeholder="Enter location (e.g., San Francisco, CA)"
                  className="w-full bg-black/50 border border-[#00F0FF]/30 rounded px-3 py-2 text-white placeholder-white/50 focus:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Upload Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.files?.[0] || null })}
                  className="w-full bg-black/50 border border-[#00F0FF]/30 rounded px-3 py-2 text-white file:bg-[#00F0FF]/20 file:border-0 file:text-[#00F0FF] file:px-3 file:py-1 file:rounded file:mr-3"
                />
              </div>

              {/* Progress Animation */}
              <div className="bg-black/50 border border-[#9B59FF]/30 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-[#9B59FF] rounded-full animate-pulse"></div>
                  <span className="text-sm text-[#9B59FF]">AI Validation Ready</span>
                </div>
                <div className="text-xs text-white/60">
                  Your post will be analyzed for accuracy and relevance before publishing.
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={handlePostSubmit}
                disabled={!newPost.description.trim()}
                className="flex-1 bg-gradient-to-r from-[#00F0FF] to-[#9B59FF] hover:from-[#00F0FF]/80 hover:to-[#9B59FF]/80 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </Button>
              <Button
                onClick={() => setShowPostModal(false)}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Holographic Grid Overlay */}
      <div className="absolute inset-0 z-10 opacity-10">
        <div className="grid-overlay"></div>
      </div>
    </div>
  )
}
