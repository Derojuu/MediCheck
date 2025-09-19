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

    // Get verification statistics for the last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const monthlyStats = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthName = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      const verifications = await prisma.scanHistory.count({
        where: {
          teamMember: {
            organizationId: orgId
          },
          scanDate: {
            gte: monthStart,
            lt: monthEnd
          },
          scanResult: "GENUINE"
        }
      });

      const suspiciousScans = await prisma.scanHistory.count({
        where: {
          teamMember: {
            organizationId: orgId
          },
          scanDate: {
            gte: monthStart,
            lt: monthEnd
          },
          scanResult: {
            in: ["SUSPICIOUS", "COUNTERFEIT"]
          }
        }
      });

      monthlyStats.push({
        month: monthName,
        verifications,
        suspiciousScans
      });
    }

    // Calculate growth percentage
    const currentMonth = monthlyStats[monthlyStats.length - 1];
    const previousMonth = monthlyStats[monthlyStats.length - 2];
    
    let growthPercentage = 0;
    if (previousMonth && previousMonth.verifications > 0) {
      growthPercentage = Math.round(
        ((currentMonth.verifications - previousMonth.verifications) / previousMonth.verifications) * 100
      );
    } else if (currentMonth.verifications > 0) {
      growthPercentage = 100;
    }

    // Get recent counterfeit reports for this hospital
    const recentReports = await prisma.counterfeitReport.findMany({
      where: {
        batch: {
          organizationId: orgId
        },
        createdAt: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });

    const response = {
      monthlyStats,
      growthPercentage,
      recentReports: recentReports.map(report => ({
        id: report.id,
        batchId: report.batch?.batchId || "Unknown",
        drugName: report.batch?.drugName || "Unknown",
        reportType: report.reportType,
        severity: report.severity,
        status: report.status,
        description: report.description,
        createdAt: report.createdAt
      }))
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching hospital reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orgId, batchId, reportType, severity, description, location, evidence } = body;

    if (!orgId || !reportType || !severity || !description) {
      return NextResponse.json({ 
        error: "Missing required fields: orgId, reportType, severity, description" 
      }, { status: 400 });
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

    // Get the user's consumer profile to use as reporter
    const consumer = await prisma.consumer.findFirst({
      where: {
        userId: userId
      }
    });

    if (!consumer) {
      return NextResponse.json({ error: "Consumer profile not found" }, { status: 404 });
    }

    // Create the counterfeit report
    const report = await prisma.counterfeitReport.create({
      data: {
        batchId: batchId || null,
        reporterId: consumer.id,
        reportType,
        severity,
        description,
        location: location || null,
        evidence: evidence || [],
        status: "PENDING"
      }
    });

    return NextResponse.json({
      message: "Counterfeit report submitted successfully",
      reportId: report.id
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting counterfeit report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}