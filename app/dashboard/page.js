"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";

/* ── Student Dashboard ── */
function StudentDashboard({ profile }) {
  return (
    <div>
      {/* Hero banner */}
<<<<<<< HEAD
      <div style={{ background: "linear-gradient(135deg, #FFF8F0 0%, #FFF3E8 100%)", borderRadius: "20px", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", border: "1px solid #FFE8CC" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1B2B3A", marginBottom: "6px" }}>Welcome Back, {profile?.full_name?.split(" ")[0]}!</h1>
          <p style={{ fontSize: "14px", color: "#6B8A9A", marginBottom: "20px" }}>Your academic journey continues here</p>
          <a href="/profile" style={{ display: "inline-block", background: "#1B2B3A", color: "#fff", padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 500 }}>View Profile</a>
        </div>
        <div style={{ fontSize: "80px", opacity: 0.8 }}>🔬</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Learning Progress */}
        <div style={C.card}>
          <h3 style={C.cardTitle}>Learning Progress</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "16px 0" }}>
            <div style={{ position: "relative", width: 100, height: 100 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E2EEF0" strokeWidth="8"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#14B8A6" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 40 * 0.68} ${2 * Math.PI * 40 * 0.32}`} strokeDashoffset={2 * Math.PI * 40 * 0.25} transform="rotate(-90 50 50)"/>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, color: "#1B2B3A" }}>68%</div>
            </div>
          </div>
          {[{ label: "Biochemistry", pct: 80 }, { label: "Genetics", pct: 55 }].map(s => (
            <div key={s.label} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B8A9A", marginBottom: "4px" }}><span>{s.label}</span></div>
              <div style={{ height: 4, background: "#E2EEF0", borderRadius: "4px" }}><div style={{ height: 4, width: `${s.pct}%`, background: "#14B8A6", borderRadius: "4px" }}></div></div>
=======
      <div style={{ background: "#FDF6E3", borderRadius: "24px", padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", position: "relative" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#132D35", marginBottom: "8px" }}>Welcome Back, {profile?.full_name?.split(" ")[0] || "Name"}!</h1>
          <p style={{ fontSize: "16px", color: "#6B8A9A", marginBottom: "24px" }}>Your academic journey continues here</p>
          <a href="/profile" style={{ display: "inline-block", background: "#132D35", color: "#fff", padding: "12px 28px", borderRadius: "100px", fontSize: "15px", fontWeight: 500 }}>View Profile</a>
        </div>
        <div style={{ position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%)", width: "350px", height: "350px", display: "flex", alignItems: "center", justifyContent: "flex-end", mixBlendMode: "multiply", pointerEvents: "none" }}>
           <img src="/banner-illustration.jpg" alt="Illustration" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Learning Progress */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h3 style={{ ...C.cardTitle, marginBottom: "24px", fontSize: "16px", color: "#132D35" }}>Learning Progress</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "32px 0 40px" }}>
            <div style={{ position: "relative", width: 120, height: 120 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#E2EEF0" strokeWidth="12"/>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#14B8A6" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 48 * 0.68} ${2 * Math.PI * 48 * 0.32}`} strokeDashoffset={2 * Math.PI * 48 * 0.25} transform="rotate(-90 60 60)"/>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#132D35" }}>68%</div>
            </div>
          </div>
          {[{ label: "Biochemistry", pct: 80 }, { label: "Genetics", pct: 55 }].map((s, i) => (
            <div key={s.label} style={{ marginBottom: i === 0 ? "16px" : "0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#132D35", marginBottom: "8px" }}><span>{s.label}</span></div>
              <div style={{ height: 6, background: "#E2EEF0", borderRadius: "6px" }}><div style={{ height: 6, width: `${s.pct}%`, background: "#14B8A6", borderRadius: "6px" }}></div></div>
>>>>>>> fa1d966cb33a4fbd1b30a38ad7981ae6c5ca9a1c
            </div>
          ))}
        </div>

        {/* Quick Updates */}
<<<<<<< HEAD
        <div style={C.card}>
          <h3 style={C.cardTitle}>Quick Updates</h3>
          {[
            { title: "ECoRI Enzyme Guide", time: "2-mark summary uploaded • 1h ago" },
            { title: "Protein Purification", time: "5-mark detailed notes • 3h ago" },
            { title: "Microbial Growth Curves", time: "One-paragraph revision • 1d ago" },
          ].map((u, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: i < 2 ? "1px solid #F0F7F8" : "none" }}>
              <div style={{ width: 36, height: 36, background: "#EEF7F7", borderRadius: "8px", flexShrink: 0 }}></div>
              <div><p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{u.title}</p><p style={{ fontSize: "12px", color: "#9CA3AF" }}>{u.time}</p></div>
=======
        <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h3 style={{ ...C.cardTitle, marginBottom: "24px", fontSize: "16px", color: "#132D35" }}>Quick Updates</h3>
          {[
            { title: "EcoRI Enzyme Guide", time: "2-mark summary uploaded • 1h ago" },
            { title: "Protein Purification", time: "5-mark detailed notes • 3h ago" },
            { title: "Microbial Growth Curves", time: "One-paragraph revision • 1d ago" },
          ].map((u, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: 40, height: 40, background: "#E0F2FE", borderRadius: "8px", flexShrink: 0 }}></div>
              <div><p style={{ fontSize: "14px", fontWeight: 700, color: "#132D35", marginBottom: "4px" }}>{u.title}</p><p style={{ fontSize: "12px", color: "#9CA3AF" }}>{u.time}</p></div>
>>>>>>> fa1d966cb33a4fbd1b30a38ad7981ae6c5ca9a1c
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
<<<<<<< HEAD
        <div style={C.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={C.cardTitle}>Upcoming Events</h3>
            <a href="/eventss" style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 500 }}>View full calendar →</a>
          </div>
          {[
            { month: "AUG", day: "14", title: "Annual Biotech Symposium", loc: "Main Auditorium • 10:00 AM" },
            { month: "SEP", day: "05", title: "National Case Competition", loc: "Group-stage format" },
            { month: "SEP", day: "12", title: "Lab Skills Workshop", loc: "Registration closes tomorrow", urgent: true },
          ].map((ev, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: i < 2 ? "1px solid #F0F7F8" : "none" }}>
              <div style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "10px", color: "#14B8A6", fontWeight: 600, textTransform: "uppercase" }}>{ev.month}</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#1B2B3A" }}>{ev.day}</div>
              </div>
              <div><p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{ev.title}</p><p style={{ fontSize: "12px", color: ev.urgent ? "#F97316" : "#9CA3AF" }}>{ev.loc}</p></div>
            </div>
          ))}
