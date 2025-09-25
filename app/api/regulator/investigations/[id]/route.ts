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

    const { status, resolution, severity } = await request.json();
    const investigationId = params.id;

    // Update investigation
    const updatedInvestigation = await prisma.counterfeitReport.update({
      where: { id: investigationId },
      data: {
        status,
        resolution,
        investigatorId: userId,
        ...(severity && { severity }),
        updatedAt: new Date()
      },
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true,
            organization: {
              select: {
                companyName: true
              }
            }
          }
        },
        consumers: {
          select: {
            fullName: true
          }
        }
      }
    });

    return NextResponse.json({ investigation: updatedInvestigation });

  } catch (error) {
    console.error("Error updating investigation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}