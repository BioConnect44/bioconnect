import { NextResponse } from "next/server";

const SYSTEM_KNOWLEDGE = {
  research: `BioConnect's PubMed AI Summarizer lets you search any biotech or medical topic (e.g. "CRISPR Therapeutics", "mRNA Vaccines", "Cell & Gene Therapy"). It fetches primary peer-reviewed literature from NCBI PubMed, extracts full XML abstracts, and generates structured 7-Part Schema summaries (Metadata, Executive Takeaway, Background & Objective, Methodology, Key Results, Significance, Limitations) with 5 points per section. Click "Read Full Paper 📄" on any card to open the Literature Viewer with dual-pane PDF reading, local PDF drag-and-drop upload, text highlighting, notes, and AI Copilot Q&A.`,

  biominute: `BioMinute delivers daily 60-second video summaries and micro-learning insights covering breaking breakthroughs in synthetic biology, gene editing, oncology, and pharmaceuticals. You can watch short clips, save notes, and track your daily streak on the BioMinute page.`,

  jobs: `The Jobs Board connects students and researchers with top biotechnology companies, university labs, and pharmaceutical firms. Filter positions by role (Internship, Research Associate, Postdoc, Industry Lead), search keywords, and apply directly with 1-click using your BioConnect profile.`,

  learning: `The Learning Hub offers self-paced courses, interactive quizzes, and micro-credentials in molecular biology, bioinformatics, regulatory affairs, and biomanufacturing. Complete courses to earn verified certificates displayed on your profile.`,

  events: `The Events page hosts live academic webinars, industry symposiums, and networking roundtables. Register for upcoming events, view speaker details, and receive automated calendar reminders.`,

  profile: `Your BioConnect Profile highlights your academic degree, research interests, university affiliations, reading history, saved paper notes, and earned certificates. You can edit your profile information on the /profile page.`,

  general: `BioConnect is a 100% free, all-in-one platform for life sciences students, researchers, and professionals to explore PubMed literature, watch BioMinutes, find jobs, join events, and advance their biotech careers.`
};

function generateSupportAnswer(query) {
  const q = query.toLowerCase();

  if (q.includes("pubmed") || q.includes("paper") || q.includes("research") || q.includes("summary") || q.includes("pdf") || q.includes("viewer")) {
    return `### 🔬 PubMed AI & Literature Viewer Guide

- **How to Search**: Go to the **Research** page (/research) and type any topic (e.g. *"CRISPR-Cas9"*, *"Gene Therapy"*).
- **7-Part AI Summary**: Each paper generates a structured 7-part schema with 5 key points per section covering background, methodology, results, and limitations.
- **Reading Full Papers**: Click **"Read Full Paper 📄"** to open the dual-pane viewer.
- **PDF Upload**: If a publisher restricts direct streaming, drag and drop your local or institutional PDF file into the reader dropzone.
- **AI Copilot & Notes**: Highlight any sentence in the paper to get instant AI explanations, add color highlights, or ask AI Copilot questions in real time.`;
  }

  if (q.includes("biominute") || q.includes("video") || q.includes("daily") || q.includes("minute")) {
    return `### 🧬 BioMinute Micro-Learning

- **Daily Insights**: Watch short 60-second video summaries of breaking biotech discoveries.
- **Streak Tracking**: Maintain a daily learning streak by watching new daily episodes.
- **Interactive Notes**: Save personal key takeaways from each video directly to your profile database.`;
  }

  if (q.includes("job") || q.includes("internship") || q.includes("career") || q.includes("apply") || q.includes("hire")) {
    return `### 💼 Jobs & Career Opportunities

- **Find Roles**: Visit the **Jobs** page (/jobs) to explore internships, research assistantships, and industry jobs from top biotech companies.
- **Smart Filters**: Filter by experience level, location, salary range, or research field.
- **1-Click Application**: Apply directly using your verified BioConnect student or researcher profile.`;
  }

  if (q.includes("learn") || q.includes("course") || q.includes("quiz") || q.includes("certificate")) {
    return `### 🎓 Learning Hub & Courses

- **Interactive Modules**: Complete structured modules in CRISPR technology, bioinformatics, bioprocessing, and drug discovery.
- **Certificates**: Pass end-of-course quizzes to earn verified BioConnect digital certificates.
- **Progress Sync**: Your learning progress is automatically saved to your Supabase account.`;
  }

  if (q.includes("event") || q.includes("webinar") || q.includes("symposium") || q.includes("register")) {
    return `### 📅 Events & Academic Webinars

- **Upcoming Events**: Browse live webinars, workshops, and virtual symposiums on the **Events** page (/events).
- **One-Click Registration**: Click **"Register Now"** to secure your spot.
- **Calendar Integration**: Sync event dates directly with Google Calendar or Outlook.`;
  }

  if (q.includes("profile") || q.includes("account") || q.includes("password") || q.includes("login") || q.includes("email")) {
    return `### 👤 Account & Profile Management

- **Edit Profile**: Go to the **Profile** page (/profile) to update your bio, university, degree, and research field.
- **Saved Literature & Notes**: Access all your bookmarked papers, highlight notes, and reading history from your profile dashboard.
- **Security & RLS**: All your personal data and notes are secured using Supabase Row Level Security (RLS).`;
  }

  // Universal Support Response
  return `### 💬 BioConnect AI Support Assistant

Regarding **"${query}"**:

- **Platform Overview**: BioConnect connects you with PubMed AI literature summaries, 60-second BioMinutes, biotech jobs, academic events, and interactive learning.
- **Quick Links**:
  • **Research**: Search PubMed literature at /research
  • **BioMinute**: Watch daily video insights at /biominute
  • **Jobs**: Explore open roles at /jobs
  • **Learning**: Complete courses at /learning
  • **Events**: Join webinars at /events
- **Contact Support**: If you need human assistance, email our support team at **support@bioconnect.ai**.`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const query = (body.query || body.question || "").trim();

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const answer = generateSupportAnswer(query);

    return NextResponse.json({
      success: true,
      query,
      answer
    }, { status: 200 });

  } catch (err) {
    console.error("Help Center API Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
