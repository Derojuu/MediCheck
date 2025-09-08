// /lib/hedera.ts

'use server'; // force server-only execution

import { HCS2Client, HCS2RegistryType } from "@hashgraphonline/standards-sdk";

// Temporarily disabled Hedera integration - package not installed
// Uncomment after installing: npm install @hashgraphonline/standards-sdk

/*
if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

const hederaClient = new HCS2Client({
  network: "testnet",
  operatorId: process.env.HEDERA_OPERATOR_ID!,
  operatorKey: process.env.HEDERA_OPERATOR_KEY!,
  logLevel: "info",
});
*/

// Temporarily disabled functions - will be restored when SDK is installed
export async function createBatchRegistry(batchId: string) {
  // return await hederaClient.createRegistry({
  //   registryType: HCS2RegistryType.INDEXED,
  //   ttl: 60 * 60 * 24 * 365, // 1 year
  //   adminKey: true,
  // });
  
  // Temporary mock implementation
  console.log(`Mock: Creating batch registry for ${batchId}`);
  return {
    success: true,
    topicId: `mock-topic-${batchId}`,
    registryId: `mock-registry-${batchId}`
  };
}

export async function registerUnitOnBatch(
  registryTopicId: string,
  unit: { serialNumber: string; drugName: string; batchId: string }
): Promise<number> {
  // const response = await hederaClient.registerEntry(registryTopicId, {
  //   targetTopicId: registryTopicId,
  //   metadata: JSON.stringify(unit),
  // });

  // if (!response.success || response.sequenceNumber === undefined) {
  //   throw new Error(`Failed to register unit ${unit.serialNumber}`);
  // }

  // Temporary mock implementation
  console.log(`Mock: Registering unit ${unit.serialNumber} on ${registryTopicId}`);
  return Math.floor(Math.random() * 1000); // Mock sequence number
}

