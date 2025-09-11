import { PrismaClient } from "./generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create the base Prisma client
const createPrismaClient = () =>
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  }).$extends(withAccelerate());

// Type for the extended Prisma client
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

declare global {
  // This ensures `globalThis.prisma` has the correct type
  var prisma: ExtendedPrismaClient | undefined;
}

// Create or reuse the Prisma client with Accelerate extension
export const prisma: ExtendedPrismaClient =
  global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma; 
}
