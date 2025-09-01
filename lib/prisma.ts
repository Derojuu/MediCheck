import { PrismaClient } from "./generated/prisma";

declare global {
  // This ensures `globalThis.prisma` has the correct type
  var prisma: PrismaClient | undefined;
}

// Create or reuse the Prisma client
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
