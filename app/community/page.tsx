// "use client"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// interface Post {
//   id: string
//   author: {
//     name: string
//     avatar: string
//     location: string
//   }
//   timestamp: string
//   description: string
//   image?: string
//   validityScore: number
//   likes: number
//   comments: number
//   location: {
//     name: string
//     coordinates: [number, number]
//   }
// }

// export default function CommunityPortal() {
//   const [mounted, setMounted] = useState(false)
//   const [showPostModal, setShowPostModal] = useState(false)
//   const [newPost, setNewPost] = useState({
//     description: "",
//     location: "",
//     image: null as File | null,
//   })

//   const [posts] = useState<Post[]>([
//     {
//       id: "1",
//       author: {
//         name: "Sarah Chen",
//         avatar: "/professional-woman-avatar.png",
//         location: "San Francisco, CA",
//       },
//       timestamp: "2 hours ago",
//       description:
//         "Noticed unusual algae bloom in the bay area. Water quality seems compromised near Pier 39.",
//       image: "/algae-bloom-in-bay-water.jpg",
//       validityScore: 87,
//       likes: 23,
//       comments: 8,
//       location: { name: "San Francisco Bay", coordinates: [37.7749, -122.4194] },
//     },
//     {
//       id: "2",
//       author: {
//         name: "Marcus Rodriguez",
//         avatar: "/young-man-avatar.png",
//         location: "Phoenix, AZ",
//       },
//       timestamp: "4 hours ago",
//       description:
//         "Extreme heat wave continues. Recorded 118°F in my backyard. Air conditioning struggling to keep up.",
//       validityScore: 92,
//       likes: 45,
//       comments: 12,
//       location: { name: "Phoenix Metro", coordinates: [33.4484, -112.074] },
//     },
//     {
//       id: "3",
//       author: {
//         name: "Dr. Emily Watson",
//         avatar: "/scientist-woman-avatar.jpg",
//         location: "Miami, FL",
//       },
//       timestamp: "6 hours ago",
//       description:
//         "Hurricane tracking shows potential Category 3 storm approaching. Residents should prepare evacuation plans.",
//       image: "/hurricane-satellite-view.png",
//       validityScore: 96,
//       likes: 78,
//       comments: 24,
//       location: { name: "Miami-Dade County", coordinates: [25.7617, -80.1918] },
//     },
//     {
//       id: "4",
//       author: {
//         name: "Jake Thompson",
//         avatar: "/farmer-man-avatar.jpg",
//         location: "Des Moines, IA",
//       },
//       timestamp: "8 hours ago",
//       description:
//         "Drought conditions worsening. Corn crops showing severe stress. Need immediate irrigation solutions.",
//       validityScore: 84,
//       likes: 34,
//       comments: 15,
//       location: { name: "Central Iowa", coordinates: [41.5868, -93.625] },
//     },
//   ])

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   const getValidityColor = (score: number) => {
//     if (score >= 90) return "#22c55e" // green
//     if (score >= 75) return "#f59e0b" // orange
//     if (score >= 60) return "#ef4444" // red
//     return "#64748b"
//   }

//   const handlePostSubmit = () => {
//     if (!newPost.description.trim()) return
//     alert("Post submitted successfully! Our AI is validating the information...")
//     setNewPost({ description: "", location: "", image: null })
//     setShowPostModal(false)
//   }

//   if (!mounted) return null

//   return (
//     <div className="min-h-screen bg-black text-white relative overflow-hidden">
//       {/* Starfield Background */}
//       <div className="absolute inset-0 z-0">
//         <div className="stars"></div>
//         <div className="stars2"></div>
//         <div className="stars3"></div>
//       </div>

//       {/* Navigation */}
//       <nav className="relative z-30 fixed top-0 left-0 right-0 p-6 bg-black/20 backdrop-blur-sm">
//         <div className="flex items-center justify-between">
//           <Link href="/" className="text-2xl font-bold" style={{ color: "#3b53f9" }}>
//             EXONOVA
//           </Link>
//           <div className="flex items-center space-x-6 text-sm">
//             <Link href="/city-explorer" className="text-white/80 hover:text-[#00F0FF] transition-colors">
//               City Explorer
//             </Link>
//             <Link href="/urban-planner" className="text-white/80 hover:text-[#00F0FF] transition-colors">
//               Urban Planner
//             </Link>
//             <Link href="/disaster-command" className="text-white/80 hover:text-[#00F0FF] transition-colors">
//               Disaster Command
//             </Link>
//             <Link href="/student-hub" className="text-white/80 hover:text-[#00F0FF] transition-colors">
//               Student Hub
//             </Link>
//             <Link href="/about" className="text-white/80 hover:text-[#00F0FF] transition-colors">
//               About
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="relative z-20 pt-6 min-h-screen flex">
//         {/* Main Feed */}
//         <div className="flex-1 p-6 max-w-2xl mx-auto overflow-y-auto custom-scrollbar">
//           <div className="flex items-center justify-between mb-8">
//             <h1 className="text-3xl font-bold" style={{ color: "#3b53f9" }}>
//               Community Portal
//             </h1>
//             <Button
//               onClick={() => setShowPostModal(true)}
//               className="bg-[#3b53f9] hover:bg-[#3340c9] text-white font-semibold px-6 py-2 rounded-lg"
//             >
//               Create Post
//             </Button>
//           </div>

//           {/* Posts Feed */}
//           <div className="space-y-6">
//             {posts.map((post) => (
//               <div
//                 key={post.id}
//                 className="p-6 rounded-lg"
//                 style={{ backgroundColor: "#1e1e1e" }}
//               >
//                 {/* Post Header */}
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-3">
//                     <img
//                       src={post.author.avatar || "/placeholder.svg"}
//                       alt={post.author.name}
//                       className="w-10 h-10 rounded-full border-2 border-[#00F0FF]/30"
//                     />
//                     <div>
//                       <h3 className="font-semibold text-white">{post.author.name}</h3>
//                       <p className="text-sm text-white/60">{post.author.location}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <span className="text-sm text-white/60">{post.timestamp}</span>
//                     {/* Validity Badge */}
//                     <div className="relative">
//                       <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="rgba(255, 255, 255, 0.2)"
//                           strokeWidth="2"
//                         />
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke={getValidityColor(post.validityScore)}
//                           strokeWidth="2"
//                           strokeDasharray={`${post.validityScore}, 100`}
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <span className="text-xs font-bold" style={{ color: getValidityColor(post.validityScore) }}>
//                           {post.validityScore}%
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Post Content */}
//                 <p className="text-white/90 mb-4 leading-relaxed">{post.description}</p>

