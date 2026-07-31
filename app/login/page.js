"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <main style={S.page}><style>{CSS}</style>
      <div style={S.card}>
        {/* Left — image */}
        <div style={S.imgPanel}>
          <div style={S.imgOverlay}></div>
          <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80" alt="" style={S.img}/>
        </div>
        {/* Right — form */}
        <div style={S.formPanel}>
          <a href="/" style={S.brand}>BioConnect</a>
          <h1 style={S.h1}>Welcome Back!</h1>
          <p style={S.sub}>Enter your details below</p>
          {error && <div style={S.err}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="Email Address" required style={S.input}/>
            <div style={{ position: "relative" }}>
              <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} type={showPw ? "text" : "password"} placeholder="Password" required style={S.input}/>
              <button type="button" onClick={() => setShowPw(!showPw)} style={S.eyeBtn}>{showPw ? "🙈" : "👁"}</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6B8A9A", cursor: "pointer" }}><input type="checkbox" style={{ accentColor: "#0D9488" }}/>Remember me</label>
              <a href="#" style={{ fontSize: "13px", color: "#0D9488", fontWeight: 500 }}>Forgot password?</a>
            </div>
            <button type="submit" disabled={loading} style={S.btn}>{loading ? "Signing in..." : "Log in"}</button>
            <button type="button" style={S.googleBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Log in with Google
            </button>
          </form>
          <p style={{ fontSize: "13px", color: "#6B8A9A", marginTop: "16px", textAlign: "center" }}>Don't have an account? <a href="/signup" style={{ color: "#0D9488", fontWeight: 600 }}>Sign Up</a></p>
        </div>
      </div>
    </main>
  );
}

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{background:#EEF7F7;font-family:'Poppins',sans-serif}`;
const S = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EEF7F7", padding: "24px" },
  card: { display: "flex", background: "#fff", borderRadius: "24px", overflow: "hidden", width: "100%", maxWidth: "900px", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" },
  imgPanel: { width: "45%", position: "relative", minHeight: "520px", flexShrink: 0 },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  imgOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,45,53,0.3), rgba(13,45,53,0.7))", zIndex: 1 },
  formPanel: { flex: 1, padding: "48px 44px", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" },
  brand: { color: "#0D9488", fontWeight: 700, fontSize: "16px", marginBottom: "24px", display: "block" },
  h1: { fontSize: "28px", fontWeight: 700, color: "#1B2B3A", marginBottom: "6px" },
  sub: { fontSize: "14px", color: "#6B8A9A", marginBottom: "28px" },
  input: { width: "100%", padding: "13px 16px", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none", color: "#1B2B3A", background: "#fff" },
  btn: { width: "100%", padding: "14px", background: "#132D35", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  googleBtn: { width: "100%", padding: "13px", background: "#fff", color: "#1B2B3A", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
  eyeBtn: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" },
  err: { width: "100%", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "8px" },
};