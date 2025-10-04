# import pandas as pd

# def get_trending_issues(posts_df, region, threshold=2):
#     subset = posts_df[posts_df["location"].str.lower() == region.lower()]
#     if subset.empty:
#         print(f"No posts found for region: {region}")
#         return None

#     issue_counts = (
#         subset.groupby("issue_type")
#         .size()
#         .reset_index(name="count")
#         .sort_values(by="count", ascending=False)
#     )

#     trending = issue_counts[issue_counts["count"] >= threshold]
#     if trending.empty:
#         print(f"No issues in {region} crossed threshold {threshold}.")
#         return None

#     print(f"Trending issues in {region}:")
#     return trending

# import pandas as pd

# def get_trending_issues(posts_df, region, threshold=2):
#     subset = posts_df[posts_df["location"].str.lower() == region.lower()]
#     if subset.empty:
#         print(f"No posts found for region: {region}")
#         return None

#     issue_counts = (
#         subset.groupby("issue_type")
#         .size()
#         .reset_index(name="count")
#         .sort_values(by="count", ascending=False)
#     )

#     trending = issue_counts[issue_counts["count"] >= threshold]
#     if trending.empty:
#         print(f"No issues in {region} crossed threshold {threshold}.")
#         return None

#     print(f"Trending issues in {region}:")
#     return trending
# import pandas as pd

# def get_trending_issues(posts_df, region, threshold=2):
#     """
#     Find trending issues in a region based on post count above a threshold.
#     """
#     subset = posts_df[posts_df["location"].str.lower() == region.lower()]
#     if subset.empty:
#         print(f"No posts found for region: {region}")
#         return None

#     issue_counts = (
#         subset.groupby("issue_type")
#         .size()
#         .reset_index(name="count")
#         .sort_values(by="count", ascending=False)
#     )

#     trending = issue_counts[issue_counts["count"] >= threshold]
#     if trending.empty:
#         print(f"No issues in {region} crossed threshold {threshold}.")
#         return None

#     print(f"\nTrending issues in {region}:")
#     return trending

# import pandas as pd

# def get_trending_issues(posts_df, region, threshold=2):
#     # filter for region
#     subset = posts_df[posts_df["location"].str.lower() == region.lower()]
#     if subset.empty:
#         print(f"No posts found for region: {region}")
#         return None

#     # count by issue_type
#     issue_counts = (
#         subset.groupby("issue_type")
#         .size()
#         .reset_index(name="count")
#         .sort_values(by="count", ascending=False)
#     )

#     trending = issue_counts[issue_counts["count"] >= threshold]
#     if trending.empty:
#         print(f"No issues in {region} crossed threshold {threshold}.")
#         return None

#     return trending

import pandas as pd
def get_trending_issues(posts_df, region, threshold=2):
    subset = posts_df[posts_df["location"].str.lower() == region.lower()]
    if subset.empty:
        return None

    issue_counts = (
        subset.groupby("problem")
        .size()
        .reset_index(name="count")
        .sort_values(by="count", ascending=False)
    )

    trending = issue_counts[issue_counts["count"] >= threshold]
    if trending.empty:
        return None
    return trending