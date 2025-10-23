import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const adminOnly = new Set(["ADMIN"]);
const mentorAccess = new Set(["MENTOR", "ADMIN"]);

const getRole = (request: NextRequest) => request.cookies.get("role")?.value;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRole(request);

  if (pathname.startsWith("/admin")) {
    if (!role || !adminOnly.has(role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/mentor")) {
    if (!role || !mentorAccess.has(role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mentor/:path*"],
};
