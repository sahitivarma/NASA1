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
  const [gameMode, setGameMode] = useState<"learning" | "building" | null>(null)
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
      { id: "1", title: "What Makes a City Happy?", type: "video", thumbnail: "/happy-city-cartoon.jpg", duration: "5 min", description: "Learn about parks, schools, and clean air through fun animations!" },
      { id: "2", title: "Colors of Nature", type: "interactive", thumbnail: "/nature-colors-game.png", description: "Interactive game about green spaces and clean water." },
    ],
    "middle-school": [
      { id: "1", title: "Urban Planning Basics", type: "video", thumbnail: "/urban-planning-basics.jpg", duration: "12 min", description: "Introduction to city design and infrastructure planning." },
      { id: "2", title: "Climate Change & Cities", type: "pdf", thumbnail: "/climate-cities-guide.png", description: "How cities can adapt to climate change challenges." },
      { id: "3", title: "Sustainable Transportation", type: "interactive", thumbnail: "/transport-simulation.jpg", description: "Design eco-friendly transportation systems." },
    ],
    "high-school": [
      { id: "1", title: "Advanced Urban Systems", type: "video", thumbnail: "/advanced-urban-systems.jpg", duration: "18 min", description: "Complex interactions between infrastructure, economy, and environment." },
      { id: "2", title: "Smart City Technologies", type: "pdf", thumbnail: "/smart-city-tech.png", description: "IoT, AI, and data-driven urban management." },
      { id: "3", title: "Policy & Governance", type: "video", thumbnail: "/policy-governance.jpg", duration: "15 min", description: "How urban policies shape sustainable development." },
    ],
  }

  const objectives = [
    "Build housing for 5,000 residents",
    "Ensure 90% green energy coverage",
    "Create flood protection systems",
    "Maintain budget under $10,000",
  ]

  useEffect(() => setMounted(true), [])

  const handleGridClick = (x: number, y: number) => {
    if (!selectedTool) return
    const tool = buildingTools.find((t) => t.id === selectedTool)
    if (!tool || budget < tool.cost) return

    setPlacedBuildings(prev => [...prev, { id: `${selectedTool}-${Date.now()}`, toolId: selectedTool, x, y, name: tool.name, icon: tool.icon, color: tool.color }])
    setBudget(prev => prev - tool.cost)
    setSelectedTool(null)
  }

  const runSimulation = () => {
    setShowSimulation(true)
    setTimeout(() => {
      const buildings = placedBuildings.length
      const greenSpaces = placedBuildings.filter(b => b.toolId === "green").length
      const services = placedBuildings.filter(b => ["hospital","school"].includes(b.toolId)).length
      const emergency = placedBuildings.filter(b => ["flood","shelter"].includes(b.toolId)).length

      setSimulationScore({
        access: Math.min(100, services*25 + buildings*2),
        sustainability: Math.min(100, greenSpaces*30 + buildings*1),
        resilience: Math.min(100, emergency*35 + buildings*2),
        equity: Math.min(100, (services + greenSpaces)*15 + buildings*3),
      })
    }, 1000)
  }

  const startAgain = () => { setPlacedBuildings([]); setBudget(10000); setSelectedTool(null); setShowSimulation(false) }
  const exportReport = () => { alert("Generating city report... This would create a PDF with your design and scores!") }

  if(!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="relative z-20 pt-20 min-h-screen container mx-auto px-6">

        <h1 className="text-4xl font-bold text-[#3b53f9] text-center mb-8">Student Learning Hub</h1>

        {/* MAIN MENU */}
        {gameMode===null && <div className="flex justify-center mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <button onClick={() => {setShowGradeLevels(true); setGameMode("learning")}} className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-left">
              <h2 className="text-2xl font-bold text-[#3b53f9] mb-2">Learning Materials</h2>
              <p className="text-white mb-2">Educational content tailored for pre-school, middle-school, and high-school learners.</p>
              <p className="text-white text-sm">Explore videos, games, and guides to learn about sustainable cities.</p>
            </button>
            <button onClick={() => {setShowGradeLevels(false); setGameMode("building")}} className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-left">
              <h2 className="text-2xl font-bold text-[#3b53f9] mb-2">City Builder Game</h2>
              <p className="text-white mb-2">Build and simulate your own city while learning about sustainability and planning.</p>
              <p className="text-white text-sm">Manage budget, infrastructure, and environment to create a thriving city.</p>
            </button>
          </div>
        </div>}

        {/* LEARNING MODE */}
        {gameMode==="learning" && showGradeLevels && <>
          <div className="flex justify-center mb-6">
            <button onClick={()=>setGameMode(null)} className="text-[#3b53f9] hover:text-white transition-colors flex items-center space-x-2">
              <span>←</span><span>Back to Main Menu</span>
            </button>
          </div>
          <div className="flex justify-center mb-8">
            <div className="flex bg-black/50 rounded-lg p-1 border border-[#00F0FF]/30">
              {(["pre-school","middle-school","high-school"] as const).map(tab => (
                <button key={tab} onClick={()=>setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md ${activeTab===tab ? "bg-gray-800 text-white font-semibold" : "text-white"}`}>
                  {tab.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ")}
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningMaterials[activeTab].map(material=>(
              <div key={material.id} className="p-6 rounded-lg border border-white/10 bg-gray-800">
                <img src={material.thumbnail} alt={material.title} className="w-full h-32 object-cover rounded border border-white/20 mb-4"/>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{material.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${material.type==="video"?"bg-red-500/20 text-red-400 border border-red-500/30":material.type==="pdf"?"bg-blue-500/20 text-blue-400 border border-blue-500/30":"bg-green-500/20 text-green-400 border border-green-500/30"}`}>
                    {material.type.toUpperCase()}
                  </span>
                </div>
                {material.duration && <p className="text-sm text-[#3b53f9] mb-2">⏱️ {material.duration}</p>}
                <p className="text-sm text-white/70 mb-4">{material.description}</p>
                <Button className="w-full bg-[#3b53f9] hover:bg-[#2d41c7] text-white font-semibold transition-all">
                  {material.type==="video"?"▶️ Watch":material.type==="pdf"?"📖 Read":"🎮 Play"}
                </Button>
              </div>
            ))}
          </div>
        </>}

        {/* CITY BUILDER GAME */}
        {gameMode==="building" && <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-6">
            <button onClick={()=>setGameMode(null)} className="text-[#3b53f9] hover:text-white transition-colors flex items-center space-x-2">
              <span>←</span><span>Back to Main Menu</span>
            </button>
          </div>
          <div className="flex gap-6">
            {/* Game Area */}
            <div className="flex-1">
              {/* Budget & Objectives */}
              <div className="p-4 mb-6 rounded-lg border border-white/10 bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-white">💰 Budget: ${budget.toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button onClick={runSimulation} disabled={placedBuildings.length===0} className="bg-[#3b53f9] text-white font-semibold shadow-lg hover:shadow-xl transition-all">🚀 Run Simulation</Button>
                    <Button onClick={startAgain} className="bg-white text-black font-semibold shadow-lg hover:shadow-xl transition-all">🔄 Start Again</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {objectives.map((o,i)=><div key={i} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#9B59FF] rounded-full"></div>
                    <span className="text-white">{o}</span>
                  </div>)}
                </div>
              </div>
              {/* Building Grid */}
              <div className="p-6 rounded-lg border border-white/10">
                <div className="grid grid-cols-12 gap-1 aspect-square max-w-2xl mx-auto">
                  {Array.from({length:144},(_,i)=>{
                    const x=i%12, y=Math.floor(i/12)
                    const building=placedBuildings.find(b=>b.x===x&&b.y===y)
                    return (
                      <div key={i} onClick={()=>handleGridClick(x,y)}
                        className={`aspect-square border border-white/20 rounded cursor-pointer flex items-center justify-center text-lg ${selectedTool&&!building?"bg-[#3b53f9]/10":""}`}
                        style={{backgroundColor: building?`${building.color}40`:undefined,borderColor:building?building.color:undefined}}>
                        {building&&<span>{building.icon}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* Toolbox */}
            <div className="w-80 p-6 rounded-lg border border-white/10 bg-gray-800">
              <h3 className="text-xl font-bold text-[#3b53f9] mb-4">🛠️ Building Tools</h3>
              <div className="grid grid-cols-2 gap-3">
                {buildingTools.map(tool=>(
                  <button key={tool.id} onClick={()=>setSelectedTool(selectedTool===tool.id?null:tool.id)} disabled={budget<tool.cost}
                    className={`p-3 rounded border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedTool===tool.id?"border-[#3b53f9] bg-[#3b53f9]/20 shadow-lg":"border-white/20 hover:border-white/40 hover:bg-white/5"}`}>
                    <div className="text-2xl mb-1">{tool.icon}</div>
                    <div className="text-xs font-semibold text-white">{tool.name}</div>
                    <div className="text-xs text-white">${tool.cost}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>}

        {/* Simulation Modal */}
        {showSimulation && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="p-8 max-w-2xl w-full mx-4 rounded-lg border border-white/20 bg-gray-800">
            <h3 className="text-2xl font-bold text-[#3b53f9] text-center mb-8">🏆 City Simulation Results</h3>
            <div className="space-y-4 mb-8">
              {Object.entries(simulationScore).map(([key,value])=><div key={key} className="flex items-center justify-between">
                <span className="text-white capitalize">{key}</span>
                <div className="flex-1 mx-4 h-3 bg-white/10 rounded">
                  <div className="h-3 rounded bg-[#3b53f9]" style={{width:`${value}%`}}></div>
                </div>
                <span className="text-white">{value}%</span>
              </div>)}
            </div>
            <div className="flex justify-between">
              <Button onClick={()=>setShowSimulation(false)} className="bg-[#3b53f9] text-white font-semibold shadow-lg hover:shadow-xl transition-all">Close</Button>
              <Button onClick={exportReport} className="bg-[#3b53f9] text-white font-semibold shadow-lg hover:shadow-xl transition-all">Export Report</Button>
            </div>
          </div>
        </div>}

      </div>
    </div>
  )
}
