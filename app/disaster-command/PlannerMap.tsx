"use client"

import { MapContainer, TileLayer, Circle, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

interface Hazard {
  id: string
  type: string
  name: string
  lat: number
  lng: number
}

interface DarkZone {
  id: string
  lat: number
  lng: number
  radius?: number
}

interface InfrastructureLayer {
  id: string
  type: string
  active: boolean
  coordinates?: [number, number][]
}

interface PlannerMapProps {
  hazards?: Hazard[]
  darkZones?: DarkZone[]
  infrastructureLayers?: InfrastructureLayer[]
}

export default function PlannerMap({
  hazards = [],
  darkZones = [],
  infrastructureLayers = [],
}: PlannerMapProps) {
  const DEFAULT_RADIUS = 100000

  // Scatter hazard coordinates slightly so they don't overlap exactly
  const scatter = (lat: number, lng: number, maxOffset = 0.5) => {
    const offsetLat = (Math.random() - 0.5) * maxOffset
    const offsetLng = (Math.random() - 0.5) * maxOffset
    return [lat + offsetLat, lng + offsetLng] as [number, number]
  }

  return (
    <MapContainer
      center={[50, 90]}
      zoom={2}
      className="w-full h-full"
      minZoom={2}         // Prevent zooming out too far
      maxZoom={10}        // Optional max zoom in
      maxBoundsViscosity={1.0} // Sticky edges
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* Hazards */}
      {hazards.map(h => (
        <Circle
          key={h.id}
          center={scatter(h.lat, h.lng)} // Scatter slightly
          radius={DEFAULT_RADIUS}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.3 }}
        />
      ))}

      {/* Dark Zones */}
      {darkZones.map(z => {
        const safeRadius = Number(z.radius) || DEFAULT_RADIUS
        return (
          <Circle
            key={z.id}
            center={[z.lat, z.lng]}
            radius={safeRadius}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.2 }}
          />
        )
      })}

      {/* Infrastructure Layers */}
      {infrastructureLayers.map(layer => (
        layer.active && Array.isArray(layer.coordinates) && layer.coordinates.length > 0 ? (
          <Polyline
            key={layer.id}
            positions={layer.coordinates}
            pathOptions={{ color: layer.type === "road" ? "yellow" : "green", weight: 3 }}
          />
        ) : null
      ))}
    </MapContainer>
  )
}
