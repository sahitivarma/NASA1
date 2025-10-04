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

// "use client"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// interface Post {
//   id: string
//   name: string
//   location: string
//   problem: string
//   description: string
//   image?: string
//   validityScore: number
// }

// export default function CommunityPortal() {
//   const [mounted, setMounted] = useState(false)
//   const [showPostModal, setShowPostModal] = useState(false)
//   const [posts, setPosts] = useState<Post[]>([])
//   const [newPost, setNewPost] = useState({
//     name: "",
//     location: "",
//     problem: "",
//     description: "",
//     image: null as File | null,
//   })

//   useEffect(() => {
//     setMounted(true)
//     fetch("http://127.0.0.1:8000/api/posts")
//       .then((res) => res.json())
//       .then(setPosts)
//       .catch((err) => console.error("Failed to fetch posts:", err))
//   }, [])

//   const getValidityColor = (score: number) => {
//     if (score >= 90) return "#22c55e"
//     if (score >= 75) return "#f59e0b"
//     if (score >= 60) return "#ef4444"
//     return "#64748b"
//   }

//   const handlePostSubmit = async () => {
//     if (!newPost.name || !newPost.location || !newPost.problem || !newPost.description) {
//       alert("Please fill all mandatory fields (Name, Location, Problem, Description).")
//       return
//     }

//     const formData = new FormData()
//     formData.append("name", newPost.name)
//     formData.append("location", newPost.location)
//     formData.append("problem", newPost.problem)
//     formData.append("description", newPost.description)
//     if (newPost.image) formData.append("image", newPost.image)

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/posts", {
//         method: "POST",
//         body: formData,
//       })
//       if (!res.ok) throw new Error("Failed to create post")

//       const data = await res.json()
//       setPosts((prev) => [data.post, ...prev])
//       setNewPost({ name: "", location: "", problem: "", description: "", image: null })
//       setShowPostModal(false)
//     } catch (err) {
//       alert("Error: Could not create post.")
//       console.error(err)
//     }
//   }

//   if (!mounted) return null

//   return (
//     <div className="min-h-screen bg-black text-white relative overflow-hidden">
//       {/* Keep everything else identical to your old design */}

//       <nav className="relative z-30 fixed top-0 left-0 right-0 p-6 bg-black/20 backdrop-blur-sm">
//         <div className="flex items-center justify-between">
//           <Link href="/" className="text-2xl font-bold" style={{ color: "#3b53f9" }}>
//             EXONOVA
//           </Link>
//           <div className="flex items-center space-x-6 text-sm">
//             <Link href="/city-explorer" className="text-white/80 hover:text-[#00F0FF]">City Explorer</Link>
//             <Link href="/urban-planner" className="text-white/80 hover:text-[#00F0FF]">Urban Planner</Link>
//             <Link href="/disaster-command" className="text-white/80 hover:text-[#00F0FF]">Disaster Command</Link>
//             <Link href="/student-hub" className="text-white/80 hover:text-[#00F0FF]">Student Hub</Link>
//             <Link href="/about" className="text-white/80 hover:text-[#00F0FF]">About</Link>
//           </div>
//         </div>
//       </nav>

//       <div className="relative z-20 pt-6 min-h-screen flex">
//         {/* Feed */}
//         <div className="flex-1 p-6 max-w-2xl mx-auto overflow-y-auto custom-scrollbar">
//           <div className="flex items-center justify-between mb-8">
//             <h1 className="text-3xl font-bold" style={{ color: "#3b53f9" }}>Community Portal</h1>
//             <Button
//               onClick={() => setShowPostModal(true)}
//               className="bg-[#3b53f9] hover:bg-[#3340c9] text-white font-semibold px-6 py-2 rounded-lg"
//             >
//               Create Post
//             </Button>
//           </div>

//           {/* Posts */}
//           <div className="space-y-6">
//             {posts.map((post) => (
//               <div key={post.id} className="p-6 rounded-lg" style={{ backgroundColor: "#1e1e1e" }}>
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h3 className="font-semibold text-white">{post.name}</h3>
//                     <p className="text-sm text-white/60">{post.location}</p>
//                     <p className="text-sm text-[#9B59FF] mt-1">{post.problem}</p>
//                   </div>

