import { HCS2Client } from "@hashgraphonline/standards-sdk";

import { logger } from "./logger";

if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

const originalError = console.error;

console.error = (...args) => {
  logger.error(args);
  originalError.apply(console, args);
};

export const hederaClient = new HCS2Client({
  network: "testnet",
  operatorId: process.env.HEDERA_OPERATOR_ID!,
  operatorKey: process.env.HEDERA_OPERATOR_KEY!,
  logLevel: "info",
});
