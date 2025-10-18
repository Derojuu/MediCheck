import {
  AgentBuilder,
  AIAgentCapability,
  InboundTopicType,
} from "@hashgraphonline/standards-sdk";
import { hedera10Client } from "./hedera10Client";
import { prisma } from "./prisma";
import { Logger } from "@hashgraphonline/standards-sdk";
import { Agent } from "./generated/prisma";
import { encryptKey } from "./cryptoUtils";

const logger = Logger.getInstance({
  level: "info",
  module: "HCS10Service",
  prettyPrint: true,
});

/**
 * 🧠 Create and register a new HCS-10 Agent
 */
export async function createAndRegisterAgent({
  name,
  description,
  orgId,
  role,
  model = "gpt-4",
  capabilities = [AIAgentCapability.TEXT_GENERATION],
  metadata = {},
  agentType = "manual",
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
    logger.info(`Creating new HCS-10 Agent: ${name}`);

    // 1️⃣ Build agent configuration
    const agentBuilder = new AgentBuilder()
      .setName(name)
      .setDescription(description)
      .setAgentType(agentType)
      .setCapabilities(capabilities)
      .setModel(model)
      .setNetwork("testnet")
      .setMetadata({
        creator: "HCS10Registry",
        type: agentType,
        properties: {
          orgId,
          role,
          ...metadata,
        },
      });

    // 2️⃣ Create and register agent
    const result = await hedera10Client.createAndRegisterAgent(agentBuilder, {
      progressCallback: (progress) => {
        logger.info(`${progress.stage}: ${progress.progressPercent}%`);
      },
    });

    if (!result.success)
      throw new Error(result.error || "Agent creation failed");

    const meta = result.metadata || {};

    console.log("Agent registration metadata:", JSON.stringify(meta, null, 2));


    console.log(
      "Agent registration metadata:",
      JSON.stringify(result, null, 2)
    );


    // 3️⃣ Prepare DB data (strict typing)
    const agentData = {
      orgId,
      accountId: meta.accountId as string,
      role,
      inboundTopic: meta.inboundTopicId as string,
      outboundTopic: meta.outboundTopicId as string,
      connectionTopic: meta.connectionTopicId ?? null,
      managedRegistry: null,
      profileId: meta.profileTopicId ?? null,
      publicKey: meta.publicKey ?? "",
      privateKey: meta.privateKey ? encryptKey(meta.privateKey) : null,
    };

    // 4️⃣ Store in database
    const savedAgent: Agent = await prisma.agent.create({ data: agentData });

    logger.info(`✅ Agent registered successfully: ${savedAgent.accountId}`);
    return { success: true, data: savedAgent };
  } catch (error: any) {
    logger.error(`❌ createAndRegisterAgent failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

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

/**
 * 🧩 Create an inbound topic manually (optional advanced use)
 */
export async function createInboundTopic(accountId: string) {
  try {
    const topicId = await hedera10Client.createInboundTopic(
      accountId,
      InboundTopicType.PUBLIC,
      60
    );
    return { success: true, topicId };
  } catch (error: any) {
    logger.error(`❌ createInboundTopic failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}
