import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user and their consumer profile
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        consumer: true,
      },
    });

    if (!user || !user.consumer) {
      return NextResponse.json({ error: 'Consumer profile not found' }, { status: 404 });
    }

    // Get scan history for this consumer
    const scanHistory = await prisma.unitScanHistory.findMany({
      where: {
        consumerId: user.consumer.id,
      },
      include: {
        unit: {
          include: {
            batch: {
              include: {
                organization: true,
              },
            },
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 50, // Limit to last 50 scans
    });

    // Format the response to match the existing UI structure
    const formattedHistory = scanHistory.map((scan) => ({
      id: scan.id,
      batchId: scan.unit.batch.batchId,
      drugName: scan.unit.batch.drugName,
      manufacturer: scan.unit.batch.organization.companyName,
      scanDate: scan.timestamp.toISOString().split('T')[0],
      location: scan.latitude && scan.longitude 
        ? `${scan.latitude.toFixed(4)}, ${scan.longitude.toFixed(4)}` 
        : 'Unknown',
      result: scan.scanResult,
      expiryDate: scan.unit.batch.expiryDate.toISOString().split('T')[0],
      serialNumber: scan.unit.serialNumber,
      scanStatus: scan.scanResult,
      // Check if approaching expiry (within 30 days)
      warning: scan.unit.batch.expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
        ? 'Approaching expiry date' 
        : null,
    }));

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan history' },
      { status: 500 }
    );
  }
}