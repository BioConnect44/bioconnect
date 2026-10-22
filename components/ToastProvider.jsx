"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "380px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => {
          const bgColors = {
            success: "#065F46",
            error: "#991B1B",
            warning: "#92400E",
            info: "#0F766E",
          };
          const icons = {
            success: "✓",
            error: "✕",
            warning: "!",
            info: "ℹ",
          };
          return (
            <div
              key={t.id}
              role="alert"
              style={{
                pointerEvents: "auto",
                background: bgColors[t.type] || bgColors.info,
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                fontSize: "0.9rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                animation: "slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {icons[t.type] || "•"}
              </span>
              <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0 4px",
                }}
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: (m) => console.log("[Toast success]", m),
      error: (m) => console.error("[Toast error]", m),
      info: (m) => console.info("[Toast info]", m),
      warning: (m) => console.warn("[Toast warning]", m),
    };
  }
  return context;
}
