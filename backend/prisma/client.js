// import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/client.js'
import pkg from 'pg';
const { Pool } = pkg;

const globalForPrisma = globalThis;

// Criar pool de conexões do PostgreSQL uma única vez
// Isso resolve o problema de MaxClientsInSessionMode
// O PrismaPg em Session mode limita conexões ao pool_size, então precisamos usar um Pool compartilhado
let pgPool = null;
if (!globalForPrisma.pgPool) {
  // Configurar pool com limites mais conservadores para evitar esgotamento
  // O pool_size do PostgreSQL geralmente é 100, mas em Session mode pode ser menor
  // IMPORTANTE: Em Session mode, cada conexão é mantida durante toda a sessão
  // Reduzir o max ajuda a evitar esgotamento, mas pode causar espera se houver muitas requisições simultâneas
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5, // Reduzir ainda mais para evitar esgotamento - ajuste conforme necessário
    min: 1,
    idleTimeoutMillis: 5000, // Reduzir timeout para liberar conexões mais rapidamente
    connectionTimeoutMillis: 3000,
    // Permitir que o pool gerencie melhor as conexões
    allowExitOnIdle: false,
  });
  
  // Tratar erros do pool
  pgPool.on('error', (err) => {
    console.error('[Prisma Pool] Unexpected error on idle client:', err);
  });
  
  // Monitorar uso do pool (apenas em dev)
  if (process.env.NODE_ENV !== 'production') {
    pgPool.on('connect', (client) => {
      console.debug('[Prisma Pool] Nova conexão estabelecida. Total:', pgPool.totalCount);
    });
    
    pgPool.on('remove', (client) => {
      console.debug('[Prisma Pool] Conexão removida. Total:', pgPool.totalCount);
    });
  }
  
  globalForPrisma.pgPool = pgPool;
  console.log('[Prisma] Pool de conexões criado com max:', pgPool.options.max);
} else {
  pgPool = globalForPrisma.pgPool;
  console.debug('[Prisma] Reutilizando pool existente');
}

// Reaproveita a instância entre reloads (útil em dev) e entre lambdas (em teoria)
// Usar singleton pattern para evitar múltiplas instâncias
// IMPORTANTE: Sempre usar o mesmo pool para todas as operações
if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg(pgPool);
  
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  });
  
  console.log('[Prisma] Instância do PrismaClient criada');
} else {
  console.debug('[Prisma] Reutilizando instância existente do PrismaClient');
}

const prisma = globalForPrisma.prisma;

// Em dev (hot reload) armazena no global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Garantir desconexão adequada ao encerrar
// IMPORTANTE: Não desconectar o pool aqui, pois ele é compartilhado
// Apenas desconectar o Prisma
process.on('beforeExit', async () => {
  try {
    await prisma.$disconnect();
    console.log('[Prisma] Desconectado do Prisma');
  } catch (err) {
    console.error('[Prisma] Erro ao desconectar:', err);
  }
});

// Handler para SIGTERM e SIGINT (útil em produção)
process.on('SIGTERM', async () => {
  try {
    await prisma.$disconnect();
    if (pgPool && !globalForPrisma.pgPool) {
      await pgPool.end();
    }
  } catch (err) {
    console.error('[Prisma] Erro ao desconectar no SIGTERM:', err);
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    if (pgPool && !globalForPrisma.pgPool) {
      await pgPool.end();
    }
  } catch (err) {
    console.error('[Prisma] Erro ao desconectar no SIGINT:', err);
  }
  process.exit(0);
});

export default prisma;