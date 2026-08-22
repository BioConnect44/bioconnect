import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 30 * 1000; // 30 seconds TTL for fast updates

function loadJobs() {
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_TTL) {
    return cachedData;
  }
  try {
    const filePath = path.join(process.cwd(), "public", "jobs.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      cachedData = JSON.parse(raw);
      cacheTime = now;
      return cachedData;
    }
  } catch (err) {
    console.error("Failed to load jobs.json:", err.message);
  }
  return { jobs: [], total: 0, last_updated: null };
}

function saveJobs(data) {
  try {
    const filePath = path.join(process.cwd(), "public", "jobs.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    cachedData = data;
    cacheTime = Date.now();
  } catch (err) {
    console.error("Failed to save jobs.json:", err.message);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const data = loadJobs();
  let jobs = data.jobs || [];

  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const category = searchParams.get("category") || "";
  const location = (searchParams.get("location") || "").toLowerCase();
  const jobType = searchParams.get("job_type") || "";
  const limit = Math.min(parseInt(searchParams.get("limit")) || 100, 500);
  const offset = parseInt(searchParams.get("offset")) || 0;

  if (q) {
    jobs = jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.skills?.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (category) jobs = jobs.filter((j) => j.category === category);
  if (location) jobs = jobs.filter((j) => j.location?.toLowerCase().includes(location));
  if (jobType) jobs = jobs.filter((j) => j.job_type === jobType);

  const total = jobs.length;
  const paged = jobs.slice(offset, offset + limit);

  return NextResponse.json(
    {
      jobs: paged,
      total,
      limit,
      offset,
      has_more: offset + limit < total,
      last_updated: data.last_updated || new Date().toISOString(),
      next_update: data.next_update || null,
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const incomingJobs = body.jobs || (Array.isArray(body) ? body : []);

    if (!Array.isArray(incomingJobs) || incomingJobs.length === 0) {
      return NextResponse.json({ error: "Payload must contain an array of jobs" }, { status: 400 });
    }

    const currentData = loadJobs();
    const existingList = currentData.jobs || [];

    for (const ij of incomingJobs) {
      const id = ij.job_id || ij.id || ij.url || ij.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const jobItem = {
        job_id: id,
        title: ij.title,
        company: ij.company || "Biotech Partner",
        location: ij.location || "India",
        job_type: ij.job_type || "Full-time",
        experience: ij.experience || "0-3 Yrs",
        salary: ij.salary || "₹5.0 - ₹10.0 LPA",
        description: ij.description || "",
        skills: ij.skills || ["Biotechnology", "R&D"],
        url: ij.url || ij.apply_url || "https://bioconnect.org/careers",
        category: ij.category || "Research",
        scraped_at: new Date().toISOString()
      };

      const idx = existingList.findIndex(e => e.job_id === id || e.title === jobItem.title);
      if (idx !== -1) {
        existingList[idx] = { ...existingList[idx], ...jobItem };
      } else {
        existingList.unshift(jobItem);
      }
    }

    const newData = {
      jobs: existingList,
      total: existingList.length,
      last_updated: new Date().toISOString()
    };

    saveJobs(newData);

    return NextResponse.json({
      success: true,
      message: `Job scraper API sync complete. Updated ${incomingJobs.length} listings.`,
      total_jobs: existingList.length,
      last_updated: newData.last_updated
    }, { status: 200 });

  } catch (err) {
    console.error("Job Scraper API POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}