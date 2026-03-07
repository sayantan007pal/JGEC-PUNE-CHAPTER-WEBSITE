import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

const COOKIE_NAME = "jgec-auth-token";

// Routes that require authentication (redirect to /login if NOT logged in)
const protectedPaths = ["/dashboard", "/profile", "/donate"];

// Routes only for guests (redirect to /dashboard if already logged in)
const guestOnlyPaths = ["/login", "/signup", "/verify-email", "/forgot-password", "/reset-password"];

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isGuestOnly = guestOnlyPaths.some((path) => pathname.startsWith(path));

  // If route doesn't need auth logic at all, skip
  if (!isProtected && !isGuestOnly) {
    return NextResponse.next();
  }

  const authed = await isAuthenticated(request);

  // Protected routes: redirect to login if NOT authenticated
  if (isProtected && !authed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear any invalid cookie
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0 });
    return response;
  }

  // Guest-only routes: redirect to dashboard if already authenticated
  if (isGuestOnly && authed) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/donate",
  ],
};
