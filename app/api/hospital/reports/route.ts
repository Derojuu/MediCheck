import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    // Check if the organization exists and is a hospital
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, organizationType: true }
    });

    if (!organization || organization.organizationType !== "HOSPITAL") {
      return NextResponse.json({ error: "Organization not found or not a hospital" }, { status: 404 });
    }

    // Get verification statistics for the last 6 months
    const now = new Date();
    const monthlyStats = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthName = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      // Count GENUINE scans by team members of this org
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

      // Count SUSPICIOUS scans by team members of this org
      const suspiciousScans = await prisma.scanHistory.count({
        where: {
          teamMember: {
            organizationId: orgId
          },
          scanDate: {
            gte: monthStart,
            lt: monthEnd
          },
          scanResult: "SUSPICIOUS"
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

    // Get recent counterfeit reports for this hospital (reports on batches belonging to this org)
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
        },
        consumers: {
          select: {
            fullName: true
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
        reporter: report.consumers?.fullName || "Unknown",
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
    const body = await request.json();
    const { orgId, batchId, reporterId, reportType, severity, description, location, evidence } = body;

    if (!orgId || !reportType || !severity || !description) {
      return NextResponse.json({
        error: "Missing required fields: orgId, reportType, severity, description"
      }, { status: 400 });
    }

    // Check if the organization exists and is a hospital
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, organizationType: true }
    });

    if (!organization || organization.organizationType !== "HOSPITAL") {
      return NextResponse.json({ error: "Organization not found or not a hospital" }, { status: 404 });
    }

    // If reporterId is provided, check if it exists
    if (reporterId) {
      const consumer = await prisma.consumer.findUnique({
        where: { id: reporterId }
      });
      if (!consumer) {
        return NextResponse.json({ error: "Reporter (consumer) not found" }, { status: 404 });
      }
    }

    // Create the counterfeit report
    const report = await prisma.counterfeitReport.create({
      data: {
        batchId: batchId || null,
        reporterId: reporterId || null,
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