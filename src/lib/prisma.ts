// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { env } from 'prisma/config'; // Gunakan helper prisma/config

const prismaClientSingleton = () => {
  return new PrismaClient({
    // DI SINI PERUBAHANNYA:
    // Prisma 7 mengharapkan konfigurasi koneksi dilewatkan secara eksplisit
    datasourceUrl: process.env.DATABASE_URL, 
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;