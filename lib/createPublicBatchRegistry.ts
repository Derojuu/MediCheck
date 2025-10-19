import { hedera10Client } from "./hedera10Client";

export const createPublicBatchRegistry = async () => {
  
  try {

    const registry = await hedera10Client.createTopic("MEDICHECK PUBLIC BATCH V1");
    console.log("✅ Batch Registry Topic created:", registry);
    return { status: 200, data: registry };
  }
  catch (error) {
    if (error instanceof Error) {
        console.error("Error message:", error.message);
        return { status: 400, data: error.message };
    } else {
      console.error("An unknown error occurred:", error);
      return { status: 400, data: error };
    }
  }
}

