import { HCS10Client } from "@hashgraphonline/standards-sdk";

if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

// Basic configuration
export const hedera10Client = new HCS10Client({
  network: "testnet",
  operatorId: process.env.HEDERA_OPERATOR_ID!,
  operatorPrivateKey: process.env.HEDERA_OPERATOR_KEY!,
  logLevel: process.env.NODE_ENV === "production" ? "silent" : "info",
  prettyPrint: true,
});

