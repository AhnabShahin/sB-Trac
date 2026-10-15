import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renamed the `middleware` file convention to `proxy`
// (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
// Same semantics: runs on the server before the route renders.

// Mirror of AUTH_COOKIE in services/auth.ts. Kept inline so the proxy has no
// import that could drag client-only code into the edge bundle.
const AUTH_COOKIE = "btel_token";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/pages") ||
    pathname.startsWith("/inquiries");
  const isLoginRoute = pathname === "/login";

  if (isAdminRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Already signed in? Skip the login screen and go straight to the panel.
  if (isLoginRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/pages/:path*", "/inquiries/:path*", "/login"],
};
