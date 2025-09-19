import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    // Verify user has access to this organization
    const organization = await prisma.organization.findFirst({
      where: {
        id: orgId,
        organizationType: "HOSPITAL",
        OR: [
          { adminId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      }
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found or access denied" }, { status: 403 });
    }

    // Return organization settings data
    const settings = {
      id: organization.id,
      companyName: organization.companyName,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      contactPersonName: organization.contactPersonName,
      address: organization.address,
      country: organization.country,
      state: organization.state,
      licenseNumber: organization.licenseNumber,
      nafdacNumber: organization.nafdacNumber,
      businessRegNumber: organization.businessRegNumber,
      rcNumber: organization.rcNumber,
      pcnNumber: organization.pcnNumber,
      isVerified: organization.isVerified,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt
    };

    return NextResponse.json(settings);

  } catch (error) {
    console.error("Error fetching hospital settings:", error);
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
      orgId,
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

    if (!orgId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    // Verify user is admin of this organization
    const organization = await prisma.organization.findFirst({
      where: {
        id: orgId,
        organizationType: "HOSPITAL",
        adminId: userId // Only admin can edit settings
      }
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found or insufficient permissions" }, { status: 403 });
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
        id: orgId
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

    const settings = {
      id: updatedOrganization.id,
      companyName: updatedOrganization.companyName,
      contactEmail: updatedOrganization.contactEmail,
      contactPhone: updatedOrganization.contactPhone,
      contactPersonName: updatedOrganization.contactPersonName,
      address: updatedOrganization.address,
      country: updatedOrganization.country,
      state: updatedOrganization.state,
      licenseNumber: updatedOrganization.licenseNumber,
      nafdacNumber: updatedOrganization.nafdacNumber,
      businessRegNumber: updatedOrganization.businessRegNumber,
      rcNumber: updatedOrganization.rcNumber,
      pcnNumber: updatedOrganization.pcnNumber,
      isVerified: updatedOrganization.isVerified,
      createdAt: updatedOrganization.createdAt,
      updatedAt: updatedOrganization.updatedAt
    };

    return NextResponse.json({
      message: "Hospital settings updated successfully",
      settings
    });

  } catch (error) {
    console.error("Error updating hospital settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}