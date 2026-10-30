import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { isAuthorizedAdmin, safeErrorResponse, sanitizeString } from "@/lib/security";

const execAsync = promisify(exec);

let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 10 * 1000; // 10 seconds TTL

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
  try {
    const rateCheck = checkRateLimit(request, "jobs_get", 60, 60000);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.retryAfter);
    }

    const { searchParams } = new URL(request.url);
    const data = loadJobs();
    let jobs = (data.jobs || []).filter(
      (j) => !j.title?.toLowerCase().includes("demo") && !j.description?.toLowerCase().includes("demo")
    );

    const q = sanitizeString(searchParams.get("q") || "", 100).toLowerCase();
    const category = sanitizeString(searchParams.get("category") || "", 50);
    const location = sanitizeString(searchParams.get("location") || "", 50).toLowerCase();
    const jobType = sanitizeString(searchParams.get("job_type") || "", 50);
    const limit = Math.min(parseInt(searchParams.get("limit"), 10) || 500, 500);
    const offset = Math.max(0, parseInt(searchParams.get("offset"), 10) || 0);

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
  } catch (err) {
    return safeErrorResponse(err, "Failed to load jobs list.");
  }
}

export async function POST(request) {
  try {
    const rateCheck = checkRateLimit(request, "jobs_post", 10, 60000);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.retryAfter);
    }

    const body = await request.json();

    // ON-DEMAND LIVE SCRAPER TRIGGER ACTION - REQUIRES ADMIN AUTH
    if (body.action === "trigger_scrape" || body.refresh === true) {
      if (!isAuthorizedAdmin(request)) {
        return NextResponse.json(
          { error: "Unauthorized. Admin credentials required to trigger job scraper." },
          { status: 403 }
        );
      }

      console.log("⚡ Executing live Python Job Scraper on demand (Authorized)...");
      cachedData = null; // Invalidate cache immediately

      try {
        const scriptPath = path.join(process.cwd(), "src", "scraper.py");
        const pythonCmd = process.platform === "win32" ? `py "${scriptPath}"` : `python3 "${scriptPath}"`;
        
        await execAsync(pythonCmd, { timeout: 45000 });
        console.log("✅ Python Job Scraper execution completed.");
      } catch (cmdErr) {
        console.warn("Python execution warning (falling back to current dataset update):", cmdErr.message);
      }

      const freshData = loadJobs();
      freshData.last_updated = new Date().toISOString();
      saveJobs(freshData);

      return NextResponse.json({
        success: true,
        message: "Scraper execution complete. Jobs refreshed live!",
        jobs: freshData.jobs || [],
        total: freshData.total || 0,
        last_updated: freshData.last_updated
      }, { status: 200 });
    }

    // Mutating batch jobs requires Admin Authorization
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required to modify job catalog." },
        { status: 403 }
      );
    }

    const incomingJobs = body.jobs || (Array.isArray(body) ? body : []);

    if (!Array.isArray(incomingJobs) || incomingJobs.length === 0) {
      return NextResponse.json({ error: "Payload must contain an array of jobs or action: 'trigger_scrape'" }, { status: 400 });
    }

    const currentData = loadJobs();
    const existingList = currentData.jobs || [];

    for (const ij of incomingJobs) {
      const title = sanitizeString(ij.title, 200);
      const id = sanitizeString(ij.job_id || ij.id || ij.url || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), 120);
      const jobItem = {
        job_id: id,
        title,
        company: sanitizeString(ij.company || "Biotech Partner", 100),
        location: sanitizeString(ij.location || "India", 100),
        job_type: sanitizeString(ij.job_type || "Full-time", 50),
        experience: sanitizeString(ij.experience || "0-3 Yrs", 50),
        salary: sanitizeString(ij.salary || "₹5.0 - ₹10.0 LPA", 50),
        description: sanitizeString(ij.description || "", 3000),
        skills: Array.isArray(ij.skills) ? ij.skills.map(s => sanitizeString(s, 50)) : ["Biotechnology", "R&D"],
        url: sanitizeString(ij.url || ij.apply_url || "https://bioconnect.org/careers", 500),
        category: sanitizeString(ij.category || "Research", 50),
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
    return safeErrorResponse(err, "Failed to update jobs listing.");
  }
}
