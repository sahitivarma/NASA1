"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface BuildingTool {
  id: string
  name: string
  icon: string
  cost: number
  category: "infrastructure" | "residential" | "services" | "environment" | "emergency"
  color: string
}

interface PlacedBuilding {
  id: string
  toolId: string
  x: number
  y: number
  name: string
  icon: string
  color: string
}

interface SimulationScore {
  access: number
  sustainability: number
  resilience: number
  equity: number
}

interface LearningMaterial {
  id: string
  title: string
  type: "video" | "pdf" | "interactive"
  thumbnail: string
  duration?: string
  description: string
}

export default function StudentHub() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"pre-school" | "middle-school" | "high-school">("middle-school")
  const [gameMode, setGameMode] = useState<"learning" | "building">("learning")
  const [showGradeLevels, setShowGradeLevels] = useState(false)
  const [budget, setBudget] = useState(10000)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [placedBuildings, setPlacedBuildings] = useState<PlacedBuilding[]>([])
  const [simulationScore, setSimulationScore] = useState<SimulationScore>({
    access: 0,
    sustainability: 0,
    resilience: 0,
    equity: 0,
  })
  const [showSimulation, setShowSimulation] = useState(false)

  const buildingTools: BuildingTool[] = [
    { id: "road", name: "Road", icon: "🛣️", cost: 100, category: "infrastructure", color: "#64748b" },
    { id: "residential", name: "Residential", icon: "🏠", cost: 500, category: "residential", color: "#22c55e" },
    { id: "hospital", name: "Hospital", icon: "🏥", cost: 1500, category: "services", color: "#ef4444" },
    { id: "school", name: "School", icon: "🏫", cost: 1000, category: "services", color: "#3b82f6" },
    { id: "green", name: "Green Zone", icon: "🌳", cost: 300, category: "environment", color: "#16a34a" },
    { id: "water", name: "Water Plant", icon: "💧", cost: 2000, category: "infrastructure", color: "#06b6d4" },
    { id: "flood", name: "Flood Barrier", icon: "🌊", cost: 800, category: "emergency", color: "#0ea5e9" },
    { id: "shelter", name: "Emergency Shelter", icon: "🏕️", cost: 600, category: "emergency", color: "#f59e0b" },
  ]

  const learningMaterials: Record<string, LearningMaterial[]> = {
    "pre-school": [
      {
        id: "1",
        title: "What Makes a City Happy?",
        type: "video",
        thumbnail: "/happy-city-cartoon.jpg",
        duration: "5 min",
        description: "Learn about parks, schools, and clean air through fun animations!",
      },
      {
        id: "2",
        title: "Colors of Nature",
        type: "interactive",
        thumbnail: "/nature-colors-game.png",
        description: "Interactive game about green spaces and clean water.",
      },
    ],
    "middle-school": [
      {
        id: "1",
        title: "Urban Planning Basics",
        type: "video",
        thumbnail: "/urban-planning-basics.jpg",
        duration: "12 min",
        description: "Introduction to city design and infrastructure planning.",
      },
      {
        id: "2",
        title: "Climate Change & Cities",
        type: "pdf",
        thumbnail: "/climate-cities-guide.png",
        description: "How cities can adapt to climate change challenges.",
      },
      {
        id: "3",
        title: "Sustainable Transportation",
        type: "interactive",
        thumbnail: "/transport-simulation.jpg",
        description: "Design eco-friendly transportation systems.",
      },
    ],
    "high-school": [
      {
        id: "1",
        title: "Advanced Urban Systems",
        type: "video",
        thumbnail: "/advanced-urban-systems.jpg",
        duration: "18 min",
        description: "Complex interactions between infrastructure, economy, and environment.",
      },
      {
        id: "2",
        title: "Smart City Technologies",
        type: "pdf",
        thumbnail: "/smart-city-tech.png",
        description: "IoT, AI, and data-driven urban management.",
      },
      {
        id: "3",
        title: "Policy & Governance",
        type: "video",
        thumbnail: "/policy-governance.jpg",
        duration: "15 min",
        description: "How urban policies shape sustainable development.",
      },
    ],
  }

  const objectives = [
    "Build housing for 5,000 residents",
    "Ensure 90% green energy coverage",
    "Create flood protection systems",
    "Maintain budget under $10,000",
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGridClick = (x: number, y: number) => {
    if (!selectedTool) return

    const tool = buildingTools.find((t) => t.id === selectedTool)
    if (!tool || budget < tool.cost) return

    const newBuilding: PlacedBuilding = {
      id: `${selectedTool}-${Date.now()}`,
      toolId: selectedTool,
      x,
      y,
      name: tool.name,
      icon: tool.icon,
      color: tool.color,
    }

    setPlacedBuildings((prev) => [...prev, newBuilding])
    setBudget((prev) => prev - tool.cost)
    setSelectedTool(null)
  }

  const runSimulation = () => {
    setShowSimulation(true)

    // Simulate scoring animation
    setTimeout(() => {
      const buildings = placedBuildings.length
      const greenSpaces = placedBuildings.filter((b) => b.toolId === "green").length
      const services = placedBuildings.filter((b) => ["hospital", "school"].includes(b.toolId)).length
      const emergency = placedBuildings.filter((b) => ["flood", "shelter"].includes(b.toolId)).length

      setSimulationScore({
        access: Math.min(100, services * 25 + buildings * 2),
        sustainability: Math.min(100, greenSpaces * 30 + buildings * 1),
        resilience: Math.min(100, emergency * 35 + buildings * 2),
        equity: Math.min(100, (services + greenSpaces) * 15 + buildings * 3),
      })
    }, 1000)
  }

  const exportReport = () => {
    alert("Generating city report... This would create a PDF with your design and scores!")
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

      {/* Main Content */}
      <div className="relative z-20 pt-20 min-h-screen">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#00F0FF] text-center mb-8">Student Learning Hub</h1>

          {!showGradeLevels && (
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <button
                  onClick={() => setShowGradeLevels(true)}
                  className="bg-gradient-to-br from-[#00F0FF]/20 to-[#0891b2]/20 border border-[#00F0FF]/30 rounded-xl p-8 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="text-6xl mb-4 group-hover:animate-bounce">📚</div>
                  <h2 className="text-2xl font-bold text-[#00F0FF] mb-2">Learning Materials</h2>
                  <p className="text-white/70">Educational content for all grade levels</p>
                </button>

                <button
                  onClick={() => setGameMode("building")}
                  className="bg-gradient-to-br from-[#9B59FF]/20 to-[#7c3aed]/20 border border-[#9B59FF]/30 rounded-xl p-8 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="text-6xl mb-4 group-hover:animate-bounce">🏗️</div>
                  <h2 className="text-2xl font-bold text-[#9B59FF] mb-2">City Builder Game</h2>
                  <p className="text-white/70">Build and simulate sustainable cities</p>
                </button>
              </div>
            </div>
          )}

          {showGradeLevels && gameMode === "learning" && (
            <div>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setShowGradeLevels(false)}
                  className="text-[#00F0FF] hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back to Main Menu</span>
                </button>
              </div>

              <div className="flex justify-center mb-8">
                <div className="flex bg-black/50 rounded-lg p-1 border border-[#00F0FF]/30">
                  {(["pre-school", "middle-school", "high-school"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-md transition-all ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-[#00F0FF] to-[#0891b2] text-black font-semibold shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Learning Materials Mode */}
          {showGradeLevels && gameMode === "learning" && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                {activeTab === "pre-school" && (
                  <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-6 border border-pink-500/30">
                    <h2 className="text-2xl font-bold text-pink-400 mb-2">🌈 Fun Learning for Little Explorers!</h2>
                    <p className="text-white/80">Discover how cities work through colorful games and stories!</p>
                  </div>
                )}
                {activeTab === "middle-school" && (
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-6 border border-blue-500/30">
                    <h2 className="text-2xl font-bold text-blue-400 mb-2">🔬 Explore Urban Science!</h2>
                    <p className="text-white/80">Learn about city planning, environment, and sustainability!</p>
                  </div>
                )}
                {activeTab === "high-school" && (
                  <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg p-6 border border-green-500/30">
                    <h2 className="text-2xl font-bold text-green-400 mb-2">🎓 Advanced Urban Studies!</h2>
                    <p className="text-white/80">Master complex urban systems and policy making!</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningMaterials[activeTab].map((material) => (
                  <div
                    key={material.id}
                    className="holographic-panel p-6 rounded-lg hover:scale-105 transition-all duration-300 border border-white/10 hover:border-[#00F0FF]/50"
                  >
                    <div className="mb-4">
                      <img
                        src={
                          material.thumbnail ||
                          "/placeholder.svg?height=128&width=256&query=educational content thumbnail" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={material.title}
                        className="w-full h-32 object-cover rounded border border-[#00F0FF]/20"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{material.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          material.type === "video"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : material.type === "pdf"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}
                      >
                        {material.type.toUpperCase()}
                      </span>
                    </div>
                    {material.duration && <p className="text-sm text-[#00F0FF] mb-2">⏱️ {material.duration}</p>}
                    <p className="text-sm text-white/70 mb-4">{material.description}</p>
                    <Button className="w-full bg-gradient-to-r from-[#00F0FF] to-[#0891b2] hover:from-[#00F0FF]/90 hover:to-[#0891b2]/90 text-black font-semibold shadow-lg hover:shadow-xl transition-all">
                      {material.type === "video" ? "▶️ Watch" : material.type === "pdf" ? "📖 Read" : "🎮 Play"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* City Builder Game Mode */}
          {gameMode === "building" && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setGameMode("learning")}
                  className="text-[#9B59FF] hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back to Main Menu</span>
                </button>
              </div>

              <div className="flex gap-6">
                {/* Game Area */}
                <div className="flex-1">
                  {/* Budget and Objectives */}
                  <div className="holographic-panel p-4 mb-6 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-[#00F0FF]">💰 Budget: ${budget.toLocaleString()}</div>
                        <Button
                          onClick={runSimulation}
                          disabled={placedBuildings.length === 0}
                          className="bg-gradient-to-r from-[#9B59FF] to-[#7c3aed] hover:from-[#9B59FF]/90 hover:to-[#7c3aed]/90 text-white font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
                        >
                          🚀 Run Simulation
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {objectives.map((objective, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#9B59FF] rounded-full animate-pulse"></div>
                          <span className="text-white/70">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Building Grid */}
                  <div className="holographic-panel p-6 rounded-lg border border-white/10">
                    <div className="grid grid-cols-12 gap-1 aspect-square max-w-2xl mx-auto">
                      {Array.from({ length: 144 }, (_, i) => {
                        const x = i % 12
                        const y = Math.floor(i / 12)
                        const building = placedBuildings.find((b) => b.x === x && b.y === y)

                        return (
                          <div
                            key={i}
                            onClick={() => handleGridClick(x, y)}
                            className={`aspect-square border border-white/20 rounded cursor-pointer transition-all hover:border-[#00F0FF] flex items-center justify-center text-lg ${
                              selectedTool && !building ? "bg-[#00F0FF]/10" : ""
                            }`}
                            style={{
                              backgroundColor: building ? `${building.color}40` : undefined,
                              borderColor: building ? building.color : undefined,
                            }}
                          >
                            {building && <span>{building.icon}</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Toolbox */}
                <div className="w-80">
                  <div className="holographic-panel p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl font-bold text-[#9B59FF] mb-4">🛠️ Building Tools</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {buildingTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                          disabled={budget < tool.cost}
                          className={`p-3 rounded border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            selectedTool === tool.id
                              ? "border-[#00F0FF] bg-[#00F0FF]/20 shadow-lg"
                              : "border-white/20 hover:border-white/40 hover:bg-white/5"
                          }`}
                        >
                          <div className="text-2xl mb-1">{tool.icon}</div>
                          <div className="text-xs font-semibold">{tool.name}</div>
                          <div className="text-xs text-[#00F0FF]">${tool.cost}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Results Modal */}
      {showSimulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="holographic-panel p-8 max-w-2xl w-full mx-4 border border-white/20">
            <h3 className="text-2xl font-bold text-[#00F0FF] text-center mb-8">🏆 City Simulation Results</h3>

            {/* Radar Chart Simulation */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Grid lines */}
                <g stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" fill="none">
                  <polygon points="100,20 160,70 160,130 100,180 40,130 40,70" />
                  <polygon points="100,40 140,80 140,120 100,160 60,120 60,80" />
                  <polygon points="100,60 120,90 120,110 100,140 80,110 80,90" />
                </g>

                {/* Score polygon */}
                <polygon
                  points={`100,${20 + (100 - simulationScore.access) * 0.6} ${
                    160 - (100 - simulationScore.sustainability) * 0.5
                  },${70 + (100 - simulationScore.sustainability) * 0.3} ${
                    160 - (100 - simulationScore.resilience) * 0.5
                  },${130 - (100 - simulationScore.resilience) * 0.3} 100,${
                    180 - (100 - simulationScore.equity) * 0.6
                  } ${40 + (100 - simulationScore.equity) * 0.5},${130 - (100 - simulationScore.equity) * 0.3} ${
                    40 + (100 - simulationScore.access) * 0.5
                  },${70 + (100 - simulationScore.access) * 0.3}`}
                  fill="rgba(0, 240, 255, 0.3)"
                  stroke="#00F0FF"
                  strokeWidth="2"
                  className="animate-pulse"
                />

                {/* Labels */}
                <text x="100" y="15" textAnchor="middle" fill="#00F0FF" fontSize="12" fontWeight="bold">
                  Access
                </text>
                <text x="170" y="75" textAnchor="middle" fill="#00F0FF" fontSize="12" fontWeight="bold">
                  Sustainability
                </text>
                <text x="170" y="135" textAnchor="middle" fill="#00F0FF" fontSize="12" fontWeight="bold">
                  Resilience
                </text>
                <text x="100" y="195" textAnchor="middle" fill="#00F0FF" fontSize="12" fontWeight="bold">
                  Equity
                </text>
              </svg>
            </div>

            {/* Score Bars */}
            <div className="space-y-4 mb-8">
              {Object.entries(simulationScore).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-white font-semibold capitalize w-24">{key}:</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#9B59FF] animate-pulse shadow-[0_0_10px_#00F0FF] transition-all duration-1000"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <span className="text-[#00F0FF] font-bold w-12">{value}%</span>
                </div>
              ))}
            </div>

            {/* Rewards */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">🏆</div>
              <div className="text-xl font-bold text-[#9B59FF]">Sustainable City Builder!</div>
              <div className="text-sm text-white/70">You've earned the Urban Planning Badge</div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={exportReport}
                className="flex-1 bg-gradient-to-r from-[#00F0FF] to-[#0891b2] text-black font-semibold shadow-lg hover:shadow-xl"
              >
                📄 Export Report
              </Button>
              <Button
                onClick={() => setShowSimulation(false)}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400"
              >
                Close
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
