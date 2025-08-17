import { PrismaClient } from "@/app/generated/prisma"

export class TestDatabase {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async cleanup() {
    // Clean up test data in the correct order (respecting foreign key constraints)
    await this.prisma.session.deleteMany()
    await this.prisma.account.deleteMany()
    await this.prisma.verification.deleteMany()
    await this.prisma.user.deleteMany()
  }

  async createUser(userData: {
    name: string
    email: string
    password: string
  }) {
    // This would typically be done through the API, but can be useful for test setup
    return await this.prisma.user.create({
      data: {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    })
  }

  async disconnect() {
    await this.prisma.$disconnect()
  }
}

export const testDb = new TestDatabase()
