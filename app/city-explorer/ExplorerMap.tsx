"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"
import { GlobeOverlay } from "./page"

interface ExplorerMapProps {
  overlays: GlobeOverlay[]
}

export default function ExplorerMap({ overlays }: ExplorerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize Leaflet map
    leafletMap.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5) // center India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMap.current)

    return () => {
      leafletMap.current?.remove()
    }
  }, [])

  // Add / remove heatmap layers based on overlays
  useEffect(() => {
    if (!leafletMap.current) return

    // Remove all existing layers except the tile layer
    leafletMap.current.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        leafletMap.current?.removeLayer(layer)
      }
    })

    overlays.forEach((overlay) => {
      if (overlay.active) {
        // Load your data from JSON (replace with fetch or import)
        // Example static points (lat, lng, intensity)
        const data: [number, number, number][] = [
          [28.6139, 77.209, 0.5], // Delhi
          [19.076, 72.8777, 0.5], // Mumbai
          [12.9716, 77.5946, 0.5], // Bangalore
        ]

        // Heatmap color settings based on overlay type
        let gradient: any = {}
        switch (overlay.id) {
          case "heat":
            gradient = { 0.2: "orange", 0.5: "red", 1: "darkred" }
            break
          case "water":
            gradient = { 0.2: "lightblue", 0.5: "blue", 1: "darkblue" }
            break
          case "vegetation":
            gradient = { 0.2: "lightgreen", 0.5: "green", 1: "darkgreen" }
            break
          case "agriculture":
            gradient = { 0.2: "yellow", 0.5: "gold", 1: "orange" }
            break
          case "air":
            gradient = { 0.2: "pink", 0.5: "red", 1: "darkred" }
            break
        }

        const heatLayer = (L as any).heatLayer(data, {
          radius: 20, // smaller radius
          blur: 15,
          maxZoom: 17,
          gradient,
        })

        heatLayer.addTo(leafletMap.current!)
      }
    })
  }, [overlays])

  return <div ref={mapRef} className="w-full h-screen z-0"></div>
}
