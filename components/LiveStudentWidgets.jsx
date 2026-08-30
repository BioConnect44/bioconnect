"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { recordUserAction } from "@/lib/gamificationEngine";

// ─── Supabase hook ────────────────────────────────────────────────
function useSupabase() {
  return createClient();
}

// ─── Global Quest Completion Helper ───────────────────────────────
export function markQuestCompleted(questKey) {
  if (typeof window !== "undefined") {
    const today = new Date().toISOString().split("T")[0];
    const storageKey = `bioconnect_quests_${today}`;
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || "{}");
      existing[questKey] = true;
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("bioconnect_quest_completed", { detail: { questKey } }));
  }
}

// ─── STREAK WIDGET ────────────────────────────────────────────────
function SmartStudyStreak({ userId }) {
  const supabase = useSupabase();
  const [streakCount, setStreakCount] = useState(0);
  const [activeDays, setActiveDays] = useState([]); // array of day indices (0=Mon..6=Sun) active this week
  const [loading, setLoading] = useState(true);

  const todayIndex = (() => {
    const d = new Date().getDay(); // 0=Sun
    return d === 0 ? 6 : d - 1;   // convert to Mon-first
  })();

  const updateStreak = useCallback(async () => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];

    // Upsert today's activity
    await supabase.from("user_activity_log").upsert(
      { user_id: userId, active_date: today },
      { onConflict: "user_id,active_date" }
    );

    // Fetch last 7 days of activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const from = sevenDaysAgo.toISOString().split("T")[0];

    const { data: logs } = await supabase
      .from("user_activity_log")
      .select("active_date")
      .eq("user_id", userId)
      .gte("active_date", from)
      .order("active_date", { ascending: true });

    // Map dates to Mon-first day indices for this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - todayIndex);
    const active = (logs || []).map(log => {
      const d = new Date(log.active_date + "T00:00:00");
      const diff = Math.round((d - weekStart) / (1000 * 60 * 60 * 24));
      return diff;
    }).filter(d => d >= 0 && d <= 6);
    setActiveDays(active);

    // Fetch or recalculate streak
    const { data: streakData } = await supabase
      .from("user_streaks")
      .select("streak_count, last_active")
      .eq("user_id", userId)
      .single();

    if (streakData) {
      const lastActive = new Date(streakData.last_active + "T00:00:00");
      const todayDate = new Date(today + "T00:00:00");
      const diff = Math.round((todayDate - lastActive) / (1000 * 60 * 60 * 24));

      let newStreak = streakData.streak_count;
      if (diff === 0) {
        newStreak = streakData.streak_count;
      } else if (diff === 1) {
        newStreak = streakData.streak_count + 1;
        await supabase.from("user_streaks").update({ streak_count: newStreak, last_active: today }).eq("user_id", userId);
      } else {
        newStreak = 1;
        await supabase.from("user_streaks").update({ streak_count: 1, last_active: today }).eq("user_id", userId);
      }
      setStreakCount(newStreak);
      if (userId) recordUserAction(userId, "DAILY_STREAK", { days: newStreak }, supabase);
    } else {
      await supabase.from("user_streaks").insert({ user_id: userId, streak_count: 1, last_active: today });
      setStreakCount(1);
      if (userId) recordUserAction(userId, "DAILY_STREAK", { days: 1 }, supabase);
    }
    setLoading(false);
  }, [userId, supabase, todayIndex]);

  useEffect(() => { updateStreak(); }, [updateStreak]);

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div style={W.card}>
      <style>{`
        @keyframes pulseOrange { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.15)} }
        .streak-pulse { animation: pulseOrange 1.8s ease-in-out infinite; }
      `}</style>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#9CA3AF", fontSize: 13 }}>Loading streak...</div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 36, cursor: "pointer" }} className="streak-pulse">🔥</span>
            <span style={{ fontSize: 48, fontWeight: 800, color: "#F97316", lineHeight: 1 }}>{streakCount}</span>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#102A30", marginTop: 4 }}>Day Study Streak!</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingTop: 4 }}>
            {weekDays.map((letter, i) => {
              const isPast = activeDays.includes(i) && i < todayIndex;
              const isToday = i === todayIndex;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: isPast ? "#F97316" : isToday ? "#fff" : "#F1F5F9",
                    border: isToday ? "2px solid #F97316" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s",
                  }}>
                    {isPast && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {isToday && (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F97316", animation: "pulseOrange 1.8s infinite" }} />
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isPast || isToday ? "#102A30" : "#94A3B8" }}>{letter}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── BIO-MINUTE FLIP CARD ─────────────────────────────────────────
function AutoBioMinute({ userId }) {
  const supabase = useSupabase();
  const [card, setCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCard() {
      const today = new Date().toISOString().split("T")[0];

      const { data } = await supabase
        .from("biominute_questions")
        .select("*")
        .eq("active_date", today)
        .single();

      if (data) {
        setCard(data);
      } else {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));

        const { data: all } = await supabase
          .from("biominute_questions")
          .select("*")
          .order("id", { ascending: true });

        if (all && all.length > 0) {
          setCard(all[dayOfYear % all.length]);
        }
      }
      setLoading(false);
    }
    fetchCard();
  }, [supabase]);

  // Mark Bio-Minute quest as completed when user flips
  async function handleFlip() {
    setIsFlipped(true);
    markQuestCompleted("biominute");
    if (userId) {
      const today = new Date().toISOString().split("T")[0];
      await supabase.from("user_quests").upsert(
        { user_id: userId, quest_date: today, quest_key: "biominute", completed: true },
        { onConflict: "user_id,quest_date,quest_key" }
      );
    }
  }

  if (loading) return <div style={{ ...W.card, justifyContent: "center", alignItems: "center", minHeight: 200, color: "#9CA3AF", fontSize: 13 }}>Loading today's question...</div>;

  if (!card) return (
    <div style={{ ...W.card, background: "#3AA8C1", minHeight: 200, justifyContent: "center", alignItems: "center" }}>
      <p style={{ color: "white", fontSize: 13, textAlign: "center" }}>No question for today yet. Check back soon!</p>
    </div>
  );

  const currentHeight = isFlipped ? 390 : 240;

  return (
    <div style={{ width: "100%", perspective: 1000 }}>
      <style>{`
        .bio-flip-inner { position:relative; width:100%; transition:transform 0.55s cubic-bezier(0.4,0,0.2,1), height 0.4s ease-in-out, min-height 0.4s ease-in-out; transform-style:preserve-3d; }
        .bio-flip-inner.flipped { transform:rotateY(180deg); }
        .bio-face { position:absolute; width:100%; height:100%; top:0; left:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; border-radius:20px; padding:24px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between; }
        .bio-back { transform:rotateY(180deg); }
        .bio-btn { width:100%; padding:12px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; margin-top:12px; transition:all 0.2s; }
        .bio-btn:hover { opacity:0.88; transform:translateY(-1px); }
      `}</style>
      <div
        className={`bio-flip-inner${isFlipped ? " flipped" : ""}`}
        style={{ height: `${currentHeight}px`, minHeight: `${currentHeight}px` }}
      >
        {/* FRONT */}
        <div className="bio-face" style={{ background: "#3AA8C1" }}>
          <div>
            <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 999, display: "inline-block", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.1em", width: "fit-content" }}>
              ⏱️ Daily Bio-Minute · {card.tag}
            </span>
            <p style={{ color: "white", fontSize: 16, fontWeight: 600, lineHeight: 1.55 }}>{card.question}</p>
          </div>
          <button className="bio-btn" onClick={handleFlip} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.5)" }}>
            Tap to flip ↺
          </button>
        </div>

        {/* BACK */}
        <div className="bio-face bio-back" style={{ background: "#fff", border: "2px solid #3AA8C1" }}>
          <div>
            <span style={{ background: "#E0F2FE", color: "#3AA8C1", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 999, display: "inline-block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em", width: "fit-content" }}>
              Answer
            </span>
            <h3 style={{ color: "#3AA8C1", fontSize: 19, fontWeight: 800, marginBottom: 10, lineHeight: 1.35 }}>{card.answer}</h3>
            <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.65 }}>{card.explanation}</p>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="bio-btn" onClick={() => setIsFlipped(false)} style={{ flex: 1, background: "#fff", color: "#102A30", border: "1.5px solid #E2EEF0" }}>
              Need review
            </button>
            <button className="bio-btn" onClick={() => setIsFlipped(false)} style={{ flex: 1, background: "#3AA8C1", color: "white", border: "none" }}>
              I knew it ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QUEST TRACKER ────────────────────────────────────────────────
