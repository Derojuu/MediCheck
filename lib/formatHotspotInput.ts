// /lib/formatHotspotInput.ts - Format input for hotspot prediction model
import { prisma } from "@/lib/prisma";

// Input interface for hotspot prediction
export interface HotspotInput {
  latitude: number;
  longitude: number;
  region: string;
  timeWindow: number;        // Days to analyze
  scanDensity: number;      // Scans per square km
  historicalIncidents: number;
  incidentTrend: number;    // Trend factor (increasing/decreasing)
  timeOfDay: string;
  dayOfWeek: string;
  populationDensity?: number;
  economicIndicator?: number;
}

// Geographic analysis area interface
export interface AnalysisArea {
  latitude: number;
  longitude: number;
  region: string;
  scanCount: number;
  historicalIncidents: number;
  recentIncidents: number;
  trendFactor: number;
}

// Model feature columns - exactly matching the training data from pd.get_dummies()
const hotspotModelInputs = [
  // Base features (non-categorical)
  "latitude",
  "longitude", 
  "past_incident_rate",
  "user_flag",
  
  // Region one-hot encoded features (37 regions including Abuja)
  "region_Abia", "region_Abuja", "region_Adamawa", "region_Akwa Ibom", "region_Anambra", 
  "region_Bauchi", "region_Bayelsa", "region_Benue", "region_Borno", "region_Cross River", 
  "region_Delta", "region_Ebonyi", "region_Edo", "region_Ekiti", "region_Enugu", 
  "region_Gombe", "region_Imo", "region_Jigawa", "region_Kaduna", "region_Kano", 
  "region_Katsina", "region_Kebbi", "region_Kogi", "region_Kwara", "region_Lagos", 
  "region_Nasarawa", "region_Niger", "region_Ogun", "region_Ondo", "region_Osun", 
  "region_Oyo", "region_Plateau", "region_Rivers", "region_Sokoto", "region_Taraba", 
  "region_Yobe", "region_Zamfara",
  
  // Time of day one-hot encoded features (4 features)
  "time_of_day_afternoon", "time_of_day_evening", "time_of_day_morning", "time_of_day_night",
  
  // Day of week one-hot encoded features (7 features)
  "day_of_week_Fri", "day_of_week_Mon", "day_of_week_Sat", "day_of_week_Sun", 
  "day_of_week_Thu", "day_of_week_Tue", "day_of_week_Wed"
];

/**
 * Encode hotspot prediction features for the ML model
 * Matches exactly the training data structure from pd.get_dummies()
 * Returns features in the exact same order as training
 */
