// app/api/verify/unit/[serialNumber]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/verifySignature";
import { auth } from "@clerk/nextjs/server";
import { getBatchEventLogs } from "@/lib/hedera";
import { runAllUnitAuthenticityChecks } from "@/lib/safetyChecks";
import { currentUser } from "@clerk/nextjs/server";
import { getComprehensiveUnitVerificationExplanation } from "@/lib/verificationResponse";
import { encodeFeatures } from "@/lib/formatModelInput";
import { modelPrediction } from "@/lib/modelPrediction";

const QR_SECRET = process.env.QR_SECRET || "dev-secret";

export async function GET(
  req: Request,
  context: { params: { serialNumber: string } }
) {
  const loggedInUser = await currentUser();

  const { serialNumber } = await context.params;

  const url = new URL(req.url);

  const sig = url.searchParams.get("sig");
  const longitude = url.searchParams.get("long");
  const latitude = url.searchParams.get("lat");

  const { userId } = await auth();

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

  //  Fetch user & team membership
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId ?? "" },
    include: { consumer: true },
  });

  // VERIFYING THAT THIS UNIT BELONGS TO A BATCH REGISTERED ON OUR PLATFORM
  // conpare serialnumber from db with the serialnumber in the url, same thing with the
  const splitSerialNumber = serialNumber.split("-");

  // reconstruct the batchid this unit belongs to
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

  const valid = verifySignature(data, sig, QR_SECRET);

  //
  const topicId = unit.batch.registryTopicId ?? "";

  const logEntries = await getBatchEventLogs(topicId);

  const logEntriesMessages = logEntries.map((entry) => entry.message);

  // logEntries is the array you showed above
  const eventLogs = logEntriesMessages
    .map((entry) => {
      const parsed = JSON.parse(entry.metadata || "");
      return parsed;
    })
    .filter((entry) => entry && entry.type === "EVENT_LOG");

  // AUTHENTICITY CHECK
  const authenticityResultCheck = await runAllUnitAuthenticityChecks(
    eventLogs,
    unit.id,
    unit.batch.batchId,
    unit.batch.organizationId,
    topicId
  );

  const formatedAuthenticityResultCheck = JSON.stringify(
    authenticityResultCheck
  );

  const translateAuthenticityChecks =
    await getComprehensiveUnitVerificationExplanation(
      "FRENCH",
      authenticityResultCheck
    );

  // SAVE SCAN HISTORY

  const consumer = user
    ? await prisma.consumer.findUnique({ where: { userId: user.id } })
    : null;

  const authenticityScanResult =
    authenticityResultCheck?.status === "NOT_SAFE" ? "SUSPICIOUS" : "GENUINE";

  const organizationInformation = await prisma.organization.findUnique({
    where: { id: unit.batch.organizationId },
  });

  const now = new Date();

  const savedScan = await prisma.scanHistory.create({
    data: {
      unitId: unit.id,
      consumerId: loggedInUser ? consumer?.id : "",
      isAnonymous: loggedInUser ? false : true,
      region: organizationInformation?.state,
      scanResult: authenticityScanResult,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      timestamp: now,
    },
  });

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

  // Run ONNX model
  const predictionArray = await modelPrediction(features);
  const predictedProbability = predictionArray[0];
  const predictedLabel = predictedProbability > 0.5;

  await prisma.predictionScore.create({
    data: {
      scanHistoryId: savedScan.id,
      predictedLabel,
      predictedProbability,
      region: organizationInformation?.state,
      scanType: "BATCH",
    },
  });

  // 3️⃣ Response
  return NextResponse.json({
    valid,
    unit,
    batch: unit.batch,
    geminiResponse: translateAuthenticityChecks,
  });
}
