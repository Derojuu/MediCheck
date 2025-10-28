import { HCS11Client } from "@hashgraphonline/standards-sdk";

if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

// Basic configuration
export const hedera11Client = new HCS11Client({
  network: "testnet",
  auth: {
    operatorId: process.env.HEDERA_OPERATOR_ID!,
    privateKey: process.env.HEDERA_OPERATOR_KEY!,
  },
  logLevel: "info",
});
