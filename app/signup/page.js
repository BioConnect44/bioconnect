"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const supabase = createClient();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.role) { setError("Please select your role"); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.fullName, role: form.role } } });
    if (err) { setError(err.message); setLoading(false); return; }
    setSuccess(true); setLoading(false);
  }

  async function handleGoogleSignup() {
    setError("");
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      });
      if (err) {
        if (err.message?.toLowerCase().includes("provider") || err.message?.toLowerCase().includes("validation_failed")) {
          setError("Google Sign-In is not enabled in your Supabase Dashboard yet. Please sign up using your Email & Password above, or turn on the Google Provider in Supabase (Authentication -> Providers -> Google).");
        } else {
          setError(err.message);
        }
      }
    } catch (e) {
      setError("Google Sign-In is not enabled in Supabase yet. Please use Email & Password.");
    }
  }

  if (success) return (
    <main className="auth-page-main"><style>{CSS}</style>
      <div style={{ ...S.card, justifyContent: "center", padding: "60px 44px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "rgba(20,184,166,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2B3A", marginBottom: "8px" }}>Check your email</h2>
        <p style={{ color: "#6B8A9A", fontSize: "14px", marginBottom: "24px" }}>We sent a verification link to <strong>{form.email}</strong></p>
        <Link href="/login" style={{ color: "#0D9488", fontWeight: 600, fontSize: "14px" }}>Go to Login →</Link>
      </div>
    </main>
  );

  return (
    <main className="auth-page-main">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#EEF7F7;font-family:'Poppins',sans-serif}
        
        .auth-card {
          display: flex;
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          width: 100%;
          max-width: 900px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
        }
        .auth-img-panel {
          width: 45%;
          position: relative;
          min-height: 560px;
          flex-shrink: 0;
        }
        .auth-form-panel {
          flex: 1;
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          width: 100%;
        }

        @media (max-width: 1023px) {
          .auth-card {
            flex-direction: column !important;
            max-width: 480px !important;
            border-radius: 16px !important;
            margin: 12px 0 !important;
          }
          .auth-img-panel {
            display: none !important;
          }
          .auth-form-panel {
            padding: 32px 24px !important;
          }
        }
        @media (max-width: 480px) {
          .auth-form-panel {
            padding: 24px 18px !important;
          }
        }
      `}</style>
      <div className="auth-card">
        {/* Left */}
        <div className="auth-img-panel">
          <div style={S.imgOverlay}></div>
          <img src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80" alt="Biotechnology & Life Sciences Research" style={S.img}/>
        </div>
        {/* Right */}
        <div className="auth-form-panel">
          <Link href="/" style={S.brand}>BioConnect</Link>
          <h1 style={S.h1}>Create an Account</h1>
          <p style={S.sub}>Start your biotech journey today</p>
          {error && <div style={S.err}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "13px", width: "100%" }}>
            <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} type="text" placeholder="Full Name" required style={S.input}/>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="Email Address" required style={S.input}/>
            <div style={{ position: "relative" }}>
              <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} type={showPw ? "text" : "password"} placeholder="Password" required minLength={8} style={S.input}/>
              <button type="button" onClick={() => setShowPw(!showPw)} style={S.eyeBtn}>{showPw ? "🙈" : "👁"}</button>
            </div>
            <div style={{ position: "relative" }}>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ ...S.input, color: form.role ? "#1B2B3A" : "#9CA3AF", appearance: "none" }}>
                <option value="" disabled>Select your role</option>
                <option value="student">Student</option>
                <option value="educator">Educator</option>
                <option value="researcher">Researcher</option>
                <option value="industry">Industry Professional</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", width: "100%" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6B8A9A", cursor: "pointer" }}><input type="checkbox" style={{ accentColor: "#0D9488" }}/>Remember me</label>
              <Link href="/forgot-password" style={{ fontSize: "13px", color: "#0D9488", fontWeight: 500, textDecoration: "none" }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} style={S.btn}>{loading ? "Creating account..." : "Sign Up"}</button>
            <button type="button" onClick={handleGoogleSignup} style={S.googleBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign up with Google
            </button>
          </form>
          <p style={{ fontSize: "13px", color: "#6B8A9A", marginTop: "14px", textAlign: "center" }}>Already have an account? <Link href="/login" style={{ color: "#0D9488", fontWeight: 600 }}>Sign in</Link></p>
        </div>
      </div>
    </main>
  );
}

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{background:#EEF7F7;font-family:'Poppins',sans-serif}`;
const S = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EEF7F7", padding: "24px" },
  card: { display: "flex", background: "#fff", borderRadius: "24px", overflow: "hidden", width: "100%", maxWidth: "900px", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" },
  imgPanel: { width: "45%", position: "relative", minHeight: "560px", flexShrink: 0 },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  imgOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,45,53,0.3), rgba(13,45,53,0.7))", zIndex: 1 },
  formPanel: { flex: 1, padding: "44px 40px", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "center", width: "100%" },
  brand: { color: "#0D9488", fontWeight: 900, fontSize: "24px", letterSpacing: "-0.5px", marginBottom: "20px", display: "block" },
  h1: { fontSize: "26px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" },
  sub: { fontSize: "13px", color: "#6B8A9A", marginBottom: "24px" },
  input: { width: "100%", padding: "12px 16px", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none", color: "#1B2B3A", background: "#fff" },
  btn: { width: "100%", padding: "13px", background: "#132D35", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  googleBtn: { width: "100%", padding: "12px", background: "#fff", color: "#1B2B3A", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
  eyeBtn: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" },
  err: { width: "100%", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "8px" },
};
