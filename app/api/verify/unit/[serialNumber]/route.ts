// app/api/verify/unit/[serialNumber]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/verifySignature";
import { getBatchEventLogs } from "@/lib/hedera";
import { runAllUnitAuthenticityChecks } from "@/lib/safetyChecks";
import { auth, currentUser } from "@clerk/nextjs/server";
import { encodeFeatures } from "@/lib/formatModelInput";
import * as ort from "onnxruntime-node";
import { promises as fs } from "fs";
import path from "path";
import { safeSendHcs10 } from "@/lib/hcs10";

const QR_SECRET = process.env.QR_SECRET || "dev-secret";

export async function GET(
  req: Request,
  context: { params: { serialNumber: string } }
) {
  console.log("GET /api/verify/unit/[serialNumber] called");

  const { userId } = await auth();

  let loggedInUser = null;

  if (userId) {
    loggedInUser = await currentUser();
  }

  const { serialNumber } = await context.params;

  const url = new URL(req.url);

  const sig = url.searchParams.get("sig");
  const longitude = url.searchParams.get("long");
  const latitude = url.searchParams.get("lat");

  const modelPath = path.join(process.cwd(), "models", "scan-classifier.onnx");

  // Load as Buffer
  const modelBuffer = await fs.readFile(modelPath);

  // 🔑 Convert Buffer to Uint8Array
  const modelUint8 = new Uint8Array(modelBuffer);

  if (!sig) {
    return NextResponse.json(
      { valid: false, error: "Missing signature" },
      { status: 400 }
    );
  }

  // 1️⃣ Fetch unit
  const unit = await prisma.medicationUnit.findUnique({
    where: { serialNumber },
    include: { batch: true },
  });

  if (!unit) {
    return NextResponse.json(
      { valid: false, error: "Unit not found" },
      { status: 404 }
    );
  }

  //  Fetch user & consumer (if available)
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId ?? "" },
    include: { consumer: true },
  });

  // VERIFYING THAT THIS UNIT BELONGS TO A BATCH REGISTERED ON OUR PLATFORM
  const splitSerialNumber = serialNumber.split("-");

  // reconstruct the batchid this unit belongs to (original format in your code)
  const batchIdFromUrl = splitSerialNumber[1] + "-" + splitSerialNumber[2];

  if (
    batchIdFromUrl !== unit.batch.batchId ||
    sig !== unit.qrSignature ||
    serialNumber !== unit.serialNumber
  ) {
    return NextResponse.json(
      { valid: false, error: "This verification url is not legitimate." },
      { status: 400 }
    );
  }

  // 2️⃣ Recompute signature
  const data = `${unit.serialNumber}|${unit.batch.batchId}|${unit.registrySequence}`;
  let valid = verifySignature(data, sig, QR_SECRET);

  const topicId = unit.batch.registryTopicId ?? "";
  const logEntries = await getBatchEventLogs(topicId);
  const logEntriesMessages = logEntries.map((entry) => entry.message);

  // Parse only EVENT_LOG entries
  const eventLogs = logEntriesMessages
    .map((entry) => {
      try {
        const parsed = JSON.parse(entry.metadata || "");
        return parsed;
      } catch {
        return null;
      }
    })
    .filter((entry) => entry && entry.type === "EVENT_LOG");

  // AUTHENTICITY CHECKS
  const authenticityResultCheck = await runAllUnitAuthenticityChecks(
    eventLogs,
    unit.id,
    unit.batch.batchId,
    unit.batch.organizationId,
    topicId
  );

  // SAVE SCAN HISTORY (we save before notifying org so we can reference savedScan.id)
  const consumer = user
    ? await prisma.consumer.findUnique({ where: { userId: user.id } })
    : null;

  const authenticityScanResult =
    authenticityResultCheck?.status === "NOT_SAFE" ? "SUSPICIOUS" : "GENUINE";

  valid = authenticityResultCheck?.status === "NOT_SAFE" ? false : valid;

  const organizationInformation = await prisma.organization.findUnique({
    where: { id: unit.batch.organizationId },
  });

  const now = new Date();

  const savedScan = await prisma.scanHistory.create({
    data: {
      unitId: unit.id,
      consumerId: loggedInUser ? consumer?.id : null,
      isAnonymous: loggedInUser ? false : true,
      region: organizationInformation?.state,
      scanResult: authenticityScanResult,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      timestamp: now,
    },
  });






  // --------------------- NEW: HCS-10 COMMUNICATION ---------------------
  // Notify owner organization about this unit verification (managedRegistry + inbound agent topic)
  try {
    const ownerOrg = await prisma.organization.findUnique({
      where: { id: unit.batch.organizationId },
      include: {
        organizationAgent: {
          select: {
            id: true,
            agentName: true,
            inboundTopic: true,
            outboundTopic: true,
          },
        },
      },
    });

    const verificationPayload = {
      p: "hcs-10",
      op: "unit_verification_event",
      unitId: unit.id,
      serialNumber: unit.serialNumber,
      batchId: unit.batch.batchId,
      registryTopic: topicId,
      scanId: savedScan.id,
      scanner: loggedInUser
        ? { type: "CONSUMER", id: consumer?.id ?? null }
        : { type: "ANONYMOUS" },
      result: authenticityResultCheck?.status ?? "UNKNOWN",
      reasons: authenticityResultCheck?.reasons ?? [],
      timestamp: new Date().toISOString(),
    };

    const sendResults: Array<any> = [];

    // 1) Send to owner's managed registry (if present) for global visibility
    if (ownerOrg?.managedRegistry) {
      const r = await safeSendHcs10(
        ownerOrg.managedRegistry,
        verificationPayload,
        "Unit verification event (registry)"
      );
      sendResults.push({ target: ownerOrg.managedRegistry, result: r });
    }

    // 2) Send to owner's inbound agent topic (direct agent notification)
    if (ownerOrg?.organizationAgent?.inboundTopic) {
      const response = await safeSendHcs10(
        ownerOrg.organizationAgent.inboundTopic,
        {
          ...verificationPayload,
          op: "unit_verification_request",
        },
        "Unit verification request (agent inbound)"
      );

      sendResults.push({
        target: ownerOrg.organizationAgent.inboundTopic,
        result: response,
      });

      // Log outbound message to AgentMessage table (if agent exists)
      try {
        // attempt to extract a sequence number from the Hedera send result (best-effort)
        // Ensure we have a numeric sequence, default to 0 if not available
        const seq = typeof response === 'number' ? response : 0;

        await prisma.agentMessage.create({
          data: {
            topicId: ownerOrg.organizationAgent.inboundTopic,
            message: verificationPayload,
            sequence: seq,
            agentId: ownerOrg.organizationAgent.id,
          },
        });
      } catch (logErr) {
        console.warn("Failed to log agent message to DB (non-fatal):", logErr);
      }
    }

    // Optional: if ownerOrg has outboundTopic 
    if (ownerOrg?.organizationAgent?.outboundTopic) {
      const r2 = await safeSendHcs10(
        ownerOrg.organizationAgent.outboundTopic,
        {
          ...verificationPayload,
          op: "unit_verification_notice",
        },
        "Unit verification notice (agent outbound)"
      );
      sendResults.push({
        target: ownerOrg.organizationAgent.outboundTopic,
        result: r2,
      });
    }

    // attach sendResults for debugging in response
    // (no sensitive values, just targets and success metadata)
    // you can remove this from production responses if you prefer
    console.log("HCS-10 sendResults:", sendResults);
  }
  catch (commError) {
    console.warn("HCS-10 communication failed (non-fatal):", commError);
  }






  // ------------------- END HCS-10 COMMUNICATION -------------------

  // Day of week
  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = dayMap[now.getDay()];

  // Time of day
  const hour = now.getHours();
  let timeOfDay;
  if (hour >= 5 && hour < 12) timeOfDay = "morning";
  else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
  else if (hour >= 17 && hour < 21) timeOfDay = "evening";
  else timeOfDay = "night";

  // total scans in region in last 30 days
  const totalScans = await prisma.scanHistory.count({
    where: {
      region: organizationInformation?.state,
      timestamp: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  // suspicious scans in region in last 30 days
  const suspiciousScans = await prisma.scanHistory.count({
    where: {
      region: organizationInformation?.state,
      scanResult: "SUSPICIOUS",
      timestamp: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  // incident rate
  const pastIncidentRate = totalScans > 0 ? suspiciousScans / totalScans : 0;

  // Baseline
  let baseRisk = 0.6; // assume anonymous by default
  let suspiciousRatio = 0;

  // If logged-in consumer
  if (consumer) {
    baseRisk = 0.3; // lower risk for logged-in user

    const totalUserScans = await prisma.scanHistory.count({
      where: { consumerId: consumer.id },
    });

    const suspiciousUserScans = await prisma.scanHistory.count({
      where: {
        consumerId: consumer.id,
        scanResult: "SUSPICIOUS",
      },
    });

    suspiciousRatio =
      totalUserScans > 0 ? suspiciousUserScans / totalUserScans : 0;
  } else {
    // For anonymous we could optionally check scans from the same IP/location
    const suspiciousAnonScans = await prisma.scanHistory.count({
      where: {
        isAnonymous: true,
        region: organizationInformation?.state,
        scanResult: "SUSPICIOUS",
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const totalAnonScans = await prisma.scanHistory.count({
      where: {
        isAnonymous: true,
        region: organizationInformation?.state,
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    suspiciousRatio =
      totalAnonScans > 0 ? suspiciousAnonScans / totalAnonScans : 0;
  }

  // Combine
  const userFlag = Math.min(baseRisk + suspiciousRatio * 0.5, 1);

  const features = encodeFeatures({
    region: organizationInformation?.state ?? "",
    latitude: latitude ? parseFloat(latitude) : 0,
    longitude: longitude ? parseFloat(longitude) : 0,
    time_of_day: timeOfDay,
    day_of_week: dayOfWeek,
    past_incident_rate: pastIncidentRate,
    user_flag: userFlag,
  });

  // Initialize ONNX Runtime with proper error handling
  try {
    const session = await ort.InferenceSession.create(modelUint8);

    const inputArray = Float32Array.from(features);

    const inputTensor = new ort.Tensor("float32", inputArray, [1, 52]);

    const feeds: Record<string, ort.Tensor> = {
      float_input: inputTensor,
    };

    const results = await session.run(feeds);

    // Get the raw arrays
    const labelArr = results.label.data as BigInt64Array; // int64 -> BigInt64Array

    const probArr = results.probabilities.data as Float32Array; // float32 -> Float32Array

    // Convert safely
    const predictedLabelInt = Number(labelArr[0]); // from BigInt to number

    const predictedProbability = probArr[predictedLabelInt]; // probability of predicted label

    console.log("predictedLabelInt", predictedLabelInt);

    console.log("predictedProbability", predictedProbability);

    // If you want a boolean:
    const predictedLabel = predictedLabelInt === 1;

    // Then save
    await prisma.predictionScore.create({
      data: {
        scanHistoryId: savedScan.id,
        predictedLabel,
        predictedProbability,
        region: organizationInformation?.state,
        scanType: "UNIT",
      },
    });
  }
  catch (onnxError) {
    console.error("ONNX Runtime Error:", onnxError);
    return NextResponse.json(
      { valid: false, error: "ONNX Runtime Error", onnxError },
      { status: 400 }
    );
  }

  // 3️⃣ Response
  return NextResponse.json({
    valid,
    unit,
    batch: unit.batch,
    authenticityResultCheck: authenticityResultCheck,
  });
}
