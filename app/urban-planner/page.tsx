"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface InfrastructureLayer {
  id: string
  name: string
  type: "existing" | "proposed"
  active: boolean
  color: string
}

interface DarkZone {
  id: string
  x: number
  y: number
  size: number
  severity: "low" | "medium" | "high"
}

export default function UrbanPlanner() {
  const [mounted, setMounted] = useState(false)
  const [showImpactToggle, setShowImpactToggle] = useState(false)
  const [selectedZone, setSelectedZone] = useState<DarkZone | null>(null)

  const [infrastructureLayers, setInfrastructureLayers] = useState<InfrastructureLayer[]>([
    { id: "roads", name: "Road Network", type: "existing", active: true, color: "#64748b" },
    { id: "power", name: "Power Grid", type: "existing", active: true, color: "#f59e0b" },
    { id: "water", name: "Water Systems", type: "existing", active: true, color: "#06b6d4" },
    { id: "schools", name: "Schools", type: "existing", active: true, color: "#22c55e" },
    { id: "hospitals", name: "Hospitals", type: "existing", active: true, color: "#ef4444" },
    { id: "new-roads", name: "Proposed Roads", type: "proposed", active: false, color: "#00f0ff" },
    { id: "new-power", name: "Solar Microgrids", type: "proposed", active: false, color: "#9b59ff" },
    { id: "new-water", name: "Water Treatment", type: "proposed", active: false, color: "#22c55e" },
    { id: "new-schools", name: "Proposed Schools", type: "proposed", active: false, color: "#10b981" },
    { id: "new-hospitals", name: "Proposed Hospitals", type: "proposed", active: false, color: "#f87171" },
  ])

  const [darkZones] = useState<DarkZone[]>([
    { id: "zone1", x: 20, y: 30, size: 80, severity: "high" },
    { id: "zone2", x: 60, y: 15, size: 60, severity: "medium" },
    { id: "zone3", x: 75, y: 70, size: 40, severity: "low" },
    { id: "zone4", x: 15, y: 80, size: 70, severity: "high" },
    { id: "zone5", x: 85, y: 45, size: 50, severity: "medium" },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLayer = (id: string) => {
    setInfrastructureLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, active: !layer.active } : layer)),
    )
  }

  const generateRecommendations = () => {
    alert("Generating Zoning Recommendations based on current analysis...")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "#dc2626"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#eab308"
      default:
        return "#64748b"
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 blueprint-grid opacity-20"></div>

      {/* Main Content */}
      <div className="relative z-20 h-screen flex w-full pt-16">
        {/* Left Control Panel */}
        <div className="w-96 bg-black/95 backdrop-blur-sm border-r border-blue-900/50 p-6 h-full pt-6">
          <h2 className="text-xl font-bold text-blue-300 mb-6">Urban Planning Console</h2>

          {/* Infrastructure Layers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-200">Infrastructure Layers</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {infrastructureLayers.map((layer) => (
                <div key={layer.id} className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layer.active}
                      onChange={() => toggleLayer(layer.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 transition-all ${
                        layer.active ? "bg-current border-current" : "border-gray-600"
                      }`}
                      style={{ color: layer.color }}
                    ></div>
                    <span className="text-sm text-gray-300">{layer.name}</span>
                  </label>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      layer.type === "existing" ? "bg-gray-800/50 text-gray-400" : "bg-blue-900/30 text-blue-300"
                    }`}
                  >
                    {layer.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nightlight Analysis */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-200">Nightlight Analysis</h3>
            <div className="bg-gray-900/50 border border-blue-800/50 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-300">Electricity Coverage</span>
                <span className="text-blue-300 font-bold">67%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full shadow-lg"
                  style={{ width: "67%" }}
                ></div>
              </div>
              <div className="text-xs text-gray-400">
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
              <input
                type="checkbox"
                checked={showImpactToggle}
                onChange={(e) => setShowImpactToggle(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full border-2 transition-all relative ${
                  showImpactToggle ? "bg-blue-900/30 border-blue-600 shadow-lg" : "border-gray-600"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                    showImpactToggle ? "translate-x-6" : "translate-x-0.5"
                  }`}
                ></div>
              </div>
              <span className="text-sm text-gray-300">Development Impact</span>
            </label>
          </div>

          {/* Generate Recommendations Button */}
          <Button
            onClick={generateRecommendations}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Generate Zoning Recommendations
          </Button>
        </div>

        {/* Main Planning Map */}
        <div className="flex-1 relative h-full">
          <div className="w-full h-full bg-gray-900/50 backdrop-blur-sm relative overflow-hidden m-0 rounded-none border-l-0 border border-blue-900/50">
            {/* Map Grid */}
            <div className="absolute inset-0 planning-grid opacity-30"></div>

            {/* Existing Infrastructure (Dull Neon Outlines) */}
            {infrastructureLayers
              .filter((layer) => layer.type === "existing" && layer.active)
              .map((layer) => (
                <div key={layer.id} className="absolute inset-0">
                  {layer.id === "roads" && (
                    <>
                      <div
                        className="absolute h-1 opacity-60"
                        style={{
                          backgroundColor: layer.color,
                          left: "10%",
                          top: "20%",
                          width: "80%",
                          boxShadow: `0 0 5px ${layer.color}`,
                        }}
                      ></div>
                      <div
                        className="absolute w-1 opacity-60"
                        style={{
                          backgroundColor: layer.color,
                          left: "30%",
                          top: "10%",
                          height: "80%",
                          boxShadow: `0 0 5px ${layer.color}`,
                        }}
                      ></div>
                      <div
                        className="absolute w-1 opacity-60"
                        style={{
                          backgroundColor: layer.color,
                          left: "70%",
                          top: "10%",
                          height: "80%",
                          boxShadow: `0 0 5px ${layer.color}`,
                        }}
                      ></div>
                    </>
                  )}
                  {layer.id === "power" && (
                    <>
                      <div
                        className="absolute w-0.5 opacity-60"
                        style={{
                          backgroundColor: layer.color,
                          left: "25%",
                          top: "15%",
                          height: "70%",
                          boxShadow: `0 0 3px ${layer.color}`,
                        }}
                      ></div>
                      <div
                        className="absolute h-0.5 opacity-60"
                        style={{
                          backgroundColor: layer.color,
                          left: "20%",
                          top: "40%",
                          width: "60%",
                          boxShadow: `0 0 3px ${layer.color}`,
                        }}
                      ></div>
                    </>
                  )}
                  {layer.id === "schools" && (
                    <>
                      <div
                        className="absolute w-6 h-6 rounded opacity-60 flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "25%",
                          top: "35%",
                          boxShadow: `0 0 5px ${layer.color}`,
                        }}
                      >
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </div>
                      <div
                        className="absolute w-6 h-6 rounded opacity-60 flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "65%",
                          top: "25%",
                          boxShadow: `0 0 5px ${layer.color}`,
                        }}
                      >
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </div>
                      <div
                        className="absolute w-6 h-6 rounded opacity-60 flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "45%",
                          top: "75%",
                          boxShadow: `0 0 5px ${layer.color}`,
                        }}
                      >
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </div>
                    </>
                  )}
                  {layer.id === "hospitals" && (
                    <>
                      <div
                        className="absolute w-6 h-6 rounded opacity-60 flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "35%",
                          top: "45%",
                          boxShadow: `0 0 5px ${layer.color}`,
                        }}
                      >
                        <div className="text-white text-lg">+</div>
                      </div>
                      <div
                        className="absolute w-6 h-6 rounded opacity-60 flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "75%",
                          top: "55%",
                          boxShadow: `0 0 5px ${layer.color}`,
                        }}
                      >
                        <div className="text-white text-lg">+</div>
                      </div>
                    </>
                  )}
                </div>
              ))}

            {/* Proposed Infrastructure (Bright Glowing Pulsing) */}
            {infrastructureLayers
              .filter((layer) => layer.type === "proposed" && layer.active)
              .map((layer) => (
                <div key={layer.id} className="absolute inset-0">
                  {layer.id === "new-roads" && (
                    <>
                      <div
                        className="absolute h-2"
                        style={{
                          backgroundColor: layer.color,
                          left: "15%",
                          top: "60%",
                          width: "70%",
                        }}
                      ></div>
                      <div
                        className="absolute w-2"
                        style={{
                          backgroundColor: layer.color,
                          left: "50%",
                          top: "30%",
                          height: "40%",
                        }}
                      ></div>
                    </>
                  )}
                  {layer.id === "new-power" && (
                    <>
                      {darkZones.slice(0, 3).map((zone, index) => (
                        <div
                          key={`microgrid-${index}`}
                          className="absolute w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: layer.color,
                            left: `${zone.x}%`,
                            top: `${zone.y}%`,
                          }}
                        ></div>
                      ))}
                    </>
                  )}
                  {layer.id === "new-schools" && (
                    <>
                      <div
                        className="absolute w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "55%",
                          top: "65%",
                        }}
                      >
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                      </div>
                      <div
                        className="absolute w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "25%",
                          top: "15%",
                        }}
                      >
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                      </div>
                    </>
                  )}
                  {layer.id === "new-hospitals" && (
                    <>
                      <div
                        className="absolute w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "15%",
                          top: "55%",
                        }}
                      >
                        <div className="text-white text-xl">+</div>
                      </div>
                      <div
                        className="absolute w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: layer.color,
                          left: "85%",
                          top: "25%",
                        }}
                      >
                        <div className="text-white text-xl">+</div>
                      </div>
                    </>
                  )}
                </div>
              ))}

            {/* Dark Zones (No Electricity) */}
            {darkZones.map((zone) => (
              <div
                key={zone.id}
                className="absolute rounded-full cursor-pointer transition-all hover:scale-110"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.size}px`,
                  height: `${zone.size}px`,
                  backgroundColor: `${getSeverityColor(zone.severity)}20`,
                  border: `2px solid ${getSeverityColor(zone.severity)}`,
                  boxShadow: `0 0 20px ${getSeverityColor(zone.severity)}40`,
                }}
                onClick={() => setSelectedZone(zone)}
                onMouseEnter={(e) => {
                  const tooltip = document.createElement("div")
                  tooltip.className =
                    "fixed z-50 bg-slate-900/95 text-white p-2 rounded text-sm border border-red-500/50"
                  tooltip.innerHTML = `⚡ No electricity detected<br/>Recommended: Solar microgrid deployment`
                  tooltip.style.left = `${e.clientX + 10}px`
                  tooltip.style.top = `${e.clientY - 10}px`
                  tooltip.id = "zone-tooltip"
                  document.body.appendChild(tooltip)
                }}
                onMouseLeave={() => {
                  const tooltip = document.getElementById("zone-tooltip")
                  if (tooltip) tooltip.remove()
                }}
              ></div>
            ))}

            {/* Development Impact Overlays */}
            {showImpactToggle && (
              <div className="absolute inset-0">
                <div className="absolute top-20 right-4 bg-black/90 border border-blue-700/50 rounded p-4 text-sm">
                  <h4 className="font-semibold text-blue-300 mb-2">Impact Analysis</h4>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div>Coverage: +23%</div>
                    <div>Energy Access: +45%</div>
                    <div>Population Served: +12,000</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Zone Info Modal */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm border border-blue-800/50 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-bold text-blue-300 mb-4">Dark Zone Analysis</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Zone ID:</span>
                <span className="text-blue-300">{selectedZone.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Severity:</span>
                <span style={{ color: getSeverityColor(selectedZone.severity) }}>
                  {selectedZone.severity.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Affected Area:</span>
                <span className="text-gray-300">{selectedZone.size * 10} sq km</span>
              </div>
              <div className="mt-4 p-3 bg-gray-900/50 rounded border border-blue-700/50">
                <h4 className="font-semibold text-blue-300 mb-2">Recommendations:</h4>
                <ul className="text-xs space-y-1 text-gray-400">
                  <li>• Deploy solar microgrid system</li>
                  <li>• Install LED street lighting</li>
                  <li>• Connect to main power grid</li>
                  <li>• Estimated cost: $2.3M</li>
                </ul>
              </div>
            </div>
            <Button
              onClick={() => setSelectedZone(null)}
              className="w-full mt-4 bg-red-900/30 hover:bg-red-800/40 border border-red-700/50 text-red-400"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
