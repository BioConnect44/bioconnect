"use client";

import { useState } from "react";
import PublicNavbarFooter from "@/components/PublicNavbarFooter";

const FAQS = [
  {
    q: "Is BioConnect free for biotech students and researchers in India?",
    a: "Yes. BioConnect provides open access to literature research tools, extra books library, 60-second Bio-Minutes, and the biotech jobs tracker for verified academic users."
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

  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setSubmitMessage(data.message || "Your inquiry has been sent to bioconnect44@gmail.com!");
        setFormData({ name: "", email: "", subject: "General Question", message: "" });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        alert(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      alert("Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicNavbarFooter>
      <div style={{ maxWidth: 1250, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* HERO HEADER */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E0F2FE", color: "#0369A1", padding: "6px 16px", borderRadius: 100, fontSize: "0.82rem", fontWeight: 700, marginBottom: 16 }}>
            <span>Support & Institutional Assistance</span>
          </div>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 800, color: "#102A30", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Get in Touch with BioConnect
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Have questions about student memberships, research tools, university partnerships, or need technical support? Contact our academic support team.
          </p>
        </div>

        {/* MAIN CONTACT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 36, marginBottom: 64 }}>
          {/* CONTACT FORM CARD */}
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1.5px solid #E2EEF0", padding: 36, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#102A30", marginBottom: 6 }}>
              Send Us a Message
            </h2>
            <p style={{ fontSize: "0.86rem", color: "#64748B", marginBottom: 26 }}>
              Our academic support team responds within 2-4 business hours.
            </p>

            {submitted && (
              <div style={{ background: "#DCFCE7", color: "#166534", border: "1px solid #86EFAC", padding: 14, borderRadius: 10, fontSize: "0.88rem", fontWeight: 700, marginBottom: 20 }}>
                Thank you! Your message has been received. A BioConnect specialist will reach out to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#102A30", marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar or Ananya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#102A30", marginBottom: 6 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@university.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#102A30", marginBottom: 6 }}>
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: "0.9rem", outline: "none", background: "#FFF" }}
                >
                  <option>General Question</option>
                  <option>Student / Institutional Partnership</option>
                  <option>Research & PubMed AI Tools</option>
                  <option>Biotech Job Recruiter Posting</option>
                  <option>Technical Bug / Account Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#102A30", marginBottom: 6 }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us how we can assist you..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: "0.9rem", outline: "none", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "#2AB4B4",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "13px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  cursor: submitting ? "wait" : "pointer",
                  boxShadow: "0 2px 10px rgba(42,180,180,0.25)"
                }}
              >
                {submitting ? "Sending..." : "Submit Inquiry →"}
              </button>
            </form>
          </div>

          {/* CONTACT INFO CARDS & LOCATION */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Info Box 1 */}
            <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1.5px solid #E2EEF0", padding: 22, display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#E0F2FE", color: "#0369A1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Academic Email</div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#102A30", marginTop: 2 }}>bioconnect44@gmail.com</div>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: 2 }}>General inquiries & feedback</div>
              </div>
            </div>

            {/* Info Box 2 */}
            <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1.5px solid #E2EEF0", padding: 22, display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#DCFCE7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Campus Location</div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#102A30", marginTop: 2 }}>IAR Campus</div>
                <div style={{ fontSize: "0.82rem", color: "#64748B", marginTop: 2 }}>Gandhinagar, Gujarat</div>
              </div>
            </div>

            {/* Info Box 3 */}
            <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1.5px solid #E2EEF0", padding: 22, display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF3C7", color: "#92400E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Working Hours</div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#102A30", marginTop: 2 }}>Monday – Saturday</div>
                <div style={{ fontSize: "0.82rem", color: "#64748B", marginTop: 2 }}>9:00 AM – 6:00 PM IST</div>
              </div>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1.5px solid #E2EEF0", padding: 36 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#102A30", margin: "0 0 6px" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: "0.92rem", color: "#64748B" }}>
              Quick answers to common questions about BioConnect accounts and features.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 880, margin: "0 auto" }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    background: "#F8FAFC",
                    borderRadius: 14,
                    border: "1px solid #E2EEF0",
                    padding: "18px 22px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#102A30", margin: 0 }}>
                      {faq.q}
                    </h3>
                    <span style={{ fontSize: "1.1rem", color: "#2AB4B4", fontWeight: 800 }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>

                  {isOpen && (
                    <p style={{ fontSize: "0.9rem", color: "#475569", marginTop: 10, marginBottom: 0, lineHeight: 1.6 }}>
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
