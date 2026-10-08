// lib/courseProgress.js

export const COURSE_PROGRESS_STORAGE_KEY = "bioconnect_course_progress";

/**
 * Returns all stored course progress map from localStorage.
 */
export function getAllCourseProgress() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Returns progress data for a single topic.
 * @param {string} topicId
 */
export function getTopicProgress(topicId) {
  if (typeof window === "undefined" || !topicId) {
    return { read: false, downloaded: false, mcqsCompleted: false, percent: 0 };
  }
  const all = getAllCourseProgress();
  const data = all[topicId] || { read: false, downloaded: false, mcqsCompleted: false };
  return {
    ...data,
    percent: calculateTopicPercent(data),
  };
}

/**
 * Calculates percentage:
 * - Read notes/PDF: 35%
 * - Downloaded/Printed PDF: 30%
 * - Completed MCQs: 35%
 * Total = 100%
 */
export function calculateTopicPercent(data) {
  if (!data) return 0;
  let percent = 0;
  if (data.read) percent += 35;
  if (data.downloaded) percent += 30;
  if (data.mcqsCompleted) percent += 35;
  return Math.min(100, Math.max(0, percent));
}

/**
 * Records an activity for a topic (read, download, mcq).
 * Updates localStorage, dispatches window events, and optionally logs to Supabase.
 * @param {string} topicId
 * @param {"read" | "download" | "mcq"} action
 * @param {object} [metadata]
 */
export function recordTopicProgress(topicId, action, metadata = {}) {
  if (typeof window === "undefined" || !topicId) return null;
  try {
    const all = getAllCourseProgress();
    const current = all[topicId] || { read: false, downloaded: false, mcqsCompleted: false };

    let changed = false;
    if (action === "read" && !current.read) {
      current.read = true;
      current.readAt = new Date().toISOString();
      changed = true;
    } else if (action === "download" && !current.downloaded) {
      current.downloaded = true;
      current.downloadedAt = new Date().toISOString();
      changed = true;
    } else if (action === "mcq" && !current.mcqsCompleted) {
      current.mcqsCompleted = true;
      current.mcqsCompletedAt = new Date().toISOString();
      if (metadata.score !== undefined) current.mcqScore = metadata.score;
      if (metadata.total !== undefined) current.mcqTotal = metadata.total;
      changed = true;
    }

    current.percent = calculateTopicPercent(current);
    all[topicId] = current;
    localStorage.setItem(COURSE_PROGRESS_STORAGE_KEY, JSON.stringify(all));

    // Dispatch custom event for real-time reactive UI update across components
    window.dispatchEvent(
      new CustomEvent("bioconnect_course_progress_updated", {
        detail: {
          topicId,
          data: current,
          progressMap: all,
          action,
        },
      })
    );

    return current;
  } catch (e) {
    console.error("Error recording topic progress:", e);
    return null;
  }
}
