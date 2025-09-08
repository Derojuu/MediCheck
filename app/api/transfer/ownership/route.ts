// /app/api/transfer/ownership/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransferStatus } from "@/lib/generated/prisma";

export const runtime = "nodejs";

// POST - Create new transfer ownership record
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      batchId,
      fromOrgId,
      toOrgId,
      notes
    } = body;

    // Basic validation
    if (!batchId || !fromOrgId || !toOrgId) {
      return NextResponse.json(
        { error: "Missing required fields: batchId, fromOrgId, toOrgId" },
        { status: 400 }
      );
    }

    // Create transfer ownership record - simple insertion into OwnershipTransfer table
    const transfer = await prisma.ownershipTransfer.create({
      data: {
        batchId,
        fromOrgId,
        toOrgId,
        status: TransferStatus.PENDING,
        notes: notes || null
      }
    });

    return NextResponse.json({
      success: true,
      message: "Transfer ownership created successfully",
      transferId: transfer.id,
      status: transfer.status
    }, { status: 201 });

  } catch (error) {
    console.error("Transfer Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to create transfer ownership" },
      { status: 500 }
    );
  }
}

// GET - Get all transfers where organization is sender OR receiver
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    const status = searchParams.get("status");

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId parameter is required" },
        { status: 400 }
      );
    }

    // Build where clause - fromOrgId matches OR toOrgId matches organizationId
    let whereClause: any = {
      OR: [
        { fromOrgId: organizationId },
        { toOrgId: organizationId }
      ]
    };

    // Add status filter if provided
    if (status) {
      whereClause.status = status;
    }

    // Get all transfers from OwnershipTransfer table
    const transfers = await prisma.ownershipTransfer.findMany({
      where: whereClause,
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true,
            batchSize: true
          }
        },
        fromOrg: {
          select: {
            companyName: true,
            organizationType: true
          }
        },
        toOrg: {
          select: {
            companyName: true,
            organizationType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add direction info for the logged in organization
    const transfersWithDirection = transfers.map(transfer => ({
      id: transfer.id,
      batchId: transfer.batchId,
      fromOrgId: transfer.fromOrgId,
      toOrgId: transfer.toOrgId,
      status: transfer.status,
      notes: transfer.notes,
      transferDate: transfer.transferDate,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
      
      // Direction from logged-in organization perspective
      direction: transfer.fromOrgId === organizationId ? 'OUTGOING' : 'INCOMING',
      requiresApproval: transfer.status === 'PENDING',
      
      // Include related data
      batch: transfer.batch,
      fromOrg: transfer.fromOrg,
      toOrg: transfer.toOrg
    }));

    return NextResponse.json({
      transfers: transfersWithDirection,
      total: transfers.length
    }, { status: 200 });

  } catch (error) {
    console.error("Get Transfers Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve transfers" },
      { status: 500 }
    );
  }
}
