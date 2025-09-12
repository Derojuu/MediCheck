import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { createBatchRegistry, registerUnitOnBatch, logBatchEvent } from "@/lib/hedera";
import { generateQRPayload , generateBatchQRPayload} from "@/lib/qrPayload";

export const runtime = "nodejs";

console.log(prisma)

const QR_SECRET = process.env.QR_SECRET || "dev-secret"; 

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

    const qrBatchPayload = generateBatchQRPayload(
      batchId,
      QR_SECRET,
      BASE_URL,
      registry.topicId
    );

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
        qrCodeData: qrBatchPayload.url,
        qrSignature: qrBatchPayload.signature,
      },
    });

    // Log the batch creation event to Hedera
    const eventSeq = await logBatchEvent(registry.topicId, "BATCH_CREATED", {
      batchId,
      organizationId,
      drugName,
      batchSize,
      manufacturingDate,
      expiryDate,
    });

    await prisma.batchEvent.create({
      data: {
        batchId: newBatch.id,
        eventType: "BATCH_CREATED",
        hederaSeq: eventSeq || 0,
        payload: {
          batchId,
          organizationId,
          drugName,
          batchSize,
          manufacturingDate,
          expiryDate,
        },
      },
    });

    // ✅ Step 3: create units & publish them to Hedera
    const unitsData: any[] = [];

    for (let i = 0; i < parseInt(batchSize, 10); i++) {

      const unitNumber = String(i + 1).padStart(4, "0");

      const randomSuffix = nanoid(3);

      const serialNumber = `UNIT-${batchId}-${unitNumber}${randomSuffix}`;

      const seq = await registerUnitOnBatch(registry.topicId, {
        serialNumber,
        drugName,
        batchId,
      });

      const qrUnitPayload = generateQRPayload(
        serialNumber,
        batchId,
        seq,
        QR_SECRET,
        BASE_URL
      );

      console.log("unit", qrUnitPayload);

      unitsData.push({
        serialNumber,
        batchId: newBatch.id,
        registrySequence: seq,
        qrCode: qrUnitPayload.url,
        qrSignature: qrUnitPayload.signature,
      });
    }

    await prisma.medicationUnit.createMany({ data: unitsData });

    return NextResponse.json(
      {
        batch: newBatch,
        unitsCreated: unitsData.length,
      },
      { status: 201 }
    );
  }
  catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { error: "Failed to create batch" },
      { status: 500 }
    );
  }
}
