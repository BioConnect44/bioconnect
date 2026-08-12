"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/learning", icon: "📚", label: "Learning" },
  { href: "/research", icon: "🔬", label: "Research" },
  { href: "/jobs", icon: "💼", label: "Jobs" },
  { href: "/eventss", icon: "📅", label: "Events" },
  { href: "/biominute", icon: "⚡", label: "Bio-Minute" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function AppShell({ children, active }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    }
    loadProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const currentPath = active || pathname;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F7F8", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F0F7F8; }
        ::-webkit-scrollbar-thumb { background: #C0D8DC; border-radius: 3px; }
        .nav-item { 
          display: flex; align-items: center; gap: 10px; padding: 10px 14px;
          border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500;
          transition: all 0.18s ease; cursor: pointer; border: none; background: none;
          width: 100%; text-align: left; font-family: 'Poppins', sans-serif;
        }
        .nav-item:hover { background: rgba(20,184,166,0.08); color: #14B8A6; transform: translateX(2px); }
        .nav-item.active { background: rgba(20,184,166,0.12); color: #14B8A6; font-weight: 600; }
        .nav-item.active .nav-dot { background: #14B8A6; }
        .logout-btn {
          display: flex; align-items: center; gap: 10px; padding: 10px 14px;
          border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer;
          border: none; background: none; width: 100%; text-align: left;
          color: #EF4444; transition: all 0.18s; font-family: 'Poppins', sans-serif;
        }
        .logout-btn:hover { background: #FEF2F2; }
        .main-content { flex: 1; overflow-y: auto; padding: 28px 32px; }
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .main-content { padding: 16px; }
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="sidebar" style={{
        width: sidebarOpen ? 240 : 72, flexShrink: 0,
        background: "#fff", borderRight: "1px solid #E2EEF0",
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease", overflow: "hidden",
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 16px 16px", borderBottom: "1px solid #F0F7F8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#14B8A6", letterSpacing: "-0.3px" }}>BioConnect</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#6B8A9A", fontSize: 18, lineHeight: 1 }}>
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const isActive = currentPath === item.href;
            return (
              <a key={item.href} href={item.href} className={`nav-item${isActive ? " active" : ""}`}
                style={{ color: isActive ? "#14B8A6" : "#4B5563", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {isActive && sidebarOpen && (
                  <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#14B8A6" }} />
                )}
              </a>
            );
          })}
        </nav>

        {/* Profile + logout */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #F0F7F8" }}>
          {profile && sidebarOpen && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 4, background: "#F8FCFC", borderRadius: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#14B8A6,#0D9488)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1B2B3A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.full_name}</p>
                <p style={{ fontSize: 11, color: "#9CA3AF", textTransform: "capitalize" }}>{profile.role}</p>
              </div>
            </div>
          )}
          {!sidebarOpen && profile && (
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#14B8A6,#0D9488)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 auto 6px" }}>
              {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && <span>Log out</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}