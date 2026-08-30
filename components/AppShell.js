"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import HelpCenterChatbot from "@/components/HelpCenterChatbot";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    href: "/learning",
    label: "Learning",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    )
  },
  {
    href: "/research",
    label: "Research",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h12"/>
        <path d="M10 18v-3a4 4 0 0 0 4-4V7"/>
        <path d="M9 3h6v4H9z"/>
        <circle cx="12" cy="11" r="2"/>
      </svg>
    )
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    )
  },
  {
    href: "/events",
    label: "Events",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  {
    href: "/biominute",
    label: "Bio-Minute",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
];

export default function AppShell({ children, active }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [helpBotOpen, setHelpBotOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0C2127", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0C2127; }
        ::-webkit-scrollbar-thumb { background: #163A43; border-radius: 3px; }
        
        .sidebar-nav-item { 
          display: flex; 
          align-items: center; 
          gap: 14px; 
          padding: 12px 20px;
          border-radius: 14px; 
          text-decoration: none; 
          font-size: 14px; 
          font-weight: 500;
          color: #7E99A2;
          transition: all 0.2s ease; 
          cursor: pointer; 
          border: none; 
          background: transparent;
          width: 100%; 
          text-align: left; 
          font-family: 'Poppins', sans-serif;
        }
        .sidebar-nav-item:hover { 
          background: rgba(22, 58, 67, 0.6); 
          color: #00C2B2; 
        }
        .sidebar-nav-item.active { 
          background: #163A43; 
          color: #00C2B2; 
          font-weight: 600; 
        }

        .logout-btn-custom {
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding: 12px 20px;
          border-radius: 14px; 
          font-size: 14px; 
          font-weight: 600; 
          cursor: pointer;
          border: none; 
          background: transparent; 
          width: 100%; 
          text-align: left;
          color: #FF5B5B; 
          transition: all 0.2s ease; 
          font-family: 'Poppins', sans-serif;
        }
        .logout-btn-custom:hover { 
          background: rgba(255, 91, 91, 0.12); 
        }

        .main-canvas-wrapper { 
          flex: 1; 
          padding: 16px 16px 16px 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .main-canvas-content {
          flex: 1;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 32px;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }

        .mobile-top-header { display: none; }
        .mobile-bottom-nav { display: none; }

        @media (max-width: 1023px) {
          .sidebar-custom { display: none !important; }
          .mobile-top-header { display: flex !important; }
          .mobile-bottom-nav { display: flex !important; }
          .main-canvas-wrapper { padding: 12px 12px 76px 12px !important; }
          .main-canvas-content { padding: 18px !important; border-radius: 16px !important; }
        }
      `}</style>

      {/* MOBILE TOP HEADER (< 1024px) */}
      <header className="mobile-top-header" style={{
        background: "#0C2127",
        borderBottom: "1px solid #163A43",
        padding: "12px 16px",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            style={{ background: "none", border: "none", color: "#00C2B2", fontSize: "22px", cursor: "pointer", padding: "4px" }}
            aria-label="Toggle Navigation Menu"
          >
            ☰
          </button>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#00C2B2", letterSpacing: "-0.4px" }}>
            BioConnect
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setHelpBotOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              border: "1px solid rgba(0, 194, 178, 0.4)",
              background: "rgba(0, 194, 178, 0.15)",
              color: "#00C2B2",
              cursor: "pointer"
            }}
          >
            💬 AI Chatbot
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY (< 1024px) */}
      {mobileDrawerOpen && (
        <div 
          onClick={() => setMobileDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99, backdropFilter: "blur(4px)" }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "280px",
              height: "100%",
              background: "#0C2127",
              padding: "24px 16px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "4px 0 24px rgba(0,0,0,0.3)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", padding: "0 8px" }}>
              <span style={{ fontSize: "20px", fontWeight: 800, color: "#00C2B2" }}>BioConnect Menu</span>
              <button 
                onClick={() => setMobileDrawerOpen(false)} 
                style={{ background: "none", border: "none", color: "#7E99A2", fontSize: "20px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {NAV_ITEMS.map(item => {
                const isEventRoute = item.href === "/events" && (currentPath === "/events" || currentPath === "/eventss");
                const isActive = isEventRoute || currentPath === item.href || (item.href !== "/dashboard" && currentPath.startsWith(item.href) && item.href !== "/events");

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`sidebar-nav-item${isActive ? " active" : ""}`}
                    style={{ padding: "12px 16px" }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #163A43" }}>
              <button 
                className="logout-btn-custom" 
                onClick={() => { setMobileDrawerOpen(false); handleLogout(); }}
                style={{ padding: "12px 16px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5B5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* LEFT SIDEBAR (DESKTOP >= 1024px) */}
        <aside className="sidebar-custom" style={{
          width: sidebarOpen ? 240 : 72,
          flexShrink: 0,
          background: "#0C2127",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "width 0.25s ease",
          overflow: "hidden",
          position: "sticky",
          top: 0,
          height: "100vh",
          padding: sidebarOpen ? "28px 16px 24px 16px" : "28px 8px 24px 8px"
        }}>
          {/* Top Header / Logo */}
          <div>
            <div style={{
              padding: "0 12px 32px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              {sidebarOpen && (
                <span style={{ fontSize: "22px", fontWeight: 800, color: "#00C2B2", letterSpacing: "-0.4px" }}>
                  BioConnect
                </span>
              )}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                title="Toggle sidebar"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "#7E99A2",
                  fontSize: 16,
                  lineHeight: 1
                }}
              >
                {sidebarOpen ? "←" : "→"}
              </button>
            </div>

            {/* Navigation Links */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {NAV_ITEMS.map(item => {
                const isEventRoute = item.href === "/events" && (currentPath === "/events" || currentPath === "/eventss");
                const isActive = isEventRoute || currentPath === item.href || (item.href !== "/dashboard" && currentPath.startsWith(item.href) && item.href !== "/events");

                return (
                  <a 
                    key={item.href} 
                    href={item.href} 
                    className={`sidebar-nav-item${isActive ? " active" : ""}`}
                    style={{ 
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      padding: sidebarOpen ? "12px 18px" : "12px"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Bottom / AI Chatbot & Logout */}
          <div style={{ marginTop: "auto", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              onClick={() => setHelpBotOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: sidebarOpen ? "6px 12px" : "6px 8px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid rgba(0, 194, 178, 0.3)",
                background: "rgba(0, 194, 178, 0.1)",
                color: "#00C2B2",
                width: sidebarOpen ? "fit-content" : "100%",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                transition: "all 0.2s ease"
              }}
            >
              <span style={{ fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>💬</span>
              {sidebarOpen && <span>AI Chatbot</span>}
            </button>

            <button 
              className="logout-btn-custom" 
              onClick={handleLogout}
              style={{ 
                justifyContent: sidebarOpen ? "flex-start" : "center",
                padding: sidebarOpen ? "12px 18px" : "12px"
              }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5B5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="main-canvas-wrapper">
          <main className="main-canvas-content">
            {children}
          </main>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (< 1024px) */}
      <nav className="mobile-bottom-nav" style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#0C2127",
        borderTop: "1px solid #163A43",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 4px",
        zIndex: 50
      }}>
        {NAV_ITEMS.slice(0, 5).concat(NAV_ITEMS.slice(6, 7)).map(item => {
          const isEventRoute = item.href === "/events" && (currentPath === "/events" || currentPath === "/eventss");
          const isActive = isEventRoute || currentPath === item.href || (item.href !== "/dashboard" && currentPath.startsWith(item.href) && item.href !== "/events");

          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                textDecoration: "none",
                fontSize: "10px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#00C2B2" : "#7E99A2"
              }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Help Center AI Chatbot Drawer/Modal */}
      <HelpCenterChatbot isOpen={helpBotOpen} onClose={() => setHelpBotOpen(false)} />
    </div>
  );
}