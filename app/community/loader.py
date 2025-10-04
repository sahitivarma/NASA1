# import os
# import numpy as np
# import h5py
# from pyhdf.SD import SD, SDC  # for HDF4

# def load_granules(folder_path):
#     granules = []
#     for root, dirs, files in os.walk(folder_path):
#         for filename in files:
#             if filename.endswith(".hdf"):
#                 file_path = os.path.join(root, filename)
#                 try:
#                     if is_hdf5(file_path):
#                         data = load_hdf5(file_path)
#                     else:
#                         data = load_hdf4(file_path)
#                     granules.append(data)
#                 except Exception as e:
#                     print(f"Error loading {filename}: {e}")
#     return granules

# def is_hdf5(file_path):
#     with open(file_path, 'rb') as f:
#         return f.read(8) == b'\x89HDF\r\n\x1a\n'

# def load_hdf5(file_path):
#     with h5py.File(file_path, 'r') as f:
#         # Replace with actual variable name
#         dataset = f['precipitationCal'][:]
#         return dataset

# def load_hdf4(file_path):
#     hdf = SD(file_path, SDC.READ)
#     # Replace with actual variable name
#     dataset = hdf.select('LST_Day_1km')[:]
#     return dataset

# import os
# import numpy as np
# import h5py

# def load_granules(folder_path):
#     granules = []
#     for root, dirs, files in os.walk(folder_path):
#         for filename in files:
#             if filename.endswith(".hdf"):
#                 file_path = os.path.join(root, filename)
#                 try:
#                     data = load_hdf5(file_path)
#                     granules.append(data)
#                 except Exception as e:
#                     print(f"Error loading {filename}: {e}")
#     return granules

# def load_hdf5(file_path):
#     with h5py.File(file_path, 'r') as f:
#         # Replace with actual variable name based on dataset
#         if 'precipitationCal' in f:
#             return f['precipitationCal'][:]
#         elif 'Soil_Moisture' in f:
#             return f['Soil_Moisture'][:]
#         else:
#             raise ValueError("Expected variable not found in HDF5 file.")

# import os
# import numpy as np
# from osgeo import gdal  # GDAL supports HDF4

# def load_granules(folder_path):
#     granules = []
#     for root, dirs, files in os.walk(folder_path):
#         for filename in files:
#             if filename.endswith(".hdf"):
#                 file_path = os.path.join(root, filename)
#                 try:
#                     data = load_hdf4_gdal(file_path)
#                     granules.append(data)
#                 except Exception as e:
#                     print(f"Error loading {filename}: {e}")
#     return granules

# def load_hdf4_gdal(file_path):
#     # List subdatasets
#     hdf_ds = gdal.Open(file_path)
#     subdatasets = hdf_ds.GetSubDatasets()

#     # Try to find NDVI or LST_Day_1km or any relevant layer
#     for name, desc in subdatasets:
#         if 'NDVI' in name or 'LST_Day_1km' in name:
#             ds = gdal.Open(name)
#             array = ds.ReadAsArray()
#             return array

#     raise ValueError(f"No expected subdataset found in {file_path}. Available: {[s[0] for s in subdatasets]}")

# src/loader.py
import os
import numpy as np
from netCDF4 import Dataset
import h5py

# Define relevant variables for scoring
RELEVANT_VARS = [
    "precipitation", "precipitationCal",
    "temperature", "air_temperature",
    "aerosol", "AOD", "ndvi", "NDVI"
]

DATA_DIR = "NASA datasets"

def safe_mean(arr):
    """Compute safe mean on numeric slices to avoid overflow."""
    try:
        arr = np.array(arr).astype(float)
        if arr.size > 10000:  # avoid huge arrays
            arr = arr.ravel()[:10000]  # just sample first 10k
        return float(np.nanmean(arr))
    except Exception:
        return np.nan

def load_netcdf(path):
    features = {}
    with Dataset(path, "r") as ds:
        for var in ds.variables:
            if any(key.lower() in var.lower() for key in RELEVANT_VARS):
                try:
                    val = safe_mean(ds.variables[var][:])
                    if not np.isnan(val):
                        features[var] = val
                except Exception:
                    continue
    return features

def load_hdf5(path):
    features = {}
    with h5py.File(path, "r") as f:
        def visit(name, node):
            if isinstance(node, h5py.Dataset):
                if any(key.lower() in name.lower() for key in RELEVANT_VARS):
                    try:
                        val = safe_mean(node[()])
                        if not np.isnan(val):
                            features[name] = val
                    except Exception:
                        pass
        f.visititems(visit)
    return features

def load_granules(base_dir=DATA_DIR):
    """Load all granules and extract summarized features."""
    all_features = {}
    for root, _, files in os.walk(base_dir):
        for fname in files:
            fpath = os.path.join(root, fname)
            if fname.endswith(".nc"):
                feats = load_netcdf(fpath)
            elif fname.endswith(".h5"):
                feats = load_hdf5(fpath)
            else:
                continue

            if feats:
                # use folder name as dataset key
                folder = os.path.basename(root)
                if folder not in all_features:
                    all_features[folder] = {}
                # merge features
                for k, v in feats.items():
                    all_features[folder][k] = v
    return all_features

def get_feature(location, problem):
    """
    Fetch a combined feature value for a given location & problem.
    (Currently just aggregates global mean — can extend with location filters.)
    """
    features = load_granules()
    combined = []
    for dataset, vars in features.items():
        for var, val in vars.items():
            if problem.lower() in var.lower():
                combined.append(val)
    return float(np.nanmean(combined)) if combined else np.nan