export const encodeHotspotFeatures = (input: HotspotInput): number[] => {
  const arr = new Array(hotspotModelInputs.length).fill(0);

  console.log(`Expected features: ${hotspotModelInputs.length}`);

  for (let i = 0; i < hotspotModelInputs.length; i++) {
    const col = hotspotModelInputs[i];
    
    // Base numerical features
    if (col === "latitude") arr[i] = input.latitude || 0;
    else if (col === "longitude") arr[i] = input.longitude || 0;
    else if (col === "past_incident_rate") {
      // Map our historical incidents to past_incident_rate (0-1)
      arr[i] = Math.min((input.historicalIncidents || 0) / Math.max(input.scanDensity || 1, 1), 1);
    }
    else if (col === "user_flag") {
      // Simulate user flag based on incident trend
      arr[i] = (input.incidentTrend || 0) > 10 ? 1 : 0;
    }
    
    // Region one-hot encoding (exact match with training data)
    else if (col.startsWith("region_")) {
      const regionName = col.replace("region_", "");
      // Handle region name mapping
      let inputRegion = input.region || "";
      if (inputRegion === "FCT" || inputRegion === "Federal Capital Territory") {
        inputRegion = "Abuja";
      }
      arr[i] = (inputRegion === regionName) ? 1 : 0;
    }
    
    // Time of day one-hot encoding
    else if (col.startsWith("time_of_day_")) {
      const timeOfDay = col.replace("time_of_day_", "");
      arr[i] = (input.timeOfDay === timeOfDay) ? 1 : 0;
    }
    
    // Day of week one-hot encoding
    else if (col.startsWith("day_of_week_")) {
      const dayOfWeek = col.replace("day_of_week_", "");
      arr[i] = (input.dayOfWeek === dayOfWeek) ? 1 : 0;
    }
  }

  // Validate feature count matches training
  const expectedFeatureCount = 4 + 37 + 4 + 7; // base + regions + time + days = 52
  if (arr.length !== expectedFeatureCount) {
    console.error(`Feature count mismatch! Generated: ${arr.length}, Expected: ${expectedFeatureCount}`);
    console.error(`Breakdown: Base(4) + Regions(37) + Time(4) + Days(7) = ${expectedFeatureCount}`);
  }

  console.log(`Final feature count: ${arr.length} (Expected: ${expectedFeatureCount})`);
  console.log(`Features sample:`, arr.slice(0, 10));
  
  // Verify one-hot encoding worked
  const regionActive = arr.slice(4, 41).some(val => val === 1);
  const timeActive = arr.slice(41, 45).some(val => val === 1);
  const dayActive = arr.slice(45, 52).some(val => val === 1);
  
  console.log(`One-hot encoding check - Region: ${regionActive}, Time: ${timeActive}, Day: ${dayActive}`);
  
  return arr;
};

/**
 * Analyze geographic area for hotspot prediction
 * Gets historical counterfeit patterns and calculates risk indicators
 */
export const analyzeGeographicArea = async (
  latitude: number,
  longitude: number,
  region: string,
  radiusKm: number = 10
): Promise<AnalysisArea> => {
  
  // Get historical scan data for this area
  const scansInArea = await prisma.scanHistory.findMany({
    where: {
      latitude: {
        gte: latitude - (radiusKm / 111), // Rough conversion to degrees
        lte: latitude + (radiusKm / 111)
      },
      longitude: {
        gte: longitude - (radiusKm / (111 * Math.cos(latitude * Math.PI / 180))),
        lte: longitude + (radiusKm / (111 * Math.cos(latitude * Math.PI / 180)))
      }
    },
    orderBy: { scanDate: 'desc' }
  });

  // Count historical counterfeit incidents (using scanResult as primary indicator)
  const historicalIncidents = scansInArea.filter(scan => 
    scan.scanResult === 'SUSPICIOUS'
  ).length;

  // Count recent incidents (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentIncidents = scansInArea.filter(scan => {
    const hasCounterfeit = scan.scanResult === 'SUSPICIOUS';
    return hasCounterfeit && new Date(scan.scanDate) >= thirtyDaysAgo;
  }).length;

  // Calculate trend factor (recent vs historical average)
  const historicalAverage = historicalIncidents / Math.max(scansInArea.length, 1);
  const recentRate = recentIncidents / Math.max(scansInArea.filter(scan => 
    new Date(scan.scanDate) >= thirtyDaysAgo
  ).length, 1);

  const trendFactor = recentRate / Math.max(historicalAverage, 0.01);

  return {
    latitude,
    longitude,
    region,
    scanCount: scansInArea.length,
    historicalIncidents,
    recentIncidents,
    trendFactor: Math.min(trendFactor, 5) // Cap at 5x trend
  };
};

/**
 * Calculate temporal features for hotspot prediction
 */
export const calculateTemporalFeatures = (date: Date = new Date()) => {
  const hour = date.getHours();
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  
  // Map to our training categories
  const timeOfDay = hour < 6 ? 'night' :
                   hour < 12 ? 'morning' :
                   hour < 18 ? 'afternoon' : 
                   hour < 22 ? 'evening' : 'night';
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = dayNames[day];
  
  return { timeOfDay, dayOfWeek };
};