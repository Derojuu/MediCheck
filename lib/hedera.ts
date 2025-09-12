// /lib/hedera.ts
"use server"; 

import { HCS2Client, HCS2RegistryType } from "@hashgraphonline/standards-sdk";
import { HederaLogPayload } from "@/utils";

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
    ttl: 60 * 60 * 24 * 365,
    adminKey: true,
  });

}

export async function registerUnitOnBatch(
  registryTopicId: string,
  unit: { serialNumber: string; drugName: string; batchId: string }
): Promise<number> {

  const message = JSON.stringify({
    type: "UNIT",
    ...unit,
  })

  const response = await hederaClient.registerEntry(registryTopicId, {
    targetTopicId: registryTopicId,
    metadata: message,
  });

  if (!response.success || response.sequenceNumber === undefined) {
    throw new Error(`Failed to register unit ${unit.serialNumber}`);
  }

  return response.sequenceNumber; 

}


export async function logBatchEvent(
  topicId: string,
  eventType: "BATCH_CREATED" | "BATCH_OWNERSHIP",
  payload: HederaLogPayload
) {

  const message = JSON.stringify({
    type: "EVENT_LOG",
    eventType,
    timestamp: new Date().toISOString(),
    ...payload,
  });

  const response = await hederaClient.registerEntry(topicId, {
    targetTopicId: topicId,
    metadata: message,
  });

  if (!response.success) {
    throw new Error(`Failed to log event to Hedera topic ${topicId}`);
  }

  return response.sequenceNumber;
}
