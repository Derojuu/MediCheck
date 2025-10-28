// pages/api/batches/create.ts (or app/api/register/route.ts - adapt path)
if (process.env.NODE_ENV === "production") {
  process.env.PINO_PRETTY_DISABLE = "true";
}

import "@/lib/logPatch";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import {
  registerUnitOnBatch,
  createBatchRegistry,
  logBatchEvent,
} from "@/lib/hedera";
import {
  generateQRPayload,
  generateBatchQRPayload,
} from "@/lib/qrPayload";
import { hedera10Client } from "@/lib/hedera10Client"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QR_SECRET = process.env.QR_SECRET || "dev-secret";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
// concurrency for registering units to avoid huge parallel calls
const UNIT_REG_CONCURRENCY = parseInt(process.env.UNIT_REG_CONCURRENCY || "10", 10);

export async function POST(req: Request) {
  console.log("Batch creation endpoint entered");

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
      // creatorAgentAccountId,
    } = body;

    // Validate
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

    // Load organization
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { organizationAgent : true},
    });
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Create batchId
    const batchId = `BATCH-${Date.now()}${nanoid(5)}`;

    const registryTopicId = await createBatchRegistry(batchId, org.id, drugName);

    // Sign & build batch QR payload (for printed packaging)
    const qrBatchPayload = generateBatchQRPayload(batchId, QR_SECRET, BASE_URL, registryTopicId.topicId as string );

    // Save batch metadata in DB (master record)
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
        registryTopicId: registryTopicId.topicId ?? null,
        qrCodeData: qrBatchPayload.url,
        qrSignature: qrBatchPayload.signature,
      },
    });

    // Log canonical batch creation event to HCS-2 registry
    const eventSeq = await logBatchEvent(registryTopicId?.topicId as string, "BATCH_CREATED", {
      batchId,
      organizationId,
      drugName,
      batchSize,
      manufacturingDate,
      expiryDate,
    });

    // store an off-chain event record
    await prisma.batchEvent.create({
      data: {
        batchId: newBatch.id,
        eventType: "BATCH_CREATED",
        hederaSeq: eventSeq ?? 0,
        payload: {
          batchId,
          organizationId,
          drugName,
          batchSize,
          manufacturingDate,
          expiryDate,
        },
        region: org?.state ?? "",
      },
    });

    // ANNOUNCE via HCS-10 outbound topic if creatorAgentAccountId provided
    // Expect that creatorAgentAccountId maps to a stored agent with outboundTopic in DB
    if (org.organizationAgent?.id) {
      try {
        const agent = org.organizationAgent
        if (agent?.outboundTopic) {
          await hedera10Client.sendMessage(
            agent.outboundTopic,
            JSON.stringify({
              p: "hcs-10",
              op: "announce_batch",
              batch_id: batchId,
              registry_topic: registryTopicId,
              status: "registered",
            }),
            "Batch creation announcement"
          );
          console.log(
            "Announced batch on agent outbound topic:",
            agent.outboundTopic
          );
        } else {
          console.warn(
            "creatorAgentAccountId provided but agent not found or outboundTopic missing"
          );
        }
      } catch (e) {
        console.warn(
          "Failed to announce to HCS-10 outbound topic (non-fatal):",
          e
        );
      }
    }

    // Step: create & register units in HCS-2 (parallel with concurrency)
    const unitsData: Array<any> = [];
    const totalUnits = parseInt(batchSize, 10);

    // concurrency limiter helper (simple implementation if p-limit not installed)
    const limit = (fn: () => Promise<any>) => {
      // naive pool using Promise.all with chunks
      return fn();
    };

    // If p-limit is available in your project, prefer:
    // const limiter = pLimit(UNIT_REG_CONCURRENCY);
    const concurrency = UNIT_REG_CONCURRENCY > 0 ? UNIT_REG_CONCURRENCY : 10;

    // chunking approach to throttle registrations
    async function runInBatches<T>(items: T[], batchSize: number, worker: (item: T) => Promise<any>) {
      for (let i = 0; i < items.length; i += batchSize) {
        const chunk = items.slice(i, i + batchSize);
        await Promise.all(chunk.map(worker));
      }
    }

    const unitIndexes = Array.from({ length: totalUnits }, (_, i) => i);

    await runInBatches<number>(unitIndexes, concurrency, async (i) => {
      const unitNumber = String(i + 1).padStart(4, "0");
      const randomSuffix = nanoid(3);
      const serialNumber = `UNIT-${batchId}-${unitNumber}${randomSuffix}`;

      // register entry on HCS-2 registry
      const seq = await registerUnitOnBatch(registryTopicId?.topicId as string, {
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

      unitsData.push({
        serialNumber,
        batchId: newBatch.id,
        registrySequence: seq,
        qrCode: qrUnitPayload.url,
        qrSignature: qrUnitPayload.signature,
      });
    });

    // bulk insert units to DB
    if (unitsData.length > 0) {
      await prisma.medicationUnit.createMany({ data: unitsData });
    }

    const unitsRegisteredSeq = await logBatchEvent(
      registryTopicId?.topicId as string,
      "BATCH_UNITS_REGISTERED",
      {
        batchId,
        organizationId: org.id,
        units: unitsData.map((u) => u.serialNumber),
        count: unitsData.length,
      }
    );

    await prisma.batchEvent.create({
      data: {
        batchId: newBatch.id,
        eventType: "BATCH_UNITS_REGISTERED",
        hederaSeq: unitsRegisteredSeq ?? 0,
        payload: { units: unitsData.map((u) => u.serialNumber) },
        region: org?.state ?? "",
      },
    });

    if (org.managedRegistry) {
      await hedera10Client.sendMessage(
        org.managedRegistry,
        JSON.stringify({
          type: "BATCH_CREATED",
          orgId: organizationId,
          batchId,
          drugName,
          timestamp: new Date().toISOString(),
          topicId: registryTopicId?.topicId as string,
        }),
        "New batch announcement"
      );

      console.log(
        `📢 Announced new batch ${batchId} on managed registry ${org.managedRegistry}`
      );
    }
    else {
      console.warn("⚠️ Organization has no managed registry to announce batch");
    }


    // Final response
    return NextResponse.json(
      {
        batch: newBatch,
        unitsCreated: unitsData.length,
        registryTopicId,
        batchEventSeq: eventSeq,
      },
      { status: 201 }
    );
  }
  catch (error) {
    console.error("Error creating batch v2:", error);
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 });
  }
}
