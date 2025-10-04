# from flask import Flask, request, jsonify
# import pandas as pd
# import pickle
# from collections import OrderedDict

# app = Flask(__name__)

# # ----- DATA -----
# df_live = pd.read_csv("sample_risk_data_7days.csv")

# # ----- 7-DAY MODELS -----
# disasters = ['tsunami', 'volcano', 'wildfire', 'drought', 'earthquake', 'flood']
# models = {}
# for d in disasters:
#     filename = f"{d}_index_model.pkl"
#     with open(filename, "rb") as f:
#         models[d] = pickle.load(f)

# # ----- PREVENTIVE MEASURES RULES -----
# preventive_rules = {
#     "Tsunami": (70, "Evacuate to higher ground immediately."),
#     "Volcano": (70, "Avoid the area, follow volcanic alerts."),
#     "Wildfire": (70, "Clear dry vegetation, keep emergency kit ready."),
#     "Drought": (70, "Conserve water, avoid non-essential usage."),
#     "Earthquake": (70, "Secure furniture, prepare emergency supplies."),
#     "Flood": (70, "Build flood barriers, move valuables to high ground.")
# }

# # ----- ROUTE -----
# @app.route('/combined_risk', methods=['GET'])
# def combined_risk():
#     lat = float(request.args.get('lat'))
#     lon = float(request.args.get('lon'))

#     # --- LIVE RISK ---
#     df_today = df_live[df_live['day_offset'] == 0].copy()
#     df_today['distance'] = ((df_today['latitude'] - lat)**2 + (df_today['longitude'] - lon)**2)**0.5
#     nearest = df_today.loc[df_today['distance'].idxmin()]
#     live_risk = OrderedDict([
#         ("Tsunami", round(nearest['tsunami_index']*100,2)),
#         ("Volcano", round(nearest['volcano_index']*100,2)),
#         ("Wildfire", round(nearest['wildfire_index']*100,2)),
#         ("Drought", round(nearest['drought_index']*100,2)),
#         ("Earthquake", round(nearest['earthquake_index']*100,2)),
#         ("Flood", round(nearest['flood_index']*100,2))
#     ])

#     # --- 7-DAY PREDICTION ---
#     predictions = []
#     for day in range(7):
#         X_test = [[lat, lon, day]]
#         day_prediction = {}
#         for d in disasters:
#             pred = models[d].predict(X_test)[0]*100
#             day_prediction[d] = round(pred,2)
        
#         max_risk_type = max(day_prediction, key=day_prediction.get)
#         max_risk_percent = day_prediction[max_risk_type]
#         predictions.append({
#             "day": f"Day {day+1}" if day>0 else "Today",
#             "type_of_risk": max_risk_type.capitalize(),
#             "risk_percent": max_risk_percent
#         })

#     # --- PREVENTIVE MEASURES BASED ON LIVE RISK ---
#     preventive_measures = []
#     for disaster, percent in live_risk.items():
#         threshold, suggestion = preventive_rules[disaster]
#         if percent >= threshold:
#             preventive_measures.append({
#                 "disaster": disaster,
#                 "risk_percent": percent,
#                 "suggestion": suggestion
#             })

#     # Return combined JSON
#     result = OrderedDict([
#         ("live_risk", live_risk),
#         ("7day_prediction", predictions),
#         ("preventive_measures", preventive_measures)
#     ])

#     return jsonify(result)

# if __name__ == "__main__":
#     app.run(port=5000)

# # app.py (Flask)
# from flask import Flask, request, jsonify
# from risk_model import predict_all_risks, compute_features

# app = Flask(__name__)

# @app.route("/api/live-risk")
# def live_risk():
#     lat = float(request.args.get("lat"))
#     lon = float(request.args.get("lon"))
#     scores = predict_all_risks(lat, lon)
#     return jsonify(scores)

# @app.route("/api/7day-predictions")
# def predictions_7d():
#     lat = float(request.args.get("lat")); lon=float(request.args.get("lon"))
#     features = compute_features(lat, lon)  # includes forecast-based features
#     return jsonify(features)

