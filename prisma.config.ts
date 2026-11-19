import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection; the app itself uses
    // DATABASE_URL through the pg driver adapter (see lib/prisma.ts).
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
