"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PlannerMap, { DarkZone, InfrastructureLayer } from "./PlannerMap"

export default function UrbanPlannerPage() {
  const [mounted, setMounted] = useState(false)
  const [showImpactToggle, setShowImpactToggle] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Infrastructure Layers
  const [infrastructureLayers, setInfrastructureLayers] = useState<InfrastructureLayer[]>([
    { id: "roads", name: "Road Network", type: "existing", active: true, color: "#64748b" },
    { id: "schools", name: "Schools", type: "existing", active: true, color: "#22c55e" },
    { id: "hospitals", name: "Hospitals", type: "existing", active: true, color: "#ef4444" },
    { id: "new-roads", name: "Proposed Roads", type: "proposed", active: false, color: "#00f0ff" },
    { id: "new-schools", name: "Proposed Schools", type: "proposed", active: false, color: "#10b981" },
    { id: "new-hospitals", name: "Proposed Hospitals", type: "proposed", active: false, color: "#f87171" },
  ])

  // Dark zones
  const [darkZonesPercent] = useState([
    { id: "zone1", x: 20, y: 30, size: 300, severity: "high" },
    { id: "zone2", x: 60, y: 15, size: 250, severity: "medium" },
    { id: "zone3", x: 75, y: 70, size: 200, severity: "low" },
    { id: "zone4", x: 15, y: 80, size: 280, severity: "high" },
    { id: "zone5", x: 85, y: 45, size: 220, severity: "medium" },
  ])

  // Scattered positions for schools/hospitals
  const [fixedPositions] = useState(() => ({
    "new-schools": [
      { lat: 17.386, lng: 78.486 },
      { lat: 17.387, lng: 78.488 },
      { lat: 17.388, lng: 78.484 },
      { lat: 17.385, lng: 78.490 },
    ],
    "new-hospitals": [
      { lat: 17.389, lng: 78.489 },
      { lat: 17.391, lng: 78.492 },
      { lat: 17.392, lng: 78.487 },
      { lat: 17.387, lng: 78.493 },
    ],
    "schools": [
      { lat: 17.386, lng: 78.487 },
      { lat: 17.388, lng: 78.485 },
    ],
    "hospitals": [
      { lat: 17.389, lng: 78.488 },
      { lat: 17.391, lng: 78.486 },
    ],
  }))

  useEffect(() => setMounted(true), [])

  const toggleLayer = (id: string) => {
    setInfrastructureLayers(prev =>
      prev.map(layer => (layer.id === id ? { ...layer, active: !layer.active } : layer))
    )
  }

  const generateRecommendations = () => {
    alert("Generating Zoning Recommendations based on current analysis...")
  }

  const searchCity = () => {
    alert(`Searching for city: ${searchQuery}`)
  }

  if (!mounted) return null

  // Convert percent x/y to lat/lng for Leaflet
  const darkZones: DarkZone[] = darkZonesPercent.map(zone => ({
    id: zone.id,
    lat: 17.385044 + (zone.y - 50) * 0.0015,
    lng: 78.486671 + (zone.x - 50) * 0.0015,
    size: zone.size,
    severity: zone.severity as "low" | "medium" | "high",
  }))

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 blueprint-grid opacity-20"></div>

      {/* Search + Impact Box */}
      <div className="absolute top-20 right-6 z-40 space-y-3">
        <div className="flex items-center bg-white rounded-lg py-1.5 px-3 text-black shadow-md">
          <input
            type="text"
            placeholder="Search location..."
            className="bg-transparent outline-none text-black placeholder-gray-500 text-sm w-60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => { if (e.key === "Enter") searchCity() }}
          />
          <span className="ml-2 text-black text-lg flex items-center">🔍</span>
        </div>

        {showImpactToggle && (
          <div className="bg-gray-800 border border-blue-600 rounded-lg p-3 shadow-md text-sm w-72">
            <p className="font-semibold mb-1" style={{ color: "#3b53f9" }}>Development Impact</p>
            <p className="text-white">
              Proposed infrastructure positively impacts <span className="text-green-400 font-bold">12,500 people</span>.<br/>
              Estimated access to healthcare ↑ <span className="text-green-400 font-bold">18%</span>, education ↑ <span className="text-green-400 font-bold">25%</span>.
            </p>
          </div>
        )}
      </div>

      <div className="relative z-20 flex w-full pt-16">
        {/* Left Panel */}
        <div className="w-96 bg-black/95 backdrop-blur-sm border-r border-blue-900/50 p-6 h-[calc(100vh-4rem)] flex flex-col pt-6">
          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#00F0FF rgba(0,0,0,0.2)" }}>
            <style>{`
              ::-webkit-scrollbar { width: 6px; }
              ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
              ::-webkit-scrollbar-thumb { background-color: #00F0FF; border-radius: 3px; }
              ::-webkit-scrollbar-thumb:hover { background-color: #22c55e; }
            `}</style>
            <h2 className="text-xl font-bold mb-6" style={{ color: "#3b53f9" }}>Urban Planning Console</h2>

            {/* Infrastructure Layers */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#3b53f9" }}>Infrastructure Layers</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {infrastructureLayers.map(layer => (
                  <div key={layer.id} className="flex items-center justify-between">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={layer.active} onChange={() => toggleLayer(layer.id)} className="sr-only"/>
                      <div className={`w-4 h-4 rounded border-2 transition-all ${layer.active ? "bg-current border-current" : "border-gray-600"}`} style={{ color: layer.color }}></div>
                      <span className="text-sm text-white">{layer.name}</span>
                    </label>
                    <span className={`text-xs px-2 py-1 rounded ${layer.type === "existing" ? "bg-gray-800/50 text-white" : "bg-blue-900/30 text-white"}`}>{layer.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nightlight Analysis */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#3b53f9" }}>Nightlight Analysis</h3>
              <div className="bg-gray-700 border border-gray-600 rounded p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white">Electricity Coverage</span>
                  <span className="text-white font-bold">{`67%`}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
                  <div
                    className="h-2 rounded-full shadow-lg"
                    style={{ width: "67%", backgroundColor: "#3b53f9" }}
                  ></div>
                </div>
                <div className="text-xs text-white">
                  <div className="flex justify-between mb-1">
                    <span>Dark Zones Detected:</span>
                    <span className="text-red-400">{darkZones.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recommended Microgrids:</span>
                    <span className="text-green-400">3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Development Impact Toggle */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={showImpactToggle} onChange={(e) => setShowImpactToggle(e.target.checked)} className="sr-only"/>
                <div className={`w-12 h-6 rounded-full border-2 transition-all relative ${showImpactToggle ? "bg-blue-900/30 border-blue-600 shadow-lg" : "border-gray-600"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${showImpactToggle ? "translate-x-6" : "translate-x-0.5"}`}></div>
                </div>
                <span className="text-sm text-gray-300">Development Impact</span>
              </label>
            </div>

            <div className="mt-4">
              <Button onClick={generateRecommendations} className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                Generate Zoning Recommendations
              </Button>
            </div>
          </div>
        </div>

        {/* Planner Map */}
        <div className="flex-1 h-[calc(100vh-4rem)]">
          <PlannerMap darkZones={darkZones} infrastructureLayers={infrastructureLayers} fixedPositions={fixedPositions}/>
        </div>
      </div>
    </div>
  )
}
