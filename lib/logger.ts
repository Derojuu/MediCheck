export function createLogger() {
  if (process.env.NODE_ENV === "production") {
    // Simple console logger for production
    return {
      info: (msg: string, ...args: any[]) =>
        console.log(`[INFO] ${msg}`, ...args),
      error: (msg: string, ...args: any[]) =>
        console.error(`[ERROR] ${msg}`, ...args),
      warn: (msg: string, ...args: any[]) =>
        console.warn(`[WARN] ${msg}`, ...args),
    };
  } else {
    // Development logger with pino-pretty
    const pino = require("pino");
    return pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    });
  }
}