//                   {/* Validity Score Circle */}
//                   <div className="relative">
//                     <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
//                       <path
//                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                         fill="none"
//                         stroke="rgba(255,255,255,0.2)"
//                         strokeWidth="2"
//                       />
//                       <path
//                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                         fill="none"
//                         stroke={getValidityColor(post.validityScore)}
//                         strokeWidth="2"
//                         strokeDasharray={`${post.validityScore}, 100`}
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span className="text-xs font-bold" style={{ color: getValidityColor(post.validityScore) }}>
//                         {post.validityScore}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="text-white/90 mb-4">{post.description}</p>
//                 {post.image && <img src={post.image} alt="Post" className="w-full h-48 object-cover rounded-lg mb-3" />}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Sidebar Search */}
//         <div className="w-96 p-6 pt-0 overflow-y-auto custom-scrollbar">
//           <div className="relative mt-0">
//             <input
//               type="text"
//               placeholder="Search trending issues by region"
//               className="w-full px-3 py-2 rounded-lg bg-white text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#3b53f9]"
//             />
//             <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60">🔍</span>
//           </div>
//         </div>
//       </div>

//       {/* Create Post Modal */}
//       {showPostModal && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
//           <div className="bg-[#2b2b2b] p-6 rounded-lg w-[520px] space-y-4 border border-[#3a3a3a]">
//             <h2 className="text-2xl font-extrabold" style={{ color: "#3b53f9" }}>Create New Post</h2>

//             <input
//               type="text"
//               placeholder="Your Name"
//               value={newPost.name}
//               onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
//               className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"
//             />

//             <input
//               type="text"
//               placeholder="Location (e.g. Hyderabad)"
//               value={newPost.location}
//               onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
//               className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"
//             />

//             <input
//               type="text"
//               placeholder="Problem (e.g. Flood, Heat, Pollution)"
//               value={newPost.problem}
//               onChange={(e) => setNewPost({ ...newPost, problem: e.target.value })}
//               className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"
//             />

//             <textarea
//               placeholder="Description"
//               value={newPost.description}
//               onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
//               className="w-full p-3 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40 min-h-[100px]"
//             />

//             <input
//               type="file"
//               onChange={(e) => {
//                 if (e.target.files && e.target.files[0]) {
//                   setNewPost({ ...newPost, image: e.target.files[0] })
//                 }
//               }}
//               className="w-full text-white"
//             />

//             <div className="flex justify-end space-x-3">
//               <button onClick={handlePostSubmit} className="px-6 py-2 rounded-md font-semibold text-white bg-[#3b53f9] hover:bg-[#3340c9]">Post</button>
//               <button onClick={() => setShowPostModal(false)} className="px-4 py-2 rounded-md bg-[#444] text-white">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// "use client";
// import React, { useState, useEffect } from "react";

// interface Post {
//   id: string;
//   name: string;
//   location: string;
//   description: string;
//   problem?: string;
//   validityScore: number;
//   image?: string | null;
// }

// export default function CommunityPage() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     location: "",
//     description: "",
//     problem: "General",
//     image: null as File | null,
//   });
//   const [region, setRegion] = useState("");
//   const [trending, setTrending] = useState<any[]>([]);

//   // Load posts initially
//   useEffect(() => {
//     fetch("http://localhost:8000/api/posts")
//       .then((res) => res.json())
//       .then((data) => {
//         setPosts(data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   // Input handlers
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setForm({ ...form, image: e.target.files[0] });
//     }
//   };

//   // Submit post
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", form.name);
//     formData.append("location", form.location);
//     formData.append("description", form.description);
//     formData.append("problem", form.problem);
//     if (form.image) formData.append("image", form.image);

//     const res = await fetch("http://localhost:8000/api/posts", {
//       method: "POST",
//       body: formData,
//     });

//     if (res.ok) {
//       const data = await res.json();
//       setPosts([data.post, ...posts]);
//       setShowModal(false);
//       setForm({
//         name: "",
//         location: "",
//         description: "",
//         problem: "General",
//         image: null,
//       });
//     } else {
//       alert("Post could not be created.");
//     }
//   };

//   // Search trending issues
//   const handleSearch = async () => {
//     if (!region.trim()) return;
//     const res = await fetch(`http://localhost:8000/api/trending?region=${region}`);
//     const data = await res.json();
//     if (data.trending && data.trending.length > 0) {
//       setTrending(data.trending);
//     } else {
//       setTrending([]);
//     }
//   };

