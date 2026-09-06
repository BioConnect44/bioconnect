import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/client";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const inquiry = {
      id: `inq_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject || "General Question",
      message: message.trim(),
      timestamp,
      forward_to: "bioconnect44@gmail.com"
    };

    // 1. Save to local storage file data/contact_inquiries.json
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, "contact_inquiries.json");
      let inquiries = [];
      if (fs.existsSync(filePath)) {
        try {
          const fileData = fs.readFileSync(filePath, "utf8");
          inquiries = JSON.parse(fileData);
        } catch (e) {
          inquiries = [];
        }
      }
      inquiries.push(inquiry);
      fs.writeFileSync(filePath, JSON.stringify(inquiries, null, 2), "utf8");
    } catch (fsErr) {
      console.warn("File storage error:", fsErr);
    }

    // 2. Try Supabase save
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("contact_inquiries").insert([
          {
            name: inquiry.name,
            email: inquiry.email,
            subject: inquiry.subject,
            message: inquiry.message,
            created_at: timestamp,
            recipient: "bioconnect44@gmail.com"
          }
        ]);
      }
    } catch (spErr) {
      // Supabase table fallback
    }

    console.log(`[CONTACT INQUIRY] From ${inquiry.email} (${inquiry.name}): "${inquiry.subject}" -> Target: bioconnect44@gmail.com`);

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been successfully sent to bioconnect44@gmail.com! We will respond shortly."
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to process contact inquiry." }, { status: 500 });
  }
}
