/**
 * BioConnect Environment Schema Validator
 * Validates critical environment variables on server initialization.
 */

export function validateEnv() {
  const warnings = [];
  const errors = [];

  // Required client variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is missing.");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  }

  // Recommended server keys
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    warnings.push("SUPABASE_SERVICE_ROLE_KEY is not defined; server-side elevated mutations will fall back or be restricted.");
  }
  if (!process.env.CRON_SECRET && !process.env.ADMIN_API_KEY) {
    warnings.push("CRON_SECRET / ADMIN_API_KEY is not defined; administrative and scraper endpoints should be locked.");
  }

  if (warnings.length > 0 && process.env.NODE_ENV !== "production") {
    warnings.forEach((w) => console.warn(`[Env Validation Warning] ${w}`));
  }

  if (errors.length > 0) {
    const errorMsg = `[CRITICAL ENV FAILURE] Missing required environment variables:\n${errors.join("\n")}`;
    if (process.env.NODE_ENV === "production") {
      console.error(errorMsg);
    } else {
      console.warn(errorMsg);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
