"use client";

export function CardSkeleton({ count = 3 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", width: "100%" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="skeleton-box" style={{ width: 44, height: 44, borderRadius: 10 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="skeleton-box" style={{ height: 16, width: "70%", borderRadius: 4 }} />
              <div className="skeleton-box" style={{ height: 12, width: "40%", borderRadius: 4 }} />
            </div>
          </div>
          <div className="skeleton-box" style={{ height: 14, width: "100%", borderRadius: 4 }} />
          <div className="skeleton-box" style={{ height: 14, width: "85%", borderRadius: 4 }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <div className="skeleton-box" style={{ height: 24, width: 70, borderRadius: 12 }} />
            <div className="skeleton-box" style={{ height: 28, width: 90, borderRadius: 8 }} />
          </div>
        </div>
      ))}
      <style jsx global>{`
        .skeleton-box {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

export function EmptyState({ title = "No Results Found", message = "Try adjusting your search filters or check back later.", actionText, onAction }) {
  return (
    <div style={{
      padding: "48px 24px",
      textAlign: "center",
      background: "#ffffff",
      borderRadius: "20px",
      border: "1px dashed #CBD5E1",
      margin: "24px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#F0FDFA",
        color: "#14B8A6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        marginBottom: 16
      }}>
        🔍
      </div>
      <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{title}</h3>
      <p style={{ margin: "0 0 20px", fontSize: "0.92rem", color: "#64748B", maxWidth: 420 }}>{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            background: "#14B8A6",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer"
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