function InteractiveQuests({ userId }) {
  const supabase = useSupabase();
  const [quests, setQuests] = useState([
    { key: "biominute", text: "Complete Daily Bio-Minute", xp: 50, completed: false },
    { key: "read_pages", text: "Read 4 pages", xp: 40, completed: false },
    { key: "pyq_challenge", text: "Complete 1 PYQ Challenge", xp: 20, completed: false },
  ]);
  const [loading, setLoading] = useState(true);

  // Load today's quest completion state from Supabase & LocalStorage
  const loadQuests = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0];
    const storageKey = `bioconnect_quests_${today}`;
    let localSaved = {};
    try {
      localSaved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (e) {}

    let dbData = [];
    if (userId) {
      const { data } = await supabase
        .from("user_quests")
        .select("quest_key, completed")
        .eq("user_id", userId)
        .eq("quest_date", today);
      if (data) dbData = data;
    }

    setQuests(prev => prev.map(q => {
      const dbMatch = dbData.find(d => d.quest_key === q.key);
      const isCompleted = (dbMatch && dbMatch.completed) || !!localSaved[q.key];
      return { ...q, completed: isCompleted };
    }));
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    loadQuests();

    function handleQuestEvent(e) {
      const key = e.detail?.questKey;
      if (key) {
        setQuests(prev => prev.map(q => q.key === key ? { ...q, completed: true } : q));
        if (userId) {
          const today = new Date().toISOString().split("T")[0];
          supabase.from("user_quests").upsert(
            { user_id: userId, quest_date: today, quest_key: key, completed: true },
            { onConflict: "user_id,quest_date,quest_key" }
          );
        }
      }
    }

    window.addEventListener("bioconnect_quest_completed", handleQuestEvent);
    return () => window.removeEventListener("bioconnect_quest_completed", handleQuestEvent);
  }, [userId, supabase, loadQuests]);

  async function toggleQuest(key) {
    const today = new Date().toISOString().split("T")[0];
    const quest = quests.find(q => q.key === key);
    const newCompleted = !quest.completed;

    // Optimistic update
    setQuests(prev => prev.map(q => q.key === key ? { ...q, completed: newCompleted } : q));

    // Save to LocalStorage
    try {
      const storageKey = `bioconnect_quests_${today}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || "{}");
      existing[key] = newCompleted;
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (e) {}

    // Persist to Supabase if logged in
    if (userId) {
      await supabase.from("user_quests").upsert(
        { user_id: userId, quest_date: today, quest_key: key, completed: newCompleted },
        { onConflict: "user_id,quest_date,quest_key" }
      );
    }
  }

  const completedCount = quests.filter(q => q.completed).length;
  const progress = (completedCount / quests.length) * 100;

  return (
    <div style={W.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 20 }}>🎯</span>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#102A30" }}>Today's Quests</h2>
      </div>

      {loading ? (
        <div style={{ color: "#9CA3AF", fontSize: 13, padding: "12px 0" }}>Loading quests...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
          {quests.map(quest => (
            <div key={quest.key} onClick={() => toggleQuest(quest.key)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "2px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, border: `2px solid ${quest.completed ? "#3AA8C1" : "#CBD5E1"}`,
                  background: quest.completed ? "#3AA8C1" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0,
                }}>
                  {quest.completed && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: quest.completed ? "#94A3B8" : "#102A30", textDecoration: quest.completed ? "line-through" : "none", transition: "all 0.2s" }}>
                  {quest.text}
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: quest.completed ? "#F1F5F9" : "#FEF3C7", color: quest.completed ? "#94A3B8" : "#F97316", transition: "all 0.2s" }}>
                +{quest.xp} XP
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div style={{ width: "100%", marginTop: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B" }}>{completedCount}/{quests.length} Quests Completed</span>
        <div style={{ width: "100%", height: 7, background: "#F1F5F9", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#3AA8C1", borderRadius: 999, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────
export default function LiveStudentWidgets() {
  const supabase = useSupabase();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, [supabase]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SmartStudyStreak userId={userId} />
      <AutoBioMinute userId={userId} />
      <InteractiveQuests userId={userId} />
    </div>
  );
}

// ─── Shared card style ────────────────────────────────────────────
const W = {
  card: {
    width: "100%",
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #E2EEF0",
    padding: "22px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
};