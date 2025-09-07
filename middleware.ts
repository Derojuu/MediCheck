import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authRoutes, publicRoutes, orgnaizationRoutes } from "./utils";
import { UserRole } from "./lib/generated/prisma";

export default clerkMiddleware(async (auth, req) => {

  const { userId, sessionClaims } = await auth();
  
  const pathname = req.nextUrl.pathname;

  // ✅ Public pages that do NOT require authentication
  const publicPaths = Object.values(publicRoutes);
  const authPaths = Object.values(authRoutes);

  // ✅ If route is EXACTLY public or auth route, allow
  if (publicPaths.includes(pathname) || authPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow home page ("/") ONLY if user is not logged in
  if (pathname === publicRoutes.home) {
    return NextResponse.next();
  }

  // // ✅ If user is NOT signed in, redirect to login
  // if (!userId) {
  //   return NextResponse.redirect(new URL(authRoutes.login, req.url));
  // }

  // ✅ Extract user role & organization type from metadata
  type PublicMetadata = {
    role?: string;
    organizationType?: string;
    [key: string]: unknown;
  };
  
  const publicMetadata = sessionClaims?.publicMetadata as
    | PublicMetadata
    | undefined;
  const role = publicMetadata?.role;
  const orgType = publicMetadata?.organizationType;

  // ✅ Consumer routes → only for consumers
  if (pathname.startsWith("/consumer") && role !== UserRole.CONSUMER) {
    return NextResponse.redirect(new URL(publicRoutes.unauthorized, req.url));
  }

  // ✅ Organization routes → only for organization members
  if (pathname.startsWith("/dashboard")) {

    if (role !== UserRole.ORGANIZATION_MEMBER) {
      return NextResponse.redirect(new URL(publicRoutes.unauthorized, req.url));
    }

    // ✅ Check allowed dashboard based on org type
    const allowedRoute = orgType
      ? orgnaizationRoutes[orgType.toLowerCase()]
      : undefined;

    if (!allowedRoute || !pathname.startsWith(allowedRoute)) {
      return NextResponse.redirect(new URL(publicRoutes.unauthorized, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|api/auth|api/register|api/public).*)",
  ],
};