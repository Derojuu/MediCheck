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

    // Get total medications count (total batch size)
    const totalMedicationsResult = await prisma.medicationBatch.aggregate({
      where: {
        organizationId: orgId,
      },
      _sum: {
        batchSize: true,
      },
    });

    // Get last month's total for comparison
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthTotal = await prisma.medicationBatch.aggregate({
      where: {
        organizationId: orgId,
        createdAt: {
          lt: lastMonth,
        },
      },
      _sum: {
        batchSize: true,
      },
    });

    // Get verified today (batches received today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const verifiedToday = await prisma.ownershipTransfer.count({
      where: {
        toOrgId: orgId,
        status: 'COMPLETED',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Get yesterday's verified count for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const verifiedYesterday = await prisma.ownershipTransfer.count({
      where: {
        toOrgId: orgId,
        status: 'COMPLETED',
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    // Get pending verifications (pending transfers to this hospital)
    const pendingVerifications = await prisma.ownershipTransfer.count({
      where: {
        toOrgId: orgId,
        status: 'PENDING',
      },
    });

    // Get alerts (expired batches + expiring soon batches)
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);

    const alerts = await prisma.medicationBatch.count({
      where: {
        organizationId: orgId,
        expiryDate: {
          lte: tenDaysFromNow,
        },
      },
    });

    // Calculate percentages
    const totalMedications = totalMedicationsResult._sum.batchSize || 0;
    const lastMonthMedications = lastMonthTotal._sum.batchSize || 0;
    const medicationGrowth = lastMonthMedications > 0 
      ? Math.round(((totalMedications - lastMonthMedications) / lastMonthMedications) * 100)
      : 0;

    const verificationDifference = verifiedToday - verifiedYesterday;

    const stats = {
      totalMedications,
      medicationGrowth,
      verifiedToday,
      verificationDifference,
      pendingVerifications,
      alerts,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching hospital stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospital stats' },
      { status: 500 }
    );
  }
}