# @app.route("/api/suggestions")
# def suggestions():
#     # compute risk and return suggestions (simple rules-based mapping)
#     lat = float(request.args.get("lat")); lon=float(request.args.get("lon"))
#     scores = predict_all_risks(lat, lon)
#     # basic mapping (customize)
#     suggestions = []
#     if scores['flood'] > 0.7:
#         suggestions.append("High flood risk: move to higher ground / avoid low roads.")
#     if scores['drought'] > 0.7:
#         suggestions.append("High drought risk: water rationing, protect crops.")
#     return jsonify({"scores": scores, "suggestions": suggestions})

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)

# from fastapi import FastAPI, Query
# from fastapi.middleware.cors import CORSMiddleware
# from live_data import get_live_risk_level, get_7day_prediction, get_suggestions
# from config import OPENCAGE_API_KEY
# import requests

# app = FastAPI(title="Disaster Management API")

# # Allow frontend (React, Angular, etc.)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def root():
#     return {"message": "Disaster Management Backend is running!"}

# @app.get("/risk")
# def risk(lat: float, lon: float):
#     """
#     Returns live risk level for given coordinates.
#     """
#     risk_score = get_live_risk_level(lat, lon)
#     suggestions = get_suggestions(risk_score)
#     return {"lat": lat, "lon": lon, "risk_level": risk_score, "suggestions": suggestions}

# @app.get("/predict")
# def predict(lat: float, lon: float):
#     """
#     Returns 7-day predictions for given coordinates.
#     """
#     prediction = get_7day_prediction(lat, lon)
#     return {"lat": lat, "lon": lon, "7day_prediction": prediction}

# @app.get("/geocode")
# def geocode(place: str):
#     """
#     Convert place name (e.g., Hyderabad) into lat/lon.
#     Uses OpenCage if key exists, else falls back to Nominatim (OpenStreetMap).
#     """
#     if OPENCAGE_API_KEY:
#         url = f"https://api.opencagedata.com/geocode/v1/json?q={place}&key={OPENCAGE_API_KEY}"
#         res = requests.get(url).json()
#         if res.get("results"):
#             coords = res["results"][0]["geometry"]
#             return {"place": place, "lat": coords["lat"], "lon": coords["lng"]}
#     else:
#         url = f"https://nominatim.openstreetmap.org/search?q={place}&format=json"
#         res = requests.get(url).json()
#         if res:
#             return {"place": place, "lat": float(res[0]["lat"]), "lon": float(res[0]["lon"])}

#     return {"error": "Could not geocode place."}

# from flask import Flask, request, jsonify
# from live_data import get_power_data, get_firms_data, get_open_meteo_forecast, get_usgs_earthquakes
# from risk_model import predict_risk

# app = Flask(__name__)

# @app.route("/live-risk", methods=["GET"])
# def live_risk():
#     lat = request.args.get("lat", default="17.3850")
#     lon = request.args.get("lon", default="78.4867")
#     start = request.args.get("start", default="20251001")
#     end = request.args.get("end", default="20251001")

#     power_data = get_power_data(lat, lon, start, end)
#     forecast = get_open_meteo_forecast(lat, lon)
#     fires = get_firms_data()
#     quakes = get_usgs_earthquakes()

#     try:
#         input_data = {
#             "temperature": power_data['properties']['parameter']['T2M'][start],
#             "precipitation": power_data['properties']['parameter']['PRECTOT'][start],
#             "humidity": power_data['properties']['parameter']['RH2M'][start],
#             "wind_speed": power_data['properties']['parameter']['WS2M'][start]
#         }
#         risk = predict_risk(input_data)
#     except Exception as e:
#         return jsonify({"error": str(e)})

#     return jsonify({
#         "risk_level": risk,
#         "fires": fires,
#         "forecast": forecast,
#         "earthquakes": quakes
#     })

# if __name__ == "__main__":
#     app.run(debug=True)
from flask import Flask, request, jsonify
from live_data import get_power_data, get_firms_data, get_open_meteo_forecast, get_usgs_earthquakes
from risk_model import predict_risk

