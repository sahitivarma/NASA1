"use client";

<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PlannerMap, {
  GeoBundle,
  LayerToggles,
  defaultToggles,
} from "./PlannerMap";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8001";

async function safeFetch<T = any>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`Fetch failed ${r.status} for ${url}`);
    return (await r.json()) as T;
  } catch (e) {
    console.error(e);
    return null;
  }
}

type TaskStatus = {
  status: "idle" | "running" | "done" | "error" | "cached";
  step: string;
  progress: number;
  city: string;
  slug: string;
  error?: string | null;
};

export default function UrbanPlannerPage() {
  // -------------------------------- state --------------------------------
  const [city, setCity] = useState<string>("Hyderabad, India");
  const [search, setSearch] = useState<string>("");

  const [center, setCenter] = useState<[number, number]>([17.385, 78.4867]);
  const [zoom, setZoom] = useState<number>(12);
  const [mapKey, setMapKey] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{
    city?: string;
    pct: number;
    step?: string;
  }>({ pct: 0 });
  const [toggles, setToggles] = useState<LayerToggles>(defaultToggles);

  const [geo, setGeo] = useState<GeoBundle>({
    hexSummary: null,
    hospCand: null,
    schCand: null,
    existingHosp: null,
    existingSch: null,
    roads: null,
  });
>>>>>>> 4e02fb5 (Added urbanplanners folder)

  // ------------------------------ helpers -------------------------------
  async function reloadFiles(forCity: string) {
    const qs = `?city=${encodeURIComponent(forCity)}`;

<<<<<<< HEAD
  const toggleLayer = (id: string) => {
    setInfrastructureLayers(prev =>
      prev.map(layer => (layer.id === id ? { ...layer, active: !layer.active } : layer))
    )
  }
=======
    const [hex, hospCand, schCand, existingHosp, existingSch, roads, bounds] =
      await Promise.all([
        safeFetch(`${API_BASE}/files/hex_summary.geojson${qs}`),
        safeFetch(`${API_BASE}/files/hospital_candidates.geojson${qs}`),
        safeFetch(`${API_BASE}/files/school_candidates.geojson${qs}`),
        safeFetch(`${API_BASE}/files/existing_hospitals.geojson${qs}`),
        safeFetch(`${API_BASE}/files/existing_schools.geojson${qs}`),
        safeFetch(`${API_BASE}/files/existing_roads.geojson${qs}`),
        safeFetch(`${API_BASE}/files/bounds.json${qs}`),
      ]);
>>>>>>> 4e02fb5 (Added urbanplanners folder)

    setGeo({
      hexSummary: hex,
      hospCand,
      schCand,
      existingHosp,
      existingSch,
      roads,
    });

<<<<<<< HEAD
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
=======
    if (bounds?.center && Array.isArray(bounds.center) && bounds.center.length === 2) {
      const [lat, lng] = bounds.center as [number, number];
      setCenter([lat, lng]);
      setZoom(11);
      setMapKey((k) => k + 1);
    }
  }

  useEffect(() => {
    setSearch(city);
    reloadFiles(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSearch() {
    const requested = (search || "").trim();
    if (!requested) return;

    setLoading(true);
    setProgress({ city: requested, pct: 1, step: "starting…" });
    setCity(requested);

    try {
      await fetch(`${API_BASE}/run?city=${encodeURIComponent(requested)}`, {
        method: "POST",
      });
    } catch {
      // ignore; we'll poll status anyway
    }

    for (let i = 0; i < 220; i++) {
      const st = await safeFetch<TaskStatus>(
        `${API_BASE}/status?city=${encodeURIComponent(requested)}`
      );
      if (st) {
        setProgress({
          city: requested,
          pct: Math.max(0, Math.min(100, st.progress ?? 0)),
          step: st.step ?? "",
        });
        if (st.status === "done" || st.status === "cached") break;
        if (st.status === "error") {
          alert(`Pipeline failed: ${st.error ?? "unknown error"}`);
          setLoading(false);
          return;
        }
      }
      await new Promise((r) => setTimeout(r, 3000));
    }

    await reloadFiles(requested);
    setLoading(false);
  }

  const Badge = ({
    text,
    bg,
    glow,
  }: {
    text: string;
    bg?: string;
    glow?: string;
  }) => {
    const style: React.CSSProperties = glow
      ? { background: glow, boxShadow: `0 0 6px ${glow}, 0 0 14px ${glow}66` }
      : { background: bg || "#111827" };
    return (
      <span className="text-[11px] px-2 py-0.5 rounded text-white" style={style}>
        {text}
      </span>
    );
  };

  const Dot = ({ color }: { color: string }) => (
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: 3,
        background: color,
        display: "inline-block",
        marginRight: 10,
      }}
    />
  );

  const Row = ({
    color,
    label,
    badge,
    checked,
    onChange,
  }: {
    color: string;
    label: string;
    badge: React.ReactNode;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-2">
      <label className="flex items-center">
        <input
          type="checkbox"
          className="mr-3"
          checked={checked}
          onChange={onChange}
        />
        <Dot color={color} />
        <span>{label}</span>
      </label>
      {badge}
    </div>
  );

  // -------------------------------- render -------------------------------
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Search + progress pill */}
      <div className="absolute top-20 right-6 z-[1000] flex items-center gap-3">
        <div className="flex items-center bg-white/95 rounded-lg py-1.5 px-3 text-black shadow">
>>>>>>> 4e02fb5 (Added urbanplanners folder)
          <input
            type="text"
            placeholder="Search a city (e.g., Delhi, India)"
            className="bg-transparent outline-none text-sm w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button
            onClick={onSearch}
            disabled={loading}
            className="ml-2 text-lg"
            title="Run siting pipeline"
          >
            {loading ? "⏳" : "🔎"}
          </button>
        </div>
<<<<<<< HEAD

        {showImpactToggle && (
          <div className="bg-gray-800 border border-blue-600 rounded-lg p-3 shadow-md text-sm w-72">
            <p className="font-semibold mb-1" style={{ color: "#3b53f9" }}>Development Impact</p>
            <p className="text-white">
              Proposed infrastructure positively impacts <span className="text-green-400 font-bold">12,500 people</span>.<br/>
              Estimated access to healthcare ↑ <span className="text-green-400 font-bold">18%</span>, education ↑ <span className="text-green-400 font-bold">25%</span>.
            </p>
=======
        {loading && (
          <div className="px-3 py-1 rounded-lg bg-white/90 text-black text-sm shadow">
            <b>{progress.city}</b> — {progress.step} (
            {Math.max(0, Math.min(100, progress.pct))}%)
>>>>>>> 4e02fb5 (Added urbanplanners folder)
          </div>
        )}
      </div>

<<<<<<< HEAD
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
=======
      <div className="relative z-10 flex w-full pt-16">
        {/* Left panel */}
        <div className="w-96 bg-black/95 border-r border-white/10 p-6 h-[calc(100vh-4rem)] overflow-y-auto space-y-6">
          <h2 className="text-xl font-bold">Urban Planning Console</h2>

          <Row
            color="#9ca3af"
            label="Road Network"
            badge={<Badge text="existing" bg="#111827" />}
            checked={toggles.roads}
            onChange={() => setToggles((t) => ({ ...t, roads: !t.roads }))}
          />
          <Row
            color="#7b61ff"
            label="Schools"
            badge={<Badge text="existing" bg="#111827" />}
            checked={toggles.existingSch}
            onChange={() =>
              setToggles((t) => ({ ...t, existingSch: !t.existingSch }))
            }
          />
          <Row
            color="#ef4444"
            label="Hospitals"
            badge={<Badge text="existing" bg="#111827" />}
            checked={toggles.existingHosp}
            onChange={() =>
              setToggles((t) => ({ ...t, existingHosp: !t.existingHosp }))
            }
          />
          <Row
            color="#fb7185"
            label="Proposed Hospitals (markers)"
            badge={<Badge text="glow" glow="#fb7185" />}
            checked={toggles.candHospMarkers}
            onChange={() =>
              setToggles((t) => ({ ...t, candHospMarkers: !t.candHospMarkers }))
            }
          />
          <Row
            color="#60a5fa"
            label="Proposed Schools (markers)"
            badge={<Badge text="glow" glow="#60a5fa" />}
            checked={toggles.candSchMarkers}
            onChange={() =>
              setToggles((t) => ({ ...t, candSchMarkers: !t.candSchMarkers }))
            }
          />
          <Row
            color="#f97316"
            label="Hospital heat (hexes — proposed)"
            badge={<Badge text="proposed" bg="#f97316" />}
            checked={toggles.heatHosp}
            onChange={() =>
              setToggles((t) => ({ ...t, heatHosp: !t.heatHosp }))
            }
          />
          <Row
            color="#22d3ee"
            label="School heat (hexes — proposed)"
            badge={<Badge text="proposed" bg="#22d3ee" />}
            checked={toggles.heatSch}
            onChange={() =>
              setToggles((t) => ({ ...t, heatSch: !t.heatSch }))
            }
          />

          <div className="pt-2">
            <Button
              onClick={onSearch}
              disabled={loading || !search.trim()}
              className="w-full"
            >
              {loading ? "Running pipeline…" : "Run for this city"}
            </Button>
          </div>

          <div className="text-xs text-white/60 pt-4">
            Tip: toggle <b>Hospital heat</b> or <b>School heat</b> to show
            glowing heat from the proposed siting scores. Candidate markers glow;
            existing icons don’t.
          </div>
        </div>

        {/* Map — we use key to re-mount on city change so new center applies */}
        <div className="flex-1 h-[calc(100vh-4rem)]">
          <PlannerMap
            key={mapKey}
            center={center}
            zoom={zoom}
            toggles={toggles}
            geo={geo}
          />
>>>>>>> 4e02fb5 (Added urbanplanners folder)
        </div>
      </div>
    </div>
  );
}