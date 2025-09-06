// /app/api/batches/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      organizationId,
      drugName,
      composition,
      batchSize,
      manufacturingDate,
      expiryDate,
      storageInstructions,
    } = body;

    if (!organizationId || !drugName || !batchSize || !manufacturingDate || !expiryDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const batchId = `BATCH-${Date.now()}${nanoid(5)}`;
    // ✅ create batch
    const newBatch = await prisma.medicationBatch.create({
      data: {
        batchId: batchId,
        organizationId,
        drugName,
        composition,
        batchSize: parseInt(batchSize, 10),
        manufacturingDate: new Date(manufacturingDate),
        expiryDate: new Date(expiryDate),
        storageInstructions,
      },
    });

    // ✅ generate random serial numbers for each unit
    const units = Array.from({ length: parseInt(batchSize, 10) }).map(() => ({
      batchId: newBatch.id,
      serialNumber: `UNIT-${batchId}-${nanoid(16)}`,
    }));

    await prisma.medicationUnit.createMany({
      data: units,
    });

    return NextResponse.json(
      { ...newBatch, unitsCreated: units.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 });
  }
}
