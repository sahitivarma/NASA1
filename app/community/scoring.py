# import numpy as np

# def calculate_validity_score(granule_data, issue_type):
#     if issue_type == "Flooding":
#         data_score = np.nanmean(granule_data) / 50  # mm/hr
#     elif issue_type == "Heatwave":
#         data_score = np.nanmean(granule_data) / 330  # Kelvin
#     elif issue_type == "Drought":
#         data_score = 1 - (np.nanmean(granule_data) / 0.5)  # inverse
#     else:
#         data_score = 0.5  # neutral fallback

#     data_score = np.clip(data_score, 0, 1)
#     return data_score

# import numpy as np

# def calculate_validity_score(granule_data, issue_type, w_text=0.3, w_image=0.3, w_data=0.4):
#     if issue_type == "Flooding":
#         data_score = np.nanmean(granule_data) / 50  # mm/hr
#     elif issue_type == "Drought":
#         data_score = 1 - (np.nanmean(granule_data) / 0.5)  # inverse soil moisture
#     else:
#         data_score = 0.5  # neutral fallback

#     data_score = np.clip(data_score, 0, 1)

#     text_score = 0.7
#     image_score = 0.6

#     validity_score = (
#         w_text * text_score +
#         w_image * image_score +
#         w_data * data_score
#     )
#     return validity_score

# import numpy as np

# def calculate_validity_score(granule_data, issue_type, w_text=0.3, w_image=0.3, w_data=0.4):
#     """
#     Calculate a weighted validity score for posts.
#     granule_data: numpy array or numeric (from dataset)
#     issue_type: str (Flooding, Drought, Fire, Heatwave, Vegetation, etc.)
#     """
#     if granule_data is None:
#         return 0.5  # neutral fallback

#     try:
#         value = np.nanmean(granule_data)
#     except:
#         value = float(granule_data)

#     # Issue-specific scoring
#     if issue_type.lower() == "flooding":
#         data_score = value / 50.0  # rainfall mm/hr
#     elif issue_type.lower() == "drought":
#         data_score = 1 - (value / 0.5)  # inverse soil moisture
#     elif issue_type.lower() == "fire":
#         data_score = min(value / 10.0, 1)  # fire hotspot intensity
#     elif issue_type.lower() == "heatwave":
#         data_score = min(value / 320.0, 1)  # land surface temp (K)
#     elif issue_type.lower() == "vegetation":
#         data_score = 1 - abs(value - 0.5)  # NDVI health
#     else:
#         data_score = 0.5

#     data_score = np.clip(data_score, 0, 1)

#     # Assume constant scores for text/image credibility
#     text_score = 0.7
#     image_score = 0.6

#     validity_score = (
#         w_text * text_score +
#         w_image * image_score +
#         w_data * data_score
#     )
#     return round(validity_score, 3)

# import numpy as np

# def calculate_validity_score(granule_data, issue_type, w_text=0.3, w_image=0.3, w_data=0.4):
#     """
#     Combines dataset-derived data_score + text_score + image_score
#     into a final validity score between 0 and 1.
#     """

#     # Default fallback
#     data_score = 0.5

#     # Choose dataset variable based on issue type
#     if issue_type.lower() in ["flood", "flooding"]:
#         vals = []
#         for dataset, vars in granule_data.items():
#             for k, v in vars.items():
#                 if "precip" in k.lower():
#                     vals.append(v)
#         if vals:
#             data_score = np.nanmean(vals) / 50  # normalize rainfall mm/hr

#     elif issue_type.lower() in ["drought", "heatwave", "heat"]:
#         vals = []
#         for dataset, vars in granule_data.items():
#             for k, v in vars.items():
#                 if "temp" in k.lower():
#                     vals.append(v)
#         if vals:
#             data_score = 1 - (np.nanmean(vals) / 320)  # normalize to hot climates

#     elif issue_type.lower() in ["smog", "pollution", "air quality"]:
#         vals = []
#         for dataset, vars in granule_data.items():
#             for k, v in vars.items():
#                 if "aod" in k.lower() or "aerosol" in k.lower():
#                     vals.append(v)
#         if vals:
#             data_score = np.nanmean(vals) / 2  # AOD scaling

#     elif issue_type.lower() in ["garbage", "waste"]:
#         vals = []
#         for dataset, vars in granule_data.items():
#             for k, v in vars.items():
#                 if "ndvi" in k.lower():
#                     vals.append(v)
#         if vals:
#             data_score = 1 - np.nanmean(vals)  # lower NDVI = more garbage in urban

#     # Clip score between 0–1
#     data_score = np.clip(data_score, 0, 1)

#     # Mock text/image scores (can be NLP/CV later)
#     text_score = 0.7
#     image_score = 0.6

#     # Weighted average
#     validity_score = (
#         w_text * text_score +
#         w_image * image_score +
#         w_data * data_score
#     )
#     return round(validity_score, 6)

import numpy as np

def calculate_validity_score(granule_data, issue_type, w_text=0.3, w_image=0.3, w_data=0.4):
    data_score = 0.5

    if issue_type.lower() in ["flood", "flooding"]:
        vals = []
        for dataset, vars in granule_data.items():
            for k, v in vars.items():
                if "precip" in k.lower():
                    vals.append(v)
        if vals:
            data_score = np.nanmean(vals) / 50

    elif issue_type.lower() in ["drought", "heatwave", "heat"]:
        vals = []
        for dataset, vars in granule_data.items():
            for k, v in vars.items():
                if "temp" in k.lower():
                    vals.append(v)
        if vals:
            data_score = 1 - (np.nanmean(vals) / 320)

    elif issue_type.lower() in ["smog", "pollution", "air quality"]:
        vals = []
        for dataset, vars in granule_data.items():
            for k, v in vars.items():
                if "aod" in k.lower() or "aerosol" in k.lower():
                    vals.append(v)
        if vals:
            data_score = np.nanmean(vals) / 2

    elif issue_type.lower() in ["garbage", "waste"]:
        vals = []
        for dataset, vars in granule_data.items():
            for k, v in vars.items():
                if "ndvi" in k.lower():
                    vals.append(v)
        if vals:
            data_score = 1 - np.nanmean(vals)

    data_score = np.clip(data_score, 0, 1)

    text_score = 0.7
    image_score = 0.6

    validity_score = (
        w_text * text_score +
        w_image * image_score +
        w_data * data_score
    )
    return round(validity_score, 6)