//   return (
//     <div className="bg-black min-h-screen text-white p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-blue-500">Community Hub</h1>
//         <button
//           className="bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
//           onClick={() => setShowModal(true)}
//         >
//           Create Post
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="flex mb-6 space-x-2">
//         <input
//           type="text"
//           placeholder="Search region (e.g., Hyderabad)"
//           value={region}
//           onChange={(e) => setRegion(e.target.value)}
//           className="text-black p-2 rounded-lg flex-1"
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 px-3 rounded-lg hover:bg-blue-700"
//         >
//           Search
//         </button>
//       </div>

//       {/* Trending Section */}
//       {region && (
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-blue-400 mb-2">
//             Trending Issues in {region}
//           </h2>
//           {trending.length === 0 ? (
//             <p className="text-gray-400">No trending issues found.</p>
//           ) : (
//             <ul className="space-y-2">
//               {trending.map((t, idx) => (
//                 <li key={idx} className="bg-gray-800 p-3 rounded-lg">
//                   {t.issue} —{" "}
//                   <span className="text-green-400 font-semibold">{t.count}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}

//       {/* Posts Section */}
//       {loading ? (
//         <p>Loading posts...</p>
//       ) : posts.length === 0 ? (
//         <p className="text-gray-400">No posts yet. Create one!</p>
//       ) : (
//         posts.map((post) => (
//           <div key={post.id} className="bg-gray-900 p-4 rounded-2xl mb-5">
//             <div className="flex justify-between">
//               <div>
//                 <h2 className="font-bold text-lg">{post.name}</h2>
//                 <p className="text-gray-400 text-sm">{post.location}</p>
//                 {post.problem && (
//                   <p className="text-sm text-blue-400">{post.problem}</p>
//                 )}
//               </div>
//               <div className="text-yellow-400 font-semibold">
//                 {post.validityScore}%
//               </div>
//             </div>
//             <p className="mt-3">{post.description}</p>
//             {post.image && (
//               <img
//                 src={`http://localhost:8000${post.image}`}
//                 alt=""
//                 className="mt-3 rounded-lg max-h-64 object-cover"
//               />
//             )}
//           </div>
//         ))
//       )}

//       {/* Create Post Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
//           <div className="bg-gray-800 p-6 rounded-2xl w-96">
//             <h2 className="text-xl font-semibold mb-4">Create Post</h2>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Your name"
//                 required
//                 value={form.name}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black"
//               />
//               <input
//                 type="text"
//                 name="location"
//                 placeholder="Location"
//                 required
//                 value={form.location}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black"
//               />
//               <select
//                 name="problem"
//                 value={form.problem}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black"
//               >
//                 <option value="General">General</option>
//                 <option value="Air Pollution">Air Pollution</option>
//                 <option value="Water Contamination">Water Contamination</option>
//                 <option value="Waste Management">Waste Management</option>
//               </select>
//               <textarea
//                 name="description"
//                 placeholder="What's happening?"
//                 required
//                 value={form.description}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full text-sm text-gray-300 border border-white rounded p-1"
//               />
//               <div className="flex justify-end space-x-2 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="bg-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
//                 >
//                   Post
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// const [isPosting, setIsPosting] = useState(false);

// interface Post {
//   id: string;
//   name: string;
//   location: string;
//   problem: string;
//   description: string;
//   image?: string;
//   validityScore: number;
// }

// export default function CommunityPortal() {
//   const [mounted, setMounted] = useState(false);
//   const [showPostModal, setShowPostModal] = useState(false);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [region, setRegion] = useState("");
//   const [trending, setTrending] = useState<any[]>([]);

//   const [newPost, setNewPost] = useState({
//     name: "",
//     location: "",
//     problem: "",
//     description: "",
//     image: null as File | null,
//   });

//   useEffect(() => {
//     setMounted(true);
//     fetch("http://127.0.0.1:8000/api/posts")
//       .then((res) => res.json())
//       .then(setPosts)
//       .catch((err) => console.error("Failed to fetch posts:", err));
//   }, []);

//   const getValidityColor = (score: number) => {
//     if (score >= 90) return "#22c55e";
//     if (score >= 75) return "#f59e0b";
//     if (score >= 60) return "#ef4444";
//     return "#64748b";
//   };

