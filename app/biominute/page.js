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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);

      try {
        const res = await fetch("/api/biominute", { cache: "no-store" });
        const json = await res.json();
        if (json && json.article) {
          const sanitizeImg = (imgUrl) => (!imgUrl || typeof imgUrl !== "string" || imgUrl.includes("1507003211169") || imgUrl.includes("1576086213369"))
            ? "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80"
            : imgUrl;

          const cleanArt = {
            ...json.article,
            image: sanitizeImg(json.article.image),
            missed: (json.article.missed || []).map((m) => ({
              ...m,
              img: sanitizeImg(m.img),
              fullArticle: m.fullArticle ? {
                ...m.fullArticle,
                image: sanitizeImg(m.fullArticle.image)
              } : m.fullArticle
            }))
          };
          setArticle(cleanArt);
        }
      } catch (err) {
        console.error("Failed to load BioMinute article:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function cleanText(str) {
    if (!str) return "";
    return str
      .replace(/&#124;/g, " | ")
      .replace(/&#x7c;/gi, " | ")
      .replace(/&vert;/g, " | ")
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8211;/g, "-")
      .replace(/&#8212;/g, "—")
      .replace(/&#8230;/g, "...")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"');
  }

  function handleSubmit() {
    if (selected === null || !article) return;
    setSubmitted(true);
    setCorrect(selected === article.quiz.answer);
  }

  function handleSelectArticle(targetArt) {
    if (!targetArt) return;
    const cleanArt = {
      ...targetArt,
      image: getCleanImageUrl(targetArt.image)
    };
    setArticle(cleanArt);
    setSelected(null);
    setSubmitted(false);
    setCorrect(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const HERO_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80";

  function getCleanImageUrl(url) {
    if (!url || typeof url !== "string" || url.includes("1507003211169") || url.includes("1576086213369") || url.includes("576086213369")) {
      return HERO_IMAGE_FALLBACK;
    }
    return url;
  }

  const art = article;

  return (
    <AppShell active="/biominute">
      {loading || !art ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#6B8A9A", fontFamily: "'Poppins', sans-serif" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px", animation: "spin 1.5s linear infinite", display: "inline-block" }}>⏱</div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A" }}>Fetching today&apos;s news from Biotecnika...</p>
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
          <style>{`
            .biominute-layout-grid {
              display: grid;
              grid-template-columns: 1fr 320px;
              gap: 24px;
            }
            @media (max-width: 1023px) {
              .biominute-layout-grid {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
              }
            }
          `}</style>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>
                Today&apos;s Bio-Minute ⏱
              </h1>
              <p style={{ fontSize: "13px", color: "#6B8A9A" }}>{art.date} • {art.readTime}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFF3E8", border: "1px solid #FFD4A3", borderRadius: "10px", padding: "8px 16px" }}>
              <span style={{ fontSize: "16px" }}>🔥</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F97316" }}>{profile?.streak || art?.streak || 1} Day Streak!</span>
            </div>
          </div>

          <div className="biominute-layout-grid">
            {/* Main Article Container */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", border: "1px solid #E2EEF0" }}>
              {/* Hero image */}
              <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
                <img src={getCleanImageUrl(art.image)} alt="" style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", borderRadius: "8px", padding: "6px 12px" }}>
                  <span style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>{art.impact}</span>
                </div>
              </div>

              <p style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 700, marginBottom: "10px", letterSpacing: "0.04em" }}>
                {art.category || "BIOTECNIKA NEWS"} • {art.categoryDate}
              </p>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1B2B3A", lineHeight: "1.35", marginBottom: "20px" }}>
                {cleanText(art.title)}
              </h2>

              {/* 60-Second Summary Card */}
              <div style={{ background: "#F8FCFC", borderRadius: "14px", padding: "20px", marginBottom: "24px", border: "1px solid #E6F4F4" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#1B2B3A", marginBottom: "16px" }}>
                  The 60-Second Summary
                </p>
                {art.summary.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#E6F4F4",
                        color: "#14B8A6",
                        fontSize: "12px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "2px"
                      }}
                    >
                      {i + 1}
                    </div>
                    <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", fontWeight: 500, margin: 0 }}>
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Detailed Narrative Story Body */}
              <div style={{ fontSize: "14.5px", color: "#475569", lineHeight: "1.8", marginBottom: "24px" }}>
                <p style={{ margin: "0 0 14px" }}>{art.body}</p>
              </div>

              {art.link && (
                <a
                  href={art.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#14B8A6",
                    textDecoration: "none",
                    background: "#F0FCFB",
                    border: "1px solid #CCFBF1",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#E0F2FE"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#F0FCFB"; }}
                >
                  <span>Read Full News Story on Biotecnika</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            {/* Right Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Daily Quiz */}
              <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", border: "1px solid #E2EEF0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A", margin: 0 }}>Daily Quick Quiz</h3>
                  <span style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 700 }}>{art.quiz.xp}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px", lineHeight: "1.5" }}>
                  {art.quiz.question}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                  {art.quiz.options.map((opt, i) => {
                    const isCorrectAnswer = submitted && i === art.quiz.answer;
                    const isWrongSelected = submitted && i === selected && selected !== art.quiz.answer;
                    const isSelected = selected === i;

                    let bg = "#FFFFFF";
                    let border = "#E2EEF0";
                    let circleBorder = "#CBD5E1";
                    let circleBg = "#FFFFFF";
                    let circleIcon = null;

                    if (submitted) {
                      if (isCorrectAnswer) {
                        bg = "#F0FCFB";
                        border = "#14B8A6";
                        circleBorder = "#14B8A6";
                        circleBg = "#14B8A6";
                        circleIcon = "✓";
                      } else if (isWrongSelected) {
                        bg = "#FEF2F2";
                        border = "#EF4444";
                        circleBorder = "#EF4444";
                        circleBg = "#EF4444";
                        circleIcon = "✕";
                      } else {
                        bg = "#FFFFFF";
                        border = "#F1F5F9";
                        circleBorder = "#E2EEF0";
                        circleBg = "#FFFFFF";
                      }
                    } else if (isSelected) {
                      bg = "#F0FCFB";
                      border = "#14B8A6";
                      circleBorder = "#14B8A6";
                      circleBg = "#14B8A6";
                      circleIcon = "✓";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => !submitted && setSelected(i)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "13px 16px",
                          borderRadius: "10px",
                          border: `1.5px solid ${border}`,
                          background: bg,
                          cursor: submitted ? "default" : "pointer",
                          fontFamily: "inherit",
                          textAlign: "left",
                          opacity: submitted && !isCorrectAnswer && !isWrongSelected ? 0.6 : 1,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          if (!submitted && !isSelected) {
                            e.currentTarget.style.background = "#F8FCFC";
                            e.currentTarget.style.borderColor = "#14B8A6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!submitted && !isSelected) {
                            e.currentTarget.style.background = "#FFFFFF";
                            e.currentTarget.style.borderColor = "#E2EEF0";
                          }
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: `2px solid ${circleBorder}`,
                            background: circleBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontWeight: 800,
                            flexShrink: 0,
                            transition: "all 0.2s ease"
                          }}
                        >
                          {circleIcon}
                        </div>
                        <span style={{ fontSize: "14px", color: isWrongSelected ? "#991B1B" : isCorrectAnswer ? "#0F766E" : "#374151", fontWeight: isSelected || isCorrectAnswer ? 600 : 500 }}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {submitted ? (
                  <div style={{ padding: "12px", borderRadius: "10px", background: correct ? "#F0FCFB" : "#FEF2F2", textAlign: "center" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: correct ? "#14B8A6" : "#EF4444", margin: 0 }}>
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
                      fontFamily: "inherit",
                      boxShadow: selected !== null ? "0 4px 14px rgba(20,184,166,0.25)" : "none",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (selected !== null && !submitted) {
                        e.currentTarget.style.background = "#0D9488";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selected !== null && !submitted) {
                        e.currentTarget.style.background = "#14B8A6";
                        e.currentTarget.style.transform = "none";
                      }
                    }}
                  >
                    Submit Answer
                  </button>
                )}
              </div>

              {/* Missed Yesterday? Section (Clean Native Card Hover & Clickable) */}
              <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", border: "1px solid #E2EEF0" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "14px", margin: 0 }}>
                  Missed Yesterday? ⏱
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
                  {art.missed && art.missed.map((m, i) => (
                    <div
                      key={i}
                      onClick={() => m.fullArticle && handleSelectArticle(m.fullArticle)}
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: "1px solid transparent",
                        background: "transparent"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#F8FCFC";
                        e.currentTarget.style.borderColor = "#E2EEF0";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                    >
                      <img src={getCleanImageUrl(m.img)} alt="" style={{ width: 52, height: 44, borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: "11px", color: "#14B8A6", fontWeight: 700, marginBottom: "2px", letterSpacing: "0.03em" }}>{m.date}</p>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#1B2B3A", lineHeight: "1.4", margin: 0 }}>{cleanText(m.title)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}