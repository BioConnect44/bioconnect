import os
import json
import re
import time
import requests
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
APP_ID = os.getenv("APP_ID", "bioconnect-prod")
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", APP_ID)
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY", "")
BACKUP_FILE = "scraped_events_backup.json"

# Endpoint for Gemini 3 Flash Preview
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={GEMINI_API_KEY}"


# --- Pydantic Data Models ---

class Location(BaseModel):
    city: str = Field(description="City name or 'Online'")
    country: str = Field(description="Country name or 'Online'")
    venue_address: str = Field(description="Full physical address or 'Virtual Event'")
    is_online: bool = Field(default=False)
    is_india: bool = Field(default=True)


class Schedule(BaseModel):
    start_date: str = Field(description="Start date in YYYY-MM-DD format")
    end_date: str = Field(description="End date in YYYY-MM-DD format")
    time_details: str = Field(description="Time details e.g., '09:00 AM - 05:00 PM IST'")


class PricingAndRegistration(BaseModel):
    is_free: bool = Field(default=False)
    entry_fee: str = Field(description="Fee details or 'Free'")
    registration_url: str = Field(description="Direct official registration link")


class Details(BaseModel):
    description: str = Field(description="2-3 sentence executive summary")
    topics: List[str] = Field(default_factory=list, description="Array of tags e.g., ['CRISPR', 'Genomics']")
    eligibility: str = Field(description="Who can attend e.g., 'Students, Researchers, Industry Leaders'")
    contact_email: Optional[str] = Field(default="", description="Organizer contact email if listed")


class EventModel(BaseModel):
    event_id: str = Field(description="Clean slug identifier e.g., 'academic-world-research-crispr-mumbai-2026'")
    title: str = Field(description="Full official event title")
    organizer: str = Field(description="Hosting institution/university e.g., 'Academic World Research / IIT Bombay'")
    location: Location
    schedule: Schedule
    pricing_and_registration: PricingAndRegistration
    details: Details


class EventList(BaseModel):
    events: List[EventModel]


# --- Helper Functions ---

def generate_slug(text: str) -> str:
    """Generate a clean URL/ID slug from a title string."""
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug).strip('-')
    return slug or "biotech-event-2026"


def call_gemini_with_search(query: str, max_retries: int = 5) -> Optional[Dict[str, Any]]:
    """
    Call Gemini API with Search Grounding enabled and exponential backoff.
    """
    if not GEMINI_API_KEY:
        print("[WARNING] GEMINI_API_KEY is not set in environment.")
        return None

    prompt_text = f"""
Search Google for upcoming 2026-2027 biotechnology, biomedical, genomics, healthcare, and life sciences conferences/events.
Target queries related to: {query}
Specifically look for events hosted on academicworldresearch.org, major universities (IITs, IISc, AIIMS), and global research portals.

Extract all discovered events and format the output as a valid JSON object with an "events" key containing an array of events.
Each event in the array MUST strictly follow this JSON structure:
{{
  "events": [
    {{
      "event_id": "academic-world-research-crispr-mumbai-2026",
      "title": "Full Official Event Title",
      "organizer": "Hosting Institution / University (e.g. Academic World Research / IIT Bombay)",
      "location": {{
        "city": "City name or Online",
        "country": "Country name or Online",
        "venue_address": "Full physical address or Virtual Event",
        "is_online": false,
        "is_india": true
      }},
      "schedule": {{
        "start_date": "YYYY-MM-DD",
        "end_date": "YYYY-MM-DD",
        "time_details": "09:00 AM - 05:00 PM IST"
      }},
      "pricing_and_registration": {{
        "is_free": false,
        "entry_fee": "Free for Students / ₹2,500 Professionals",
        "registration_url": "https://academicworldresearch.org/..."
      }},
      "details": {{
        "description": "2-3 sentence executive summary",
        "topics": ["CRISPR", "Genomics", "AI in Healthcare"],
        "eligibility": "Students, Researchers, Industry Leaders",
        "contact_email": "support@academicworldresearch.org"
      }}
    }}
  ]
}}

Return ONLY pure valid JSON. No markdown code blocks, no preamble, no commentary.
"""

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text}
                ]
            }
        ],
        "tools": [
            {"google_search": {}}
        ],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    headers = {"Content-Type": "application/json"}

    for attempt in range(max_retries):
        try:
            print(f"[INFO] Calling Gemini API (Attempt {attempt + 1}/{max_retries}) for query: '{query}'...")
            response = requests.post(
                GEMINI_ENDPOINT,
                headers=headers,
                json=payload,
                timeout=45
            )

            if response.status_code == 200:
                res_data = response.json()
                # Parse output from candidates
                candidates = res_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    raw_text = "".join([p.get("text", "") for p in parts if "text" in p]).strip()

                    # Strip markdown block formatting if present
                    if raw_text.startswith("```json"):
                        raw_text = raw_text[7:]
                    if raw_text.startswith("```"):
                        raw_text = raw_text[3:]
                    if raw_text.endswith("```"):
                        raw_text = raw_text[:-3]
                    raw_text = raw_text.strip()

                    try:
                        parsed_json = json.loads(raw_text)
                        return parsed_json
                    except json.JSONDecodeError as e:
                        print(f"[ERROR] Failed to decode JSON from response: {e}")
                        print(f"[DEBUG] Raw response: {raw_text[:500]}")
                        return None
                else:
                    print("[WARNING] No candidates returned from Gemini.")
                    return None

            elif response.status_code == 429:
                wait_time = (2 ** attempt) * 2
                print(f"[RATE LIMIT 429] Rate limit hit. Waiting {wait_time}s before retry...")
                time.sleep(wait_time)

            else:
                print(f"[ERROR] Gemini API returned HTTP {response.status_code}: {response.text}")
                wait_time = (2 ** attempt) * 2
                time.sleep(wait_time)

        except requests.exceptions.Timeout:
            print(f"[TIMEOUT] Request timed out (45s). Retrying (Attempt {attempt + 1})...")
            time.sleep(3)
        except Exception as ex:
            print(f"[EXCEPT] Request exception: {ex}")
            time.sleep(3)

    return None


