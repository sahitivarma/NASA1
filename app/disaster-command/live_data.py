# # live_data.py
# import os
# import requests
# import datetime as dt
# import pandas as pd

# POWER_BASE = "https://power.larc.nasa.gov/api/temporal"
# FIRMS_BASE_AREA = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
# USGS_BASE = "https://earthquake.usgs.gov/fdsnws/event/1/query"
# OPEN_METEO = "https://api.open-meteo.com/v1/forecast"

# FIRMS_MAP_KEY = os.environ.get("FIRMS_MAP_KEY")  # set in env

# def get_power_daily(lat, lon, start_date, end_date, params=None):
#     """Return pandas DataFrame of NASA POWER daily parameters for a given point."""
#     if params is None:
#         params = ["PRECTOTCORR","T2M","RH2M","WS2M"]  # precipitation, temp, RH, wind
#     url = f"{POWER_BASE}/daily/point"
#     payload = {
#         "parameters": ",".join(params),
#         "community": "ag",
#         "longitude": lon,
#         "latitude": lat,
#         "start": start_date.strftime("%Y%m%d"),
#         "end": end_date.strftime("%Y%m%d"),
#         "format": "JSON"
#     }
#     r = requests.get(url, params=payload, timeout=30)
#     r.raise_for_status()
#     j = r.json()
#     params_dict = j["properties"]["parameter"]  # {param: {date: value}}
#     df = pd.DataFrame(params_dict)
#     df.index = pd.to_datetime(df.index, format="%Y%m%d")
#     df = df.sort_index().reset_index().rename(columns={"index": "date"})
#     return df

# def get_open_meteo_forecast(lat, lon):
#     """Return JSON forecast (hourly + daily) for 7 days from Open-Meteo."""
#     params = {
#         "latitude": lat,
#         "longitude": lon,
#         "hourly": "temperature_2m,relativehumidity_2m,precipitation,wind_speed_10m",
#         "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
#         "forecast_days": 7,
#         "timezone": "auto"
#     }
#     r = requests.get(OPEN_METEO, params=params, timeout=20)
#     r.raise_for_status()
#     return r.json()

# def get_firms_area_csv(west,south,east,north,day_range=7,source="VIIRS_SNPP_NRT"):
#     """Return pandas DataFrame of FIRMS active-fire for bbox and day_range.
#        Example endpoint: /api/area/csv/[MAP_KEY]/[SOURCE]/[AREA_COORDINATES]/[DAY_RANGE]
#     """
#     if FIRMS_MAP_KEY is None:
#         raise RuntimeError("Set FIRMS_MAP_KEY in environment.")
#     url = f"{FIRMS_BASE_AREA}/{FIRMS_MAP_KEY}/{source}/{west},{south},{east},{north}/{day_range}"
#     r = requests.get(url, timeout=30)
#     r.raise_for_status()
#     # returns CSV text
#     df = pd.read_csv(pd.compat.StringIO(r.text))
#     return df

# def get_usgs_quakes(lat, lon, maxradiuskm=200, starttime=None, endtime=None):
#     """Return recent earthquakes as a pandas DataFrame (GeoJSON -> rows)."""
#     if endtime is None:
#         endtime = dt.datetime.utcnow()
#     if starttime is None:
#         starttime = endtime - dt.timedelta(days=7)
#     params = {
#         "format": "geojson",
#         "starttime": starttime.isoformat(),
#         "endtime": endtime.isoformat(),
#         "latitude": lat,
#         "longitude": lon,
#         "maxradiuskm": maxradiuskm
#     }
#     r = requests.get(USGS_BASE, params=params, timeout=20)
#     r.raise_for_status()
#     j = r.json()
#     feats = j.get("features", [])
#     rows = []
#     for f in feats:
#         props = f.get("properties", {})
#         geom = f.get("geometry", {})
#         rows.append({
#             "time": pd.to_datetime(props.get("time", None), unit="ms"),
#             "mag": props.get("mag"),
#             "place": props.get("place"),
#             "coords": geom.get("coordinates")
#         })
#     return pd.DataFrame(rows)

# import requests
# import xarray as xr
# import numpy as np
# import datetime
# import os
# from config import FIRMS_API_KEY, IMERG_BASE_URL, EARTHDATA_USER, EARTHDATA_PASS
# from risk_model import load_model, predict_risk

# # ========== FIRMS (Wildfire Hotspots) ==========
# def get_firms_data(lat, lon):
#     url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{FIRMS_API_KEY}/VIIRS_SNPP_NRT/world/7"
#     try:
#         response = requests.get(url, timeout=15)
#         if response.status_code == 200:
#             return response.text  # You can parse CSV if needed
#         return None
#     except Exception as e:
#         print("FIRMS fetch error:", e)
#         return None

