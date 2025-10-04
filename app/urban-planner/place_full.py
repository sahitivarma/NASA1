# place_full.py — run:  python place_full.py "Bengaluru, India"
# Urban siting pipeline: OSM-only population proxy + OpenAQ/LST placeholders
# Py 3.10+, h3 v4, OSMnx 2.x, Shapely 2.x, GeoPandas 0.14+

import sys, os, json, math
import numpy as np
import pandas as pd
import geopandas as gpd
from shapely.geometry import Polygon, Point
from shapely.ops import unary_union

import osmnx as ox
import h3
import networkx as nx

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

# -------------------- knobs --------------------
PLACE         = "Bengaluru, India" if len(sys.argv) < 2 else " ".join(sys.argv[1:])
H3_RES        = 7

NEAR_ROAD_MAX_M     = 500.0      # must be within this of a road (euclidean)
FAR_HOSP_MIN_NET_M  = 3000.0     # must be >= this network distance from existing hospitals
TOP_K               = 15

# Runtime features
FAST_MODE       = False          # keep False to use network travel-time
USE_WORLDPOP    = False          # <— turned OFF on purpose
USE_LST         = False          # placeholder
FETCH_BUILDINGS = True           # we DO want buildings for the proxy if available

OUT_DIR      = os.environ.get("OUT_DIR", "outputs")

ox.settings.use_cache = True
ox.settings.cache_folder = "cache"
ox.settings.timeout = 60
ox.settings.log_console = False

# -------------------- utils --------------------
def log(*args):
    s = " ".join(str(a) for a in args)
    s = (s.replace("…", "...").replace("•", "*").replace("—", "-").replace("–", "-"))
    print(s.encode("ascii", "ignore").decode("ascii"), flush=True)

def _slugify(s: str) -> str:
    s = "".join(c if (c.isalnum() or c in " -_") else " " for c in s.lower())
    return "-".join(s.split())

H3_EDGE_M = {7: 1221.0, 8: 461.0, 9: 174.0, 10: 66.0}

def polygon_from_cell(cell_id: str) -> Polygon:
    latlon = h3.cell_to_boundary(cell_id)
    return Polygon([(lon, lat) for lat, lon in latlon])

def cover_polygon_with_h3(aoi_geom, res: int):
    c = aoi_geom.centroid
    seed = h3.latlng_to_cell(c.y, c.x, res)
    aoi_series = gpd.GeoSeries([aoi_geom], crs=4326)
    utm = aoi_series.estimate_utm_crs()
    minx, miny, maxx, maxy = aoi_series.to_crs(utm).total_bounds
    diagonal_m = ((maxx - minx)*2 + (maxy - miny)*2) ** 0.5
    cell_diam_m = 2.0 * H3_EDGE_M.get(res, 461.0)
    k = int(math.ceil(diagonal_m / cell_diam_m)) + 4
    keep = []
    for cid in set(h3.grid_disk(seed, k)):
        if polygon_from_cell(cid).intersects(aoi_geom):
            keep.append(cid)
    return keep

def norm01(s):
    s = pd.to_numeric(s, errors="coerce").replace([np.inf, -np.inf], np.nan)
    s = s.fillna(s.min() if pd.notna(s.min()) else 0)
    rng = (s.max() - s.min())
    return (s - s.min()) / (rng if rng != 0 else 1)

def norm01_with_neutral(s, neutral=0.5):
    s = pd.to_numeric(s, errors="coerce").replace([np.inf, -np.inf], np.nan)
    if s.isna().all():
        return pd.Series(neutral, index=s.index)
    rng = (s.max() - s.min())
    return (s - s.min()) / (rng if rng != 0 else 1)

def nearest_dist(pt, targets, sidx, k=5):
    if sidx is None or len(targets) == 0: return float("inf")
    try:
        idxs = sidx.nearest(pt.bounds, num_results=k)
        if isinstance(idxs, tuple): idxs = idxs[1]
        cand = targets.iloc[np.asarray(list(idxs))]
    except Exception:
        cand = targets
    return float(cand.distance(pt).min())

