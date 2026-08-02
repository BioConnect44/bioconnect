"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { label: "Learning", href: "/learning", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  { label: "Research", href: "/research", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { label: "Jobs", href: "/jobs", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  { label: "Events", href: "/events", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: "Bio-Minute", href: "/biominute", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { label: "Profile", href: "/profile", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

export default function AppShell({ children, active }) {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EEF7F7", fontFamily: "'Poppins', sans-serif" }}>
      <style>{SHELL_CSS}</style>

      {/* Sidebar */}
      <aside className="shell-sidebar">
        <div>
          <a href="/" className="shell-logo">
            <span style={{ color: "#14B8A6", fontWeight: 700, fontSize: "20px", letterSpacing: "-0.5px" }}>BioConnect</span>
          </a>
          <nav className="shell-nav">
            {NAV.map((item) => {
              const isActive = active === item.href || (typeof window !== "undefined" && window.location.pathname === item.href);
              return (
                <a key={item.label} href={item.href} className={`shell-nav-item ${isActive ? "shell-nav-active" : ""}`}>
                  <span className="shell-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
        <button onClick={handleLogout} className="shell-logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="shell-main">
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#6B8A9A", fontSize: "16px" }}>Loading...</div>
        ) : (
          typeof children === "function" ? children({ profile, supabase }) : children
        )}
      </main>
    </div>
  );
}

export { NAV };

const SHELL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #EEF7F7; }
a { text-decoration: none; color: inherit; }

.shell-sidebar {
  width: 200px; min-height: 100vh; background: #132D35;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 24px 12px; position: fixed; top: 0; left: 0; bottom: 0; z-index: 50;
}
.shell-logo {
  display: block; padding: 4px 12px; margin-bottom: 32px;
}
.shell-nav { display: flex; flex-direction: column; gap: 2px; }
.shell-nav-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border-radius: 10px; font-size: 13.5px; color: rgba(255,255,255,0.55);
  transition: all 0.15s; font-weight: 400; cursor: pointer;
}
.shell-nav-item:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.06); }
.shell-nav-active {
  color: #fff !important; background: rgba(20,184,166,0.18) !important;
  font-weight: 500;
}
.shell-nav-active .shell-nav-icon { color: #14B8A6; }
.shell-nav-icon { opacity: 0.7; display: flex; align-items: center; }
.shell-nav-active .shell-nav-icon { opacity: 1; }
.shell-logout {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border-radius: 10px; font-size: 13.5px; color: #EF4444;
  background: none; border: none; cursor: pointer; width: 100%; font-family: inherit;
  transition: all 0.15s;
}
.shell-logout:hover { background: rgba(239,68,68,0.1); }
.shell-main {
  margin-left: 200px; flex: 1; padding: 32px 36px;
  min-height: 100vh; overflow-y: auto;
}
`;