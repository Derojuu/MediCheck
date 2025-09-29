// /lib/hederaClient.ts
import { HCS2Client } from "@hashgraphonline/standards-sdk";

if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

// Disable pretty logging in production
const logLevel = process.env.NODE_ENV === "production" ? "error" : "info";

export const hederaClient = new HCS2Client({
  network: "testnet",
  operatorId: process.env.HEDERA_OPERATOR_ID!,
  operatorKey: process.env.HEDERA_OPERATOR_KEY!,
  logLevel: logLevel,
});
