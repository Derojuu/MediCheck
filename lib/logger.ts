// lib/logger.ts
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

// Simple logger without pino-pretty in production
const logger = pino({
  level: isDev ? "debug" : process.env.LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: { colorize: true },
      }
    : undefined,
});

export default logger;
