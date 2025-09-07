// /app/api/batches/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { createBatchRegistry, registerUnitOnBatch } from "@/lib/hedera";
import { generateQRPayload } from "@/lib/qrPayload";

export const runtime = "nodejs";

const QR_SECRET = process.env.QR_SECRET || "dev-secret"; // 🔒 store in env

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

    if (
      !organizationId ||
      !drugName ||
      !batchSize ||
      !manufacturingDate ||
      !expiryDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Check organization exists
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const batchId = `BATCH-${Date.now()}${nanoid(5)}`;

    // ✅ Step 1: create registry for batch on Hedera
    const registry = await createBatchRegistry(batchId);
    if (!registry.success || !registry.topicId) {
      return NextResponse.json(
        { error: "Failed to create registry on Hedera" },
        { status: 500 }
      );
    }

    // ✅ Step 2: save batch in DB
    const newBatch = await prisma.medicationBatch.create({
      data: {
        batchId,
        organizationId,
        drugName,
        composition,
        batchSize: parseInt(batchSize, 10),
        manufacturingDate: new Date(manufacturingDate),
        expiryDate: new Date(expiryDate),
        storageInstructions,
        registryTopicId: registry.topicId,
      },
    });

    // ✅ Step 3: create units & publish them to Hedera
    const unitsData: {
      serialNumber: string;
      batchId: string;
      registrySequence: number;
    }[] = [];

    const qrPayloads: any[] = [];

    for (let i = 0; i < parseInt(batchSize, 10); i++) {
      const serialNumber = `UNIT-${batchId}-${nanoid(16)}`;

      const seq = await registerUnitOnBatch(registry.topicId, {
        serialNumber,
        drugName,
        batchId,
      });

      unitsData.push({
        serialNumber,
        batchId: newBatch.id,
        registrySequence: seq,
      });

      const qr = generateQRPayload(serialNumber, batchId, seq, QR_SECRET);
      qrPayloads.push(qr);
    }

    await prisma.medicationUnit.createMany({ data: unitsData });

    return NextResponse.json(
      {
        batch: newBatch,
        unitsCreated: unitsData.length,
        qrPayloads, // 🟢 return QR payloads for client to render QR codes
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { error: "Failed to create batch" },
      { status: 500 }
    );
  }
}
