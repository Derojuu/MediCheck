import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const batch = await prisma.medicationBatch.findUnique({
      where: { id: params.id },
      include: { medicationUnits: true },
    });

    if (!batch)
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    return NextResponse.json(batch);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch batch" },
      { status: 500 }
    );
  }
}
