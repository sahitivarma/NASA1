"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PlannerMap from "./PlannerMap"

interface Hazard {
  id: string
  type: "tsunami" | "volcano" | "tornado" | "wildfire" | "flood" | "drought" | "earthquake"
  name: string
  icon: string
  lat: number
  lng: number
  severity: "low" | "medium" | "high" | "critical"
  riskLevel: number
  active: boolean
}

interface Prediction {
  day: string
  risk: number
  event: string
}

interface InfrastructureLayer {
  id: string
  type: "road" | "building" | "bridge"
  active: boolean
  coordinates?: [number, number][]
  name?: string
}

interface DarkZone {
  id: string
  lat: number
  lng: number
  radius?: number
}

export default function DisasterCommand() {
  const [mounted, setMounted] = useState(false)
  const [radarSweep, setRadarSweep] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const [hazards] = useState<Hazard[]>([
    { id: "tsunami1", type: "tsunami", name: "Pacific Tsunami Zone", icon: "🌊", lat: 15, lng: 25, severity: "high", riskLevel: 85, active: true },
    { id: "volcano1", type: "volcano", name: "Mount Vesuvius", icon: "🌋", lat: 45, lng: 35, severity: "critical", riskLevel: 92, active: true },
    { id: "tornado1", type: "tornado", name: "Tornado Alley", icon: "🌪️", lat: 70, lng: 20, severity: "medium", riskLevel: 67, active: false },
    { id: "wildfire1", type: "wildfire", name: "California Wildfire", icon: "🔥", lat: 25, lng: 60, severity: "high", riskLevel: 78, active: true },
    { id: "flood1", type: "flood", name: "Mississippi Flood Zone", icon: "🌧️", lat: 60, lng: 70, severity: "medium", riskLevel: 54, active: false },
    { id: "drought1", type: "drought", name: "Southwest Drought", icon: "🌵", lat: 80, lng: 55, severity: "high", riskLevel: 73, active: true },
    { id: "earthquake1", type: "earthquake", name: "San Andreas Fault", icon: "🌎", lat: 35, lng: 80, severity: "critical", riskLevel: 89, active: true },
  ])

  const [predictions] = useState<Prediction[]>([
    { day: "Today", risk: 85, event: "Seismic Activity" },
    { day: "Tomorrow", risk: 67, event: "High Winds" },
    { day: "Day 3", risk: 92, event: "Volcanic Activity" },
    { day: "Day 4", risk: 45, event: "Flood Risk" },
    { day: "Day 5", risk: 78, event: "Fire Weather" },
    { day: "Day 6", risk: 34, event: "Storm System" },
    { day: "Day 7", risk: 56, event: "Drought Conditions" },
  ])

  const [infrastructureLayers] = useState<InfrastructureLayer[]>([
    { id: "road1", type: "road", active: true, coordinates: [[15,25],[20,30],[25,35]] },
    { id: "building1", type: "building", active: true, coordinates: [[45,35]] , name: "Vesuvius HQ"},
    { id: "bridge1", type: "bridge", active: false, coordinates: [[60,70],[65,75]] },
  ])

  const [darkZones] = useState<DarkZone[]>([
    { id: "tsunami-zone", lat: 15, lng: 25, radius: 500000 },
    { id: "volcano-zone", lat: 45, lng: 35, radius: 300000 },
  ])

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setRadarSweep(prev => (prev + 1) % 360), 50)
    return () => clearInterval(interval)
  }, [])

  const getRiskBarColor = (risk: number) => {
    if (risk > 70) return "#dc2626"
    if (risk > 50) return "#f59e0b"
    return "#22c55e"
  }

  const searchCity = () => alert(`Searching for: ${searchQuery}`)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* PlannerMap Background */}
      <div className="absolute inset-0 z-0">
        <PlannerMap
          hazards={hazards}
          darkZones={darkZones}
          infrastructureLayers={infrastructureLayers}
        />
      </div>

      {/* Search Bar */}
      <div className="absolute top-20 right-96 z-40">
        <div className="flex items-center bg-white rounded-lg py-2 px-3 shadow-md w-72">
          <input
            type="text"
            placeholder="Search location..."
            className="bg-white outline-none text-black placeholder-gray-400 text-sm flex-1"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={e => { if(e.key === "Enter") searchCity() }}
          />
          <button onClick={searchCity} className="ml-2 text-black text-lg">🔍</button>
        </div>
      </div>

      {/* Radar Overlay */}
      <div className="absolute top-24 left-4 w-32 h-32 z-10 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full border-2 border-blue-600/40"></div>
          <div className="absolute inset-1 rounded-full border border-blue-600/30"></div>
          <div className="absolute inset-2 rounded-full border border-blue-600/20"></div>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${radarSweep}deg, transparent 0deg, #3b53f9 25deg, transparent 50deg)`,
            }}
          ></div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-96 bg-black/95 backdrop-blur-sm border-l border-blue-900/50 p-6 overflow-y-auto absolute right-0 top-0 h-full z-30">
        <style jsx>{`
          div::-webkit-scrollbar { width:6px; }
          div::-webkit-scrollbar-track { background:transparent; }
          div::-webkit-scrollbar-thumb { background-color:#ffffff; border-radius:9999px; }
        `}</style>

        <h2 className="text-xl font-bold mb-6" style={{ color: "#3b53f9" }}>Disaster Operations Control</h2>

        {/* Live Risk Levels */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#3b53f9" }}>Live Risk Levels</h3>
          <div className="space-y-3">
            {hazards.filter(h => h.active).map(hazard => (
              <div key={hazard.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#3b53f6" }}></div>
                  <span className="text-sm text-white">{hazard.type.charAt(0).toUpperCase()+hazard.type.slice(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-800 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${hazard.riskLevel}%`, backgroundColor: getRiskBarColor(hazard.riskLevel)}}></div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: getRiskBarColor(hazard.riskLevel)}}>{hazard.riskLevel}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Predictions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#3b53f9" }}>AI Predictions (7 Days)</h3>
          <div className="space-y-2">
            {predictions.map((pred, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-800">
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-white w-16">{pred.day}</span>
                  <span className="text-sm text-white">{pred.event}</span>
                </div>
                <div className="text-xs font-bold px-2 py-1 rounded" style={{ color: getRiskBarColor(pred.risk)}}>{pred.risk}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Protective Measures */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#3b53f9" }}>Protective Measures</h3>
          <div className="space-y-2 text-sm">
            {[
              "Tsunami Barriers",
              "Evacuation Routes",
              "Fire Breaks",
              "Flood Barriers",
              "Stay Informed",
              "Emergency Kit",
              "Safe Zones",
              "Communication"
            ].map((measure, idx) => (
              <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                <div className="font-semibold text-white mb-1">{measure}</div>
                <div className="text-white text-xs">Description of {measure.toLowerCase()} goes here.</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
