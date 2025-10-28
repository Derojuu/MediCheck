// /**
//  * HCS-10 demo: create agent (topics + HCS-11 profile with UAID) using existing account.
//  */

// import 'dotenv/config';
// import { HCS10Client, AgentBuilder, InboundTopicType, AIAgentCapability } from '@hashgraphonline/standards-sdk';

// function required(name: string, value: string | undefined): string {
//   if (!value || !value.trim())
//     throw new Error(`${name} is required in environment`);
//   return value.trim();
// }

// async function main(): Promise<void> {
//   const networkEnv = required(
//     'HEDERA_NETWORK',
//     process.env.HEDERA_NETWORK || 'testnet',
//   );
//   const network = (networkEnv === 'mainnet' ? 'mainnet' : 'testnet') as
//     | 'mainnet'
//     | 'testnet';
//   const operatorId = required(
//     'HEDERA_ACCOUNT_ID',
//     process.env.HEDERA_ACCOUNT_ID,
//   );
//   const privateKey = required(
//     'HEDERA_PRIVATE_KEY',
//     process.env.HEDERA_PRIVATE_KEY,
//   );

//   const hcs10 = new HCS10Client({
//     network,
//     operatorId,
//     operatorPrivateKey: privateKey,
//     logLevel: 'info',
//   });

//   const builder = new AgentBuilder()
//     .setName('HCS-10 Demo Agent')
//     .setAlias('hcs10-demo-agent')
//     .setBio('Demo created via HCS-10 createAgent (with UAID attached)')
//     .setCapabilities([AIAgentCapability.TEXT_GENERATION])
//     .setType('autonomous')
//     .setModel('demo-model')
//     .setNetwork(network)
//     .setInboundTopicType(InboundTopicType.PUBLIC)
//     .setExistingAccount(operatorId, privateKey);

//   const res = await hcs10.createAgent(builder);

//   const output = {
//     success: true,
//     inboundTopicId: res.inboundTopicId,
//     outboundTopicId: res.outboundTopicId,
//     profileTopicId: res.profileTopicId,
//     pfpTopicId: res.pfpTopicId,
//   };
//   process.stdout.write(JSON.stringify(output, null, 2) + '\n');
// }

// main()
//   .then(() => process.exit(0))
//   .catch(err => {
//     process.stderr.write(
//       `Error: ${err instanceof Error ? err.message : String(err)}\n`,
//     );
//     process.exit(1);
//   });










// export async function createAndRegisterAgent({
//   name,
//   description,
//   orgId,
//   role,
//   model = "gpt-4o",
//   capabilities = [AIAgentCapability.TEXT_GENERATION],
//   metadata = {},
//   agentType = "autonomous",
// }: CreateAgentProp) {
//   try {
//     console.log(`🚀 Creating new HCS-10 Agent: ${name}`);

//     // Validate required fields
//     if (!orgId || !role) {
//       throw new Error("Missing required parameters: orgId or role");
//     }

//     // ---------- HCS-11: create profile payload & inscribe ----------
//     const aiAgentType =
//       agentType === "autonomous" ? AIAgentType.AUTONOMOUS : AIAgentType.MANUAL;

//     const profilePayload = hedera11Client.createAIAgentProfile(
//       name,
//       aiAgentType,
//       capabilities,
//       model,
//       {
//         bio: description,
//         creator: "HCS10Registry",
//         properties: { orgId, role, ...metadata },
//       }
//     );

//     const profileResult = await hedera11Client.createAndInscribeProfile(
//       profilePayload,
//       true
//     );

//     console.log("HCS-11 profile creation result", { profileResult });

//     if (!profileResult || !profileResult.success) {
//       const errMsg =
//         profileResult?.error || "Failed to inscribe HCS-11 profile";
//       throw new Error(errMsg);
//     }

//     const profileTopicId = profileResult.profileTopicId;
//     if (!profileTopicId)
//       throw new Error("HCS-11 profile returned no profileTopicId");

//     console.log(`🔗 HCS-11 profile created: ${profileTopicId}`);

