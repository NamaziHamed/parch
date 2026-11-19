import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * node-postgres treats `sslmode=require` as full certificate verification,
 * which fails against Supabase's certificate chain. Prisma's old engine
 * followed libpq semantics (encrypt, don't verify), so keep that behaviour.
 */
function connectionString() {
  const url = process.env.DATABASE_URL;
  if (!url || !/[?&]sslmode=(require|prefer)/.test(url)) return url;
  if (url.includes("uselibpqcompat=")) return url;
  return `${url}&uselibpqcompat=true`;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: connectionString() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
