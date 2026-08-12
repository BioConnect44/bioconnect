"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";

export default function ResearchPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [papers, setPapers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    authors: "",
    abstract: "",
    topic: "",
    journal: "",
    published_date: "",
    paper_url: "",
  });

  async function loadPapers() {
    const { data } = await supabase
      .from("research_papers")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });
    setPapers(data || []);
    if (data?.length > 0) setSelected(data[0]);
  }

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
      await loadPapers();
    }
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("research_papers").insert({
      ...form,
      uploaded_by: profile.id,
      published_date: form.published_date || null,
    });
    if (error) alert("Error: " + error.message);
    else {
      setShowAdd(false);
      setForm({
        title: "",
        authors: "",
        abstract: "",
        topic: "",
        journal: "",
        published_date: "",
        paper_url: "",
      });
      await loadPapers();
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete?")) return;
    await supabase.from("research_papers").delete().eq("id", id);
    await loadPapers();
  }

  const isEducator =
    profile?.role === "educator" || profile?.role === "researcher";
  const filtered = papers.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.authors?.toLowerCase().includes(q)
    );
  });

  // Generate a simple AI summary (static for now)
  const aiSummary = selected
    ? `This paper by ${selected.authors || "the authors"} explores ${selected.topic || "biotech"} and presents key findings in the field. The research demonstrates significant advancements with practical implications for biotechnology applications.`
    : "";
  const aiPoints = selected
    ? [
        "Tested across multiple experimental conditions with high viability",
        "Results show significant improvement over baseline methods",
        "Findings have direct applications in therapeutic development",
      ]
    : [];

  return (
    <AppShell active="/research">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2B3A" }}>
          Explore Research
        </h1>
        {isEducator && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            style={{
              background: "#14B8A6",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {showAdd ? "Cancel" : "+ Add Paper"}
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="How does CRISPR affect..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "13px 48px 13px 18px",
            border: "1.5px solid #E2EEF0",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
            background: "#fff",
            color: "#1B2B3A",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#14B8A6",
            fontSize: "18px",
          }}
        >
          🔍
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["Year", "Subject", "Open Access"].map((f) => (
          <button
            key={f}
            style={{
              padding: "6px 14px",
              border: "1.5px solid #E2EEF0",
              borderRadius: "100px",
              fontSize: "13px",
              color: "#6B8A9A",
              background: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {f} ▾
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #E2EEF0",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1B2B3A",
              marginBottom: "16px",
            }}
          >
            Add Research Paper
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <label style={L}>Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={I}
                placeholder="e.g. CRISPR-Cas9 editing efficiency..."
              />
            </div>
            <div>
              <label style={L}>Authors</label>
              <input
                value={form.authors}
                onChange={(e) => setForm({ ...form, authors: e.target.value })}
                style={I}
                placeholder="J. Doudna, et al."
              />
            </div>
            <div>
              <label style={L}>Journal</label>
              <input
                value={form.journal}
                onChange={(e) => setForm({ ...form, journal: e.target.value })}
                style={I}
                placeholder="Nature Genetics"
              />
            </div>
            <div>
              <label style={L}>Topic</label>
              <input
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                style={I}
                placeholder="Molecular Biology"
              />
            </div>
            <div>
              <label style={L}>Date</label>
              <input
                type="date"
                value={form.published_date}
                onChange={(e) =>
                  setForm({ ...form, published_date: e.target.value })
                }
                style={I}
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={L}>Paper URL</label>
              <input
                value={form.paper_url}
                onChange={(e) =>
                  setForm({ ...form, paper_url: e.target.value })
                }
                style={I}
                placeholder="https://doi.org/..."
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={L}>Abstract</label>
              <textarea
                value={form.abstract}
                onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                rows={3}
                style={{ ...I, resize: "vertical" }}
                placeholder="Brief summary..."
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <button
                onClick={handleAdd}
                disabled={saving || !form.title}
                style={{
                  background: "#14B8A6",
                  color: "#fff",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  opacity: saving || !form.title ? 0.6 : 1,
                }}
              >
                {saving ? "Adding..." : "Add Paper"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "20px",
        }}
      >
        {/* Left - paper list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight:
                  "40vh" /* Adjust this value to fill your desired empty space */,
                padding: "20px",
                color: "#9CA3AF",
              }}
            >
              <p>No papers yet. {isEducator && " Add the first one!"}</p>
            </div>
          ) : (
            filtered.map((paper) => (
              <div
                key={paper.id}
                onClick={() => setSelected(paper)}
                style={{
                  background: selected?.id === paper.id ? "#F0FCFB" : "#fff",
                  border:
                    selected?.id === paper.id
                      ? "2px solid #14B8A6"
                      : "1.5px solid #E2EEF0",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>📄</span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#14B8A6",
                      fontWeight: 600,
                      background: "rgba(20,184,166,0.1)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    PDF Available
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1B2B3A",
                    marginBottom: "6px",
                    lineHeight: "1.4",
                  }}
                >
                  {paper.title}
                </p>
                <p style={{ fontSize: "12px", color: "#6B8A9A" }}>
                  {paper.authors || paper.profiles?.full_name} •{" "}
                  {paper.published_date
                    ? new Date(paper.published_date).getFullYear()
                    : "2026"}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "12px",
                  }}
                >
                  <button
                    style={{
                      fontSize: "12px",
                      color: "#6B8A9A",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Cite 99
                  </button>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{
                        fontSize: "12px",
                        color: "#6B8A9A",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Save 🔖
                    </button>
                    {isEducator && paper.uploaded_by === profile?.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(paper.id);
                        }}
                        style={{
                          fontSize: "12px",
                          color: "#EF4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right - detail panel */}
        {selected && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid #E2EEF0",
              position: "sticky",
              top: "20px",
              alignSelf: "flex-start",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#6B8A9A",
                marginBottom: "10px",
              }}
            >
              {selected.journal || "Research Journal"} • Published{" "}
              {selected.published_date
                ? new Date(selected.published_date).toLocaleString("en", {
                    month: "short",
                    year: "numeric",
                  })
                : "2026"}{" "}
              • {selected.authors || "Authors"}
            </p>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1B2B3A",
                marginBottom: "20px",
                lineHeight: "1.3",
              }}
            >
              {selected.title}
            </h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
              {selected.paper_url ? (
                <a
                  href={selected.paper_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#14B8A6",
                    color: "#fff",
                    padding: "11px 22px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Read Full Text
                </a>
              ) : (
                <button
                  style={{
                    background: "#14B8A6",
                    color: "#fff",
                    padding: "11px 22px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    opacity: 0.5,
                  }}
                >
                  Read Full Text
                </button>
              )}
              <button
                style={{
                  background: "#fff",
                  color: "#14B8A6",
                  padding: "11px 22px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "1.5px solid #14B8A6",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Download PDF
              </button>
            </div>

            {/* AI Summary */}
            <div
              style={{
                background: "linear-gradient(135deg, #F3F0FF, #E8F9F5)",
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #14B8A6)",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  ✨ AI Paper Summary
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  lineHeight: "1.7",
                  marginBottom: "14px",
                }}
              >
                {selected.abstract || aiSummary}
              </p>
              {aiPoints.map((pt, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: "10px", marginBottom: "8px" }}
                >
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>🔬</span>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6B8A9A",
                      lineHeight: "1.5",
                    }}
                  >
                    {pt}
                  </p>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22C55E",
                  }}
                ></div>
                <span style={{ fontSize: "11px", color: "#6B8A9A" }}>
                  High Confidence (94%) • Generated in 1.2s
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

const L = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#6B8A9A",
  marginBottom: "6px",
};
const I = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #E2EEF0",
  borderRadius: "10px",
  fontSize: "14px",
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
  color: "#1B2B3A",
};
