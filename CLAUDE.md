# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npx prettier --write .` - Format code according to project style (no semicolons, double quotes)

### Database

- `npx prisma studio` - Open Prisma Studio GUI for database visualization
- `npx prisma generate` - Generate Prisma client (runs automatically on npm install)
- `npx prisma migrate dev` - Create and apply database migrations in development
- `npx prisma migrate deploy` - Apply migrations in production
- `npx prisma db push` - Push schema changes without creating migrations (development only)

## Architecture Overview

This is a Next.js 15 application using the App Router pattern with the following core technologies:

### Tech Stack

- **Framework**: Next.js 15.3.5 with Turbopack
- **Language**: TypeScript 5 (strict mode enabled)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth v1.2.12
- **Styling**: Tailwind CSS v4 (using @tailwindcss/postcss)
- **Components**: shadcn/ui with Radix UI primitives

### Project Structure

- `app/` - Next.js App Router pages and API routes
  - `(auth)/` - Authentication pages (login, signup)
  - `api/auth/[...all]/` - Better Auth API handler
  - `dashboard/` - Protected routes requiring authentication
- `components/` - React components, including shadcn/ui components in `ui/`
- `lib/` - Core utilities and configurations
  - `auth.ts` - Better Auth server configuration
  - `auth-client.ts` - Better Auth client configuration
  - `prisma.ts` - Prisma client singleton instance
- `prisma/` - Database schema and migrations

### Authentication Flow

1. Better Auth handles all authentication via `/api/auth/[...all]` endpoint
2. `middleware.ts` protects routes (currently `/dashboard`)
3. Authentication uses email/password with these database models:
   - User, Session, Account, Verification
4. Client-side auth state managed by `authClient` from `lib/auth-client.ts`

### Key Patterns

- **Database Access**: Always use the Prisma singleton from `lib/prisma.ts`
- **Auth Checks**: Use `auth()` from `lib/auth.ts` in server components
- **Protected Routes**: Add paths to `protectedRoutes` in `middleware.ts`
- **Component Styling**: Use Tailwind CSS classes with `cn()` helper from `lib/utils.ts`
- **UI Components**: Prefer shadcn/ui components from `components/ui/`

### Environment Variables

Required in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` - Application URL (default: http://localhost:3000)

### Code Style

- TypeScript strict mode is enabled
- No semicolons (enforced by Prettier)
- Double quotes for strings
- Use path aliases: `@/*` maps to project root

## Development Notes

- Always use server actions for mutations (no client-side API calls)
- Database changes require generating and running migrations
- Use Prisma directly in Server Components, avoid unnecessary Server Actions for data fetching
- Using Prisma generated types, avoid creating duplicate types
