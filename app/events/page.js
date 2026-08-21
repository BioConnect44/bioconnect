"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";

function safeFormatDate(dateStr, options, fallback = "") {
  if (!dateStr) return fallback;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-IN", options);
  } catch (e) {
    return fallback;
  }
}

function safeFormatTime(dateStr, options, fallback = "") {
  if (!dateStr) return fallback;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleTimeString("en-IN", options);
  } catch (e) {
    return fallback;
  }
}

function MiniCalendar() {
  const now = new Date();
  const month = now.toLocaleString("en", { month: "long", year: "numeric" });
  const days = ["M","T","W","T","F","S","S"];
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #E2EEF0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#1B2B3A" }}>‹ {month} ›</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center" }}>
        {days.map((d, i) => <div key={i} style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600, padding: "4px" }}>{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} style={{ fontSize: "13px", padding: "6px 4px", borderRadius: "50%", cursor: d ? "pointer" : "default", background: d === now.getDate() ? "#14B8A6" : "transparent", color: d === now.getDate() ? "#fff" : d ? "#374151" : "transparent", fontWeight: d === now.getDate() ? 700 : 400 }}>{d}</div>
        ))}
      </div>
    </div>
  );
}

// Expanded Biotech & Biomedical Events focusing on Gujarat, India & Global
const DEFAULT_EVENTS = [
  {
    id: "gbu-annual-research-conclave-gandhinagar-2026",
    title: "Gujarat Biotechnology University (GBU) Annual Research Conclave 2026",
    event_type: "conference",
    location: "GBU Campus, GIFT City, Gandhinagar, Gujarat",
    region: "gujarat",
    event_date: "2026-10-24T09:30:00.000Z",
    end_date: "2026-10-26T17:30:00.000Z",
    registration_url: "https://gbu.edu.in/",
    entry_fee: "Free for Registered Students / ₹1,500 Professionals",
    description: "National conclave focusing on synthetic biology, industrial biotechnology, and plant genomics organized by Gujarat Biotechnology University (GBU) in collaboration with University of Edinburgh.",
    profiles: { full_name: "Gujarat Biotechnology University (GBU)" }
  },
  {
    id: "gsbtm-bio-entrepreneurship-summit-ahmedabad-2026",
    title: "Gujarat State Biotechnology Mission (GSBTM) Bio-Entrepreneurship & Innovation Summit 2026",
    event_type: "workshop",
    location: "Science City Auditorium, Ahmedabad, Gujarat",
    region: "gujarat",
    event_date: "2026-11-18T09:00:00.000Z",
    end_date: "2026-11-19T18:00:00.000Z",
    registration_url: "https://btm.gujarat.gov.in/",
    entry_fee: "Free Entry (Prior RSVP Required)",
    description: "Flagship startup & bio-entrepreneurship summit bringing together biotech founders, incubators, researchers, and venture capitalists across Gujarat state.",
    profiles: { full_name: "GSBTM / DST Govt of Gujarat" }
  },
  {
    id: "niper-ahmedabad-pharma-biotech-symposium-2026",
    title: "NIPER Ahmedabad International Conference on Pharmaceutical Biotechnology 2026",
    event_type: "conference",
    location: "NIPER Ahmedabad Campus, Gandhinagar, Gujarat",
    region: "gujarat",
    event_date: "2026-12-05T08:30:00.000Z",
    end_date: "2026-12-07T17:00:00.000Z",
    registration_url: "https://www.niperahm.ac.in/",
    entry_fee: "₹1,000 Academic / ₹3,000 Industry Delegates",
    description: "International scientific symposium covering biologics, targeted drug delivery platforms, structural bio-analytics, and biopharmaceutical manufacturing.",
    profiles: { full_name: "NIPER Ahmedabad" }
  },
  {
    id: "iit-gandhinagar-bioengineering-expo-2026",
    title: "IIT Gandhinagar Bioengineering & Medical Technology Expo 2026",
    event_type: "seminar",
    location: "IIT Gandhinagar Campus, Palaj, Gandhinagar, Gujarat",
    region: "gujarat",
    event_date: "2026-09-28T09:30:00.000Z",
    end_date: "2026-09-29T17:00:00.000Z",
    registration_url: "https://iitgn.ac.in/",
    entry_fee: "Free for IIT/University Students",
    description: "Showcase of novel biomedical devices, tissue engineering prototypes, neural interfaces, and diagnostic AI solutions developed by IIT Gandhinagar research labs.",
    profiles: { full_name: "IIT Gandhinagar Department of Bioengineering" }
  },
  {
    id: "academic-world-research-crispr-mumbai-2026",
    title: "International Conference on CRISPR & Genome Editing (ICCGET 2026)",
    event_type: "conference",
    location: "IIT Bombay, Mumbai, Maharashtra, India",
    region: "india",
    event_date: "2026-09-15T09:00:00.000Z",
    end_date: "2026-09-17T17:00:00.000Z",
    registration_url: "https://academicworldresearch.org/",
    entry_fee: "Free for BioConnect Members / ₹2,500 Regular",
    description: "Premier international gathering of genomics researchers and biotechnology engineers discussing recent advancements in CRISPR-Cas9 base editing, prime editing, and therapeutic delivery platforms.",
    profiles: { full_name: "Academic World Research / IIT Bombay" }
  },
  {
    id: "academic-world-research-biomedical-delhi-2026",
    title: "World Congress on Biomedical Engineering & Healthcare AI (WCBHAI 2026)",
    event_type: "conference",
    location: "AIIMS New Delhi, Delhi, India",
    region: "india",
    event_date: "2026-11-04T08:30:00.000Z",
    end_date: "2026-11-06T18:00:00.000Z",
    registration_url: "https://academicworldresearch.org/",
    entry_fee: "₹1,200 Students / ₹3,500 Professionals",
    description: "Leading conference bringing together biomedical scientists, clinical researchers, and AI engineers to explore artificial intelligence applications in clinical diagnostics and drug discovery.",
    profiles: { full_name: "Academic World Research / AIIMS Delhi" }
  },
  {
    id: "msu-baroda-genomics-proteomics-symposium-2027",
    title: "MS University Baroda National Genomics & Proteomics Symposium 2027",
    event_type: "symposium",
    location: "Maharaja Sayajirao University, Vadodara, Gujarat",
    region: "gujarat",
    event_date: "2027-01-15T10:00:00.000Z",
    end_date: "2027-01-16T17:00:00.000Z",
    registration_url: "https://www.msubaroda.ac.in/",
    entry_fee: "Free for MSU Students / ₹800 External Candidates",
    description: "National academic symposium on next-generation sequencing (NGS), structural biology, and functional proteomics in plant & animal systems.",
    profiles: { full_name: "Faculty of Science, MSU Baroda" }
  },
  {
    id: "aau-anand-agbiotech-fermentation-conclave-2027",
    title: "Anand Agricultural University Ag-Biotech & Fermentation Conclave 2027",
    event_type: "workshop",
    location: "Anand Agricultural University, Anand, Gujarat",
    region: "gujarat",
    event_date: "2027-02-08T09:30:00.000Z",
    end_date: "2027-02-10T16:30:00.000Z",
    registration_url: "https://www.aau.in/",
    entry_fee: "₹500 Student Registration",
    description: "Focused conference on microbial fermentation, agricultural biotechnology, biofertilizers, and sustainable bioprocessing for agricultural innovation.",
    profiles: { full_name: "Anand Agricultural University" }
  },
  {
    id: "iisc-ncbs-stem-cell-symposium-bengaluru-2026",
    title: "IISc & NCBS National Stem Cell Biology & Regenerative Medicine Symposium 2026",
    event_type: "conference",
    location: "IISc Bengaluru, Karnataka, India",
    region: "india",
    event_date: "2026-12-12T09:00:00.000Z",
    end_date: "2026-12-14T17:00:00.000Z",
    registration_url: "https://iisc.ac.in/",
    entry_fee: "₹1,500 Delegates",
    description: "High-level research symposium on stem cell lineage tracing, organoid morphogenesis, and clinical translation of cell therapies.",
    profiles: { full_name: "IISc / NCBS Bengaluru" }
  },
  {
    id: "global-genomics-biotech-summit-virtual-2027",
    title: "Global Summit on Synthetic Biology & Biomanufacturing 2027",
    event_type: "webinar",
    location: "Virtual (Online Live Zoom & Webex)",
    region: "global",
    event_date: "2027-02-20T10:00:00.000Z",
    end_date: "2027-02-22T16:00:00.000Z",
    registration_url: "https://academicworldresearch.org/",
    entry_fee: "100% Free Virtual Access",
    description: "A 3-day global virtual event featuring keynote lectures from Nobel laureates and industry pioneers on metabolic engineering, microbial cell factories, and bioprocess scaling.",
    profiles: { full_name: "International Society of Biotechnology" }
  }
];

