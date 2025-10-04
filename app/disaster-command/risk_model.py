# import pandas as pd
# from sklearn.ensemble import RandomForestRegressor
# import pickle

# # Load the expanded 7-day sample dataset
# df = pd.read_csv("sample_risk_data_7days.csv")

# # Features: latitude, longitude, day_offset
# X = df[['latitude', 'longitude', 'day_offset']]

# # Targets: risk for each disaster type
# targets = ['tsunami_index', 'volcano_index', 'wildfire_index', 'drought_index', 'earthquake_index', 'flood_index']

# # Train a Random Forest model for each disaster type
# for t in targets:
#     model = RandomForestRegressor(n_estimators=100, random_state=42)
#     model.fit(X, df[t])
    
#     # Save each model with _index_model.pkl naming
#     filename = f"{t}_model.pkl"
#     filename = filename.replace("_index_model.pkl", "_index_model.pkl")  # ensures correct naming
#     with open(filename, "wb") as f:
#         pickle.dump(model, f)

# print("All models trained and saved successfully!")


# # risk_model.py (concept)
# import joblib
# from live_data import get_power_daily, get_open_meteo_forecast, get_firms_area_csv, get_usgs_quakes
# import datetime as dt
# import numpy as np

# # load models once
# flood_model = joblib.load("flood_index_model.pkl")
# drought_model = joblib.load("drought_index_model.pkl")
# # ... load others

# def compute_features(lat, lon):
#     today = dt.date.today()
#     start = today - dt.timedelta(days=30)
#     power_df = get_power_daily(lat, lon, start_date=start, end_date=today)
#     # compute precip sums
#     power_df['PRECTOTCORR'] = power_df.get('PRECTOTCORR', 0)
#     precip_1d = power_df['PRECTOTCORR'].tail(1).sum()
#     precip_3d = power_df['PRECTOTCORR'].tail(3).sum()
#     precip_7d = power_df['PRECTOTCORR'].tail(7).sum()
#     mean_temp_7d = power_df['T2M'].tail(7).mean()
#     mean_rh_7d = power_df['RH2M'].tail(7).mean()

#     # forecast
#     forecast = get_open_meteo_forecast(lat, lon)
#     # compute forecast precipitation sum next 7 days:
#     daily = forecast.get('daily', {})
#     forecast_precip_sum = sum(daily.get('precipitation_sum', []))

#     # fires count
#     bbox = (lon-0.5, lat-0.5, lon+0.5, lat+0.5)
#     fires_df = get_firms_area_csv(*bbox, day_range=7)
#     fires_count = len(fires_df)

#     # quakes
#     quakes_df = get_usgs_quakes(lat, lon, maxradiuskm=200, starttime=(dt.datetime.utcnow()-dt.timedelta(days=7)))
#     quake_count = len(quakes_df)
#     max_mag = quakes_df['mag'].max() if quake_count>0 else 0.0

#     features = {
#       "precip_1d": float(precip_1d),
#       "precip_3d": float(precip_3d),
#       "precip_7d": float(precip_7d),
#       "mean_temp_7d": float(mean_temp_7d),
#       "mean_rh_7d": float(mean_rh_7d),
#       "forecast_precip_7d": float(forecast_precip_sum),
#       "fires_count_7d": int(fires_count),
#       "quake_count_7d": int(quake_count),
#       "max_quake_mag_7d": float(max_mag)
#     }
#     return features

# def predict_all_risks(lat, lon):
#     features = compute_features(lat, lon)
#     # create vector in the exact order your model expects, e.g.:
#     X = [features['precip_7d'], features['forecast_precip_7d'], features['mean_temp_7d'], features['mean_rh_7d'], features['fires_count_7d'], features['max_quake_mag_7d']]
#     # adapt ordering to your model input
#     flood_score = _model_predict_prob(flood_model, X)
#     drought_score = _model_predict_prob(drought_model, X)
#     return {"flood": flood_score, "drought": drought_score}

# def _model_predict_prob(model, X):
#     arr = np.array(X).reshape(1, -1)
#     if hasattr(model, "predict_proba"):
#         return float(model.predict_proba(arr)[0,1])
#     else:
#         # fall back to predict (assumes model outputs scaled risk)
#         return float(model.predict(arr)[0])
# # risk_model.py
# from fastapi import FastAPI
# from pydantic import BaseModel
# import random

# # Create FastAPI app
# app = FastAPI()

# # Define the input format
# class RiskInput(BaseModel):
#     latitude: float
#     longitude: float

# # Example endpoint
# @app.get("/")
# def home():
#     return {"message": "Risk Model API is running!"}

# # Risk prediction endpoint
# @app.post("/predict_risk")
# def predict_risk(data: RiskInput):
#     # For now, just generate dummy random risk levels
#     risks = {
#         "flood": random.choice(["Low", "Medium", "High"]),
#         "drought": random.choice(["Low", "Medium", "High"]),
#         "heatwave": random.choice(["Low", "Medium", "High"]),
#         "cyclone": random.choice(["Low", "Medium", "High"])
#     }
#     return {
#         "location": {"lat": data.latitude, "lon": data.longitude},
#         "predicted_risks": risks
#     }

# import os
# import xarray as xr
# import pandas as pd
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.model_selection import train_test_split
# import pickle
# from config import MODEL_PATH, IMERG_BASE_PATH

