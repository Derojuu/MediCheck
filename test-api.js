// Test the hotspot prediction API
const { PrismaClient } = require('./lib/generated/prisma');

const prisma = new PrismaClient();

async function testAPI() {
  try {
    console.log("=== TESTING HOTSPOT PREDICTION LOGIC ===");
    
    // Check data within 30 days (matching our API default)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentScans = await prisma.scanHistory.count({
      where: {
        scanResult: 'SUSPICIOUS',
        scanDate: { gte: thirtyDaysAgo },
        latitude: { not: null },
        longitude: { not: null },
        region: { not: null }
      }
    });
    
    console.log(`Recent scans (last 30 days): ${recentScans}`);
    console.log(`Date cutoff: ${thirtyDaysAgo.toISOString()}`);
    
    // Show date range of our scans
    const dateRange = await prisma.scanHistory.aggregate({
      where: { scanResult: 'SUSPICIOUS' },
      _min: { scanDate: true },
      _max: { scanDate: true }
    });
    
    console.log("Scan date range:");
    console.log(`- Oldest: ${dateRange._min.scanDate}`);
    console.log(`- Newest: ${dateRange._max.scanDate}`);
    
    // Test the API call with better error handling
    console.log("\n=== TESTING API CALL ===");
    try {
      const response = await fetch('http://localhost:3000/api/hotspots/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: 'Ogun',
          timeWindow: 30,
          riskThreshold: 0.01  // Very low threshold to get any predictions
        })
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));
      } else {
        const text = await response.text();
        console.log("Response (not JSON):", text.substring(0, 200) + "...");
      }
      
    } catch (fetchError) {
      console.log("Fetch error:", fetchError.message);
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();