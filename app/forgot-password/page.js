"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="auth-page-main">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body,.auth-page-main{font-family:'Poppins',sans-serif !important}
      `}</style>
      <div className="auth-card">
        {/* Left — image */}
        <div className="auth-img-panel">
          <div style={S.imgOverlay}></div>
          <img
            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80"
            alt="Biotechnology Molecular Research"
            style={S.img}
          />
        </div>

        {/* Right — form */}
        <div className="auth-form-panel">
          <Link href="/" style={S.brand}>
            BioConnect
          </Link>

          {submitted ? (
            <div style={{ textAlign: "center", width: "100%", padding: "12px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(20,184,166,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2.2">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </div>
              <h2 style={S.h1}>Check Your Email</h2>
              <p style={{ ...S.sub, marginBottom: "20px" }}>
                We sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href="/verify-otp"
                  style={{
                    ...S.btn,
                    textDecoration: "none",
                    textAlign: "center",
                    display: "block",
                    background: "#0D9488",
                  }}
                >
                  Enter OTP Code Instead →
                </Link>
                <Link
                  href="/login"
                  style={{
                    fontSize: "14px",
                    color: "#0D9488",
                    fontWeight: 600,
                    textDecoration: "none",
                    marginTop: "8px",
                    display: "inline-block",
                  }}
                >
                  ← Back to Log In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 style={S.h1}>Forgot Password?</h1>
              <p style={S.sub}>
                Enter your registered email address below and we&apos;ll send you instructions to reset your password.
              </p>

              {error && <div style={S.err}>{error}</div>}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your registered email address"
                  required
                  style={S.input}
                />

                <button type="submit" disabled={loading || !email} style={{ ...S.btn, opacity: loading || !email ? 0.7 : 1 }}>
                  {loading ? "Sending instructions..." : "Send Reset Link"}
                </button>
              </form>

              <div style={{ marginTop: "24px", textAlign: "center", width: "100%" }}>
                <Link href="/login" style={{ fontSize: "14px", color: "#0D9488", fontWeight: 600, textDecoration: "none" }}>
                  ← Back to Log In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

const S = {
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(13,45,53,0.3), rgba(13,45,53,0.7))",
    zIndex: 1,
  },
  brand: {
    color: "#0D9488",
    fontWeight: 900,
    fontSize: "24px",
    letterSpacing: "-0.5px",
    marginBottom: "20px",
    display: "block",
    textDecoration: "none",
  },
  h1: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1B2B3A",
    marginBottom: "6px",
  },
  sub: { fontSize: "13.5px", color: "#6B8A9A", marginBottom: "24px", lineHeight: "1.5" },
  input: {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid #E2EEF0",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    color: "#1B2B3A",
    background: "#fff",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "#132D35",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  err: {
    width: "100%",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#DC2626",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "8px",
  },
};
