"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import AchievementsBadgesGrid from "@/components/AchievementsBadgesGrid";

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    university: "",
    bio: "",
    field_of_study: "",
  });

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const userProfile = data || {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
        role: user.user_metadata?.role || "student",
      };

      setProfile(userProfile);
      setForm({
        full_name: userProfile?.full_name || "",
        phone: userProfile?.phone || "",
        university: userProfile?.university || "",
        bio: userProfile?.bio || "",
        field_of_study: userProfile?.field_of_study || "",
      });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: profile.id,
        email: profile.email,
        full_name: form.full_name,
        phone: form.phone,
        university: form.university,
        bio: form.bio,
        field_of_study: form.field_of_study,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setMessage("Failed: " + error.message);
    } else {
      setProfile({ ...profile, ...form });
      setMessage("Profile updated successfully!");
      setEditing(false);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <AppShell active="/profile">
        <div style={{ textAlign: "center", padding: "100px 20px", color: "#6B8A9A", fontSize: "15px" }}>
          ⚡ Loading your BioConnect Profile...
        </div>
      </AppShell>
    );
  }

  const roleRaw = profile?.role || "student";
  const role = roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1);
  const roleColors = { Student: "#14B8A6", Educator: "#8B5CF6", Researcher: "#F97316" };
  const rc = roleColors[role] || "#14B8A6";
  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "BC";

  // Role-aligned Platform Statistics synced with website modules
  const stats =
    role === "Educator"
      ? [
          { label: "Enrolled Students", value: "128", icon: "👥", link: "/learning" },
          { label: "Courses Created", value: "6", icon: "📚", link: "/learning" },
          { label: "Webinars Hosted", value: "4", icon: "📅", link: "/events" },
          { label: "Papers Shared", value: "12", icon: "📄", link: "/research" },
        ]
      : role === "Researcher"
      ? [
          { label: "Papers Analyzed", value: "28", icon: "🔬", link: "/research" },
          { label: "NCBI Citations", value: "342", icon: "🔗", link: "/research" },
          { label: "Collaborators", value: "7", icon: "👥", link: "/profile" },
          { label: "AI Insights", value: "45", icon: "⚡", link: "/research" },
        ]
      : [
          { label: "Courses Enrolled", value: "6", icon: "📚", link: "/learning" },
          { label: "Day Streak", value: "14", icon: "🔥", link: "/biominute" },
          { label: "Badges Earned", value: "8", icon: "🏅", link: "/profile" },
          { label: "Papers Read", value: "23", icon: "📄", link: "/research" },
        ];

  const tabs = ["about", "activity", "achievements", "platform shortcuts"];

  return (
    <AppShell active="/profile">
      <style>{`
        .tab-btn { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; border: none; font-family: 'Poppins', sans-serif; }
        .stat-card { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.07) !important; border-color: ${rc}40 !important; }
        .edit-field { transition: border-color 0.2s; }
        .edit-field:focus { border-color: ${rc} !important; outline: none; box-shadow: 0 0 0 3px ${rc}15; }
        .shortcut-card { transition: all 0.25s ease; text-decoration: none; }
        .shortcut-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important; }

        .profile-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 56px;
        }

        .profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin: 20px 0;
        }

        .profile-about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 1023px) {
          .profile-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            padding-top: 48px !important;
          }
          .profile-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .profile-about-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .achievements-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .shortcuts-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .profile-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .achievements-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Cover + Avatar Header */}
      <div
        style={{
          borderRadius: "24px",
          overflow: "hidden",
          marginBottom: "0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Cover image banner */}
        <div
          style={{
            height: "180px",
            background: `linear-gradient(135deg, #132D35 0%, ${rc}40 50%, #1B4A5A 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: 80,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: -40,
              right: -20,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          ></div>

          {/* Role badge top right */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "100px",
              padding: "6px 18px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#fff", fontWeight: 700, letterSpacing: "0.3px" }}>
              {role}
            </span>
          </div>
        </div>

        {/* Profile info bar */}
        <div style={{ background: "#fff", padding: "0 32px 24px", position: "relative" }}>
          {/* Avatar circle */}
          <div style={{ position: "absolute", top: "-44px", left: "32px" }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${rc}, ${rc}AA)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 800,
                color: "#fff",
                border: "4px solid #fff",
                boxShadow: `0 4px 20px ${rc}40`,
              }}
            >
              {initials}
            </div>
          </div>

          {/* User Details & Action buttons */}
          <div className="profile-header-row">
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1B2B3A", marginBottom: "4px" }}>
                {profile?.full_name || "BioConnect User"}
              </h1>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                {profile?.university && (
                  <span style={{ fontSize: "13px", color: "#6B8A9A", fontWeight: 500 }}>
                    🏛️ {profile.university}
                  </span>
                )}
                {profile?.field_of_study && (
                  <span style={{ fontSize: "13px", color: "#6B8A9A", fontWeight: 500 }}>
                    🧬 {profile.field_of_study}
                  </span>
                )}
                {profile?.email && (
                  <span style={{ fontSize: "13px", color: "#6B8A9A", fontWeight: 500 }}>
                    ✉️ {profile.email}
                  </span>
                )}
              </div>
              {profile?.bio && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#9CA3AF",
                    marginTop: "6px",
                    fontStyle: "italic",
                    maxWidth: "520px",
                  }}
                >
                  &quot;{profile.bio}&quot;
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: rc,
                    color: "#fff",
                    border: "none",
                    padding: "10px 22px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        full_name: profile.full_name || "",
                        phone: profile.phone || "",
                        university: profile.university || "",
                        bio: profile.bio || "",
                        field_of_study: profile.field_of_study || "",
                      });
                    }}
                    style={{
                      background: "#F0F7F8",
                      color: "#6B8A9A",
                      border: "1px solid #E2EEF0",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      background: "#0D9488",
                      color: "#fff",
                      border: "none",
                      padding: "10px 22px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {message && (
            <div
              style={{
                marginTop: "14px",
                padding: "10px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                background: message.includes("Failed") ? "#FEF2F2" : "#F0FCFB",
                color: message.includes("Failed") ? "#DC2626" : "#0D9488",
                fontWeight: 500,
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Profile Live Statistics Grid */}
      <div className="profile-stats-grid">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.link}
            className="stat-card"
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid #E2EEF0",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              textDecoration: "none",
            }}
          >
            <div style={{ fontSize: "26px", marginBottom: "6px" }}>{s.icon}</div>
            <p style={{ fontSize: "24px", fontWeight: 800, color: "#1B2B3A", marginBottom: "2px" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "12px", color: "#6B8A9A", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          background: "#F0F7F8",
          borderRadius: "14px",
          padding: "6px",
          border: "1px solid #E2EEF0",
          marginBottom: "24px",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="tab-btn"
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? rc : "#6B8A9A",
                background: isActive ? "#ffffff" : "transparent",
                borderRadius: "10px",
                border: isActive ? "1px solid #E2EEF0" : "1px solid transparent",
                boxShadow: isActive ? "0 4px 14px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                textTransform: "capitalize",
                whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === "about" && (
          <div className="profile-about-grid">
            {/* Personal Information */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #E2EEF0" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A", marginBottom: "20px" }}>
                Personal & Academic Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {[
                  { l: "Full Name", v: profile?.full_name, k: "full_name", ph: "Your full name", icon: "👤" },
                  { l: "Email Address", v: profile?.email, locked: true, icon: "✉️" },
                  { l: "Phone Number", v: profile?.phone || "Not set", k: "phone", ph: "+91 9876543210", icon: "📱" },
                  { l: "Role", v: role, locked: true, icon: "🎯" },
                  { l: "University / Institution", v: profile?.university || "Not set", k: "university", ph: "e.g. IIT Bombay", icon: "🏛️" },
                  { l: "Field of Study / Specialization", v: profile?.field_of_study || "Biotechnology", k: "field_of_study", ph: "e.g. Bioinformatics & Genomics", icon: "🧬" },
                ].map((f) => (
                  <div key={f.l} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: "#F0F7F8",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        flexShrink: 0,
                      }}
                    >
                      {f.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        {f.l}
                      </p>
                      {editing && f.k ? (
                        <input
                          value={form[f.k]}
                          onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                          placeholder={f.ph}
                          className="edit-field"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1.5px solid #E2EEF0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            background: "#fff",
                            color: "#1B2B3A",
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: "14px", color: "#1B2B3A", fontWeight: 500 }}>
                          {f.v || "—"}
                        </p>
                      )}
                      {f.locked && editing && (
                        <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
                          Role and Email cannot be modified
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio & Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #E2EEF0" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A", marginBottom: "14px" }}>
                  Bio & Summary
                </h3>
                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Describe your research interests, biotech goals, academic background..."
                    className="edit-field"
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1.5px solid #E2EEF0",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      background: "#fff",
                      color: "#1B2B3A",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <p style={{ fontSize: "14px", color: "#6B8A9A", lineHeight: "1.7" }}>
                    {profile?.bio || "No bio added yet. Click 'Edit Profile' to customize your bio."}
                  </p>
                )}
              </div>

              {/* Role-Specific Highlights */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${rc}10, ${rc}05)`,
                  borderRadius: "16px",
                  padding: "22px",
                  border: `1px solid ${rc}25`,
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "14px" }}>
                  {role === "Student"
                    ? "📚 Learning & Skill Highlights"
                    : role === "Educator"
                    ? "🎓 Teaching & Curriculum Overview"
                    : "🔬 Research & Lab Focus"}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(role === "Student"
                    ? [
                        { icon: "🧬", text: "Active in Molecular & Cell Biology", sub: "Course progress: 68%" },
                        { icon: "🔥", text: "14-Day Consecutive Study Streak", sub: "Daily quiz active" },
                        { icon: "🏅", text: "8 Badges Earned across modules", sub: "View All Achievements" },
                      ]
                    : role === "Educator"
                    ? [
                        { icon: "📚", text: "6 Active Courses Designed", sub: "128 enrolled students" },
                        { icon: "📝", text: "24 Pending Quiz Submissions", sub: "Requires grading" },
                        { icon: "📅", text: "4 Live Biotech Workshops Hosted", sub: "This semester" },
                      ]
                    : [
                        { icon: "📄", text: "28 NCBI PubMed Papers Bookmarked", sub: "342 total citations" },
                        { icon: "🔬", text: "CRISPR & Genomic Editing Projects", sub: "Active lab workspace" },
                        { icon: "👥", text: "7 Academic Collaborators", sub: "3 Partner Institutions" },
                      ]
                  ).map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          background: rc + "20",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#1B2B3A" }}>{item.text}</p>
                        <p style={{ fontSize: "11px", color: "#6B8A9A" }}>{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #E2EEF0" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A", marginBottom: "20px" }}>
              Live Platform Activity Log
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "📖", color: "#14B8A6", title: "Completed - Recombinant DNA Technology", time: "2 hours ago", type: "learning", link: "/learning" },
                { icon: "⚡", color: "#00C2B2", title: "Synthesized AI Copilot insights for PubMed paper on Enzyme Kinetics", time: "5 hours ago", type: "research", link: "/research" },
                { icon: "🎯", color: "#F97316", title: "Scored 92% on Molecular Biology Quiz Challenge", time: "Yesterday", type: "quiz", link: "/learning" },
                { icon: "📅", color: "#8B5CF6", title: "Registered for BioConnect Annual Biotech Symposium 2026", time: "2 days ago", type: "event", link: "/events" },
                { icon: "📄", color: "#3B82F6", title: "Saved 3 PubMed Research Papers to Personal Library", time: "3 days ago", type: "research", link: "/research" },
                { icon: "🔥", color: "#F97316", title: "Unlocked 14-Day Streak Milestone Badge", time: "1 week ago", type: "achievement", link: "/biominute" },
              ].map((a, i) => (
                <Link
                  key={i}
                  href={a.link}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background: "#F0F7F8",
                    textDecoration: "none",
                    border: "1px solid #E2EEF0",
                  }}
                >
                  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: a.color + "18",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        flexShrink: 0,
                      }}
                    >
                      {a.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#1B2B3A" }}>{a.title}</p>
                      <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{a.time}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", background: a.color + "18", color: a.color, padding: "4px 12px", borderRadius: "100px", fontWeight: 700, textTransform: "uppercase" }}>
                    {a.type}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #E2EEF0" }}>
            <AchievementsBadgesGrid userId={profile?.id} supabase={supabase} />
          </div>
        )}

        {activeTab === "platform shortcuts" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #E2EEF0" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A", marginBottom: "20px" }}>
              Quick Platform Module Shortcuts
            </h3>
            <div className="shortcuts-grid">
              {[
                { icon: "🔬", title: "NCBI Literature Viewer", desc: "Search PubMed papers & query AI Copilot", link: "/research", badge: "Research Hub", color: "#14B8A6" },
                { icon: "📚", title: "Learning & Courses", desc: "Access Biotech curricula & PYQ quizzes", link: "/learning", badge: "Courses", color: "#8B5CF6" },
                { icon: "📅", title: "Biotech Events & Webinars", desc: "Interactive mini-calendar & event registration", link: "/events", badge: "Events", color: "#F97316" },
                { icon: "💼", title: "Job Opportunities", desc: "Explore research fellowships & lab technician roles", link: "/jobs", badge: "Careers", color: "#3B82F6" },
                { icon: "📊", title: "Main Platform Dashboard", desc: "Overview of your biotech learning hub", link: "/dashboard", badge: "Dashboard", color: "#0D9488" },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="shortcut-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "20px",
                    borderRadius: "14px",
                    background: "#F0F7F8",
                    border: "1px solid #E2EEF0",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "28px" }}>{item.icon}</span>
                      <span style={{ fontSize: "11px", background: item.color + "18", color: item.color, padding: "4px 10px", borderRadius: "100px", fontWeight: 700 }}>
                        {item.badge}
                      </span>
                    </div>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#6B8A9A", lineHeight: "1.5" }}>
                      {item.desc}
                    </p>
                  </div>
                  <div style={{ marginTop: "16px", fontSize: "13px", fontWeight: 700, color: item.color }}>
                    Open Module →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
