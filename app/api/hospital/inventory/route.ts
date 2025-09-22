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

    // Get all completed transfers TO this hospital
    const transfers = await prisma.ownershipTransfer.findMany({
      where: {
        toOrgId: orgId,
        status: "COMPLETED"
      },
      include: {
        batch: {
          select: {
            id: true,
            batchId: true,
            drugName: true,
            batchSize: true,
            expiryDate: true,
            status: true,
            manufacturingDate: true
          }
        },
        fromOrg: {
          select: {
            companyName: true,
            organizationType: true
          }
        }
      },
      orderBy: {
        transferDate: "desc"
      }
    });

    // Transform the data to match the expected format
    const inventory = transfers
      .filter(transfer => transfer.batch) // Only include transfers with valid batches
      .map(transfer => ({
        id: transfer.batch!.id,
        batchId: transfer.batch!.batchId,
        drugName: transfer.batch!.drugName,
        batchSize: transfer.batch!.batchSize,
        expiryDate: transfer.batch!.expiryDate.toISOString(),
        status: transfer.batch!.status,
        manufacturingDate: transfer.batch!.manufacturingDate.toISOString(),
        transferDate: transfer.transferDate.toISOString(),
        receivedFrom: transfer.fromOrg.companyName,
        fromOrgType: transfer.fromOrg.organizationType
      }));

    return NextResponse.json(inventory);

  } catch (error) {
    console.error("Error fetching hospital inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}