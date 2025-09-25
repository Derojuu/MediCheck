import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create User record
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      // Auto-create User record for regulator
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          userRole: "SUPER_ADMIN", // Assuming regulators are super admins
          isActive: true
        }
      });
    }

    // Find the regulator organization for this user
    let organization = await prisma.organization.findFirst({
      where: {
        organizationType: "REGULATOR",
        OR: [
          { adminId: user.id },
          { teamMembers: { some: { userId: user.id } } }
        ]
      }
    });

    // If no regulator organization exists for this user, create one
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          adminId: user.id,
          organizationType: "REGULATOR",
          companyName: "Regulatory Authority",
          contactEmail: "regulator@authority.gov",
          address: "Regulatory Building",
          country: "Nigeria",
          agencyName: "NAFDAC",
          officialId: `REG-${Date.now()}`,
          isVerified: true,
          isActive: true
        }
      });
    }

    // Get all ownership transfers for compliance review
    const transfers = await prisma.ownershipTransfer.findMany({
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true,
            manufacturingDate: true,
            expiryDate: true
          }
        },
        fromOrg: {
          select: {
            companyName: true,
            organizationType: true,
            contactEmail: true
          }
        },
        toOrg: {
          select: {
            companyName: true,
            organizationType: true,
            contactEmail: true
          }
        }
      },
      orderBy: {
        transferDate: "desc"
      }
    });

    return NextResponse.json({ transfers });

  } catch (error) {
    console.error("Error fetching transfers:", error);
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

    // Find or create User record
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      // Auto-create User record for regulator
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          userRole: "SUPER_ADMIN", // Assuming regulators are super admins
          isActive: true
        }
      });
    }

    // Find the regulator organization for this user
    let organization = await prisma.organization.findFirst({
      where: {
        organizationType: "REGULATOR",
        OR: [
          { adminId: user.id },
          { teamMembers: { some: { userId: user.id } } }
        ]
      }
    });

    // If no regulator organization exists for this user, create one
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          adminId: user.id,
          organizationType: "REGULATOR",
          companyName: "Regulatory Authority",
          contactEmail: "regulator@authority.gov",
          address: "Regulatory Building",
          country: "Nigeria",
          agencyName: "NAFDAC",
          officialId: `REG-${Date.now()}`,
          isVerified: true,
          isActive: true
        }
      });
    }

    const { transferId, status, notes } = await request.json();

    // Update transfer status
    const updatedTransfer = await prisma.ownershipTransfer.update({
      where: { id: transferId },
      data: {
        status,
        notes,
        updatedAt: new Date()
      },
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true
          }
        },
        fromOrg: {
          select: {
            companyName: true
          }
        },
        toOrg: {
          select: {
            companyName: true
          }
        }
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: `TRANSFER_${status}`,
        entityType: "OWNERSHIP_TRANSFER",
        entityId: transferId,
        details: {
          batchId: updatedTransfer.batch.batchId,
          fromOrg: updatedTransfer.fromOrg.companyName,
          toOrg: updatedTransfer.toOrg.companyName,
          status,
          notes
        }
      }
    });

    return NextResponse.json({ transfer: updatedTransfer });

  } catch (error) {
    console.error("Error updating transfer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}