# ---- network distance to NEAREST hospital via multi-source Dijkstra
def network_distance_to_hospital(G, hosp_points_gdf):
    """
    Returns: dict of node -> meters (shortest path length) from nearest hospital node.
    """
    if len(hosp_points_gdf) == 0:
        return {}

    hosp_nodes = []
    for x, y in zip(hosp_points_gdf.geometry.x, hosp_points_gdf.geometry.y):
        try:
            n = ox.distance.nearest_nodes(G, X=x, Y=y)
            hosp_nodes.append(int(n))
        except Exception:
            continue
    hosp_nodes = list({*hosp_nodes})
    if not hosp_nodes:
        return {}

    log(f"Computing network distances from {len(hosp_nodes)} hospital nodes …")
    lengths = nx.multi_source_dijkstra_path_length(G, sources=hosp_nodes, cutoff=None, weight="length")
    return lengths

# -------------------- main --------------------
def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    slug = _slugify(PLACE)
    CITY_OUT = OUT_DIR if OUT_DIR.endswith(slug) else os.path.join(OUT_DIR, slug)
    os.makedirs(CITY_OUT, exist_ok=True)
    def city_path(n): return os.path.join(CITY_OUT, n)

    log("Geocoding:", PLACE)
    aoi_gdf = ox.geocode_to_gdf(PLACE).to_crs(4326)
    utm = aoi_gdf.estimate_utm_crs()
    aoi_poly = unary_union(aoi_gdf.to_crs(utm).buffer(2000).to_crs(4326).geometry)

    minx, miny, maxx, maxy = gpd.GeoSeries([aoi_poly]).total_bounds
    center = [float(aoi_poly.centroid.y), float(aoi_poly.centroid.x)]
    with open(city_path("bounds.json"), "w") as f:
        json.dump({"slug": slug, "center": center, "bbox": [miny, minx, maxy, maxx]}, f)

    log("Building H3 grid...")
    hex_ids = cover_polygon_with_h3(aoi_poly, H3_RES)
    hex_polys   = [polygon_from_cell(h) for h in hex_ids]
    hex_centers = [Point(h3.cell_to_latlng(h)[1], h3.cell_to_latlng(h)[0]) for h in hex_ids]
    hex_gdf  = gpd.GeoDataFrame({"h3": hex_ids}, geometry=hex_polys,  crs=4326)
    cent_gdf = gpd.GeoDataFrame({"h3": hex_ids}, geometry=hex_centers, crs=4326)
    log(f"Hexes: {len(hex_gdf)} @ res {H3_RES}")
    log(f"FAST_MODE is {FAST_MODE}")

    log("Downloading OSM features...")
    G = ox.graph_from_polygon(aoi_poly, network_type="drive", simplify=True)
    nodes, edges = ox.graph_to_gdfs(G)
    roads = edges[["geometry"]].copy()

    # degree (intersection-ness)
    deg = dict(G.degree())
    nodes["deg"] = nodes.index.map(lambda i: int(deg.get(i, 0)))

    hosp_tags = {
        "amenity":   ["hospital", "clinic", "doctors"],
        "healthcare": ["hospital", "clinic", "centre"],
        "building":  ["hospital"],
    }
    try:
        hosp_raw = ox.features_from_polygon(aoi_poly, tags=hosp_tags)
        hosp_gdf = hosp_raw.to_crs(4326)
        hosp_gdf = hosp_gdf[hosp_gdf.geometry.notna()].copy()
        hosp_gdf["_wkt_"] = hosp_gdf.geometry.to_wkt()
        hosp_gdf = hosp_gdf.drop_duplicates("_wkt_").drop(columns="_wkt_", errors="ignore")
    except Exception:
        hosp_gdf = gpd.GeoDataFrame(columns=["geometry"], crs=4326)

    sch_tags = {
        "amenity":  ["school", "college", "university"],
        "building": ["school", "university"],
    }
    try:
        sch_raw = ox.features_from_polygon(aoi_poly, tags=sch_tags)
        sch_gdf = sch_raw.to_crs(4326)
        sch_gdf = sch_gdf[sch_gdf.geometry.notna()].copy()
        sch_gdf["_wkt_"] = sch_gdf.geometry.to_wkt()
        sch_gdf = sch_gdf.drop_duplicates("_wkt_").drop(columns="_wkt_", errors="ignore")
    except Exception:
        sch_gdf = gpd.GeoDataFrame(columns=["geometry"], crs=4326)

    # Optional buildings (for proxy)
    if FETCH_BUILDINGS:
        try:
            bld_gdf = ox.features_from_polygon(aoi_poly, tags={"building": True}).to_crs(4326)
        except Exception:
            bld_gdf = gpd.GeoDataFrame(columns=["geometry"], crs=4326)
    else:
        bld_gdf = gpd.GeoDataFrame(columns=["geometry"], crs=4326)

    # points we’ll count per hex
    bld_pts = (gpd.GeoDataFrame(geometry=bld_gdf.to_crs(utm).geometry.centroid.to_crs(4326), crs=4326)
               if len(bld_gdf) else gpd.GeoDataFrame(columns=["geometry"], crs=4326))
    sch_pts = (gpd.GeoDataFrame(geometry=sch_gdf.to_crs(utm).geometry.centroid.to_crs(4326), crs=4326)
               if len(sch_gdf) else gpd.GeoDataFrame(columns=["geometry"], crs=4326))

    log(f"road segs: {len(roads)} | hospitals: {len(hosp_gdf)} | schools: {len(sch_gdf)} | buildings: {len(bld_gdf)}")

    # ---- Gentle land-use mask (water/wetland/reservoir) by area fraction
    try:
        mask_tags = {
            "natural": ["water", "wetland", "bay", "sea", "coastline"],
            "waterway": ["river", "stream", "canal"],
            "landuse": ["reservoir", "basin"],
        }
        mask_gdf = ox.features_from_polygon(aoi_poly, tags=mask_tags).to_crs(4326)
        if len(mask_gdf):
            bad_union = unary_union(mask_gdf.geometry.buffer(0))
            utm_tmp = hex_gdf.estimate_utm_crs()
            hex_m_tmp = hex_gdf.to_crs(utm_tmp)
            bad_m = gpd.GeoSeries([bad_union], crs=4326).to_crs(utm_tmp).iloc[0]
            inter_area = hex_m_tmp.geometry.intersection(bad_m).area
            frac = inter_area / (hex_m_tmp.geometry.area + 1e-9)
            keep_mask = (frac.fillna(0) < 0.5)
            new_hex = hex_gdf.loc[keep_mask].copy()
            new_cent = cent_gdf.loc[new_hex.index].copy()
            if len(new_hex) < max(10, int(0.2 * len(hex_gdf))):
                log(f"Land-use mask would drop too many ({len(hex_gdf)-len(new_hex)} / {len(hex_gdf)}); skipping.")
            else:
                hex_gdf, cent_gdf = new_hex, new_cent
                log(f"Masked unusable land (area-based): kept {len(hex_gdf)} / {len(hex_ids)} hexes.")
        else:
            log("Land-use mask: none found, skipping.")
    except Exception as e:
        log(f"Land-use mask skipped due to error: {e}")

    # ---- Coordinate systems
    try:
        if len(hex_gdf) == 0:
            raise ValueError("no hexes after mask")
        utm2 = hex_gdf.estimate_utm_crs()
    except Exception:
        utm2 = aoi_gdf.estimate_utm_crs()
        log("hex_gdf empty or UTM estimation failed — falling back to AOI UTM.")

    hex_m   = hex_gdf.to_crs(utm2)
    cent_m  = cent_gdf.to_crs(utm2)
    roads_m = roads.to_crs(utm2)
    nodes_m = nodes.to_crs(utm2)
    hosp4326  = hosp_gdf.to_crs(4326)
    hosp_m  = hosp4326.to_crs(utm2)
    bld_pts_m = bld_pts.to_crs(utm2)
    sch_pts_m = sch_pts.to_crs(utm2)

    r_sidx  = roads_m.sindex
    h_sidx  = (hosp_m.sindex if len(hosp_m) else None)
    b_sidx  = (bld_pts_m.sindex if len(bld_pts_m) else None)
    n_sidx  = (nodes_m.sindex if len(nodes_m) else None)
    sch_sidx= (sch_pts_m.sindex if len(sch_pts_m) else None)

    # ---- Distances
    log("Computing distances…")
    # Euclidean to nearest road (good proxy for access)
    hex_m["d_road_m"] = [nearest_dist(p, roads_m, r_sidx) for p in cent_m.geometry]

    # Network distance to NEAREST hospital (meters along road graph)
    if not FAST_MODE and len(hosp_gdf):
        try:
            G_proj = ox.project_graph(G, to_crs=utm2)
        except Exception:
            G_proj = G  # fallback; lengths may already be meters
        hosp_pts_cent = gpd.GeoDataFrame(geometry=hosp4326.to_crs(utm2).geometry.centroid.to_crs(4326), crs=4326)
        net_lengths = network_distance_to_hospital(G_proj, hosp_pts_cent.to_crs(utm2))

        d_hosp_net = []
        for pt in cent_m.geometry:
            try:
                node = ox.distance.nearest_nodes(G_proj, X=pt.x, Y=pt.y)
                d = float(net_lengths.get(int(node), float("inf")))
            except Exception:
                d = float("inf")
            d_hosp_net.append(d)
        hex_m["d_hosp_m_net"] = d_hosp_net
    else:
        hex_m["d_hosp_m_net"] = [nearest_dist(p, hosp_m, h_sidx) if h_sidx else 1e6 for p in cent_m.geometry]

    # ---- OSM-only "population-ish" proxy
    log("Estimating population proxy (OSM-only)…")

    # 1) Road length inside each hex
    roads_m["len_m"] = roads_m.geometry.length
    rl = np.zeros(len(hex_m))
    if len(roads_m):
        rsidx = roads_m.sindex
        for i, geom in enumerate(hex_m.geometry):
            for j in list(rsidx.intersection(geom.bounds)):
                inter = geom.intersection(roads_m.geometry.iloc[j])
                if not inter.is_empty:
                    rl[i] += getattr(inter, "length", 0.0)
    rl = pd.Series(rl, index=hex_m.index)

    # 2) Intersection density (nodes with degree >= 3)
    inter_cnt = np.zeros(len(hex_m), dtype=int)
    if len(nodes_m) and n_sidx is not None:
        nodz = nodes_m[nodes_m["deg"] >= 3] if "deg" in nodes_m.columns else nodes_m
        nsidx = nodz.sindex
        for i, geom in enumerate(hex_m.geometry):
            cand = list(nsidx.intersection(geom.bounds))
            if cand:
                inter_cnt[i] = int(nodz.iloc[cand].within(geom).sum())
    inter_cnt = pd.Series(inter_cnt, index=hex_m.index)

    # 3) Building density (if we fetched buildings)
    bld_density = pd.Series(np.zeros(len(hex_m)), index=hex_m.index, dtype=float)
    if len(bld_pts_m) and b_sidx is not None:
        counts = np.zeros(len(hex_m), dtype=int)
        for i, geom in enumerate(hex_m.geometry):
            cand = list(b_sidx.intersection(geom.bounds))
            if cand:
                counts[i] = int(bld_pts_m.iloc[cand].within(geom).sum())
        area = hex_m.geometry.area + 1e-9
        bld_density = pd.Series(counts / area, index=hex_m.index)

    # 4) School count (schools tend to follow households)
    sch_cnt = pd.Series(np.zeros(len(hex_m), dtype=int), index=hex_m.index)
    if len(sch_pts_m) and sch_sidx is not None:
        cnts = np.zeros(len(hex_m), dtype=int)
        for i, geom in enumerate(hex_m.geometry):
            cand = list(sch_sidx.intersection(geom.bounds))
            if cand:
                cnts[i] = int(sch_pts_m.iloc[cand].within(geom).sum())
        sch_cnt = pd.Series(cnts, index=hex_m.index)

    # normalize components
    n_rl   = norm01(rl)
    n_int  = norm01(inter_cnt)
    n_bld  = norm01(bld_density)
    n_sch  = norm01(sch_cnt)

    # Combine → "pop_total" proxy (scale to ~0..1000 just for interpretability)
    if bld_density.max() > 0:
        # buildings available: lean on them
        pop_proxy = 0.60*n_bld + 0.25*n_rl + 0.10*n_int + 0.05*n_sch
    else:
        # no buildings: roads + intersections + schools
        pop_proxy = 0.60*n_rl + 0.25*n_int + 0.15*n_sch
    hex_gdf["pop_total"] = (pop_proxy * 1000).astype(float)

    # ---- environmental placeholders
    if "lst_c" not in hex_gdf.columns: hex_gdf["lst_c"] = np.nan
    if "pm25" not in hex_gdf.columns: hex_gdf["pm25"] = np.nan

    # ---- Normalized features for scoring
    hex_gdf["d_road_m"]     = hex_m["d_road_m"].values
    hex_gdf["d_hosp_m_net"] = hex_m["d_hosp_m_net"].values

    hex_gdf["n_pop"]       = norm01(hex_gdf["pop_total"])
    hex_gdf["n_heat"]      = norm01(hex_gdf["lst_c"])                # NaN → neutralized in score
    hex_gdf["n_near_road"] = 1.0 - norm01(hex_gdf["d_road_m"])
    hex_gdf["n_far_hosp"]  = norm01(hex_gdf["d_hosp_m_net"])         # bigger = farther (worse coverage)
    hex_gdf["n_pm"]        = norm01_with_neutral(hex_gdf["pm25"], 0.5)

    # ---- Scores (tuned for proxy + network distance)
    # Hospitals: demand(0.55) + fill coverage gaps(0.25) + access(0.15) + tiny env(0.05)
    hex_gdf["score_hospital"] = (
        0.55*hex_gdf["n_pop"] +
        0.25*hex_gdf["n_far_hosp"] +
        0.15*hex_gdf["n_near_road"] +
        0.03*hex_gdf["n_heat"].fillna(0.5) +
        0.02*hex_gdf["n_pm"].fillna(0.5)
    )

    # Schools: demand(0.65) + access(0.25) + prefer cleaner air(0.10)
    hex_gdf["score_school"] = (
        0.65*hex_gdf["n_pop"] +
        0.25*hex_gdf["n_near_road"] +
        0.10*(1 - hex_gdf["n_pm"].fillna(0.5))
    )

    # ---- Candidate selection with constraints
    cands_h = hex_gdf[
        (pd.to_numeric(hex_gdf["d_road_m"], errors="coerce") <= NEAR_ROAD_MAX_M) &
        (pd.to_numeric(hex_gdf["d_hosp_m_net"], errors="coerce") >= FAR_HOSP_MIN_NET_M)
    ]
    top_hosp = cands_h.sort_values("score_hospital", ascending=False).head(TOP_K)
    top_sch  = hex_gdf.sort_values("score_school", ascending=False).head(TOP_K)

    # ---- Save
    os.makedirs(CITY_OUT, exist_ok=True)
    hex_gdf.to_file(city_path("hex_summary.geojson"), driver="GeoJSON")
    top_hosp.to_file(city_path("hospital_candidates.geojson"), driver="GeoJSON")
    top_sch.to_file(city_path("school_candidates.geojson"), driver="GeoJSON")

    roads.to_file(city_path("existing_roads.geojson"), driver="GeoJSON")
    log("Wrote existing_roads.geojson")

    if len(hosp_gdf):
        hosp_pts = gpd.GeoDataFrame(geometry=hosp_gdf.to_crs(utm).geometry.centroid.to_crs(4326), crs=4326)
        hosp_pts.to_file(city_path("existing_hospitals.geojson"), driver="GeoJSON")
    else:
        gpd.GeoDataFrame(columns=["geometry"], crs=4326).to_file(city_path("existing_hospitals.geojson"), driver="GeoJSON")
    log("Wrote existing_hospitals.geojson")

    if len(sch_gdf):
        sch_pts = gpd.GeoDataFrame(geometry=sch_gdf.to_crs(utm).geometry.centroid.to_crs(4326), crs=4326)
        sch_pts.to_file(city_path("existing_schools.geojson"), driver="GeoJSON")
    else:
        gpd.GeoDataFrame(columns=["geometry"], crs=4326).to_file(city_path("existing_schools.geojson"), driver="GeoJSON")
    log("Wrote existing_schools.geojson")

    log("done [OK]")

if __name__ == "__main__":
    main()