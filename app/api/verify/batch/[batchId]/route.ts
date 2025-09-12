// app/api/verify/batch/[batchId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/verifySignature";

const QR_SECRET = process.env.QR_SECRET || "dev-secret";

export async function GET(
  req: Request,
  context : { params: { batchId: string } }
) {
  
  const { batchId } = await context.params;

  const url = new URL(req.url);

  const sig = url.searchParams.get("sig");

  if (!sig) {
    return NextResponse.json(
      { valid: false, error: "Missing signature" },
      { status: 400 }
    );
  }

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

  // 3️⃣ Response
  return NextResponse.json({
    valid,
    batch,
  });

}
