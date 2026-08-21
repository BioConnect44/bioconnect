import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function isValidRegistrationUrl(url) {
  if (!url || typeof url !== "string") return false;
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, "");
    if (!path || path.length < 5 || ["/home", "/index", "/index.html", "/index.php"].includes(path)) {
      if (!parsed.search || parsed.search.length < 5) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function GET(req) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ events: [] }, { status: 200 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("events")
      .select("*, profiles(full_name)")
      .order("event_date", { ascending: true });

    if (error) {
      return NextResponse.json({ events: [], error: error.message }, { status: 200 });
    }

    return NextResponse.json({ events: data || [] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ events: [], error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { events } = body;

    if (!events || !Array.isArray(events)) {
      return NextResponse.json({ error: "Payload must contain an 'events' array" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const insertedEvents = [];
    const skippedEvents = [];

    for (const evt of events) {
      const regUrl = evt.pricing_and_registration?.registration_url || evt.registration_url;
      
      if (!isValidRegistrationUrl(regUrl)) {
        skippedEvents.push({ title: evt.title, reason: "Invalid homepage or root domain link" });
        continue;
      }

      const eventPayload = {
        title: evt.title,
        description: evt.details?.description || evt.description || "",
        event_type: evt.event_type || "conference",
        location: evt.location?.venue_address || evt.location || "Online",
        region: evt.location?.is_india ? (evt.location?.city === "Gandhinagar" || evt.location?.city === "Ahmedabad" ? "gujarat" : "india") : "global",
        event_date: evt.schedule?.start_date ? `${evt.schedule.start_date}T09:00:00.000Z` : evt.event_date,
        end_date: evt.schedule?.end_date ? `${evt.schedule.end_date}T17:00:00.000Z` : evt.end_date || null,
        registration_url: regUrl,
        entry_fee: evt.pricing_and_registration?.entry_fee || evt.entry_fee || "Free Registration",
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from("events").upsert(eventPayload, { onConflict: "title" }).select();
      if (!error && data) {
        insertedEvents.push(data[0]);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraper pipeline auto-sync complete. Added/Updated ${insertedEvents.length} new events.`,
      inserted_count: insertedEvents.length,
      skipped_count: skippedEvents.length,
      skipped_events: skippedEvents
    }, { status: 200 });

  } catch (err) {
    console.error("API Event Scraper Ingestion Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
