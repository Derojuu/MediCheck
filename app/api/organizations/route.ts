import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Get all organizations (for transfer destination selection)
export async function GET(req: Request) {
  try {
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        companyName: true,
        organizationType: true,
        contactEmail: true,
        isActive: true
      },
      where: {
        isActive: true,
        isVerified: true
      },
      orderBy: {
        companyName: 'asc'
      }
    });

    return NextResponse.json({
      organizations
    }, { status: 200 });

  } catch (error) {
    console.error("Get Organizations Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve organizations" },
      { status: 500 }
    );
  }
}