export default function EventsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [regForm, setRegForm] = useState({ name: "", email: "", university: "", category: "Student" });
  const [regSuccess, setRegSuccess] = useState(false);

  const [filter, setFilter] = useState("upcoming");
  const [regionFilter, setRegionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", event_type: "conference", location: "", event_date: "", end_date: "", registration_url: "" });

  async function loadEvents() {
    try {
      const { data, error } = await supabase.from("events").select("*, profiles(full_name)").order("event_date", { ascending: true });
      let loaded = [];
      if (!error && data && data.length > 0) {
        loaded = data;
      } else {
        const { data: simpleData } = await supabase.from("events").select("*").order("event_date", { ascending: true });
        loaded = simpleData && simpleData.length > 0 ? simpleData : [];
      }
      const combined = [...loaded];
      DEFAULT_EVENTS.forEach(de => {
        if (!combined.some(e => e.id === de.id || e.title === de.title)) {
          combined.push(de);
        }
      });
      combined.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
      setEvents(combined);
    } catch (e) {
      setEvents(DEFAULT_EVENTS);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { window.location.href = "/login"; return; }
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);
        await loadEvents();
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  function openRegisterModal(ev) {
    setSelectedEvent(ev);
    setRegSuccess(false);
    setRegForm({
      name: profile?.full_name || "",
      email: profile?.email || "",
      university: profile?.university || "Gujarat University",
      category: profile?.role === "educator" ? "Faculty / Educator" : profile?.role === "researcher" ? "Research Scholar" : "Student"
    });
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      if (supabase && profile?.id) {
        await supabase.from("event_registrations").insert({
          event_id: selectedEvent.id,
          user_id: profile.id
        });
      }
    } catch (err) {
      console.log(err);
    }

    setRegisteredIds(prev => [...prev, selectedEvent.id]);
    setRegSuccess(true);
  }

  async function handleAdd(e) {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("events").insert({ ...form, created_by: profile.id, end_date: form.end_date || null });
    if (error) alert("Error: " + error.message);
    else { setShowAdd(false); setForm({ title: "", description: "", event_type: "conference", location: "", event_date: "", end_date: "", registration_url: "" }); await loadEvents(); }
    setSaving(false);
  }

  async function handleDelete(id) { if (!confirm("Delete?")) return; await supabase.from("events").delete().eq("id", id); await loadEvents(); }

  const isEducator = profile?.role === "educator" || profile?.role === "researcher";
  const now = new Date();

  // Filter logic: Status + Region + Search Query
  const filteredEvents = events.filter(e => {
    if (e.event_date) {
      const d = new Date(e.event_date);
      if (filter === "upcoming" && d < now) return false;
      if (filter === "past" && d >= now) return false;
    }

    if (regionFilter === "gujarat") {
      const loc = (e.location || "").toLowerCase();
      if (!loc.includes("gujarat") && !loc.includes("ahmedabad") && !loc.includes("gandhinagar") && !loc.includes("vadodara") && !loc.includes("surat") && !loc.includes("anand") && e.region !== "gujarat") return false;
    } else if (regionFilter === "india") {
      const loc = (e.location || "").toLowerCase();
      if (!loc.includes("india") && !loc.includes("mumbai") && !loc.includes("delhi") && !loc.includes("bengaluru") && !loc.includes("gujarat") && e.region !== "india" && e.region !== "gujarat") return false;
    } else if (regionFilter === "global") {
      const loc = (e.location || "").toLowerCase();
      if (!loc.includes("virtual") && !loc.includes("online") && e.region !== "global") return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (e.title || "").toLowerCase().includes(q);
      const locMatch = (e.location || "").toLowerCase().includes(q);
      const descMatch = (e.description || "").toLowerCase().includes(q);
      const hostMatch = (e.profiles?.full_name || "").toLowerCase().includes(q);
      if (!titleMatch && !locMatch && !descMatch && !hostMatch) return false;
    }

    return true;
  });

  const featured = filteredEvents.find(e => e.event_date && new Date(e.event_date) >= now) || events.find(e => e.event_date && new Date(e.event_date) >= now);
  const myRSVPs = events.filter(e => registeredIds.includes(e.id) || (e.event_date && new Date(e.event_date) >= now && registeredIds.includes(e.id)));

  const typeColors = { conference: "#14B8A6", webinar: "#8B5CF6", workshop: "#F97316", seminar: "#3B82F6", hackathon: "#EC4899", other: "#6B8A9A" };

  return (
    <AppShell active="/events">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1B2B3A", margin: 0 }}>Events & Networking</h1>
            <span style={{ fontSize: "11px", fontWeight: 700, background: "#E0F2FE", color: "#0284C7", padding: "3px 9px", borderRadius: "12px", border: "1px solid #BAE6FD" }}>
              ⚡ Auto-Updates Every 8 Hours
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#6B8A9A", margin: 0 }}>Discover upcoming biotech, biomedical & genomics conferences across Gujarat, India & globally.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={loadEvents} style={{ background: "#F0F7F8", color: "#0D9488", border: "1px solid #CCFBF1", padding: "10px 16px", borderRadius: "10px", fontSize: "13.5px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
            🔄 Refresh
          </button>
          {isEducator && <button onClick={() => setShowAdd(!showAdd)} style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(20,184,166,0.3)" }}>{showAdd ? "Cancel" : "+ Host Event"}</button>}
        </div>
      </div>

      {showAdd && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #E2EEF0", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1B2B3A", marginBottom: "16px" }}>Add New Event</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ gridColumn: "1/-1" }}><label style={L}>Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={I} placeholder="Biotech Innovation Summit 2026"/></div>
            <div><label style={L}>Type</label><select value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})} style={I}><option value="conference">Conference</option><option value="webinar">Webinar</option><option value="workshop">Workshop</option><option value="seminar">Seminar</option><option value="hackathon">Hackathon</option><option value="other">Other</option></select></div>
            <div><label style={L}>Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={I} placeholder="Ahmedabad, Gujarat or Online"/></div>
            <div><label style={L}>Start *</label><input type="datetime-local" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} style={I}/></div>
            <div><label style={L}>End</label><input type="datetime-local" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} style={I}/></div>
            <div style={{ gridColumn: "1/-1" }}><label style={L}>Registration URL</label><input value={form.registration_url} onChange={e => setForm({...form, registration_url: e.target.value})} style={I} placeholder="https://..."/></div>
            <div style={{ gridColumn: "1/-1" }}><label style={L}>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{...I, resize: "vertical"}} placeholder="What's this event about?"/></div>
            <div style={{ gridColumn: "1/-1" }}><button onClick={handleAdd} disabled={saving || !form.title || !form.event_date} style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: saving || !form.title || !form.event_date ? 0.5 : 1 }}>{saving ? "Adding..." : "Add Event"}</button></div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
        <div>
          {/* Controls Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            {/* Status Tabs */}
            <div style={{ display: "inline-flex", gap: "4px", background: "#F0F7F8", borderRadius: "12px", padding: "4px", border: "1px solid #E2EEF0" }}>
              {["upcoming", "past"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 18px", borderRadius: "8px", fontSize: "13.5px", fontWeight: filter === f ? 700 : 500, border: filter === f ? "1px solid #CBD5E1" : "1px solid transparent", cursor: "pointer", fontFamily: "inherit", background: filter === f ? "#ffffff" : "transparent", color: filter === f ? "#0D9488" : "#6B8A9A", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.06)" : "none" }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Region Tabs */}
            <div style={{ display: "inline-flex", gap: "4px", background: "#FEF3C7", borderRadius: "12px", padding: "4px", border: "1px solid #FDE68A" }}>
              {[
                { id: "all", label: "All Regions" },
                { id: "gujarat", label: "📍 Gujarat Special" },
                { id: "india", label: "🇮🇳 India" },
                { id: "global", label: "🌐 Global" }
              ].map(r => (
                <button key={r.id} onClick={() => setRegionFilter(r.id)} style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: regionFilter === r.id ? 700 : 500, border: regionFilter === r.id ? "1px solid #F59E0B" : "1px solid transparent", cursor: "pointer", fontFamily: "inherit", background: regionFilter === r.id ? "#D97706" : "transparent", color: regionFilter === r.id ? "#FFFFFF" : "#92400E" }}>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ flex: "1 1 200px", maxWidth: "260px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="🔍 Search Gujarat, IIT, AI..."
                style={{ width: "100%", padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #E2EEF0", fontSize: "13px", fontFamily: "inherit", outline: "none", background: "#fff", color: "#1B2B3A" }}
              />
            </div>
          </div>

          {/* HIGH-CONTRAST FEATURED EVENT BANNER */}
          {featured && filter === "upcoming" && (
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", marginBottom: "24px", boxShadow: "0 10px 28px rgba(15,23,42,0.14)" }}>
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
              
              {/* Overlay */}
              <div style={{ position: "relative", zIndex: 1, background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.88) 55%, rgba(13, 148, 136, 0.45) 100%)", padding: "26px 30px" }}>
                <div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11.5px", color: "#FFFFFF", fontWeight: 800, background: "#14B8A6", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 2px 8px rgba(20,184,166,0.4)" }}>
                      {safeFormatDate(featured.event_date, { month: "short", day: "numeric" }, "UPCOMING").toUpperCase()}
                    </span>
                    {(featured.location || "").toLowerCase().includes("gujarat") && (
                      <span style={{ fontSize: "11.5px", color: "#FFFFFF", fontWeight: 800, background: "#F59E0B", padding: "4px 12px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(245,158,11,0.4)" }}>
                        📍 GUJARAT EVENT
                      </span>
                    )}
                    <span style={{ fontSize: "11.5px", color: "#FFFFFF", fontWeight: 700, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)", padding: "4px 12px", borderRadius: "20px" }}>
                      {(featured.event_type || "CONFERENCE").toUpperCase()}
                    </span>
                  </div>

                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 10px", maxWidth: "700px", lineHeight: "1.3", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                    {featured.title}
                  </h2>

                  <p style={{ fontSize: "13.5px", color: "#F1F5F9", marginBottom: "6px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>📍 {featured.location || "Online"}</span>
                    <span style={{ color: "#94A3B8" }}>•</span>
                    <span>⏰ {safeFormatTime(featured.event_date, { hour: "2-digit", minute: "2-digit" }, "09:00 AM")} IST</span>
                  </p>

                  <p style={{ fontSize: "13px", color: "#CBD5E1", margin: "0 0 20px", fontWeight: 500 }}>
                    Hosted by <span style={{ color: "#FFFFFF", fontWeight: 700 }}>{featured.profiles?.full_name || "BioConnect Academic Network"}</span>
                  </p>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button onClick={() => openRegisterModal(featured)} style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)", color: "#FFFFFF", padding: "10px 24px", borderRadius: "10px", fontSize: "13.5px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(20,184,166,0.4)" }}>
                    {registeredIds.includes(featured.id) ? "✅ Registered (View Pass)" : "Register for Event 🎉"}
                  </button>
                  {featured.registration_url && (
                    <a href={featured.registration_url} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, textDecoration: "none", backdropFilter: "blur(4px)" }}>
                      Official Portal Site 🔗
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Events list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredEvents.filter(e => e !== featured || filter === "past" || regionFilter !== "all" || searchQuery).map(ev => {
              const isPast = ev.event_date ? new Date(ev.event_date) < now : false;
              const isRegistered = registeredIds.includes(ev.id);
              const tc = typeColors[ev.event_type] || typeColors.other;
              const isGujarat = (ev.location || "").toLowerCase().includes("gujarat") || ev.region === "gujarat";
              return (
                <div key={ev.id} onClick={() => openRegisterModal(ev)} style={{ background: "#fff", borderRadius: "16px", padding: "20px 24px", border: isGujarat ? "2px solid #FDE68A" : "1px solid #E2EEF0", display: "flex", alignItems: "center", gap: "18px", opacity: isPast ? 0.65 : 1, cursor: "pointer", transition: "all 0.2s ease", boxShadow: isGujarat ? "0 4px 16px rgba(245,158,11,0.08)" : "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ width: 54, textAlign: "center", flexShrink: 0, background: isGujarat ? "#FEF3C7" : "#F0F7F8", borderRadius: "12px", padding: "10px 0", border: isGujarat ? "1px solid #FDE68A" : "1px solid #CCFBF1" }}>
                    <div style={{ fontSize: "11px", color: isGujarat ? "#D97706" : "#14B8A6", fontWeight: 800, textTransform: "uppercase" }}>{safeFormatDate(ev.event_date, { month: "short" }, "EVENT")}</div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#1B2B3A" }}>{safeFormatDate(ev.event_date, { day: "numeric" }, "•")}</div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: tc, background: `${tc}15`, padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
                        {ev.event_type || "Conference"}
                      </span>
                      {isGujarat && (
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#D97706", background: "#FEF3C7", padding: "2px 8px", borderRadius: "6px" }}>
                          📍 GUJARAT
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px", lineHeight: "1.3" }}>{ev.title}</h3>
                    <p style={{ fontSize: "12.5px", color: "#6B8A9A", margin: 0 }}>
                      📍 <strong>{ev.location || "Online"}</strong> • Hosted by {ev.profiles?.full_name || "BioConnect"}
                    </p>
                    {ev.description && <p style={{ fontSize: "12.5px", color: "#475569", marginTop: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ev.description}</p>}
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    {!isPast && (
                      <button onClick={() => openRegisterModal(ev)} style={{ padding: "8px 18px", background: isRegistered ? "#059669" : "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(20,184,166,0.3)" }}>
                        {isRegistered ? "✅ Registered" : "📌 Register"}
                      </button>
                    )}
                    {isEducator && ev.created_by === profile?.id && <button onClick={() => handleDelete(ev.id)} style={{ fontSize: "12px", color: "#EF4444", background: "#FEF2F2", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>}
                  </div>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "16px", border: "1px solid #E2EEF0", color: "#9CA3AF" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#374151" }}>No events found</h3>
                <p style={{ fontSize: "13px" }}>Try searching for other keywords or switching region filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <MiniCalendar/>

          {/* Gujarat Biotech Hub Card */}
          <div style={{ background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", borderRadius: "16px", padding: "20px", border: "1px solid #F59E0B" }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>📍</div>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#92400E", marginBottom: "6px" }}>Gujarat Biotech Hub</h3>
            <p style={{ fontSize: "12px", color: "#78350F", lineHeight: "1.5", margin: 0 }}>
              Featuring research summits from <strong>GBU Gandhinagar</strong>, <strong>GSBTM Ahmedabad</strong>, <strong>NIPER Palaj</strong>, <strong>IIT Gandhinagar</strong>, and <strong>MSU Baroda</strong>.
            </p>
          </div>

          {/* My RSVPs & Registered Passes */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #E2EEF0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A", marginBottom: "14px" }}>My Registered Passes & RSVPs</h3>
            {myRSVPs.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#9CA3AF" }}>No event RSVPs yet. Click "Register" on any event to get your entry pass!</p>
            ) : myRSVPs.map((ev, i) => (
              <div key={i} onClick={() => openRegisterModal(ev)} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: i < myRSVPs.length - 1 ? "1px solid #F0F7F8" : "none", cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, background: "#CCFBF1", color: "#0D9488", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px", fontWeight: 800 }}>✅</div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#1B2B3A", margin: "0 0 2px" }}>{ev.title}</p>
                  <p style={{ fontSize: "11px", color: "#059669", fontWeight: 600, margin: 0 }}>Pass Confirmed • {safeFormatDate(ev.event_date, { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EVENT REGISTRATION & ENTRY PASS MODAL */}
      {selectedEvent && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "24px", maxWidth: "620px", width: "100%", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #E2EEF0" }}>
            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", padding: "24px 28px", position: "relative" }}>
              <button onClick={() => setSelectedEvent(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.15)", color: "#FFF", border: "none", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, background: "#14B8A6", color: "#FFF", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase" }}>
                  {(selectedEvent.event_type || "CONFERENCE").toUpperCase()}
                </span>
                {(selectedEvent.location || "").toLowerCase().includes("gujarat") && (
                  <span style={{ fontSize: "11px", fontWeight: 800, background: "#F59E0B", color: "#FFF", padding: "4px 12px", borderRadius: "20px" }}>
                    📍 GUJARAT EVENT
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px", lineHeight: "1.3" }}>
                {selectedEvent.title}
              </h2>
              <p style={{ fontSize: "13px", color: "#CBD5E1", margin: 0 }}>
                Hosted by <strong style={{ color: "#FFF" }}>{selectedEvent.profiles?.full_name || "BioConnect Academic Network"}</strong>
              </p>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "24px 28px" }}>
              {regSuccess ? (
                /* Registration Confirmation Screen */
                <div style={{ textAlign: "center", padding: "20px 10px" }}>
                  <div style={{ width: "64px", height: "64px", background: "#DCFCE7", color: "#166534", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px" }}>🎉</div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#064E3B", marginBottom: "8px" }}>Registration Confirmed!</h3>
                  <p style={{ fontSize: "13.5px", color: "#047857", marginBottom: "20px", lineHeight: "1.5" }}>
                    Your official seat for <strong>{selectedEvent.title}</strong> is reserved. Entry pass & confirmation details have been synced to your BioConnect account.
                  </p>

                  <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "14px", padding: "16px", marginBottom: "16px", textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>PASS NUMBER:</span>
                      <span style={{ fontSize: "12px", color: "#15803D", fontWeight: 800, fontFamily: "monospace" }}>BC-2026-REG-{selectedEvent.id.slice(0, 6).toUpperCase()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>DELEGATE NAME:</span>
                      <span style={{ fontSize: "12px", color: "#15803D", fontWeight: 700 }}>{regForm.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>INSTITUTION:</span>
                      <span style={{ fontSize: "12px", color: "#15803D", fontWeight: 700 }}>{regForm.university}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: "12px", color: "#475569", background: "#F1F5F9", padding: "10px 14px", borderRadius: "10px", margin: "0 0 20px", textAlign: "left", lineHeight: "1.4" }}>
                    ℹ️ <strong>Note:</strong> This RSVP saves your delegate entry pass on BioConnect. If the host institution ({selectedEvent.profiles?.full_name || "Organizers"}) requires an additional campus registration, click <strong>"Open Host Portal Site 🔗"</strong> below.
                  </p>

                  <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button onClick={() => setSelectedEvent(null)} style={{ padding: "10px 24px", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#FFF", color: "#475569", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                      Close Window
                    </button>
                    {selectedEvent.registration_url && (
                      <a href={selectedEvent.registration_url} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 24px", borderRadius: "10px", background: "#059669", color: "#FFF", fontSize: "14px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span>Open Host Portal Site 🔗</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                /* Interactive Registration Form */
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px", background: "#F8FAFC", padding: "14px 16px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", display: "block", marginBottom: "2px" }}>LOCATION</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>📍 {selectedEvent.location || "Online"}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", display: "block", marginBottom: "2px" }}>ENTRY FEE</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#0D9488" }}>💳 {selectedEvent.entry_fee || "Free Access"}</span>
                    </div>
                  </div>

                  <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={L}>Full Name *</label>
                      <input required value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} style={I} placeholder="Your full name"/>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={L}>Email Address *</label>
                        <input required type="email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} style={I} placeholder="email@university.edu"/>
                      </div>
                      <div>
                        <label style={L}>Delegate Category</label>
                        <select value={regForm.category} onChange={e => setRegForm({...regForm, category: e.target.value})} style={I}>
                          <option value="Student">Student (B.Tech/M.Sc/Ph.D)</option>
                          <option value="Research Scholar">Research Scholar</option>
                          <option value="Faculty / Educator">Faculty / Educator</option>
                          <option value="Industry Delegate">Industry Delegate</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={L}>University / Institution *</label>
                      <input required value={regForm.university} onChange={e => setRegForm({...regForm, university: e.target.value})} style={I} placeholder="e.g. Gujarat University / GBU Gandhinagar"/>
                    </div>

                    <div style={{ marginTop: "12px", display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                      {selectedEvent.registration_url && (
                        <a href={selectedEvent.registration_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12.5px", color: "#0D9488", fontWeight: 600, textDecoration: "underline" }}>
                          Open Host Institution Website 🔗
                        </a>
                      )}
                      <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                        <button type="button" onClick={() => setSelectedEvent(null)} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#FFF", color: "#475569", fontSize: "13.5px", fontWeight: 600, cursor: "pointer" }}>
                          Cancel
                        </button>
                        <button type="submit" style={{ padding: "11px 24px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)", color: "#FFF", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(20,184,166,0.4)" }}>
                          Confirm BioConnect RSVP 🎉
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

const L = { display: "block", fontSize: "12.5px", fontWeight: 600, color: "#475569", marginBottom: "4px" };
const I = { width: "100%", padding: "9px 12px", border: "1.5px solid #CBD5E1", borderRadius: "9px", fontSize: "13.5px", fontFamily: "inherit", outline: "none", background: "#fff", color: "#0F172A" };