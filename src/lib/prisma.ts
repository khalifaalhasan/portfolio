import { Pool } from "pg"; // Import driver native pg
import { PrismaPg } from "@prisma/adapter-pg"; // Import adapternya
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Setup Pool (Kolam Koneksi)
const pool = new Pool({
  connectionString,
});

// 2. Setup Adapter (Jembatan Prisma ke Pool)
const adapter = new PrismaPg(pool);

// 3. Inisialisasi Prisma dengan Adapter
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // log: ['query'], // Uncomment kalau mau liat log query SQL
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
