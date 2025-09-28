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
    });

    console.log("Logged user:", loggedUser);

    // Find the regulator organization for this user
    const organization = await prisma.organization.findFirst({
      where: {
        adminId: loggedUser?.id,
      },
    });

    console.log("Fetched organization:", organization);

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json(organization);

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
    });

    // Find the organization to update
    const organization = await prisma.organization.findFirst({
      where: {
        adminId: loggedUser?.id,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Update the organization
    const updatedOrganization = await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: body,
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      organization: updatedOrganization,
    });
  }
  catch (error) {
    console.error("Error updating regulator settings:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


