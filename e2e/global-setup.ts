import { FullConfig } from "@playwright/test"
import { PrismaClient } from "@/app/generated/prisma"
import * as dotenv from "dotenv"
import * as path from "path"

async function globalSetup(config: FullConfig) {
  // Load test environment variables
  dotenv.config({ path: path.resolve(process.cwd(), ".env.test") })

  // Set default values if not provided
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
      "postgresql://test_user:test_password@localhost:5433/test_db"
  }
  if (!process.env.BETTER_AUTH_SECRET) {
    process.env.BETTER_AUTH_SECRET = "test_secret_key_for_e2e_tests_only"
  }
  if (!process.env.BETTER_AUTH_URL) {
    process.env.BETTER_AUTH_URL = "http://localhost:3000"
  }

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
