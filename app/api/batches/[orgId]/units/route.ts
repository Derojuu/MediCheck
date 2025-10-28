// /app/api/batches/[orgId]/units/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { orgId: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { orgId } = await params;

    const units = await prisma.medicationUnit.findMany({
      where: { batchId: orgId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(units);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}
