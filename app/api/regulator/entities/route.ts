import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find ANY organization for this user - be more permissive
    const userOrganization = await prisma.organization.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      }
    });

    if (!userOrganization) {
      return NextResponse.json({ error: "No organization found for user" }, { status: 403 });
    }

    // Get all registered entities (organizations) except regulators
    const entities = await prisma.organization.findMany({
      where: {
        organizationType: {
          not: "REGULATOR"
        }
      },
      select: {
        id: true,
        companyName: true,
        organizationType: true,
        contactEmail: true,
        contactPhone: true,
        address: true,
        country: true,
        state: true,
        licenseNumber: true,
        nafdacNumber: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            medicationBatches: true,
            transfersFrom: true,
            transfersTo: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ entities });

  } catch (error) {
    console.error("Error fetching entities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    console.log("POST /api/regulator/entities - userId:", userId);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find ANY organization for this user - be more permissive
    const userOrganization = await prisma.organization.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      }
    });

    console.log("User organization found:", userOrganization ? { id: userOrganization.id, type: userOrganization.organizationType } : "none");

    if (!userOrganization) {
      console.log("No organization found for user, creating default regulator organization...");
      
      // Create a regulator organization for the user if none exists
      const newRegulatorOrg = await prisma.organization.create({
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
      
      console.log("Created regulator organization:", newRegulatorOrg.id);
    }

    const { 
      companyName, 
      organizationType, 
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
      pcnNumber,
      agencyName,
      officialId,
      distributorType
    } = await request.json();

    console.log("Creating entity with data:", { companyName, organizationType, contactEmail });
    console.log("Clerk userId:", userId);

    // Use upsert to ensure user exists
    const user = await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {}, // Don't update anything if user exists
      create: {
        clerkUserId: userId,
        userRole: "ORGANIZATION_MEMBER",
        isActive: true
      }
    });

    console.log("Database user ID:", user.id);

    // Use the database user ID as the admin
    const entity = await prisma.organization.create({
      data: {
        adminId: user.id,
        companyName,
        organizationType,
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
        pcnNumber,
        agencyName,
        officialId,
        distributorType,
        isVerified: false, // New entities start unverified
        isActive: true
      }
    });

    console.log("Entity created successfully:", entity.id);
    return NextResponse.json({ entity });

  } catch (error) {
    console.error("Error creating entity:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}