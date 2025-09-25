import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the regulator organization for this user
    const organization = await prisma.organization.findFirst({
      where: {
        organizationType: "REGULATOR",
        OR: [
          { adminId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      }
    });

    if (!organization) {
      return NextResponse.json({ error: "Regulator organization not found or access denied" }, { status: 403 });
    }

    // Get all counterfeit reports (investigations)
    const investigations = await prisma.counterfeitReport.findMany({
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true,
            organization: {
              select: {
                companyName: true,
                organizationType: true,
                contactEmail: true
              }
            }
          }
        },
        consumers: {
          select: {
            fullName: true,
            phoneNumber: true,
            address: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ investigations });

  } catch (error) {
    console.error("Error fetching investigations:", error);
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

    // Find the regulator organization for this user
    const organization = await prisma.organization.findFirst({
      where: {
        organizationType: "REGULATOR",
        OR: [
          { adminId: userId },
          { teamMembers: { some: { userId: userId } } }
        ]
      }
    });

    if (!organization) {
      return NextResponse.json({ error: "Regulator organization not found or access denied" }, { status: 403 });
    }

    const { batchId, reportType, severity, description, location, evidence } = await request.json();

    // Create new investigation (counterfeit report)
    const investigation = await prisma.counterfeitReport.create({
      data: {
        batchId,
        reporterId: userId, // For regulator-initiated investigations, use userId
        reportType,
        severity,
        description,
        location,
        evidence: evidence || [],
        status: "INVESTIGATING",
        investigatorId: userId
      },
      include: {
        batch: {
          select: {
            batchId: true,
            drugName: true,
            organization: {
              select: {
                companyName: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ investigation });

  } catch (error) {
    console.error("Error creating investigation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}