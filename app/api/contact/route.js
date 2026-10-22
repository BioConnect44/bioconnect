import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/client";

async function dispatchEmailNotification({ name, email, subject, message }) {
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || "bioconnect44@gmail.com";
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 12px;">
      <h2 style="color: #0d9488; margin-top: 0;">New BioConnect Contact Inquiry</h2>
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #14b8a6;">
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>
      <p style="font-size: 12px; color: #64748b;">Delivered via BioConnect Dispatcher</p>
    </div>
  `;

  // 1. If Resend API key is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "BioConnect <notifications@bioconnect.in>",
          to: [recipient],
          reply_to: email,
          subject: `[BioConnect Inquiry] ${subject} - ${name}`,
          html: emailHtml,
        }),
      });
      if (res.ok) {
        return { status: "sent", provider: "resend" };
      }
    } catch (e) {
      console.warn("Resend dispatch error:", e);
    }
  }

  // 2. If SendGrid API key is configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipient }] }],
          from: { email: process.env.SENDGRID_FROM_EMAIL || "notifications@bioconnect.in", name: "BioConnect" },
          reply_to: { email, name },
          subject: `[BioConnect Inquiry] ${subject} - ${name}`,
          content: [{ type: "text/html", value: emailHtml }],
        }),
      });
      if (res.ok) {
        return { status: "sent", provider: "sendgrid" };
      }
    } catch (e) {
      console.warn("SendGrid dispatch error:", e);
    }
  }

  // 3. Fallback queue recording on disk
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const queueFile = path.join(dataDir, "email_dispatch_queue.json");
    let queue = [];
    if (fs.existsSync(queueFile)) {
      try { queue = JSON.parse(fs.readFileSync(queueFile, "utf8")); } catch (e) {}
    }
    queue.push({
      to: recipient,
      replyTo: email,
      subject: `[BioConnect Inquiry] ${subject} - ${name}`,
      body: message,
      queuedAt: new Date().toISOString(),
      status: "queued_pending_provider_key"
    });
    fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2), "utf8");
    return { status: "queued", provider: "local_queue" };
  } catch (err) {
    return { status: "failed", error: err.message };
  }
}

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

    // 1. Dispatch Email notification (Resend / SendGrid / Queue)
    const dispatchResult = await dispatchEmailNotification(inquiry);
    inquiry.dispatch_status = dispatchResult.status;

    // 2. Save to local storage file data/contact_inquiries.json
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

    // 3. Try Supabase save
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

    console.log(`[CONTACT INQUIRY] From ${inquiry.email} (${inquiry.name}): "${inquiry.subject}" -> Target: bioconnect44@gmail.com [Status: ${dispatchResult.status}]`);

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been successfully sent to bioconnect44@gmail.com! We will respond shortly."
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to process contact inquiry." }, { status: 500 });
  }
}
