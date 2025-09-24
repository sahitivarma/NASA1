"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Hazard {
  id: string
  type: "tsunami" | "volcano" | "tornado" | "wildfire" | "flood" | "drought" | "earthquake"
  name: string
  icon: string
  x: number
  y: number
  severity: "low" | "medium" | "high" | "critical"
  riskLevel: number
  active: boolean
}

interface Prediction {
  day: string
  risk: number
  event: string
}

export default function DisasterCommand() {
  const [mounted, setMounted] = useState(false)
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null)
  const [radarSweep, setRadarSweep] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const [hazards] = useState<Hazard[]>([
    { id: "tsunami1", type: "tsunami", name: "Pacific Tsunami Zone", icon: "🌊", x: 15, y: 25, severity: "high", riskLevel: 85, active: true },
    { id: "volcano1", type: "volcano", name: "Mount Vesuvius", icon: "🌋", x: 45, y: 35, severity: "critical", riskLevel: 92, active: true },
    { id: "tornado1", type: "tornado", name: "Tornado Alley", icon: "🌪️", x: 70, y: 20, severity: "medium", riskLevel: 67, active: false },
    { id: "wildfire1", type: "wildfire", name: "California Wildfire", icon: "🔥", x: 25, y: 60, severity: "high", riskLevel: 78, active: true },
    { id: "flood1", type: "flood", name: "Mississippi Flood Zone", icon: "🌧️", x: 60, y: 70, severity: "medium", riskLevel: 54, active: false },
    { id: "drought1", type: "drought", name: "Southwest Drought", icon: "🌵", x: 80, y: 55, severity: "high", riskLevel: 73, active: true },
    { id: "earthquake1", type: "earthquake", name: "San Andreas Fault", icon: "🌎", x: 35, y: 80, severity: "critical", riskLevel: 89, active: true },
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

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setRadarSweep((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "#dc2626"
      case "high": return "#ea580c"
      case "medium": return "#f59e0b"
      case "low": return "#22c55e"
      default: return "#64748b"
    }
  }

  const getHazardColor = (type: string) => {
    switch (type) {
      case "tsunami": return "#06b6d4"
      case "volcano": return "#dc2626"
      case "tornado": return "#8b5cf6"
      case "wildfire": return "#ea580c"
      case "flood": return "#3b82f6"
      case "drought": return "#f59e0b"
      case "earthquake": return "#ef4444"
      default: return "#64748b"
    }
  }

  const getRiskBarColor = (risk: number) => {
    if (risk > 70) return "#dc2626" // red
    if (risk > 50) return "#f59e0b" // orange
    return "#22c55e" // green
  }

  const searchCity = () => {
    alert(`Searching for: ${searchQuery}`)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 hex-grid opacity-20"></div>

      {/* Search Bar */}
      <div className="absolute top-20 right-96 z-40">
        <div className="flex items-center bg-white rounded-lg py-2 px-3 shadow-md w-72">
          <input
            type="text"
            placeholder="Search location..."
            className="bg-white outline-none text-black placeholder-gray-400 text-sm flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => { if (e.key === "Enter") searchCity() }}
          />
          <button
            onClick={searchCity}
            className="ml-2 text-black text-lg"
          >
            🔍
          </button>
        </div>
      </div>

      <div className="relative z-20 h-screen flex pt-16">
        {/* Main Map */}
        <div className="flex-1 relative">
          <div className="w-full h-full relative bg-gray-900/30 border border-blue-900/50">
            {/* Radar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 rounded-full border-2 border-blue-600/40"></div>
                <div className="absolute inset-4 rounded-full border border-blue-600/30"></div>
                <div className="absolute inset-8 rounded-full border border-blue-600/20"></div>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${radarSweep}deg, transparent 0deg, #3b53f9 30deg, transparent 60deg)`,
                  }}
                ></div>
              </div>
            </div>

            {/* Hazards */}
            {hazards.map((hazard) => (
              <div
                key={hazard.id}
                className="absolute cursor-pointer transition-all hover:scale-125"
                style={{ left: `${hazard.x}%`, top: `${hazard.y}%`, transform: "translate(-50%, -50%)" }}
                onClick={() => setSelectedHazard(hazard)}
              >
                <div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${getHazardColor(hazard.type)}20`,
                    border: `2px solid ${getHazardColor(hazard.type)}`,
                    boxShadow: `0 0 20px ${getHazardColor(hazard.type)}60`,
                  }}
                >
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: getHazardColor(hazard.type) }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div
          className="w-96 bg-black/95 backdrop-blur-sm border-l border-blue-900/50 p-6 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#ffffff transparent",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background-color: #ffffff;
              border-radius: 9999px;
            }
          `}</style>

          <h2 className="text-xl font-bold mb-6" style={{ color: "#3b53f9" }}>Disaster Operations Control</h2>

          {/* Live Risk Levels */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#3b53f9" }}>Live Risk Levels</h3>
            <div className="space-y-3">
              {hazards.filter(h => h.active).map(hazard => (
                <div key={hazard.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getHazardColor(hazard.type) }}></div>
                    <span className="text-sm text-white">{hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-800 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${hazard.riskLevel}%`, backgroundColor: getRiskBarColor(hazard.riskLevel) }}></div>
                    </div>
                    <span className="text-xs font-bold" style={{ color: getRiskBarColor(hazard.riskLevel) }}>{hazard.riskLevel}%</span>
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
                  <div className="text-xs font-bold px-2 py-1 rounded" style={{ color: getRiskBarColor(pred.risk) }}>{pred.risk}%</div>
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

      {/* Selected Hazard Modal */}
      {selectedHazard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Modal content unchanged */}
        </div>
      )}
    </div>
  )
}
