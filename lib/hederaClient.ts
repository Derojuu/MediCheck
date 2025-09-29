// // /lib/hederaClient.ts
// import { HCS2Client } from "@hashgraphonline/standards-sdk";

// if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
//   throw new Error("Missing Hedera credentials in env");
// }

// // Disable pretty logging in production
// const logLevel = process.env.NODE_ENV === "production" ? "error" : "info";

// export const hederaClient = new HCS2Client({
//   network: "testnet",
//   operatorId: process.env.HEDERA_OPERATOR_ID!,
//   operatorKey: process.env.HEDERA_OPERATOR_KEY!,
//   logLevel: logLevel,
// });



// /lib/hederaClient.ts
import { HCS2Client } from "@hashgraphonline/standards-sdk";

if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
  throw new Error("Missing Hedera credentials in env");
}

// Disable pino-pretty in production
const isProduction = process.env.NODE_ENV === 'production';
const logLevel = isProduction ? 'error' : 'info';

// For production, use basic logger or disable pretty printing
const loggerConfig = isProduction 
  ? { 
      level: logLevel,
      transport: undefined // Disable transport in production
    }
  : { 
      level: logLevel,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    };

export const hederaClient = new HCS2Client({
  network: "testnet",
  operatorId: process.env.HEDERA_OPERATOR_ID!,
  operatorKey: process.env.HEDERA_OPERATOR_KEY!,
  logLevel: logLevel,
  // Add logger configuration if the SDK supports it
});

