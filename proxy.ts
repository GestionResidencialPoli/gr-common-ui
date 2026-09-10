import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login"]);
const PUBLIC_PREFIXES = ["/preview"];
const ACCESS_TOKEN_COOKIE = "access_token";
const API_PREFIX = "/api/";

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function forwardToBackend(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete("origin");
  headers.delete("referer");
  return NextResponse.next({ request: { headers } });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(API_PREFIX)) {
    return forwardToBackend(request);
  }

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  if (!request.cookies.has(ACCESS_TOKEN_COOKIE)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next|favicon.ico|.*\\..*).*)"],
};
