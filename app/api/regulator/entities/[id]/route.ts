import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the regulator organization for this user
    const organization = await prisma.organization.findFirst({
      where: {
        organizationType: "REGULATOR",
        OR: [
          { adminId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      }
    });

    if (!organization) {
      return NextResponse.json({ error: "Regulator organization not found or access denied" }, { status: 403 });
    }

    const { isVerified, isActive, notes } = await request.json();
    const entityId = params.id;

    // Update entity verification status
    const updatedEntity = await prisma.organization.update({
      where: { id: entityId },
      data: {
        isVerified,
        isActive,
        updatedAt: new Date()
      }
    });

    // Log the action in audit logs
    await prisma.auditLog.create({
      data: {
        userId,
        action: isVerified ? "ENTITY_VERIFIED" : "ENTITY_UNVERIFIED",
        entityType: "ORGANIZATION",
        entityId,
        details: {
          organizationName: updatedEntity.companyName,
          isVerified,
          isActive,
          notes
        }
      }
    });

    return NextResponse.json({ entity: updatedEntity });

  } catch (error) {
    console.error("Error updating entity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}