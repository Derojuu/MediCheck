// if (process.env.NODE_ENV === "production") {
//   process.env.PINO_PRETTY_DISABLE = "true";
// }
// import "@/lib/logPatch";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { nanoid } from "nanoid";
// import { createBatchRegistry, registerUnitOnBatch } from "@/lib/hedera";
// import { generateQRPayload, generateBatchQRPayload } from "@/lib/qrPayload";
// import { getAgent, sendAgentMessage } from "@/lib/hcs10.ts";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// const QR_SECRET = process.env.QR_SECRET || "dev-secret";
// const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// export async function POST(req: Request) {
//   console.log("yessss")
//   try {
//     const body = await req.json();
//     const {
//       organizationId,
//       drugName,
//       composition,
//       batchSize,
//       manufacturingDate,
//       expiryDate,
//       storageInstructions,
//     } = body;

//     if (
//       !organizationId ||
//       !drugName ||
//       !batchSize ||
//       !manufacturingDate ||
//       !expiryDate
//     ) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // 1️⃣ Check organization exists
//     const org = await prisma.organization.findUnique({
//       where: { id: organizationId },
//       include: {
//         organizationAgent: true,
//       },
//     });

//     if (!org)
//       return NextResponse.json(
//         { error: "Organization not found" },
//         { status: 404 }
//       );

//     // 2️⃣ Create batch ID
//     const batchId = `BATCH-${Date.now()}${nanoid(5)}`;

//     // 3️⃣ Create HCS-2 registry for batch
//     const registry = await createBatchRegistry(batchId);
//     if (!registry.success || !registry.topicId) {
//       return NextResponse.json(
//         { error: "Failed to create registry on Hedera" },
//         { status: 500 }
//       );
//     }

//     // 4️⃣ Generate batch QR
//     const qrBatchPayload = generateBatchQRPayload(
//       batchId,
//       QR_SECRET,
//       BASE_URL,
//       registry.topicId
//     );

//     // 5️⃣ Save batch in DB
//     console.log(" Save batch in DB");
    
//     const newBatch = await prisma.medicationBatch.create({
//       data: {
//         batchId,
//         organizationId,
//         drugName,
//         composition,
//         batchSize: parseInt(batchSize, 10),
//         manufacturingDate: new Date(manufacturingDate),
//         expiryDate: new Date(expiryDate),
//         storageInstructions,
//         registryTopicId: registry.topicId,
//         qrCodeData: qrBatchPayload.url,
//         qrSignature: qrBatchPayload.signature,
//       },
//     });


//     // 6️⃣ Fetch ManufacturerAgent
//     console.group("Fetch ManufacturerAgent");
//     const agentResult = await getAgent(org.organizationAgent?.accountId ?? "");
//     if (!agentResult.success) throw new Error("Manufacturer agent not found");

//     console.log(" ManufacturerAgent found");
//     const agent = agentResult.data;

//     // 7️⃣ Send BATCH_CREATED event via HCS-10
//     console.log("Send BATCH_CREATED event via HCS-10");
//     const hcs10Event = await sendAgentMessage(
//       agent?.outboundTopic ?? "",
//       {
//         type: "BATCH_CREATED",
//         batchId,
//         organizationId,
//         drugName,
//         batchSize,
//         manufacturingDate,
//         expiryDate,
//       },
//       "Batch creation event"
//     );

//     // 8️⃣ Store batch event in DB for audit
//     console.log(" Store batch event in DB for audit");
//     await prisma.batchEvent.create({
//       data: {
//         batchId: newBatch.id,
//         eventType: "BATCH_CREATED",
//         hederaSeq: parseInt(hcs10Event?.sequenceNumber ?? "", 10),
//         payload: {
//           batchId,
//           organizationId,
//           drugName,
//           batchSize,
//           manufacturingDate,
//           expiryDate,
//         },
//         region: org.state ?? "",
//       },
//     });

//     // 9️⃣ Create units in HCS-2 and emit HCS-10 events
//     console.log(" Create units in HCS-2 and emit HCS-10 events");
//     const unitsData: any[] = [];

//     for (let i = 0; i < parseInt(batchSize, 10); i++) {
//       const unitNumber = String(i + 1).padStart(4, "0");
//       const randomSuffix = nanoid(3);
//       const serialNumber = `UNIT-${batchId}-${unitNumber}${randomSuffix}`;

//       // Register unit on HCS-2
//       const seq = await registerUnitOnBatch(registry.topicId, {
//         serialNumber,
//         drugName,
//         batchId,
//       });

//       // Generate QR for consumer verification
//       const qrUnitPayload = generateQRPayload(
//         serialNumber,
//         batchId,
//         seq,
//         QR_SECRET,
//         BASE_URL
//       );

//       // Prepare unit DB record
//       unitsData.push({
//         serialNumber,
//         batchId: newBatch.id,
//         registrySequence: seq,
//         qrCode: qrUnitPayload.url,
//         qrSignature: qrUnitPayload.signature,
//       });

//       // 🔹 HCS-10: Notify ManufacturerAgent of new unit
//       console.log("HCS-10: Notify ManufacturerAgent of new unit");
//       try {
//         const unitEvent = await sendAgentMessage(
//           agent?.outboundTopic ?? "",
//           {
//             type: "UNIT_CREATED",
//             batchId,
//             serialNumber,
//             registrySequence: seq,
//             drugName,
//           },
//           "Unit creation event"
//         );

//         console.log(`UNIT_CREATED HCS-10 seq: ${unitEvent.sequenceNumber}`);

