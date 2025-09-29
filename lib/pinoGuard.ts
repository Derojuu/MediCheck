// lib/pinoGuard.ts
// Guard against missing pino-pretty in production
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
  try {
    require("pino-pretty");
  } catch (e) {
    // ignore missing module
  }
}
