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

    // Get total batches count
    const totalBatches = await prisma.medicationBatch.count({
      where: {
        organizationId: orgId,
      },
    });

    // Get active batches count (not expired and in certain statuses)
    const activeBatches = await prisma.medicationBatch.count({
      where: {
        organizationId: orgId,
        expiryDate: {
          gt: new Date(), // Not expired
        },
        status: {
          in: ['CREATED', 'IN_TRANSIT', 'DELIVERED'],
        },
      },
    });

    // Get pending quality batches count (using CREATED as pending quality)
    const pendingQuality = await prisma.medicationBatch.count({
      where: {
        organizationId: orgId,
        status: 'CREATED',
      },
    });

    // Get recent transfers count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransfers = await prisma.ownershipTransfer.count({
      where: {
        fromOrgId: orgId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const stats = {
      totalBatches,
      activeBatches,
      pendingQuality,
      recentTransfers,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
