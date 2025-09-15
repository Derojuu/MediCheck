
import { HederaLogPayload } from "@/utils";
import { prisma } from "./prisma";
import { hederaClient } from "./hederaClient";

export async function autoFlagBatch(
  batchId: string,
  topicId: string,
  organizationId: string,
  flagReason: string
) {
  // 1. Update the batch in Postgres first
  await prisma.medicationBatch.update({
    where: { id: batchId },
    data: {
      status: "FLAGGED",
    },
  });

  // prepare payload for log event
  const payload: HederaLogPayload = {
    batchId,
    organizationId,
    flagReason,
  };

  // Compose event message
  const message = JSON.stringify({
    type: "EVENT_LOG",
    eventType: "BATCH_FLAG",
    timestamp: new Date().toISOString(),
    ...payload,
  });

  // Post to Hedera
  const response = await hederaClient.registerEntry(topicId, {
    targetTopicId: topicId,
    metadata: message,
  });

  if (!response.success) {
    throw new Error(`Failed to auto-flag batch ${batchId}`);
  }

  return response.sequenceNumber;
}
