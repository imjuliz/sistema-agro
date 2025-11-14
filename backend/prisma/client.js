// // import { PrismaClient } from "./generated/index.js";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// export default prisma;

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// Reaproveita a instância entre reloads (útil em dev) e entre lambdas (em teoria)
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'], // você pode adicionar 'query' se quiser debug
  });

// Em dev (hot reload) armazena no global
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
