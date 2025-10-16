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
    pathname.startsWith("/api/geminiTranslation") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  // ✅ Enhanced debugging for production issues
  console.log("=== MIDDLEWARE DEBUG START ===");
  console.log("userId:", userId);  
  console.log("sessionClaims exists:", !!sessionClaims);
  console.log("sessionClaims.publicMetadata:", JSON.stringify(sessionClaims?.publicMetadata, null, 2));
  console.log("Full sessionClaims:", JSON.stringify(sessionClaims, null, 2));

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
    console.log("Missing role or orgType from Clerk, checking cookie fallback...");
    const cookie = req.cookies.get("user_fallback");
    if (cookie) {
      try {
        const { role: cRole, organizationType: cOrg } = JSON.parse(
          cookie.value
        );
        console.log("Cookie fallback found - role:", cRole, "orgType:", cOrg);
        role = cRole;
        orgType = cOrg;
      } catch (error) {
        console.log("Error parsing cookie fallback:", error);
      }
    } else {
      console.log("No cookie fallback available");
    }
  }

  // If still no role/orgType and user is signed in, try to fetch from database
  if (userId && (!role || !orgType)) {
    console.log("Still missing metadata, user might be team member needing database lookup");
    // We'll handle this case in the dashboard routing logic below
  }

  console.log("Final values - role:", role, "orgType:", orgType);
  console.log("=== MIDDLEWARE DEBUG END ===");

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
    console.log("Dashboard route detected, checking authorization...");
    
    if (role !== UserRole.ORGANIZATION_MEMBER) {
      console.log("User role is not ORGANIZATION_MEMBER, redirecting to unauthorized");
      return NextResponse.redirect(new URL(publicRoutes.unauthorized, req.url));
    }

    // ✅ Check allowed dashboard based on org type
    const allowedRoute = orgType
      ? orgnaizationRoutes[orgType.toLowerCase()]
      : undefined;

    console.log("Organization type:", orgType);

    console.log("Allowed route:", allowedRoute);
    
    console.log("Current pathname:", pathname);

    if (!allowedRoute) {

      console.log("No allowed route found for organization type:", orgType);
      // If we have a signed-in org member but no orgType, redirect to a fallback route
      // This can happen during magic link auth where metadata isn't immediately available

      if (userId && role === UserRole.ORGANIZATION_MEMBER) {
        console.log("Org member without orgType detected - redirecting to general dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.redirect(new URL(publicRoutes.unauthorized, req.url));

    }

    if (!pathname.startsWith(allowedRoute)) {
      console.log("Pathname doesn't match allowed route, redirecting to correct dashboard");
      return NextResponse.redirect(new URL(allowedRoute, req.url));
    }

    console.log("Dashboard authorization successful");
  }

  return NextResponse.next();

});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|api/auth|api/register|api/public|monitoring).*)",
  ],
};