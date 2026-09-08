import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login"]);
const ACCESS_TOKEN_COOKIE = "access_token";

function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_AUTH_MODE === "demo" ||
    (!process.env.NEXT_PUBLIC_AUTH_MODE && process.env.NODE_ENV === "development")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isDemoMode() || PUBLIC_PATHS.has(pathname) || pathname.startsWith("/preview")) {
    return NextResponse.next();
  }

  if (!request.cookies.has(ACCESS_TOKEN_COOKIE)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
