"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ full_name: "", phone: "", university: "", bio: "" });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setForm({ full_name: data?.full_name || "", phone: data?.phone || "", university: data?.university || "", bio: data?.bio || "" });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true); setMessage("");
    const { error } = await supabase.from("profiles").update({ full_name: form.full_name, phone: form.phone, university: form.university, bio: form.bio }).eq("id", profile.id);
    if (error) setMessage("Failed: " + error.message);
    else { setProfile({ ...profile, ...form }); setMessage("Profile updated!"); setEditing(false); }
    setSaving(false);
  }

  if (loading) return <AppShell active="/profile"><div style={{ textAlign: "center", padding: "100px", color: "#9CA3AF" }}>Loading...</div></AppShell>;

  const role = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Student";
  const roleColors = { Student: "#14B8A6", Educator: "#8B5CF6", Researcher: "#F97316", Industry: "#3B82F6" };
  const rc = roleColors[role] || "#14B8A6";

  const stats = role === "Educator" ? [
    { label: "Students", value: "—" }, { label: "Courses", value: "—" }, { label: "Events", value: "—" },
  ] : role === "Researcher" ? [
    { label: "Papers", value: "—" }, { label: "Citations", value: "—" }, { label: "Collaborators", value: "—" },
  ] : [
    { label: "Courses", value: "—" }, { label: "Streak", value: "0 days" }, { label: "Badges", value: "0" },
  ];

  return (
    <AppShell active="/profile">
      {message && <div style={{ padding: "10px 16px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px", background: message.includes("Failed") ? "#FEF2F2" : "#F0FCFB", color: message.includes("Failed") ? "#DC2626" : "#14B8A6", border: `1px solid ${message.includes("Failed") ? "#FECACA" : "#A7F3D0"}` }}>{message}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "24px" }}>
        {/* Left - profile card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2EEF0", overflow: "hidden" }}>
            {/* Header banner */}
            <div style={{ height: "80px", background: `linear-gradient(135deg, ${rc}22 0%, ${rc}11 100%)` }}></div>
            {/* Avatar */}
            <div style={{ padding: "0 24px 24px", marginTop: "-32px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${rc}20`, border: `3px solid #fff`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 700, color: rc, marginBottom: "12px" }}>
                {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>{profile?.full_name || "User"}</h2>
              <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: rc, background: rc + "15", padding: "4px 12px", borderRadius: "100px", marginBottom: "12px" }}>{role}</span>
              {profile?.university && <p style={{ fontSize: "13px", color: "#6B8A9A" }}>🏛️ {profile.university}</p>}
              {profile?.email && <p style={{ fontSize: "13px", color: "#6B8A9A", marginTop: "4px" }}>✉️ {profile.email}</p>}
              {profile?.phone && <p style={{ fontSize: "13px", color: "#6B8A9A", marginTop: "4px" }}>📱 {profile.phone}</p>}
              {profile?.bio && <p style={{ fontSize: "13px", color: "#6B8A9A", marginTop: "12px", lineHeight: "1.6", fontStyle: "italic" }}>"{profile.bio}"</p>}

              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                {!editing ? (
                  <button onClick={() => setEditing(true)} style={{ flex: 1, background: "#14B8A6", color: "#fff", border: "none", padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Edit Profile</button>
                ) : (
                  <>
                    <button onClick={() => { setEditing(false); setForm({ full_name: profile.full_name||"", phone: profile.phone||"", university: profile.university||"", bio: profile.bio||"" }); }} style={{ flex: 1, background: "#F0F7F8", color: "#6B8A9A", border: "1px solid #E2EEF0", padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: "#14B8A6", color: "#fff", border: "none", padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save"}</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #E2EEF0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", textAlign: "center" }}>
              {stats.map(s => (
                <div key={s.label}>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "#1B2B3A", marginBottom: "2px" }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - edit form / details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", border: "1px solid #E2EEF0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", marginBottom: "24px" }}>Profile Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { l: "Full Name", v: profile?.full_name, k: "full_name", editable: true, ph: "Your full name" },
                { l: "Email", v: profile?.email, note: "Email cannot be changed" },
                { l: "Phone", v: profile?.phone || "Not set", k: "phone", editable: true, ph: "+91 9876543210" },
                { l: "Role", v: role, note: "Role cannot be changed" },
                { l: "University / Organization", v: profile?.university || "Not set", k: "university", editable: true, ph: "e.g. IIT Bombay" },
                { l: "Bio", v: profile?.bio || "No bio added yet", k: "bio", editable: true, ph: "Tell us about yourself...", ta: true },
              ].map(f => (
                <div key={f.l}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#9CA3AF", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.l}</label>
                  {editing && f.editable ? (
                    f.ta ? <textarea value={form[f.k]} onChange={e => setForm({...form, [f.k]: e.target.value})} placeholder={f.ph} rows={3} style={{...I, resize: "vertical"}}/> :
                    <input value={form[f.k]} onChange={e => setForm({...form, [f.k]: e.target.value})} placeholder={f.ph} style={I}/>
                  ) : <p style={{ fontSize: "15px", color: "#374151" }}>{f.v || "—"}</p>}
                  {editing && f.note && <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>{f.note}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Role-specific sections */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", border: "1px solid #E2EEF0" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A", marginBottom: "16px" }}>
              {role === "Student" ? "📚 Recent Learning" : role === "Educator" ? "🎓 Active Courses" : "🔬 Recent Research"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ display: "flex", gap: "12px", padding: "12px", background: "#F8FCFC", borderRadius: "10px" }}>
                  <div style={{ width: 36, height: 36, background: "#E2EEF0", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                    {role === "Student" ? "📖" : role === "Educator" ? "📋" : "📄"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#1B2B3A" }}>
                      {role === "Student" ? `Chapter ${i}: Biotech Fundamentals` : role === "Educator" ? `Course ${i} — Active` : `Research Paper ${i}`}
                    </p>
                    <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                      {role === "Student" ? "Continue learning →" : role === "Educator" ? "View submissions →" : "View paper →"}
                    </p>
                  </div>
                  <a href={role === "Student" ? "/learning" : role === "Educator" ? "/learning" : "/research"} style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 600, display: "flex", alignItems: "center" }}>→</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
const I = { width: "100%", padding: "11px 14px", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "#1B2B3A" };