//   const handlePostSubmit = async () => {
//     if (!newPost.name || !newPost.location || !newPost.problem || !newPost.description) {
//       alert("Please fill all mandatory fields (Name, Location, Problem, Description).");
//       return;
//     }

//     setIsPosting(true);

//     const formData = new FormData();
//     formData.append("name", newPost.name);
//     formData.append("location", newPost.location);
//     formData.append("problem", newPost.problem);
//     formData.append("description", newPost.description);
//     if (newPost.image) formData.append("image", newPost.image);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/posts", {
//         method: "POST",
//         body: formData,
//       });
//       if (!res.ok) throw new Error("Failed to create post");

//       const data = await res.json();
//       setPosts((prev) => [data.post, ...prev]);
//       setNewPost({ name: "", location: "", problem: "", description: "", image: null });
//       setShowPostModal(false);
//     } catch (err) {
//       alert("Error: Could not create post.");
//       console.error(err);
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!region.trim()) return;
//     const res = await fetch(`http://127.0.0.1:8000/api/trending?region=${region}`);
//     const data = await res.json();
//     if (data.trending && data.trending.length > 0) setTrending(data.trending);
//     else setTrending([]);
//   };

//   if (!mounted) return null;

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
//             <Link href="/city-explorer" className="text-white/80 hover:text-[#00F0FF]">
//               City Explorer
//             </Link>
//             <Link href="/urban-planner" className="text-white/80 hover:text-[#00F0FF]">
//               Urban Planner
//             </Link>
//             <Link href="/disaster-command" className="text-white/80 hover:text-[#00F0FF]">
//               Disaster Command
//             </Link>
//             <Link href="/student-hub" className="text-white/80 hover:text-[#00F0FF]">
//               Student Hub
//             </Link>
//             <Link href="/about" className="text-white/80 hover:text-[#00F0FF]">
//               About
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Main Layout */}
//       <div className="relative z-20 pt-6 min-h-screen flex">
//         {/* Feed Section */}
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

//           {/* Posts */}
//           <div className="space-y-6">
//             {posts.map((post) => (
//               <div key={post.id} className="p-6 rounded-lg" style={{ backgroundColor: "#1e1e1e" }}>
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h3 className="font-semibold text-white">{post.name}</h3>
//                     <p className="text-sm text-white/60">{post.location}</p>
//                     <p className="text-sm text-[#9B59FF] mt-1">{post.problem}</p>
//                   </div>
//                   <div className="relative">
//                     <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
//                       <path
//                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                         fill="none"
//                         stroke="rgba(255,255,255,0.2)"
//                         strokeWidth="2"
//                       />
//                       <path
//                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                         fill="none"
//                         stroke={getValidityColor(post.validityScore)}
//                         strokeWidth="2"
//                         strokeDasharray={`${post.validityScore}, 100`}
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span
//                         className="text-xs font-bold"
//                         style={{ color: getValidityColor(post.validityScore) }}
//                       >
//                         {post.validityScore}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="text-white/90 mb-4">{post.description}</p>
//                 {post.image && (
//                   <img
//                     src={`http://127.0.0.1:8000${post.image}`}
//                     alt="Post"
//                     className="w-full h-48 object-cover rounded-lg mb-3"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Sidebar Search */}
//         <div className="w-96 p-6 pt-0 overflow-y-auto custom-scrollbar">
//           <div className="relative mt-0 mb-6">
//             <input
//               type="text"
//               placeholder="Search trending issues by region"
//               value={region}
//               onChange={(e) => setRegion(e.target.value)}
//               className="w-full px-3 py-2 rounded-lg bg-white text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#3b53f9]"
//             />
//             <button
//               onClick={handleSearch}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60"
//             >
//               🔍
//             </button>
//           </div>

//           {region && (
//             <div>
//               <h2 className="text-lg font-semibold text-[#00F0FF] mb-2">
//                 Trending in {region}
//               </h2>
//               {trending.length === 0 ? (
//                 <p className="text-white/60">No trending issues found.</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {trending.map((t, idx) => (
//                     <li key={idx} className="bg-[#1e1e1e] p-3 rounded-lg">
//                       {t.issue} —{" "}
//                       <span className="text-green-400 font-semibold">{t.count}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Scrollbar Styling */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background-color: white;
//           border-radius: 8px;
//         }
//       `}</style>

