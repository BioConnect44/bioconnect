import json
from ai_event_scraper import EventModel, Location, Schedule, PricingAndRegistration, Details, sync_to_firestore, generate_slug, BACKUP_FILE

print("=" * 70)
print("[TEST] TESTING MOCK PIPELINE RUN & FIRESTORE SCHEMA COMPLIANCE")
print("=" * 70)

# Sample mock events matching Academic World Research & 2026-2027 Biotech Conference targets
sample_events_data = [
    {
        "event_id": "academic-world-research-crispr-mumbai-2026",
        "title": "International Conference on CRISPR and Genome Editing Technologies (ICCGET 2026)",
        "organizer": "Academic World Research / IIT Bombay",
        "location": {
            "city": "Mumbai",
            "country": "India",
            "venue_address": "IIT Bombay Campus, Powai, Mumbai, Maharashtra 400076",
            "is_online": False,
            "is_india": True
        },
        "schedule": {
            "start_date": "2026-09-15",
            "end_date": "2026-09-17",
            "time_details": "09:00 AM - 05:00 PM IST"
        },
        "pricing_and_registration": {
            "is_free": False,
            "entry_fee": "Free for Students / ₹2,500 Professionals",
            "registration_url": "https://academicworldresearch.org/event/index.php?id=1849201"
        },
        "details": {
            "description": "Premier international gathering of genomics researchers and biotechnology engineers discussing recent advancements in CRISPR-Cas9 base editing, prime editing, and therapeutic delivery platforms.",
            "topics": ["CRISPR", "Genomics", "Base Editing", "Gene Therapy"],
            "eligibility": "Students, Researchers, Faculty, and Industry Professionals",
            "contact_email": "info@academicworldresearch.org"
        }
    },
    {
        "event_id": "academic-world-research-biomedical-delhi-2026",
        "title": "World Congress on Biomedical Engineering and Healthcare AI (WCBHAI 2026)",
        "organizer": "Academic World Research / AIIMS New Delhi",
        "location": {
            "city": "New Delhi",
            "country": "India",
            "venue_address": "AIIMS Campus Auditorium, Ansari Nagar, New Delhi 110029",
            "is_online": False,
            "is_india": True
        },
        "schedule": {
            "start_date": "2026-11-04",
            "end_date": "2026-11-06",
            "time_details": "08:30 AM - 06:00 PM IST"
        },
        "pricing_and_registration": {
            "is_free": False,
            "entry_fee": "₹1,500 Students / ₹4,000 Delegates",
            "registration_url": "https://academicworldresearch.org/event/index.php?id=1938210"
        },
        "details": {
            "description": "Leading conference bringing together biomedical scientists, clinical researchers, and AI engineers to explore artificial intelligence applications in clinical diagnostics and drug discovery.",
            "topics": ["Biomedical Engineering", "AI in Healthcare", "Clinical Diagnostics", "Precision Medicine"],
            "eligibility": "Biomedical Scientists, Clinicians, Researchers, Students",
            "contact_email": "contact@academicworldresearch.org"
        }
    },
    {
        "event_id": "global-genomics-biotech-summit-virtual-2027",
        "title": "Global Virtual Summit on Synthetic Biology & Biomanufacturing 2027",
        "organizer": "International Society of Biotechnology & Life Sciences",
        "location": {
            "city": "Online",
            "country": "Online",
            "venue_address": "Virtual Event Platform (Zoom & Webex Live)",
            "is_online": True,
            "is_india": False
        },
        "schedule": {
            "start_date": "2027-02-20",
            "end_date": "2027-02-22",
            "time_details": "10:00 AM - 04:00 PM UTC"
        },
        "pricing_and_registration": {
            "is_free": True,
            "entry_fee": "Free Virtual Access",
            "registration_url": "https://academicworldresearch.org/event/index.php?id=2049102"
        },
        "details": {
            "description": "A 3-day global virtual event featuring keynote lectures from Nobel laureates and industry pioneers on metabolic engineering, microbial cell factories, and bioprocess scaling.",
            "topics": ["Synthetic Biology", "Biomanufacturing", "Metabolic Engineering", "Bioprocess"],
            "eligibility": "Global Academic Community and Industry Leaders",
            "contact_email": "support@isbls-symposium.org"
        }
    }
]

# 1. Validate Pydantic Models
validated_events = []
for item in sample_events_data:
    evt = EventModel(**item)
    validated_events.append(evt)
    print(f"[OK] Validated Event: {evt.title} ({evt.event_id})")

# 2. Test Local Backup Generation
backup_json = [e.model_dump() for e in validated_events]
with open(BACKUP_FILE, "w", encoding="utf-8") as f:
    json.dump(backup_json, f, indent=2, ensure_ascii=False)

print(f"\n[FILE OK] Saved backup JSON file to: '{BACKUP_FILE}' ({len(backup_json)} items)")

# 3. Test Firestore Sync logic
sync_to_firestore(validated_events)

print("\n[SUCCESS] ALL MOCK RUN TESTS PASSED SUCCESSFULLY!")
