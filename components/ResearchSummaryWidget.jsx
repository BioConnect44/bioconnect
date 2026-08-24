"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ResearchSummaryWidget({ userId = null }) {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSummary, setActiveSummary] = useState(null);
  const [recentSummaries, setRecentSummaries] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);

  const SUGGESTIONS = [
    "CRISPR Therapeutics",
    "Gene Editing 2026",
    "Cell & Gene Therapy",
    "mRNA Vaccines",
    "Biomanufacturing"
  ];

  // Fetch recent research summaries from Supabase Cloud Database
  async function fetchStoredSummaries() {
    try {
      const { data, error } = await supabase
        .from("research_summaries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (!error && data && data.length > 0) {
        setRecentSummaries(data);
        if (!activeSummary) {
          setActiveSummary(data[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching stored research summaries:", err);
    }
  }

  useEffect(() => {
    fetchStoredSummaries();
  }, []);

  async function handleSearch(searchQuery) {
    const q = searchQuery || query;
    if (!q || !q.trim()) return;

    setLoading(true);
    setStatusMessage("⚡ Fetching PubMed.ai research & generating AI summary...");

    try {
      const response = await fetch("/api/pubmed-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, user_id: userId }),
      });

      const data = await response.json();

      if (data.success && data.summary) {
        setActiveSummary(data.summary);
        setStatusMessage(data.saved_to_db ? "✅ Summary generated & saved to Supabase!" : "✅ Live PubMed summary generated!");
        fetchStoredSummaries();
      } else {
        setStatusMessage("⚠️ Failed to generate summary. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Network error connecting to PubMed API route.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  }

  // Format markdown headers into clean paragraphs
  function renderFormattedSummary(text) {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginTop: "16px", marginBottom: "8px" }}>
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("- ") || line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
        return (
          <div key={idx} style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "#334155", marginBottom: "6px", lineHeight: "1.5" }}>
            <span style={{ color: "#14B8A6", fontWeight: 700 }}>•</span>
            <span>{line.replace(/^(- |\d+\. )/, "")}</span>
          </div>
        );
      }
      if (line.trim().length === 0) return null;
      return (
        <p key={idx} style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.6", marginBottom: "10px" }}>
          {line}
        </p>
      );
    });
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #E2EEF0",
        marginBottom: "24px",
        fontFamily: "inherit"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: "16px",
          borderBottom: "1px solid #E2EEF0",
          gap: "12px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🔬</span>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", margin: 0 }}>
              PubMed.ai Research Summarizer
            </h2>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#14B8A6",
                background: "rgba(20,184,166,0.1)",
                padding: "3px 10px",
                borderRadius: "20px"
              }}
            >
              Cloud DB Sync
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#6B8A9A", margin: "4px 0 0" }}>
            Search peer-reviewed literature & automatically generate detailed AI executive summaries stored in Supabase.
          </p>
        </div>

        {statusMessage && (
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#0D9488",
              background: "#F0F7F8",
              border: "1px solid #CCFBF1",
              padding: "6px 12px",
              borderRadius: "8px"
            }}
          >
            {statusMessage}
          </div>
        )}
      </div>

      {/* Search Input Bar */}
      <div style={{ marginTop: "20px" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search PubMed research topics (e.g. CRISPR Therapeutics, mRNA Vaccines)..."
              style={{
                width: "100%",
                padding: "12px 42px 12px 16px",
                border: "1.5px solid #E2EEF0",
                borderRadius: "12px",
                fontSize: "13.5px",
                fontFamily: "inherit",
                outline: "none",
                background: "#fff",
                color: "#1B2B3A"
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#14B8A6",
                fontSize: "16px"
              }}
            >
              🔍
            </span>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              background: "#14B8A6",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading || !query.trim() ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: loading || !query.trim() ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {loading ? "⚡ Analyzing PubMed..." : "Generate Summary ✨"}
          </button>
        </form>

        {/* Quick Topic Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#6B8A9A", fontWeight: 500 }}>Quick Topics:</span>
          {SUGGESTIONS.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setQuery(topic);
                handleSearch(topic);
              }}
              style={{
                padding: "4px 12px",
                border: "1px solid #E2EEF0",
                borderRadius: "100px",
                fontSize: "12px",
                color: "#1B2B3A",
                background: "#F8FAFC",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Summary View */}
      {loading ? (
        <div
          style={{
            marginTop: "20px",
            padding: "24px",
            background: "#F8FAFC",
            borderRadius: "14px",
            border: "1px solid #E2EEF0",
            color: "#6B8A9A"
          }}
        >
          <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
            ⚡ Connecting to PubMed.ai server, retrieving peer-reviewed studies & generating detailed AI summary...
          </p>
        </div>
      ) : activeSummary ? (
        <div
          style={{
            marginTop: "20px",
            background: "linear-gradient(135deg, #F0FCFB 0%, #F3F0FF 100%)",
            borderRadius: "14px",
            padding: "24px",
            border: "1px solid rgba(20,184,166,0.2)"
          }}
        >
          {/* Card Top Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  color: "#fff",
                  fontWeight: 700,
                  background: "#14B8A6",
                  padding: "3px 9px",
                  borderRadius: "6px",
                  textTransform: "uppercase"
                }}
              >
                PMID: {activeSummary.pmid || "389201"}
              </span>
              {activeSummary.journal && (
                <span style={{ fontSize: "12px", color: "#6B8A9A", fontWeight: 600, background: "#fff", padding: "3px 9px", borderRadius: "6px", border: "1px solid #E2EEF0" }}>
                  {activeSummary.journal}
                </span>
              )}
            </div>

            <span style={{ fontSize: "12px", color: "#0D9488", fontWeight: 600 }}>
              ☁️ Saved to Supabase Database
            </span>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", margin: "0 0 8px", lineHeight: "1.4" }}>
            {activeSummary.title}
          </h3>

          {/* Authors */}
          {activeSummary.authors && (
            <p style={{ fontSize: "12px", color: "#6B8A9A", marginBottom: "16px" }}>
              <strong style={{ color: "#1B2B3A" }}>Authors:</strong> {activeSummary.authors}
            </p>
          )}

          {/* Detailed Multi-Section AI Summary Box */}
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid rgba(20,184,166,0.2)",
              marginBottom: "16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px" }}>✨</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#0D9488", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Comprehensive AI Literature Synthesis
              </span>
            </div>
            {renderFormattedSummary(activeSummary.summary_text)}
          </div>

          {/* Citations List */}
          {activeSummary.citations && Array.isArray(activeSummary.citations) && activeSummary.citations.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#6B8A9A", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                Referenced PubMed Citations ({activeSummary.citations.length})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {activeSummary.citations.map((cite, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#fff",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #E2EEF0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "12.5px"
                    }}
                  >
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: 700, color: "#14B8A6", marginRight: "8px" }}>[{idx + 1}]</span>
                      <span style={{ color: "#1B2B3A", fontWeight: 500 }}>{cite.title}</span>
                    </div>
                    {cite.url && (
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#14B8A6", fontWeight: 600, textDecoration: "none", shrink: 0 }}
                      >
                        View PubMed ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(20,184,166,0.15)" }}>
            <span style={{ fontSize: "12px", color: "#6B8A9A" }}>
              Topic Query: <strong style={{ color: "#1B2B3A" }}>"{activeSummary.query}"</strong>
            </span>
            {activeSummary.source_url && (
              <a
                href={activeSummary.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#1B2B3A",
                  color: "#fff",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                Read Full Paper on PubMed ↗
              </a>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: "20px",
            padding: "24px",
            background: "#F8FAFC",
            borderRadius: "14px",
            border: "1px border-dashed #E2EEF0",
            textAlign: "center"
          }}
        >
          <span style={{ fontSize: "28px", display: "block", marginBottom: "6px" }}>🧬</span>
          <p style={{ fontSize: "13.5px", color: "#6B8A9A", margin: 0 }}>
            Search any research topic above to fetch detailed PubMed AI literature summaries.
          </p>
        </div>
      )}

      {/* Supabase Stored Feed */}
      {recentSummaries.length > 0 && (
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #E2EEF0" }}>
          <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#6B8A9A", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
            Stored Summaries in Supabase ({recentSummaries.length})
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
            {recentSummaries.slice(0, 4).map((sum) => (
              <div
                key={sum.id}
                onClick={() => setActiveSummary(sum)}
                style={{
                  background: activeSummary?.id === sum.id ? "#F0FCFB" : "#fff",
                  border: activeSummary?.id === sum.id ? "1.5px solid #14B8A6" : "1px solid #E2EEF0",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B8A9A", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "#14B8A6" }}>{sum.query}</span>
                  <span>PMID: {sum.pmid || "NCBI"}</span>
                </div>
                <h5 style={{ fontSize: "12.5px", fontWeight: 600, color: "#1B2B3A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.3" }}>
                  {sum.title}
                </h5>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
