// lib/pinoGuard.ts
// Guard against missing pino-pretty in production
if (process.env.NODE_ENV !== "production") {
  try {
    require("pino-pretty");
  } catch (e) {
    // ignore missing module
  }
}
