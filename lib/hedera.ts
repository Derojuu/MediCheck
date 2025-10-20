// /lib/hedera.ts

import { hedera2Client } from "./hedera2Client";
import { HCS2RegistryType } from "@hashgraphonline/standards-sdk";
import { HederaLogPayload } from "@/utils";

export async function createBatchRegistry(batchId: string) {
  return await hedera2Client.createRegistry({
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
  });

  const response = await hedera2Client.registerEntry(registryTopicId, {
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
  eventType: "BATCH_CREATED" | "BATCH_OWNERSHIP" | "BATCH_FLAG",
  payload: HederaLogPayload
) {
  const message = JSON.stringify({
    type: "EVENT_LOG",
    eventType,
    timestamp: new Date().toISOString(),
    ...payload,
  });

  const response = await hedera2Client.registerEntry(topicId, {
    targetTopicId: topicId,
    metadata: message,
  });

  if (!response.success) {
    throw new Error(`Failed to log event to Hedera topic ${topicId}`);
  }

  return response.sequenceNumber;
}

/**
 * Fetch all EVENT_LOG messages from a Hedera topic using the batch registryId
 */

export const getBatchEventLogs = async (topicId: string) => {
  const messages = await hedera2Client.getRegistry(topicId, {
    limit: 100,
    order: "asc",
  });

  return messages.entries;
};
