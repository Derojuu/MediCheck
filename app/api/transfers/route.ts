import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");
    const direction = searchParams.get("direction") || "all"; // outgoing, incoming, all

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    let whereClause: any = {};

    if (direction === "outgoing") {
      whereClause.fromOrgId = orgId;
    } else if (direction === "incoming") {
      whereClause.toOrgId = orgId;
    } else {
      // all - both incoming and outgoing
      whereClause.OR = [
        { fromOrgId: orgId },
        { toOrgId: orgId },
      ];
    }

    const transfers = await prisma.ownershipTransfer.findMany({
      where: whereClause,
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true,
            batchSize: true,
            expiryDate: true,
          },
        },
        fromOrg: {
          select: {
            companyName: true,
            organizationType: true,
          },
        },
        toOrg: {
          select: {
            companyName: true,
            organizationType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data for easier frontend consumption
    const formattedTransfers = transfers.map((transfer) => ({
      id: transfer.id,
      batchId: transfer.batch.batchId,
      medicationName: transfer.batch.drugName,
      quantity: transfer.batch.batchSize,
      expiryDate: transfer.batch.expiryDate,
      fromOrganization: {
        name: transfer.fromOrg.companyName,
        type: transfer.fromOrg.organizationType,
      },
      toOrganization: {
        name: transfer.toOrg.companyName,
        type: transfer.toOrg.organizationType,
      },
      status: transfer.status,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
      notes: transfer.notes,
    }));

    return NextResponse.json({ transfers: formattedTransfers });
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfers" },
      { status: 500 }
    );
  }
}
