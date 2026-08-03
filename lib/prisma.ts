import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

// Create singleton instances to prevent multiple connections in dev
const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined,
  libsql: any | undefined
};

export const libsql = globalForPrisma.libsql || createClient({
  url: url || "file:dev.db", // Use local file for development if URL is missing
  authToken: authToken,
});

const adapter = new PrismaLibSql(libsql as any);
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.libsql = libsql;
}

export default prisma;
