import "dotenv/config";

import { defineConfig, env } from "prisma/config";

const databaseUrl = env("DATABASE_URL");

if (!databaseUrl) {
  throw new Error(
    "Environment variable DATABASE_URL is missing. Please check your .env file.",
  );
}

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env('DATABASE_URL'),
  },
});