//       {/* Create Post Modal */}
//       {showPostModal && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
//           <div className="bg-[#2b2b2b] p-6 rounded-lg w-[520px] space-y-4 border border-[#3a3a3a]">
//             <h2 className="text-2xl font-extrabold" style={{ color: "#3b53f9" }}>
//               Create New Post
//             </h2>

//             <input
//               type="text"
//               placeholder="Your Name"
//               value={newPost.name}
//               onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
//               className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"
//             />

//             <input
//               type="text"
//               placeholder="Location (e.g. Hyderabad)"
//               value={newPost.location}
//               onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
//               className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"
//             />

//             <input
//               type="text"
//               placeholder="Problem (e.g. Flood, Pollution)"
//               value={newPost.problem}
//               onChange={(e) => setNewPost({ ...newPost, problem: e.target.value })}
//               className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40"
//             />

//             <textarea
//               placeholder="Description"
//               value={newPost.description}
//               onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
//               className="w-full p-3 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40 min-h-[110px] resize-none"
//             />

//             <div className="flex items-center justify-between space-x-4">
//               <label className="inline-flex items-center px-4 py-2 rounded-md cursor-pointer bg-[#3b53f9] hover:bg-[#3340c9]">
//                 <span className="text-sm font-medium text-white">Choose file</span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={(e) => {
//                     if (e.target.files && e.target.files[0]) {
//                       setNewPost({ ...newPost, image: e.target.files[0] });
//                     }
//                   }}
//                 />
//               </label>
//               <div className="text-sm text-white/80 flex-1">
//                 {newPost.image ? newPost.image.name : "No file chosen"}
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={handlePostSubmit}
//                 disabled={isPosting}
//                 className={`px-6 py-2 rounded-md font-semibold text-white ${
//                   isPosting ? "bg-gray-500 cursor-not-allowed" : "bg-[#3b53f9] hover:bg-[#3340c9]"
//                 }`}
//               >
//                 {isPosting ? "Posting..." : "Post"}
//               </button>
//               <button
//                 onClick={() => setShowPostModal(false)}
//                 className="px-4 py-2 rounded-md font-medium bg-[#444] text-white"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
  id: string;
  name: string;
  location: string;
  problem: string;
  description: string;
  image?: string | null;
  validityScore: number;
}

