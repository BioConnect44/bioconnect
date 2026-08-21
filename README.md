# 🧬 BioConnect

**India's Biotech Academic Platform**

BioConnect is a SaaS-based web platform designed to connect biotechnology students, educators, and researchers in a single ecosystem. It simplifies access to learning resources and research content while enabling academic collaboration.

> 🔗 **Live:** [bioconnect-lemon.vercel.app](https://bioconnect-lemon.vercel.app)

---

## Features

- **Role-Based Authentication** — Sign up as Student, Educator, or Researcher with email verification
- **Learning Hub** — Subject-wise PDF notes uploaded by educators, accessible to all users
- **Research Papers** — Browse, search, and add research papers with metadata (title, authors, journal, topic)
- **Events** — Create and browse biotech conferences, webinars, workshops, and hackathons
- **User Profiles** — View and edit personal details, university, and bio
- **Role-Based Access** — Educators can upload/delete content; students can view and learn
- **Real-Time Stats** — Landing page shows live user count, paper count, and event count
- **Automated AI Event Scraper** — Nightly automated scraping of 2026-2027 biotech conferences powered by Gemini 3 Flash Search Grounding

---

## Tech Stack

| Layer              | Technology                           |
| ------------------ | ------------------------------------ |
| Frontend           | Next.js 16, React 19, Tailwind CSS 4 |
| Backend & Database | Supabase (PostgreSQL) & Firebase     |
| AI Pipeline        | Python 3.11, Google Gemini 3 Flash   |
| Authentication     | Supabase Auth (Email/Password)       |
| Hosting & CI/CD    | Vercel, GitHub Actions               |

---

## Project Structure

```
bioconnect/
├── app/
│   ├── page.js              # Landing page
│   ├── layout.js             # Root layout with metadata
│   ├── dashboard/page.js      # Role-based dashboard
│   ├── learning/page.js       # Learning Hub (PDF notes)
│   ├── research/page.js       # Research Papers
│   ├── events/page.js         # Events & Conferences
│   └── profile/page.js        # User Profile
├── ai_event_scraper.py      # Automated Gemini 3 Flash AI Event Scraper
├── requirements.txt         # Python dependencies for scraper pipeline
├── .env.example             # Environment variables template
├── .github/
│   └── workflows/
│       └── daily_scraper.yml # GitHub Actions workflow (00:00 UTC)
└── package.json
```

---

## 🤖 Automated AI Event Scraper Pipeline

BioConnect includes an autonomous Python pipeline that leverages **Google Gemini 3 Flash** (`gemini-3-flash-preview`) with **Google Search Grounding** enabled to automatically discover, extract, and structure 2026–2027 biotech, biomedical, genomics, and healthcare events/conferences.

### Key Capabilities:
- **Target Sources:** `academicworldresearch.org`, major Indian universities (IITs, IISc, AIIMS), and global research portals.
- **Strict Extraction Schema:** Extracts `event_id`, `title`, `organizer`, `location` (city, country, venue, is_online, is_india), `schedule` (start_date, end_date, time_details), `pricing_and_registration`, and `details` (description, topics, eligibility, contact_email).
- **Rate Limit & Timeout Resiliency:** Built-in exponential backoff retry loop for HTTP 429 errors and 45-second request timeouts.
- **Firestore & Local Backup:** Syncs events to Firestore path `/artifacts/{APP_ID}/public/data/events` and writes a local backup to `scraped_events_backup.json`.

### GitHub Repository Secrets Setup:

To enable the daily GitHub Action (`.github/workflows/daily_scraper.yml`), add the following secrets under **Settings > Secrets and variables > Actions**:

| Secret Name | Description | Required |
| ----------- | ----------- | -------- |
| `GEMINI_API_KEY` | Your Google Gemini API Key | **Yes** |
| `APP_ID` | Target App ID (e.g., `bioconnect-prod`) | **Yes** |
| `FIREBASE_PROJECT_ID` | Firebase Project ID | Optional |
| `FIREBASE_API_KEY` | Firebase Web API Key | Optional |

### Running Locally:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Fill in your GEMINI_API_KEY in .env

# 3. Run the scraper
python ai_event_scraper.py
```

---

## License

This project is private and not open-source.
