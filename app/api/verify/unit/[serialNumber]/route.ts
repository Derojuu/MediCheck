// app/api/verify/unit/[serialNumber]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/verifySignature";

const QR_SECRET = process.env.QR_SECRET || "dev-secret";

export async function GET(
  req: Request,
  context: { params: { serialNumber: string } }
) {
  // 👇 await params here
  const { serialNumber } = await context.params;

  const url = new URL(req.url);

  const sig = url.searchParams.get("sig");

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

  // conpare serialnumber from db with the serialnumber in the url, same thing with the 
  const splitSerialNumber = serialNumber.split("-");
  const batchIdFromUrl = splitSerialNumber[1] +"-"+ splitSerialNumber[2]
  
  if (batchIdFromUrl !== unit.batch.batchId || sig !== unit.qrSignature) {
    return NextResponse.json(
      { valid: false, error: "This verification url is not legitimate." },
      { status: 400 }
    );
  }

  // 2️⃣ Recompute signature
  const data = `${unit.serialNumber}|${unit.batch.batchId}|${unit.registrySequence}`;
  
  const valid = verifySignature(data, sig, QR_SECRET);

  // 3️⃣ Respond
  return NextResponse.json({
    valid,
    unit,
    batch: unit.batch,
  });
}