//     // ---------- Build HCS-10 Agent object ----------
//     const agentBuilder = new AgentBuilder()
//       .setName(name)
//       .setAlias(`${name}`)
//       .setBio(description)
//       .setCapabilities(capabilities)
//       .setModel(model)
//       .setNetwork("testnet")
//       .setMetadata({
//         creator: "MEDICHECK",
//         type: agentType,
//         model: "gpt-4",
//         properties: { orgId, role, ...metadata },
//       })
//       .setInboundTopicType(InboundTopicType.PUBLIC)
//       .setType("autonomous")
//       .setCreator("MEDICHECK")
//       .setExistingAccount(process.env.HEDERA_OPERATOR_ID!, process.env.HEDERA_OPERATOR_KEY!);

//     // ---------- HCS-10: create and register the agent (no .build()) ----------
//     const createResult = await hedera10Client.createAndRegisterAgent(
//       agentBuilder,
//       {
//         progressCallback: (p) =>
//           console.log(`${p.stage}: ${p.progressPercent}%`),
//       }
//     );

//     console.log("HCS-10 createAndRegisterAgent result", { createResult });

//     if (!createResult || !createResult.success) {
//       const err = createResult?.error || "HCS-10 agent creation failed";
//       throw new Error(err);
//     }

//     console.log("HCS-10 createResult:", createResult);

//     const meta = createResult.metadata || {};
//     const accountId =
//       meta.accountId ?? meta.account?.id ?? meta.accountIdString;
//     const inboundTopicId = meta.inboundTopicId ?? meta.inboundTopic;
//     const outboundTopicId = meta.outboundTopicId ?? meta.outboundTopic;
//     const connectionTopicId = meta.connectionTopicId ?? meta.connectionTopic;
//     const publicKey = meta.publicKey ?? "";
//     const privateKey = meta.privateKey ?? null; // may or may not be present

//     if (!accountId)
//       throw new Error("HCS-10 did not return an accountId in metadata");

//     console.log(`✅ HCS-10 Agent created. Account: ${accountId}`);

//     // ---------- Optionally announce to batch registry (guarded) ----------
//     const batchTopic = process.env.HEDERA_BATCH_REGISTRY_TOPIC_ID;
//     if (batchTopic) {
//       await hedera10Client.sendMessage(
//         batchTopic,
//         JSON.stringify({
//           type: "NEW_AGENT_JOINED",
//           alias: meta.alias ?? name,
//           accountId,
//           role,
//         }),
//         "Agent subscription announcement"
//       );
//       console.log("🔔 Announced agent to batch registry", { batchTopic });
//     } else {
//       console.log(
//         "HEDERA_BATCH_REGISTRY_TOPIC_ID not set — skipping registry announcement"
//       );
//     }

//     // Optional: verify inscription memo (safe call)
//     try {
//       const memoVerification = await hedera10Client.getAccountMemo(accountId);
//       console.log("🧾 Agent account memo:", { memoVerification });
//     } catch (e) {
//       console.log("Could not fetch account memo:", {
//         error: (e as Error).message,
//       });
//     }

//     // ---------- Persist to Prisma (encrypt private key) ----------
//     const savedAgent = await prisma.agent.create({
//       data: {
//         orgId,
//         role,
//         accountId,
//         inboundTopic: inboundTopicId ?? "",
//         outboundTopic: outboundTopicId ?? "",
//         connectionTopic: connectionTopicId ?? null,
//         profileId: meta.profileId ?? null ,
//         managedRegistry: null,
//         publicKey: publicKey ?? "",
//         privateKey: privateKey ? encryptKey(privateKey) : null,
//       },
//     });

//     console.log(`✅ Agent stored in DB: ${savedAgent.accountId}`);

//     // Final return shape (useful, minimal)
//     return {
//       success: true,
//       data: {
//         agent: savedAgent,
//         hcs10: {
//           accountId,
//           inboundTopicId,
//           outboundTopicId,
//           connectionTopicId,
//         },
//         // hcs11: {
//         //   profileTopicId,
//         // },
//       },
//     };
//   } catch (err: any) {
//     console.log("❌ createAndRegisterAgent failed", {
//       message: err?.message ?? err,
//     });
//     return { success: false, error: err?.message ?? String(err) };
//   }
// }
