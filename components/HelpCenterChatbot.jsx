"use client";

import { useState, useRef, useEffect } from "react";

export default function HelpCenterChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I am your **BioConnect AI Help Center Assistant**. Ask me anything about using PubMed AI summaries, reading papers, watching BioMinutes, applying for jobs, or managing your profile!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const SUGGESTIONS = [
    "🔬 How to use PubMed AI?",
    "📄 Reading papers & PDFs",
    "💼 How to apply for jobs?",
    "🎓 Learning courses & certs",
    "👤 Editing my profile"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  async function handleSend(queryText) {
    const q = queryText || input;
    if (!q || !q.trim()) return;

    const userMsg = { sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/help-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      const answer = data?.answer || `Regarding "${q}": BioConnect provides PubMed AI research summaries, 60-second BioMinutes, biotech jobs, and learning modules. Visit our Help Center or email support@bioconnect.ai.`;

      setMessages((prev) => [...prev, { sender: "ai", text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Support Response: BioConnect Help Center is here to assist! For "${q}", you can navigate to the respective page from your sidebar or landing menu.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function renderFormattedText(rawText) {
    if (!rawText) return null;

    const lines = rawText.split("\n").filter((l) => l.trim().length > 0);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith("### ")) {
            return (
              <h4 key={idx} style={{ fontSize: "14px", fontWeight: 700, color: "#00C2B2", margin: "6px 0 2px" }}>
                {trimmed.replace("### ", "")}
              </h4>
            );
          }

          let textContent = trimmed;
          let isBullet = false;

          if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
            textContent = trimmed.replace(/^(- |• )/, "");
            isBullet = true;
          }

          // Parse **bold** tags
          const boldParts = textContent.split(/(\*\*[^*]+\*\*)/g);
          const parsed = boldParts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} style={{ fontWeight: 700, color: "#102A30" }}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} style={{ display: "flex", gap: "6px", fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>
                <span style={{ color: "#00C2B2", fontWeight: 700 }}>•</span>
                <span>{parsed}</span>
              </div>
            );
          }

          return (
            <p key={idx} style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5", margin: 0 }}>
              {parsed}
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(12, 33, 39, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "stretch"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.2)",
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {/* Top Drawer Header */}
        <div
          style={{
            background: "#0C2127",
            color: "#FFFFFF",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🤖</span>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#00C2B2" }}>
                BioConnect Help Center AI
              </h3>
              <span style={{ fontSize: "11px", color: "#7E99A2" }}>24/7 Platform Support & Guidance</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Chat Messages Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            background: "#F8FAFC",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div
                style={{
                  maxWidth: "88%",
                  background: msg.sender === "user" ? "#00C2B2" : "#FFFFFF",
                  color: msg.sender === "user" ? "#FFFFFF" : "#102A30",
                  borderRadius: msg.sender === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  border: msg.sender === "user" ? "none" : "1px solid #E2EEF0",
                  boxShadow: msg.sender === "user" ? "0 4px 12px rgba(0,194,178,0.2)" : "0 2px 8px rgba(0,0,0,0.03)"
                }}
              >
                {msg.sender === "user" ? <span>{msg.text}</span> : renderFormattedText(msg.text)}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "14px 14px 14px 2px",
                  padding: "10px 16px",
                  fontSize: "12.5px",
                  color: "#7E99A2",
                  border: "1px solid #E2EEF0"
                }}
              >
                ⚡ BioConnect Help AI is searching knowledge base...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div
          style={{
            padding: "10px 16px",
            background: "#FFFFFF",
            borderTop: "1px solid #E2EEF0",
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            scrollbarWidth: "none"
          }}
        >
          {SUGGESTIONS.map((chip, cIdx) => (
            <button
              key={cIdx}
              onClick={() => handleSend(chip)}
              style={{
                background: "#F0F7F8",
                color: "#163A43",
                border: "1px solid #CCFBF1",
                borderRadius: "20px",
                padding: "5px 12px",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div
          style={{
            padding: "16px",
            background: "#FFFFFF",
            borderTop: "1px solid #E2EEF0"
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: "flex", gap: "8px" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Help Center AI a question..."
              style={{
                flex: 1,
                border: "1.5px solid #E2EEF0",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "#00C2B2",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1
              }}
            >
              Send ↗
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
