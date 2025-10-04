# import pandas as pd
# from src.loader import load_granules
# from src.scoring import calculate_validity_score
# from src.trending import get_trending_issues

# granules = load_granules("NASA datasets")

# sample_posts = [
#     {"location": "Hyderabad", "issue_type": "Flooding", "granule": granules[0]},
#     {"location": "Hyderabad", "issue_type": "Garbage",  "granule": granules[0]},
#     {"location": "Delhi",     "issue_type": "Smog",     "granule": granules[1]},
#     {"location": "Mumbai",    "issue_type": "Flooding", "granule": granules[2]},
#     {"location": "Mumbai",    "issue_type": "Heatwave", "granule": granules[2]},
# ]

# for post in sample_posts:
#     post["validity_score"] = calculate_validity_score(post["granule"])

# df_posts = pd.DataFrame(sample_posts).drop(columns=["granule"])
# print(df_posts)

# region = input("Enter region to check trending issues: ")
# trending = get_trending_issues(df_posts, region, threshold=2)
# print(trending)

# combined = sum(granules) / len(granules)
# combined_score = calculate_validity_score(combined)
# print("Combined Validity Score:", combined_score)

# new_post = {"location": "Hyderabad", "issue_type": "Flooding", "validity_score": combined_score}
# df_posts = pd.concat([df_posts, pd.DataFrame([new_post])], ignore_index=True)

# trending_hyd = get_trending_issues(df_posts, "Hyderabad", threshold=2)
# print(trending_hyd)


# import pandas as pd
# from src.loader import load_granules
# from src.scoring import calculate_validity_score
# from src.trending import get_trending_issues

# # Load granules from HDF5 datasets only
# granules = load_granules("NASA datasets")

# # Sample posts mapped to granules
# sample_posts = [
#     {"location": "Hyderabad", "issue_type": "Flooding", "granule": granules[0]},
#     {"location": "Hyderabad", "issue_type": "Flooding", "granule": granules[0]},
#     {"location": "Delhi",     "issue_type": "Drought",  "granule": granules[1]},
#     {"location": "Mumbai",    "issue_type": "Flooding", "granule": granules[2]},
#     {"location": "Mumbai",    "issue_type": "Drought",  "granule": granules[2]},
# ]

# # Score each post
# for post in sample_posts:
#     post["validity_score"] = calculate_validity_score(post["granule"], post["issue_type"])

# # Create DataFrame
# df_posts = pd.DataFrame(sample_posts).drop(columns=["granule"])
# print(df_posts)

# # Trending issues
# region = input("Enter region to check trending issues: ")
# trending = get_trending_issues(df_posts, region, threshold=2)
# print(trending)

# # Combined score
# combined = sum([post["granule"] for post in sample_posts]) / len(sample_posts)
# combined_score = calculate_validity_score(combined, "Flooding")
# print("Combined Validity Score:", combined_score)

# # Add new post
# new_post = {"location": "Hyderabad", "issue_type": "Flooding", "validity_score": combined_score}
# df_posts = pd.concat([df_posts, pd.DataFrame([new_post])], ignore_index=True)

# # Re-check trending
# trending_hyd = get_trending_issues(df_posts, "Hyderabad", threshold=2)
# print(trending_hyd)

# import pandas as pd
# from src.loader import load_granules
# from src.scoring import calculate_validity_score
# from src.trending import get_trending_issues

# # Load datasets (granules from NetCDF/HDF5 inside "NASA datasets")
# granules = load_granules("NASA datasets")

# # Example posts mapped to specific dataset categories
# sample_posts = [
#     {"location": "Hyderabad", "issue_type": "Flooding", "granule": granules.get("GPM_3IMERGDL")},
#     {"location": "Hyderabad", "issue_type": "Flooding", "granule": granules.get("GPM_3IMERGDL")},
#     {"location": "Delhi",     "issue_type": "Drought",  "granule": granules.get("SPL3SMP")},
#     {"location": "Mumbai",    "issue_type": "Heatwave", "granule": granules.get("MOD11A1")},
#     {"location": "Mumbai",    "issue_type": "Fire",     "granule": granules.get("DL_FIRE")},
# ]

# # Score each post
# for post in sample_posts:
#     post["validity_score"] = calculate_validity_score(post["granule"], post["issue_type"])

# # Create DataFrame
# df_posts = pd.DataFrame(sample_posts).drop(columns=["granule"])
# print("\n--- Posts with Validity Score ---")
# print(df_posts)

# # Trending issues
# region = input("\nEnter region to check trending issues: ")
# trending = get_trending_issues(df_posts, region, threshold=2)
# print(trending)

