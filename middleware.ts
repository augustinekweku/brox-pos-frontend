import { NextConfig } from "next";
import { JWT } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export type middlewareSessionType = JWT & {
  user: {
    user_role: string;
  };
};

export default withAuth(
  function middleware(req) {
    const session: middlewareSessionType = req.nextauth
      ?.token as middlewareSessionType;
    const pathname = req.nextUrl.pathname;
    const hasSesssion = session?.user?.user_role;
    const isInAuthRoute = pathname.includes("/auth");
    const isUserOnboarded = session?.onboarded;
    if (pathname === "/" || (isInAuthRoute && hasSesssion)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    console.log("session", session?.user?.user_role);
    console.log("pathname", pathname);
    console.log("isInAuthRoute", isInAuthRoute);

    if (!isInAuthRoute && !hasSesssion) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (isInAuthRoute && hasSesssion) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: () => {
        return true;
      },
    },
  }
);

export const config: NextConfig = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*"],
};
