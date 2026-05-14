import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_LOGGED_IN_COOKIE } from "@/lib/auth-cookie";
import { LOGIN_PAGE } from "@/lib/site-paths";

export function middleware(request: NextRequest) {
  const loggedIn = request.cookies.get(AUTH_LOGGED_IN_COOKIE)?.value === "1";
  if (!loggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PAGE;
    const dest = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    url.searchParams.set("redirect", dest);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/builder/:path*", "/user"],
};
  