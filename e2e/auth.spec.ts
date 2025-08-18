import { test, expect } from "@playwright/test"

// Generate unique test data for each test run
const generateTestUser = () => ({
  name: `Test User ${Date.now()}`,
  email: `test${Date.now()}@example.com`,
  password: "TestPassword123!",
})

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto("/")
  })

  test("should sign up a new user successfully", async ({ page }) => {
    const testUser = generateTestUser()

    // Navigate to signup page
    await page.click("text=Get Started")
    await expect(page).toHaveURL("/signup")

    // Fill out signup form
    await page.fill("#name", testUser.name)
    await page.fill("#email", testUser.email)
    await page.fill("#password", testUser.password)
    await page.fill("#confirmPassword", testUser.password)

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to dashboard after successful signup
    await expect(page).toHaveURL("/dashboard")

    // Verify user is logged in by checking for dashboard content
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
    await expect(page.locator(`text=Welcome, ${testUser.name}`)).toBeVisible()
  })

  test("should login with existing user", async ({ page }) => {
    const testUser = generateTestUser()

    // First, create a user by signing up
    await page.goto("/signup")
    await page.fill("#name", testUser.name)
    await page.fill("#email", testUser.email)
    await page.fill("#password", testUser.password)
    await page.fill("#confirmPassword", testUser.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL("/dashboard")

    // Sign out (assuming there's a sign out button)
    await page.click("text=Sign out")

    // Now test login
    await page.goto("/login")
    await expect(page).toHaveURL("/login")

    // Fill login form
    await page.fill("#email", testUser.email)
    await page.fill("#password", testUser.password)

    // Submit login form
    await page.click('button:has-text("Login")')

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard")
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
  })

  test("should show error for invalid login credentials", async ({ page }) => {
    await page.goto("/login")

    // Fill with invalid credentials
    await page.fill("#email", "invalid@example.com")
    await page.fill("#password", "wrongpassword")

    // Submit form
    await page.click('button:has-text("Login")')

    // Should show error message (toast notification)
    await expect(page.locator("[data-sonner-toast]")).toBeVisible()

    // Should stay on login page
    await expect(page).toHaveURL("/login")
  })

  test("should show error for mismatched passwords during signup", async ({
    page,
  }) => {
    const testUser = generateTestUser()

    await page.goto("/signup")

    // Fill form with mismatched passwords
    await page.fill("#name", testUser.name)
    await page.fill("#email", testUser.email)
    await page.fill("#password", testUser.password)
    await page.fill("#confirmPassword", "DifferentPassword123!")

    // Submit form
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator("[data-sonner-toast]")).toBeVisible()
    await expect(page.locator("text=Passwords do not match")).toBeVisible()

    // Should stay on signup page
    await expect(page).toHaveURL("/signup")
  })

  test("should navigate between login and signup pages", async ({ page }) => {
    // Start at login page
    await page.goto("/login")
    await expect(page).toHaveURL("/login")
    await expect(
      page.locator('h1:has-text("Login to your account")')
    ).toBeVisible()

    // Click signup link
    await page.click("text=Sign up")
    await expect(page).toHaveURL("/signup")
    await expect(page.locator('h1:has-text("Create an account")')).toBeVisible()

    // Click login link
    await page.click("text=Login")
    await expect(page).toHaveURL("/login")
    await expect(
      page.locator('h1:has-text("Login to your account")')
    ).toBeVisible()
  })

  test("should redirect to login when accessing protected route", async ({
    page,
  }) => {
    // Try to access dashboard without being logged in
    await page.goto("/dashboard")

    // Should redirect to login page
    await expect(page).toHaveURL("/login")
  })

  test("should redirect authenticated users away from auth pages", async ({
    page,
  }) => {
    const testUser = generateTestUser()

    // First, sign up and login a user
    await page.goto("/signup")
    await page.fill("#name", testUser.name)
    await page.fill("#email", testUser.email)
    await page.fill("#password", testUser.password)
    await page.fill("#confirmPassword", testUser.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL("/dashboard")

    // Now try to access login page while authenticated
    await page.goto("/login")
    // Should redirect back to dashboard
    await expect(page).toHaveURL("/dashboard")

    // Try to access signup page while authenticated
    await page.goto("/signup")
    // Should redirect back to dashboard
    await expect(page).toHaveURL("/dashboard")
  })
})
