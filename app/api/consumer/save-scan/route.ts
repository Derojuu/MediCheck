// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server';
// import { prisma } from '@/lib/prisma';

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await request.json();
//     const { unitId, scanResult, latitude, longitude } = body;

//     // Validate required fields
//     if (!unitId || !scanResult) {
//       return NextResponse.json({ 
//         error: 'Unit ID and scan result are required' 
//       }, { status: 400 });
//     }

//     // Validate scan result enum
//     const validScanResults = ['GENUINE', 'COUNTERFEIT', 'SUSPICIOUS', 'NOT_FOUND', 'EXPIRED'];
//     if (!validScanResults.includes(scanResult)) {
//       return NextResponse.json({ 
//         error: 'Invalid scan result. Must be one of: ' + validScanResults.join(', ') 
//       }, { status: 400 });
//     }

//     // Find the user and their consumer profile
//     const user = await prisma.user.findUnique({
//       where: {
//         clerkUserId: userId,
//       },
//       include: {
//         consumer: true,
//       },
//     });

//     if (!user || !user.consumer) {
//       return NextResponse.json({ error: 'Consumer profile not found' }, { status: 404 });
//     }

//     // Check if the unit exists
//     const unit = await prisma.medicationUnit.findUnique({
//       where: {
//         id: unitId,
//       },
//       include: {
//         batch: {
//           include: {
//             organization: true,
//           },
//         },
//       },
//     });

//     if (!unit) {
//       return NextResponse.json({ error: 'Medication unit not found' }, { status: 404 });
//     }

//     // Save the scan history
//     const scanHistory = await prisma.scanHistory.create({
//       data: {
//         unitId: unitId,
//         consumerId: user.consumer.id,
//         scanResult: scanResult,
//         latitude: latitude || null,
//         longitude: longitude || null,
//       },
//       include: {
//         unit: {
//           include: {
//             batch: {
//               include: {
//                 organization: true,
//               },
//             },
//           },
//         },
//         consumer: true,
//       },
//     });

//     // Format the response
//     const formattedScan = {
//       id: scanHistory.id,
//       batchId: scanHistory.unit.batch.batchId,
//       drugName: scanHistory.unit.batch.drugName,
//       manufacturer: scanHistory.unit.batch.organization.companyName,
//       scanDate: scanHistory.timestamp.toISOString().split('T')[0],
//       location: scanHistory.latitude && scanHistory.longitude 
//         ? `${scanHistory.latitude.toFixed(4)}, ${scanHistory.longitude.toFixed(4)}` 
//         : 'Unknown',
//       result: scanHistory.scanResult,
//       expiryDate: scanHistory.unit.batch.expiryDate.toISOString().split('T')[0],
//       serialNumber: scanHistory.unit.serialNumber,
//       scanStatus: scanHistory.scanResult,
//       warning: scanHistory.unit.batch.expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
//         ? 'Approaching expiry date' 
//         : null,
//     };

//     return NextResponse.json({
//       message: 'Scan saved successfully',
//       scan: formattedScan
//     });

//   }
//   catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to save scan' },
//       { status: 500 }
//     );
//   }
// }