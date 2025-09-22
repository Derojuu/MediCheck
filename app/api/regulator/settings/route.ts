import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the regulator organization for this user
    // Check if user is admin of any organization
    const adminOrg = await prisma.organization.findUnique({
      where: {
        adminId: userId
      },
      select: {
        id: true,
        companyName: true,
        organizationType: true,
        adminId: true
      }
    });

    // Check if user is team member of any organizations
    const teamMemberOrgs = await prisma.teamMember.findMany({
      where: {
        userId: userId
      },
      include: {
        organization: {
          select: {
            id: true,
            companyName: true,
            organizationType: true,
            adminId: true
          }
        }
      }
    });

    // Find the regulator organization for this user
    let organization = null;

    // First check if user is admin of a regulator org
    if (adminOrg && adminOrg.organizationType === "REGULATOR") {
      organization = await prisma.organization.findUnique({
        where: {
          id: adminOrg.id
        },
        select: {
          id: true,
          companyName: true,
          contactEmail: true,
          contactPhone: true,
          contactPersonName: true,
          address: true,
          country: true,
          state: true,
          agencyName: true,
          officialId: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });
    }

    // If not admin, check if user is team member of a regulator org
    if (!organization) {
      const regulatorTeamMember = teamMemberOrgs.find(tm => 
        tm.organization.organizationType === "REGULATOR"
      );
      
      if (regulatorTeamMember) {
        organization = await prisma.organization.findUnique({
          where: {
            id: regulatorTeamMember.organization.id
          },
          select: {
            id: true,
            companyName: true,
            contactEmail: true,
            contactPhone: true,
            contactPersonName: true,
            address: true,
            country: true,
            state: true,
            agencyName: true,
            officialId: true,
            isVerified: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        });
      }
    }

    if (!organization) {
      return NextResponse.json({ error: "Regulator organization not found" }, { status: 404 });
    }

    return NextResponse.json(organization);

  } catch (error) {
    console.error("Error fetching regulator settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
    const {
      companyName,
      contactEmail,
      contactPhone,
      contactPersonName,
      address,
      country,
      state,
      agencyName,
      officialId
    } = body;

    // Validate required fields
    if (!companyName || !contactEmail || !address || !country) {
      return NextResponse.json({ 
        error: "Missing required fields: companyName, contactEmail, address, country" 
      }, { status: 400 });
    }

    // Find and verify the regulator organization for this user
    // Check if user is admin of any organization
    const adminOrg = await prisma.organization.findUnique({
      where: {
        adminId: userId
      }
    });

    let existingOrg = null;

    // First check if user is admin of a regulator org
    if (adminOrg && adminOrg.organizationType === "REGULATOR") {
      existingOrg = adminOrg;
    }

    // If not admin, check if user is team member of a regulator org
    if (!existingOrg) {
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          userId: userId
        },
        include: {
          organization: true
        }
      });
      
      if (teamMember && teamMember.organization.organizationType === "REGULATOR") {
        existingOrg = teamMember.organization;
      }
    }

    if (!existingOrg) {
      return NextResponse.json({ error: "Regulator organization not found or access denied" }, { status: 403 });
    }

    // Check if user is admin or has permission to edit
    const isAdmin = existingOrg.adminId === userId;
    if (!isAdmin) {
      // Check if user is a team member with edit permissions
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          userId: userId,
          organizationId: existingOrg.id
        }
      });

      if (!teamMember) {
        return NextResponse.json({ error: "Insufficient permissions to update settings" }, { status: 403 });
      }
    }

    // Update the organization
    const updatedOrganization = await prisma.organization.update({
      where: {
        id: existingOrg.id
      },
      data: {
        companyName,
        contactEmail,
        contactPhone,
        contactPersonName,
        address,
        country,
        state,
        agencyName,
        officialId
      },
      select: {
        id: true,
        companyName: true,
        contactEmail: true,
        contactPhone: true,
        contactPersonName: true,
        address: true,
        country: true,
        state: true,
        agencyName: true,
        officialId: true,
        isVerified: true,
        isActive: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      organization: updatedOrganization
    });

  } catch (error) {
    console.error("Error updating regulator settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}