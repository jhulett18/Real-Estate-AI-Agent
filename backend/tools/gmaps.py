# tools/gmaps.py

import os
import googlemaps
from dotenv import load_dotenv
from langchain_core.tools import tool

# Load environment variables from .env file
load_dotenv()

# Grab the key from the environment
api_key = os.getenv("GOOGLE_MAPS_API_KEY")
# 💥 Safety check: fail early with clear error if key is missing
if not api_key:
    raise ValueError("GOOGLE_MAPS_API_KEY is missing. Make sure it's defined in your .env file!")

# ✅ Initialize the Google Maps client
gmaps = googlemaps.Client(key=api_key)

@tool
def get_neighborhood_info(address: str) -> dict:
    """
    Returns structured neighborhood data for a given address.
    """
    try:
        geocode = gmaps.geocode(address)
        if not geocode:
            return {"error": "Address not found."}

        location = geocode[0]["geometry"]["location"]
        latlng = (location["lat"], location["lng"])

        schools = gmaps.places_nearby(location=latlng, radius=1500, type="school")["results"]
        parks = gmaps.places_nearby(location=latlng, radius=1500, type="park")["results"]

        return {
            "address": address,
            "schools_nearby": len(schools),
            "parks_nearby": len(parks),
        }

    except Exception as e:
        return {"error": str(e)}