export default function CommunityPortal() {
  // --- all hooks must be inside component ---
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [region, setRegion] = useState("");
  const [trending, setTrending] = useState<any[]>([]);

  const [newPost, setNewPost] = useState({
    name: "",
    location: "",
    problem: "General",
    description: "",
    image: null as File | null,
  });

  useEffect(() => {
    setMounted(true);
    fetch("http://127.0.0.1:8000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        // backend returns posts array; keep order as-is
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      });
  }, []);

  const getValidityColor = (score: number) => {
    if (score >= 90) return "#22c55e";
    if (score >= 75) return "#f59e0b";
    if (score >= 60) return "#ef4444";
    return "#64748b";
  };

  const handlePostSubmit = async () => {
    if (!newPost.name || !newPost.location || !newPost.problem || !newPost.description) {
      alert("Please fill all mandatory fields (Name, Location, Problem, Description).");
      return;
    }

    setIsPosting(true);

    const formData = new FormData();
    formData.append("name", newPost.name);
    formData.append("location", newPost.location);
    formData.append("problem", newPost.problem);
    formData.append("description", newPost.description);
    if (newPost.image) formData.append("image", newPost.image);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/posts", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create post");

      const data = await res.json();
      // Expect backend to return { post: { ... } }
      if (data?.post) {
        setPosts((prev) => [data.post, ...prev]);
      } else if (Array.isArray(data)) {
        setPosts(data);
      }
      setNewPost({ name: "", location: "", problem: "General", description: "", image: null });
      setShowPostModal(false);
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Error: Could not create post.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleSearch = async () => {
    if (!region.trim()) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/trending?region=${encodeURIComponent(region)}`);
      const data = await res.json();
      setTrending(data?.trending || []);
    } catch (err) {
      console.error("Failed to fetch trending:", err);
      setTrending([]);
    }
  };
    const handleCancel = () => {
      setNewPost({ name: "", location: "", problem: "General", description: "", image: null }); // clear form
      setIsPosting(false); // stop posting state
      setShowPostModal(false); // close modal
    };
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Nav */}
      <nav className="relative z-30 fixed top-0 left-0 right-0 p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold" style={{ color: "#3b53f9" }}>
            EXONOVA
          </Link>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/city-explorer" className="text-white/80 hover:text-[#00F0FF]">City Explorer</Link>
            <Link href="/urban-planner" className="text-white/80 hover:text-[#00F0FF]">Urban Planner</Link>
            <Link href="/disaster-command" className="text-white/80 hover:text-[#00F0FF]">Disaster Command</Link>
            <Link href="/student-hub" className="text-white/80 hover:text-[#00F0FF]">Student Hub</Link>
            <Link href="/about" className="text-white/80 hover:text-[#00F0FF]">About</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-20 pt-6 min-h-screen flex">
        <div className="flex-1 p-6 max-w-2xl mx-auto overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ color: "#3b53f9" }}>Community Portal</h1>
            {/* Use native button to avoid issues with a custom Button component */}
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-[#3b53f9] hover:bg-[#3340c9] text-white font-semibold px-6 py-2 rounded-lg"
            >
              Create Post
            </button>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="p-6 rounded-lg" style={{ backgroundColor: "#1e1e1e" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white">{post.name}</h3>
                    <p className="text-sm text-white/60">{post.location}</p>
                    <p className="text-sm text-[#9B59FF] mt-1">{post.problem}</p>
                  </div>
                  <div className="relative">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke={getValidityColor(post.validityScore)} strokeWidth="2"
                        strokeDasharray={`${post.validityScore}, 100`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold" style={{ color: getValidityColor(post.validityScore) }}>
                        {post.validityScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-white/90 mb-4">{post.description}</p>
                {post.image && (
                  <img src={`http://127.0.0.1:8000${post.image}`} alt="Post" className="w-full h-48 object-cover rounded-lg mb-3" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 p-6 pt-0 overflow-y-auto custom-scrollbar">
          <div className="relative mt-0 mb-6">
            <input
              type="text"
              placeholder="Search trending issues by region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#3b53f9]"
            />
            <button onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60">🔍</button>
          </div>

          {region && (
            <div>
              <h2 className="text-lg font-semibold text-[#00F0FF] mb-2">Trending in {region}</h2>
              {trending.length === 0 ? (
                <p className="text-white/60">No trending issues found.</p>
              ) : (
                <ul className="space-y-2">
                  {trending.map((t, idx) => (
                    <li key={idx} className="bg-[#1e1e1e] p-3 rounded-lg">
                      {t.issue} — <span className="text-green-400 font-semibold">{t.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
          <div className="bg-[#2b2b2b] p-6 rounded-lg w-[520px] space-y-4 border border-[#3a3a3a]">
            <h2 className="text-2xl font-extrabold" style={{ color: "#3b53f9" }}>Create New Post</h2>

            <input type="text" placeholder="Your Name" value={newPost.name}
              onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
              className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40" />

            <input type="text" placeholder="Location (e.g. Hyderabad)" value={newPost.location}
              onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
              className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40" />

            <input type="text" placeholder="Problem (e.g. Flood, Pollution)" value={newPost.problem}
              onChange={(e) => setNewPost({ ...newPost, problem: e.target.value })}
              className="w-full p-2 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40" />

            <textarea placeholder="Description" value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              className="w-full p-3 rounded-md bg-transparent border border-[#555] text-white placeholder-white/40 min-h-[110px] resize-none" />

            <div className="flex items-center justify-between space-x-4">
              <label className="inline-flex items-center px-4 py-2 rounded-md cursor-pointer bg-[#3b53f9] hover:bg-[#3340c9]">
                <span className="text-sm font-medium text-white">Choose file</span>
                <input type="file" className="hidden" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewPost({ ...newPost, image: e.target.files[0] });
                  }
                }} />
              </label>
              <div className="text-sm text-white/80 flex-1">{newPost.image ? newPost.image.name : "No file chosen"}</div>
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={handlePostSubmit}
                disabled={isPosting}
                className={`px-6 py-2 rounded-md font-semibold text-white ${isPosting ? "bg-gray-500 cursor-not-allowed" : "bg-[#3b53f9] hover:bg-[#3340c9]"}`}>
                {isPosting ? "Posting..." : "Post"}
              </button>
              <button onClick={handleCancel} className="px-4 py-2 rounded-md bg-[#444] text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: white; border-radius: 8px; }
      `}</style>
    </div>
  );
}