=======
        <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h3 style={{ ...C.cardTitle, marginBottom: "24px", fontSize: "16px", color: "#132D35" }}>Upcoming Events</h3>
          {[
            { month: "AUG", day: "14", title: "Annual Biotech Symposium", loc: "Main Auditorium • 10:00 AM", isFirst: true },
            { month: "SEP", day: "05", title: "National Case Competition", loc: "Group-stage format (36 Teams)" },
            { month: "SEP", day: "12", title: "Lab Skills Workshop", loc: "Registration closes tomorrow", urgent: true },
          ].map((ev, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", padding: ev.isFirst ? "12px" : "0", background: ev.isFirst ? "#E0F2FE" : "transparent", borderRadius: "12px", marginBottom: ev.isFirst ? "16px" : "20px", marginLeft: ev.isFirst ? "-12px" : "0", marginRight: ev.isFirst ? "-12px" : "0" }}>
              <div style={{ width: 44, height: 44, background: ev.isFirst ? "#fff" : "#E0F2FE", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "10px", color: "#14B8A6", fontWeight: 700, textTransform: "uppercase" }}>{ev.month}</div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#132D35" }}>{ev.day}</div>
              </div>
              <div><p style={{ fontSize: "14px", fontWeight: 700, color: "#132D35", marginBottom: "4px" }}>{ev.title}</p><p style={{ fontSize: "12px", color: ev.urgent ? "#F97316" : "#9CA3AF" }}>{ev.loc}</p></div>
            </div>
          ))}
          <a href="/events" style={{ display: "block", textAlign: "right", fontSize: "13px", color: "#14B8A6", fontWeight: 600, marginTop: "24px" }}>View full calendar →</a>
>>>>>>> fa1d966cb33a4fbd1b30a38ad7981ae6c5ca9a1c
        </div>
      </div>

      {/* Daily Bio-Challenge */}
