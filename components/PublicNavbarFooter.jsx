"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HelpCenterChatbot from "@/components/HelpCenterChatbot";

export default function PublicNavbarFooter({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpBotOpen, setHelpBotOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Research", href: "/research" },
    { name: "Jobs", href: "/jobs" },
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
    { name: "Guides", href: "/guides" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#EEF6F8", fontFamily: "'Poppins', sans-serif" }}>
      {/* TOP NAVBAR */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 990,
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #D6ECF2",
        padding: "0 24px"
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #102A30 0%, #1A4A55 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2AB4B4", fontWeight: 800, fontSize: "1.2rem", boxShadow: "0 4px 12px rgba(16,42,48,0.15)" }}>
              🧬
            </div>
            <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "#102A30", letterSpacing: "-0.02em" }}>
              Bio<span style={{ color: "#2AB4B4" }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    textDecoration: "none",
                    fontSize: "0.92rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#2AB4B4" : "#1A2B3C",
                    position: "relative",
                    transition: "all 0.2s ease"
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span style={{ position: "absolute", bottom: -6, left: 0, right: 0, height: 2.5, background: "#2AB4B4", borderRadius: 2 }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/login"
              style={{
                background: "transparent",
                border: "1.5px solid #2AB4B4",
                color: "#2AB4B4",
                padding: "8px 20px",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s"
              }}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              style={{
                background: "#2AB4B4",
                color: "#FFFFFF",
                padding: "9px 22px",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(42,180,180,0.3)",
                transition: "all 0.2s"
              }}
            >
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="show-mobile-only"
            style={{
              background: "#E2EEF0",
              border: "none",
              color: "#102A30",
              width: 40,
              height: 40,
              borderRadius: 8,
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div style={{ background: "#FFFFFF", borderTop: "1px solid #E2EEF0", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: pathname === link.href ? 700 : 500,
                  color: pathname === link.href ? "#2AB4B4" : "#1A2B3C",
                  padding: "8px 0"
                }}
              >
                {link.name}
              </Link>
            ))}
            <div style={{ height: 1, background: "#E2EEF0", margin: "6px 0" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{ flex: 1, textAlign: "center", padding: "10px", border: "1.5px solid #2AB4B4", color: "#2AB4B4", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                style={{ flex: 1, textAlign: "center", padding: "10px", background: "#2AB4B4", color: "#fff", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* MAIN BODY CONTENT */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* FOOTER SECTION (Matches site theme & uploaded menu structure) */}
      <footer style={{ background: "linear-gradient(160deg, #0F2E38 0%, #1A4A55 50%, #0F2E38 100%)", color: "#FFFFFF", paddingTop: 64 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 56 }}>
            {/* Brand Intro & Newsletter */}
            <div style={{ gridColumn: "span 2" }}>
              <Link href="/" style={{ textDecoration: "none", fontSize: "1.4rem", fontWeight: 800, color: "#2AB4B4", display: "block", marginBottom: 16 }}>
                BioConnect
              </Link>
              <p style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.25, marginBottom: 24, maxWidth: 440 }}>
                Accelerating the future of biotech learning & research.
              </p>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", marginBottom: 20, maxWidth: 400 }}>
                Subscribe to our weekly Bio-Minute newsletter for cutting-edge paper summaries, research guides, and career updates.
              </p>
              <form onSubmit={handleSubscribe} style={{ display: "flex", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: 4, maxWidth: 380 }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your university email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", padding: "10px 18px", fontSize: "0.875rem" }}
                />
                <button
                  type="submit"
                  style={{ width: 42, height: 42, borderRadius: "50%", background: "#2AB4B4", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, flexShrink: 0 }}
                >
                  ➔
                </button>
              </form>
              {subscribed && (
                <span style={{ fontSize: "0.82rem", color: "#2AB4B4", fontWeight: 600, display: "block", marginTop: 8 }}>
                  ✓ Thank you! You have been subscribed to BioConnect Digest.
                </span>
              )}
            </div>

            {/* Column 1: PLATFORM */}
            <div>
              <div style={{ color: "#2AB4B4", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
                PLATFORM
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { name: "Dashboard", href: "/dashboard" },
                  { name: "Research AI", href: "/research" },
                  { name: "Events", href: "/events" },
                  { name: "Jobs Tracker", href: "/jobs" },
                  { name: "Extra Books", href: "/learning" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#2AB4B4")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: RESOURCES (Matches uploaded image 1) */}
            <div>
              <div style={{ color: "#2AB4B4", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
                RESOURCES
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                <li>
                  <Link
                    href="/blog"
                    style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2AB4B4")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2AB4B4")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setHelpBotOpen(true)}
                    style={{ background: "transparent", border: "none", padding: 0, color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", cursor: "pointer", textAlign: "left" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2AB4B4")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                  >
                    AI Chatbot 💬
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: LEGAL (Matches uploaded image 2) */}
            <div>
              <div style={{ color: "#2AB4B4", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
                LEGAL
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                <li>
                  <Link
                    href="/privacy"
                    style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2AB4B4")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2AB4B4")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2AB4B4")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "28px 0 36px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.55)" }}>
              © 2026 BioConnect Platform. All rights reserved.
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.84rem", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.06)", padding: "6px 14px", borderRadius: 100 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              All Systems Operational
            </div>

            <div style={{ display: "flex", gap: 18, color: "rgba(255,255,255,0.6)", fontSize: "0.88rem" }}>
              <span>Follow BioConnect:</span>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: "#2AB4B4", textDecoration: "none" }}>LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: "#2AB4B4", textDecoration: "none" }}>X / Twitter</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: "#2AB4B4", textDecoration: "none" }}>GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Chatbot Modal */}
      <HelpCenterChatbot isOpen={helpBotOpen} onClose={() => setHelpBotOpen(false)} />
    </div>
  );
}
