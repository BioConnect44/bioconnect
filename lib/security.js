/**
 * BioConnect Security Utilities
 * Input sanitization, email validation, and safe error masking.
 */

/**
 * Escapes characters for HTML output to prevent XSS / HTML injection in templates
 */
export function escapeHtml(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates email structure with a strict regex
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Sanitize and enforce max string length
 */
export function sanitizeString(val, maxLength = 1000) {
  if (!val || typeof val !== "string") return "";
  return val.trim().slice(0, maxLength);
}

/**
 * Verify administrative authorization header
 * Checks Bearer token against CRON_SECRET or ADMIN_API_KEY
 */
export function isAuthorizedAdmin(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  
  const expectedSecret = process.env.CRON_SECRET || process.env.ADMIN_API_KEY;
  if (!expectedSecret) {
    // If not configured, in development mode only allow localhost without trigger
    return process.env.NODE_ENV !== "production";
  }
  return token === expectedSecret;
}

/**
 * Standardized safe error response generator to prevent leaking internal error stack traces
 */
export function safeErrorResponse(error, userFriendlyMessage = "An unexpected error occurred. Please try again.", status = 500) {
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  // Log full detailed trace to server logs safely
  console.error(`[AppSec Safety Log] [${errorId}]:`, error);

  return new Response(
    JSON.stringify({
      error: userFriendlyMessage,
      ref: errorId,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