# # Combined dataset score (average of all granules)
# all_granule_means = [post["granule"].mean().item() for post in sample_posts if post["granule"] is not None]
# if all_granule_means:
#     combined_score = calculate_validity_score(sum(all_granule_means)/len(all_granule_means), "Flooding")
#     print("\nCombined Validity Score (Flooding reference):", combined_score)

#     # Add new post with combined score
#     new_post = {"location": "Hyderabad", "issue_type": "Flooding", "validity_score": combined_score}
#     df_posts = pd.concat([df_posts, pd.DataFrame([new_post])], ignore_index=True)

# # Re-check trending for Hyderabad
# trending_hyd = get_trending_issues(df_posts, "Hyderabad", threshold=2)
# print(trending_hyd)


# import pandas as pd
# from src.loader import load_granules
# from src.scoring import calculate_validity_score
# from src.trending import get_trending_issues

# # Load NASA dataset features
# granules = load_granules("NASA datasets")

# # Example posts (in real app: fetched from DB / frontend)
# sample_posts = [
#     {"location": "Hyderabad", "issue_type": "Flooding", "granule": granules},
#     {"location": "Hyderabad", "issue_type": "Flooding", "granule": granules},
#     {"location": "Hyderabad", "issue_type": "Garbage",  "granule": granules},
#     {"location": "Delhi",     "issue_type": "Smog",     "granule": granules},
#     {"location": "Delhi",     "issue_type": "Smog",     "granule": granules},
#     {"location": "Mumbai",    "issue_type": "Flooding", "granule": granules},
#     {"location": "Mumbai",    "issue_type": "Flooding", "granule": granules},
#     {"location": "Mumbai",    "issue_type": "Heatwave", "granule": granules},
# ]

# # Score each post
# for post in sample_posts:
#     post["validity_score"] = calculate_validity_score(
#         post["granule"], post["issue_type"]
#     )

# # Convert to DataFrame
# df_posts = pd.DataFrame(sample_posts).drop(columns=["granule"])
# print("\n=== Posts with Validity Scores ===")
# print(df_posts)

# # Trending issues in user-selected region
# region = input("\nEnter a region to search: ")
# trending = get_trending_issues(df_posts, region, threshold=2)

# if trending is not None:
#     print(f"\nTrending issues in {region}:")
#     print(trending)

# from fastapi import FastAPI, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import json, os, uuid, random

# app = FastAPI()

# # CORS setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# POSTS_FILE = "posts.json"

# # Ensure file exists
# if not os.path.exists(POSTS_FILE):
#     with open(POSTS_FILE, "w") as f:
#         json.dump([], f)

# class Post(BaseModel):
#     id: str
#     name: str
#     location: str
#     description: str
#     validityScore: int
#     image: str | None = None


# @app.get("/api/posts")
# def get_posts():
#     with open(POSTS_FILE, "r") as f:
#         posts = json.load(f)
#     return list(reversed(posts))  # newest first


# @app.post("/api/posts")
# async def create_post(
#     name: str = Form(...),
#     location: str = Form(...),
#     description: str = Form(...),
#     image: UploadFile | None = None
# ):
#     # Calculate validity score (simple random for now)
#     score = random.randint(70, 100)

#     # Save image if provided
#     image_url = None
#     if image:
#         folder = "uploads"
#         os.makedirs(folder, exist_ok=True)
#         file_path = os.path.join(folder, image.filename)
#         with open(file_path, "wb") as f:
#             f.write(await image.read())
#         image_url = f"/{file_path}"

#     new_post = {
#         "id": str(uuid.uuid4()),
#         "name": name,
#         "location": location,
#         "description": description,
#         "validityScore": score,
#         "image": image_url,
#     }

#     with open(POSTS_FILE, "r") as f:
#         posts = json.load(f)
#     posts.append(new_post)

#     with open(POSTS_FILE, "w") as f:
#         json.dump(posts, f, indent=4)

#     return {"message": "Post created successfully", "post": new_post}


# @app.get("/api/trending")
# def get_trending(region: str):
#     # Simulated trending results
#     trending = {
#         "Hyderabad": [
#             {"issue": "Water contamination alert in Hussain Sagar", "score": 91},
#             {"issue": "High air pollution in Banjara Hills", "score": 85},
#         ],
#         "San Francisco": [
#             {"issue": "Algae bloom near Pier 39", "score": 87},
#             {"issue": "Rising water levels reported", "score": 82},
#         ],
#     }
#     return trending.get(region, [])

