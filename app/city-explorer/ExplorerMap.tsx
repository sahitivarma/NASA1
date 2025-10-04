"use client"
import { useEffect, useRef } from "react"
import type { GlobeOverlay } from "./config"

interface ExplorerMapProps {
  overlays: GlobeOverlay[]
  searchQuery?: string
}

const overlayColors: Record<string, string> = {
  heat: "orange",
  air: "red",
  water: "blue",
  vegetation: "green",
  agriculture: "yellow",
}

export default function ExplorerMap({ overlays, searchQuery }: ExplorerMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMap = useRef<any>(null)
  const layerGroup = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Dynamically import Leaflet only on client
    import("leaflet").then((L) => {
      leafletMap.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5) // India center
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMap.current)

      layerGroup.current = L.layerGroup().addTo(leafletMap.current)
    })
  }, [])

  useEffect(() => {
    if (!leafletMap.current || !layerGroup.current) return

    layerGroup.current.clearLayers()

    if (!searchQuery) return

    import("./config").then(({ staticCityData }) => {
      const city = searchQuery.toLowerCase()
      if (!staticCityData[city]) return
      const cityData = staticCityData[city]

      overlays.forEach((ov) => {
        if (!ov.active) return
        const points = cityData[ov.id as keyof typeof cityData]
        if (!points) return

        import("leaflet").then((L) => {
          points.forEach((p) => {
            L.circle([p.lat, p.lng], {
              radius: 1000,
              color: overlayColors[ov.id],
              fillColor: overlayColors[ov.id],
              fillOpacity: 0.5,
            }).addTo(layerGroup.current)
          })
        })
      })

      // Zoom to city bounds
      const allPoints: [number, number][] = []
      overlays.forEach((ov) => {
        const pts = cityData[ov.id as keyof typeof cityData]
        if (pts) pts.forEach((p) => allPoints.push([p.lat, p.lng]))
      })
      if (allPoints.length > 0) {
        import("leaflet").then((L) => {
          const bounds = L.latLngBounds(allPoints as [number, number][])
          leafletMap.current.fitBounds(bounds.pad(0.5))
        })
      }
    })
  }, [overlays, searchQuery])

  return <div ref={mapRef} className="w-full h-screen z-0" />
}
