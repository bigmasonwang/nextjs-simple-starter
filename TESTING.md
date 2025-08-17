# Testing Guide

This project includes comprehensive testing setup with both unit tests (Vitest) and end-to-end tests (Playwright).

## E2E Testing Setup

### Prerequisites

1. **Node.js** (LTS version)
2. **Docker** and **Docker Compose** (recommended for test database)
3. **Playwright** browsers (installed automatically)

Alternative: Local PostgreSQL installation

### Local Development Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Install Playwright browsers:**

```bash
npx playwright install
```

3. **Setup test database:**

   **Option A: Docker (Recommended)**

   ```bash
   npm run test:e2e:setup:docker
   ```

   **Option B: Local PostgreSQL**

   - Update `.env.test` with your local PostgreSQL credentials
   - Run: `npm run test:e2e:setup`

4. **Run e2e tests locally:**

```bash
npm run test:e2e:local
```

### Available Test Commands

- `npm run test:e2e` - Run tests in headless mode
- `npm run test:e2e:ui` - Run tests with Playwright UI (interactive)
- `npm run test:e2e:headed` - Run tests in headed mode (visible browser)
- `npm run test:e2e:setup` - Setup test database (local PostgreSQL)
- `npm run test:e2e:setup:docker` - Setup test database with Docker
- `npm run test:e2e:stop` - Stop Docker test database
- `npm run test:e2e:local` - Complete local test run with database setup

### Test Structure

```
e2e/
├── auth.spec.ts          # Authentication flow tests
├── global-setup.ts       # Database cleanup setup
├── helpers/
│   └── db.ts            # Database helper utilities
└── README.md            # E2E specific documentation
```

### Test Coverage

The e2e tests cover:

1. **User Registration**

   - Successful signup with valid data
   - Password mismatch validation
   - Redirect to dashboard after signup

2. **User Login**

   - Successful login with existing credentials
   - Invalid credentials error handling
   - Redirect to dashboard after login

3. **Navigation**

   - Navigation between login and signup pages
   - Protected route access (redirect to login)

4. **Authentication State**
   - Dashboard content verification
   - User name display
   - Sign out functionality

## GitHub Actions CI/CD

### Workflow Configuration

The e2e tests run automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### CI Pipeline Steps

1. **Environment Setup**

   - Ubuntu latest runner
   - Node.js LTS
   - PostgreSQL 15 service

2. **Dependencies**

   - Install npm dependencies
   - Install Playwright browsers with system dependencies

3. **Database Setup**

   - Run Prisma migrations on test database
   - Generate Prisma client

4. **Application Build**

   - Build Next.js application with test environment variables

5. **Test Execution**
   - Run Playwright e2e tests
   - Upload test reports as artifacts

### Environment Variables in CI

The following environment variables are configured in the GitHub Actions workflow:

```yaml
DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
BETTER_AUTH_SECRET: test_secret_key_for_e2e_tests_only
BETTER_AUTH_URL: http://localhost:3000
```

### Test Reports

- Test reports are automatically uploaded as GitHub Actions artifacts
- Reports are retained for 30 days
- HTML reports include screenshots and traces for failed tests

## Database Management

### Test Database Isolation

- Tests use a separate PostgreSQL database (`test_db`)
- Database is cleaned before each test run to ensure isolation
- No interference with development or production data

### Database Schema

The test database uses the same Prisma schema as development:

- User authentication tables
- Session management
- Account linking

### Cleanup Strategy

- Global setup cleans all test data before test runs
- Tests generate unique user data to avoid conflicts
- Database connections are properly closed after tests

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - **Docker**: Run `npm run test:e2e:setup:docker` to start the database
   - **Local PostgreSQL**: Verify PostgreSQL is running and check DATABASE_URL in .env.test
   - Check if the database port is available (5433 for Docker, 5432 for local)
   - For Docker issues: `docker-compose -f docker-compose.test.yml logs test-db`

2. **Playwright Browser Issues**

   - Run `npx playwright install --with-deps`
   - Check system dependencies on Linux

3. **Test Timeouts**

   - Increase timeout in playwright.config.ts
   - Check application startup time
   - Verify database performance

4. **Authentication Failures**
   - Verify BETTER_AUTH_SECRET is set
   - Check auth configuration
   - Ensure session handling works correctly

### Debug Mode

Run tests with debug information:

```bash
DEBUG=pw:api npm run test:e2e
```

Run specific test file:

```bash
npx playwright test auth.spec.ts
```

Run tests with trace viewer:

```bash
npx playwright test --trace on
```

## Best Practices

1. **Test Data**

   - Generate unique test data for each run
   - Clean up after tests
   - Use realistic but safe test data

2. **Test Structure**

   - Keep tests independent and isolated
   - Use descriptive test names
   - Group related tests in describe blocks

3. **Selectors**

   - Use stable selectors (data-testid, role-based)
   - Avoid brittle CSS selectors
   - Test user-visible behavior

4. **Assertions**

   - Test user-facing functionality
   - Verify both success and error states
   - Check navigation and redirects

5. **Performance**
   - Keep tests fast and focused
   - Use parallel execution where possible
   - Optimize database operations
