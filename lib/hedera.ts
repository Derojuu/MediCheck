// /lib/hedera.ts

'use server'; // force server-only execution

import { HCS2Client, HCS2RegistryType } from "@hashgraphonline/standards-sdk";

if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

const hederaClient = new HCS2Client({
  network: "testnet",
  operatorId: process.env.HEDERA_OPERATOR_ID!,
  operatorKey: process.env.HEDERA_OPERATOR_KEY!,
  logLevel: "info",
});

export async function createBatchRegistry(batchId: string) {
  return await hederaClient.createRegistry({
    registryType: HCS2RegistryType.INDEXED,
    ttl: 60 * 60 * 24 * 365, // 1 year
    adminKey: true,
  });
}

export async function registerUnitOnBatch(
  registryTopicId: string,
  unit: { serialNumber: string; drugName: string; batchId: string }
): Promise<number> {
  const response = await hederaClient.registerEntry(registryTopicId, {
    targetTopicId: registryTopicId,
    metadata: JSON.stringify(unit),
  });

  if (!response.success || response.sequenceNumber === undefined) {
    throw new Error(`Failed to register unit ${unit.serialNumber}`);
  }

  return response.sequenceNumber; // 🟢 safe now
}