//                 {/* Post Image */}
//                 {post.image && (
//                   <div className="mb-4 rounded-lg overflow-hidden border border-[#00F0FF]/20">
//                     <img src={post.image} alt="Post content" className="w-full h-48 object-cover" />
//                   </div>
//                 )}

//                 {/* Location Pin */}
//                 <div className="flex items-center space-x-2 mb-4">
//                   <div className="w-4 h-4 rounded-full bg-[#9B59FF] shadow-[0_0_10px_#9B59FF]"></div>
//                   <span className="text-sm text-[#9B59FF]">{post.location.name}</span>
//                 </div>

//                 {/* Post Actions */}
//                 <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
//                   <button className="flex items-center space-x-2 text-white">
//                     <span className="text-lg">👍</span>
//                     <span className="text-sm">{post.likes}</span>
//                   </button>
//                   <button className="flex items-center space-x-2 text-white">
//                     <span className="text-lg">💬</span>
//                     <span className="text-sm">{post.comments}</span>
//                   </button>
//                   <button className="flex items-center space-x-2 text-white">
//                     <span className="text-lg">📍</span>
//                     <span className="text-sm">View Location</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 🔹 Search Bar on the Right */}
//         <div className="w-96 p-6 pt-0 overflow-y-auto custom-scrollbar">
//           <div className="relative mt-0">
//             <input
//               type="text"
//               placeholder="Search trending issues by region"
//               className="w-full px-3 py-2 rounded-lg bg-white text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#3b53f9]"
//             />
//             <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60">
//               🔍
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* White Scrollbars */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background-color: white;
//           border-radius: 8px;
//         }
//       `}</style>

