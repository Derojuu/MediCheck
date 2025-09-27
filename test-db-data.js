// Quick script to check database data
const { PrismaClient } = require('./lib/generated/prisma');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log("=== CHECKING DATABASE DATA ===");
    
    // Check scan history
    const scanCount = await prisma.scanHistory.count();
    console.log(`Total scan history records: ${scanCount}`);
    
    const suspiciousScans = await prisma.scanHistory.count({
      where: { scanResult: 'SUSPICIOUS' }
    });
    console.log(`Suspicious scans: ${suspiciousScans}`);
    
    // Check scans with location data  
    const scansWithLocation = await prisma.scanHistory.count({
      where: {
        scanResult: 'SUSPICIOUS',
        latitude: { not: null },
        longitude: { not: null },
        region: { not: null }
      }
    });
    console.log(`Suspicious scans with location: ${scansWithLocation}`);
    
    // Show sample scan data
    const sampleScans = await prisma.scanHistory.findMany({
      take: 3,
      where: {
        scanResult: 'SUSPICIOUS',
        latitude: { not: null },
        longitude: { not: null },
        region: { not: null }
      },
      select: {
        scanResult: true,
        scanDate: true,
        region: true,
        latitude: true,
        longitude: true
      }
    });
    console.log("Sample scan data:", JSON.stringify(sampleScans, null, 2));
    
    // Check what scan result values we have
    const resultTypes = await prisma.scanHistory.groupBy({
      by: ['scanResult'],
      _count: {
        scanResult: true
      }
    });
    console.log("Scan result types:", JSON.stringify(resultTypes, null, 2));
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();