# from fastapi import FastAPI, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import json, os, uuid
# from src.loader import load_granules
# from src.scoring import calculate_validity_score
# from src.trending import get_trending_issues

# app = FastAPI()

# # Allow frontend calls
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# POSTS_FILE = "posts.json"

# # Ensure posts.json exists
# if not os.path.exists(POSTS_FILE):
#     with open(POSTS_FILE, "w") as f:
#         json.dump([], f)

# class Post(BaseModel):
#     id: str
#     name: str
#     location: str
#     problem: str
#     description: str
#     validityScore: int
#     image: str | None = None


# @app.get("/api/posts")
# def get_posts():
#     with open(POSTS_FILE, "r") as f:
#         posts = json.load(f)
#     return list(reversed(posts))  # newest first


# @app.post("/api/posts")
# async def create_post(
#     name: str = Form(...),
#     location: str = Form(...),
#     problem: str = Form(...),
#     description: str = Form(...),
#     image: UploadFile | None = None
# ):
#     """Create new post with optional image and calculated validity score"""
#     try:
#         # Save image if provided
#         image_url = None
#         if image:
#             folder = "uploads"
#             os.makedirs(folder, exist_ok=True)
#             file_path = os.path.join(folder, image.filename)
#             with open(file_path, "wb") as f:
#                 f.write(await image.read())
#             image_url = f"/{file_path}"

#         # Load NASA data and calculate validity score
#         granule_data = load_granules()
#         score = calculate_validity_score(granule_data, issue_type=problem)
#         score = round(score * 100, 2)  # convert to %

#         new_post = {
#             "id": str(uuid.uuid4()),
#             "name": name,
#             "location": location,
#             "problem": problem,
#             "description": description,
#             "validityScore": score,
#             "image": image_url,
#         }

#         # Save to posts.json
#         with open(POSTS_FILE, "r") as f:
#             posts = json.load(f)
#         posts.append(new_post)
#         with open(POSTS_FILE, "w") as f:
#             json.dump(posts, f, indent=4)

#         return {"message": "Post created successfully", "post": new_post}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/api/trending")
# def get_trending(region: str):
#     # For now, read from posts.json and count problems by region
#     with open(POSTS_FILE, "r") as f:
#         posts = json.load(f)

#     filtered = [p for p in posts if p["location"].lower() == region.lower()]
#     if not filtered:
#         return []

#     counts = {}
#     for post in filtered:
#         prob = post.get("problem", "Unknown")
#         counts[prob] = counts.get(prob, 0) + 1

#     trending = [{"issue": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: -x[1])]
#     return trending

# from fastapi import FastAPI, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import json, os, uuid
# from src.scoring import calculate_validity_score
# from src.trending import get_trending_issues
# from src.loader import load_granules


# app = FastAPI()

# # Allow CORS for frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# POSTS_FILE = "posts.json"

# # Ensure posts.json exists
# if not os.path.exists(POSTS_FILE):
#     with open(POSTS_FILE, "w") as f:
#         json.dump([], f)


# class Post(BaseModel):
#     id: str
#     name: str
#     location: str
#     description: str
#     validityScore: float
#     image: str | None = None
#     problem: str | None = None  # optional field for trending


# @app.get("/api/posts")
# def get_posts():
#     with open(POSTS_FILE, "r") as f:
#         posts = json.load(f)
#     return list(reversed(posts))


# # @app.post("/api/posts")
# # async def create_post(
# #     name: str = Form(...),
# #     location: str = Form(...),
# #     description: str = Form(...),
# #     problem: str = Form("General"),
# #     image: UploadFile | None = None,
# # ):
# #     # Calculate validity score using NASA backend model
# #     try:
# #         score = calculate_validity_score(description)
# #     except Exception:
# #         score = 75.0  # fallback

# #     # Save uploaded image if provided
# #     image_url = None
# #     if image:
# #         folder = "uploads"
# #         os.makedirs(folder, exist_ok=True)
# #         file_path = os.path.join(folder, image.filename)
# #         with open(file_path, "wb") as f:
# #             f.write(await image.read())
# #         image_url = f"/{file_path}"

# #     new_post = {
# #         "id": str(uuid.uuid4()),
# #         "name": name,
# #         "location": location,
# #         "description": description,
# #         "problem": problem,
# #         "validityScore": round(score, 2),
# #         "image": image_url,
# #     }

# #     with open(POSTS_FILE, "r") as f:
# #         posts = json.load(f)
# #     posts.append(new_post)
# #     with open(POSTS_FILE, "w") as f:
# #         json.dump(posts, f, indent=4)

