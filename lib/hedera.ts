// /lib/hedera.ts
import { HCS2Client, HCS2RegistryType } from "@hashgraphonline/standards-sdk";

if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

export const hederaClient = new HCS2Client({
  network: "testnet",
  operatorId: process.env.HEDERA_OPERATOR_ID,
  operatorKey: process.env.HEDERA_OPERATOR_KEY,
  logLevel: "info",
});

/**
 * Create a new Hedera registry for a medication batch
 */
export async function createBatchRegistry(batchId: string) {
  return await hederaClient.createRegistry({
    registryType: HCS2RegistryType.INDEXED,
    ttl: 60 * 60 * 24 * 365, // 1 year
    adminKey: true, // use operator key
  });
}

/**
 * Register a unit entry under the batch registry
 */
export async function registerUnit(
  registryTopicId: string,
  unitSerial: string,
  metadataUrl?: string
) {
  return await hederaClient.registerEntry(registryTopicId, {
    targetTopicId: registryTopicId, // self-referencing registry
    metadata: metadataUrl || `unit:${unitSerial}`,
    memo: `Register unit ${unitSerial}`,
  });
}
