import {
  AgentBuilder,
  AIAgentCapability,
  InboundTopicType,
} from "@hashgraphonline/standards-sdk";
import { hedera10Client } from "./hedera10Client";
import { prisma } from "./prisma";
import { CreateAgentProp } from "@/utils";

/**
 * 🧠 Create a new HCS-10 Agent and automatically attach an HCS-11 profile.
 */

export const createAndRegisterAgent = async ({
  name,
  description,
  orgId,
  role,
  model = "gpt-4o",
  capabilities = [AIAgentCapability.TEXT_GENERATION],
  metadata = {},
  agentType = "autonomous",
}: CreateAgentProp) => {

  try {
    console.log(`🚀 Creating new HCS-10 Agent (createAgent): ${name}`);

    if (!orgId || !role) {
      throw new Error("Missing required parameters: orgId or role");
    }

    const operatorId = process.env.HEDERA_OPERATOR_ID!;
    const privateKey = process.env.HEDERA_OPERATOR_KEY!;
    const network =
      (process.env.HEDERA_NETWORK as "mainnet" | "testnet") || "testnet";

    const alias = name.toLowerCase().replace(/\s+/g, "-");

    // ---------- Build agent ----------
    const agentBuilder = new AgentBuilder()
      .setName(name)
      .setAlias(alias)
      .setBio(description)
      .setCapabilities(capabilities)
      .setModel(model)
      .setNetwork(network)
      .setMetadata({
        creator: "MEDICHECK",
        type: agentType,
        model,
        properties: { orgId, role, ...metadata },
      })
      .setInboundTopicType(InboundTopicType.PUBLIC)
      .setType(agentType)
      .setCreator("MEDICHECK")
      .setExistingAccount(operatorId, privateKey);

    // ---------- Create the Agent ----------
    const createResult = await hedera10Client.createAgent(agentBuilder);

    console.log("HCS-10 createAgent() result:", createResult);

    // Extract topic IDs
    const {
      inboundTopicId = "",
      outboundTopicId = "",
      pfpTopicId = "",
      profileTopicId = "",
    } = createResult || {};

    if (!inboundTopicId && !outboundTopicId) {
      throw new Error(
        "Agent creation failed — missing inbound/outbound topic IDs"
      );
    }

    console.log(`✅ HCS-10 Agent created successfully for ${name}`);

    // ---------- Persist to Prisma (encrypt private key if any) ----------
    const savedAgent = await prisma.agent.create({
      data: {
        orgId,
        agentName: name,
        role,
        accountId: "",
        inboundTopic: inboundTopicId,
        outboundTopic: outboundTopicId,
        connectionTopic: null,
        profileId: profileTopicId ?? null,
        publicKey: "",
        privateKey: "",
      },
    });

    const batchTopic = process.env.HEDERA_BATCH_REGISTRY_TOPIC_ID;
    if (batchTopic) {
      const agentAnnouncementEvent = await hedera10Client.sendMessage(
        batchTopic,
        JSON.stringify({
          type: "NEW_AGENT_JOINED",
          alias: alias,
          profileTopicId,
          role,
        }),
        "Agent subscription announcement"
      );
      console.log("🔔 Announced agent to batch registry", { batchTopic });

      console.log("Agent announcement", agentAnnouncementEvent);
    }
    else {
      console.log(
        "HEDERA_BATCH_REGISTRY_TOPIC_ID not set — skipping registry announcement"
      );
    }

    console.log(`🗄️ Agent stored in DB: ${savedAgent.accountId}`);

    return {
      success: true,
      data: {
        agent: savedAgent,
        hcs10: {
          inboundTopicId,
          outboundTopicId,
          profileTopicId,
          pfpTopicId,
        },
      },
    };
  }
  catch (err: any) {
    console.error("❌ createAndRegisterAgent (fallback) failed:", err);
    return { success: false, error: err?.message ?? String(err) };
  }
}


/**
 * Helper to safely send HCS-10 messages (non-fatal).
 */

export const safeSendHcs10 = async (
  topicId: string | null | undefined,
  message: any,
  memo?: string,
  connectionId?: string
) => {
  try {
    let targetTopic = topicId;
    if (connectionId) {
      const conn = await prisma.agentConnection.findUnique({
        where: { id: connectionId },
      });
      if (conn?.connectionTopicId) targetTopic = conn.connectionTopicId;
    }
    if (!targetTopic) return null;

    return await hedera10Client.sendMessage(
      targetTopic,
      JSON.stringify(message),
      memo ?? ""
    );
  } catch (e) {
    console.warn("HCS-10 sendMessage failed (non-fatal):", e);
    return null;
  }
};


export async function createAgentConnection(
  initiatorOrgId: string,
  receiverOrgId: string
) {
  // Load agents for both orgs
  const initiator = await prisma.organization.findUnique({
    where: { id: initiatorOrgId },
    include: {
      organizationAgent: {
        select: {
          id: true,
          agentName: true,
          outboundTopic: true,
        },
      },
    },
  });

  const receiver = await prisma.organization.findUnique({
    where: { id: receiverOrgId },
    include: {
      organizationAgent: {
        select: {
          id: true,
          agentName: true,
          inboundTopic: true,
        },
      },
    },
  });

  if (!initiator?.organizationAgent || !receiver?.organizationAgent)
    throw new Error("Both organizations must have agents");

  // 1️⃣ Create a dedicated connection topic via HCS-10
  const connectionTopic = await hedera10Client.createTopic(
    `Connection between ${initiator.organizationAgent.agentName} and ${receiver.organizationAgent.agentName}`
  );

  console.log(connectionTopic)

  // 2️⃣ Save the connection
  const connection = await prisma.agentConnection.create({
    data: {
      initiatorOrgId,
      receiverOrgId,
      initiatorAgentId: initiator.organizationAgent.id,
      receiverAgentId: receiver.organizationAgent.id,
      connectionTopicId: connectionTopic,
      status: "ACTIVE",
    },
  });

  // 3️⃣ Announce connection to both agents’ topics
  await hedera10Client.sendMessage(
    initiator.organizationAgent.outboundTopic,
    JSON.stringify({
      p: "hcs-10",
      op: "connection_created",
      connectionId: connection.id,
      connectionTopicId: connectionTopic,
      to: receiverOrgId,
    }),
    "Connection established"
  );

  await hedera10Client.sendMessage(
    receiver.organizationAgent.inboundTopic,
    JSON.stringify({
      p: "hcs-10",
      op: "connection_ack",
      connectionId: connection.id,
      connectionTopicId: connectionTopic,
      from: initiatorOrgId,
    }),
    "Connection acknowledged"
  );

  return connection;
}











