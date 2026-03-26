import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === "nikolasmurdock.com" || host === "www.nikolasmurdock.com") {
    const url = request.nextUrl.clone();
    const { pathname } = url;

    // Rewrite root → artist landing page
    if (pathname === "/") {
      url.pathname = "/artists/nikolas-murdock";
      return NextResponse.rewrite(url);
    }

    // Rewrite sub-paths (e.g. /music → /artists/nikolas-murdock/music)
    url.pathname = `/artists/nikolas-murdock${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|media).*)"],
};
