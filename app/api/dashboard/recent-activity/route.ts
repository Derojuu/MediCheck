import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    // Fetch recent batches
    const recentBatches = await prisma.medicationBatch.findMany({
      where: {
        organizationId: orgId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Fetch recent transfers (where this org is the sender)
    const recentTransfers = await prisma.ownershipTransfer.findMany({
      where: {
        fromOrgId: orgId,
      },
      include: {
        batch: true,
        toOrg: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Combine and format the data
    const activities = [
      // Format batches
      ...recentBatches.map((batch) => ({
        id: `batch-${batch.id}`,
        type: 'batch' as const,
        batchId: batch.batchId,
        productName: batch.drugName,
        status: batch.status.toLowerCase(),
        createdAt: batch.createdAt.toISOString(),
      })),
      // Format transfers
      ...recentTransfers.map((transfer) => ({
        id: `transfer-${transfer.id}`,
        type: 'transfer' as const,
        batchId: transfer.batch.batchId,
        productName: transfer.batch.drugName,
        toEntity: transfer.toOrg.companyName,
        status: transfer.status.toLowerCase(),
        createdAt: transfer.createdAt.toISOString(),
      })),
    ]
      // Sort by creation date (most recent first)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      // Take only the most recent 10 activities
      .slice(0, 10);

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}
