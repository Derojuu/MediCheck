import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      organizationId,
      companyName,
      contactEmail,
      contactPhone,
      contactPersonName,
      address,
      country,
      state,
      licenseNumber,
      nafdacNumber,
      businessRegNumber,
      rcNumber,
      pcnNumber
    } = body;

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    console.log('Update request - userId:', userId, 'organizationId:', organizationId);

    // First, let's check if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        teamMembers: {
          where: { userId: userId }
        }
      }
    });

    if (!organization) {
      console.log('Organization not found with ID:', organizationId);
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Check if user has access (either admin or team member)
    const isAdmin = organization.adminId === userId;
    const isTeamMember = organization.teamMembers.length > 0;
    
    console.log('Access check - isAdmin:', isAdmin, 'isTeamMember:', isTeamMember);

    if (!isAdmin && !isTeamMember) {
      console.log('User has no access to organization');
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Validate required fields
    if (!companyName || !contactEmail || !address || !country) {
      return NextResponse.json({ 
        error: "Missing required fields: companyName, contactEmail, address, country" 
      }, { status: 400 });
    }

    // Update organization settings
    const updatedOrganization = await prisma.organization.update({
      where: {
        id: organizationId
      },
      data: {
        companyName: companyName.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone?.trim() || null,
        contactPersonName: contactPersonName?.trim() || null,
        address: address.trim(),
        country: country.trim(),
        state: state?.trim() || null,
        licenseNumber: licenseNumber?.trim() || null,
        nafdacNumber: nafdacNumber?.trim() || null,
        businessRegNumber: businessRegNumber?.trim() || null,
        rcNumber: rcNumber?.trim() || null,
        pcnNumber: pcnNumber?.trim() || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: "Organization settings updated successfully",
      organization: updatedOrganization
    });

  } catch (error) {
    console.error("Error updating organization settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}