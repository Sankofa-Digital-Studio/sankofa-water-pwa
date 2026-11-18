import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Routes that require an authenticated session.
 * Any path that starts with one of these prefixes will redirect
 * unauthenticated visitors to /login.
 */
const PROTECTED_PREFIXES = ["/protected", "/dashboard", "/admin"] as const;

/**
 * Routes that authenticated users should not visit
 * (e.g. login / signup → redirect to dashboard).
 */
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"] as const;

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const supabaseAnonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === "your-anon-key-here") {
    console.warn(
      "[Middleware] Missing or placeholder Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
    return supabaseResponse;
  }

  // ── Build Supabase SSR client ──────────────────────────────────────────────
  // This refreshes the user's session on every request and writes updated
  // cookies back to the response. Without this, the session may expire mid-use.
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies on the request so server components can read them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Rebuild the response with the new cookies
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ── Refresh session (IMPORTANT: do not remove) ─────────────────────────────
  // getUser() triggers session refresh and writes new tokens to cookies.
  // Do NOT use getSession() here — it only reads from storage without validating.
  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (err) {
    console.error("[Middleware] Error fetching Supabase user session:", err);
  }

  const { pathname } = request.nextUrl;

  // ── Route guards ───────────────────────────────────────────────────────────

  // 1. Authenticated users visiting auth routes → redirect to dashboard
  if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 2. Unauthenticated users visiting protected routes → redirect to login
  if (!user && PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Preserve the original destination so we can redirect back after login
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // ── Pass through (with refreshed session cookies) ─────────────────────────
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico   (favicon)
     * - public assets (images, icons, manifest, sw.js)
     * This is intentionally broad; the route guard logic above is cheap.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
