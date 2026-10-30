import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Allowed production and local origins to prevent Open Redirect attacks
const ALLOWED_HOSTS = new Set([
  "localhost:3000",
  "bio-connect-lake.vercel.app",
  "bioconnect.in",
  "www.bioconnect.in"
]);

function getSafeRedirectUrl(targetUrl, fallbackOrigin) {
  try {
    const parsed = new URL(targetUrl, fallbackOrigin);
    // Allow relative paths on the same origin or approved hostnames
    if (parsed.origin === fallbackOrigin || ALLOWED_HOSTS.has(parsed.host)) {
      return parsed.toString();
    }
  } catch (e) {
    // Malformed URL fallback
  }
  return `${fallbackOrigin}/dashboard`;
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination = getSafeRedirectUrl(next, origin);
      return NextResponse.redirect(destination);
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
