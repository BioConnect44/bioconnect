import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/client";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { isValidEmail, safeErrorResponse, sanitizeString } from "@/lib/security";

export async function POST(request) {
  try {
    const rateCheck = checkRateLimit(request, "newsletter_post", 5, 60000);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.retryAfter);
    }

    const body = await request.json();
    const rawEmail = sanitizeString(body.email, 150).toLowerCase();

    if (!rawEmail || !isValidEmail(rawEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const record = { email: rawEmail, timestamp, target_owner: "bioconnect44@gmail.com" };

    // 1. Save to local storage file data/newsletter_subscribers.json
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, "newsletter_subscribers.json");
      let subscribers = [];
      if (fs.existsSync(filePath)) {
        try {
          const fileData = fs.readFileSync(filePath, "utf8");
          subscribers = JSON.parse(fileData);
        } catch (e) {
          subscribers = [];
        }
      }
      if (!subscribers.some((s) => s.email === rawEmail)) {
        subscribers.push(record);
        fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2), "utf8");
      }
    } catch (fsErr) {
      console.warn("File storage warning:", fsErr.message);
    }

    // 2. Try Supabase save if client available
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("newsletter_subscribers").insert([
          { email: rawEmail, created_at: timestamp, notification_email: "bioconnect44@gmail.com" }
        ]);
      }
    } catch (spErr) {
      // Supabase table optional fallback
    }

    return NextResponse.json({
      success: true,
      message: `Thank you for subscribing! Biotech updates will be sent to ${rawEmail}.`
    });
  } catch (error) {
    return safeErrorResponse(error, "Failed to process newsletter subscription. Please try again.");
  }
}
