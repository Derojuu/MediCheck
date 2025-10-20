// // /lib/provenance.ts
// import { prisma } from './prisma';
// import { hedera2Client } from './hedera2Client';
// import { hedera10Client } from './hedera10Client';
// import { Logger } from '@hashgraphonline/standards-sdk';

// const logger = Logger.getInstance({
//   module: 'Provenance',
//   level: 'info',
//   prettyPrint: true,
// });

// type TimelineItem = {
//   id: string; // synthetic id
//   source: 'HCS2' | 'HCS10' | 'DB';
//   timestamp: string; // ISO
//   kind: string; // e.g. UNIT, BATCH_CREATED, BATCH_OWNERSHIP, announce_batch, transfer_request
//   payload: any; // parsed payload
//   sourceTopic?: string;
//   sequence?: number;
//   operator?: string; // Hedera operator id (payer)
//   verified?: boolean; // signature/operator checks
//   meta?: any;
// };




// /**
//  * Main entry: returns assembled provenance timeline for a batchId
//  */
// export async function getBatchProvenance(batchId: string, opts?: { limitEvents?: number }) {
//   logger.info(`Assembling provenance for batch ${batchId}`);

//   // 1) Fetch batch from DB (must exist)
//   const batch = await prisma.medicationBatch.findUnique({ where: { batchId } });
//   if (!batch) throw new Error('Batch not found');

//   const registryTopicId = batch.registryTopicId;
//   if (!registryTopicId) throw new Error('No registryTopicId for batch');

//   // Prepare timeline container
//   const timeline: TimelineItem[] = [];

//   // 2) Fetch HCS-2 registry entries (authoritative events)
//   try {
//     // getRegistry returns entries, adjust to your SDK signature
//     const registryResp: any = await hedera2Client.getRegistry(registryTopicId, {
//       limit: opts?.limitEvents ?? 1000,
//       order: 'asc',
//     });

//     const entries = registryResp.entries || registryResp; // adapt shape
//     for (const e of entries) {
//       // e.metadata is the message you wrote (string)
//       let parsed;
//       try {
//         parsed = typeof e.metadata === 'string' ? JSON.parse(e.metadata) : e.metadata;
//       } catch {
//         parsed = { raw: e.metadata };
//       }

//       // canonical HCS-2 items contain type, eventType, timestamp etc.
//       const ts = parsed.timestamp || e.consensus_timestamp || new Date().toISOString();

//       timeline.push({
//         id: `hcs2-${registryTopicId}-${e.sequence_number ?? e.seq ?? ''}`,
//         source: 'HCS2',
//         timestamp: new Date(ts).toISOString(),
//         kind: parsed.type || parsed.eventType || 'HCS2_ENTRY',
//         payload: parsed,
//         sourceTopic: registryTopicId,
//         sequence: Number(e.sequence_number ?? e.seq ?? 0),
//         operator: e.operator_id || e.payer || undefined,
//         verified: true, // HCS-2 writes are assumed canonical (we can optionally verify tx sig separately)
//       });
//     }
//   } catch (err) {
//     logger.error(`Failed to read HCS-2 registry ${registryTopicId}: ${err.message}`);
//   }

//   // 3) Collect agent account IDs referenced in HCS-2 events
//   const agentAccounts = new Set<string>();
//   for (const item of timeline) {
//     const p = item.payload;
//     if (!p) continue;
//     // common fields where accounts may appear
//     if (p.fromAgent) agentAccounts.add(p.fromAgent);
//     if (p.toAgent) agentAccounts.add(p.toAgent);
//     if (p.signedBy) agentAccounts.add(p.signedBy);
//     if (p.payer) agentAccounts.add(p.payer);
//     if (item.operator) agentAccounts.add(item.operator);
//     // add more heuristics if your event shapes differ
//   }

//   // 4) Try to find agents in DB (fast)
//   const agentsByAccount: Record<string, any> = {};
//   if (agentAccounts.size > 0) {
//     const accounts = Array.from(agentAccounts);
//     const agents = await prisma.agent.findMany({
//       where: { accountId: { in: accounts } },
//     });
//     for (const a of agents) agentsByAccount[a.accountId] = a;
//   }

//   // 5) Fetch HCS-10 messages relevant to this batch
//   // Strategy: check global announcement topic (if configured), then agent inbound/outbound topics, then connection topics in DB
//   const publicAnnouncementTopic = process.env.PUBLIC_BATCH_ANNOUNCEMENT_TOPIC;

//   const hcs10Messages: any[] = [];

//   async function fetchAndParseMessages(topicId: string) {
//     try {
//       const { messages } = await hedera10Client.getMessages(topicId, { limit: 500, order: 'asc' });
//       for (const m of messages) {
//         // m.data may be JSON or hcs1 reference; try parse
//         let content: any = m.data;
//         try {
//           if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
//             content = JSON.parse(content);
//           }
//         } catch {}
//         hcs10Messages.push({ topicId, msg: m, content });
//       }
//     } catch (err) {
//       logger.warn(`Failed to fetch HCS-10 messages for ${topicId}: ${err.message}`);
//     }
//   }

//   // 5a) public announce topic
//   if (publicAnnouncementTopic) await fetchAndParseMessages(publicAnnouncementTopic);