//       }
//       catch (err) {
//         console.error(`Failed to send UNIT_CREATED for ${serialNumber}`, err);
//       }
//     }

//     await prisma.medicationUnit.createMany({ data: unitsData });

//     return NextResponse.json(
//       {
//         batch: newBatch,
//         unitsCreated: unitsData.length,
//       },
//       { status: 201 }
//     );
//   }
//   catch (error) {
//     console.error("Error creating batch:", error);
//     return NextResponse.json(
//       { error: "Failed to create batch" },
//       { status: 500 }
//     );
//   }
// }









if (process.env.NODE_ENV === "production") {
  process.env.PINO_PRETTY_DISABLE = "true";
}

import "@/lib/logPatch";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { createBatchRegistry, registerUnitOnBatch } from "@/lib/hedera";
import { generateQRPayload, generateBatchQRPayload } from "@/lib/qrPayload";
import { hedera10Client } from "@/lib/hedera10Client"
import { createPublicBatchRegistry } from "@/lib/createPublicBatchRegistry";
import {
  getAgent,
  sendAgentMessage,
  broadcastAgentMessage,
} from "@/lib/hcs10.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    // 1️⃣ Check organization exists
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { organizationAgent: true },
    });

    if (!org)
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );

    // 2️⃣ Create batch ID
    const batchId = `BATCH-${Date.now()}${nanoid(5)}`;

    // 3️⃣ Create HCS-2 registry for batch
    const registry = await createBatchRegistry(batchId);
    if (!registry.success || !registry.topicId) {
      return NextResponse.json(
        { error: "Failed to create registry on Hedera" },
        { status: 500 }
      );
    }

    // 4️⃣ Generate batch QR
    const qrBatchPayload = generateBatchQRPayload(
      batchId,
      QR_SECRET,
      BASE_URL,
      registry.topicId
    );

    // 5️⃣ Save batch in DB
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

    // 6️⃣ Fetch ManufacturerAgent
    const agentResult = await getAgent(org.organizationAgent?.accountId ?? "");

    const agent = agentResult.success ? agentResult.data : null;

    // 7️⃣ Send BATCH_CREATED event via HCS-10 (safe)
    let hederaSeq = 0;
    if (agent) {
      try {
        console.log("Agent outbound", agent.outboundTopic, agent.inboundTopic)
        const hcs10Event = await broadcastAgentMessage(
          agent.outboundTopic ?? "",
          {
            type: "BATCH_CREATED",
            batchId,
            organizationId,
            drugName,
            batchSize,
            manufacturingDate,
            expiryDate,
          },
          "Batch creation event"
        );

        hederaSeq = hcs10Event?.sequenceNumber
          ? parseInt(hcs10Event.sequenceNumber, 10)
          : 0;
      } catch (err) {
        console.warn("Failed to send BATCH_CREATED event via HCS-10:", err);
      }
    }

    // 8️⃣ Store batch event in DB for audit
    await prisma.batchEvent.create({
      data: {
        batchId: newBatch.id,
        eventType: "BATCH_CREATED",
        hederaSeq,
        payload: {
          batchId,
          organizationId,
          drugName,
          batchSize: parseInt(batchSize, 10),
          manufacturingDate,
          expiryDate,
        },
        region: org.state ?? "",
      },
    });

    // 9️⃣ Create units in HCS-2 and emit HCS-10 events
    const unitsData: any[] = [];
    for (let i = 0; i < parseInt(batchSize, 10); i++) {
      const unitNumber = String(i + 1).padStart(4, "0");
      const randomSuffix = nanoid(3);
      const serialNumber = `UNIT-${batchId}-${unitNumber}${randomSuffix}`;

      // Register unit on HCS-2
      const seq = await registerUnitOnBatch(registry.topicId, {
        serialNumber,
        drugName,
        batchId,
      });

      // Generate QR for consumer verification
      const qrUnitPayload = generateQRPayload(
        serialNumber,
        batchId,
        seq,
        QR_SECRET,
        BASE_URL
      );

      // Prepare unit DB record
      unitsData.push({
        serialNumber,
        batchId: newBatch.id,
        registrySequence: seq,
        qrCode: qrUnitPayload.url,
        qrSignature: qrUnitPayload.signature,
      });

      // Fetch profile for a specific account
      const profileResponse = await hedera10Client.retrieveProfile(agent?.accountId ?? "");

      if (profileResponse.success) {
        console.log("AGENT PROFILE RETRIEVED",profileResponse)
        // Use profile and topic information
      }
      else{
         console.log("AGENT PROFILE NOT FOUND", profileResponse);
      }

      const publicBatchAnnouncement = await createPublicBatchRegistry()
      console.log("publicBatchAnnouncement", publicBatchAnnouncement);

      // Notify ManufacturerAgent of new unit via HCS-10
      if (agent) {
        try {
          const unitEvent = await broadcastAgentMessage(
            agent.outboundTopic ?? "",
            {
              type: "UNIT_CREATED",
              batchId,
              serialNumber,
              registrySequence: seq,
              drugName,
            },
            "Unit creation event"
          );

          console.log(`UNIT_CREATED HCS-10 seq: ${unitEvent.sequenceNumber}`);
        } catch (err) {
          console.error(
            `Failed to send UNIT_CREATED for ${serialNumber}:`,
            err
          );
        }
      }
    }

    await prisma.medicationUnit.createMany({ data: unitsData });

    return NextResponse.json(
      { batch: newBatch, unitsCreated: unitsData.length },
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
