// /lib/hedera.ts
"use server"; 

import { HCS2Client, HCS2RegistryType } from "@hashgraphonline/standards-sdk";
import { HederaLogPayload } from "@/utils";
import { Client, TopicMessageQuery } from "@hashgraph/sdk";
import { mirrorClient } from "./mirrorClient";

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


/**
 * Fetch all EVENT_LOG messages from a Hedera topic using the batch registryId
 */
export async function getBatchEventLogs(topicId: string) {
  const messages: any[] = [];

  return new Promise<any[]>((resolve, reject) => {
    new TopicMessageQuery().setTopicId(topicId).subscribe(
      mirrorClient,
      (msg) => {
        try {
          if (!msg?.contents) return; 

          const decoded = Buffer.from(msg?.contents).toString("utf8");
          const parsed = JSON.parse(decoded);

          if (parsed.type === "EVENT_LOG") {
            messages.push({
              ...parsed,
              consensusTimestamp: msg.consensusTimestamp?.toDate(),
            });
          }
        } catch (err) {
          console.error("Error parsing message", err);
        }
      },
      (err) => reject(err)
    );

    // Resolve after 2 seconds to allow messages to arrive
    setTimeout(() => {
      messages.sort(
        (a, b) =>
          new Date(a.consensusTimestamp).getTime() -
          new Date(b.consensusTimestamp).getTime()
      );
      resolve(messages);
    }, 2000);
  });
}
