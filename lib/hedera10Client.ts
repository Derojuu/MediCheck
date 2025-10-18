import { HCS10Client } from "@hashgraphonline/standards-sdk";

if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

// Basic configuration
export const hedera10Client = new HCS10Client({
  network: "testnet", // Network: 'testnet' or 'mainnet'
  operatorId: process.env.HEDERA_OPERATOR_ID!, // Your Hedera account ID
  operatorPrivateKey: process.env.HEDERA_OPERATOR_KEY!, // Your Hedera private key
  logLevel: process.env.NODE_ENV === "production" ? "silent" : "info", // Optional: 'debug', 'info', 'warn', 'error'
  prettyPrint: true, // Optional: prettier console output
  guardedRegistryBaseUrl: "https://moonscape.tech", // Optional: registry URL
  feeAmount: 1,
});
