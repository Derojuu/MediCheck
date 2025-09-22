// app/api/classification-map/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") ?? 7);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await prisma.predictionScore.findMany({
      where: {
        predictedAt: { gte: since },
      },
      include: {
        scanHistory: {
          select: {
            latitude: true,
            longitude: true,
            region: true,
          },
        },
      },
    });

    const points = rows
      .filter(
        (r) =>
          r.scanHistory.latitude !== null && r.scanHistory.longitude !== null
      )
      .map((r) => ({
        lat: r.scanHistory.latitude as number,
        lon: r.scanHistory.longitude as number,
        region: r.scanHistory.region ?? "Unknown",
        predictedLabel: r.predictedLabel,
        probability: r.predictedProbability,
        time: r.predictedAt,
      }));

    return NextResponse.json(points);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
