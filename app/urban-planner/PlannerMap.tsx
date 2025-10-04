"use client";

import dynamic from "next/dynamic";
<<<<<<< HEAD
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
=======
import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJSON } from "react-leaflet";
import { LayersControl } from "react-leaflet";

// Dynamically load MapContainer & friends (avoid SSR issues)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((m) => m.Tooltip),
  { ssr: false }
);

// ---------- Types ----------
export type GeoJSONT = any;

export type GeoBundle = {
  hexSummary: GeoJSONT | null;
  hospCand: GeoJSONT | null;      // polygons (candidate hexes)
  schCand: GeoJSONT | null;       // polygons (candidate hexes)
  existingHosp: GeoJSONT | null;  // points
  existingSch: GeoJSONT | null;   // points
  roads: GeoJSONT | null;         // lines
};

export type LayerToggles = {
  roads: boolean;
  existingHosp: boolean;
  existingSch: boolean;
  candHospMarkers: boolean;  // glow markers at candidate centroids (hosp)
  candSchMarkers: boolean;   // glow markers at candidate centroids (sch)
  heatHosp: boolean;         // show proposed-hospital hex polygons (glow)
  heatSch: boolean;          // show proposed-school hex polygons (glow)
};

export const defaultToggles: LayerToggles = {
  roads: false,
  existingHosp: true,
  existingSch: true,
  candHospMarkers: true,
  candSchMarkers: true,
  heatHosp: true,   // on by default → red glowing hexes
  heatSch: false,
};

// ---------- SVG Icons ----------
function svgHospital(glow = false) {
  return `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${
      glow ? 'style="filter: drop-shadow(0 0 6px #f87171) drop-shadow(0 0 12px rgba(239,68,68,.6));"' : ""
    }>
      <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  `;
}
function svgSchool(glow = false) {
  return `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2" ${
      glow ? 'style="filter: drop-shadow(0 0 6px #93c5fd) drop-shadow(0 0 12px rgba(59,130,246,.6));"' : ""
    }>
      <path d="M2 10l10-5 10 5-10 5-10-5z"/>
      <path d="M4 12v5c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-5l-8 4-8-4z" opacity="0.9"/>
    </svg>
  `;
}
const hospitalIcon = new L.DivIcon({ className: "", html: svgHospital(false), iconSize: [28, 28], iconAnchor: [14, 28] });
const hospitalGlowIcon = new L.DivIcon({ className: "", html: svgHospital(true), iconSize: [32, 32], iconAnchor: [16, 32] });
const schoolIcon = new L.DivIcon({ className: "", html: svgSchool(false), iconSize: [28, 28], iconAnchor: [14, 28] });
const schoolGlowIcon = new L.DivIcon({ className: "", html: svgSchool(true), iconSize: [32, 32], iconAnchor: [16, 32] });

// ---------- Props ----------
type Props = {
  center: [number, number];
  zoom?: number;
  toggles: LayerToggles;
  geo: GeoBundle;
};

// simple centroid for polygons/multipolygons
function centroid(feature: any): [number, number] | null {
  try {
    const g = feature?.geometry;
    if (!g) return null;
    if (g.type === "Point") {
      const [lng, lat] = g.coordinates;
      return [lat, lng];
    }
    let sumX = 0, sumY = 0, n = 0;
    let coords: number[][] | null = null;
    if (g.type === "Polygon") coords = g.coordinates?.[0];
    else if (g.type === "MultiPolygon") coords = g.coordinates?.[0]?.[0];
    if (!coords) return null;
    for (const [x, y] of coords) { sumX += x; sumY += y; n++; }
    return n ? [sumY / n, sumX / n] : null;
  } catch { return null; }
}

