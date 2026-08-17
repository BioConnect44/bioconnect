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
  const [activeTab, setActiveTab] = useState("about");
  const [form, setForm] = useState({ full_name: "", phone: "", university: "", bio: "" });

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
      setProfile(data);
      setForm({
        full_name: data?.full_name || "",
        phone: data?.phone || "",
        university: data?.university || "",
        bio: data?.bio || "",
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
      .update({
        full_name: form.full_name,
        phone: form.phone,
        university: form.university,
        bio: form.bio,
      })
      .eq("id", profile.id);
    if (error) setMessage("Failed: " + error.message);
    else {
      setProfile({ ...profile, ...form });
      setMessage("Profile updated!");
      setEditing(false);
    }
    setSaving(false);
  }

  if (loading) return <AppShell active="/profile"><div style={{ textAlign: "center", padding: "100px", color: "#9CA3AF" }}>Loading...</div></AppShell>;

  const role = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Student";
  const roleColors = { Student: "#14B8A6", Educator: "#8B5CF6", Researcher: "#F97316", Industry: "#3B82F6" };
  const rc = roleColors[role] || "#14B8A6";
  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const stats = role === "Educator" ? [
    { label: "Students", value: "128", icon: "👥" },
    { label: "Courses", value: "6", icon: "📚" },
    { label: "Events Hosted", value: "4", icon: "📅" },
    { label: "Papers Shared", value: "12", icon: "📄" },
  ] : role === "Researcher" ? [
    { label: "Papers", value: "18", icon: "📄" },
    { label: "Citations", value: "342", icon: "🔗" },
    { label: "Collaborators", value: "7", icon: "👥" },
    { label: "Projects", value: "5", icon: "🔬" },
  ] : [
    { label: "Courses", value: "6", icon: "📚" },
    { label: "Day Streak", value: "14", icon: "🔥" },
    { label: "Badges", value: "8", icon: "🏅" },
    { label: "Papers Read", value: "23", icon: "📄" },
  ];

  const tabs = ["about", "activity", "achievements"];

  return (
    <AppShell active="/profile">
      <style>{`
        .tab-btn { transition: all 0.2s; cursor: pointer; border: none; font-family: 'Poppins', sans-serif; }
        .tab-btn.active { color: ${rc} !important; border-bottom: 2px solid ${rc} !important; }
        .tab-btn:not(.active):hover { color: #1B2B3A !important; }
        .stat-card { transition: all 0.25s; cursor: default; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.07) !important; }
        .edit-field { transition: border-color 0.2s; }
        .edit-field:focus { border-color: ${rc} !important; outline: none; box-shadow: 0 0 0 3px ${rc}15; }
        .save-btn { transition: all 0.2s; }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(20,184,166,0.3); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease; }
      `}</style>

      {/* Cover + avatar row */}
      <div
        style={{
          borderRadius: "24px",
          overflow: "hidden",
          marginBottom: "0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Cover image / gradient */}
        <div
          style={{
            height: "180px",
            background: `linear-gradient(135deg, #132D35 0%, ${rc}40 50%, #1B4A5A 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
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
              background: `rgba(255,255,255,0.04)`,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 200,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `${rc}20`,
            }}
          ></div>
          {/* Role badge top right */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "100px",
              padding: "6px 16px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>
              {role}
            </span>
          </div>
        </div>

        {/* Profile info bar */}
        <div
          style={{
            background: "#fff",
            padding: "0 32px 24px",
            position: "relative",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "absolute", top: "-44px", left: "32px" }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${rc}, ${rc}99)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 700,
                color: "#fff",
                border: "4px solid #fff",
                boxShadow: `0 4px 20px ${rc}40`,
              }}
            >
              {initials}
            </div>
          </div>

          {/* Info + actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingTop: "56px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1B2B3A",
                  marginBottom: "4px",
                }}
              >
                {profile?.full_name || "User"}
              </h1>
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                {profile?.university && (
                  <span style={{ fontSize: "13px", color: "#6B8A9A" }}>
                    🏛️ {profile.university}
                  </span>
                )}
                {profile?.email && (
                  <span style={{ fontSize: "13px", color: "#6B8A9A" }}>
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
                    maxWidth: "480px",
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
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      background: "#14B8A6",
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
                marginTop: "12px",
                padding: "10px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                background: message.includes("Failed") ? "#FEF2F2" : "#F0FCFB",
                color: message.includes("Failed") ? "#DC2626" : "#14B8A6",
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          margin: "20px 0",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid #E2EEF0",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: "26px", marginBottom: "6px" }}>
              {s.icon}
            </div>
            <p
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1B2B3A",
                marginBottom: "2px",
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs - Curved Rectangles */}
      <div
        style={{
          display: "inline-flex",
          gap: "8px",
          background: "#F0F7F8",
          borderRadius: "14px",
          padding: "6px",
          border: "1px solid #E2EEF0",
          marginBottom: "24px",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
                fontFamily: "inherit",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textTransform: "capitalize",
                outline: "none",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="fade-in">
        {activeTab === "about" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Personal Info */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #E2EEF0",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1B2B3A",
                  marginBottom: "20px",
                }}
              >
                Personal Information
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {[
                  {
                    l: "Full Name",
                    v: profile?.full_name,
                    k: "full_name",
                    ph: "Your full name",
                    icon: "👤",
                  },
                  { l: "Email", v: profile?.email, locked: true, icon: "✉️" },
                  {
                    l: "Phone",
                    v: profile?.phone || "Not set",
                    k: "phone",
                    ph: "+91 9876543210",
                    icon: "📱",
                  },
                  { l: "Role", v: role, locked: true, icon: "🎯" },
                  {
                    l: "University / Organization",
                    v: profile?.university || "Not set",
                    k: "university",
                    ph: "e.g. IIT Bombay",
                    icon: "🏛️",
                  },
                ].map((f) => (
                  <div
                    key={f.l}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
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
                      <p
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#9CA3AF",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        {f.l}
                      </p>
                      {editing && f.k ? (
                        <input
                          value={form[f.k]}
                          onChange={(e) =>
                            setForm({ ...form, [f.k]: e.target.value })
                          }
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
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#1B2B3A",
                            fontWeight: 500,
                          }}
                        >
                          {f.v || "—"}
                        </p>
                      )}
                      {f.locked && editing && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#9CA3AF",
                            marginTop: "2px",
                          }}
                        >
                          Cannot be changed
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio + role highlights */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #E2EEF0",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1B2B3A",
                    marginBottom: "14px",
                  }}
                >
                  About Me
                </h3>
                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell us about yourself, your research interests, goals..."
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
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6B8A9A",
                      lineHeight: "1.7",
                    }}
                  >
                    {profile?.bio ||
                      "No bio added yet. Click Edit Profile to add a bio."}
                  </p>
                )}
              </div>

              {/* Role-specific card */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${rc}10, ${rc}05)`,
                  borderRadius: "16px",
                  padding: "22px",
                  border: `1px solid ${rc}20`,
                }}
              >
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1B2B3A",
                    marginBottom: "14px",
                  }}
                >
                  {role === "Student"
                    ? "📚 Learning Journey"
                    : role === "Educator"
                      ? "🎓 Teaching Portfolio"
                      : "🔬 Research Highlights"}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {(role === "Student"
                    ? [
                        {
                          icon: "🧬",
                          text: "Active in Molecular Biology",
                          sub: "Currently on Chapter 4",
                        },
                        {
                          icon: "🔥",
                          text: "14-Day Study Streak",
                          sub: "Keep it up!",
                        },
                        {
                          icon: "🏅",
                          text: "8 Badges Earned",
                          sub: "View all achievements",
                        },
                      ]
                    : role === "Educator"
                      ? [
                          {
                            icon: "📚",
                            text: "6 Active Courses",
                            sub: "128 enrolled students",
                          },
                          {
                            icon: "📝",
                            text: "24 Pending Submissions",
                            sub: "Needs grading",
                          },
                          {
                            icon: "📅",
                            text: "4 Events Hosted",
                            sub: "This semester",
                          },
                        ]
                      : [
                          {
                            icon: "📄",
                            text: "18 Published Papers",
                            sub: "342 total citations",
                          },
                          {
                            icon: "🔬",
                            text: "5 Active Projects",
                            sub: "CRISPR, Genomics, ML",
                          },
                          {
                            icon: "👥",
                            text: "7 Collaborators",
                            sub: "Across 3 institutions",
                          },
                        ]
                  ).map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          background: rc + "15",
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
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1B2B3A",
                          }}
                        >
                          {item.text}
                        </p>
                        <p style={{ fontSize: "11px", color: "#9CA3AF" }}>
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid #E2EEF0",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#1B2B3A",
                marginBottom: "20px",
              }}
            >
              Recent Activity
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  icon: "📖",
                  color: "#14B8A6",
                  title: "Completed Chapter 3: Protein Synthesis",
                  time: "2 hours ago",
                  type: "learning",
                },
                {
                  icon: "🎯",
                  color: "#F97316",
                  title: "Scored 90% on Genetics PYQ Challenge",
                  time: "Yesterday",
                  type: "quiz",
                },
                {
                  icon: "📅",
                  color: "#8B5CF6",
                  title: "Registered for Biotech Symposium 2026",
                  time: "2 days ago",
                  type: "event",
                },
                {
                  icon: "📄",
                  color: "#3B82F6",
                  title: "Saved 3 Research Papers",
                  time: "3 days ago",
                  type: "research",
                },
                {
                  icon: "🔥",
                  color: "#F97316",
                  title: "Achieved 14-Day Streak Milestone",
                  time: "1 week ago",
                  type: "achievement",
                },
              ].map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "14px",
                    padding: "16px 0",
                    borderBottom: i < 4 ? "1px solid #F0F7F8" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: a.color + "15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {a.icon}
                  </div>
                  <span style={{ fontSize: "11px", background: a.color + "12", color: a.color, padding: "4px 10px", borderRadius: "100px", fontWeight: 600, alignSelf: "center", textTransform: "uppercase" }}>{a.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid #E2EEF0",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#1B2B3A",
                marginBottom: "20px",
              }}
            >
              Achievements & Badges
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
              }}
            >
              {[
                {
                  icon: "🔥",
                  label: "Streak Master",
                  desc: "14-day streak",
                  earned: true,
                  color: "#F97316",
                },
                {
                  icon: "🧬",
                  label: "Bio Pioneer",
                  desc: "First paper read",
                  earned: true,
                  color: "#14B8A6",
                },
                {
                  icon: "🎯",
                  label: "Challenge Champion",
                  desc: "10 challenges done",
                  earned: true,
                  color: "#8B5CF6",
                },
                {
                  icon: "📚",
                  label: "Bookworm",
                  desc: "50 notes accessed",
                  earned: true,
                  color: "#3B82F6",
                },
                {
                  icon: "🏆",
                  label: "Top Scorer",
                  desc: "Score 100% on quiz",
                  earned: false,
                  color: "#F59E0B",
                },
                {
                  icon: "🤝",
                  label: "Collaborator",
                  desc: "Join a group study",
                  earned: false,
                  color: "#EC4899",
                },
                {
                  icon: "⭐",
                  label: "Research Star",
                  desc: "Share 5 papers",
                  earned: false,
                  color: "#14B8A6",
                },
                {
                  icon: "🚀",
                  label: "Rocket Start",
                  desc: "Complete 3 courses",
                  earned: false,
                  color: "#6B7280",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: "20px 14px",
                    borderRadius: "14px",
                    background: b.earned ? b.color + "08" : "#F9F9F9",
                    border: `1px solid ${b.earned ? b.color + "20" : "#E2EEF0"}`,
                    opacity: b.earned ? 1 : 0.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: "36px",
                      marginBottom: "8px",
                      filter: b.earned ? "none" : "grayscale(100%)",
                    }}
                  >
                    {b.icon}
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: b.earned ? "#1B2B3A" : "#9CA3AF",
                      marginBottom: "2px",
                    }}
                  >
                    {b.label}
                  </p>
                  <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{b.desc}</p>
                  {b.earned && (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "10px",
                        color: b.color,
                        fontWeight: 700,
                        marginTop: "6px",
                        textTransform: "uppercase",
                      }}
                    >
                      Earned ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
