import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access login page while already logged in
  if (pathname === "/login" && session) {
    try {
      await decrypt(session);
      return NextResponse.redirect(new URL("/", request.url));
    } catch (err) {
      // Invalid session, let them stay on login
    }
  }

  // 2. Protect all routes except /login and static assets
  if (pathname !== "/login" && !pathname.startsWith("/_next") && !pathname.includes(".")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = await decrypt(session);

      // 3. Admin only routes
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (err) {
      // Invalid session
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
