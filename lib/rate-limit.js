/**
 * BioConnect In-Memory Rate Limiter
 * Provides token bucket / sliding window rate limiting for Next.js API routes.
 */

// Memory store: Map<string, { count: number, resetTime: number }>
const rateLimitStore = new Map();

// Periodic cleanup every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Extract client identifier from request (IP address or fallback identifier)
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Check if a request exceeds rate limit
 * @param {Request} request Next.js Request object
 * @param {string} endpoint Unique endpoint name
 * @param {number} limit Maximum requests allowed in window (default 30)
 * @param {number} windowMs Time window in milliseconds (default 60000ms = 1 minute)
 * @returns {{ allowed: boolean, remaining: number, resetTime: number, retryAfter: number }}
 */
export function checkRateLimit(request, endpoint = "general", limit = 30, windowMs = 60000) {
  const ip = getClientIp(request);
  const key = `${endpoint}:${ip}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
      retryAfter: 0,
    };
  }

  record.count += 1;
  const remaining = Math.max(0, limit - record.count);
  const retryAfter = Math.ceil((record.resetTime - now) / 1000);

  if (record.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter,
    };
  }

  return {
    allowed: true,
    remaining,
    resetTime: record.resetTime,
    retryAfter: 0,
  };
}

/**
 * Helper to generate 429 Too Many Requests response
 */
export function rateLimitResponse(retryAfter = 60) {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please slow down and try again later.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(retryAfter),
      },
    }
  );
}
