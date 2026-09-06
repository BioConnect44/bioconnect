"use client";

import { useState } from "react";
import PublicNavbarFooter from "@/components/PublicNavbarFooter";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("eligibility");

  const sections = [
    { id: "eligibility", title: "1. Acceptance & Academic Eligibility" },
    { id: "account", title: "2. Account Registration & Security" },
    { id: "intellectual", title: "3. Intellectual Property & Content" },
    { id: "conduct", title: "4. Acceptable Conduct & Platform Rules" },
    { id: "disclaimer", title: "5. Educational & Medical Disclaimer" },
    { id: "liability", title: "6. Limitation of Liability" },
    { id: "termination", title: "7. Account Termination & Changes" },
    { id: "governing", title: "8. Governing Law & Contact" }
  ];

  return (
    <PublicNavbarFooter>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* PAGE HEADER */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E0F2FE", color: "#0369A1", padding: "6px 16px", borderRadius: 100, fontSize: "0.85rem", fontWeight: 700, marginBottom: 16 }}>
            <span>📜 Platform Terms & User Agreement</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, color: "#102A30", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            BioConnect Terms of Service
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748B" }}>
            Effective Date: March 1, 2026 • Please read these terms carefully before accessing or using BioConnect.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 36, alignItems: "start" }}>
          {/* SIDEBAR NAVIGATION */}
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1.5px solid #E2EEF0", padding: 20, position: "sticky", top: 90 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#2AB4B4", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, paddingLeft: 8 }}>
              Terms Navigation
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

          {/* MAIN TERMS CONTENT */}
          <div style={{ background: "#FFFFFF", borderRadius: 24, border: "1.5px solid #E2EEF0", padding: "40px 44px", color: "#102A30", lineHeight: 1.8 }}>
            {/* Intro */}
            <div style={{ marginBottom: 36, paddingBottom: 24, borderBottom: "1px solid #E2EEF0" }}>
              <p style={{ fontSize: "1rem", color: "#334155", margin: 0 }}>
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of <strong>BioConnect</strong> (&quot;the Platform&quot;), including our website, APIs, literature AI tools, job applications tracking, and extra books library. By creating an account or using BioConnect, you agree to be bound by these Terms.
              </p>
            </div>

            {/* Section 1 */}
            <section id="eligibility" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                1. Acceptance & Academic Eligibility
              </h2>
              <p style={{ color: "#475569" }}>
                BioConnect is designed for biotechnology students, educators, researchers, academic institutions, and biotech industry professionals. By using BioConnect, you affirm that you are at least 16 years of age (or have parental/institutional consent) and possess the legal capacity to enter into this agreement.
              </p>
            </section>

            {/* Section 2 */}
            <section id="account" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                2. Account Registration & Security
              </h2>
              <ul style={{ paddingLeft: 20, color: "#334155", display: "flex", flexDirection: "column", gap: 8 }}>
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You must immediately notify BioConnect of any unauthorized account access or security breaches.</li>
                <li>Accounts registered by automated &quot;bots&quot; or unauthorized third-party scrapers are strictly prohibited.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="intellectual" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                3. Intellectual Property & Research Content
              </h2>
              <p style={{ color: "#475569", marginBottom: 12 }}>
                BioConnect respects academic copyright and intellectual property rights:
              </p>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: 20, border: "1px solid #E2EEF0", color: "#334155" }}>
                <p style={{ margin: "0 0 10px" }}>• <strong>User Content Ownership:</strong> You retain full ownership of any original research papers, notes, or resumes you upload to BioConnect.</p>
                <p style={{ margin: "0 0 10px" }}>• <strong>Platform Materials:</strong> The BioConnect software, design, logos, AI summaries, and proprietary course materials are owned by BioConnect and protected under copyright laws.</p>
                <p style={{ margin: 0 }}>• <strong>Third-Party Literature:</strong> PubMed paper citations and open-access textbook references remain the property of their respective publishers and authors under fair-use educational guidelines.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="conduct" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                4. Acceptable Conduct & Platform Rules
              </h2>
              <p style={{ color: "#475569", marginBottom: 12 }}>
                When using BioConnect, you agree NOT to:
              </p>
              <ul style={{ paddingLeft: 20, color: "#334155", display: "flex", flexDirection: "column", gap: 8 }}>
                <li>Post false, deceptive, or plagiarized research data.</li>
                <li>Attempt to bypass platform authentication or reverse-engineer API endpoints.</li>
                <li>Harass, spam, or impersonate other students, faculty, or biotech recruiters.</li>
                <li>Distribute malicious software or engage in unauthorized data scraping.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="disclaimer" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                5. Educational & Medical Disclaimer
              </h2>
              <div style={{ background: "#FEF3C7", borderRadius: 16, padding: 20, border: "1px solid #FCD34D", color: "#92400E" }}>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  ⚠️ All literature summaries, AI-generated research insights, and lab protocols on BioConnect are provided for <strong>educational and academic research purposes only</strong>. BioConnect does not provide clinical diagnosis, medical treatment, or industrial biosafety certification. Always consult official laboratory SOPs and certified safety officers.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="liability" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                6. Limitation of Liability
              </h2>
              <p style={{ color: "#475569" }}>
                To the maximum extent permitted by law, BioConnect and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from your access to or inability to use the platform, including lost data or job application outcomes.
              </p>
            </section>

            {/* Section 7 */}
            <section id="termination" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                7. Account Termination & Service Modifications
              </h2>
              <p style={{ color: "#475569" }}>
                We reserve the right to suspend or terminate accounts that violate these Terms or disrupt platform stability. BioConnect may modify these Terms at any time; continued use of the platform after updates constitutes acceptance of the revised Terms.
              </p>
            </section>

            {/* Section 8 */}
            <section id="governing" style={{ marginBottom: 0 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#102A30", marginBottom: 14 }}>
                8. Governing Law & Contact Details
              </h2>
              <p style={{ color: "#475569", marginBottom: 16 }}>
                These Terms shall be governed by and construed in accordance with the laws of India. Any legal disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
              </p>
              <div style={{ background: "#E0F2FE", borderRadius: 16, padding: 20, border: "1px solid #BAE6FD", color: "#0369A1" }}>
                <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 4 }}>BioConnect Legal Affairs</div>
                <div style={{ fontSize: "0.9rem" }}>Email: <strong>legal@bioconnect.edu.in</strong></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PublicNavbarFooter>
  );
}