//       {/* Create Post Modal */}
//       {showPostModal && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
//           <div className="bg-[#2b2b2b] p-6 rounded-lg w-[520px] space-y-4 border border-[#3a3a3a] shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
//             <h2 className="text-2xl font-extrabold" style={{ color: "#3b53f9" }}>
//               Create New Post
//             </h2>

//             {/* Description */}
//             <div>
//               <label className="text-sm text-white mb-1 block">Description</label>
//               <textarea
//                 placeholder="Share your environmental observation or concern..."
//                 value={newPost.description}
//                 onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
//                 className="w-full p-3 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40 min-h-[110px] resize-none"
//               />
//             </div>

//             {/* Location */}
//             <div>
//               <label className="text-sm text-white mb-1 block">Location</label>
//               <input
//                 type="text"
//                 placeholder="Enter location (e.g., San Francisco, CA)"
//                 value={newPost.location}
//                 onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
//                 className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"
//               />
//             </div>

//             {/* Upload */}
//             <div className="flex items-center justify-between space-x-4">
//               <label className="inline-flex items-center px-4 py-2 rounded-md cursor-pointer bg-[#3b53f9] hover:bg-[#3340c9]">
//                 <span className="text-sm font-medium text-white">Choose file</span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={(e) => {
//                     if (e.target.files && e.target.files[0]) {
//                       setNewPost({ ...newPost, image: e.target.files[0] })
//                     }
//                   }}
//                 />
//               </label>

//               <div className="text-sm text-white/80 flex-1">
//                 {newPost.image ? newPost.image.name : "No file chosen"}
//               </div>
//             </div>

//             {/* AI Validation Badge */}
//             <div className="p-3 rounded-md border border-[#444] bg-transparent">
//               <div className="flex items-center space-x-3">
//                 <div className="w-3 h-3 rounded-full bg-[#7c3aed] shadow-[0_0_12px_#7c3aed]"></div>
//                 <div>
//                   <div className="text-sm font-semibold text-white">AI Validation Ready</div>
//                   <div className="text-xs text-white/70">
//                     Your post will be analyzed for accuracy and relevance before publishing.
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex justify-end items-center space-x-3">
//               <button
//                 onClick={handlePostSubmit}
//                 type="button"
//                 className="px-6 py-2 rounded-md font-semibold text-white bg-[#3b53f9] hover:bg-[#3340c9]"
//               >
//                 Post
//               </button>

//               <button
//                 onClick={() => setShowPostModal(false)}
//                 type="button"
//                 className="px-4 py-2 rounded-md font-medium bg-[#444] text-white"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Author {
  name: string
  avatar?: string
  location?: string
}

interface Post {
  id: string
  author: Author
  timestamp: string
  description: string
  image?: string | null
  validityScore: number
  likes: number
  comments: number
  location: {
    name: string
    coordinates?: [number, number]
  }
}

interface TrendingItem {
  title: string
  count?: number
  summary?: string
}

