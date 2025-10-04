# server.py
from fastapi import FastAPI, BackgroundTasks, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess, os, threading, re
from pathlib import Path
from typing import Dict, Optional

# -------------------- config --------------------
API_ORIGINS = ["http://localhost:3000","http://127.0.0.1:3000"]
ROOT_OUT = Path("outputs")            # each city gets its own subfolder
ROOT_OUT.mkdir(parents=True, exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=API_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- task state --------------------
class TaskState(BaseModel):
    city: str
    slug: str
    status: str = "idle"          # idle|running|done|error|cached
    step: str = "waiting"
    progress: int = 0             # 0..100
    error: Optional[str] = None

TASKS: Dict[str, TaskState] = {}   # key = slug

def slugify(city: str) -> str:
    return re.sub(r"[^a-z0-9\-]+", "-", city.strip().lower())

def city_dir(slug: str) -> Path:
    p = ROOT_OUT / slug
    p.mkdir(parents=True, exist_ok=True)
    return p

# Simple “progress map” by matching place_full.py stdout
PROG_MAP = [
    (r"^Geocoding:",                                      ("geocoding",               2)),
    (r"^Building H3 grid",                                ("h3 grid",                10)),
    (r"^Hexes:",                                          ("h3 grid",                12)),
    (r"^Downloading OSM features",                        ("download OSM",           25)),
    (r"^Masked unusable land:",                           ("land-use mask",          35)),
    (r"^Computing distances",                             ("distances",              70)),
    (r"^Estimating building density",                     ("buildings",              78)),
    (r"^Using (building density|road-length) proxy",      ("population proxy",       85)),
    (r"^Wrote existing_roads\.geojson",                   ("writing outputs",        92)),
    (r"^Wrote existing_hospitals\.geojson",               ("writing outputs",        94)),
    (r"^Wrote existing_schools\.geojson",                 ("writing outputs",        96)),
    (r"^done \[OK\]",                                     ("done",                  100)),
]

def _update_progress(state: TaskState, line: str):
    for pat, (step, pct) in PROG_MAP:
        if re.search(pat, line):
            state.step = step
            state.progress = max(state.progress, pct)
            break

# -------------------- worker --------------------
def run_pipeline_worker(state: TaskState):
    try:
        state.status = "running"
        state.step = "starting"
        state.progress = 1
        out_dir = city_dir(state.slug)

        env = os.environ.copy()
        env["OUT_DIR"] = str(out_dir)

        cmd = ["python", "place_full.py", state.city]
        proc = subprocess.Popen(
            cmd, cwd=".", env=env,
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            text=True, bufsize=1
        )

        for line in proc.stdout:
            _update_progress(state, line)
            (out_dir / "run.log").open("a", encoding="utf-8").write(line)

        rc = proc.wait()
        if rc == 0:
            state.progress = 100
            state.step = "done"
            state.status = "done"
        else:
            state.status = "error"
            state.error = f"pipeline exited {rc}"
    except Exception as e:
        state.status = "error"
        state.error = str(e)

# -------------------- API --------------------
@app.post("/run")
def run(city: str = Query(..., min_length=2)):
    slug = slugify(city)
    out_dir = city_dir(slug)

    st = TASKS.get(slug)
    if st and st.status == "running":
        return {"status": "running", "city": city, "slug": slug}

    expected = [
        "hex_summary.geojson",
        "hospital_candidates.geojson",
        "school_candidates.geojson",
        "existing_roads.geojson",
        "existing_hospitals.geojson",
        "existing_schools.geojson",
        "bounds.json",
    ]
    if all((out_dir / f).exists() for f in expected):
        state = TaskState(city=city, slug=slug, status="cached", step="cached", progress=100)
        TASKS[slug] = state
        return state.model_dump()

    state = TaskState(city=city, slug=slug)
    TASKS[slug] = state
    t = threading.Thread(target=run_pipeline_worker, args=(state,), daemon=True)
    t.start()
    return {"status": "running", "city": city, "slug": slug}

@app.get("/status")
def status(city: str = Query(...)):
    slug = slugify(city)
    st = TASKS.get(slug)
    if not st:
        out_dir = city_dir(slug)
        if (out_dir / "hex_summary.geojson").exists():
            st = TaskState(city=city, slug=slug, status="done", step="done", progress=100)
            TASKS[slug] = st
        else:
            st = TaskState(city=city, slug=slug, status="idle", step="idle", progress=0)
            TASKS[slug] = st
    return st.model_dump()

@app.get("/files/{filename}")
def get_file(filename: str, city: Optional[str] = None):
    if city:
        slug = slugify(city)
        fp = city_dir(slug) / filename
        if fp.exists():
            return FileResponse(fp)
    fp = ROOT_OUT / filename
    if fp.exists():
        return FileResponse(fp)
    return JSONResponse({"error": "File not found"}, status_code=404)

@app.get("/health")
def health():
    return {"status": "ok"}