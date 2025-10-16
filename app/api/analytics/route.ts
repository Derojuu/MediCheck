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
    const timeRange = searchParams.get('timeRange') || '30'; // days
    const dashboardType = searchParams.get('type') || 'manufacturer';

    console.log('Analytics API: Processing request for user:', userId);

    // Get user and their organization information
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        organizations: true,
        teamMember: {
          include: { organization: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Determine the organization - user can either own an organization or be a team member
    const organization = user.organizations || user.teamMember?.organization;
    if (!organization) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 404 });
    }

    const organizationId = organization.id;
    console.log('Analytics API: Found organizationId:', organizationId, 'for organization:', organization.companyName);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    // Base analytics for all dashboard types
    const [
      totalBatches,
      totalProducts,
      totalUnits,
      recentBatches,
      batchStatusStats,
      unitStatusStats,
      scanStats,
      transferStats,
      counterfeitReports,
      teamMembersCount
    ] = await Promise.all([
      // Total batches for this organization
      prisma.medicationBatch.count({
        where: { organizationId }
      }),

      // Total products for this organization
      prisma.product.count({
        where: { organizationId, isActive: true }
      }),

      // Total units across all batches for this organization
      prisma.medicationUnit.count({
        where: {
          batch: { organizationId }
        }
      }),

      // Recent batches with counts
      prisma.medicationBatch.findMany({
        where: { 
          organizationId,
          createdAt: { gte: startDate }
        },
        include: {
          _count: { 
            select: { 
              medicationUnits: true, 
              scanHistory: true 
            } 
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Batch status distribution
      prisma.medicationBatch.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: { status: true }
      }),

      // Unit status distribution - only units from this organization's batches
      prisma.medicationUnit.groupBy({
        by: ['status'],
        where: {
          batch: { organizationId }
        },
        _count: { status: true }
      }),

      // Scan statistics - only scans from this organization's batches
      prisma.scanHistory.groupBy({
        by: ['scanResult'],
        where: {
          batch: { organizationId },
          scanDate: { gte: startDate }
        },
        _count: { scanResult: true }
      }),

      // Transfer statistics based on dashboard type
      dashboardType === 'manufacturer' 
        ? prisma.ownershipTransfer.groupBy({
            by: ['status'],
            where: {
              fromOrgId: organizationId,
              transferDate: { gte: startDate }
            },
            _count: { status: true }
          })
        : prisma.ownershipTransfer.groupBy({
            by: ['status'],
            where: {
              toOrgId: organizationId,
              transferDate: { gte: startDate }
            },
            _count: { status: true }
          }),

      // Counterfeit reports for this organization's batches
      prisma.counterfeitReport.count({
        where: {
          batch: { organizationId },
          createdAt: { gte: startDate }
        }
      }),

      // Team members count
      prisma.teamMember.count({
        where: { organizationId, isActive: true }
      })
    ]);

    // Get daily scan activity with genuine vs suspicious breakdown
    const dailyScans = await prisma.scanHistory.findMany({
      where: {
        batch: { organizationId },
        scanDate: { gte: startDate, lte: endDate }
      },
      select: {
        scanDate: true,
        scanResult: true
      }
    });

    // Process daily activity data
    const dailyActivityMap = new Map<string, { date: string, count: number, genuine: number, suspicious: number }>();
    
    dailyScans.forEach(scan => {
      const dateStr = scan.scanDate.toISOString().split('T')[0];
      if (!dailyActivityMap.has(dateStr)) {
        dailyActivityMap.set(dateStr, { date: dateStr, count: 0, genuine: 0, suspicious: 0 });
      }
      const dayData = dailyActivityMap.get(dateStr)!;
      dayData.count++;
      if (scan.scanResult === 'GENUINE') dayData.genuine++;
      if (scan.scanResult === 'SUSPICIOUS') dayData.suspicious++;
    });

    const processedDailyActivity = Array.from(dailyActivityMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Recent transfers for this organization
    const recentTransfers = await prisma.ownershipTransfer.findMany({
      where: dashboardType === 'manufacturer' 
        ? { fromOrgId: organizationId, transferDate: { gte: startDate } }
        : { toOrgId: organizationId, transferDate: { gte: startDate } },
      include: {
        batch: { 
          select: { 
            drugName: true, 
            batchId: true 
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
      orderBy: { transferDate: 'desc' },
      take: 10
    });

    // Organization-specific metrics
    let specificMetrics = {};

    if (dashboardType === 'manufacturer') {
      try {
        // Manufacturer-specific metrics: production efficiency, batch sizes, expiry tracking
        const [avgBatchSize, expiringBatches] = await Promise.all([
          // Average batch size for this manufacturer
          prisma.medicationBatch.aggregate({
            where: { organizationId },
            _avg: { batchSize: true }
          }),
          
          // Batches expiring in the next 90 days
          prisma.medicationBatch.count({
            where: {
              organizationId,
              expiryDate: {
                gte: new Date(),
                lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
              }
            }
          })
        ]);

        specificMetrics = {
          avgBatchSize: Math.round(avgBatchSize._avg.batchSize || 0),
          expiringBatches: expiringBatches || 0
        };
      } catch (error) {
        console.error('Error fetching manufacturer-specific metrics:', error);
        specificMetrics = {
          avgBatchSize: 0,
          expiringBatches: 0
        };
      }
    } else if (dashboardType === 'hospital') {
      try {
        // Hospital-specific metrics: received batches, patient safety indicators
        const [
          receivedBatches,
          suspiciousScansCount,
          uniqueDrugsReceived,
          patientVerifications
        ] = await Promise.all([
          // Total batches received via transfers
          prisma.ownershipTransfer.count({
            where: {
              toOrgId: organizationId,
              status: 'COMPLETED'
            }
          }),
          
          // Suspicious scans in timeframe (patient safety indicator)
          prisma.scanHistory.count({
            where: {
              batch: { organizationId },
              scanResult: 'SUSPICIOUS',
              scanDate: { gte: startDate }
            }
          }),

          // Unique drug types received
          prisma.medicationBatch.groupBy({
            by: ['drugName'],
            where: { organizationId },
            _count: { drugName: true }
          }).then(result => result.length),

          // Patient verification scans (safety checks)
          prisma.scanHistory.count({
            where: {
              batch: { organizationId },
              scanDate: { gte: startDate }
            }
          })
        ]);

        specificMetrics = {
          receivedBatches: receivedBatches || 0,
          suspiciousScansCount: suspiciousScansCount || 0,
          uniqueDrugsReceived: uniqueDrugsReceived || 0,
          patientVerifications: patientVerifications || 0
        };
      } catch (error) {
        console.error('Error fetching hospital-specific metrics:', error);
        specificMetrics = {
          receivedBatches: 0,
          suspiciousScansCount: 0,
          uniqueDrugsReceived: 0,
          patientVerifications: 0
        };
      }
    }

    // Format response
    const analytics = {
      overview: {
        totalBatches: totalBatches || 0,
        totalProducts: totalProducts || 0,
        totalUnits: totalUnits || 0,
        teamMembersCount: teamMembersCount || 0,
        counterfeitReports: counterfeitReports || 0
      },
      distributions: {
        batchStatus: (batchStatusStats || []).map((stat: any) => ({
          status: stat.status,
          count: stat._count?.status || 0
        })),
        unitStatus: (unitStatusStats || []).map((stat: any) => ({
          status: stat.status,
          count: stat._count?.status || 0
        })),
        scanResults: (scanStats || []).map((stat: any) => ({
          result: stat.scanResult,
          count: stat._count?.scanResult || 0
        })),
        transferStatus: (transferStats || []).map((stat: any) => ({
          status: stat.status,
          count: stat._count?.status || 0
        }))
      },
      trends: {
        dailyActivity: processedDailyActivity || [],
        recentBatches: (recentBatches || []).map((batch) => ({
          id: batch.id,
          batchId: batch.batchId,
          drugName: batch.drugName,
          status: batch.status,
          createdAt: batch.createdAt.toISOString(),
          unitsCount: batch._count?.medicationUnits || 0,
          scansCount: batch._count?.scanHistory || 0
        }))
      },
      transfers: {
        recent: (recentTransfers || []).map((transfer) => ({
          id: transfer.id,
          batchId: transfer.batch?.batchId || 'N/A',
          drugName: transfer.batch?.drugName || 'Unknown',
          from: transfer.fromOrg?.companyName || 'Unknown',
          to: transfer.toOrg?.companyName || 'Unknown', 
          status: transfer.status,
          date: transfer.transferDate.toISOString()
        }))
      },
      organizationType: organization.organizationType,
      specificMetrics: specificMetrics || {},
      timeRange: parseInt(timeRange),
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}