//   // 5b) agent topics discovered from DB
//   const knownAgentTopics = new Set<string>();
//   for (const accountId of Object.keys(agentsByAccount)) {
//     const a = agentsByAccount[accountId];
//     if (a?.inboundTopic) knownAgentTopics.add(a.inboundTopic);
//     if (a?.outboundTopic) knownAgentTopics.add(a.outboundTopic);
//   }

//   // fetch each
//   for (const t of Array.from(knownAgentTopics)) {
//     await fetchAndParseMessages(t);
//   }

//   // 5c) connection topics (if you store them)
//   const connections = await prisma.connection.findMany({
//     where: {
//       OR: [
//         { initiatorAccount: { in: Array.from(agentAccounts) } },
//         { participantAccount: { in: Array.from(agentAccounts) } },
//       ],
//       // optional: only those referencing this batch (if you store batchId in connection metadata)
//     },
//   }).catch(() => []);

//   for (const c of connections || []) {
//     if (c.connectionTopicId) await fetchAndParseMessages(c.connectionTopicId);
//   }

//   // 6) Parse HCS10 messages and only keep those referencing this batch
//   for (const m of hcs10Messages) {
//     const { topicId, msg, content } = m;

//     // quick filter heuristics: content may be object with batchId or payload referencing registryTopicId
//     const batchRef = (content && (content.batchId || content.payload?.batchId || content.data?.batchId)) || null;
//     const registryRef = (content && (content.registryTopicId || content.payload?.registryTopicId || content.data?.registryTopicId)) || null;

//     // keep if relevant
//     if (String(batchRef) === String(batchId) || String(registryRef) === String(registryTopicId)) {
//       // verify signature if present
//       let verified = false;
//       try {
//         // if message has signedBy and sig fields use agent publicKey to verify
//         const signedBy = content?.signedBy || content?.signed_by || msg.operator_id || null;
//         const sig = content?.sig || content?.signature || null;

//         if (sig && signedBy) {
//           const agent = agentsByAccount[signedBy] || (await prisma.agent.findUnique({ where: { accountId: signedBy } })).catch(()=>null);
//           if (agent?.publicKey && sig) {
//             // implement your verification function (e.g., verifyHcs10Signature)
//             verified = await verifyHcs10Signature(content, sig, agent.publicKey).catch(()=>false);
//           }
//         } else {
//           // no signature — if operator_id equals expected agent, mark as tentative true
//           verified = !!msg.operator_id;
//         }
//       } catch (e) {
//         verified = false;
//       }

//       // consensus timestamp may be msg.consensus_timestamp (sdk shapes vary)
//       const ts = (msg.consensus_timestamp || msg.consensusTime || msg.timestamp) || new Date().toISOString();
//       timeline.push({
//         id: `hcs10-${topicId}-${msg.sequence_number ?? msg.seq ?? ''}`,
//         source: 'HCS10',
//         timestamp: new Date(ts).toISOString(),
//         kind: content?.op || content?.type || 'HCS10_MESSAGE',
//         payload: content,
//         sourceTopic: topicId,
//         sequence: Number(msg.sequence_number ?? msg.seq ?? 0),
//         operator: msg.operator_id || msg.payer || undefined,
//         verified,
//         meta: { originalMsg: msg },
//       });
//     }
//   }

//   // 7) Optionally read DB-stored events (batchEvent table) and include
//   const dbEvents = await prisma.batchEvent.findMany({
//     where: { batchId: batch.id },
//     orderBy: { createdAt: 'asc' },
//   }).catch(()=>[]);

//   for (const e of dbEvents) {
//     timeline.push({
//       id: `db-${e.id}`,
//       source: 'DB',
//       timestamp: e.createdAt.toISOString(),
//       kind: e.eventType,
//       payload: e.payload,
//       meta: { hederaSeq: e.hederaSeq, region: e.region },
//       verified: true,
//     });
//   }

//   // 8) Merge & sort by timestamp
//   timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

//   // 9) Post-process: compute current owner by scanning BATCH_OWNERSHIP items (HCS-2 authoritative)
//   let currentOwner: string | null = batch.ownerAgentAccount || null;
//   // if not present in DB, try to find latest BATCH_OWNERSHIP in timeline
//   const ownershipEvents = timeline.filter(t => t.kind === 'BATCH_OWNERSHIP' || t.kind === 'EVENT_LOG' && t.payload?.eventType === 'BATCH_OWNERSHIP');
//   if (ownershipEvents.length) {
//     const latest = ownershipEvents[ownershipEvents.length - 1];
//     currentOwner = latest.payload?.toAgent || latest.payload?.owner || currentOwner;
//   }

//   // 10) Build result
//   const result = {
//     batchId,
//     registryTopicId,
//     currentOwner,
//     timeline,
//     agents: agentsByAccount, // limited agent info
//   };

//   // Optionally cache result in DB for fast retrieval
//   // await prisma.batchProvenance.upsert(...)

//   return result;
// }




// /**
//  * Example signature verification helper (implement according to how messages are signed).
//  * Here is a placeholder - adapt to the actual algorithm (Hedera key verify, or HMAC fallback).
//  */
// async function verifyHcs10Signature(content: any, signature: string, publicKeyPemOrHex: string): Promise<boolean> {
//   // Example: if you used Hedera/Ed25519 signatures, use @hashgraph/sdk to verify
//   // Or if you used HMAC fallback, recompute HMAC and compare using timingSafeEqual.
//   // For now return true as placeholder - replace with real implementation.
//   try {
//     // TODO: implement proper verification
//     return true;
//   } catch (err) {
//     return false;
//   }
// }
