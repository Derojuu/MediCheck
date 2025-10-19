import {
  AgentBuilder,
  AIAgentCapability,
  AIAgentType,
  InboundTopicType,
} from "@hashgraphonline/standards-sdk";
import { hedera10Client } from "./hedera10Client";
import { hedera11Client } from "./hedera11Client";
import { prisma } from "./prisma";
import { Logger } from "@hashgraphonline/standards-sdk";
import { encryptKey } from "./cryptoUtils";


const logger = Logger.getInstance({
  level: "info",
  module: "HCS10Service",
  prettyPrint: true,
});


/**
 * 🧠 Create a new HCS-10 Agent and automatically attach an HCS-11 profile.
 */
export async function createAndRegisterAgent({
  name,
  description,
  orgId,
  role,
  model = "gpt-4",
  capabilities = [AIAgentCapability.TEXT_GENERATION],
  metadata = {},
  agentType = "autonomous",
}: {
  name: string;
  description: string;
  orgId: string;
  role: string;
  model?: string;
  capabilities?: AIAgentCapability[];
  metadata?: Record<string, any>;
  agentType?: "manual" | "autonomous";
}) {
  try {
    console.log(`🚀 Creating new HCS-10 Agent: ${name}`);

    // 1️⃣ Validate input
    if (!orgId || !role)
      throw new Error("Missing required parameters: orgId or role");

    // create agent profile
    const profilePayload = hedera11Client.createAIAgentProfile(
      name,
      agentType === "autonomous" ? AIAgentType.AUTONOMOUS : AIAgentType.MANUAL,
      capabilities,
      model,
      {
        bio: description,
        creator: "HCS10Registry",
        properties: { orgId, role, ...metadata },
      }
    );

    const profileResult = await hedera11Client.createAndInscribeProfile(
      profilePayload,
      true
    );

    console.log("Profile creation worked", profileResult);

    console.log(
      `🔗 HCS-11 profile created: ${profileResult.profileTopicId}`
    );

    if (!profileResult.success)
      throw new Error("Failed to inscribe HCS-11 profile");


    // 2️⃣ Build HCS-10 Agent config
    const agentBuilder = new AgentBuilder()
      .setName(name)
      .setBio(description)
      .setCapabilities(capabilities)
      .setModel(model)
      .setType(agentType)
      .setNetwork("testnet")
      .setMetadata({
        creator: "MEDICHECK",
        type: agentType,
        properties: { orgId, role, ...metadata },
      })
      .setInboundTopicType(InboundTopicType.PUBLIC)
      // .setExistingAccount(
      //   process.env.HEDERA_OPERATOR_ID!,
      //   process.env.HEDERA_OPERATOR_KEY!
      // );

    // 3️⃣ Register agent on Hedera (HCS-10)
    const result = await hedera10Client.createAndRegisterAgent(agentBuilder, {
      progressCallback: (p) => logger.info(`${p.stage}: ${p.progressPercent}%`),
    });

    if (!result.success)
      throw new Error(result.error || "Agent creation failed");
    const meta = result.metadata || {};

    console.log(`✅ HCS-10 Agent created. Account: ${meta.accountId}`);


    const savedAgent = await prisma.agent.create({
      data: {
        orgId,
        role,
        accountId: meta.accountId,
        inboundTopic: meta.inboundTopicId,
        outboundTopic: meta.outboundTopicId,
        connectionTopic: meta.connectionTopicId ?? null,
        profileId: profileResult.profileTopicId,
        managedRegistry: null,
        publicKey: meta.publicKey ?? "",
        privateKey: meta.privateKey ? encryptKey(meta.privateKey) : null,
      },
    });

    console.log(`✅ Agent stored in DB: ${savedAgent.accountId}`);

    // Optional: verify inscription memo
    const memo = await hedera10Client.getAccountMemo(meta.accountId);
    
    console.log(`🧾 Account memo: ${memo}`);

    // 6️⃣ Return references
    return {
      success: true,
      data: {
        ...savedAgent,
        hcs10InboundTopic: meta.inboundTopicId,
        hcs10OutboundTopic: meta.outboundTopicId,
        hcs11ProfileTopic: profileResult.profileTopicId,
      },
    };
  }
  catch (error: any) {
    console.log(`❌ createAndRegisterAgent failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// export async function createAndRegisterAgent({
//   name,
//   description,
//   orgId,
//   role,
//   model = "gpt-4",
//   capabilities = [AIAgentCapability.TEXT_GENERATION],
//   metadata = {},
//   agentType = "autonomous",
// }: {
//   name: string;
//   description: string;
//   orgId: string;
//   role: string;
//   model?: string;
//   capabilities?: AIAgentCapability[];
//   metadata?: Record<string, any>;
//   agentType?: "manual" | "autonomous";
// }) {
//   try {
//     console.log(`🚀 Creating new HCS-10 Agent: ${name}`);

//     // 1️⃣ Validate input
//     if (!orgId || !role) throw new Error("Missing required parameters: orgId or role");

//     // 2️⃣ Build HCS-10 Agent config
//     const agentBuilder = new AgentBuilder()
//       .setName(name)
//       .setDescription(description)
//       .setAgentType(agentType)
//       .setCapabilities(capabilities)
//       .setModel(model)
//       .setNetwork("testnet")
//       .setMetadata({
//         creator: "HCS10Registry",
//         type: agentType,
//         properties: { orgId, role, ...metadata },
//       });

//     // 3️⃣ Register agent on Hedera (HCS-10)
//     const result = await hedera10Client.createAndRegisterAgent(agentBuilder, {
//       progressCallback: (p) => logger.info(`${p.stage}: ${p.progressPercent}%`),
//     });

//     if (!result.success) throw new Error(result.error || "Agent creation failed");
//     const meta = result.metadata || {};

//     console.log(`✅ HCS-10 Agent created. Account: ${meta.accountId}`);

//     // 4️⃣ Generate HCS-11 profile
//     const hcs11Client = new HCS11Client({
//       network: "testnet",
//       auth: {
//         operatorId: meta.accountId,
//         privateKey: meta.privateKey,
//       },
//     });

//     const profilePayload = hcs11Client.createAIAgentProfile(
//       name,
//       agentType === "autonomous" ? AIAgentType.AUTONOMOUS : AIAgentType.MANUAL,
//       capabilities,
//       model,
//       {
//         bio: description,
//         creator: "HCS10Registry",
//         inboundTopicId: meta.inboundTopicId,
//         outboundTopicId: meta.outboundTopicId,
//         properties: { orgId, role, ...metadata },
//       }
//     );

//     const profileResult = await hcs11Client.createAndInscribeProfile(profilePayload, true);

//     console.log("Profile creation worked", profileResult);

//     console.log(
//       `🔗 HCS-11 profile created: ${profileResult.profileTopicId}`
//     );

//     if (!profileResult.success) throw new Error("Failed to inscribe HCS-11 profile");
    
//     // 5️⃣ Persist agent and profile to DB
//     const savedAgent = await prisma.agent.create({
//       data: {
//         orgId,
//         role,
//         accountId: meta.accountId,
//         inboundTopic: meta.inboundTopicId,
//         outboundTopic: meta.outboundTopicId,
//         connectionTopic: meta.connectionTopicId ?? null,
//         profileId: profileResult.profileTopicId,
//         managedRegistry: null,
//         publicKey: meta.publicKey ?? "",
//         privateKey: meta.privateKey ? encryptKey(meta.privateKey) : null,
//       },
//     });

//     console.log(`✅ Agent stored in DB: ${savedAgent.accountId}`);

//     // Optional: verify inscription memo
//     const memo = await hedera10Client.getAccountMemo(meta.accountId);
//     console.log(`🧾 Account memo: ${memo}`);

//     // 6️⃣ Return references
//     return {
//       success: true,
//       data: {
//         ...savedAgent,
//         hcs10InboundTopic: meta.inboundTopicId,
//         hcs10OutboundTopic: meta.outboundTopicId,
//         hcs11ProfileTopic: profileResult.profileTopicId,
//       },
//     };
//   }
//   catch (error: any) {
//     console.log(`❌ createAndRegisterAgent failed: ${error.message}`);
//     return { success: false, error: error.message };
//   }
// }


/**
 * 🔍 Fetch existing agent by account ID
 */
export async function getAgent(accountId: string) {
  try {
    const agent = await prisma.agent.findUnique({ where: { accountId } });
    if (!agent) throw new Error("Agent not found");
    return { success: true, data: agent };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 📤 Send a message from one agent to another
 */
export async function sendAgentMessage(
  connectionTopicId: string,
  message: string | object,
  memo = "Agent message"
) {
  try {
    const content =
      typeof message === "object" ? JSON.stringify(message) : message;

    const result = await hedera10Client.sendMessage(
      connectionTopicId,
      content,
      memo
    );

    if (!result?.topicSequenceNumber)
      throw new Error("Message submission failed");

    logger.info(
      `📨 Message sent on ${connectionTopicId} | Sequence: ${result.topicSequenceNumber}`
    );

    return {
      success: true,
      sequenceNumber: result.topicSequenceNumber.toString(),
    };
  } catch (error: any) {
    logger.error(`❌ sendAgentMessage failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 📣 Broadcast a public message to the agent's outbound topic
 * (For public announcements like batch creation)
 */
export async function broadcastAgentMessage(
  outboundTopicId: string,
  message: string | object,
  memo = "Public Agent Broadcast"
) {
  try {
    const content =
      typeof message === "object" ? JSON.stringify(message) : message;

    const result = await hedera10Client.sendMessage(
      outboundTopicId,
      content,
      memo
    );

    if (!result?.topicSequenceNumber)
      throw new Error("Public message submission failed");

    logger.info(
      `📢 Broadcast sent on ${outboundTopicId} | Seq: ${result.topicSequenceNumber}`
    );

    return {
      success: true,
      sequenceNumber: result.topicSequenceNumber.toString(),
    };
  } catch (error: any) {
    logger.error(`❌ broadcastAgentMessage failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}


/**
 * 📥 Fetch messages from a connection topic
 */
export async function fetchMessages(topicId: string, limit = 20) {
  try {
    const { messages } = await hedera10Client.getMessages(topicId, {
      limit,
      order: "asc",
    });

    const parsed = messages.map((msg) => {
      try {
        return msg.data ? JSON.parse(msg.data) : null;
      } catch {
        return msg.data || null;
      }
    });

    return { success: true, data: parsed.filter(Boolean) };
  } catch (error: any) {
    logger.error(`❌ fetchMessages failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

