// /lib/hedera.ts
import { hedera2Client } from "./hedera2Client";
import { HCS2RegistryType } from "@hashgraphonline/standards-sdk";
import { HederaLogPayload } from "@/utils";


export async function createBatchRegistry(
  batchId: string,
  orgId?: string,
  drugName?: string
) {
  // Step 1: Create the registry topic
  const registry = await hedera2Client.createRegistry({
    registryType: HCS2RegistryType.INDEXED,
    ttl: 60 * 60 * 24 * 365, // 1 year
    adminKey: true,
  });

  if (!registry.success || !registry.topicId) {
    throw new Error("Failed to create batch registry");
  }

  const registryTopicId = registry.topicId;

  // Step 2: Store metadata as the first registry entry (acts as memo)
  const metaPayload = {
    type: "BATCH_REGISTRY_META",
    batchId,
    orgId,
    drugName,
    createdAt: new Date().toISOString(),
  };

  await hedera2Client.registerEntry(registryTopicId, {
    targetTopicId: registryTopicId,
    metadata: JSON.stringify(metaPayload),
  });

  return registry;
}


/**
 * Creates a managed registry for an organization.
 * This registry will store all batch events and metadata belonging to the org.
 */
export async function createOrgManagedRegistry(orgId: string, orgName: string) {
  const registry = await hedera2Client.createRegistry({
    registryType: HCS2RegistryType.INDEXED,
    ttl: 60 * 60 * 24 * 365 * 2, // 2 years
    adminKey: true,
  });

  if (!registry.success || !registry.topicId) {
    throw new Error("Failed to create organization managed registry");
  }

  const registryTopicId = registry.topicId;

  // Write metadata entry describing the organization registry
  const metaPayload = {
    type: "ORG_REGISTRY_META",
    orgId,
    orgName,
    createdAt: new Date().toISOString(),
  };

  await hedera2Client.registerEntry(registryTopicId, {
    targetTopicId: registryTopicId,
    metadata: JSON.stringify(metaPayload),
  });

  return registryTopicId;
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
  eventType:
    | "BATCH_CREATED"
    | "BATCH_OWNERSHIP"
    | "BATCH_FLAG"
    | "BATCH_UNITS_REGISTERED",
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

