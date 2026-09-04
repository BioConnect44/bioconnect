"use client";

import { useState } from "react";
import extraBooksData from "@/data/extra_books.json";

function ExtraBookViewerModal({ book, onClose }) {
  if (!book) return null;
  const isPdf = book.format === "PDF";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10, 25, 30, 0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "95%", maxWidth: "1150px", height: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ padding: "16px 24px", background: "#102A30", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>📚</span>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#fff" }}>{book.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: 0 }}>{book.category} • {book.file_size || book.size} ({book.format})</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href={book.file_path || book.url}
              download
              style={{ background: "#3AA8C1", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}
            >
              ⬇️ Download File
            </a>
            <button
              onClick={onClose}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ flex: 1, background: "#525659" }}>
          {isPdf ? (
            <iframe
              src={book.file_path || book.url}
              style={{ width: "100%", height: "100%", border: "none" }}
              title={book.title}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#fff", textAlign: "center", padding: "40px" }}>
              <span style={{ fontSize: "48px", marginBottom: "16px" }}>📄</span>
              <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>{book.format} Document Viewer</h3>
              <p style={{ fontSize: "14px", color: "#CBD5E1", maxWidth: "500px", marginBottom: "24px" }}>
                This reference book is stored in <strong>{book.format}</strong> format ({book.file_size || book.size}). Click below to download and open in your preferred document reader.
              </p>
              <a
                href={book.file_path || book.url}
                download
                style={{ background: "#3AA8C1", color: "#fff", padding: "12px 28px", borderRadius: "10px", textDecoration: "none", fontSize: "15px", fontWeight: 700 }}
              >
                ⬇️ Download {book.filename || book.title}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExtraBooksSection({ customBooks }) {
  const books = customBooks || extraBooksData || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeViewerBook, setActiveViewerBook] = useState(null);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(books.map(b => b.category).filter(Boolean)))];

  const filteredBooks = books.filter(b => {
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.format && b.format.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <section style={{ marginTop: "36px", marginBottom: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#102A30", margin: 0 }}>
            Extra Books 📚
          </h2>
          <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px", margin: 0 }}>
            Supplementary reading materials, reference guides, and manuals.
          </p>
        </div>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#3AA8C1", background: "#E0F2FE", padding: "5px 14px", borderRadius: "100px" }}>
          {books.length} Books Available
        </span>
      </div>

      {/* Category Pills & Search */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: isActive ? "#102A30" : "#F1F5F9",
                  color: isActive ? "#ffffff" : "#475569",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search extra books by title, author, format, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 18px",
            borderRadius: "12px",
            border: "1.5px solid #E2EEF0",
            fontSize: "14px",
            outline: "none",
            background: "#fff",
            color: "#102A30",
            fontFamily: "inherit",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
          }}
        />
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", textAlign: "center", border: "1px solid #E2EEF0", color: "#64748B" }}>
          <p style={{ fontSize: "15px", fontWeight: 600, margin: 0 }}>No matching books found</p>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {filteredBooks.map((book) => {
            const isPdf = book.format === "PDF";
            const badgeBg = isPdf ? "#DCFCE7" : book.format === "DJVU" ? "#F3E8FF" : "#E0F2FE";
            const badgeColor = isPdf ? "#166534" : book.format === "DJVU" ? "#6B21A8" : "#0369A1";

            return (
              <div
                key={book.id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #E2EEF0",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ fontSize: "28px" }}>📖</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, background: badgeBg, color: badgeColor, padding: "3px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
                        {book.format}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: 700, background: "#F1F5F9", color: "#475569", padding: "3px 8px", borderRadius: "6px" }}>
                        {book.file_size || book.size}
                      </span>
                    </div>
                  </div>

                  <h3
                    title={book.title}
                    style={{
                      fontSize: "14px",
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
                    {book.category} • <span style={{ fontStyle: "italic" }}>{book.author || "Reference"}</span>
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                  <button
                    onClick={() => setActiveViewerBook(book)}
                    style={{
                      flex: 1,
                      background: "#102A30",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
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
                    href={book.file_path || book.url}
                    download
                    style={{
                      background: "#F0F9FF",
                      color: "#3AA8C1",
                      border: "1px solid #BAE6FD",
                      padding: "8px 12px",
                      borderRadius: "8px",
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
