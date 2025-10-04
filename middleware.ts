import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authRoutes, publicRoutes, orgnaizationRoutes } from "./utils";
import { UserRole } from "./lib/generated/prisma";

export default clerkMiddleware(async (auth, req) => {

  const pathname = req.nextUrl.pathname;

  console.log('Incoming pathname in middleware', pathname)

  // Skip auth/role checks for these API routes because they are either public,
  // used by third-party services, or need to be accessible without a signed-in user.
  // This prevents the middleware from redirecting or blocking legitimate requests.

  if (
    pathname.startsWith("/api/hotspots") ||
    pathname.startsWith("/api/batches") ||
    pathname.startsWith("/api/verify") ||
    pathname.startsWith("/api/geminiTranslation")
  ) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  // ✅ Extract user role & organization type from metadata
  type PublicMetadata = {
    role?: string;
    organizationType?: string;
    [key: string]: unknown;
  };

  const publicMetadata = sessionClaims?.publicMetadata as
    | PublicMetadata
    | undefined;

  let role = publicMetadata?.role;
  let orgType = publicMetadata?.organizationType;

  console.log("middleware code: role FROM CLERK", role);
  console.log("middleware code: orgType FROM CLERK", orgType);

  // Fallback to cookie if metadata is missing
  if (!role || !orgType) {
    const cookie = req.cookies.get("user_fallback");
    if (cookie) {
      try {
        const { role: cRole, organizationType: cOrg } = JSON.parse(
          cookie.value
        );
        console.log("cookie valuue", cRole, cOrg);
        role = cRole;
        orgType = cOrg;
      } catch {
        console.log("error occurred while getting value from cookie");
      }
    }
  }

  console.log("Middleware invoked for path:", pathname);

  // ✅ Public pages that do NOT require authentication
  const publicPaths = Object.values(publicRoutes);

  const authPaths = Object.values(authRoutes);

  if (publicPaths.some((path) => pathname.startsWith("/verify/batchUnit/"))) {
    return NextResponse.next();
  }

  if (publicPaths.some((path) => pathname.startsWith("/verify/batch/"))) {
    if (role !== UserRole.ORGANIZATION_MEMBER) {
      return NextResponse.redirect(new URL(publicRoutes.unauthorized, req.url));
    }
    return NextResponse.next();
  }

  // ✅ If route is EXACTLY public or auth route, allow
  if (publicPaths.includes(pathname) || authPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow home page ("/") ONLY if user is not logged in
  if (pathname === publicRoutes.home && !userId) {
    return NextResponse.next();
  }

  // ✅ If user is NOT signed in, redirect to login (for protected routes)
  if (!userId) {
    return NextResponse.redirect(new URL(authRoutes.login, req.url));
  }

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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|api/auth|api/register|api/public|monitoring).*)",
  ],
};