app = Flask(__name__)

# @app.route("/live-risk", methods=["GET"])
# def live_risk():
#     lat = request.args.get("lat", default="17.3850")
#     lon = request.args.get("lon", default="78.4867")
#     start = request.args.get("start", default="20251001")
#     end = request.args.get("end", default="20251001")

#     power_data = get_power_data(lat, lon, start, end)
#     forecast = get_open_meteo_forecast(lat, lon)
#     fires = get_firms_data()
#     quakes = get_usgs_earthquakes()

#     # try:
#     #     input_data = {
#     #         "temperature": power_data['properties']['parameter']['T2M'][start],
#     #         "precipitation": power_data['properties']['parameter']['PRECTOT'][start],
#     #         "humidity": power_data['properties']['parameter']['RH2M'][start],
#     #         "wind_speed": power_data['properties']['parameter']['WS2M'][start]
#     #     }
#     #     risk = predict_risk(input_data)
#     # except Exception as e:
#     #     return jsonify({"error": str(e)})

#     # return jsonify({
#     #     "risk_level": risk,
#     #     "fires": fires,
#     #     "forecast": forecast,
#     #     "earthquakes": quakes
#     # })
#     try:
#         params = power_data.get('properties', {}).get('parameter', {})
#         input_data = {
#             "temperature": params.get('T2M', {}).get(start, 25),
#             "precipitation": params.get('PRECTOT', {}).get(start, 0),
#             "humidity": params.get('RH2M', {}).get(start, 70),
#             "wind_speed": params.get('WS2M', {}).get(start, 5)
#         }
#         risk = predict_risk(input_data)
#     except Exception as e:
#         return jsonify({"error": str(e)})
# @app.route("/live-risk", methods=["GET"])
# def live_risk():
#     lat = request.args.get("lat", default="17.3850")
#     lon = request.args.get("lon", default="78.4867")
#     start = request.args.get("start", default="20251001")
#     end = request.args.get("end", default="20251001")

#     try:
#         power_data = get_power_data(lat, lon, start, end)
#         forecast = get_open_meteo_forecast(lat, lon)
#         fires = get_firms_data()
#         quakes = get_usgs_earthquakes()

#         params = power_data.get('properties', {}).get('parameter', {})
#         input_data = {
#             "temperature": params.get('T2M', {}).get(start, 25),
#             "precipitation": params.get('PRECTOT', {}).get(start, 0),
#             "humidity": params.get('RH2M', {}).get(start, 70),
#             "wind_speed": params.get('WS2M', {}).get(start, 5)
#         }

#         risk = predict_risk(input_data)

#         return jsonify({
#             "risk_level": risk,
#             "fires": fires,
#             "forecast": forecast,
#             "earthquakes": quakes
#         })

#     except Exception as e:
#         print(f"❌ Error in live_risk: {e}")
#         return jsonify({"error": str(e)})
# if __name__ == "__main__":
#     app.run(debug=True)

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import random
from live_data import get_power_data, get_firms_data, get_open_meteo_forecast, get_usgs_earthquakes

app = FastAPI()

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace with ["http://localhost:3000"] for safety
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

    risks = {
        "flood": random.choice(["Low", "Medium", "High"]),
        "drought": random.choice(["Low", "Medium", "High"]),
        "heatwave": random.choice(["Low", "Medium", "High"]),
        "cyclone": random.choice(["Low", "Medium", "High"]),
    }
    return {"location": {"lat": lat, "lon": lon}, "predicted_risks": risks}

@app.get("/live-risk")
async def live_risk(lat: float = 17.3850, lon: float = 78.4867, start: str = "20251001", end: str = "20251001"):
    try:
        power_data = get_power_data(lat, lon, start, end)
        forecast = get_open_meteo_forecast(lat, lon)
        fires = get_firms_data()
        quakes = get_usgs_earthquakes()

        return JSONResponse({
            "power_data": power_data,
            "forecast": forecast,
            "fires": fires,
            "earthquakes": quakes
        })
    except Exception as e:
        return JSONResponse({"error": str(e)})