export default function CommunityPortal() {
  const [mounted, setMounted] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [showPostModal, setShowPostModal] = useState(false)
  const [problem, setProblem] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const scoreAbortRef = useRef<AbortController | null>(null)
  const saveAbortRef = useRef<AbortController | null>(null)
  const [regionQuery, setRegionQuery] = useState("")
  const [trending, setTrending] = useState<TrendingItem[]>([])
  const [trendingLoading, setTrendingLoading] = useState(false)
  const trendingAbortRef = useRef<AbortController | null>(null)
  const [name, setName] = useState("")  // new field for user name

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

  useEffect(() => {
    setMounted(true)
  }, [])

  const getValidityColor = (score: number) => {
    if (score >= 90) return "#22c55e"
    if (score >= 75) return "#f59e0b"
    if (score >= 60) return "#ef4444"
    return "#64748b"
  }

  const resetForm = () => {
    setName("")
    setProblem("")
    setLocationInput("")
    setDescription("")
    setFile(null)
  }

  const handleCancel = () => {
    if (isPosting) {
      scoreAbortRef.current?.abort()
      saveAbortRef.current?.abort()
    }
    setIsPosting(false)
    setShowPostModal(false)
    resetForm()
  }

  const handlePostSubmit = async () => {
    if (!name.trim() || !problem.trim() || !locationInput.trim() || !description.trim()) {
      alert("Please fill Name, Problem, Location, and Description.")
      return
    }

    setIsPosting(true)

    try {
      const formData = new FormData()
      formData.append("name", name)  // <-- include name
      formData.append("location", locationInput)
      formData.append("description", description)
      formData.append("problem", problem)
      if (file) formData.append("image", file)

      const resp = await fetch(`${BACKEND_URL}/api/posts`, {
        method: "POST",
        body: formData,
      })

      if (!resp.ok) {
        const text = await resp.text()
        throw new Error(`Backend error: ${resp.status} - ${text}`)
      }

      const data = await resp.json()
      alert(`Post submitted successfully! Validity score: ${data.post.validityScore}%`)

      // Update frontend posts list
      setPosts(prev => [
        {
          id: data.post.id,
          author: { name: data.post.name, location: data.post.location },
          timestamp: new Date().toLocaleString(),
          description: data.post.description,
          image: data.post.image ?? null,
          validityScore: data.post.validityScore,
          likes: 0,
          comments: 0,
          location: { name: data.post.location },
        },
        ...prev
      ])

      resetForm()
      setShowPostModal(false)

    } catch (err: any) {
      console.error(err)
      alert("Error while posting: " + err.message)
    } finally {
      setIsPosting(false)
    }
  }
  const handleSearchTrending = async () => {
    const region = regionQuery.trim()
    if (!region) return
    setTrendingLoading(true)

    try {
      const resp = await fetch(`${BACKEND_URL}/api/trending?region=${encodeURIComponent(region)}`, {
        method: "GET",
      })
      if (!resp.ok) throw new Error(`Trending fetch failed: ${resp.statusText}`)
      const data = await resp.json()
      setTrending(Array.isArray(data.trending) ? data.trending.map(t => ({
        title: t.issue,
        count: t.count
      })) : [])
    } catch (err: any) {
      console.error(err)
      alert("Failed to fetch trending issues: " + (err?.message ?? "unknown"))
    } finally {
      setTrendingLoading(false)
    }
  }
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="stars"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-30 fixed top-0 left-0 right-0 p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold" style={{ color: "#3b53f9" }}>EXONOVA</Link>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/city-explorer" className="text-white/80 hover:text-[#00F0FF] transition-colors">City Explorer</Link>
            <Link href="/urban-planner" className="text-white/80 hover:text-[#00F0FF] transition-colors">Urban Planner</Link>
            <Link href="/disaster-command" className="text-white/80 hover:text-[#00F0FF] transition-colors">Disaster Command</Link>
            <Link href="/student-hub" className="text-white/80 hover:text-[#00F0FF] transition-colors">Student Hub</Link>
            <Link href="/about" className="text-white/80 hover:text-[#00F0FF] transition-colors">About</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 pt-6 min-h-screen flex">
        {/* Feed */}
        <div className="flex-1 p-6 max-w-2xl mx-auto overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ color: "#3b53f9" }}>Community Portal</h1>
            <Button onClick={() => setShowPostModal(true)} className="bg-[#3b53f9] hover:bg-[#3340c9] text-white font-semibold px-6 py-2 rounded-lg">
              Create Post
            </Button>
          </div>

          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="p-6 rounded-lg bg-[#1e1e1e] text-white/80">
                No posts yet — create the first post to get started.
              </div>
            ) : posts.map((post) => (
              <div key={post.id} className="p-6 rounded-lg bg-[#1e1e1e]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} className="w-10 h-10 rounded-full border-2 border-[#00F0FF]/30"/>
                    <div>
                      <h3 className="font-semibold text-white">{post.author.name}</h3>
                      <p className="text-sm text-white/60">{post.author.location ?? ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-white/60">{post.timestamp}</span>
                    <div className="relative">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={getValidityColor(post.validityScore)} strokeWidth="2" strokeDasharray={`${post.validityScore}, 100`}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold" style={{ color: getValidityColor(post.validityScore) }}>{post.validityScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-white/90 mb-4 leading-relaxed">{post.description}</p>
                {post.image && <div className="mb-4 rounded-lg overflow-hidden border border-[#00F0FF]/20"><img src={post.image} alt="Post content" className="w-full h-48 object-cover"/></div>}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-[#9B59FF] shadow-[0_0_10px_#9B59FF]"></div>
                  <span className="text-sm text-[#9B59FF]">{post.location.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="w-96 p-6 pt-0 overflow-y-auto custom-scrollbar">
          <div className="flex space-x-2">
            <input type="text" placeholder="Search trending issues by region" value={regionQuery} onChange={(e) => setRegionQuery(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#3b53f9]"/>
            <button onClick={handleSearchTrending} className="px-4 py-2 rounded-lg bg-[#3b53f9] hover:bg-[#3340c9] text-white font-semibold">
              {trendingLoading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white/80 mb-2">Trending Issues</h4>
            {trendingLoading ? <div className="text-white/60">Loading...</div> :
              trending.length === 0 ? <div className="text-white/60">No trend results yet.</div> :
              <ul className="space-y-3">
                {trending.map((t, idx) => (
                  <li key={idx} className="p-3 rounded-md bg-[#1b1b1b]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{t.title}</div>
                        {t.summary && <div className="text-xs text-white/60 mt-1">{t.summary}</div>}
                      </div>
                      {typeof t.count === "number" && <div className="text-xs text-white/50">{t.count} reports</div>}
                    </div>
                  </li>
                ))}
              </ul>
            }
          </div>
        </div>
      </div>

      {/* Scrollbar Styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: white; border-radius: 8px; }
      `}</style>

      {/* Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
          <div className="bg-[#2b2b2b] p-6 rounded-lg w-[520px] space-y-4 border border-[#3a3a3a]">
            <h2 className="text-2xl font-extrabold" style={{ color: "#3b53f9" }}>Create New Post</h2>
            <div>
              <label className="text-sm text-white mb-1 block">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="text-sm text-white mb-1 block">Problem</label>
              <input placeholder="Short title or problem" value={problem} onChange={(e) => setProblem(e.target.value)} className="w-full p-3 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"/>
            </div>
            <div>
              <label className="text-sm text-white mb-1 block">Location</label>
              <input type="text" placeholder="Enter location" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"/>
            </div>
            <div>
              <label className="text-sm text-white mb-1 block">Description</label>
              <textarea placeholder="Share your observation..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40 min-h-[110px] resize-none"/>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <label className="inline-flex items-center px-4 py-2 rounded-md cursor-pointer bg-[#3b53f9] hover:bg-[#3340c9]">
                <span className="text-sm font-medium text-white">Choose file</span>
                <input type="file" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]) }}/>
              </label>
              <div className="text-sm text-white/80 flex-1">{file ? file.name : "No file chosen"}</div>
            </div>
            <div className="flex justify-end items-center space-x-3">
              <button onClick={handlePostSubmit} className="px-6 py-2 rounded-md font-semibold text-white bg-[#3b53f9] hover:bg-[#3340c9]">{isPosting ? "Posting..." : "Post"}</button>
              <button onClick={handleCancel} className="px-4 py-2 rounded-md font-medium bg-[#444] text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
