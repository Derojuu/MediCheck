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

    const modelPath = path.join(
      process.cwd(),
      "models",
      "scan-classifier.onnx"
    );

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

    const orgId = user?.teamMember?.organizationId;

    // 1️⃣ Fetch batch
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
        { valid: false, error: "This batch has been flagged as suspicious, please contact the sender." },
        { status: 400 }
      );
    }

      // 2️⃣ Recompute signature
      const data = `BATCH|${batch.batchId}|${batch.registryTopicId}`;
    const valid = verifySignature(data, sig, QR_SECRET);

    if (!valid) {
      return NextResponse.json(
        { valid: false, error: "This batch is not valid" },
        { status: 400 }
      );
    }

    // 4️⃣ Check if org is expecting this batch
    const transfer = await prisma.ownershipTransfer.findFirst({
      where: {
        batchId: batch.id,
        toOrgId: orgId,
      },
    });

    let updatedBatch = batch;

    const organizationInformation = await prisma.organization.findUnique({
      where: { id: batch.organizationId },
    });

    const prevOrg = batch.batchId;

    if (transfer && transfer.status === "PENDING") {
      // 1. Transfer ownership
      updatedBatch = await prisma.medicationBatch.update({
        where: { batchId: prevOrg },
        data: {
          organizationId: orgId,
          status: "DELIVERED",
        },
      });

      // 2. Mark transfer as complete
      await prisma.ownershipTransfer.update({
        where: { id: transfer.id },
        data: { status: "COMPLETED" },
      });

      // 3. log digital footprint on-chain
      console.log(
        `Batch ${prevOrg} ownership transferred to org ${orgId} by user ${userId}`
      );

      // Log the batch creation event to Hedera
      await logBatchEvent(batch.registryTopicId ?? "", "BATCH_OWNERSHIP", {
        batchId: batch.batchId,
        organizationId: batch.organizationId,
        transferFrom: prevOrg,
        transferTo: orgId,
        qrSignature: batch.qrSignature ?? "",
      });

    }
    else {
      // Flag batch
      updatedBatch = await prisma.medicationBatch.update({
        where: { batchId: prevOrg },
        data: { status: "FLAGGED" },
      });

      // if (transfer) {
      //   await prisma.ownershipTransfer.delete({
      //     where: { id: transfer.id },
      //   });
      // }

      // log flag event

      await logBatchEvent(batch.registryTopicId ?? "", "BATCH_FLAG", {
        batchId: batch.batchId,
        organizationId: batch.organizationId,
        qrSignature: batch.qrSignature ?? "",
        flagReason: "The tranfer of this batch seems malicious.",
      });
    }

    const now = new Date();

    // batch level scan
    const savedScan = await prisma.scanHistory.create({
      data: {
        batchId: batch.id,
        teamMemberId: user.teamMember.id,
        scanResult: transfer ? "GENUINE" : "SUSPICIOUS",
        region: organizationInformation?.state,
        isAnonymous: false,
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

    // 1. Base risk by role
    let baseRisk = 0.1; // Team Members always start low risk

    // 2. Behavior adjustment: suspicious scans ratio for this team member
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

    // 3. Combine to make user_flag
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
          scanType: "BATCH",
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
      valid: true,
      batch: updatedBatch,
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
