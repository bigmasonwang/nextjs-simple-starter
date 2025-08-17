# E2E Tests

This directory contains end-to-end tests for the authentication system using Playwright.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Set up test database (for local testing):

```bash
npm run test:e2e:setup
```

## Running Tests

### Local Development

Run tests in headless mode:

```bash
npm run test:e2e
```

Run tests with UI (interactive mode):

```bash
npm run test:e2e:ui
```

Run tests in headed mode (see browser):

```bash
npm run test:e2e:headed
```

### CI/CD

Tests automatically run on GitHub Actions when:

- Pushing to `main` or `develop` branches
- Creating pull requests to `main` or `develop` branches

## Test Structure

- `auth.spec.ts` - Authentication flow tests (login, signup, validation)
- `global-setup.ts` - Database cleanup before test runs

## Environment Variables

Tests use the following environment variables:

- `DATABASE_URL` - PostgreSQL connection string for test database
- `BETTER_AUTH_SECRET` - Auth secret for test environment
- `BETTER_AUTH_URL` - Base URL for the application

## Database

Tests use a separate PostgreSQL database to avoid conflicts with development data. The database is automatically cleaned before each test run.

## GitHub Actions

The CI pipeline:

1. Sets up PostgreSQL service
2. Installs dependencies and Playwright browsers
3. Runs database migrations
4. Builds the application
5. Runs e2e tests
6. Uploads test reports as artifacts
