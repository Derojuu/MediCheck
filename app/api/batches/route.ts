// /app/api/batches/route.ts
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

function generateToken(prefix: string) {
  return `${prefix}-${randomBytes(16).toString("hex")}`;
}

export async function GET() {
  try {
    const batches = await prisma.medicationBatch.findMany({
      include: {
        medicationUnits: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}
