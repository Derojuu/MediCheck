// app/api/verify/batch/[batchId]/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/verifySignature";
import { logBatchEvent } from "@/lib/hedera";
import { encodeFeatures } from "@/lib/formatModelInput";
import * as ort from "onnxruntime-node";
import { promises as fs } from "fs";
import path from "path";
import { safeSendHcs10, createAgentConnection } from "@/lib/hcs10";

const QR_SECRET = process.env.QR_SECRET || "dev-secret";

export async function GET(
  req: Request,
  context: { params: { batchId: string } }
) {
  try {
    const { batchId } = await context.params;
    const url = new URL(req.url);
    const sig = url.searchParams.get("sig");
    const longitude = url.searchParams.get("long");
    const latitude = url.searchParams.get("lat");

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { valid: false, error: "User not authorized" },
        { status: 401 }
      );
    }

    // Load ONNX model buffer (keep your original model-loading behavior)
    const modelPath = path.join(
      process.cwd(),
      "models",
      "scan-classifier.onnx"
    );
    const modelBuffer = await fs.readFile(modelPath);
    const modelUint8 = new Uint8Array(modelBuffer);

    if (!sig) {
      return NextResponse.json(
        { valid: false, error: "Missing signature" },
        { status: 400 }
      );
    }

    // Fetch user & team membership
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { teamMember: true },
    });

    if (!user || !user.teamMember) {
      return NextResponse.json(
        { valid: false, error: "User not part of any organization" },
        { status: 403 }
      );
    }

    const scannerOrgId = user.teamMember.organizationId;

    // 1️⃣ Fetch batch + include sender org & their agent info
    const batch = await prisma.medicationBatch.findUnique({
      where: { batchId },
    });

    if (!batch) {
      return NextResponse.json(
        { valid: false, error: "Batch not found" },
        { status: 404 }
      );
    }

    if (batch.status === "FLAGGED") {
      return NextResponse.json(
        {
          valid: false,
          error:
            "This batch has been flagged as suspicious, please contact the sender.",
        },
        { status: 400 }
      );
    }


    if (batch.status === "RECALLED") {
      return NextResponse.json(
        {
          valid: false,
          error:
            "This batch has been recalled back to the factory by the manufacturer, please contact the manufacturer.",
        },
        { status: 400 }
      );
    }

    // 2️⃣ Recompute signature to verify QR integrity
    const data = `BATCH|${batch.batchId}|${batch.registryTopicId}`;
    const validSig = verifySignature(data, sig, QR_SECRET);

    if (!validSig) {
      return NextResponse.json(
        { valid: false, error: "This batch has been compromised!!" },
        { status: 400 }
      );
    }

    // 3️⃣ Check if org (scanner) is expecting this batch (transfer)
    const transfer = await prisma.ownershipTransfer.findFirst({
      where: {
        batchId: batch.id,
        toOrgId: scannerOrgId,
      },
    });

    // Load org metadata for sender (current batch owner) and receiver (scanner org)
    const senderOrg = await prisma.organization.findUnique({
      where: { id: batch.organizationId },
      include: { organizationAgent: true },
    });

    const receiverOrg = await prisma.organization.findUnique({
      where: { id: scannerOrgId },
      include: { organizationAgent: true },
    });

    let updatedBatch = batch;

    if (transfer && transfer.status === "PENDING") {
      // ========= Transfer acceptance flow =========
      // 1. Update ownership in DB
      updatedBatch = await prisma.medicationBatch.update({
        where: { batchId: batch.batchId },
        data: {
          organizationId: scannerOrgId,
          status: "DELIVERED",
        },
      });

      // 2. Mark transfer as complete
      await prisma.ownershipTransfer.update({
        where: { id: transfer.id },
        data: { status: "COMPLETED" },
      });

      // 3. Log transfer on HCS-2 (immutable registry)
      const transferSeq = await logBatchEvent(
        batch.registryTopicId ?? "",
        "BATCH_OWNERSHIP",
        {
          batchId: batch.batchId,
          transferFrom: batch.organizationId,
          transferTo: scannerOrgId,
          qrSignature: batch.qrSignature ?? "",
          timestamp: new Date().toISOString(),
        }
      );

      // 4 Ensure connection between agents
      let connection = await prisma.agentConnection.findFirst({
        where: {
          initiatorOrgId: batch.organizationId,
          receiverOrgId: scannerOrgId,
          status: "ACTIVE",
        },
      });

      if (!connection) {
        console.log("🔗 No existing connection found — creating new...");
        connection = await createAgentConnection(
          batch.organizationId,
          scannerOrgId
        );
      } else {
        console.log("🔗 Using existing active connection:", connection.id);
      }

      // 5️⃣ Prepare payload
      const payload = {
        batchId: batch.batchId,
        fromOrgId: batch.organizationId,
        toOrgId: scannerOrgId,
        registryTopic: batch.registryTopicId,
        hederaSeq: transferSeq,
        timestamp: new Date().toISOString(),
      };

      // 6️⃣ Announce via shared connection topic (both agents see it)
      await safeSendHcs10(
        connection.connectionTopicId,
        { p: "hcs-10", op: "batch_transfer_confirmed", ...payload },
        "Batch ownership confirmed",
        connection.id
      );

      // 7️⃣  Announce on managed registries ( global visibility)
      try {
        if (senderOrg?.managedRegistry)
          await safeSendHcs10(
            senderOrg.managedRegistry,
            { type: "BATCH_TRANSFERRED", ...payload },
            "Sender registry log"
          );

        if (receiverOrg?.managedRegistry)
          await safeSendHcs10(
            receiverOrg.managedRegistry,
            { type: "BATCH_RECEIVED", ...payload },
            "Receiver registry log"
          );
      }
      catch (e) {
        console.warn("Non-fatal registry broadcast error:", e);
      }

      // 8️⃣ Off-chain audit
      await prisma.batchEvent.create({
        data: {
          batchId: batch.id,
          eventType: "BATCH_TRANSFERRED",
          hederaSeq: transferSeq ?? 0,
          payload: { fromOrgId: batch.organizationId, toOrgId: scannerOrgId },
          region: receiverOrg?.state ?? "",
        },
      });
    }
    else {
      // ========= Flagging flow (no valid transfer found) =========
      updatedBatch = await prisma.medicationBatch.update({
        where: { batchId: batch.batchId },
        data: { status: "FLAGGED" },
      });

      // Log flag event in HCS-2
      const flagSeq = await logBatchEvent(
        batch.registryTopicId ?? "",
        "BATCH_FLAG",
        {
          batchId: batch.batchId,
          organizationId: batch.organizationId,
          qrSignature: batch.qrSignature ?? "",
          flagReason: "Transfer not expected or unauthorized scan",
          timestamp: new Date().toISOString(),
        }
      );

      // Announce flag on HCS-10 (org managed registries + agent topics), non-fatal
      const flagPayload = {
        // p: "hcs-10",
        // op: "batch_flag",
        batchId: batch.batchId,
        orgId: batch.organizationId,
        scannerOrgId,
        registryTopic: batch.registryTopicId,
        hederaSeq: flagSeq,
        timestamp: new Date().toISOString(),
      };

      try {
        if (senderOrg?.managedRegistry) {
          await safeSendHcs10(
            senderOrg.managedRegistry,
            { type: "BATCH_FLAG", ...flagPayload },
            "Batch flagged"
          );
        }
        if (senderOrg?.organizationAgent?.outboundTopic) {
          await safeSendHcs10(
            senderOrg.organizationAgent.outboundTopic,
            { p: "hcs-10", op: "batch_flag", ...flagPayload },
            "Batch flagged (agent outbound)"
          );
        }
      }
      catch (e) {
        console.warn(
          "Non-fatal: failed to announce flag to sender channels",
          e
        );
      }

      // off-chain event
      await prisma.batchEvent.create({
        data: {
          batchId: batch.id,
          eventType: "BATCH_FLAG",
          hederaSeq: flagSeq ?? 0,
          payload: { reason: "Transfer not expected or unauthorized scan" },
          region: senderOrg?.state ?? "",
        },
      });

      // find or create connection
      let flagConnection = await prisma.agentConnection.findFirst({
        where: {
          initiatorOrgId: batch.organizationId,
          receiverOrgId: scannerOrgId,
        },
      });

      if (!flagConnection) {
        flagConnection = await createAgentConnection(
          batch.organizationId,
          scannerOrgId
        );
      }

      // send flag alert via shared topic
      await safeSendHcs10(
        flagConnection.connectionTopicId,
        {
          p: "hcs-10",
          op: "batch_flag_alert",
          batchId: batch.batchId,
          orgId: batch.organizationId,
          scannerOrgId,
          registryTopic: batch.registryTopicId,
          hederaSeq: flagSeq,
          timestamp: new Date().toISOString(),
        },
        "Unauthorized batch transfer alert",
        flagConnection.id
      );
    }


    // ========== SCAN HISTORY + ML INFERENCE (keep unchanged) ==========
    const now = new Date();

    const savedScan = await prisma.scanHistory.create({
      data: {
        batchId: batch.id,
        teamMemberId: user.teamMember.id,
        scanResult: transfer ? "GENUINE" : "SUSPICIOUS",
        region: senderOrg?.state ?? "",
        isAnonymous: false,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        timestamp: now,
      },
    });

    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = dayMap[now.getDay()];

    const hour = now.getHours();
    let timeOfDay;
    if (hour >= 5 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "evening";
    else timeOfDay = "night";

    // total scans in region in last 30 days
    const totalScans = await prisma.scanHistory.count({
      where: {
        region: senderOrg?.state,
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // suspicious scans in region in last 30 days
    const suspiciousScans = await prisma.scanHistory.count({
      where: {
        region: senderOrg?.state,
        scanResult: "SUSPICIOUS",
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const pastIncidentRate = totalScans > 0 ? suspiciousScans / totalScans : 0;

    const totalUserScans = await prisma.scanHistory.count({
      where: { teamMemberId: user.teamMember?.id },
    });

    const suspiciousUserScans = await prisma.scanHistory.count({
      where: {
        teamMemberId: user.teamMember?.id,
        scanResult: "SUSPICIOUS",
      },
    });

    const suspiciousRatio =
      totalUserScans > 0 ? suspiciousUserScans / totalUserScans : 0;

    let baseRisk = 0.1;
    const userFlag = Math.min(baseRisk + suspiciousRatio * 0.5, 1);

    const features = encodeFeatures({
      region: senderOrg?.state ?? "",
      latitude: latitude ? parseFloat(latitude) : 0,
      longitude: longitude ? parseFloat(longitude) : 0,
      time_of_day: timeOfDay,
      day_of_week: dayOfWeek,
      past_incident_rate: pastIncidentRate,
      user_flag: userFlag,
    });

    // ONNX inference 
    try {
      const session = await ort.InferenceSession.create(modelUint8);
      const inputArray = Float32Array.from(features);
      const inputTensor = new ort.Tensor("float32", inputArray, [1, 52]);

      const feeds: Record<string, ort.Tensor> = {
        float_input: inputTensor,
      };

      const results = await session.run(feeds);

      const labelArr = results.label.data as BigInt64Array;
      const probArr = results.probabilities.data as Float32Array;

      const predictedLabelInt = Number(labelArr[0]);
      const predictedProbability = probArr[predictedLabelInt];
      const predictedLabel = predictedLabelInt === 1;

      await prisma.predictionScore.create({
        data: {
          scanHistoryId: savedScan.id,
          predictedLabel,
          predictedProbability,
          region: senderOrg?.state,
          scanType: "BATCH",
        },
      });
    }
    catch (onnxError) {
      console.error("ONNX Runtime Error:", onnxError);
      // Do not fail the endpoint on model error — return a useful response
      return NextResponse.json(
        { valid: false, error: "ONNX Runtime Error", onnxError },
        { status: 400 }
      );
    }

    // Final response returns the updated batch and simple verification result
    return NextResponse.json({
      valid: true,
      batch: updatedBatch,
      transfer: transfer ? { status: "COMPLETED" } : null,
    });

  }
  catch (err: any) {
    console.error("VerifyBatch API Error:", err);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