export default function PlannerMap({ center, zoom = 12, toggles, geo }: Props) {
  useEffect(() => {
    // @ts-ignore
>>>>>>> 4e02fb5 (Added urbanplanners folder)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

<<<<<<< HEAD
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
=======
  const hospRange = useMemo(() => {
    const vals =
      geo.hospCand?.features?.map((f: any) =>
        Number(f.properties?.score_hospital ?? f.properties?.score ?? 0)
      ) || [];
    return {
      min: vals.length ? Math.min(...vals) : 0,
      max: vals.length ? Math.max(...vals) : 1,
    };
  }, [geo.hospCand]);

  const schRange = useMemo(() => {
    const vals =
      geo.schCand?.features?.map((f: any) =>
        Number(f.properties?.score_school ?? f.properties?.score ?? 0)
      ) || [];
    return {
      min: vals.length ? Math.min(...vals) : 0,
      max: vals.length ? Math.max(...vals) : 1,
    };
  }, [geo.schCand]);

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} zoomControl>
      <LayersControl position="bottomright">
        <LayersControl.BaseLayer checked name="Light">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap & Carto"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Street">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Dark">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap & Carto"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* Roads */}
      {toggles.roads && geo.roads && (
        <GeoJSON data={geo.roads} style={{ color: "#666", weight: 1, opacity: 0.6 }} />
      )}

      {/* Proposed HOSPITAL hexes — glowing red fill based on score */}
      {toggles.heatHosp && geo.hospCand && (
        <GeoJSON
          data={geo.hospCand}
          style={(f: any) => {
            const s = Number(f.properties?.score_hospital ?? f.properties?.score ?? 0) || 0;
            const { min, max } = hospRange;
            const t = (s - min) / Math.max(1e-9, max - min); // 0..1
            return {
              weight: 0.6,
              color: "rgba(239,68,68,0.85)",
              fillColor: `rgba(239,68,68,${0.20 + t * 0.55})`,
              fillOpacity: 0.65,
            };
          }}
        />
      )}

      {/* Proposed SCHOOL hexes — glowing blue fill based on score */}
      {toggles.heatSch && geo.schCand && (
        <GeoJSON
          data={geo.schCand}
          style={(f: any) => {
            const s = Number(f.properties?.score_school ?? f.properties?.score ?? 0) || 0;
            const { min, max } = schRange;
            const t = (s - min) / Math.max(1e-9, max - min);
            return {
              weight: 0.6,
              color: "rgba(59,130,246,0.85)",
              fillColor: `rgba(59,130,246,${0.20 + t * 0.55})`,
              fillOpacity: 0.65,
            };
          }}
        />
      )}

      {/* Existing Hospitals */}
      {toggles.existingHosp &&
        geo.existingHosp?.features?.map((f: any, i: number) => {
          const [lng, lat] = f.geometry?.coordinates || [];
          if (lat == null || lng == null) return null;
          return (
            <Marker key={`eh-${i}`} position={[lat, lng]} icon={hospitalIcon}>
              <Tooltip direction="top">Existing Hospital</Tooltip>
              <Popup>Existing Hospital</Popup>
            </Marker>
          );
        })}

      {/* Existing Schools */}
      {toggles.existingSch &&
        geo.existingSch?.features?.map((f: any, i: number) => {
          const [lng, lat] = f.geometry?.coordinates || [];
          if (lat == null || lng == null) return null;
          return (
            <Marker key={`es-${i}`} position={[lat, lng]} icon={schoolIcon}>
              <Tooltip direction="top">Existing School</Tooltip>
              <Popup>Existing School</Popup>
            </Marker>
          );
        })}

      {/* Candidate Hospitals (glow markers) */}
      {toggles.candHospMarkers &&
        geo.hospCand?.features?.map((f: any, i: number) => {
          const c = centroid(f);
          if (!c) return null;
          const s = Number(f.properties?.score_hospital ?? f.properties?.score ?? 0) || 0;
          return (
            <Marker key={`ch-${i}`} position={c} icon={hospitalGlowIcon}>
              <Tooltip direction="top">Recommended Hospital (score: {s.toFixed(3)})</Tooltip>
              <Popup>
                Recommended Hospital
                <br />
                Score: {s.toFixed(3)}
              </Popup>
            </Marker>
          );
        })}

      {/* Candidate Schools (glow markers) */}
      {toggles.candSchMarkers &&
        geo.schCand?.features?.map((f: any, i: number) => {
          const c = centroid(f);
          if (!c) return null;
          const s = Number(f.properties?.score_school ?? f.properties?.score ?? 0) || 0;
          return (
            <Marker key={`cs-${i}`} position={c} icon={schoolGlowIcon}>
              <Tooltip direction="top">Recommended School (score: {s.toFixed(3)})</Tooltip>
              <Popup>
                Recommended School
                <br />
                Score: {s.toFixed(3)}
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
>>>>>>> 4e02fb5 (Added urbanplanners folder)
