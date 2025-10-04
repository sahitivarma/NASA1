# import os
# from dotenv import load_dotenv

# # Load variables from .env file
# load_dotenv()

# # === NASA & Earthdata ===
# FIRMS_API_KEY = os.getenv("50399abcc130f06938aeb585514f329b")          # For FIRMS wildfire data
# EARTHDATA_USER = os.getenv("Nikhita_2005")      # Earthdata login username
# EARTHDATA_PASS = os.getenv("Nikhita@2205")      # Earthdata login password
# OPENWEATHER_API_KEY=os.getenv("ad20be033ea9e4664296dff4de88f951")

# # Base URLs
# IMERG_BASE_URL = os.getenv("IMERG_BASE_URL", "D:/RealdataCommunityHub/NASA datasets/GPM_3IMERGDL_07-20251001_173415/IMERG_data.csv")
# EARTHDATA_BASE_URL = os.getenv("EARTHDATA_BASE_URL", "https://cmr.earthdata.nasa.gov/search/granules.json")
# FIRMS_BASE_URL = os.getenv("FIRMS_BASE_URL", "https://firms.modaps.eosdis.nasa.gov/api/")

# # === Geocoding ===
# OPENCAGE_API_KEY = os.getenv("75d4131238364a1a811a6bc227a93f7a")  # Optional, for place name → lat/lon

# # === ML Model ===
# MODEL_PATH = os.getenv("MODEL_PATH", "models/risk_predictor.pkl")
# import os
# from dotenv import load_dotenv

# load_dotenv()

# FIRMS_API_KEY = os.getenv("FIRMS_API_KEY")
# EARTHDATA_USER = os.getenv("EARTHDATA_USER")
# EARTHDATA_PASS = os.getenv("EARTHDATA_PASS")
# OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
# OPENCAGE_API_KEY = os.getenv("OPENCAGE_API_KEY")
# MODEL_PATH = os.getenv("MODEL_PATH")
# IMERG_BASE_PATH = os.getenv("IMERG_BASE_PATH")
# EARTHDATA_BASE_URL = os.getenv("EARTHDATA_BASE_URL")
# FIRMS_BASE_URL = os.getenv("FIRMS_BASE_URL")

import os
from dotenv import load_dotenv

load_dotenv()

FIRMS_API_KEY = os.getenv("FIRMS_API_KEY")
EARTHDATA_USER = os.getenv("EARTHDATA_USER")
EARTHDATA_PASS = os.getenv("EARTHDATA_PASS")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OPENCAGE_API_KEY = os.getenv("OPENCAGE_API_KEY")
MODEL_PATH = os.getenv("MODEL_PATH")
IMERG_BASE_PATH = os.getenv("IMERG_BASE_PATH")
EARTHDATA_BASE_URL = os.getenv("EARTHDATA_BASE_URL")
FIRMS_BASE_URL = os.getenv("FIRMS_BASE_URL")