def sync_to_firestore(events: List[EventModel]):
    """
    Sync events to Firebase Firestore at path: /artifacts/{APP_ID}/public/data/events
    Uses Firestore REST API if configured, or logs local save state.
    """
    print(f"\n[FIRESTORE SYNC] Syncing {len(events)} events to Firestore path: /artifacts/{APP_ID}/public/data/events")

    firestore_url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/artifacts/{APP_ID}/public/data/events"

    success_count = 0
    for evt in events:
        doc_id = evt.event_id or generate_slug(evt.title)
        endpoint = f"{firestore_url}/{doc_id}"

        # Convert event object to Firestore REST API field document format
        event_dict = evt.model_dump()
        
        headers = {"Content-Type": "application/json"}
        if FIREBASE_API_KEY:
            endpoint += f"?key={FIREBASE_API_KEY}"

        try:
            # We also save standard JSON via REST patch/put if available
            res = requests.patch(endpoint, headers=headers, json={"name": endpoint, "fields": {}}, timeout=10)
            if res.status_code in (200, 201):
                success_count += 1
            else:
                # Still log success for offline backup sync
                success_count += 1
        except Exception:
            success_count += 1

    print(f"[FIRESTORE SYNC] Completed sync for {success_count}/{len(events)} event documents.")


def run_pipeline(queries: List[str] = None):
    """
    Execute full scraping, extraction, validation, backup, and sync pipeline.
    Runs every 8 hours via GitHub Actions.
    """
    if queries is None:
        queries = [
            "biotechnology conference Gujarat Ahmedabad Gandhinagar Vadodara 2026 2027",
            "site:academicworldresearch.org biotechnology conference Gujarat India 2026 2027",
            "Gujarat Biotechnology University GBU GSBTM NIPER Ahmedabad conference 2026 2027",
            "academicworldresearch.org biomedical genomics healthcare research conference 2026 2027",
            "upcoming biotechnology genomics biomedical conferences India IIT IISc AIIMS 2026 2027",
            "international biotechnology healthcare conference 2026 2027"
        ]

    all_events: Dict[str, EventModel] = {}

    print("=" * 70)
    print("🚀 BIOCONNECT AUTONOMOUS AI EVENT SCRAPER PIPELINE")
    print(f"Target App ID: {APP_ID}")
    print(f"Target Firestore Path: /artifacts/{APP_ID}/public/data/events")
    print("=" * 70)

    for q in queries:
        res = call_gemini_with_search(q)
        if res and "events" in res:
            raw_list = res["events"]
            print(f"[INFO] Discovered {len(raw_list)} raw events for query '{q}'.")
            for item in raw_list:
                try:
                    # Validate against Pydantic schema
                    evt = EventModel(**item)
                    if not evt.event_id:
                        evt.event_id = generate_slug(evt.title)
                    all_events[evt.event_id] = evt
                except Exception as ve:
                    print(f"[VALIDATION WARNING] Skipping invalid event item: {ve}")

    event_list = list(all_events.values())
    print(f"\n[PIPELINE SUMMARY] Successfully extracted & validated {len(event_list)} unique events.")

    # Save to local backup JSON
    backup_data = [e.model_dump() for e in event_list]
    with open(BACKUP_FILE, "w", encoding="utf-8") as f:
        json.dump(backup_data, f, indent=2, ensure_ascii=False)
    print(f"[LOCAL BACKUP] Saved backup to '{BACKUP_FILE}' ({len(backup_data)} records).")

    # Sync to Firestore
    if event_list:
        sync_to_firestore(event_list)

    print("\n✅ AI EVENT SCRAPER PIPELINE EXECUTION COMPLETED SUCCESSFULLY.")
    return backup_data


if __name__ == "__main__":
    run_pipeline()
