# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npx prettier --write .` - Format code according to project style (no semicolons, double quotes)

### Testing

#### Unit Tests (Vitest)
- `npm test` - Run unit tests with Vitest (excludes e2e directory)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI for interactive testing

#### E2E Tests (Playwright)
- `npm run test:e2e` - Run end-to-end tests in headless mode
- `npm run test:e2e:ui` - Run tests with Playwright UI (interactive)
- `npm run test:e2e:headed` - Run tests in headed mode (visible browser)
- `npm run test:e2e:local` - Complete local test run with database setup
- `npm run test:e2e:setup` - Setup test database (local PostgreSQL)
- `npm run test:e2e:setup:docker` - Setup test database with Docker
- `npm run test:e2e:stop` - Stop Docker test database

### Database

- `npx prisma studio` - Open Prisma Studio GUI for database visualization
- `npx prisma generate` - Generate Prisma client (runs automatically on npm install)
- `npx prisma migrate dev` - Create and apply database migrations in development
- `npx prisma migrate deploy` - Apply migrations in production
- `npx prisma db push` - Push schema changes without creating migrations (development only)

### Component Management

- `npx shadcn add <component>` - Add new shadcn/ui components

## Architecture Overview

This is a Next.js 15 application using the App Router pattern with the following core technologies:

### Tech Stack

- **Framework**: Next.js 15.3.5 with Turbopack
- **Language**: TypeScript 5 (strict mode enabled)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth v1.2.12
- **Styling**: Tailwind CSS v4 (using @tailwindcss/postcss)
- **Components**: shadcn/ui with Radix UI primitives
- **Testing**: Vitest with React Testing Library (unit), Playwright (E2E)

### Project Structure

- `app/` - Next.js App Router pages and API routes
  - `(auth)/` - Authentication pages (login, signup)
  - `api/auth/[...all]/` - Better Auth API handler
  - `dashboard/` - Protected routes requiring authentication
  - `generated/prisma/` - Generated Prisma client (custom output location)
  - `middleware.ts` - Route protection middleware (Note: in app directory, not root)
- `components/` - React components
  - `ui/` - shadcn/ui components
  - `__tests__/` - Component unit tests
- `lib/` - Core utilities and configurations
  - `auth.ts` - Better Auth server configuration
  - `auth-client.ts` - Better Auth client configuration
  - `prisma.ts` - Prisma client singleton instance
  - `utils.ts` - Utility functions including `cn()` for className merging
- `prisma/` - Database schema and migrations
  - `schema.prisma` - Database models and configuration
- `test/` - Test configuration
  - `setup.ts` - Test environment setup for Vitest
- `e2e/` - End-to-end tests using Playwright
  - `auth.spec.ts` - Authentication flow tests
  - `global-setup.ts` - Database cleanup before tests

### Authentication Flow

1. Better Auth handles all authentication via `/api/auth/[...all]` endpoint
2. `app/middleware.ts` protects routes (currently `/dashboard`)
3. Authentication uses email/password with these database models:
   - User, Session, Account, Verification
4. Client-side auth state managed by `authClient` from `lib/auth-client.ts`

### Key Patterns

- **Database Access**: Always use the Prisma singleton from `lib/prisma.ts`
- **Auth Checks**: Use `auth()` from `lib/auth.ts` in server components
- **Protected Routes**: Add paths to `config.matcher` in `app/middleware.ts`
- **Component Styling**: Use Tailwind CSS classes with `cn()` helper from `lib/utils.ts`
- **UI Components**: Prefer shadcn/ui components from `components/ui/`
- **Prisma Client Location**: Generated in `app/generated/prisma/` (not default location)

### Environment Variables

Required in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` - Application URL (default: http://localhost:3000)

For E2E tests (`.env.test`):
- Uses separate test database on port 5433
- Test database auto-configured via Docker or local PostgreSQL

### Code Style

- TypeScript strict mode is enabled
- No semicolons (enforced by Prettier)
- Double quotes for strings
- Use path aliases: `@/*` maps to project root
- 2 spaces indentation
- ES5 trailing commas
- Arrow functions without parentheses for single parameters

### Testing Approach

#### Unit Testing (Vitest)
- Tests use Vitest with jsdom environment
- React Testing Library for component testing
- Test files located in `components/__tests__/`
- Global test setup in `test/setup.ts`
- Path aliases work in tests via `vite-tsconfig-paths`
- E2E directory excluded from Vitest configuration

#### E2E Testing (Playwright)
- Multi-browser testing (Chromium, Firefox, WebKit)
- Test files located in `e2e/` directory
- Tests authentication flows (signup, login, protected routes)
- Uses separate test database for isolation
- Global setup cleans database before tests
- Runs against built application on port 3000

## Development Notes

- Always use server actions for mutations (no client-side API calls)
- Database changes require generating and running migrations
- Use Prisma directly in Server Components, avoid unnecessary Server Actions for data fetching
- Using Prisma generated types, avoid creating duplicate types
- Middleware is located at `app/middleware.ts` (not in root directory)
- The middleware security note indicates auth checks should be done in each page/route for proper security
