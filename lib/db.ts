import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const rawDatabaseUrl = process.env.DATABASE_URL
const databaseUrl = rawDatabaseUrl && /supabase\.co/i.test(rawDatabaseUrl) && !/[?&]sslmode=/i.test(rawDatabaseUrl)
  ? `${rawDatabaseUrl}${rawDatabaseUrl.includes('?') ? '&' : '?'}sslmode=require`
  : rawDatabaseUrl

export const prisma = globalForPrisma.prisma ?? new PrismaClient(databaseUrl ? {
  datasources: {
    db: { url: databaseUrl },
  },
} : undefined)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
