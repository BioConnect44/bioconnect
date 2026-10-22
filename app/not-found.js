import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F8FAFC",
        color: "#0F172A",
        fontFamily: "'Poppins', sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "5.5rem",
            fontWeight: 900,
            color: "#CBD5E1",
            lineHeight: 1,
            marginBottom: 12,
            letterSpacing: "-2px",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#0F172A",
            margin: "0 0 12px",
            letterSpacing: "-0.3px",
          }}
        >
          BioConnect Not Found
        </h1>

        <p
          style={{
            fontSize: "0.95rem",
            color: "#64748B",
            lineHeight: 1.6,
            margin: "0 0 28px",
          }}
        >
          The page you are looking for doesn't exist, has been moved, or the link may be outdated.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 28px",
            background: "#14B8A6",
            color: "#ffffff",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
            transition: "opacity 0.2s ease",
          }}
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
