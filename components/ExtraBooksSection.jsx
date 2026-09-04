"use client";

import { useState } from "react";
import extraBooksData from "@/data/extra_books.json";

function ExtraBookViewerModal({ book, onClose }) {
  if (!book) return null;

  const rawPath = book.file_path || book.url || "";
  const encodedPath = encodeURI(rawPath);
  const ext = (book.format || "").toUpperCase();
  const isPdf = ext === "PDF" || rawPath.toLowerCase().endsWith(".pdf");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10, 25, 30, 0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "96%", maxWidth: "1250px", height: "92vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.35)" }}>
        {/* Modal Header */}
        <div style={{ padding: "16px 24px", background: "#102A30", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: "26px", flexShrink: 0 }}>📚</span>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: "2px 0 0" }}>{book.category} • {book.file_size || book.size} ({book.format}) • {book.author || "Reference"}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <a
              href={encodedPath}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "8px 14px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <span>↗ Open in Tab</span>
            </a>
            <a
              href={encodedPath}
              download
              style={{ background: "#3AA8C1", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <span>⬇️ Download</span>
            </a>
            <button
              onClick={onClose}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div style={{ flex: 1, background: "#525659", position: "relative" }}>
          {isPdf ? (
            <object
              data={encodedPath}
              type="application/pdf"
              style={{ width: "100%", height: "100%", border: "none" }}
            >
              <iframe
                src={encodedPath}
                style={{ width: "100%", height: "100%", border: "none" }}
                title={book.title}
              />
            </object>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#fff", textAlign: "center", padding: "40px", background: "linear-gradient(135deg, #102A30 0%, #1B4A5A 100%)" }}>
              <div style={{ width: 80, height: 80, borderRadius: "20px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", marginBottom: "20px" }}>
                📖
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px", maxWidth: "700px" }}>{book.title}</h3>
              <p style={{ fontSize: "14px", color: "#CBD5E1", maxWidth: "560px", marginBottom: "28px", lineHeight: "1.6" }}>
                This educational reference file is stored in <strong>{book.format}</strong> format ({book.file_size || book.size}). Browsers require an external reader app or plugin for {book.format} documents. Click below to view directly or download.
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
                <a
                  href={encodedPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "#ffffff", color: "#102A30", padding: "12px 26px", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
                >
                  ↗ Open File in Browser
                </a>
                <a
                  href={encodedPath}
                  download
                  style={{ background: "#3AA8C1", color: "#fff", padding: "12px 26px", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
                >
                  ⬇️ Download {book.format} File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExtraBooksSection({ customBooks }) {
  const books = customBooks || extraBooksData || [];
  const [selectedFolder, setSelectedFolder] = useState(null); // null = Folder directory view
  const [searchQuery, setSearchQuery] = useState("");
  const [activeViewerBook, setActiveViewerBook] = useState(null);

  // Group books into category folders
  const folderMap = {};
  books.forEach((book) => {
    const folderName = book.category || "General Reference";
    if (!folderMap[folderName]) {
      folderMap[folderName] = [];
    }
    folderMap[folderName].push(book);
  });

  const folderNames = Object.keys(folderMap);

  // Filter books inside a folder or across folders if searching
  const filteredBooks = books.filter((b) => {
    const matchesFolder = !selectedFolder || b.category === selectedFolder;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.format && b.format.toLowerCase().includes(q));

    return matchesFolder && matchesSearch;
  });

  return (
    <section style={{ width: "100%", marginTop: "36px", marginBottom: "28px" }}>
      {/* Top Section Header / Breadcrumb */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>📚</span>
            <span
              onClick={() => { setSelectedFolder(null); setSearchQuery(""); }}
              style={{ fontSize: "14px", fontWeight: 600, color: selectedFolder ? "#3AA8C1" : "#102A30", cursor: selectedFolder ? "pointer" : "default" }}
            >
              Extra Books
            </span>
            {selectedFolder && (
              <>
                <span style={{ color: "#94A3B8", fontSize: "14px" }}>/</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#102A30" }}>
                  📁 {selectedFolder}
                </span>
              </>
            )}
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#102A30", margin: "4px 0 0", letterSpacing: "-0.01em" }}>
            {selectedFolder ? `Folder: ${selectedFolder}` : "Extra Books Library 📁"}
          </h2>
          <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px", margin: 0 }}>
            {selectedFolder
              ? `Browsing ${folderMap[selectedFolder]?.length || 0} reference volumes inside ${selectedFolder}`
              : "Browse curriculum reference folders and educational textbook collections."}
          </p>
        </div>

        {selectedFolder && (
          <button
            onClick={() => { setSelectedFolder(null); setSearchQuery(""); }}
            style={{
              background: "#F1F5F9",
              color: "#102A30",
              border: "1px solid #E2EEF0",
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}
          >
            ← Back to All Folders
          </button>
        )}
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder={selectedFolder ? `🔍 Search inside ${selectedFolder}...` : "🔍 Search all extra books by title, author, or keyword..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "13px 20px",
            borderRadius: "14px",
            border: "1.5px solid #E2EEF0",
            fontSize: "14px",
            outline: "none",
            background: "#fff",
            color: "#102A30",
            fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
          }}
        />
      </div>

      {/* VIEW MODE 1: ROOT FOLDER DIRECTORY VIEW (When no folder is opened and no search query active) */}
      {!selectedFolder && !searchQuery ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", width: "100%" }}>
          {folderNames.map((folderName) => {
            const folderBooks = folderMap[folderName];
            const formats = Array.from(new Set(folderBooks.map((b) => b.format))).join(", ");

            return (
              <div
                key={folderName}
                onClick={() => setSelectedFolder(folderName)}
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #F8FAFC 100%)",
                  borderRadius: "20px",
                  border: "1.5px solid #E2EEF0",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Decorative folder glow accent */}
                <div style={{ position: "absolute", top: "-15px", right: "-15px", width: "90px", height: "90px", background: "rgba(58, 168, 193, 0.08)", borderRadius: "50%", pointerEvents: "none" }} />

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ background: "#E0F2FE", color: "#0369A1", width: "54px", height: "54px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                      📁
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 800, background: "#102A30", color: "#ffffff", padding: "5px 12px", borderRadius: "100px" }}>
                      {folderBooks.length} Books
                    </span>
                  </div>

                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#102A30", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                    {folderName}
                  </h3>

                  <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px", lineHeight: "1.45" }}>
                    Contains {folderBooks.length} educational textbooks, reference manuals, and laboratory protocols.
                  </p>
                </div>

                <div style={{ paddingTop: "14px", borderTop: "1px solid #E2EEF0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#3AA8C1", background: "#F0F9FF", padding: "4px 10px", borderRadius: "6px" }}>
                    Formats: {formats}
                  </span>

                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#102A30", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Open Folder 📂 →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: INSIDE A FOLDER OR SEARCH RESULTS */
        <>
          {filteredBooks.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", textAlign: "center", border: "1px solid #E2EEF0", color: "#64748B" }}>
              <p style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#102A30" }}>No matching books found</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>Try adjusting your search query or return to all folders.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "18px", width: "100%" }}>
              {filteredBooks.map((book) => {
                const ext = (book.format || "").toUpperCase();
                const isPdf = ext === "PDF";
                const badgeBg = isPdf ? "#DCFCE7" : ext === "DJVU" ? "#F3E8FF" : "#E0F2FE";
                const badgeColor = isPdf ? "#166534" : ext === "DJVU" ? "#6B21A8" : "#0369A1";

                return (
                  <div
                    key={book.id}
                    style={{
                      background: "#fff",
                      borderRadius: "18px",
                      border: "1px solid #E2EEF0",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.25s ease",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                        <span style={{ fontSize: "30px" }}>📖</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 800, background: badgeBg, color: badgeColor, padding: "3px 9px", borderRadius: "6px", textTransform: "uppercase" }}>
                            {book.format}
                          </span>
                          <span style={{ fontSize: "10px", fontWeight: 700, background: "#F1F5F9", color: "#475569", padding: "3px 9px", borderRadius: "6px" }}>
                            {book.file_size || book.size}
                          </span>
                        </div>
                      </div>

                      <h3
                        title={book.title}
                        style={{
                          fontSize: "14.5px",
                          fontWeight: 700,
                          color: "#102A30",
                          marginBottom: "6px",
                          lineHeight: "1.35",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {book.title}
                      </h3>

                      <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "14px", margin: 0 }}>
                        📁 {book.category} • <span style={{ fontStyle: "italic" }}>{book.author || "Reference"}</span>
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #F1F5F9" }}>
                      <button
                        onClick={() => setActiveViewerBook(book)}
                        style={{
                          flex: 1,
                          background: "#102A30",
                          color: "#ffffff",
                          border: "none",
                          padding: "9px 12px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "background 0.2s"
                        }}
                      >
                        Read In-App 📄
                      </button>

                      <a
                        href={encodeURI(book.file_path || book.url)}
                        download
                        style={{
                          background: "#F0F9FF",
                          color: "#3AA8C1",
                          border: "1px solid #BAE6FD",
                          padding: "9px 12px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                          textAlign: "center"
                        }}
                      >
                        Download ⬇️
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* In-App Reader Modal */}
      {activeViewerBook && (
        <ExtraBookViewerModal
          book={activeViewerBook}
          onClose={() => setActiveViewerBook(null)}
        />
      )}
    </section>
  );
}
