import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_LOGGED_IN_COOKIE } from "@/lib/auth-cookie";
import { LOGIN_PAGE } from "@/lib/site-paths";

const CUSTOMIZE = "/admin/customize";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Legacy `/admin/customize/studio` → `/admin/customize`
  if (
    pathname === "/admin/customize/studio" ||
    pathname.startsWith("/admin/customize/studio/")
  ) {
    const sub = pathname.slice("/admin/customize/studio".length);
    url.pathname = CUSTOMIZE;
    if (sub === "/cart") {
      url.searchParams.set("cart", "open");
    }
    return NextResponse.redirect(url, 308);
  }

  // Legacy `/builder` → `/admin/customize`
  if (pathname === "/builder" || pathname.startsWith("/builder/")) {
    const suffix =
      pathname === "/builder" ? "" : pathname.slice("/builder".length);
    url.pathname = CUSTOMIZE;
    if (suffix === "/cart") {
      url.searchParams.set("cart", "open");
    }
    return NextResponse.redirect(url, 308);
  }

  const loggedIn = request.cookies.get(AUTH_LOGGED_IN_COOKIE)?.value === "1";
  if (!loggedIn) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PAGE;
    redirectUrl.search = "";
    const dest = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    redirectUrl.searchParams.set("redirect", dest);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/builder",
    "/builder/:path*",
    "/user",
    "/user/:path*",
  ],
};
