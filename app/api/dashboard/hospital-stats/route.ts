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

    // Get current date and start of today for calculations
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

    // 1. Total medications in hospital inventory (from completed transfers TO the hospital)
    const completedTransfers = await prisma.ownershipTransfer.findMany({
      where: {
        toOrgId: orgId,
        status: "COMPLETED"
      },
      include: {
        batch: {
          select: {
            batchSize: true,
            expiryDate: true,
            status: true
          }
        }
      }
    });

    // Count total units from completed transfers (excluding expired batches)
    const totalMedications = completedTransfers.reduce((total, transfer) => {
      if (transfer.batch && transfer.batch.expiryDate > now && transfer.batch.status !== "EXPIRED") {
        return total + transfer.batch.batchSize;
      }
      return total;
    }, 0);

    // Calculate medication growth (transfers completed this month vs last month)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthTransfers = await prisma.ownershipTransfer.count({
      where: {
        toOrgId: orgId,
        status: "COMPLETED",
        transferDate: { gte: thisMonthStart }
      }
    });

    const lastMonthTransfers = await prisma.ownershipTransfer.count({
      where: {
        toOrgId: orgId,
        status: "COMPLETED",
        transferDate: { 
          gte: lastMonthStart,
          lt: thisMonthStart
        }
      }
    });

    const medicationGrowth = lastMonthTransfers > 0 
      ? Math.round(((thisMonthTransfers - lastMonthTransfers) / lastMonthTransfers) * 100)
      : thisMonthTransfers > 0 ? 100 : 0;

    // 2. Verifications today (scans by hospital team members)
    const verifiedToday = await prisma.scanHistory.count({
      where: {
        scanDate: { gte: startOfToday },
        teamMember: {
          organizationId: orgId
        },
        scanResult: "GENUINE"
      }
    });

    // Verifications yesterday for comparison
    const verifiedYesterday = await prisma.scanHistory.count({
      where: {
        scanDate: { 
          gte: startOfYesterday,
          lt: startOfToday
        },
        teamMember: {
          organizationId: orgId
        },
        scanResult: "GENUINE"
      }
    });

    const verificationDifference = verifiedToday - verifiedYesterday;

    // 3. Pending verifications (pending transfers TO this hospital)
    const pendingVerifications = await prisma.ownershipTransfer.count({
      where: {
        toOrgId: orgId,
        status: "PENDING"
      }
    });

    // 4. Active alerts (expiring medications from hospital inventory)
    const hospitalBatches = completedTransfers
      .filter(transfer => transfer.batch && transfer.batch.expiryDate > now)
      .map(transfer => transfer.batch);

    // Count medications expiring within 30 days
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringMedications = hospitalBatches.filter(batch => 
      batch && batch.expiryDate <= thirtyDaysFromNow
    ).length;

    // Count critical counterfeit reports for batches in hospital inventory
    const criticalReports = await prisma.counterfeitReport.count({
      where: {
        batch: {
          ownershipTransfers: {
            some: {
              toOrgId: orgId,
              status: "COMPLETED"
            }
          }
        },
        status: {
          in: ["PENDING", "INVESTIGATING"]
        },
        severity: {
          in: ["HIGH", "CRITICAL"]
        }
      }
    });

    const alerts = expiringMedications + criticalReports;

    const stats = {
      totalMedications,
      medicationGrowth,
      verifiedToday,
      verificationDifference,
      pendingVerifications,
      alerts
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Error fetching hospital stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
