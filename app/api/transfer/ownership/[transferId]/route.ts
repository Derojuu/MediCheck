// /app/api/transfer/ownership/[transferId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransferStatus } from "@/lib/generated/prisma";

export const runtime = "nodejs";

// Correct parameter typing for Next.js App Router
interface RouteParams {
  params: {
    transferId: string;
  };
}

// PUT - Update transfer status (approval endpoint)
export async function PUT(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { transferId } = params;
    const body = await req.json();
    const { organizationId, status, notes } = body;

    // Basic validation
    if (!organizationId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: organizationId, status" },
        { status: 400 }
      );
    }

    // Validate status values - using enum values from Prisma
    const validStatuses = Object.values(TransferStatus);
    if (!validStatuses.includes(status as TransferStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Valid values: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Find transfer
    const transfer = await prisma.ownershipTransfer.findUnique({
      where: { id: transferId }
    });

    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 }
      );
    }

    // Check if organization is involved in transfer (fromOrgId OR toOrgId)
    if (transfer.fromOrgId !== organizationId && transfer.toOrgId !== organizationId) {
      return NextResponse.json(
        { error: "Organization not authorized for this transfer" },
        { status: 403 }
      );
    }

    const previousStatus = transfer.status;

    // Update transfer status in OwnershipTransfer table
    const updatedTransfer = await prisma.ownershipTransfer.update({
      where: { id: transferId },
      data: {
        status: status as TransferStatus,
        notes: notes || transfer.notes,
        // Set transferDate when status becomes COMPLETED
        transferDate: status === TransferStatus.COMPLETED ? new Date() : transfer.transferDate
      }
    });

    return NextResponse.json({
      success: true,
      message: "Transfer status updated successfully",
      transferId: updatedTransfer.id,
      previousStatus,
      newStatus: updatedTransfer.status
    }, { status: 200 });

  } catch (error) {
    console.error("Transfer Status Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update transfer status" },
      { status: 500 }
    );
  }
}

// GET - Get specific transfer details
export async function GET(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { transferId } = params;

    const transfer = await prisma.ownershipTransfer.findUnique({
      where: { id: transferId },
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true,
            batchSize: true,
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
      }
    });

    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transfer: {
        id: transfer.id,
        batchId: transfer.batchId,
        fromOrgId: transfer.fromOrgId,
        toOrgId: transfer.toOrgId,
        status: transfer.status,
        notes: transfer.notes,
        transferDate: transfer.transferDate,
        createdAt: transfer.createdAt,
        updatedAt: transfer.updatedAt,
        batch: transfer.batch,
        fromOrg: transfer.fromOrg,
        toOrg: transfer.toOrg
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Get Transfer Details Error:", error);
    return NextResponse.json(
      { error: "Failed to get transfer details" },
      { status: 500 }
    );
  }
}
