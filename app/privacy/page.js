"use client";

import { useState } from "react";
import PublicNavbarFooter from "@/components/PublicNavbarFooter";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("collection");

  const sections = [
    { id: "collection", title: "1. Information We Collect" },
    { id: "usage", title: "2. How We Use Your Data" },
    { id: "security", title: "3. Research & Data Security" },
    { id: "cookies", title: "4. Cookies & Academic Analytics" },
    { id: "rights", title: "5. Student Privacy Rights & Controls" },
    { id: "thirdparty", title: "6. Data Sharing & Third Parties" },
    { id: "contact", title: "7. Compliance & Contact Info" }
  ];

  return (
    <PublicNavbarFooter>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* PAGE HEADER */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E0F2FE", color: "#0369A1", padding: "6px 16px", borderRadius: 100, fontSize: "0.85rem", fontWeight: 700, marginBottom: 16 }}>
            <span>🔒 Official Legal Documentation</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, color: "#102A30", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            BioConnect Privacy Policy
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748B" }}>
            Effective Date: March 1, 2026 • Compliant with Indian Digital Personal Data Protection (DPDP) Act & International Privacy Standards
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 36, alignItems: "start" }}>
          {/* SIDEBAR NAVIGATION */}
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1.5px solid #E2EEF0", padding: 20, position: "sticky", top: 90 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#2AB4B4", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, paddingLeft: 8 }}>
              Table of Contents
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    background: activeSection === sec.id ? "#E0F2FE" : "transparent",
                    color: activeSection === sec.id ? "#0369A1" : "#475569",
                    fontWeight: activeSection === sec.id ? 700 : 500,
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN PRIVACY POLICY CONTENT */}
          <div style={{ background: "#FFFFFF", borderRadius: 24, border: "1.5px solid #E2EEF0", padding: "40px 44px", color: "#102A30", lineHeight: 1.8 }}>
            {/* Intro */}
            <div style={{ marginBottom: 36, paddingBottom: 24, borderBottom: "1px solid #E2EEF0" }}>
              <p style={{ fontSize: "1rem", color: "#334155", margin: 0 }}>
                Welcome to <strong>BioConnect</strong>. We respect your privacy and are committed to safeguarding the personal data of students, researchers, educators, and institutional partners who use our academic platform. This policy details how we collect, process, and protect your information.
              </p>
            </div>

            {/* Section 1 */}
            <section id="collection" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                1. Information We Collect
              </h2>
              <p style={{ color: "#475569", marginBottom: 12 }}>
                We collect personal information necessary to deliver personalized academic research, course tracking, and job application services:
              </p>
              <ul style={{ paddingLeft: 20, color: "#334155", display: "flex", flexDirection: "column", gap: 8 }}>
                <li><strong>Account Data:</strong> Name, academic email address, university/institution name, field of study, degree level (B.Tech, M.Sc, Ph.D.), and graduation year.</li>
                <li><strong>Research Activity:</strong> Saved PubMed searches, bookmarked literature, notes, and learning course progress.</li>
                <li><strong>Job Applications:</strong> Resumes/CVs uploaded for biotech job postings, portfolio links, and application status tracking.</li>
                <li><strong>Technical Data:</strong> IP addresses, browser types, device identifiers, and session timestamps for platform security.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="usage" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                2. How We Use Your Data
              </h2>
              <p style={{ color: "#475569", marginBottom: 12 }}>
                BioConnect processes your information exclusively for academic and platform operations:
              </p>
              <ul style={{ paddingLeft: 20, color: "#334155", display: "flex", flexDirection: "column", gap: 8 }}>
                <li>Delivering AI-powered PubMed literature summaries and customized learning recommendations.</li>
                <li>Facilitating direct job applications to verified biotechnology employers.</li>
                <li>Sending essential security alerts, platform updates, and weekly Bio-Minute science digests.</li>
                <li>Improving user interface responsiveness and algorithm precision.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="security" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                3. Research & Data Security
              </h2>
              <p style={{ color: "#475569", marginBottom: 12 }}>
                We implement industry-standard security protocols to protect academic files and user profiles:
              </p>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: 20, border: "1px solid #E2EEF0", color: "#334155" }}>
                <p style={{ margin: "0 0 10px" }}>• <strong>Encryption:</strong> All data in transit is encrypted using TLS 1.3, and data at rest uses AES-256 encryption.</p>
                <p style={{ margin: "0 0 10px" }}>• <strong>Database Isolation:</strong> User profiles and authentication tokens are secured via Supabase Row-Level Security (RLS).</p>
                <p style={{ margin: 0 }}>• <strong>No Unapproved AI Training:</strong> Your private research notes and uploaded CVs are never used to train public LLM models without explicit consent.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="cookies" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                4. Cookies & Academic Analytics
              </h2>
              <p style={{ color: "#475569" }}>
                BioConnect uses essential session cookies to keep you logged in and functional cookies to remember your reader preferences (e.g. font size, light/dark mode). We use Vercel Analytics for aggregate performance metrics. You can manage cookie settings directly in your web browser.
              </p>
            </section>

            {/* Section 5 */}
            <section id="rights" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                5. Student Privacy Rights & Controls
              </h2>
              <p style={{ color: "#475569", marginBottom: 12 }}>
                Under applicable privacy laws, you possess full authority over your data:
              </p>
              <ul style={{ paddingLeft: 20, color: "#334155", display: "flex", flexDirection: "column", gap: 8 }}>
                <li><strong>Right to Access & Export:</strong> Request a complete JSON export of your profile, bookmarks, and activity data.</li>
                <li><strong>Right to Rectification:</strong> Edit your personal and academic details anytime via your Profile Dashboard.</li>
                <li><strong>Right to Erasure (Account Deletion):</strong> Permanently wipe your account data from our primary databases within 30 days of request.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="thirdparty" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                6. Data Sharing & Third Parties
              </h2>
              <p style={{ color: "#475569" }}>
                <strong>We do not sell user data to third-party advertisers.</strong> We only share necessary data with trusted infrastructure providers (Supabase for authentication/database, Vercel for hosting, NCBI PubMed for open API querying) under strict data processing agreements.
              </p>
            </section>

            {/* Section 7 */}
            <section id="contact" style={{ marginBottom: 0 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                7. Compliance & Contact Info
              </h2>
              <p style={{ color: "#475569", marginBottom: 16 }}>
                If you have questions regarding this Privacy Policy or wish to exercise your privacy rights, please contact our Data Protection Officer:
              </p>
              <div style={{ background: "#E0F2FE", borderRadius: 16, padding: 20, border: "1px solid #BAE6FD", color: "#0369A1" }}>
                <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 4 }}>BioConnect Privacy & Compliance Office</div>
                <div style={{ fontSize: "0.9rem" }}>Email: <strong>bioconnect44@gmail.com</strong></div>
                <div style={{ fontSize: "0.9rem" }}>Address: IAR Campus, Gandhinagar, Gujarat</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PublicNavbarFooter>
  );
}
