"use client";

import { useState } from "react";
import PublicNavbarFooter from "@/components/PublicNavbarFooter";

const FAQS = [
  {
    q: "Is BioConnect free for biotech students and researchers in India?",
    a: "Yes! BioConnect offers free access to PubMed AI research summaries, extra books library, 60-second Bio-Minutes, and the biotech jobs tracker for all verified academic users."
  },
  {
    q: "How can our university or institute partner with BioConnect?",
    a: "University faculties and department heads can request dedicated campus dashboards for tracking student research projects and campus placement drives by submitting the partnership inquiry form on this page."
  },
  {
    q: "How does the PubMed AI research summary engine work?",
    a: "Our engine queries official NCBI PubMed APIs in real-time, extracts abstract text, and generates structured key takeaways, methods, and clinical relevance using domain-optimized NLP models."
  },
  {
    q: "How do I post a biotech job opening or internship on BioConnect?",
    a: "Recruiters and lab directors can register as institutional partners or contact support@bioconnect.edu.in to get verified recruiter access for posting job openings."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Question",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "General Question", message: "" });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1000);
  };

  return (
    <PublicNavbarFooter>
      <div style={{ maxWidth: 1250, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* HERO HEADER */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E0F2FE", color: "#0369A1", padding: "6px 16px", borderRadius: 100, fontSize: "0.85rem", fontWeight: 700, marginBottom: 16 }}>
            <span>💬 24/7 Support & Institutional Assistance</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, color: "#102A30", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            Get in Touch with BioConnect
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#64748B", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Have questions about student memberships, research tools, university partnerships, or need technical support? Send us a message below.
          </p>
        </div>

        {/* MAIN CONTACT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 40, marginBottom: 72 }}>
          {/* CONTACT FORM CARD */}
          <div style={{ background: "#FFFFFF", borderRadius: 24, border: "1.5px solid #E2EEF0", padding: 36, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#102A30", marginBottom: 8 }}>
              Send Us a Message
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#64748B", marginBottom: 28 }}>
              Our academic support team typically responds within 2-4 business hours.
            </p>

            {submitted && (
              <div style={{ background: "#DCFCE7", color: "#166534", border: "1px solid #86EFAC", padding: 16, borderRadius: 12, fontSize: "0.9rem", fontWeight: 700, marginBottom: 24 }}>
                ✓ Thank you! Your message has been received. A BioConnect specialist will reach out to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#102A30", marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar or Ananya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: "0.92rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#102A30", marginBottom: 6 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@university.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: "0.92rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#102A30", marginBottom: 6 }}>
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: "0.92rem", outline: "none", background: "#FFF" }}
                >
                  <option>General Question</option>
                  <option>Student / Institutional Partnership</option>
                  <option>Research & PubMed AI Tools</option>
                  <option>Biotech Job Recruiter Posting</option>
                  <option>Technical Bug / Account Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#102A30", marginBottom: 6 }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us how we can assist you..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: "0.92rem", outline: "none", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "#2AB4B4",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "14px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: submitting ? "wait" : "pointer",
                  boxShadow: "0 4px 16px rgba(42,180,180,0.3)"
                }}
              >
                {submitting ? "Sending Message..." : "Submit Inquiry →"}
              </button>
            </form>
          </div>

          {/* CONTACT INFO CARDS & LOCATION */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Info Box 1 */}
            <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1.5px solid #E2EEF0", padding: 24, display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#E0F2FE", color: "#0369A1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                ✉️
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Academic & Support Email</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#102A30", marginTop: 2 }}>support@bioconnect.edu.in</div>
                <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: 2 }}>General inquiries & feedback</div>
              </div>
            </div>

            {/* Info Box 2 */}
            <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1.5px solid #E2EEF0", padding: 24, display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#DCFCE7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                🏢
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Headquarters & Research Lab</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#102A30", marginTop: 2 }}>BioConnect Research Park</div>
                <div style={{ fontSize: "0.84rem", color: "#64748B", marginTop: 2 }}>Tech Campus, Outer Ring Road, Bengaluru, KA 560103</div>
              </div>
            </div>

            {/* Info Box 3 */}
            <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1.5px solid #E2EEF0", padding: 24, display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#FEF3C7", color: "#92400E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                ⏰
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Support Working Hours</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#102A30", marginTop: 2 }}>Monday – Saturday</div>
                <div style={{ fontSize: "0.84rem", color: "#64748B", marginTop: 2 }}>9:00 AM – 6:00 PM IST</div>
              </div>
            </div>

            {/* Help Chatbot Card */}
            <div style={{ background: "linear-gradient(135deg, #102A30 0%, #1A4A55 100%)", borderRadius: 20, padding: 24, color: "#FFFFFF" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 6 }}>Need Instant Answers?</div>
              <p style={{ fontSize: "0.88rem", color: "#CBD5E1", lineHeight: 1.5, marginBottom: 16 }}>
                Ask our integrated BioConnect AI Assistant about PubMed summaries, extra books, course access, or profile management.
              </p>
              <button
                onClick={() => {
                  const chatBtn = document.querySelector('button[aria-label="Open Chat"]') || document.querySelector('button:contains("AI Chatbot")');
                  if (chatBtn) chatBtn.click();
                  else alert("Click the 'AI Chatbot 💬' link in the footer to start live assistance!");
                }}
                style={{ background: "#2AB4B4", color: "#FFFFFF", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}
              >
                Open AI Chatbot 💬
              </button>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <div style={{ background: "#FFFFFF", borderRadius: 24, border: "1.5px solid #E2EEF0", padding: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#102A30", margin: "0 0 8px" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B" }}>
              Quick answers to common questions about BioConnect features and academic accounts.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900, margin: "0 auto" }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    background: "#F8FAFC",
                    borderRadius: 16,
                    border: "1px solid #E2EEF0",
                    padding: "20px 24px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#102A30", margin: 0 }}>
                      {faq.q}
                    </h3>
                    <span style={{ fontSize: "1.2rem", color: "#2AB4B4", fontWeight: 800 }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>

                  {isOpen && (
                    <p style={{ fontSize: "0.92rem", color: "#475569", marginTop: 12, marginBottom: 0, lineHeight: 1.65 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PublicNavbarFooter>
  );
}