<<<<<<< HEAD
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px 28px", border: "1px solid #E2EEF0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🎯</span>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#1B2B3A" }}>Daily Bio-Challenge</span>
            <span style={{ fontSize: "12px", background: "#FFF3E8", color: "#F97316", padding: "3px 10px", borderRadius: "100px", fontWeight: 500 }}>Expires in 4h</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", color: "#1B2B3A", fontWeight: 600 }}>Current Streak 🔥 4 Days</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: i < 4 ? "#14B8A6" : "#E2EEF0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: i < 4 ? "#fff" : "#6B8A9A" }}>{i < 4 ? "✓" : d}</div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: "14px", color: "#1B2B3A", margin: "16px 0" }}>What type of DNA overhang is produced by the EcoRI restriction enzyme?</p>
        <div style={{ display: "flex", gap: "12px" }}>
          {["5' Sticky", "3' Sticky", "Blunt End"].map((opt) => (
            <button key={opt} style={{ padding: "10px 24px", border: "1.5px solid #E2EEF0", borderRadius: "10px", background: "#fff", fontSize: "14px", fontWeight: 500, color: "#1B2B3A", cursor: "pointer", fontFamily: "inherit" }}>{opt}</button>
          ))}
=======
      <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>🎯</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#132D35" }}>Daily Bio-Challenge</span>
            <span style={{ fontSize: "12px", background: "#FFF3E8", color: "#F97316", padding: "4px 12px", borderRadius: "100px", fontWeight: 700 }}>Expires in 4h</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "15px", color: "#132D35", fontWeight: 800 }}>Current Streak 🔥 4 Days</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
           <div>
             <p style={{ fontSize: "14px", color: "#6B8A9A", marginBottom: "16px" }}>What type of DNA overhang is produced by the EcoRI restriction enzyme?</p>
             <div style={{ display: "flex", gap: "12px" }}>
               {["5' Sticky", "3' Sticky", "Blunt End"].map((opt) => (
                 <button key={opt} style={{ padding: "10px 24px", border: "1.5px solid #E2EEF0", borderRadius: "12px", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#6B8A9A", cursor: "pointer", fontFamily: "inherit" }}>{opt}</button>
               ))}
             </div>
           </div>
           
           <div style={{ display: "flex", gap: "8px" }}>
             {[1, 2, 3, 4, 5, 6, 7].map((d, i) => (
               <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: i < 4 ? "#14B8A6" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: i < 4 ? "#fff" : "#9CA3AF" }}>
                 {i < 4 ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : d}
               </div>
             ))}
           </div>
>>>>>>> fa1d966cb33a4fbd1b30a38ad7981ae6c5ca9a1c
        </div>
      </div>
    </div>
  );
}

