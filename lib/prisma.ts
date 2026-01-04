import { PrismaClient } from '@/prisma/generated/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  // Create database adapter
const prisma = new PrismaClient({
  accelerateUrl: process.env.ACCELERATE_URL,
}).$extends(withAccelerate())
  return prisma
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }