"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PlannerMap, {
  GeoBundle,
  LayerToggles,
  defaultToggles,
} from "./PlannerMap";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8001";

// safe fetch helper
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
  // active city
  const [city, setCity] = useState<string>("Hyderabad, India");
  const [search, setSearch] = useState<string>("");

  // map location
  const [center, setCenter] = useState<[number, number]>([17.385, 78.4867]);
  const [zoom, setZoom] = useState<number>(12);
  const [mapKey, setMapKey] = useState<number>(0);

  // ui
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{
    city?: string;
    pct: number;
    step?: string;
  }>({ pct: 0 });
  const [toggles, setToggles] = useState<LayerToggles>(defaultToggles);

  // data
  const [geo, setGeo] = useState<GeoBundle>({
    hexSummary: null,
    hospCand: null,
    schCand: null,
    existingHosp: null,
    existingSch: null,
    roads: null,
  });

  // ------------------------------ helpers -------------------------------
  async function reloadFiles(forCity: string) {
    const qs = `?city=${encodeURIComponent(forCity)}`;

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

    setGeo({
      hexSummary: hex,
      hospCand,
      schCand,
      existingHosp,
      existingSch,
      roads,
    });

    if (bounds?.center && Array.isArray(bounds.center) && bounds.center.length === 2) {
      const [lat, lng] = bounds.center as [number, number];
      setCenter([lat, lng]);
      setZoom(11);
      setMapKey((k) => k + 1); // force remount
    }
  }

  // initial load
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

    // kick pipeline
    try {
      await fetch(`${API_BASE}/run?city=${encodeURIComponent(requested)}`, {
        method: "POST",
      });
    } catch {
      /* ignore */
    }

    // poll until done/error
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

  // Pretty badge
  const Badge = ({ text, bg, glow }: { text: string; bg?: string; glow?: string }) => {
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
        {loading && (
          <div className="px-3 py-1 rounded-lg bg-white/90 text-black text-sm shadow">
            <b>{progress.city}</b> — {progress.step} (
            {Math.max(0, Math.min(100, progress.pct))}%)
          </div>
        )}
      </div>

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
            color="#60a5fa"
            label="Proposed Schools (markers)"
            badge={<Badge text="glow" glow="#60a5fa" />}
            checked={toggles.candMarkers}
            onChange={() =>
              setToggles((t) => ({ ...t, candMarkers: !t.candMarkers }))
            }
          />
          <Row
            color="#fb7185"
            label="Proposed Hospitals (markers)"
            badge={<Badge text="glow" glow="#fb7185" />}
            checked={toggles.candMarkers}
            onChange={() =>
              setToggles((t) => ({ ...t, candMarkers: !t.candMarkers }))
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

        {/* Map */}
        <div className="flex-1 h-[calc(100vh-4rem)]">
          <PlannerMap
            key={mapKey}
            center={center}
            zoom={zoom}
            toggles={toggles}
            geo={geo}
          />
        </div>
      </div>
    </div>
  );
}
