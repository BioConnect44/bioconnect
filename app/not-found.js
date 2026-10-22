import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F8FAFC",
        color: "#0F172A",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Minimal Top Brand Bar */}
      <header
        style={{
          borderBottom: "1px solid #E2E8F0",
          background: "#ffffff",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#0D9488",
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "-0.3px",
            }}
          >
            <span>🧬</span>
            <span>BioConnect</span>
          </Link>
          <Link
            href="/"
            style={{
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#64748B",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main 404 Hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "#F1F5F9",
              color: "#475569",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: "0.82rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            Error 404
          </span>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1.2,
              margin: "0 0 16px",
              letterSpacing: "-0.5px",
            }}
          >
            BioConnect Not Found
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              color: "#64748B",
              lineHeight: 1.6,
              maxWidth: 540,
              margin: "0 auto 32px",
            }}
          >
            The page you are looking for doesn't exist, has been moved, or the link may be outdated.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginBottom: 48,
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 24px",
                background: "#14B8A6",
                color: "#ffffff",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.92rem",
                textDecoration: "none",
              }}
            >
              Return to Homepage
            </Link>
            <Link
              href="/learning"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 24px",
                background: "#ffffff",
                color: "#334155",
                border: "1px solid #CBD5E1",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.92rem",
                textDecoration: "none",
              }}
            >
              Browse Courses
            </Link>
          </div>

          {/* Quick Hub Directories */}
          <div
            style={{
              textAlign: "left",
              background: "#ffffff",
              border: "1px solid #E2E8F0",
              borderRadius: 16,
              padding: "24px 28px",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 16,
              }}
            >
              Popular Destinations
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              <Link
                href="/learning"
                style={{
                  textDecoration: "none",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid transparent",
                  transition: "background 0.15s",
                  display: "block",
                }}
              >
                <div style={{ fontWeight: 600, color: "#0F172A", fontSize: "0.92rem", marginBottom: 4 }}>
                  📚 Study Notes
                </div>
                <div style={{ color: "#64748B", fontSize: "0.8rem", lineHeight: 1.4 }}>
                  Access 250+ pages of structured topic modules
                </div>
              </Link>

              <Link
                href="/research"
                style={{
                  textDecoration: "none",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid transparent",
                  transition: "background 0.15s",
                  display: "block",
                }}
              >
                <div style={{ fontWeight: 600, color: "#0F172A", fontSize: "0.92rem", marginBottom: 4 }}>
                  🔬 Research Portal
                </div>
                <div style={{ color: "#64748B", fontSize: "0.8rem", lineHeight: 1.4 }}>
                  Search PubMed papers & scientific breakthroughs
                </div>
              </Link>

              <Link
                href="/jobs"
                style={{
                  textDecoration: "none",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid transparent",
                  transition: "background 0.15s",
                  display: "block",
                }}
              >
                <div style={{ fontWeight: 600, color: "#0F172A", fontSize: "0.92rem", marginBottom: 4 }}>
                  💼 Biotech Careers
                </div>
                <div style={{ color: "#64748B", fontSize: "0.8rem", lineHeight: 1.4 }}>
                  Discover internships, fellowships & jobs
                </div>
              </Link>

              <Link
                href="/contact"
                style={{
                  textDecoration: "none",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid transparent",
                  transition: "background 0.15s",
                  display: "block",
                }}
              >
                <div style={{ fontWeight: 600, color: "#0F172A", fontSize: "0.92rem", marginBottom: 4 }}>
                  💬 Contact Team
                </div>
                <div style={{ color: "#64748B", fontSize: "0.8rem", lineHeight: 1.4 }}>
                  Get help or report a broken link
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer
        style={{
          borderTop: "1px solid #E2E8F0",
          background: "#ffffff",
          padding: "16px 24px",
          textAlign: "center",
          fontSize: "0.82rem",
          color: "#94A3B8",
        }}
      >
        BioConnect Platform © {new Date().getFullYear()} — India's Biotechnology Academic Network
      </footer>
    </div>
  );
}
