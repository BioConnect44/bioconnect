export const BADGE_CATALOG = [
  {
    id: "streak-master",
    title: "Streak Master",
    description: "14-day study streak",
    icon: "🔥",
    theme: {
      bg: "bg-[#FFF9F5]",
      border: "border-[#FED7AA]",
      text: "text-[#F97316]",
      activeBg: "#FFF9F5",
      activeBorder: "#FED7AA",
      activeText: "#F97316",
    },
    xpReward: 150,
    isUnlocked: (stats) => (stats.streakDays || stats.streak || 0) >= 14,
    checkUnlock: (stats) => (stats.streakDays || stats.streak || 0) >= 14,
    getProgress: (stats) => ({ current: Math.min(stats.streakDays || stats.streak || 0, 14), total: 14 })
  },
  {
    id: "bio-pioneer",
    title: "Bio Pioneer",
    description: "First PubMed paper read",
    icon: "🧬",
    theme: {
      bg: "bg-[#F0FDF4]",
      border: "border-[#A7F3D0]",
      text: "text-[#10B981]",
      activeBg: "#F0FDF4",
      activeBorder: "#A7F3D0",
      activeText: "#10B981",
    },
    xpReward: 100,
    isUnlocked: (stats) => (stats.papersRead || stats.papersReadCount || 0) >= 1,
    checkUnlock: (stats) => (stats.papersRead || stats.papersReadCount || 0) >= 1,
    getProgress: (stats) => ({ current: Math.min(stats.papersRead || stats.papersReadCount || 0, 1), total: 1 })
  },
  {
    id: "challenge-champion",
    title: "Challenge Champion",
    description: "10 PYQ quizzes done",
    icon: "🎯",
    theme: {
      bg: "bg-[#FAF5FF]",
      border: "border-[#E9D5FF]",
      text: "text-[#8B5CF6]",
      activeBg: "#FAF5FF",
      activeBorder: "#E9D5FF",
      activeText: "#8B5CF6",
    },
    xpReward: 200,
    isUnlocked: (stats) => (stats.quizzesCompleted || 0) >= 10,
    checkUnlock: (stats) => (stats.quizzesCompleted || 0) >= 10,
    getProgress: (stats) => ({ current: Math.min(stats.quizzesCompleted || 0, 10), total: 10 })
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    description: "50 notes accessed",
    icon: "📚",
    theme: {
      bg: "bg-[#F0F9FF]",
      border: "border-[#BAE6FD]",
      text: "text-[#0284C7]",
      activeBg: "#F0F9FF",
      activeBorder: "#BAE6FD",
      activeText: "#0284C7",
    },
    xpReward: 250,
    isUnlocked: (stats) => (stats.notesAccessed || stats.notesAccessedCount || 0) >= 50,
    checkUnlock: (stats) => (stats.notesAccessed || stats.notesAccessedCount || 0) >= 50,
    getProgress: (stats) => ({ current: Math.min(stats.notesAccessed || stats.notesAccessedCount || 0, 50), total: 50 })
  },
  {
    id: "top-scorer",
    title: "Top Scorer",
    description: "Score 100% on quiz",
    icon: "🏆",
    theme: { bg: "bg-white", border: "border-[#E2E8F0]", text: "text-[#94A3B8]", activeBg: "#FFFBEB", activeBorder: "#FDE68A", activeText: "#D97706" },
    xpReward: 100,
    isUnlocked: (stats) => (stats.perfectQuizzes || stats.perfectQuizzesCount || 0) >= 1,
    checkUnlock: (stats) => (stats.perfectQuizzes || stats.perfectQuizzesCount || 0) >= 1,
    getProgress: (stats) => ({ current: Math.min(stats.perfectQuizzes || stats.perfectQuizzesCount || 0, 1), total: 1 })
  },
  {
    id: "collaborator",
    title: "Collaborator",
    description: "Join group study",
    icon: "🤝",
    theme: { bg: "bg-white", border: "border-[#E2E8F0]", text: "text-[#94A3B8]", activeBg: "#FDF2F8", activeBorder: "#FBCFE8", activeText: "#DB2777" },
    xpReward: 75,
    isUnlocked: (stats) => (stats.groupStudiesJoined || stats.studyGroupsJoined || 0) >= 1,
    checkUnlock: (stats) => (stats.groupStudiesJoined || stats.studyGroupsJoined || 0) >= 1,
    getProgress: (stats) => ({ current: Math.min(stats.groupStudiesJoined || stats.studyGroupsJoined || 0, 1), total: 1 })
  },
  {
    id: "research-star",
    title: "Research Star",
    description: "Save 5 papers",
    icon: "⭐",
    theme: { bg: "bg-white", border: "border-[#E2E8F0]", text: "text-[#94A3B8]", activeBg: "#F0FDFA", activeBorder: "#99F6E4", activeText: "#0D9488" },
    xpReward: 150,
    isUnlocked: (stats) => (stats.papersSaved || stats.savedPapersCount || 0) >= 5,
    checkUnlock: (stats) => (stats.papersSaved || stats.savedPapersCount || 0) >= 5,
    getProgress: (stats) => ({ current: Math.min(stats.papersSaved || stats.savedPapersCount || 0, 5), total: 5 })
  },
  {
    id: "fast-learner",
    title: "Fast Learner",
    description: "Complete 3 courses",
    icon: "🚀",
    theme: { bg: "bg-white", border: "border-[#E2E8F0]", text: "text-[#94A3B8]", activeBg: "#F1F5F9", activeBorder: "#CBD5E1", activeText: "#475569" },
    xpReward: 300,
    isUnlocked: (stats) => (stats.coursesCompleted || 0) >= 3,
    checkUnlock: (stats) => (stats.coursesCompleted || 0) >= 3,
    getProgress: (stats) => ({ current: Math.min(stats.coursesCompleted || 0, 3), total: 3 })
  }
];

