// app/api/batches/[orgId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgId: string }> } // <- note Promise
) {
  try {
    const { orgId } = await params; // ✅ must await

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const batches = await prisma.medicationBatch.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { medicationUnits: true },
        },
      },
    });

    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}
