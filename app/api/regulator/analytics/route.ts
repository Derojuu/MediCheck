import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create User record
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          userRole: "SUPER_ADMIN",
          isActive: true
        }
      });
    }

    // Find the regulator organization for this user
    let organization = await prisma.organization.findFirst({
      where: {
        organizationType: "REGULATOR",
        OR: [
          { adminId: user.id },
          { teamMembers: { some: { userId: user.id } } }
        ]
      }
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          adminId: user.id,
          organizationType: "REGULATOR",
          companyName: "Regulatory Authority",
          contactEmail: "regulator@authority.gov",
          address: "Regulatory Building",
          country: "Nigeria",
          agencyName: "NAFDAC",
          officialId: `REG-${Date.now()}`,
          isVerified: true,
          isActive: true
        }
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Analytics data for reports
    const analytics = {
      // Scan activities by organization type
      scansByOrgType: await prisma.scanHistory.groupBy({
        by: ['region'],
        where: {
          scanDate: { gte: startOfMonth }
        },
        _count: {
          id: true
        }
      }),

      // Counterfeit reports by severity
      counterfeitBySeverity: await prisma.counterfeitReport.groupBy({
        by: ['severity'],
        where: {
          createdAt: { gte: startOfMonth }
        },
        _count: {
          id: true
        }
      }),

      // Monthly trends for investigations
      monthlyInvestigations: await prisma.counterfeitReport.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startOfYear }
        },
        _count: {
          id: true
        }
      }),

      // Organization verification status
      organizationStats: await prisma.organization.groupBy({
        by: ['organizationType', 'isVerified'],
        where: {
          organizationType: { not: 'REGULATOR' }
        },
        _count: {
          id: true
        }
      }),

      // Transfer status distribution
      transferStats: await prisma.ownershipTransfer.groupBy({
        by: ['status'],
        where: {
          transferDate: { gte: startOfMonth }
        },
        _count: {
          id: true
        }
      }),

      // Batch status overview
      batchStats: await prisma.medicationBatch.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      }),

      // Geographic distribution of scans
      scansByRegion: await prisma.scanHistory.groupBy({
        by: ['region'],
        where: {
          scanDate: { gte: startOfMonth },
          region: { not: null }
        },
        _count: {
          id: true
        }
      }),

      // Summary statistics
      summary: {
        totalOrganizations: await prisma.organization.count({
          where: { organizationType: { not: 'REGULATOR' } }
        }),
        verifiedOrganizations: await prisma.organization.count({
          where: { 
            organizationType: { not: 'REGULATOR' },
            isVerified: true 
          }
        }),
        totalBatches: await prisma.medicationBatch.count(),
        totalScans: await prisma.scanHistory.count({ 
          where: { scanDate: { gte: startOfMonth } } 
        }),
        totalInvestigations: await prisma.counterfeitReport.count(),
        activeInvestigations: await prisma.counterfeitReport.count({
          where: { status: { in: ['PENDING', 'INVESTIGATING'] } }
        }),
        resolvedInvestigations: await prisma.counterfeitReport.count({
          where: { status: 'RESOLVED' }
        })
      }
    };

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}