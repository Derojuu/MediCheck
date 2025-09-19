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
      include: { 
        organizations: true,
        teamMember: {
          include: {
            organization: true
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user owns an organization
    if (user.organizations) {
      return NextResponse.json({
        organizationId: user.organizations.id,
        organization: user.organizations,
      });
    }

    // Check if user is a team member of an organization
    if (user.teamMember && user.teamMember.organization) {
      return NextResponse.json({
        organizationId: user.teamMember.organization.id,
        organization: user.teamMember.organization,
      });
    }

    return NextResponse.json(
      { error: "No organization found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    );
  }
}
