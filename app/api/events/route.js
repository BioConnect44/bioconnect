import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { isAuthorizedAdmin, safeErrorResponse, sanitizeString } from "@/lib/security";

const execAsync = promisify(exec);

function isValidRegistrationUrl(url) {
  if (!url || typeof url !== "string") return false;
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const pathStr = parsed.pathname.replace(/\/$/, "");
    
    if (
      host.includes("unstop.com") ||
      host.includes("eventbrite.com") ||
      host.includes("ccamp.res.in") ||
      host.includes("10times.com") ||
      host.includes("birac.nic.in") ||
      host.includes("iisc.ac.in") ||
      host.includes("ncbs.res.in") ||
      host.includes("iitb.ac.in") ||
      host.includes("ableindia.in")
    ) {
      return true;
    }

    if (!pathStr || pathStr.length < 5 || ["/home", "/index", "/index.html", "/index.php"].includes(pathStr)) {
      if (!parsed.search || parsed.search.length < 5) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

function getLocalEvents() {
  try {
    const filePath = path.join(process.cwd(), "public", "events.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) || [];
    }
  } catch (e) {
    console.error("Local events read error:", e);
  }
  return [];
}

function saveLocalEvents(events) {
  try {
    const filePath = path.join(process.cwd(), "public", "events.json");
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2), "utf-8");
  } catch (e) {
    console.error("Local events write error:", e);
  }
}

export async function GET(req) {
  try {
    const rateCheck = checkRateLimit(req, "events_get", 60, 60000);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.retryAfter);
    }

    const local = getLocalEvents();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let dbEvents = [];
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase.from("events").select("*, profiles(full_name)").order("event_date", { ascending: true });
        if (data && data.length > 0) dbEvents = data;
      } catch (e) {}
    }

    const combined = [...dbEvents];
    local.forEach(le => {
      if (!combined.some(e => e.id === le.id || e.title === le.title)) {
        combined.push(le);
      }
    });

    combined.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    return NextResponse.json({ events: combined, total: combined.length, last_updated: new Date().toISOString() }, { status: 200 });
  } catch (err) {
    return safeErrorResponse(err, "Failed to retrieve events. Please try again later.");
  }
}

export async function POST(req) {
  try {
    const rateCheck = checkRateLimit(req, "events_post", 10, 60000);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.retryAfter);
    }

    const body = await req.json();

    // LIVE EVENT SCRAPER TRIGGER ACTION - REQUIRE ADMIN/CRON AUTH
    if (body.action === "trigger_scrape" || body.refresh === true) {
      if (!isAuthorizedAdmin(req)) {
        return NextResponse.json(
          { error: "Unauthorized. Admin authentication required to trigger live scrapers." },
          { status: 403 }
        );
      }

      console.log("⚡ Executing live Python Event Scraper on demand (Authorized)...");
      try {
        const scriptPath = path.join(process.cwd(), "ai_event_scraper.py");
        const pythonCmd = process.platform === "win32" ? `py "${scriptPath}"` : `python3 "${scriptPath}"`;
        await execAsync(pythonCmd, { timeout: 30000 });
        console.log("✅ Python Event Scraper execution completed.");
      } catch (cmdErr) {
        console.warn("Python event scraper warning:", cmdErr.message);
      }

      const freshLocal = getLocalEvents();
      return NextResponse.json({
        success: true,
        message: "Event scraper execution complete. Events refreshed live!",
        events: freshLocal,
        total: freshLocal.length
      }, { status: 200 });
    }

    // Mutating batch events requires Admin Authorization
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required to modify event catalog." },
        { status: 403 }
      );
    }

    const { events } = body;

    if (!events || !Array.isArray(events)) {
      return NextResponse.json({ error: "Payload must contain an 'events' array" }, { status: 400 });
    }

    const local = getLocalEvents();
    const insertedEvents = [];
    const skippedEvents = [];

    for (const evt of events) {
      const regUrl = evt.pricing_and_registration?.registration_url || evt.registration_url;
      
      if (!isValidRegistrationUrl(regUrl)) {
        skippedEvents.push({ title: sanitizeString(evt.title, 100), reason: "Invalid homepage or root domain link" });
        continue;
      }

      const title = sanitizeString(evt.title, 200);
      const eventPayload = {
        id: sanitizeString(evt.event_id || evt.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), 120),
        title,
        description: sanitizeString(evt.details?.description || evt.description || "", 2000),
        event_type: sanitizeString(evt.event_type || "conference", 50),
        location: sanitizeString(evt.location?.venue_address || evt.location || "Online", 200),
        region: evt.location?.is_india ? (evt.location?.city === "Gandhinagar" || evt.location?.city === "Ahmedabad" ? "gujarat" : "india") : "global",
        event_date: evt.schedule?.start_date ? `${evt.schedule.start_date}T09:00:00.000Z` : evt.event_date,
        end_date: evt.schedule?.end_date ? `${evt.schedule.end_date}T17:00:00.000Z` : evt.end_date || null,
        registration_url: regUrl,
        entry_fee: sanitizeString(evt.pricing_and_registration?.entry_fee || evt.entry_fee || "Free Registration", 60),
        profiles: { full_name: sanitizeString(evt.organizer || evt.profiles?.full_name || "BioConnect Academic Network", 100) },
        created_at: new Date().toISOString()
      };

      if (!local.some(l => l.id === eventPayload.id || l.title === eventPayload.title)) {
        local.push(eventPayload);
      } else {
        const idx = local.findIndex(l => l.id === eventPayload.id || l.title === eventPayload.title);
        if (idx !== -1) local[idx] = { ...local[idx], ...eventPayload };
      }

      insertedEvents.push(eventPayload);
    }

    saveLocalEvents(local);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        for (const ep of insertedEvents) {
          await supabase.from("events").upsert(ep, { onConflict: "title" });
        }
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: `Scraper pipeline auto-sync complete. Added/Updated ${insertedEvents.length} events.`,
      inserted_count: insertedEvents.length,
      skipped_count: skippedEvents.length,
      skipped_events: skippedEvents
    }, { status: 200 });

  } catch (err) {
    return safeErrorResponse(err, "Failed to process event update payload.");
  }
}