# # ========== IMERG (Rainfall Data) ==========
# def get_imerg_data(date: datetime.date, lat: float, lon: float):
#     """
#     Download IMERG daily data (0.1° resolution) for a given date and location.
#     """
#     year = date.strftime("%Y")
#     month = date.strftime("%m")
#     day = date.strftime("%d")
#     filename = f"3B-DAY-L.MS.MRG.3IMERG.{year}{month}{day}-S000000-E235959.V07.nc4"

#     url = f"{IMERG_BASE_URL}{year}/{month}/{filename}"

#     try:
#         r = requests.get(url, auth=(EARTHDATA_USER, EARTHDATA_PASS), stream=True, timeout=30)
#         if r.status_code == 200:
#             with open("temp.nc4", "wb") as f:
#                 f.write(r.content)
#             ds = xr.open_dataset("temp.nc4")
#             rain = ds["precipitationCal"].sel(lat=lat, lon=lon, method="nearest").values.item()
#             ds.close()
#             os.remove("temp.nc4")
#             return rain
#     except Exception as e:
#         print("IMERG fetch error:", e)
#     return None

# # ========== Risk Level ==========
# def get_live_risk_level(lat, lon):
#     """
#     Compute risk level combining rainfall + FIRMS wildfire hotspots.
#     Uses trained ML model if available.
#     """
#     today = datetime.date.today()
#     rain = get_imerg_data(today, lat, lon)
#     firms = get_firms_data(lat, lon)

#     # Features for ML
#     features = {
#         "rainfall": rain if rain else 0,
#         "fire_alerts": 1 if firms else 0
#     }

#     model = load_model()
#     risk_score = predict_risk(model, features)
#     return risk_score

# # ========== Predictions ==========
# def get_7day_prediction(lat, lon):
#     """
#     Predict risk for next 7 days (rule-based or ML).
#     """
#     preds = []
#     today = datetime.date.today()
#     model = load_model()

#     for i in range(7):
#         day = today + datetime.timedelta(days=i)
#         rain = get_imerg_data(day, lat, lon)
#         features = {
#             "rainfall": rain if rain else 0,
#             "fire_alerts": 0  # future FIRMS prediction not available
#         }
#         preds.append({
#             "date": str(day),
#             "risk": predict_risk(model, features)
#         })
#     return preds

# # ========== Suggestions ==========
# def get_suggestions(risk_level):
#     if risk_level == "High":
#         return ["Prepare evacuation routes", "Build temporary barriers", "Stock emergency kits"]
#     elif risk_level == "Medium":
#         return ["Stay alert", "Monitor weather updates", "Avoid risky areas"]
#     else:
#         return ["No immediate risk", "Continue normal activities"]

# import requests
# from config import FIRMS_API_KEY, FIRMS_BASE_URL

# def get_power_data(lat, lon, start, end):
#     url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOT,RH2M,WS2M&community=SB&longitude={lon}&latitude={lat}&start={start}&end={end}&format=JSON&time-standard=LST"
#     response = requests.get(url)
#     return response.json()

# def get_firms_data():
#     url = f"{FIRMS_BASE_URL}country/active-fire?key={FIRMS_API_KEY}&country=INDIA"
#     response = requests.get(url)
#     return response.json()

# def get_open_meteo_forecast(lat, lon):
#     url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,precipitation_sum,wind_speed_10m_max&timezone=auto"
#     response = requests.get(url)
#     return response.json()

# def get_usgs_earthquakes():
#     url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
#     response = requests.get(url)
#     return response.json()

import requests
from config import FIRMS_API_KEY, FIRMS_BASE_URL

def get_power_data(lat, lon, start, end):
    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOT,RH2M,WS2M&community=SB&longitude={lon}&latitude={lat}&start={start}&end={end}&format=JSON&time-standard=LST"
    response = requests.get(url)
    return response.json()

def get_firms_data():
    url = f"{FIRMS_BASE_URL}country/active-fire?key={FIRMS_API_KEY}&country=INDIA"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"❌ FIRMS API error: {response.status_code}")
        return {"error": f"FIRMS API returned status {response.status_code}"}

    try:
        return response.json()
    except Exception as e:
        print(f"❌ Failed to parse FIRMS response: {e}")
        return {"error": "Invalid FIRMS response format"}

def get_open_meteo_forecast(lat, lon):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,precipitation_sum,wind_speed_10m_max&timezone=auto"
    response = requests.get(url)
    return response.json()

def get_usgs_earthquakes():
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
    response = requests.get(url)
    return response.json()