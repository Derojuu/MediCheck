import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";



export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find ANY organization for this user (admin or team member)
    let organization = await prisma.organization.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      }
    });

    // If no organization exists, create a default regulator one
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          adminId: userId,
          organizationType: "REGULATOR",
          companyName: "NAFDAC Regulatory Authority",
          contactEmail: "regulator@nafdac.gov.ng",
          contactPhone: "+234-1-234-5678",
          contactPersonName: "Regulatory Officer",
          address: "NAFDAC Headquarters, Abuja",
          country: "Nigeria",
          state: "FCT",
          agencyName: "NAFDAC",
          officialId: "REG-" + userId.slice(-8).toUpperCase(),
          isVerified: true,
          isActive: true
        }
      });
    }

    return NextResponse.json(organization);

  } catch (error) {
    console.error("Error fetching regulator settings:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Find the organization to update
    const organization = await prisma.organization.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      }
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Update the organization
    const updatedOrganization = await prisma.organization.update({
      where: {
        id: organization.id
      },
      data: body
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      organization: updatedOrganization
    });

  } catch (error) {
    console.error("Error updating regulator settings:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}