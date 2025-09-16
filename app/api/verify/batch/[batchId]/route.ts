// app/api/verify/batch/[batchId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/verifySignature";

const QR_SECRET = process.env.QR_SECRET || "dev-secret";

export async function GET(
  req: Request,
  context: { params: { batchId: string } }
) {
  try {
    const { batchId } = context.params;
    const url = new URL(req.url);
    const sig = url.searchParams.get("sig");

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { valid: false, error: "User not authorized" },
        { status: 401 }
      );
    }

    if (!sig) {
      return NextResponse.json(
        { valid: false, error: "Missing signature" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch user & team membership
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

    // 2️⃣ Recompute signature
    const data = `BATCH|${batch.batchId}|${batch.registryTopicId}`;
    const valid = verifySignature(data, sig, QR_SECRET);

    if (!valid) {
      return NextResponse.json(
        { valid: false, error: "Invalid signature" },
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

    console.log("Batch info:", batch);
    console.log("Organization id from Clerk:", orgId);
    console.log("Ownership transfer record:", transfer);

    let updatedBatch = batch;

    if (transfer && transfer.status === "PENDING") {
      // ✅ Transfer ownership
      updatedBatch = await prisma.medicationBatch.update({
        where: { batchId: batch.batchId },
        data: {
          organizationId: orgId,
          status: "DELIVERED",
        },
      });

      // Mark transfer as complete
      await prisma.ownershipTransfer.update({
        where: { id: transfer.id },
        data: { status: "COMPLETED" },
      });

      // TODO: log digital footprint on-chain
      console.log(
        `Batch ${batch.batchId} ownership transferred to org ${orgId} by user ${userId}`
      );
    } else {
      // ❌ Flag batch
      updatedBatch = await prisma.medicationBatch.update({
        where: { batchId: batch.batchId },
        data: { status: "FLAGGED" },
      });
    }

    const ipAddress =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      undefined;

    await prisma.scanHistory.create({
      data: {
        batchId: batch.id,
        teamMemberId: user.teamMember.id,
        scanResult: transfer ? "GENUINE" : "SUSPICIOUS",
        ipAddress: ipAddress as string | undefined,
      },
    });

    // 3️⃣ Response
    return NextResponse.json({
      valid: true,
      batch: updatedBatch,
    });
  } catch (err: any) {
    console.error("VerifyBatch API Error:", err);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
