"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOtpPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  function handleChange(idx, value) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(idx, e) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < 6) {
      setError("Please enter the complete 6-digit OTP code");
      return;
    }

    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token,
      type: "email",
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  }

  async function handleResend() {
    if (timer > 0 || !email) return;
    setError("");
    const { error: err } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
    });
    if (err) {
      setError(err.message);
    } else {
      setTimer(60);
    }
  }

  return (
    <main className="auth-page-main">
      <div className="auth-card">
        {/* Left — image */}
        <div className="auth-img-panel">
          <div style={S.imgOverlay}></div>
          <img
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80"
            alt="Device Authentication Security"
            style={S.img}
          />
        </div>

        {/* Right — form */}
        <div className="auth-form-panel">
          <Link href="/" style={S.brand}>
            BioConnect
          </Link>

          {success ? (
            <div style={{ textAlign: "center", width: "100%", padding: "12px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(20,184,166,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2.2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={S.h1}>Verification Successful!</h2>
              <p style={{ ...S.sub, marginBottom: "20px" }}>
                Device authenticated. Redirecting to platform dashboard...
              </p>
            </div>
          ) : (
            <>
              <h1 style={S.h1}>Security OTP Verification</h1>
              <p style={S.sub}>Enter the 6-digit code sent to your registered email address.</p>

              {error && <div style={S.err}>{error}</div>}

              <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Confirm Email Address"
                  required
                  style={S.input}
                />

                {/* 6 Digit OTP Input Grid */}
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "8px 0" }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      style={{
                        width: "44px",
                        height: "50px",
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: 700,
                        border: "1.5px solid #E2EEF0",
                        borderRadius: "10px",
                        color: "#1B2B3A",
                        outline: "none",
                        background: "#fff",
                      }}
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading || otp.join("").length < 6} style={{ ...S.btn, opacity: loading || otp.join("").length < 6 ? 0.7 : 1 }}>
                  {loading ? "Verifying..." : "Verify & Continue →"}
                </button>
              </form>

              <div style={{ marginTop: "20px", textAlign: "center", width: "100%" }}>
                <p style={{ fontSize: "13px", color: "#6B8A9A" }}>
                  Didn&apos;t receive code?{" "}
                  {timer > 0 ? (
                    <span style={{ color: "#9CA3AF", fontWeight: 600 }}>Resend in {timer}s</span>
                  ) : (
                    <button onClick={handleResend} style={{ background: "none", border: "none", color: "#0D9488", fontWeight: 600, cursor: "pointer" }}>
                      Resend Code
                    </button>
                  )}
                </p>
                <div style={{ marginTop: "12px" }}>
                  <Link href="/login" style={{ fontSize: "14px", color: "#0D9488", fontWeight: 600, textDecoration: "none" }}>
                    ← Back to Log In
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

const S = {
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background: "gradient(to bottom, rgba(13,45,53,0.3), rgba(13,45,53,0.7))",
    zIndex: 1,
  },
  brand: {
    color: "#0D9488",
    fontWeight: 900,
    fontSize: "24px",
    letterSpacing: "-0.5px",
    marginBottom: "20px",
    display: "block",
    textDecoration: "none",
  },
  h1: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1B2B3A",
    marginBottom: "6px",
  },
  sub: { fontSize: "13.5px", color: "#6B8A9A", marginBottom: "20px", lineHeight: "1.5" },
  input: {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid #E2EEF0",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    color: "#1B2B3A",
    background: "#fff",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "#132D35",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  err: {
    width: "100%",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#DC2626",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "8px",
  },
};
