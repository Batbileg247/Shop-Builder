import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_LOGGED_IN_COOKIE } from "@/lib/auth-cookie";
import { LOGIN_PAGE, PATHS } from "@/lib/site-paths";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Legacy `/admin/customize/studio` → theme studio
  if (
    pathname === "/admin/customize/studio" ||
    pathname.startsWith("/admin/customize/studio/")
  ) {
    const sub =
      pathname === "/admin/customize/studio"
        ? ""
        : pathname.slice("/admin/customize/studio".length);
    if (sub === "" || sub === "/") {
      url.pathname = PATHS.builderUpdate;
    } else if (sub === "/cart") {
      url.pathname = PATHS.builderUpdate;
      url.searchParams.set("cart", "open");
    } else {
      url.pathname = `${PATHS.builderUpdate}${sub}`;
    }
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/admin/customers") {
    url.pathname = PATHS.adminOrders;
    return NextResponse.redirect(url, 308);
  }

  // Legacy `/admin/customize` → theme studio
  if (pathname === "/admin/customize" || pathname.startsWith("/admin/customize/")) {
    const suffix =
      pathname === "/admin/customize"
        ? ""
        : pathname.slice("/admin/customize".length);
    url.pathname = PATHS.builderUpdate;
    if (suffix === "/cart") {
      url.searchParams.set("cart", "open");
    }
    return NextResponse.redirect(url, 308);
  }

  // Removed `/admin/shop` — send bookmarks to theme studio
  if (pathname === "/admin/shop" || pathname.startsWith("/admin/shop/")) {
    const sub =
      pathname === "/admin/shop"
        ? ""
        : pathname.slice("/admin/shop".length);
    url.pathname = PATHS.builderUpdate;
    if (sub === "/cart") {
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
    "/building",
    "/building/:path*",
    "/user",
    "/user/:path*",
  ],
};
