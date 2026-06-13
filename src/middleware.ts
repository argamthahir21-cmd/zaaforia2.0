import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
  const userRole = (req.auth?.user as any)?.role;

  if (isOnAdmin) {
    if (!isLoggedIn) {
      // Don't redirect to login if they are already trying to access /admin/login
      if (req.nextUrl.pathname === "/admin/login") {
        return NextResponse.next();
      }
      return NextResponse.redirect(
        new URL("/admin/login?callbackUrl=" + encodeURIComponent(req.nextUrl.pathname), req.nextUrl)
      );
    }
    if (userRole?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