export const BADGE_DEFINITIONS = BADGE_CATALOG;

export const evaluateAndAwardBadges = async (userId, currentStats, supabase) => {
  if (!currentStats) return [];
  const newlyUnlocked = [];
  const unlockedIds = new Set(currentStats.unlockedBadgeIds || currentStats.unlocked_badge_ids || []);

  for (const badge of BADGE_CATALOG) {
    const isEarned = badge.isUnlocked(currentStats);
    const alreadyRecorded = unlockedIds.has(badge.id);

    if (isEarned && !alreadyRecorded) {
      newlyUnlocked.push(badge);
      unlockedIds.add(badge.id);
    }
  }

  if (newlyUnlocked.length > 0 && supabase && userId) {
    const updatedBadgeIds = Array.from(unlockedIds);
    const bonusXp = newlyUnlocked.reduce((sum, b) => sum + b.xpReward, 0);
    const newTotalXp = (currentStats.totalXp || currentStats.total_xp || 0) + bonusXp;

    try {
      await supabase
        .from("user_gamification")
        .upsert({
          user_id: userId,
          unlocked_badge_ids: updatedBadgeIds,
          total_xp: newTotalXp,
          updated_at: new Date().toISOString()
        });

      // Sync XP to user profiles table
      const { data: prof } = await supabase.from("profiles").select("xp").eq("id", userId).single();
      const profXp = (prof?.xp || 0) + bonusXp;
      await supabase.from("profiles").update({ xp: profXp }).eq("id", userId);
    } catch (err) {
      console.warn("Gamification persistence notice:", err?.message || err);
    }
  }

  return newlyUnlocked;
};

export const recordUserAction = async (userId, actionType, payload = {}, supabase = null) => {
  if (!userId) return null;

  const defaultStats = {
    user_id: userId,
    total_xp: 0,
    streak_days: 14,
    papers_read: 1,
    quizzes_completed: 10,
    notes_accessed: 50,
    perfect_quizzes: 0,
    group_studies_joined: 0,
    papers_saved: 0,
    courses_completed: 0,
    unlocked_badge_ids: ["streak-master", "bio-pioneer", "challenge-champion", "knowledge-seeker"]
  };

  let stats = { ...defaultStats };

  if (supabase) {
    try {
      const { data } = await supabase
        .from("user_gamification")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (data) {
        stats = { ...data };
      }
    } catch (e) {}
  }

  let xpAdded = 0;

  switch (actionType) {
    case "DAILY_STREAK":
      stats.streak_days = (stats.streak_days || 0) + (payload.days || 1);
      xpAdded = 50;
      break;
    case "READ_PAPER":
      stats.papers_read = (stats.papers_read || 0) + 1;
      xpAdded = 30;
      break;
    case "COMPLETE_QUIZ":
      stats.quizzes_completed = (stats.quizzes_completed || 0) + 1;
      xpAdded = payload.xp || 20;
      if (payload.isPerfect) {
        stats.perfect_quizzes = (stats.perfect_quizzes || 0) + 1;
      }
      break;
    case "ACCESS_NOTE":
      stats.notes_accessed = (stats.notes_accessed || 0) + 1;
      xpAdded = 5;
      break;
    case "SAVE_PAPER":
      stats.papers_saved = (stats.papers_saved || 0) + 1;
      xpAdded = 10;
      break;
    case "JOIN_GROUP":
      stats.group_studies_joined = (stats.group_studies_joined || 0) + 1;
      xpAdded = 25;
      break;
    case "COMPLETE_COURSE":
      stats.courses_completed = (stats.courses_completed || 0) + 1;
      xpAdded = 100;
      break;
    default:
      break;
  }

  stats.total_xp = (stats.total_xp || 0) + xpAdded;

  // Normalized stats for evaluation
  const evalStats = {
    streakDays: stats.streak_days,
    papersRead: stats.papers_read,
    quizzesCompleted: stats.quizzes_completed,
    notesAccessed: stats.notes_accessed,
    perfectQuizzes: stats.perfect_quizzes,
    groupStudiesJoined: stats.group_studies_joined,
    papersSaved: stats.papers_saved,
    coursesCompleted: stats.courses_completed,
    unlockedBadgeIds: stats.unlocked_badge_ids || [],
    totalXp: stats.total_xp
  };

  const newBadges = await evaluateAndAwardBadges(userId, evalStats, supabase);

  return { stats, xpAdded, newBadges };
};
