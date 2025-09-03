import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const units = await prisma.medicationUnit.findMany({
      where: { batchId: params.id },
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
