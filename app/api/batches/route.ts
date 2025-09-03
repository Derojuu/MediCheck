// /app/api/batches/route.ts
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

function generateToken(prefix: string) {
  return `${prefix}-${randomBytes(16).toString("hex")}`;
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const {
//       organizationId,
//       drugName,
//       batchSize,
//       manufacturingDate,
//       expiryDate,
//     } = body;

//     // Generate batch token
//     const batchToken = generateToken("batch");

//     // Create batch
//     const batch = await prisma.medicationBatch.create({
//       data: {
//         batchId: batchToken, // can also store in qrCodeData if needed
//         organizationId,
//         drugName,
//         batchSize,
//         manufacturingDate: new Date(manufacturingDate),
//         expiryDate: new Date(expiryDate),
//       },
//     });

//     // Create units
//     const unitsData = Array.from({ length: batchSize }).map(() => ({
//       batchId: batch.id,
//       serialNumber: generateToken("unit"),
//     }));

//     await prisma.medicationUnit.createMany({ data: unitsData });

//     return NextResponse.json({
//       success: true,
//       batchId: batch.id,
//       batchToken,
//       totalUnits: batchSize,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to create batch" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    const batches = await prisma.medicationBatch.findMany({
      include: {
        medicationUnits: false, // Keep it light; you can make a separate endpoint for units
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}
