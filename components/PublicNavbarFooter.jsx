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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F8FAFC", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @media (min-width: 992px) {
          .nav-desktop-links { display: flex !important; }
          .nav-desktop-actions { display: flex !important; }
          .nav-mobile-toggle { display: none !important; }
          .nav-mobile-drawer { display: none !important; }
        }
        @media (max-width: 991px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-actions { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>

      {/* TOP STICKY NAVBAR */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 990,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #E2EEF0",
        padding: "0 24px"
      }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #102A30 0%, #1A4A55 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2AB4B4", boxShadow: "0 4px 12px rgba(16,42,48,0.12)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2AB4B4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c3-1.5 5-1.5 7.5 0s4.5 1.5 7.5 0" />
                <path d="M4.5 7.5c3 1.5 5 1.5 7.5 0s4.5-1.5 7.5 0" />
                <path d="M6 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#2AB4B4" />
                <path d="M18 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#2AB4B4" />
                <line x1="8" y1="8" x2="8" y2="16" strokeOpacity="0.5" />
                <line x1="16" y1="8" x2="16" y2="16" strokeOpacity="0.5" />
              </svg>
            </div>
            <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#102A30", letterSpacing: "-0.02em" }}>
              Bio<span style={{ color: "#2AB4B4" }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-desktop-links" style={{ alignItems: "center", gap: 28 }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#2AB4B4" : "#334155",
                    position: "relative",
                    transition: "color 0.2s ease"
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span style={{ position: "absolute", bottom: -6, left: 0, right: 0, height: 2, background: "#2AB4B4", borderRadius: 2 }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="nav-desktop-actions" style={{ alignItems: "center", gap: 12 }}>
            <Link
              href="/login"
              style={{
                background: "transparent",
                border: "1.5px solid #CBD5E1",
                color: "#102A30",
                padding: "8px 18px",
                borderRadius: 8,
                fontSize: "0.88rem",
                fontWeight: 600,
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
                padding: "9px 20px",
                borderRadius: 8,
                fontSize: "0.88rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 10px rgba(42,180,180,0.25)",
                transition: "all 0.2s"
              }}
            >
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Toggle (STRICTLY HIDDEN ON DESKTOP VIA MEDIA QUERY) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-mobile-toggle"
            aria-label="Toggle Navigation Menu"
            style={{
              background: "#F1F5F9",
              border: "1px solid #E2EEF0",
              color: "#102A30",
              width: 40,
              height: 40,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#102A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#102A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="nav-mobile-drawer" style={{ background: "#FFFFFF", borderTop: "1px solid #E2EEF0", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  fontSize: "0.98rem",
                  fontWeight: pathname === link.href ? 700 : 500,
                  color: pathname === link.href ? "#2AB4B4" : "#102A30",
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

      {/* MAIN PAGE BODY */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* PREMIUM FOOTER */}
      <footer style={{ background: "linear-gradient(160deg, #0F2E38 0%, #1A4A55 50%, #0F2E38 100%)", color: "#FFFFFF", paddingTop: 64 }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 56 }}>
            {/* Brand Intro & Newsletter */}
            <div style={{ gridColumn: "span 2" }}>
              <Link href="/" style={{ textDecoration: "none", fontSize: "1.35rem", fontWeight: 800, color: "#2AB4B4", display: "inline-block", marginBottom: 16 }}>
                BioConnect
              </Link>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.25, marginBottom: 20, maxWidth: 440 }}>
                Accelerating the future of biotech.
              </p>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", marginBottom: 20, maxWidth: 400, lineHeight: 1.6 }}>
                Subscribe to our academic newsletter for research digests, paper summaries, and biotech career updates.
              </p>
              <form onSubmit={handleSubscribe} style={{ display: "flex", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: 4, maxWidth: 360 }}>
                <input
                  type="email"
                  required
                  placeholder="Enter university email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", padding: "10px 18px", fontSize: "0.875rem" }}
                />
                <button
                  type="submit"
                  style={{ width: 40, height: 40, borderRadius: "50%", background: "#2AB4B4", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </form>
              {subscribed && (
                <span style={{ fontSize: "0.82rem", color: "#2AB4B4", fontWeight: 600, display: "block", marginTop: 8 }}>
                  Thank you! You are subscribed to BioConnect Digest.
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
                  { name: "Network", href: "/dashboard" },
                  { name: "Research", href: "/research" },
                  { name: "Events", href: "/events" },
                  { name: "Jobs", href: "/jobs" },
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
                    AI Help Assistant
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
              © 2026 BioConnect. All rights reserved.
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.84rem", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.06)", padding: "6px 14px", borderRadius: 100 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              All Systems Operational
            </div>

            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              {[
                "M7 2C4.2 2 2 4.2 2 7v2c0 2.8 2.2 5 5 5h2c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm1 3a2 2 0 110 4 2 2 0 010-4zm2.5-.5a.5.5 0 110 1 .5.5 0 010-1z",
                "M3 3h2v8H3V3zm1-1.5a1 1 0 110 2 1 1 0 010-2zM7 7c0-1 .8-2 2-2s2 1 2 2v4h2V7a4 4 0 00-4-4 4 4 0 00-4 4v4h2V7z",
                "M3 3l4 5.5L3 13h1.5l3-3.8 2.5 3.8H13l-4.2-6L13 3h-1.5l-2.8 3.5L6.5 3H3z"
              ].map((path, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ cursor: "pointer", opacity: 0.7, transition: "opacity 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; }}>
                  <path d={path} stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Modal */}
      <HelpCenterChatbot isOpen={helpBotOpen} onClose={() => setHelpBotOpen(false)} />
    </div>
  );
}
