// lib/logger.ts
import pino from "pino";

// Create a logger that works in both development and production
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(process.env.NODE_ENV === "production"
    ? {
        // Production: simple JSON format
        transport: undefined,
      }
    : {
        // Development: pretty printing
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }),
});
