"use client"

interface Hazard {
  id: string
  type: "tsunami" | "volcano" | "tornado" | "wildfire" | "```tsx file=\"app/disaster-command/page.tsx"
"use client"
\
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

  const [hazards] = useState<Hazard[]>([
    {
      id: "tsunami1",
      type: "tsunami",
      name: "Pacific Tsunami Zone",
      icon: "🌊",
      x: 15,
      y: 25,
      severity: "high",
      riskLevel: 85,
      active: true,
    },
    {
      id: "volcano1",
      type: "volcano",
      name: "Mount Vesuvius",
      icon: "🌋",
      x: 45,
      y: 35,
      severity: "critical",
      riskLevel: 92,
      active: true,
    },
    {
      id: "tornado1",
      type: "tornado",
      name: "Tornado Alley",
      icon: "🌪️",
      x: 70,
      y: 20,
      severity: "medium",
      riskLevel: 67,
      active: false,
    },
    {
      id: "wildfire1",
      type: "wildfire",
      name: "California Wildfire",
      icon: "🔥",
      x: 25,
      y: 60,
      severity: "high",
      riskLevel: 78,
      active: true,
    },
    {
      id: "flood1",
      type: "flood",
      name: "Mississippi Flood Zone",
      icon: "🌧️",
      x: 60,
      y: 70,
      severity: "medium",
      riskLevel: 54,
      active: false,
    },
    {
      id: "drought1",
      type: "drought",
      name: "Southwest Drought",
      icon: "🌵",
      x: 80,
      y: 55,
      severity: "high",
      riskLevel: 73,
      active: true,
    },
    {
      id: "earthquake1",
      type: "earthquake",
      name: "San Andreas Fault",
      icon: "🌎",
      x: 35,
      y: 80,
      severity: "critical",
      riskLevel: 89,
      active: true,
    },
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

    // Radar sweep animation
    const interval = setInterval(() => {
      setRadarSweep((prev) => (prev + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#dc2626"
      case "high":
        return "#ea580c"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#eab308"
      default:
        return "#64748b"
    }
  }

  const getHazardColor = (type: string) => {
    switch (type) {
      case "tsunami":
        return "#06b6d4"
      case "volcano":
        return "#dc2626"
      case "tornado":
        return "#8b5cf6"
      case "wildfire":
        return "#ea580c"
      case "flood":
        return "#3b82f6"
      case "drought":
        return "#f59e0b"
      case "earthquake":
        return "#ef4444"
      default:
        return "#64748b"
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hex Grid Background */}
      <div className="absolute inset-0 z-0 hex-grid opacity-20"></div>

      {/* Main Content */}
      <div className="relative z-20 h-screen flex pt-16">
        {/* Main Map Area */}
        <div className="flex-1 relative">
          <div className="w-full h-full relative bg-gray-900/30 border border-blue-900/50">
            {/* Radar Sweep */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 rounded-full border-2 border-blue-600/40"></div>
                <div className="absolute inset-4 rounded-full border border-blue-600/30"></div>
                <div className="absolute inset-8 rounded-full border border-blue-600/20"></div>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${radarSweep}deg, transparent 0deg, rgba(59, 130, 246, 0.4) 30deg, transparent 60deg)`,
                  }}
                ></div>
              </div>
            </div>

            {/* Hazard Icons */}
            {hazards.map((hazard) => (
              <div
                key={hazard.id}
                className="absolute cursor-pointer transition-all hover:scale-125"
                style={{
                  left: `${hazard.x}%`,
                  top: `${hazard.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => setSelectedHazard(hazard)}
              >
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    hazard.active ? "animate-pulse" : ""
                  }`}
                  style={{
                    backgroundColor: `${getHazardColor(hazard.type)}20`,
                    border: `2px solid ${getHazardColor(hazard.type)}`,
                    boxShadow: `0 0 20px ${getHazardColor(hazard.type)}60`,
                  }}
                >
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: getHazardColor(hazard.type) }}></div>
                  {hazard.active && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        backgroundColor: `${getHazardColor(hazard.type)}40`,
                      }}
                    ></div>
                  )}
                </div>

                {/* Earthquake Shockwave Rings */}
                {hazard.type === "earthquake" && hazard.active && (
                  <>
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        width: "100px",
                        height: "100px",
                        left: "-44px",
                        top: "-44px",
                        border: `2px solid ${getHazardColor(hazard.type)}60`,
                        animationDuration: "2s",
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        width: "150px",
                        height: "150px",
                        left: "-69px",
                        top: "-69px",
                        border: `1px solid ${getHazardColor(hazard.type)}40`,
                        animationDuration: "3s",
                        animationDelay: "0.5s",
                      }}
                    ></div>
                  </>
                )}

                {/* Wildfire Spread Animation */}
                {hazard.type === "wildfire" && hazard.active && (
                  <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      width: "80px",
                      height: "80px",
                      left: "-34px",
                      top: "-34px",
                      background: `radial-gradient(circle, ${getHazardColor(hazard.type)}30 0%, transparent 70%)`,
                    }}
                  ></div>
                )}

                {/* Flood Overlay */}
                {hazard.type === "flood" && hazard.active && (
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                      width: "120px",
                      height: "60px",
                      left: "-54px",
                      top: "-24px",
                      background: `linear-gradient(90deg, transparent, ${getHazardColor(hazard.type)}40, transparent)`,
                      borderRadius: "50%",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Dashboard */}
        <div className="w-96 bg-black/95 backdrop-blur-sm border-l border-blue-900/50 p-6">
          <h2 className="text-xl font-bold text-blue-300 mb-6">Disaster Operations Control</h2>

          {/* Live Risk Levels */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-200">Live Risk Levels</h3>
            <div className="space-y-3">
              {hazards
                .filter((h) => h.active)
                .map((hazard) => (
                  <div key={hazard.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getHazardColor(hazard.type) }}
                      ></div>
                      <span className="text-sm text-gray-300">
                        {hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-800 rounded-full h-2">
                        <div
                          className="h-2 rounded-full animate-pulse"
                          style={{
                            width: `${hazard.riskLevel}%`,
                            backgroundColor: getSeverityColor(hazard.severity),
                            boxShadow: `0 0 10px ${getSeverityColor(hazard.severity)}`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold" style={{ color: getSeverityColor(hazard.severity) }}>
                        {hazard.riskLevel}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* AI Predictions Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-200">AI Predictions (7 Days)</h3>
            <div className="space-y-2">
              {predictions.map((pred, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-gray-900/50 border border-blue-800/50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400 w-16">{pred.day}</span>
                    <span className="text-sm text-gray-300">{pred.event}</span>
                  </div>
                  <div
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{
                      backgroundColor: `${pred.risk > 70 ? "#dc2626" : pred.risk > 50 ? "#f59e0b" : "#22c55e"}20`,
                      color: pred.risk > 70 ? "#dc2626" : pred.risk > 50 ? "#f59e0b" : "#22c55e",
                    }}
                  >
                    {pred.risk}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Protective Measures */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-200">Protective Measures</h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-gray-900/50 rounded border border-blue-700/50">
                <div className="font-semibold text-blue-300 mb-1">Tsunami Barriers</div>
                <div className="text-gray-400 text-xs">Deploy 15m seawalls along coastline</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded border border-red-700/50">
                <div className="font-semibold text-red-400 mb-1">Evacuation Routes</div>
                <div className="text-gray-400 text-xs">Establish 3 emergency corridors</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded border border-orange-700/50">
                <div className="font-semibold text-orange-400 mb-1">Fire Breaks</div>
                <div className="text-gray-400 text-xs">Create 500m defensible spaces</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded border border-blue-700/50">
                <div className="font-semibold text-blue-300 mb-1">Flood Barriers</div>
                <div className="text-gray-400 text-xs">Install levees and drainage systems</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Hazard Modal */}
      {selectedHazard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm border border-blue-800/50 rounded-lg p-6 max-w-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: getHazardColor(selectedHazard.type) }}
              ></div>
              <div>
                <h3 className="text-xl font-bold text-blue-300">{selectedHazard.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{selectedHazard.type} Event</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Risk Level:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-800 rounded-full h-3">
                    <div
                      className="h-3 rounded-full animate-pulse"
                      style={{
                        width: `${selectedHazard.riskLevel}%`,
                        backgroundColor: getSeverityColor(selectedHazard.severity),
                        boxShadow: `0 0 15px ${getSeverityColor(selectedHazard.severity)}`,
                      }}
                    ></div>
                  </div>
                  <span className="font-bold" style={{ color: getSeverityColor(selectedHazard.severity) }}>
                    {selectedHazard.riskLevel}%
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-900/50 rounded border border-blue-700/50">
                <h4 className="font-semibold text-blue-300 mb-2">Recommended Actions:</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  {selectedHazard.type === "tsunami" && (
                    <>
                      <li>• Deploy tsunami warning systems</li>
                      <li>• Evacuate coastal areas within 2km</li>
                      <li>• Activate emergency shelters</li>
                      <li>• Estimated impact: 45,000 people</li>
                    </>
                  )}
                  {selectedHazard.type === "volcano" && (
                    <>
                      <li>• Monitor seismic activity 24/7</li>
                      <li>• Establish 10km exclusion zone</li>
                      <li>• Prepare ash fall mitigation</li>
                      <li>• Estimated impact: 120,000 people</li>
                    </>
                  )}
                  {selectedHazard.type === "wildfire" && (
                    <>
                      <li>• Deploy fire suppression aircraft</li>
                      <li>• Create firebreaks and defensible space</li>
                      <li>• Evacuate high-risk neighborhoods</li>
                      <li>• Estimated impact: 25,000 people</li>
                    </>
                  )}
                  {selectedHazard.type === "earthquake" && (
                    <>
                      <li>• Activate early warning systems</li>
                      <li>• Inspect critical infrastructure</li>
                      <li>• Deploy search and rescue teams</li>
                      <li>• Estimated impact: 200,000 people</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
                  onClick={() => alert(`Activating emergency protocols for ${selectedHazard.name}...`)}
                >
                  Activate Protocols
                </Button>
                <Button
                  onClick={() => setSelectedHazard(null)}
                  className="bg-red-900/30 hover:bg-red-800/40 border border-red-700/50 text-red-400"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
