import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

console.log(isDev);

const logger = isDev
  ? pino({
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
      level: "debug",
    })
  : pino({
      level: process.env.LOG_LEVEL || "info",
      // No transport in production!
    });

    console.log(logger)

export default logger;
