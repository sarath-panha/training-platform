import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // Admin Protection
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.rewrite(new URL("/auth", req.url));
    }

    // Instructor Protection
    if (
      path.startsWith("/instructor") &&
      role !== "instructor" &&
      role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/auth", req.url));
    }

    // Organizer Protection
    if (
      path.startsWith("/organizer") &&
      role !== "organizer" &&
      role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/auth", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/organizer/:path*"],
};
