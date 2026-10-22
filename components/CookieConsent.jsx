"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "bioconnect_cookie_consent";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsOpen(true);
      } else {
        const parsed = JSON.parse(stored);
        setAnalyticsEnabled(parsed.analytics !== false);
      }
    } catch (e) {
      // localStorage unavailable
    }
  }, []);

  const saveConsent = (all = true) => {
    const consent = {
      essential: true,
      analytics: all ? true : analyticsEnabled,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {}
    setIsOpen(false);
    setShowPreferences(false);
  };

  const rejectNonEssential = () => {
    const consent = {
      essential: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {}
    setAnalyticsEnabled(false);
    setIsOpen(false);
    setShowPreferences(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        maxWidth: 580,
        margin: "0 auto",
        zIndex: 99998,
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.16)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            background: "rgba(20, 184, 166, 0.12)",
            color: "#0D9488",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            flexShrink: 0,
          }}
        >
          🍪
        </div>
        <div style={{ flex: 1 }}>
          <h4
            id="cookie-banner-title"
            style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}
          >
            We Value Your Privacy & Research Focus
          </h4>
          <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>
            We use essential cookies to keep you signed in and aggregate analytics to optimize learning tools.
            Read our{" "}
            <Link href="/privacy" style={{ color: "#14B8A6", textDecoration: "underline" }}>
              Privacy Policy
            </Link>.
          </p>

          {showPreferences && (
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "0.82rem",
              }}
            >
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><strong>Essential Cookies</strong> (Required for auth & security)</span>
                <input type="checkbox" checked disabled />
              </label>
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <span><strong>Analytics & Performance</strong> (Vercel & Speed metrics)</span>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                />
              </label>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => saveConsent(true)}
              style={{
                background: "#14B8A6",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Accept All
            </button>
            <button
              onClick={rejectNonEssential}
              style={{
                background: "#F1F5F9",
                color: "#334155",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Reject Non-Essential
            </button>
            <button
              onClick={() => setShowPreferences((v) => !v)}
              style={{
                background: "transparent",
                color: "#64748B",
                border: "none",
                padding: "8px 10px",
                fontSize: "0.82rem",
                fontWeight: 500,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {showPreferences ? "Hide Settings" : "Customize"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
