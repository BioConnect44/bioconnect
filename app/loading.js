export default function GlobalLoading() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "3px solid #E2E8F0",
        borderTopColor: "#14B8A6",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        marginTop: "16px",
        height: "12px",
        width: "140px",
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "skeletonShimmer 1.5s infinite",
        borderRadius: "6px"
      }} />
      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
