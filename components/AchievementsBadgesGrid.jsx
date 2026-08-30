"use client";

import { useEffect, useState } from "react";
import { BADGE_CATALOG } from "@/lib/gamificationEngine";

export default function AchievementsBadgesGrid({ userStats = null, userId = null, supabase = null }) {
  const [stats, setStats] = useState({
    streakDays: 14,
    papersRead: 1,
    quizzesCompleted: 10,
    notesAccessed: 50,
    perfectQuizzes: 0,
    groupStudiesJoined: 0,
    papersSaved: 0,
    coursesCompleted: 0,
    unlockedBadgeIds: ["streak-master", "bio-pioneer", "challenge-champion", "knowledge-seeker"]
  });

  useEffect(() => {
    if (userStats) {
      setStats(prev => ({
        ...prev,
        ...userStats,
        streakDays: userStats.streak_days ?? userStats.streakDays ?? userStats.streak ?? 14,
        papersRead: userStats.papers_read ?? userStats.papersRead ?? userStats.papersReadCount ?? 1,
        quizzesCompleted: userStats.quizzes_completed ?? userStats.quizzesCompleted ?? 10,
        notesAccessed: userStats.notes_accessed ?? userStats.notesAccessed ?? userStats.notesAccessedCount ?? 50,
        perfectQuizzes: userStats.perfect_quizzes ?? userStats.perfectQuizzes ?? 0,
        groupStudiesJoined: userStats.group_studies_joined ?? userStats.groupStudiesJoined ?? 0,
        papersSaved: userStats.papers_saved ?? userStats.papersSaved ?? 0,
        coursesCompleted: userStats.courses_completed ?? userStats.coursesCompleted ?? 0,
        unlockedBadgeIds: userStats.unlocked_badge_ids ?? userStats.unlockedBadgeIds ?? ["streak-master", "bio-pioneer", "challenge-champion", "knowledge-seeker"]
      }));
    } else if (userId && supabase) {
      async function loadDbStats() {
        try {
          const { data } = await supabase
            .from("user_gamification")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (data) {
            setStats({
              streakDays: data.streak_days ?? 14,
              papersRead: data.papers_read ?? 1,
              quizzesCompleted: data.quizzes_completed ?? 10,
              notesAccessed: data.notes_accessed ?? 50,
              perfectQuizzes: data.perfect_quizzes ?? 0,
              groupStudiesJoined: data.group_studies_joined ?? 0,
              papersSaved: data.papers_saved ?? 0,
              coursesCompleted: data.courses_completed ?? 0,
              unlockedBadgeIds: data.unlocked_badge_ids || ["streak-master", "bio-pioneer", "challenge-champion", "knowledge-seeker"]
            });
          }
        } catch (e) {}
      }
      loadDbStats();
    }
  }, [userStats, userId, supabase]);

  const unlockedSet = new Set(stats.unlockedBadgeIds || []);

  return (
    <div style={{ width: "100%" }}>
      {/* Container Section Title */}
      <h2 className="text-[22px] font-extrabold text-[#102A30] mb-6" style={{ fontSize: "22px", fontWeight: 800, color: "#102A30", marginBottom: "24px" }}>
        Achievements & Earned Badges
      </h2>

      {/* Responsive Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}
      >
        {BADGE_CATALOG.map((badge) => {
          const isEarnedByCheck = badge.isUnlocked(stats);
          const isEarnedByList = unlockedSet.has(badge.id);
          const isEarned = isEarnedByCheck || isEarnedByList;
          const progress = badge.getProgress(stats);

          if (isEarned) {
            return (
              <div
                key={badge.id}
                className={`h-[180px] rounded-[20px] p-6 flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-md ${badge.theme.bg} ${badge.theme.border}`}
                style={{
                  height: "180px",
                  borderRadius: "20px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  background: badge.id === "streak-master" ? "#FFF9F5" : badge.id === "bio-pioneer" ? "#F0FDF4" : badge.id === "challenge-champion" ? "#FAF5FF" : badge.id === "knowledge-seeker" ? "#F0F9FF" : badge.theme.activeBg || "#FFF",
                  border: `1px solid ${badge.id === "streak-master" ? "#FED7AA" : badge.id === "bio-pioneer" ? "#A7F3D0" : badge.id === "challenge-champion" ? "#E9D5FF" : badge.id === "knowledge-seeker" ? "#BAE6FD" : badge.theme.activeBorder || "#E2E8F0"}`
                }}
              >
                {/* 3D Icon */}
                <div style={{ fontSize: "36px", lineHeight: 1 }}>{badge.icon}</div>

                <div>
                  <h3 className="font-bold text-[16px] text-[#102A30]" style={{ fontSize: "16px", fontWeight: 700, color: "#102A30", margin: "0 0 2px" }}>
                    {badge.title}
                  </h3>
                  <p className="text-[12px] font-medium text-[#64748B]" style={{ fontSize: "12px", fontWeight: 500, color: "#64748B", margin: 0 }}>
                    {badge.description}
                  </p>
                </div>

                {/* EARNED ✓ Badge */}
                <span
                  className={`text-[11px] font-black uppercase tracking-wider ${badge.theme.text}`}
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: badge.id === "streak-master" ? "#F97316" : badge.id === "bio-pioneer" ? "#10B981" : badge.id === "challenge-champion" ? "#8B5CF6" : badge.id === "knowledge-seeker" ? "#0284C7" : badge.theme.activeText || "#10B981"
                  }}
                >
                  EARNED ✓
                </span>
              </div>
            );
          }

          {/* Locked Badge State */}
          return (
            <div
              key={badge.id}
              className="h-[180px] rounded-[20px] p-6 flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-md bg-white border border-[#E2E8F0] shadow-sm"
              style={{
                height: "180px",
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justify.content: "space-between",
                textAlign: "center",
                transition: "all 0.3s ease",
                background: "#ffffff",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              {/* Grayscale Icon */}
              <div
                className="grayscale opacity-40"
                style={{
                  fontSize: "36px",
                  lineHeight: 1,
                  filter: "grayscale(100%)",
                  opacity: 0.4
                }}
              >
                {badge.icon}
              </div>

              <div>
                <h3 className="font-bold text-[16px] text-[#94A3B8]" style={{ fontSize: "16px", fontWeight: 700, color: "#94A3B8", margin: "0 0 2px" }}>
                  {badge.title}
                </h3>
                <p className="text-[12px] font-medium text-[#94A3B8]" style={{ fontSize: "12px", fontWeight: 500, color: "#94A3B8", margin: 0 }}>
                  {badge.description}
                </p>
              </div>

              {/* Locked Tracker */}
              <div className="text-[11px] text-slate-400 font-bold" style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>🔒</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
