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

  return (
    <div className="w-full bg-white rounded-2xl border border-teal-100 shadow-sm p-6 mb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔬</span>
            <h2 className="text-xl font-bold text-gray-900">PubMed.ai Research Summarizer</h2>
            <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-200">
              Supabase Sync Active
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Search peer-reviewed literature & automatically generate AI executive summaries stored in cloud DB.
          </p>
        </div>

        {/* Cloud Status */}
        {statusMessage && (
          <div className="text-xs font-medium text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 animate-pulse">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search PubMed research topics (e.g. CRISPR Therapeutics, Cancer Immunotherapy)..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50"
            />
            <span className="absolute right-3 top-3.5 text-gray-400 text-sm">🔍</span>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Analyzing PubMed...</span>
              </>
            ) : (
              <>
                <span>Generate Summary</span>
                <span>✨</span>
              </>
            )}
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs text-gray-400 font-medium">Quick Topics:</span>
          {SUGGESTIONS.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setQuery(topic);
                handleSearch(topic);
              }}
              className="text-xs bg-gray-100 hover:bg-teal-50 hover:text-teal-700 text-gray-600 font-medium px-2.5 py-1 rounded-lg transition-colors border border-transparent hover:border-teal-200"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Summary Card */}
      {loading ? (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-1/3"></div>
        </div>
      ) : activeSummary ? (
        <div className="mt-8 bg-gradient-to-br from-teal-50/40 via-white to-gray-50 rounded-2xl p-6 border border-teal-100 shadow-sm relative">
          {/* Card Badges */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-teal-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                PubMed PMID: {activeSummary.pmid || "389201"}
              </span>
              {activeSummary.journal && (
                <span className="text-xs font-semibold text-gray-600 bg-gray-200/70 px-2.5 py-0.5 rounded-md">
                  {activeSummary.journal}
                </span>
              )}
            </div>

            <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
              <span>☁️</span> Saved to Supabase
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-extrabold text-gray-900 mb-3 leading-snug">
            {activeSummary.title}
          </h3>

          {/* Authors */}
          {activeSummary.authors && (
            <p className="text-xs text-gray-500 mb-4 font-medium">
              <span className="font-semibold text-gray-700">Authors:</span> {activeSummary.authors}
            </p>
          )}

          {/* AI Summary Text Box */}
          <div className="bg-white p-4 rounded-xl border border-teal-100 text-sm text-gray-700 leading-relaxed mb-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 mb-2 uppercase tracking-wide">
              <span>✨</span>
              <span>AI Research Synthesis</span>
            </div>
            <p>{activeSummary.summary_text}</p>
          </div>

          {/* Citations Section */}
          {activeSummary.citations && Array.isArray(activeSummary.citations) && activeSummary.citations.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Referenced Citations ({activeSummary.citations.length})
              </h4>
              <div className="space-y-2">
                {activeSummary.citations.map((cite, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between text-xs gap-3">
                    <div className="truncate">
                      <span className="font-bold text-teal-700 mr-2">[{idx + 1}]</span>
                      <span className="font-medium text-gray-800">{cite.title}</span>
                    </div>
                    {cite.url && (
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-800 font-semibold shrink-0"
                      >
                        View PubMed ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-teal-100/60">
            <span className="text-xs text-gray-400">
              Query: <strong className="text-gray-600">"{activeSummary.query}"</strong>
            </span>
            {activeSummary.source_url && (
              <a
                href={activeSummary.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>Read Full Paper on PubMed</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 p-8 bg-gray-50 rounded-2xl text-center border border-dashed border-gray-200">
          <span className="text-3xl block mb-2">🧬</span>
          <p className="text-sm text-gray-500 font-medium">Search any biotechnology or medical query above to fetch PubMed AI summaries.</p>
        </div>
      )}

      {/* Stored Summaries Cloud Feed */}
      {recentSummaries.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Recently Stored Summaries in Supabase ({recentSummaries.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentSummaries.slice(0, 4).map((sum) => (
              <div
                key={sum.id}
                onClick={() => setActiveSummary(sum)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeSummary?.id === sum.id
                    ? "bg-teal-50/80 border-teal-300 shadow-2xs"
                    : "bg-white border-gray-100 hover:border-teal-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span className="font-semibold text-teal-700 truncate max-w-[150px]">
                    {sum.query}
                  </span>
                  <span>PMID: {sum.pmid || "NCBI"}</span>
                </div>
                <h5 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">
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
