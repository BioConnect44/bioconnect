"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";

export default function BioMinutePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);

  useEffect(() => {
    async function loadData() {
      // 1. Auth check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);

      // 2. Fetch live daily article from Biotecnika API
      try {
        const res = await fetch("/api/biominute");
        const json = await res.json();
        if (json && json.article) {
          setArticle(json.article);
        }
      } catch (err) {
        console.error("Failed to load live Biotecnika article:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleSubmit() {
    if (selected === null || !article) return;
    setSubmitted(true);
    setCorrect(selected === article.quiz.answer);
  }

  const art = article;

  return (
    <AppShell active="/biominute">
      {loading || !art ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#6B8A9A", fontFamily: "'Poppins', sans-serif" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px", animation: "spin 1.5s linear infinite", display: "inline-block" }}>⏱</div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A" }}>Fetching today&apos;s live news from Biotecnika...</p>
          <p style={{ fontSize: "13px", color: "#6B8A9A" }}>Auto-updating daily biotech breakthroughs</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2B3A", margin: 0 }}>Today&apos;s Bio-Minute ⏱</h1>
                <span style={{ fontSize: "11px", background: "#CCFBF1", color: "#0F766E", fontWeight: 700, padding: "3px 8px", borderRadius: "12px" }}>
                  LIVE • Biotecnika
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#6B8A9A" }}>{art.date} • {art.readTime}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFF3E8", border: "1px solid #FFD4A3", borderRadius: "10px", padding: "8px 16px" }}>
              <span style={{ fontSize: "16px" }}>🔥</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F97316" }}>{art.streak || 5} Day Streak!</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
            {/* Article Main */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", border: "1px solid #E2EEF0" }}>
              {/* Hero image */}
              <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
                <img src={art.image} alt="" style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", borderRadius: "8px", padding: "6px 12px" }}>
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

              <p style={{ fontSize: "14px", color: "#6B8A9A", lineHeight: "1.8", marginBottom: "20px" }}>{art.body}</p>

              {art.link && (
                <a
                  href={art.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#14B8A6",
                    textDecoration: "none",
                    background: "#F0FCFB",
                    border: "1px solid #CCFBF1",
                    borderRadius: "8px",
                    padding: "8px 14px"
                  }}
                >
                  <span>Read Full News Story on Biotecnika</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            {/* Right Sidebar */}
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
                    <button
                      key={i}
                      onClick={() => !submitted && setSelected(i)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "13px 16px",
                        borderRadius: "10px",
                        border: "1.5px solid",
                        cursor: submitted ? "default" : "pointer",
                        fontFamily: "inherit",
                        background: submitted
                          ? (i === art.quiz.answer ? "#F0FCFB" : i === selected ? "#FEF2F2" : "#fff")
                          : selected === i ? "#F0FCFB" : "#fff",
                        borderColor: submitted
                          ? (i === art.quiz.answer ? "#14B8A6" : i === selected ? "#EF4444" : "#E2EEF0")
                          : selected === i ? "#14B8A6" : "#E2EEF0",
                        textAlign: "left"
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: `2px solid ${selected === i || (submitted && i === art.quiz.answer) ? "#14B8A6" : "#E2EEF0"}`,
                          background: selected === i || (submitted && i === art.quiz.answer) ? "#14B8A6" : "#fff",
                          flexShrink: 0
                        }}
                      />
                      <span style={{ fontSize: "14px", color: "#374151" }}>{opt}</span>
                    </button>
                  ))}
                </div>
                {submitted ? (
                  <div style={{ padding: "12px", borderRadius: "10px", background: correct ? "#F0FCFB" : "#FEF2F2", textAlign: "center" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: correct ? "#14B8A6" : "#EF4444" }}>
                      {correct ? `✅ Correct! ${art.quiz.xp} earned!` : `❌ Not quite. The answer is: ${art.quiz.options[art.quiz.answer]}`}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    style={{
                      width: "100%",
                      padding: "13px",
                      background: selected !== null ? "#14B8A6" : "#E2EEF0",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: selected !== null ? "pointer" : "default",
                      fontFamily: "inherit"
                    }}
                  >
                    Submit Answer
                  </button>
                )}
              </div>

              {/* Missed Yesterday */}
              <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", border: "1px solid #E2EEF0" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "16px" }}>Missed Yesterday? ⏱</h3>
                {art.missed && art.missed.map((m, i) => (
                  <a
                    key={i}
                    href={m.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "10px 0",
                      borderBottom: i < art.missed.length - 1 ? "1px solid #F0F7F8" : "none",
                      textDecoration: "none",
                      color: "inherit"
                    }}
                  >
                    <img src={m.img} alt="" style={{ width: 52, height: 44, borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "11px", color: "#14B8A6", fontWeight: 600, marginBottom: "2px" }}>{m.date}</p>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A", lineHeight: "1.4" }}>{m.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}