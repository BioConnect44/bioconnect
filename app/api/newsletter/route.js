import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/client";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const timestamp = new Date().toISOString();
    const record = { email: cleanEmail, timestamp, target_owner: "bioconnect44@gmail.com" };

    // 1. Save to local storage file data/newsletter_subscribers.json
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: True });
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
      if (!subscribers.some((s) => s.email === cleanEmail)) {
        subscribers.push(record);
        fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2), "utf8");
      }
    } catch (fsErr) {
      console.warn("File storage error:", fsErr);
    }

    // 2. Try Supabase save if client available
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("newsletter_subscribers").insert([
          { email: cleanEmail, created_at: timestamp, notification_email: "bioconnect44@gmail.com" }
        ]);
      }
    } catch (spErr) {
      // Supabase table optional fallback
    }

    console.log(`[NEWSLETTER SUBMITTED] ${cleanEmail} -> Forwarding to bioconnect44@gmail.com`);

    return NextResponse.json({
      success: true,
      message: `Thank you for subscribing! Updates will be sent to ${cleanEmail} and logged for bioconnect44@gmail.com.`
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Failed to process newsletter subscription." }, { status: 500 });
  }
}
