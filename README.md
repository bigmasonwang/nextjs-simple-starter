# Spend Tracker

A Next.js application for tracking expenses with user authentication and PostgreSQL database.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bigmasonwang/nextjs-simple-starter.git

cd nextjs-simple-starter
```

### 2. Install dependencies

```bash
npm install
```

This will automatically generate the Prisma client after installation.

### 3. Set up the database

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE nextjs_sass_starter_db;
   ```

#### Option B: Cloud PostgreSQL

Use a service like [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app) for a managed PostgreSQL instance.

### 4. Configure environment variables

1. Copy the example environment file:

   ```bash
   cp example.env .env
   ```

2. Update the `.env` file with your configuration:

   ```env
   # Database connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/nextjs_sass_starter_db"

   # Authentication secret (generate a random string)
   BETTER_AUTH_SECRET="your-secret-key-here"

   # Authentication URL (your app URL)
   BETTER_AUTH_URL="http://localhost:3000"
   ```

   To generate a secure secret:

   ```bash
   openssl rand -base64 32
   ```

### 5. Run database migrations

```bash
npx prisma migrate deploy
```

This will create the necessary tables in your database.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses the following database models:

- **User**: Stores user information
- **Session**: Manages user sessions
- **Account**: Handles authentication providers
- **Verification**: Manages email verification tokens

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Create and apply migrations (development)
- `npx prisma migrate deploy` - Apply migrations (production)

## Project Structure

```
spend-tracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema file
├── public/               # Static assets
└── generated/            # Generated files (Prisma client)
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

For other platforms, ensure you:

1. Set all environment variables
2. Run `npm run build`
3. Run database migrations
4. Start with `npm run start`

## Troubleshooting

### Database connection issues

- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

### Prisma client errors

- Run `npx prisma generate` to regenerate the client
- Delete `node_modules` and reinstall dependencies

### Authentication issues

- Ensure `BETTER_AUTH_SECRET` is set
- Verify `BETTER_AUTH_URL` matches your application URL

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
