"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";

const TODAY_ARTICLE = {
  date: "Tuesday, July 28, 2026",
  readTime: "2 min read",
  category: "BIOTECH BREAKTHROUGH",
  categoryDate: "JULY 28, 2026",
  impact: "🔴 High Industry Impact",
  title: "ROCKET AI Upgrades AlphaFold to Read Raw Experimental Data",
  summary: [
    { icon: "🧬", text: "The Tech: ROCKET extends AlphaFold's capabilities to learn directly from raw experimental data." },
    { icon: "⚡", text: "The Impact: It skips the weeks of human effort previously required to build atomic models." },
    { icon: "🔮", text: "The Future: Crucial for designing new drugs by showing how proteins change shape in real-time." },
  ],
  body: "Predicting how proteins fold was long considered one of the greatest challenges in biology. While AlphaFold revolutionized the field, it couldn't directly interact with raw data. The new ROCKET software acts as a seamless bridge, allowing powerful AI to be directly guided by experimental results from X-ray crystallography and cryo-EM...",
  image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=70",
  quiz: {
    question: "What primary bottleneck does ROCKET AI solve in protein modeling?",
    options: ["Generating new sequences", "Reading raw experimental data", "Writing research papers"],
    answer: 1,
    xp: "+20 XP",
  },
  streak: 5,
  missed: [
    { date: "JULY 27", title: "CRISPR's New Target Unveiled", img: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=200&q=60" },
    { date: "JULY 26", title: "FDA Approves New Biomarker", img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&q=60" },
    { date: "JULY 25", title: "The Future of Lab Automation", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60" },
  ],
};

export default function BioMinutePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);
  const art = TODAY_ARTICLE;

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    }
    load();
  }, []);

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
    setCorrect(selected === art.quiz.answer);
  }

  return (
    <AppShell active="/biominute">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Today&apos;s Bio-Minute ⏱</h1>
          <p style={{ fontSize: "13px", color: "#6B8A9A" }}>{art.date} • {art.readTime}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFF3E8", border: "1px solid #FFD4A3", borderRadius: "10px", padding: "8px 16px" }}>
          <span style={{ fontSize: "16px" }}>🔥</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#F97316" }}>{art.streak} Day Streak!</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
        {/* Article */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", border: "1px solid #E2EEF0" }}>
          {/* Hero image */}
          <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
            <img src={art.image} alt="" style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}/>
            <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", borderRadius: "8px", padding: "6px 12px" }}>
              <span style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>{art.impact}</span>
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 700, marginBottom: "10px" }}>{art.category} • {art.categoryDate}</p>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1B2B3A", lineHeight: "1.3", marginBottom: "20px" }}>{art.title}</h2>

          {/* 60-second summary */}
          <div style={{ background: "#F8FCFC", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#1B2B3A", marginBottom: "14px" }}>The 60-Second Summary</p>
            {art.summary.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{s.icon}</span>
                <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", fontWeight: 500 }}>{s.text}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "14px", color: "#6B8A9A", lineHeight: "1.8" }}>{art.body}</p>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Daily Quiz */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", border: "1px solid #E2EEF0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A" }}>Daily Quick Quiz</h3>
              <span style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 700 }}>{art.quiz.xp}</span>
            </div>
            <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px", lineHeight: "1.5" }}>{art.quiz.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              {art.quiz.options.map((opt, i) => (
                <button key={i} onClick={() => !submitted && setSelected(i)} style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "13px 16px", borderRadius: "10px", border: "1.5px solid",
                  cursor: submitted ? "default" : "pointer", fontFamily: "inherit", background:
                    submitted ? (i === art.quiz.answer ? "#F0FCFB" : i === selected ? "#FEF2F2" : "#fff") :
                    selected === i ? "#F0FCFB" : "#fff",
                  borderColor: submitted ? (i === art.quiz.answer ? "#14B8A6" : i === selected ? "#EF4444" : "#E2EEF0") :
                    selected === i ? "#14B8A6" : "#E2EEF0",
                  textAlign: "left",
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected === i || (submitted && i === art.quiz.answer) ? "#14B8A6" : "#E2EEF0"}`, background: selected === i || (submitted && i === art.quiz.answer) ? "#14B8A6" : "#fff", flexShrink: 0 }}></div>
                  <span style={{ fontSize: "14px", color: "#374151" }}>{opt}</span>
                </button>
              ))}
            </div>
            {submitted ? (
              <div style={{ padding: "12px", borderRadius: "10px", background: correct ? "#F0FCFB" : "#FEF2F2", textAlign: "center" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: correct ? "#14B8A6" : "#EF4444" }}>{correct ? "✅ Correct! " + art.quiz.xp + " earned!" : "❌ Not quite. The answer is: " + art.quiz.options[art.quiz.answer]}</p>
              </div>
            ) : (
              <button onClick={handleSubmit} disabled={selected === null} style={{ width: "100%", padding: "13px", background: selected !== null ? "#14B8A6" : "#E2EEF0", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: selected !== null ? "pointer" : "default", fontFamily: "inherit" }}>Submit Answer</button>
            )}
          </div>

          {/* Missed Yesterday */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", border: "1px solid #E2EEF0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "16px" }}>Missed Yesterday? ⏱</h3>
            {art.missed.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: i < art.missed.length - 1 ? "1px solid #F0F7F8" : "none", cursor: "pointer" }}>
                <img src={m.img} alt="" style={{ width: 52, height: 44, borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}/>
                <div><p style={{ fontSize: "11px", color: "#14B8A6", fontWeight: 600, marginBottom: "2px" }}>{m.date}</p><p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A", lineHeight: "1.4" }}>{m.title}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}