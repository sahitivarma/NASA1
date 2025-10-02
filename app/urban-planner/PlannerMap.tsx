"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { TileLayer, Marker, Circle, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Dynamically load MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

export interface DarkZone {
  id: string;
  lat: number;
  lng: number;
  size: number;
  severity: "high" | "medium" | "low";
}

export interface InfrastructureLayer {
  id: string;
  name: string;
  type: "existing" | "proposed";
  active: boolean;
  color: string;
}

interface PlannerMapProps {
  darkZones: DarkZone[];
  infrastructureLayers: InfrastructureLayer[];
  fixedPositions: Record<string, { lat: number; lng: number }[]>;
}

export default function PlannerMap({
  darkZones,
  infrastructureLayers,
  fixedPositions,
}: PlannerMapProps) {
  // Fix default Leaflet marker icons
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <MapContainer
      center={[50,90]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Dark Zones */}
      {darkZones.map((zone) => (
        <Circle
          key={zone.id}
          center={[zone.lat, zone.lng]}
          radius={zone.size}
          pathOptions={{
            color: getSeverityColor(zone.severity),
            fillOpacity: 0.3,
          }}
        >
          <Popup>
            Dark Zone {zone.id} <br /> Severity: {zone.severity}
          </Popup>
        </Circle>
      ))}

      {/* Infrastructure Layers */}
      {infrastructureLayers.map((layer) => {
        if (!layer.active) return null;

        // Roads (Polylines)
        if (layer.id === "roads" || layer.id === "new-roads") {
          const positions =
            layer.id === "roads"
              ? [
                  [17.386, 78.486],
                  [17.390, 78.492],
                  [17.395, 78.495],
                ]
              : [
                  [17.387, 78.487],
                  [17.391, 78.493],
                  [17.396, 78.496],
                ];
          return (
            <Polyline
              key={layer.id}
              positions={positions}
              color={layer.color}
              dashArray={layer.type === "proposed" ? "4 6" : undefined}
            />
          );
        }

        // Schools/Hospitals (existing + proposed)
        if (
          layer.id === "schools" ||
          layer.id === "hospitals" ||
          layer.type === "proposed"
        ) {
          const positions = fixedPositions[layer.id] || [];
          return positions.map((pos, idx) => (
            <Marker key={`${layer.id}-${idx}`} position={[pos.lat, pos.lng]}>
              <Popup>
                {layer.name} {layer.type === "proposed" ? "(Proposed)" : "(Existing)"}
              </Popup>
            </Marker>
          ));
        }

        return null;
      })}
    </MapContainer>
  );
}
