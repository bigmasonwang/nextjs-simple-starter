import { FullConfig } from "@playwright/test"
import { PrismaClient } from "@/app/generated/prisma"
import * as dotenv from "dotenv"
import * as path from "path"

async function globalSetup(config: FullConfig) {
  // Load test environment variables
  dotenv.config({ path: path.resolve(process.cwd(), ".env.test") })

  // Clean up test database before running tests
  const prisma = new PrismaClient()

  try {
    // Clean up existing test data
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.verification.deleteMany()
    await prisma.user.deleteMany()

    console.log("Test database cleaned up successfully")
  } catch (error) {
    console.error("Error cleaning up test database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

export default globalSetup