# def train_model_from_imerg():
#     all_data = []

#     for file in os.listdir(IMERG_BASE_PATH):
#         if file.endswith(".nc4"):
#             path = os.path.join(IMERG_BASE_PATH, file)
#             ds = xr.open_dataset(path)

#             # ✅ Use the correct variable name
#             precip = ds['precipitation'].values.flatten()
#             time = ds['time'].values

#             for i in range(len(precip)):
#                 all_data.append({
#                     "precipitation": precip[i],
#                     "temperature": 25,  # Placeholder
#                     "humidity": 70,     # Placeholder
#                     "wind_speed": 5,    # Placeholder
#                     "risk_level": 1 if precip[i] > 10 else 0  # Simple label logic
#                 })

#     df = pd.DataFrame(all_data)

#     X = df[['precipitation', 'temperature', 'humidity', 'wind_speed']]
#     y = df['risk_level']

#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
#     model = RandomForestClassifier()
#     model.fit(X_train, y_train)

#     with open(MODEL_PATH, "wb") as f:
#         pickle.dump(model, f)
# import os
# import xarray as xr
# import pandas as pd
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.model_selection import train_test_split
# import pickle
# #from config import MODEL_PATH, IMERG_BASE_PATH

# MODEL_PATH = "D:/RealdataCommunityHub/model_outputs/risk_predictor.pkl"
# IMERG_BASE_PATH = "D:/RealdataCommunityHub/NASA datasets/GPM_3IMERGDL_07-20251001_173415"

# from dotenv import load_dotenv
# load_dotenv()

# print("MODEL_PATH:", os.getenv("MODEL_PATH"))
# print("IMERG_BASE_PATH:", os.getenv("IMERG_BASE_PATH"))

# def train_model_from_imerg():
#     print("🚀 Starting model training...")

#     all_data = []
#     for file in os.listdir(IMERG_BASE_PATH):
#         if file.endswith(".nc4"):
#             path = os.path.join(IMERG_BASE_PATH, file)
#             print(f"📂 Loading file: {file}")
#             try:
#                 ds = xr.open_dataset(path)
#                 precip = ds['precipitation'].values.flatten()
#                 for i in range(len(precip)):
#                     all_data.append({
#                         "precipitation": precip[i],
#                         "temperature": 25,
#                         "humidity": 70,
#                         "wind_speed": 5,
#                         "risk_level": 1 if precip[i] > 10 else 0
#                     })
#             except Exception as e:
#                 print(f"❌ Error loading {file}: {e}")

#     print(f"✅ Loaded {len(all_data)} data points")

#     if not all_data:
#         print("⚠️ No data loaded. Check your IMERG files.")
#         return

#     df = pd.DataFrame(all_data)
#     X = df[['precipitation', 'temperature', 'humidity', 'wind_speed']]
#     y = df['risk_level']

#     model = RandomForestClassifier()
#     model.fit(X, y)
#     print("✅ Model trained")
#     print(f"Saving model to: {MODEL_PATH}")
#     # Ensure folder exists
#     os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

#     try:
#         with open(MODEL_PATH, "wb") as f:
#             pickle.dump(model, f)
#         print(f"🎉 Model saved to: {MODEL_PATH}")
#     except Exception as e:
#         print(f"❌ Failed to save model: {e}")

# try:
#     train_model_from_imerg()
# except Exception as e:
#     print(f"❌ Script failed: {e}")
#pip install flask pandas scikit-learn numpy xarray netCDF4 h5netcdf python-dotenv requests

# import pandas as pd
# import pickle
# from config import MODEL_PATH

# def predict_risk(input_data):
#     try:
#         with open(MODEL_PATH, "rb") as f:
#             model = pickle.load(f)
#         df = pd.DataFrame([input_data])
#         prediction = model.predict(df)[0]
#         return int(prediction)
#     except Exception as e:
#         print(f"❌ Prediction failed: {e}")
#         return -1  # fallback risk level

# from fastapi import FastAPI
# from pydantic import BaseModel
# import random

# app = FastAPI()

# class RiskInput(BaseModel):
#     latitude: float
#     longitude: float

# @app.get("/")
# def home():
#     return {"message": "Risk Model API is running!"}

# @app.post("/predict_risk")
# def predict_risk(data: RiskInput):
#     risks = {
#         "flood": random.choice(["Low", "Medium", "High"]),
#         "drought": random.choice(["Low", "Medium", "High"]),
#         "heatwave": random.choice(["Low", "Medium", "High"]),
#         "cyclone": random.choice(["Low", "Medium", "High"])
#     }
#     return {
#         "location": {"lat": data.latitude, "lon": data.longitude},
#         "predicted_risks": risks
#     }

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
import random

app = FastAPI()

# ✅ Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for safety
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Risk Model API is running!"}

@app.post("/predict_risk")
async def predict_risk(request: Request):
    data = await request.json()
    lat = data.get("latitude")
    lon = data.get("longitude")

    # Dummy risk generation (connect NASA data later)
    risks = {
        "flood": random.choice(["Low", "Medium", "High"]),
        "drought": random.choice(["Low", "Medium", "High"]),
        "heatwave": random.choice(["Low", "Medium", "High"]),
        "cyclone": random.choice(["Low", "Medium", "High"]),
    }
    return {"location": {"lat": lat, "lon": lon}, "predicted_risks": risks}