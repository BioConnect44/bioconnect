import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "560px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <img
          src="/404-dino-teal.gif"
          alt="404 Page Not Found"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            imageRendering: "pixelated",
          }}
          loading="eager"
          decoding="async"
        />

        <Link
          href="/"
          style={{
            marginTop: "12px",
            color: "#1E293B",
            fontSize: "0.95rem",
            fontWeight: 500,
            textDecoration: "none",
            transition: "color 0.2s ease",
            padding: "8px 16px",
            borderRadius: "8px",
          }}
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}
