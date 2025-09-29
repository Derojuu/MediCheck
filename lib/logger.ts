// lib/logger.ts
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

// only add transport in dev
const logger = isDev
  ? pino({
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
      level: "debug",
    })
  : pino({
      // production logger – no transport
      level: process.env.LOG_LEVEL || "info",
    });

export { logger };
