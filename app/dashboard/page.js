"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";
import DailyBioChallenge from "@/components/DailyBioChallenge";

const C = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #E2EEF0",
  },
  cardTitle: { fontSize: "15px", fontWeight: 600, color: "#1B2B3A" },
};

/* ── Student Dashboard ── */
function StudentDashboard({ profile }) {
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      // 1. Fetch live events from /api/events safely
      try {
        const resEv = await fetch("/api/events");
        if (resEv && resEv.ok) {
          const dataEv = await resEv.json();
          const evList = Array.isArray(dataEv) ? dataEv : dataEv?.events || [];
          if (evList.length > 0 && isMounted) {
            const parsed = evList.slice(0, 3).map((ev) => {
              const rawDate = ev?.schedule?.start_date || ev?.event_date || ev?.date || ev?.created_at || "2026-08-26";
              const dt = new Date(rawDate);
              const valid = !isNaN(dt.getTime());

              let locText = "Virtual / Online";
              if (typeof ev?.location === "string") {
                locText = ev.location;
              } else if (ev?.location && typeof ev.location === "object") {
                locText = ev.location.city ? `${ev.location.city}, India` : "India";
              } else if (typeof ev?.category === "string") {
                locText = ev.category;
              }

              return {
                month: valid ? dt.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "AUG",
                day: valid ? String(dt.getDate()).padStart(2, "0") : "26",
                title: typeof ev?.title === "string" ? ev.title : "Biotech Event",
                loc: locText,
                link: typeof ev?.pricing_and_registration?.registration_url === "string" 
                  ? ev.pricing_and_registration.registration_url 
                  : (typeof ev?.registration_url === "string" ? ev.registration_url : "/events")
              };
            });
            setLiveEvents(parsed);
          }
        }
      } catch (err) {
        console.warn("Dashboard events fetch warning:", err);
      }

      // 2. Fetch live updates from /api/biominute safely
      try {
        const resBio = await fetch("/api/biominute");
        if (resBio && resBio.ok) {
          const dataBio = await resBio.json();
          const articles = dataBio?.allArticles || (dataBio?.article ? [dataBio.article] : []);
          if (articles.length > 0 && isMounted) {
            const updates = articles.slice(0, 3).map((art) => ({
              title: typeof art?.title === "string" ? art.title : "Biomedical Article",
              time: `${typeof art?.category === "string" ? art.category : "BIOTECNIKA NEWS"} • ${typeof art?.categoryDate === "string" ? art.categoryDate : "Today"}`
            }));
            setLiveUpdates(updates);
          }
        }
      } catch (err) {
        console.warn("Dashboard updates fetch warning:", err);
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  const displayUpdates = liveUpdates.length > 0 ? liveUpdates : [
    { title: "EcoRI Enzyme Guide", time: "2-mark summary uploaded • 1h ago" },
    { title: "Protein Purification", time: "5-mark detailed notes • 3h ago" },
    { title: "Microbial Growth Curves", time: "One-paragraph revision • 1d ago" },
  ];

  const displayEvents = liveEvents.length > 0 ? liveEvents : [
    { month: "AUG", day: "14", title: "Annual Biotech Symposium", loc: "Main Auditorium • 10:00 AM", isFirst: true },
    { month: "SEP", day: "05", title: "National Case Competition", loc: "Group-stage format (36 Teams)" },
    { month: "SEP", day: "12", title: "Lab Skills Workshop", loc: "Registration closes tomorrow", urgent: true },
  ];

  return (
    <div>
      <style>{`
        .challenge-opt-btn {
          padding: 10px 24px;
          border: 1.5px solid #E2EEF0;
          border-radius: 12px;
          background: #ffffff;
          font-size: 14px;
          font-weight: 600;
          color: #132D35;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease-in-out;
          outline: none;
        }
        .challenge-opt-btn:hover {
          border-color: #14B8A6 !important;
          color: #14B8A6 !important;
          background: #F0FCFB !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(20, 184, 166, 0.15);
        }
        .challenge-opt-btn.correct {
          border-color: #22C55E !important;
          color: #15803D !important;
          background: #F0FDF4 !important;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.18) !important;
        }
        .challenge-opt-btn.wrong {
          border-color: #EF4444 !important;
          color: #B91C1C !important;
          background: #FEF2F2 !important;
        }

        .dashboard-three-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .dashboard-two-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        @media (max-width: 1023px) {
          .dashboard-hero-illustration { display: none !important; }
          .dashboard-three-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .dashboard-two-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .dashboard-three-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Hero banner */}
      <div style={{ background: "#FDF6E3", borderRadius: "24px", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#132D35", marginBottom: "8px" }}>Welcome Back, {profile?.full_name?.split(" ")[0] || "Name"}!</h1>
          <p style={{ fontSize: "15px", color: "#6B8A9A", marginBottom: "20px" }}>Your academic journey continues here</p>
          <a href="/profile" style={{ display: "inline-block", background: "#132D35", color: "#fff", padding: "10px 24px", borderRadius: "100px", fontSize: "14px", fontWeight: 500 }}>View Profile</a>
        </div>
        <div className="dashboard-hero-illustration" style={{ position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%)", width: "350px", height: "350px", display: "flex", alignItems: "center", justifyContent: "flex-end", mixBlendMode: "multiply", pointerEvents: "none", zIndex: 1 }}>
           <img src="/banner-illustration.jpg" alt="Illustration" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      </div>

      <div className="dashboard-three-grid">
        {/* Learning Progress */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <h3
            style={{
              ...C.cardTitle,
              marginBottom: "24px",
              fontSize: "16px",
              color: "#132D35",
            }}
          >
            Learning Progress
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "32px 0 40px",
            }}
          >
            <div style={{ position: "relative", width: 120, height: 120 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#E2EEF0"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 48 * 0.73} ${2 * Math.PI * 48 * 0.27}`}
                  strokeDashoffset={2 * Math.PI * 48 * 0.25}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#132D35",
                }}
              >
                73%
              </div>
            </div>
          </div>
          {[
            { label: "Biomolecules & Bioenergetics", pct: 85 },
            { label: "Genetics & Molecular Biology", pct: 75 },
            { label: "Animal Cell Culture", pct: 60 },
          ].map((s, i) => (
            <div key={s.label} style={{ marginBottom: i < 2 ? "14px" : "0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 700, color: "#132D35", marginBottom: "6px" }}>
                <span>{s.label}</span>
                <span style={{ color: "#14B8A6" }}>{s.pct}%</span>
              </div>
              <div style={{ height: 6, background: "#E2EEF0", borderRadius: "6px" }}><div style={{ height: 6, width: `${s.pct}%`, background: "#14B8A6", borderRadius: "6px" }}></div></div>
            </div>
          ))}
        </div>

        {/* Quick Updates */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h3 style={{ ...C.cardTitle, marginBottom: "24px", fontSize: "16px", color: "#132D35" }}>Quick Updates</h3>
          {displayUpdates.map((u, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: 40, height: 40, background: "#E0F2FE", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                📄
              </div>
              <div><p style={{ fontSize: "14px", fontWeight: 700, color: "#132D35", marginBottom: "4px" }}>{u.title}</p><p style={{ fontSize: "12px", color: "#9CA3AF" }}>{u.time}</p></div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h3 style={{ ...C.cardTitle, marginBottom: "24px", fontSize: "16px", color: "#132D35" }}>Upcoming Events</h3>
          {displayEvents.map((ev, i) => {
            const isFirst = i === 0;
            return (
              <div key={i} style={{ display: "flex", gap: "16px", padding: isFirst ? "12px" : "0", background: isFirst ? "#E0F2FE" : "transparent", borderRadius: "12px", marginBottom: isFirst ? "16px" : "20px", marginLeft: isFirst ? "-12px" : "0", marginRight: isFirst ? "-12px" : "0" }}>
                <div style={{ width: 44, height: 44, background: isFirst ? "#fff" : "#E0F2FE", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "10px", color: "#14B8A6", fontWeight: 700, textTransform: "uppercase" }}>{ev.month}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#132D35" }}>{ev.day}</div>
                </div>
                <div><p style={{ fontSize: "14px", fontWeight: 700, color: "#132D35", marginBottom: "4px" }}>{ev.title}</p><p style={{ fontSize: "12px", color: ev.urgent ? "#F97316" : "#9CA3AF" }}>{ev.loc}</p></div>
              </div>
            );
          })}
          <a href="/events" style={{ display: "block", textAlign: "right", fontSize: "13px", color: "#14B8A6", fontWeight: 600, marginTop: "24px" }}>View full calendar →</a>
        </div>
      </div>

      {/* Daily Bio-Challenge */}
      <DailyBioChallenge />
    </div>
  );
}

/* ── Educator Dashboard ── */
function EducatorDashboard({ profile }) {
  const submissions = [
    {
      initials: "KT",
      name: "Krish Topiwala",
      task: "Lab Report 3 - CRISPR Editing",
      status: "Due Today",
      statusColor: "#F97316",
    },
    {
      initials: "NM",
      name: "Neer Marvaniya",
      task: "Bioinformatics Report",
      status: "Submitted 1d ago",
      statusColor: "#6B8A9A",
    },
    {
      initials: "VP",
      name: "Veer Parsaniya",
      task: "Microbiology PYQ Quiz",
      status: "Submitted 2d ago",
      statusColor: "#6B8A9A",
    },
    {
      initials: "HM",
      name: "Hemang Mistry",
      task: "Genetic Engineering Quiz",
      status: "Due Today",
      statusColor: "#F97316",
    },
  ];
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #F0FDF9 0%, #E8F9F5 100%)", borderRadius: "20px", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", border: "1px solid #B2EDE1", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1B2B3A", marginBottom: "6px" }}>Welcome Back, Professor!</h1>
          <p style={{ fontSize: "14px", color: "#6B8A9A", marginBottom: "20px" }}>You have 24 new submissions to grade across 3 active courses.</p>
          <a href="/profile" style={{ display: "inline-block", background: "#1B2B3A", color: "#fff", padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 500 }}>View Profile</a>
        </div>
        <div style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)", width: "280px", height: "280px", mixBlendMode: "multiply", zIndex: 1 }}>
          <img src="/educator-illustration.png" alt="Educator Illustration" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "20px",
        }}
      >
        {/* Needs Grading */}
        <div style={C.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>📋</span>
              <h3
                style={{ fontSize: "16px", fontWeight: 600, color: "#1B2B3A" }}
              >
                Needs Grading
              </h3>
            </div>
            <span
              style={{
                fontSize: "12px",
                background: "#FFF3E8",
                color: "#F97316",
                padding: "4px 12px",
                borderRadius: "100px",
                fontWeight: 600,
              }}
            >
              24 Pending
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {["All (24)", "Bio 101 (14)", "Genetics 202 (10)"].map((t, i) => (
              <button
                key={t}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  border: "1.5px solid",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background: i === 0 ? "#14B8A6" : "#fff",
                  color: i === 0 ? "#fff" : "#6B8A9A",
                  borderColor: i === 0 ? "#14B8A6" : "#E2EEF0",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {submissions.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 0",
                borderBottom:
                  i < submissions.length - 1 ? "1px solid #F0F7F8" : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#E2EEF0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1B2B3A",
                  flexShrink: 0,
                }}
              >
                {s.initials}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1B2B3A",
                  }}
                >
                  {s.name}
                </p>
                <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{s.task}</p>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  color: s.statusColor,
                  background: s.statusColor + "15",
                  padding: "3px 10px",
                  borderRadius: "100px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {s.status}
              </span>
              <button
                style={{
                  padding: "7px 14px",
                  background: "#fff",
                  border: "1.5px solid #14B8A6",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#14B8A6",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Grade Now
              </button>
            </div>
          ))}
          <a
            href="/learning"
            style={{
              display: "block",
              fontSize: "13px",
              color: "#14B8A6",
              fontWeight: 500,
              marginTop: "16px",
            }}
          >
            View All Submissions →
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Courses Progress */}
          <div style={C.card}>
            <h3 style={{ ...C.cardTitle, marginBottom: "16px" }}>
              Courses Progress
            </h3>
            {[
              { name: "Biology 101", pct: 75 },
              { name: "Genetics 202", pct: 40 },
            ].map((c, i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#1B2B3A",
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#14B8A6",
                    }}
                  >
                    {c.pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#E2EEF0",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      height: 6,
                      width: `${c.pct}%`,
                      background: "#14B8A6",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9CA3AF",
                    marginTop: "4px",
                  }}
                >
                  Last updated {i === 0 ? "2" : "3"} hours ago
                </p>
              </div>
            ))}
            <a
              href="/learning"
              style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 500 }}
            >
              View my Course →
            </a>
          </div>

          {/* Events */}
          <div style={C.card}>
            <h3 style={{ ...C.cardTitle, marginBottom: "16px" }}>Events</h3>
            {[
              {
                month: "OCT",
                day: "13",
                title: "Advanced Genetics Workshop",
                loc: "10:00 AM • IAR",
              },
              {
                month: "NOV",
                day: "10",
                title: "Bioinformatics Workshop",
                loc: "12:00 PM • IAR",
              },
              {
                month: "DEC",
                day: "30",
                title: "Cell and Microbiology",
                loc: "14:00 PM • IAR",
              },
            ].map((ev, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "8px 0",
                  borderBottom: i < 2 ? "1px solid #F0F7F8" : "none",
                }}
              >
                <div style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#14B8A6",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    {ev.month}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#1B2B3A",
                    }}
                  >
                    {ev.day}
                  </div>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1B2B3A",
                    }}
                  >
                    {ev.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{ev.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Researcher Dashboard ── */
function ResearcherDashboard({ profile }) {
  const [papers, setPapers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: p } = await supabase
          .from("research_papers")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
        setPapers(p || []);
        const { data: e } = await supabase
          .from("events")
          .select("*")
          .gte("event_date", new Date().toISOString())
          .order("event_date")
          .limit(3);
        setEvents(e || []);
      } catch (err) {
        console.warn("ResearcherDashboard load error:", err);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #F0FDF9 0%, #EBF9F6 100%)", borderRadius: "20px", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", border: "1px solid #B2EDE1", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1B2B3A", marginBottom: "6px" }}>Welcome Back, Dr. {profile?.full_name?.split(" ")[0]}!</h1>
          <p style={{ fontSize: "14px", color: "#6B8A9A", marginBottom: "20px" }}>Continue your Research Journey here</p>
          <a href="/profile" style={{ display: "inline-block", background: "#1B2B3A", color: "#fff", padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 500 }}>View Profile</a>
        </div>
        <div style={{ position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%)", width: "320px", height: "320px", mixBlendMode: "multiply", zIndex: 1 }}>
          <img src="/researcher-illustration.png" alt="Researcher Illustration" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "20px",
        }}
      >
        {/* Research Papers */}
        <div style={C.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>📄</span>
              <h3
                style={{ fontSize: "16px", fontWeight: 600, color: "#1B2B3A" }}
              >
                Research Papers
              </h3>
            </div>
            <span
              style={{
                fontSize: "12px",
                background: "#EEF7F7",
                color: "#14B8A6",
                padding: "4px 12px",
                borderRadius: "100px",
                fontWeight: 600,
              }}
            >
              5 Unread
            </span>
          </div>
          {papers.length === 0 ? (
            <p
              style={{ fontSize: "14px", color: "#9CA3AF", padding: "20px 0" }}
            >
              No papers yet.{" "}
              <a href="/research" style={{ color: "#14B8A6" }}>
                Browse research →
              </a>
            </p>
          ) : (
            papers.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 0",
                  borderBottom:
                    i < papers.length - 1 ? "1px solid #F0F7F8" : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#EEF7F7",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  📄
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1B2B3A",
                    }}
                  >
                    {p.title?.slice(0, 40)}
                    {p.title?.length > 40 ? "..." : ""}
                  </p>
                  <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                    {p.journal || "BioConnect"}
                  </p>
                </div>
                <a
                  href="/research"
                  style={{
                    padding: "6px 14px",
                    border: "1.5px solid #14B8A6",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#14B8A6",
                  }}
                >
                  Read Now
                </a>
              </div>
            ))
          )}
          <a
            href="/research"
            style={{
              display: "block",
              fontSize: "13px",
              color: "#14B8A6",
              fontWeight: 500,
              marginTop: "16px",
            }}
          >
            View All Research Papers →
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Opportunities */}
          <div style={C.card}>
            <h3 style={{ ...C.cardTitle, marginBottom: "16px" }}>
              Opportunities & Jobs
            </h3>
            {[
              {
                title: "Postdoctoral Fellow - Genomics",
                org: "Broad Institute • Surat, Gujarat",
              },
              {
                title: "Lead CRISPR Researcher",
                org: "National Science Foundation • Surat",
              },
            ].map((j, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "10px 0",
                  borderBottom: i === 0 ? "1px solid #F0F7F8" : "none",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: "#EEF7F7",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  🔬
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1B2B3A",
                    }}
                  >
                    {j.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{j.org}</p>
                </div>
              </div>
            ))}
            <a
              href="/jobs"
              style={{
                display: "block",
                fontSize: "13px",
                color: "#14B8A6",
                fontWeight: 500,
                marginTop: "12px",
              }}
            >
              View my Opportunities & Jobs →
            </a>
          </div>

          {/* Academic Events */}
          <div style={C.card}>
            <h3 style={{ ...C.cardTitle, marginBottom: "16px" }}>
              Academic Events
            </h3>
            {events.length === 0
              ? [
                  {
                    month: "OCT",
                    day: "13",
                    title: "Genomics Symposium 2026",
                    loc: "Main Auditorium • 10:00 AM",
                  },
                  {
                    month: "NOV",
                    day: "10",
                    title: "Lab Equipment Orientation",
                    loc: "Wing B • 2:00 PM",
                  },
                  {
                    month: "DEC",
                    day: "30",
                    title: "Data Publishing Workshop",
                    loc: "Virtual • 1:00 PM",
                  },
                ].map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "8px 0",
                      borderBottom: i < 2 ? "1px solid #F0F7F8" : "none",
                    }}
                  >
                    <div
                      style={{ width: 40, textAlign: "center", flexShrink: 0 }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#14B8A6",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {ev.month}
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#1B2B3A",
                        }}
                      >
                        {ev.day}
                      </div>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#1B2B3A",
                        }}
                      >
                        {ev.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                        {ev.loc}
                      </p>
                    </div>
                  </div>
                ))
              : events.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "8px 0",
                      borderBottom:
                        i < events.length - 1 ? "1px solid #F0F7F8" : "none",
                    }}
                  >
                    <div
                      style={{ width: 40, textAlign: "center", flexShrink: 0 }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#14B8A6",
                          fontWeight: 600,
                        }}
                      >
                        {new Date(ev.event_date)
                          .toLocaleString("en", { month: "short" })
                          .toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#1B2B3A",
                        }}
                      >
                        {new Date(ev.event_date).getDate()}
                      </div>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#1B2B3A",
                        }}
                      >
                        {ev.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                        {ev.location}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard Page ── */
export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: authData, error: authErr } = await supabase.auth.getUser();
        if (authErr || !authData?.user) {
          window.location.href = "/login";
          return;
        }
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();
        if (prof) setProfile(prof);
      } catch (err) {
        console.warn("Dashboard load warning:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AppShell active="/dashboard">
      {loading ? (
        <div
          style={{ padding: "100px", textAlign: "center", color: "#9CA3AF" }}
        >
          Loading...
        </div>
      ) : profile?.role === "educator" ? (
        <EducatorDashboard profile={profile} />
      ) : profile?.role === "researcher" ? (
        <ResearcherDashboard profile={profile} />
      ) : (
        <StudentDashboard profile={profile} />
      )}
    </AppShell>
  );
}
