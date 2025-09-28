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

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    // Get expiring medication batches
    const expiringMedications = await prisma.medicationBatch.findMany({
      where: {
        organizationId: orgId,
        expiryDate: {
          lte: thirtyDaysFromNow,
          gte: now
        },
        status: {
          in: ["DELIVERED", "IN_TRANSIT", "CREATED"]
        }
      },
      select: {
        id: true,
        batchId: true,
        drugName: true,
        expiryDate: true,
        batchSize: true
      },
      orderBy: {
        expiryDate: "asc"
      }
    });

    const expiringWithin10Days = expiringMedications.filter(batch =>
      new Date(batch.expiryDate) <= tenDaysFromNow
    );
    const expiringWithin30Days = expiringMedications.filter(batch =>
      new Date(batch.expiryDate) > tenDaysFromNow
    );

    const response = {
      criticalAlerts: [],
      expiryWarnings: {
        urgent: expiringWithin10Days.map(batch => ({
          id: batch.id,
          type: "expiry_urgent",
          title: "Medication expiring within 10 days",
          description: `${batch.drugName} (Batch: ${batch.batchId}) - ${batch.batchSize} units`,
          expiryDate: batch.expiryDate,
          daysUntilExpiry: Math.ceil((new Date(batch.expiryDate).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        })),
        warning: expiringWithin30Days.map(batch => ({
          id: batch.id,
          type: "expiry_warning",
          title: "Medication expiring within 30 days",
          description: `${batch.drugName} (Batch: ${batch.batchId}) - ${batch.batchSize} units`,
          expiryDate: batch.expiryDate,
          daysUntilExpiry: Math.ceil((new Date(batch.expiryDate).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        }))
      },
      systemNotifications: [],
      suspiciousActivity: []
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching hospital alerts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
}