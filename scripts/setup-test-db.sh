#!/bin/bash

# Setup test database for e2e tests
set -e

echo "Setting up test database..."

# Check if .env.test exists
if [ ! -f .env.test ]; then
    echo "Error: .env.test file not found."
    echo "Please create .env.test with your test database configuration."
    exit 1
fi

# Load test environment variables (filter out comments and empty lines)
export $(grep -v '^#' .env.test | grep -v '^$' | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not set in .env.test"
    exit 1
fi

echo "Using database: $DATABASE_URL"

# Test database connection
echo "Testing database connection..."
if ! npx prisma db pull --schema=prisma/schema.prisma > /dev/null 2>&1; then
    echo "Warning: Cannot connect to test database."
    echo "Please ensure:"
    echo "1. PostgreSQL is running"
    echo "2. Test database exists"
    echo "3. Database credentials are correct"
    echo ""
    echo "To create a test database, run:"
    echo "createdb test_db"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Test database setup complete!"