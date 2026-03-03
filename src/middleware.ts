import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

const COOKIE_NAME = "jgec-auth-token";

// Routes that require authentication
const protectedPaths = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token is invalid or expired
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0 });
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
