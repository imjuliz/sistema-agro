// import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/client.ts';
const globalForPrisma = globalThis;

// Reaproveita a instância entre reloads (útil em dev) e entre lambdas (em teoria)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['error', 'warn'], // você pode adicionar 'query' se quiser debug
  });

// Em dev (hot reload) armazena no global
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;


