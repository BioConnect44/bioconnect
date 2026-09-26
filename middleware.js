import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return supabaseResponse;
    }

    const pathname = request.nextUrl.pathname;

    // Check if request has any Supabase auth cookies
    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some(
      (c) => c.name.startsWith("sb-") || c.name.includes("auth-token")
    );

    const isProtectedRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/learning");

    const isAuthRoute = pathname === "/login" || pathname === "/signup";

    // Fast-path: if no auth cookies present
    if (!hasAuthCookie) {
      if (isProtectedRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/login";
        return NextResponse.redirect(redirectUrl);
      }
      return supabaseResponse;
    }

    // Initialize Supabase SSR client
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Timeout wrapper for getUser to prevent Vercel 504 Edge timeouts
    const getUserWithTimeout = async () => {
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve({ data: { user: null }, error: "timeout" }), 1500)
      );
      try {
        return await Promise.race([
          supabase.auth.getUser(),
          timeoutPromise,
        ]);
      } catch (e) {
        return { data: { user: null }, error: e };
      }
    };

    const res = await getUserWithTimeout();
    const user = res?.data?.user;

    // If user is NOT logged in and tries to access protected route, redirect to /login
    if (!user && isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }

    // If user IS logged in and tries to access /login or /signup, redirect to /dashboard
    if (user && isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.error("Middleware session error:", err);
  }

  return supabaseResponse;
}

// Tell Next.js which routes this middleware should run on
export const config = {
  matcher: [
    // Exclude static files, images, API routes, and favicons
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico)$).*)",
  ],
};