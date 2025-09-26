import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if User record exists
    let user = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          userRole: "CONSUMER"
        }
      });
    }

    // Find the regulator organization for this user (same approach as settings API)
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
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Active Investigations (counterfeit reports that are pending or investigating)
    const activeInvestigations = await prisma.counterfeitReport.count({
      where: {
        status: {
          in: ["PENDING", "INVESTIGATING"]
        }
      }
    });

    // Calculate investigation growth (this month vs last month)
    const thisMonthInvestigations = await prisma.counterfeitReport.count({
      where: {
        createdAt: { gte: startOfMonth },
        status: { in: ["PENDING", "INVESTIGATING"] }
      }
    });

    const lastMonthInvestigations = await prisma.counterfeitReport.count({
      where: {
        createdAt: { 
          gte: lastMonthStart,
          lt: startOfMonth
        },
        status: { in: ["PENDING", "INVESTIGATING"] }
      }
    });

    const investigationGrowth = lastMonthInvestigations > 0 
      ? Math.round(((thisMonthInvestigations - lastMonthInvestigations) / lastMonthInvestigations) * 100)
      : thisMonthInvestigations > 0 ? 100 : 0;

    // 2. Compliance Checks (total scan activities this month)
    const complianceChecks = await prisma.scanHistory.count({
      where: {
        scanDate: { gte: startOfMonth }
      }
    });

    // Calculate compliance growth
    const lastMonthScans = await prisma.scanHistory.count({
      where: {
        scanDate: { 
          gte: lastMonthStart,
          lt: startOfMonth
        }
      }
    });

    const complianceGrowth = lastMonthScans > 0 
      ? Math.round(((complianceChecks - lastMonthScans) / lastMonthScans) * 100)
      : complianceChecks > 0 ? 100 : 0;

    // 3. Pending Reviews (pending ownership transfers that need regulatory approval)
    const pendingReviews = await prisma.ownershipTransfer.count({
      where: {
        status: "PENDING"
      }
    });

    // Calculate pending review change
    const lastMonthPending = await prisma.ownershipTransfer.count({
      where: {
        transferDate: { 
          gte: lastMonthStart,
          lt: startOfMonth
        },
        status: "PENDING"
      }
    });

    const pendingGrowth = lastMonthPending > 0 
      ? Math.round(((pendingReviews - lastMonthPending) / lastMonthPending) * 100)
      : pendingReviews > 0 ? 100 : 0;

    // 4. Violations Found (counterfeit reports marked as RESOLVED this month)
    const violationsFound = await prisma.counterfeitReport.count({
      where: {
        status: { in: ["RESOLVED", "ESCALATED"] },
        updatedAt: { gte: startOfMonth }
      }
    });

    // Calculate violations change
    const lastMonthViolations = await prisma.counterfeitReport.count({
      where: {
        status: { in: ["RESOLVED", "ESCALATED"] },
        updatedAt: { 
          gte: lastMonthStart,
          lt: startOfMonth
        }
      }
    });

    const violationChange = violationsFound - lastMonthViolations;

    const stats = {
      activeInvestigations,
      investigationGrowth,
      complianceChecks,
      complianceGrowth,
      pendingReviews,
      pendingGrowth,
      violationsFound,
      violationChange
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Error fetching regulator stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}