/* ── Educator Dashboard ── */
function EducatorDashboard({ profile }) {
  const submissions = [
    { initials: "KT", name: "Krish Topiwala", task: "Lab Report 3 - CRISPR Editing", status: "Due Today", statusColor: "#F97316" },
    { initials: "NM", name: "Neer Marvaniya", task: "Bioinformatics Report", status: "Submitted 1d ago", statusColor: "#6B8A9A" },
    { initials: "VP", name: "Veer Parsaniya", task: "Microbiology PYQ Quiz", status: "Submitted 2d ago", statusColor: "#6B8A9A" },
    { initials: "HM", name: "Hemang Mistry", task: "Genetic Engineering Quiz", status: "Due Today", statusColor: "#F97316" },
  ];
  return (
    <div>
<<<<<<< HEAD
      <div style={{ background: "linear-gradient(135deg, #F0FDF9 0%, #E8F9F5 100%)", borderRadius: "20px", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", border: "1px solid #B2EDE1" }}>
        <div>
=======
      <div style={{ background: "linear-gradient(135deg, #F0FDF9 0%, #E8F9F5 100%)", borderRadius: "20px", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", border: "1px solid #B2EDE1", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
>>>>>>> fa1d966cb33a4fbd1b30a38ad7981ae6c5ca9a1c
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1B2B3A", marginBottom: "6px" }}>Welcome Back, Professor!</h1>
          <p style={{ fontSize: "14px", color: "#6B8A9A", marginBottom: "20px" }}>You have 24 new submissions to grade across 3 active courses.</p>
          <a href="/profile" style={{ display: "inline-block", background: "#1B2B3A", color: "#fff", padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 500 }}>View Profile</a>
        </div>
<<<<<<< HEAD
        <div style={{ fontSize: "80px", opacity: 0.8 }}>📚</div>
=======
        <div style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)", width: "280px", height: "280px", mixBlendMode: "multiply", zIndex: 1 }}>
          <img src="/educator-illustration.png" alt="Educator Illustration" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
>>>>>>> fa1d966cb33a4fbd1b30a38ad7981ae6c5ca9a1c
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px" }}>
        {/* Needs Grading */}
        <div style={C.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>📋</span>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1B2B3A" }}>Needs Grading</h3>
            </div>
            <span style={{ fontSize: "12px", background: "#FFF3E8", color: "#F97316", padding: "4px 12px", borderRadius: "100px", fontWeight: 600 }}>24 Pending</span>
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {["All (24)", "Bio 101 (14)", "Genetics 202 (10)"].map((t, i) => (
              <button key={t} style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "13px", border: "1.5px solid", cursor: "pointer", fontFamily: "inherit", background: i === 0 ? "#14B8A6" : "#fff", color: i === 0 ? "#fff" : "#6B8A9A", borderColor: i === 0 ? "#14B8A6" : "#E2EEF0" }}>{t}</button>
            ))}
          </div>
          {submissions.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: i < submissions.length - 1 ? "1px solid #F0F7F8" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E2EEF0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "#1B2B3A", flexShrink: 0 }}>{s.initials}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{s.name}</p>
                <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{s.task}</p>
              </div>
              <span style={{ fontSize: "11px", color: s.statusColor, background: s.statusColor + "15", padding: "3px 10px", borderRadius: "100px", fontWeight: 500, whiteSpace: "nowrap" }}>{s.status}</span>
              <button style={{ padding: "7px 14px", background: "#fff", border: "1.5px solid #14B8A6", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "#14B8A6", cursor: "pointer", fontFamily: "inherit" }}>Grade Now</button>
            </div>
          ))}
          <a href="/learning" style={{ display: "block", fontSize: "13px", color: "#14B8A6", fontWeight: 500, marginTop: "16px" }}>View All Submissions →</a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Courses Progress */}
          <div style={C.card}>
            <h3 style={{ ...C.cardTitle, marginBottom: "16px" }}>Courses Progress</h3>
            {[{ name: "Biology 101", pct: 75 }, { name: "Genetics 202", pct: 40 }].map((c, i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#1B2B3A" }}>{c.name}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#14B8A6" }}>{c.pct}%</span>
                </div>
                <div style={{ height: 6, background: "#E2EEF0", borderRadius: "4px" }}><div style={{ height: 6, width: `${c.pct}%`, background: "#14B8A6", borderRadius: "4px" }}></div></div>
                <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>Last updated {i === 0 ? "2" : "3"} hours ago</p>
              </div>
            ))}
            <a href="/learning" style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 500 }}>View my Course →</a>
          </div>

          {/* Events */}
          <div style={C.card}>
            <h3 style={{ ...C.cardTitle, marginBottom: "16px" }}>Events</h3>
            {[
              { month: "OCT", day: "13", title: "Advanced Genetics Workshop", loc: "10:00 AM • IAR" },
              { month: "NOV", day: "10", title: "Bioinformatics Workshop", loc: "12:00 PM • IAR" },
              { month: "DEC", day: "30", title: "Cell and Microbiology", loc: "14:00 PM • IAR" },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: i < 2 ? "1px solid #F0F7F8" : "none" }}>
                <div style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "10px", color: "#14B8A6", fontWeight: 600, textTransform: "uppercase" }}>{ev.month}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>{ev.day}</div>
                </div>
                <div><p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{ev.title}</p><p style={{ fontSize: "12px", color: "#9CA3AF" }}>{ev.loc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Researcher Dashboard ── */
function ResearcherDashboard({ profile, supabase }) {
  const [papers, setPapers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from("research_papers").select("*").order("created_at", { ascending: false }).limit(3);
      setPapers(p || []);
      const { data: e } = await supabase.from("events").select("*").gte("event_date", new Date().toISOString()).order("event_date").limit(3);
      setEvents(e || []);
    }
    load();
  }, []);

  return (
    <div>
<<<<<<< HEAD
      <div style={{ background: "linear-gradient(135deg, #F0FDF9 0%, #EBF9F6 100%)", borderRadius: "20px", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", border: "1px solid #B2EDE1" }}>
        <div>
=======
      <div style={{ background: "linear-gradient(135deg, #F0FDF9 0%, #EBF9F6 100%)", borderRadius: "20px", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", border: "1px solid #B2EDE1", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
>>>>>>> fa1d966cb33a4fbd1b30a38ad7981ae6c5ca9a1c
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1B2B3A", marginBottom: "6px" }}>Welcome Back, Dr. {profile?.full_name?.split(" ")[0]}!</h1>
          <p style={{ fontSize: "14px", color: "#6B8A9A", marginBottom: "20px" }}>Continue your Research Journey here</p>
          <a href="/profile" style={{ display: "inline-block", background: "#1B2B3A", color: "#fff", padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 500 }}>View Profile</a>
        </div>
<<<<<<< HEAD
        <div style={{ fontSize: "80px", opacity: 0.8 }}>🧬</div>
=======
        <div style={{ position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%)", width: "320px", height: "320px", mixBlendMode: "multiply", zIndex: 1 }}>
          <img src="/researcher-illustration.png" alt="Researcher Illustration" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
>>>>>>> fa1d966cb33a4fbd1b30a38ad7981ae6c5ca9a1c
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px" }}>
        {/* Research Papers */}
        <div style={C.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>📄</span>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1B2B3A" }}>Research Papers</h3>
            </div>
            <span style={{ fontSize: "12px", background: "#EEF7F7", color: "#14B8A6", padding: "4px 12px", borderRadius: "100px", fontWeight: 600 }}>5 Unread</span>
          </div>
          {papers.length === 0 ? <p style={{ fontSize: "14px", color: "#9CA3AF", padding: "20px 0" }}>No papers yet. <a href="/research" style={{ color: "#14B8A6" }}>Browse research →</a></p> : papers.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: i < papers.length - 1 ? "1px solid #F0F7F8" : "none" }}>
              <div style={{ width: 36, height: 36, background: "#EEF7F7", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{p.title?.slice(0, 40)}{p.title?.length > 40 ? "..." : ""}</p>
                <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{p.journal || "BioConnect"}</p>
              </div>
              <a href="/research" style={{ padding: "6px 14px", border: "1.5px solid #14B8A6", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "#14B8A6" }}>Read Now</a>
            </div>
          ))}
          <a href="/research" style={{ display: "block", fontSize: "13px", color: "#14B8A6", fontWeight: 500, marginTop: "16px" }}>View All Research Papers →</a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Opportunities */}
          <div style={C.card}>
            <h3 style={{ ...C.cardTitle, marginBottom: "16px" }}>Opportunities & Jobs</h3>
            {[
              { title: "Postdoctoral Fellow - Genomics", org: "Broad Institute • Surat, Gujarat" },
              { title: "Lead CRISPR Researcher", org: "National Science Foundation • Surat" },
            ].map((j, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: i === 0 ? "1px solid #F0F7F8" : "none" }}>
                <div style={{ width: 32, height: 32, background: "#EEF7F7", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🔬</div>
                <div><p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{j.title}</p><p style={{ fontSize: "12px", color: "#9CA3AF" }}>{j.org}</p></div>
              </div>
            ))}
            <a href="/jobs" style={{ display: "block", fontSize: "13px", color: "#14B8A6", fontWeight: 500, marginTop: "12px" }}>View my Opportunities & Jobs →</a>
          </div>

          {/* Academic Events */}
          <div style={C.card}>
            <h3 style={{ ...C.cardTitle, marginBottom: "16px" }}>Academic Events</h3>
            {events.length === 0 ? [
              { month: "OCT", day: "13", title: "Genomics Symposium 2026", loc: "Main Auditorium • 10:00 AM" },
              { month: "NOV", day: "10", title: "Lab Equipment Orientation", loc: "Wing B • 2:00 PM" },
              { month: "DEC", day: "30", title: "Data Publishing Workshop", loc: "Virtual • 1:00 PM" },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: i < 2 ? "1px solid #F0F7F8" : "none" }}>
                <div style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "10px", color: "#14B8A6", fontWeight: 600, textTransform: "uppercase" }}>{ev.month}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>{ev.day}</div>
                </div>
                <div><p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{ev.title}</p><p style={{ fontSize: "12px", color: "#9CA3AF" }}>{ev.loc}</p></div>
              </div>
            )) : events.map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: i < events.length - 1 ? "1px solid #F0F7F8" : "none" }}>
                <div style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "10px", color: "#14B8A6", fontWeight: 600 }}>{new Date(ev.event_date).toLocaleString("en", { month: "short" }).toUpperCase()}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>{new Date(ev.event_date).getDate()}</div>
                </div>
                <div><p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{ev.title}</p><p style={{ fontSize: "12px", color: "#9CA3AF" }}>{ev.location}</p></div>
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
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AppShell active="/dashboard">
      {loading ? <div style={{ padding: "100px", textAlign: "center", color: "#9CA3AF" }}>Loading...</div> : (
        profile?.role === "educator" ? <EducatorDashboard profile={profile} /> :
        profile?.role === "researcher" ? <ResearcherDashboard profile={profile} supabase={supabase} /> :
        <StudentDashboard profile={profile} />
      )}
    </AppShell>
  );
}

const C = {
  card: { background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #E2EEF0" },
  cardTitle: { fontSize: "15px", fontWeight: 600, color: "#1B2B3A" },
};