# #     return {"message": "Post created successfully", "post": new_post}
# @app.post("/api/posts")
# async def create_post(
#     name: str = Form(...),
#     location: str = Form(...),
#     description: str = Form(...),
#     problem: str = Form("General"),
#     image: UploadFile | None = None,
# ):
#     from src.loader import load_granules
#     from src.scoring import calculate_validity_score

#     try:
#         # Load NASA datasets (this might take time)
#         granule_data = load_granules()
#         score = calculate_validity_score(granule_data, problem)
#     except Exception as e:
#         print("⚠️ Error calculating score:", e)
#         score = 75.0  # fallback

#     # Save uploaded image if provided
#     image_url = None
#     if image:
#         folder = "uploads"
#         os.makedirs(folder, exist_ok=True)
#         file_path = os.path.join(folder, image.filename)
#         with open(file_path, "wb") as f:
#             f.write(await image.read())
#         image_url = f"/{file_path}"

#     new_post = {
#         "id": str(uuid.uuid4()),
#         "name": name,
#         "location": location,
#         "description": description,
#         "problem": problem,
#         "validityScore": round(score * 100, 2),  # convert to percentage
#         "image": image_url,
#     }

#     with open(POSTS_FILE, "r") as f:
#         posts = json.load(f)
#     posts.append(new_post)
#     with open(POSTS_FILE, "w") as f:
#         json.dump(posts, f, indent=4)

#     return {"message": "Post created successfully", "post": new_post}

# @app.get("/api/trending")
# def get_trending(region: str):
#     # Read posts from posts.json
#     with open(POSTS_FILE, "r") as f:
#         posts = json.load(f)

#     # Filter by region (case insensitive)
#     filtered = [p for p in posts if p["location"].lower() == region.lower()]
#     if not filtered:
#         return {"region": region, "trending": []}

#     # Count issues by "problem" type
#     counts = {}
#     for post in filtered:
#         prob = post.get("problem", "Unknown")
#         counts[prob] = counts.get(prob, 0) + 1

#     trending = [
#         {"issue": k, "count": v}
#         for k, v in sorted(counts.items(), key=lambda x: -x[1])
#     ]

#     return {"region": region, "trending": trending}

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json, os, uuid
from src.scoring import calculate_validity_score
from src.loader import load_granules

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POSTS_FILE = "posts.json"
if not os.path.exists(POSTS_FILE):
    with open(POSTS_FILE, "w") as f:
        json.dump([], f)


class Post(BaseModel):
    id: str
    name: str
    location: str
    description: str
    validityScore: float
    image: str | None = None
    problem: str | None = None  # optional field for trending


@app.get("/api/posts")
def get_posts():
    with open(POSTS_FILE, "r") as f:
        posts = json.load(f)
    return list(reversed(posts))


@app.post("/api/posts")
async def create_post(
    location: str = Form(...),
    description: str = Form(...),
    problem: str = Form("General"),
    image: UploadFile | None = None,
    name: str = Form("Anonymous"),  # default name if not provided
):
    try:
        # Load NASA datasets (can be heavy)
        granule_data = load_granules()
        score = calculate_validity_score(granule_data, problem)
    except Exception as e:
        print("⚠️ Error calculating score:", e)
        score = 0.75  # fallback

    # Save uploaded image if provided
    image_url = None
    if image:
        folder = "uploads"
        os.makedirs(folder, exist_ok=True)
        file_path = os.path.join(folder, image.filename)
        with open(file_path, "wb") as f:
            f.write(await image.read())
        image_url = f"/{file_path}"

    new_post = {
        "id": str(uuid.uuid4()),
        "name": name,
        "location": location,
        "description": description,
        "problem": problem,
        "validityScore": round(score * 100, 2),
        "image": image_url,
    }

    # Save to JSON
    with open(POSTS_FILE, "r") as f:
        posts = json.load(f)
    posts.append(new_post)
    with open(POSTS_FILE, "w") as f:
        json.dump(posts, f, indent=4)

    return {"message": "Post created successfully", "post": new_post}


@app.get("/api/trending")
def get_trending(region: str):
    with open(POSTS_FILE, "r") as f:
        posts = json.load(f)

    filtered = [p for p in posts if p["location"].lower() == region.lower()]
    if not filtered:
        return {"region": region, "trending": []}

    counts = {}
    for post in filtered:
        prob = post.get("problem", "Unknown")
        counts[prob] = counts.get(prob, 0) + 1

    trending = [
        {"title": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: -x[1])
    ]

    return {"region": region, "trending": trending}
