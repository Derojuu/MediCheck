import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");
    const period = searchParams.get("period") || "monthly"; // monthly, weekly, daily

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Get transfers from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transfers = await prisma.ownershipTransfer.findMany({
      where: {
        OR: [
          { fromOrgId: orgId },
          { toOrgId: orgId },
        ],
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        fromOrgId: true,
        toOrgId: true,
      },
    });

    // Monthly statistics
    const monthlyStats: { [key: string]: number } = {};
    const statusBreakdown: { [key: string]: number } = {};
    const topDestinations: { [key: string]: number } = {};

    transfers.forEach((transfer) => {
      // Monthly count
      const month = transfer.createdAt.toISOString().slice(0, 7); // YYYY-MM
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;

      // Status breakdown
      statusBreakdown[transfer.status] =
        (statusBreakdown[transfer.status] || 0) + 1;

      // Top destinations (only outgoing)
      if (transfer.fromOrgId === orgId) {
        topDestinations[transfer.toOrgId] =
          (topDestinations[transfer.toOrgId] || 0) + 1;
      }
    });

    // Format monthly stats
    const formattedMonthlyStats = Object.entries(monthlyStats)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    // Format status breakdown
    const formattedStatusBreakdown = Object.entries(statusBreakdown).map(
      ([status, count]) => ({
        status,
        count,
      })
    );

    // Get top destination organization names
    const destinationIds = Object.keys(topDestinations);
    const destinationOrgs = await prisma.organization.findMany({
      where: {
        id: {
          in: destinationIds,
        },
      },
      select: {
        id: true,
        companyName: true,
      },
    });

    const formattedTopDestinations = destinationOrgs
      .map((org) => ({
        organizationId: org.id,
        organizationName: org.companyName,
        transferCount: topDestinations[org.id],
      }))
      .sort((a, b) => b.transferCount - a.transferCount)
      .slice(0, 5); // Top 5

    return NextResponse.json({
      monthlyStats: formattedMonthlyStats,
      statusBreakdown: formattedStatusBreakdown,
      topDestinations: formattedTopDestinations,
      totalTransfers: transfers.length,
    });
  } catch (error) {
    console.error("Error fetching transfer reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfer reports" },
      { status: 500 }
    );
  }
}
