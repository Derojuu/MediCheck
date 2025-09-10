// /app/api/organizations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/organizations
 * Returns a list of all organizations
 */
export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
    //   include: {
    //     // medicationBatches: true,
    //     transfersFrom: true,
    //     transfersTo: true,
    //     teamMembers: true,
    //   },
    });

    return NextResponse.json(organizations, { status: 200 });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
