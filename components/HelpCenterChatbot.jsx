"use client";

import { useState, useRef, useEffect } from "react";

export default function HelpCenterChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I am your **BioConnect AI Chatbot**. Ask me anything about searching PubMed AI summaries, reading literature, watching BioMinutes, applying for biotech jobs, or managing your profile!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
  }, [messages, isOpen, loading]);

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "";
      };
    }
  }, [isOpen]);

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
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith("### ")) {
            return (
              <h4 key={idx} style={{ fontSize: "14.5px", fontWeight: 700, color: "#00C2B2", margin: "8px 0 4px", borderBottom: "1px solid #F0F7F8", paddingBottom: "4px" }}>
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
              <div key={idx} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
                <span style={{ color: "#00C2B2", fontWeight: 700, fontSize: "14px" }}>•</span>
                <span>{parsed}</span>
              </div>
            );
          }

          return (
            <p key={idx} style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6", margin: 0 }}>
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
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "stretch",
        animation: "fadeIn 0.25s ease-out"
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .chip-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .chip-btn:hover {
          background: #00C2B2 !important;
          color: #FFFFFF !important;
          border-color: #00C2B2 !important;
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(0,194,178,0.25);
        }
        .chips-scroll-container::-webkit-scrollbar {
          height: 4px;
        }
        .chips-scroll-container::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 4px;
        }
        .chips-scroll-container::-webkit-scrollbar-thumb {
          background: #00C2B2;
          border-radius: 4px;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.25)",
          fontFamily: "'Poppins', sans-serif",
          animation: "slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            background: "#0C2127",
            color: "#FFFFFF",
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(0,194,178,0.15)",
                border: "1px solid rgba(0,194,178,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                boxShadow: "0 4px 14px rgba(0,194,178,0.15)"
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <h3 style={{ fontSize: "14.5px", fontWeight: 700, margin: 0, color: "#00C2B2", letterSpacing: "-0.2px" }}>
                  AI Chatbot
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#22C55E",
                    display: "inline-block",
                    boxShadow: "0 0 8px #22C55E"
                  }}
                />
                <span style={{ fontSize: "11px", color: "#7E99A2", fontWeight: 500 }}>24/7 AI Support</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#E2E8F0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: "12.5px",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,91,91,0.2)";
              e.currentTarget.style.color = "#FF5B5B";
              e.currentTarget.style.borderColor = "rgba(255,91,91,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#E2E8F0";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
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
            overscrollBehavior: "contain",
            padding: "24px 20px",
            background: "#F8FAFC",
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-start"
              }}
            >
              {/* Avatar Icon */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: msg.sender === "user" ? "#00C2B2" : "#0C2127",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                {msg.sender === "user" ? "👤" : "🤖"}
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  maxWidth: "82%",
                  background: msg.sender === "user" ? "#00C2B2" : "#FFFFFF",
                  color: msg.sender === "user" ? "#FFFFFF" : "#102A30",
                  borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "14px 18px",
                  fontSize: "13px",
                  lineHeight: "1.65",
                  border: msg.sender === "user" ? "none" : "1px solid #E2EEF0",
                  boxShadow: msg.sender === "user" ? "0 6px 18px rgba(0,194,178,0.22)" : "0 3px 12px rgba(0,0,0,0.04)"
                }}
              >
                {msg.sender === "user" ? (
                  <span style={{ fontWeight: 500 }}>{msg.text}</span>
                ) : (
                  renderFormattedText(msg.text)
                )}
              </div>
            </div>
          ))}

          {/* Animated Typing Indicator */}
          {loading && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#0C2127",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  flexShrink: 0
                }}
              >
                🤖
              </div>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid #E2EEF0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
              >
                <span style={{ fontSize: "12px", color: "#7E99A2", fontWeight: 600, marginRight: "4px" }}>
                  Searching knowledge base
                </span>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C2B2", animation: "pulseDot 1s infinite 0.1s" }} />
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C2B2", animation: "pulseDot 1s infinite 0.3s" }} />
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C2B2", animation: "pulseDot 1s infinite 0.5s" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div
          onWheel={(e) => {
            if (e.deltaY) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          className="chips-scroll-container"
          style={{
            padding: "10px 16px 14px",
            background: "#FFFFFF",
            borderTop: "1px solid #E2EEF0",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            overscrollBehavior: "contain",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {SUGGESTIONS.map((chip, cIdx) => (
            <button
              key={cIdx}
              className="chip-btn"
              onClick={() => handleSend(chip)}
              style={{
                background: "#F0F7F8",
                color: "#163A43",
                border: "1px solid #CCFBF1",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit"
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Footer Area */}
        <div
          style={{
            padding: "18px 20px",
            background: "#FFFFFF",
            borderTop: "1px solid #E2EEF0"
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <input
              type="text"
              value={input}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Chatbot a question..."
              style={{
                flex: 1,
                border: isFocused ? "1.5px solid #00C2B2" : "1.5px solid #E2EEF0",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "13.5px",
                outline: "none",
                fontFamily: "inherit",
                color: "#102A30",
                background: isFocused ? "#FFFFFF" : "#F8FAFC",
                boxShadow: isFocused ? "0 0 0 3px rgba(0,194,178,0.15)" : "none",
                transition: "all 0.2s ease"
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "#00C2B2",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                padding: "12px 20px",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: loading || !input.trim() ? "none" : "0 4px 14px rgba(0,194,178,0.3)",
                transition: "all 0.2s ease"
              }}
            >
              <span>Send</span>
              <span style={{ fontSize: "14px" }}>↗</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
