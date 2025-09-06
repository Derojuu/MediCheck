// app/api/organizations/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { organizations: true },
    });

    if (!user || !user.organizations) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      organizationId: user.organizations.id,
      organization: user.organizations,
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    );
  }
}
