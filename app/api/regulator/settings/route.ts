import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(userId, "user id from clerk");

    // Ensure the user exists in the users table
    const loggedUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        organizations: true,
        teamMember: {
          include: {
            organization: true
          }
        }
      }
    });

    console.log("Logged user:", loggedUser);

    // Check if user is a team member
    if (loggedUser?.teamMember) {
      // Return team member info (name and email only)
      return NextResponse.json({
        isTeamMember: true,
        name: loggedUser.teamMember.name,
        email: loggedUser.teamMember.email,
        organization: loggedUser.teamMember.organization
      });
    }

    // Check if user is organization owner (regular regulator)
    if (loggedUser?.organizations) {
      // Return full organization info for regulator
      return NextResponse.json({
        isTeamMember: false,
        ...loggedUser.organizations
      });
    }

    return NextResponse.json({ error: "No organization or team member data found" }, { status: 404 });

  }

  catch (error) {
    console.error("Error fetching regulator settings:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the user exists in the users table
    const loggedUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        organizations: true,
        teamMember: true
      }
    });

    // Handle team member updates (name and email only)
    if (loggedUser?.teamMember) {
      const { name, email } = body;
      
      const updatedTeamMember = await prisma.teamMember.update({
        where: {
          id: loggedUser.teamMember.id,
        },
        data: {
          name: name || loggedUser.teamMember.name,
          email: email || loggedUser.teamMember.email,
        },
      });

      return NextResponse.json({
        message: "Team member settings updated successfully",
        isTeamMember: true,
        name: updatedTeamMember.name,
        email: updatedTeamMember.email,
      });
    }

    // Handle organization owner updates (full organization data)
    if (loggedUser?.organizations) {
      const updatedOrganization = await prisma.organization.update({
        where: {
          id: loggedUser.organizations.id,
        },
        data: body,
      });

      return NextResponse.json({
        message: "Organization settings updated successfully",
        isTeamMember: false,
        organization: updatedOrganization,
      });
    }

    return NextResponse.json(
      { error: "No organization or team member found to update" },
      { status: 404 }
    );
  }
  catch (error) {
    console.error("Error updating regulator settings:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


