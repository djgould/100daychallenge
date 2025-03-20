import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Cache the homepage for better performance
  if (request.nextUrl.pathname === "/") {
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );
  }

  // Set longer cache time for static assets
  if (
    request.nextUrl.pathname.startsWith("/_next/static") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.includes(".svg") ||
    request.nextUrl.pathname.includes(".png") ||
    request.nextUrl.pathname.includes(".jpg") ||
    request.nextUrl.pathname.includes(".ico")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  return response;
}
