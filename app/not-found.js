import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #F0FDF4 0%, #EEF7F7 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: "24px",
      color: "#0F2A38"
    }}>
      <div style={{
        maxWidth: "540px",
        width: "100%",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "48px 36px",
        boxShadow: "0 20px 50px rgba(20, 184, 166, 0.08)",
        textAlign: "center",
        border: "1px solid rgba(20, 184, 166, 0.15)"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(20, 184, 166, 0.12)",
          color: "#0D9488",
          fontSize: "2rem",
          fontWeight: 800,
          marginBottom: "20px"
        }}>
          404
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 12px", color: "#0F2A38" }}>
          Biomolecule Not Found
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#64748B", lineHeight: 1.6, margin: "0 0 32px" }}>
          The research page, course, or resource you were looking for doesn't exist or has migrated to another strand.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "13px 24px",
              background: "#14B8A6",
              color: "#ffffff",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "background 0.2s"
            }}
          >
            Return to Homepage
          </Link>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "8px" }}>
            <Link
              href="/learning"
              style={{ fontSize: "0.85rem", color: "#0D9488", textDecoration: "none", fontWeight: 600 }}
            >
              Courses
            </Link>
            <span style={{ color: "#CBD5E1" }}>•</span>
            <Link
              href="/research"
              style={{ fontSize: "0.85rem", color: "#0D9488", textDecoration: "none", fontWeight: 600 }}
            >
              Research
            </Link>
            <span style={{ color: "#CBD5E1" }}>•</span>
            <Link
              href="/jobs"
              style={{ fontSize: "0.85rem", color: "#0D9488", textDecoration: "none", fontWeight: 600 }}
            >
              Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
