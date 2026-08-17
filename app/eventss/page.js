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

export default function EventsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", event_type: "conference", location: "", event_date: "", end_date: "", registration_url: "" });

  async function loadEvents() {
    try {
      const { data, error } = await supabase.from("events").select("*, profiles(full_name)").order("event_date", { ascending: true });
      if (error) {
        const { data: simpleData } = await supabase.from("events").select("*").order("event_date", { ascending: true });
        setEvents(simpleData || []);
      } else {
        setEvents(data || []);
      }
    } catch (e) {
      setEvents([]);
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

  const featured = events.find(e => e.event_date && new Date(e.event_date) >= now);
  const filtered = events.filter(e => {
    if (!e.event_date) return filter === "past";
    const d = new Date(e.event_date);
    return filter === "upcoming" ? d >= now : d < now;
  });
  const myRSVPs = events.filter(e => e.event_date && new Date(e.event_date) >= now).slice(0, 3);

  const typeColors = { conference: "#14B8A6", webinar: "#8B5CF6", workshop: "#F97316", seminar: "#3B82F6", hackathon: "#EC4899", other: "#6B8A9A" };

  return (
    <AppShell active="/events">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Events & Networking</h1>
          <p style={{ fontSize: "14px", color: "#6B8A9A" }}>Webinars, workshops, and meetups</p>
        </div>
        {isEducator && <button onClick={() => setShowAdd(!showAdd)} style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{showAdd ? "Cancel" : "+ Host Event"}</button>}
      </div>

      {showAdd && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #E2EEF0", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1B2B3A", marginBottom: "16px" }}>Add New Event</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ gridColumn: "1/-1" }}><label style={L}>Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={I} placeholder="Biotech Innovation Summit 2026"/></div>
            <div><label style={L}>Type</label><select value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})} style={I}><option value="conference">Conference</option><option value="webinar">Webinar</option><option value="workshop">Workshop</option><option value="seminar">Seminar</option><option value="hackathon">Hackathon</option><option value="other">Other</option></select></div>
            <div><label style={L}>Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={I} placeholder="Mumbai or Online"/></div>
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
          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#fff", borderRadius: "12px", padding: "4px", border: "1px solid #E2EEF0", width: "fit-content" }}>
            {["upcoming", "past"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit", background: filter === f ? "#1B2B3A" : "transparent", color: filter === f ? "#fff" : "#6B8A9A" }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>

          {/* Featured event */}
          {featured && filter === "upcoming" && (
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=60" alt="" style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}/>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)", display: "flex", alignItems: "center", padding: "28px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 700, background: "rgba(20,184,166,0.2)", padding: "4px 10px", borderRadius: "6px" }}>{safeFormatDate(featured.event_date, { month: "short", day: "numeric" }, "UPCOMING").toUpperCase()}</span>
                  <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "10px 0 6px", maxWidth: "400px" }}>{featured.title}</h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", marginBottom: "8px" }}>📍 {featured.location || "Online"} • {safeFormatTime(featured.event_date, { hour: "2-digit", minute: "2-digit" }, "")} IST</p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "16px" }}>Hosted by {featured.profiles?.full_name || "BioConnect"}</p>
                  {featured.registration_url && <a href={featured.registration_url} target="_blank" rel="noopener noreferrer" style={{ background: "#14B8A6", color: "#fff", padding: "10px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>Register Now</a>}
                </div>
              </div>
            </div>
          )}

          {/* Events list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.filter(e => e !== featured || filter === "past").map(ev => {
              const isPast = ev.event_date ? new Date(ev.event_date) < now : false;
              const tc = typeColors[ev.event_type] || typeColors.other;
              return (
                <div key={ev.id} style={{ background: "#fff", borderRadius: "14px", padding: "18px 22px", border: "1px solid #E2EEF0", display: "flex", alignItems: "center", gap: "16px", opacity: isPast ? 0.65 : 1 }}>
                  <div style={{ width: 48, textAlign: "center", flexShrink: 0, background: "#F0F7F8", borderRadius: "10px", padding: "8px 0" }}>
                    <div style={{ fontSize: "10px", color: "#14B8A6", fontWeight: 700, textTransform: "uppercase" }}>{safeFormatDate(ev.event_date, { month: "short" }, "EVENT")}</div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#1B2B3A" }}>{safeFormatDate(ev.event_date, { day: "numeric" }, "•")}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A", marginBottom: "3px" }}>{ev.title}</h3>
                    <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{ev.location || "Online"} • Hosted by {ev.profiles?.full_name || "BioConnect"}</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {!isPast && ev.registration_url && <a href={ev.registration_url} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 16px", border: `1.5px solid ${tc}`, borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: tc, textDecoration: "none" }}>📌 RSVP</a>}
                    {isEducator && ev.created_by === profile?.id && <button onClick={() => handleDelete(ev.id)} style={{ fontSize: "12px", color: "#EF4444", background: "#FEF2F2", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>}
                  </div>
                </div>
              );
            })}
            {filtered.filter(e => e !== featured || filter === "past").length === 0 && <div style={{ textAlign: "center", padding: "60px", color: "#9CA3AF" }}><p>No {filter} events</p></div>}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <MiniCalendar/>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #E2EEF0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A", marginBottom: "14px" }}>{isEducator ? "My Events" : "My Upcoming RSVPs"}</h3>
            {isEducator && (
              <div style={{ marginBottom: "14px" }}>
                {events.filter(e => e.created_by === profile?.id).length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "10px" }}>No events hosted yet</p>
                ) : events.filter(e => e.created_by === profile?.id).slice(0, 3).map((ev, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px solid #F0F7F8" }}>
                    <div style={{ width: 32, height: 32, background: "#EEF7F7", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "16px" }}>📅</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{ev.title}</p>
                      <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{safeFormatDate(ev.event_date, { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <button onClick={() => handleDelete(ev.id)} style={{ fontSize: "11px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {myRSVPs.length === 0 ? <p style={{ fontSize: "13px", color: "#9CA3AF" }}>No RSVPs yet</p> : myRSVPs.map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: i < myRSVPs.length - 1 ? "1px solid #F0F7F8" : "none" }}>
                <div style={{ width: 32, height: 32, background: "#EEF7F7", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "16px" }}>📅</div>
                <div><p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>{ev.title}</p><p style={{ fontSize: "11px", color: "#9CA3AF" }}>{safeFormatDate(ev.event_date, { day: "numeric", month: "short", year: "numeric" })}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
const L = { display: "block", fontSize: "13px", fontWeight: 500, color: "#6B8A9A", marginBottom: "6px" };
const I = { width: "100%", padding: "10px 14px", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "#1B2B3A" };