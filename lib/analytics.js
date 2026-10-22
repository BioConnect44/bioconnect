"use client";

import { track } from "@vercel/analytics";

/**
 * Universal conversion & interaction analytics dispatcher
 * Safely dispatches to Vercel Analytics custom events with local dev fallback.
 */
export function trackEvent(eventName, properties = {}) {
  try {
    if (typeof window !== "undefined") {
      track(eventName, properties);
      if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics Event: ${eventName}]`, properties);
      }
    }
  } catch (err) {
    console.debug("[Analytics skipped]", err);
  }
}

export const ConversionEvents = {
  COURSE_READ: "course_notes_read",
  COURSE_DOWNLOAD: "course_pdf_downloaded",
  MCQ_COMPLETED: "mcq_quiz_completed",
  CHALLENGE_SOLVED: "daily_challenge_solved",
  CONTACT_SUBMITTED: "contact_inquiry_submitted",
  JOB_CLICK: "job_application_clicked",
  PAPER_SEARCH: "pubmed_paper_searched",
  AUTH_SIGNUP: "user_signup_completed",
  AUTH_LOGIN: "user_login_completed",
};
