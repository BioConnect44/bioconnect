"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.password || form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.updateUser({
      password: form.password,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/login");
    }, 2500);
  }

  return (
    <main className="auth-page-main">
      <div className="auth-card">
        {/* Left — image */}
        <div className="auth-img-panel">
          <div style={S.imgOverlay}></div>
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
            alt="Biotechnology DNA Research"
            style={S.img}
          />
        </div>

        {/* Right — form */}
        <div className="auth-form-panel">
          <Link href="/" style={S.brand}>
            BioConnect
          </Link>

          {success ? (
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={S.h1}>Password Updated!</h2>
              <p style={{ ...S.sub, marginBottom: "20px" }}>
                Your password has been successfully reset. Redirecting you to login...
              </p>
              <Link
                href="/login"
                style={{
                  ...S.btn,
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                  background: "#0D9488",
                }}
              >
                Go to Log In Now →
              </Link>
            </div>
          ) : (
            <>
              <h1 style={S.h1}>Reset Password</h1>
              <p style={S.sub}>Enter your new password below to secure your account.</p>

              {error && <div style={S.err}>{error}</div>}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
                <div style={{ position: "relative" }}>
                  <input
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    type={showPw ? "text" : "password"}
                    placeholder="New Password (min 8 characters)"
                    required
                    minLength={8}
                    style={S.input}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={S.eyeBtn}>
                    {showPw ? "🙈" : "👁"}
                  </button>
                </div>

                <input
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  type={showPw ? "text" : "password"}
                  placeholder="Confirm New Password"
                  required
                  style={S.input}
                />

                <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Updating password..." : "Reset Password"}
                </button>
              </form>

              <div style={{ marginTop: "24px", textAlign: "center", width: "100%" }}>
                <Link href="/login" style={{ fontSize: "13.5px", color: "#0D9488", fontWeight: 600, textDecoration: "none" }}>
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
    fontWeight: 700,
    fontSize: "16px",
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
  eyeBtn: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
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
