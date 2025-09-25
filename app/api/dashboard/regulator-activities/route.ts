import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists
    let user = await prisma.user.findFirst({
      where: { clerkUserId: userId }
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          userRole: "CONSUMER"
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
      // Auto-create a regulator organization for this user
      organization = await prisma.organization.create({
        data: {
          adminId: user.id,
          organizationType: "REGULATOR",
          companyName: "NAFDAC Regulatory Authority",
          contactEmail: "regulator@nafdac.gov.ng",
          contactPhone: "+234-1-234-5678",
          address: "NAFDAC Headquarters, Abuja",
          country: "Nigeria",
          state: "FCT",
          isVerified: true
        }
      });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get recent counterfeit reports
    const recentReports = await prisma.counterfeitReport.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      include: {
        batch: {
          include: {
            organization: { select: { companyName: true } }
          }
        },
        consumers: { select: { fullName: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    // Get recent ownership transfers
    const recentTransfers = await prisma.ownershipTransfer.findMany({
      where: { transferDate: { gte: sevenDaysAgo } },
      include: {
        batch: { select: { batchId: true, drugName: true } },
        fromOrg: { select: { companyName: true } },
        toOrg: { select: { companyName: true } }
      },
      orderBy: { transferDate: "desc" },
      take: 5
    });

    // Get recent scan history
    const recentScans = await prisma.scanHistory.findMany({
      where: { scanDate: { gte: sevenDaysAgo } },
      include: {
        batch: {
          include: {
            organization: { select: { companyName: true } }
          }
        },
        teamMember: {
          include: {
            organization: { select: { companyName: true } }
          }
        }
      },
      orderBy: { scanDate: "desc" },
      take: 3
    });

    // Format activities into a unified structure
    const activities: Array<{
      id: string;
      type: string;
      target: string;
      status: string;
      priority: string;
      time: string;
      inspector: string;
      findings: string;
      date: Date;
    }> = [];

    // Add counterfeit reports as investigations
    recentReports.forEach(report => {
      const timeDiff = now.getTime() - report.createdAt.getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      const timeText = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;

      // Defensive: Try to show org, then drug, then batchId, then fallback
      let target = "Unknown Organization";
      if (report.batch?.organization?.companyName) {
        target = report.batch.organization.companyName;
      } else if (report.batch?.drugName) {
        target = report.batch.drugName;
      } else if (report.batch?.batchId) {
        target = `Batch ${report.batch.batchId}`;
      }

      activities.push({
        id: `REP-${report.id}`,
        type: "Investigation",
        target,
        status: report.status.toLowerCase(),
        priority: report.severity === "CRITICAL" ? "high" : report.severity === "HIGH" ? "medium" : "low",
        time: timeText,
        inspector: report.consumers?.fullName || "System",
        findings: `${report.batch?.drugName || "Unknown Drug"} - ${report.description}`,
        date: report.createdAt
      });
    });

    // Add transfers as compliance reviews
    recentTransfers.forEach(transfer => {
      const timeDiff = now.getTime() - transfer.transferDate.getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      const timeText = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;

      // Defensive: Show both orgs, fallback to "Unknown"
      const fromOrg = transfer.fromOrg?.companyName || "Unknown";
      const toOrg = transfer.toOrg?.companyName || "Unknown";

      activities.push({
        id: `TRF-${transfer.id}`,
        type: "Compliance Review",
        target: `${fromOrg} → ${toOrg}`,
        status: transfer.status.toLowerCase(),
        priority: "medium",
        time: timeText,
        inspector: "System Review",
        findings: `Transfer of ${transfer.batch?.drugName || "medication"}`,
        date: transfer.transferDate
      });
    });

    // Add scans as inspections
    recentScans.forEach(scan => {
      const timeDiff = now.getTime() - scan.scanDate.getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      const timeText = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;

      // Always prefer team member's org, then batch org, then fallback
      let target =
        scan.teamMember?.organization?.companyName ||
        scan.batch?.organization?.companyName ||
        scan.batch?.drugName ||
        scan.batch?.batchId ||
        "Unknown Organization";

      activities.push({
        id: `SCN-${scan.id}`,
        type: "Inspection",
        target,
        status: scan.scanResult === "GENUINE" ? "completed" : "flagged",
        priority: scan.scanResult === "SUSPICIOUS" ? "high" : "low",
        time: timeText,
        inspector: scan.teamMember?.organization?.companyName || "Inspector",
        findings: `${scan.batch?.drugName || "Drug"} verification - ${scan.scanResult}`,
        date: scan.scanDate
      });
    });

    // Sort all activities by date and take the most recent ones
    const sortedActivities = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    return NextResponse.json(sortedActivities);

  } catch (error) {
    console.error("Error fetching regulator activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}