#!/bin/bash

# Setup test database using Docker for e2e tests
set -e

echo "Setting up test database with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo "Error: Docker Compose is not available"
    echo "Please install Docker Compose or use Docker Desktop"
    exit 1
fi

# Use docker compose (newer) or docker-compose (legacy)
DOCKER_COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
fi

echo "Starting PostgreSQL test database..."
$DOCKER_COMPOSE_CMD -f docker-compose.test.yml up -d

echo "Waiting for database to be ready..."
# Wait for the database to be healthy
timeout=60
counter=0
while [ $counter -lt $timeout ]; do
    if $DOCKER_COMPOSE_CMD -f docker-compose.test.yml exec -T test-db pg_isready -U test_user -d test_db > /dev/null 2>&1; then
        echo "Database is ready!"
        break
    fi
    echo "Waiting for database... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done

if [ $counter -ge $timeout ]; then
    echo "Error: Database failed to start within $timeout seconds"
    echo "Checking logs..."
    $DOCKER_COMPOSE_CMD -f docker-compose.test.yml logs test-db
    exit 1
fi

# Load test environment variables
if [ -f .env.test ]; then
    export $(grep -v '^#' .env.test | grep -v '^$' | xargs)
else
    echo "Warning: .env.test not found, using default values"
    export DATABASE_URL="postgresql://test_user:test_password@localhost:5433/test_db"
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Test database setup complete!"
echo "Database is running on localhost:5433"
echo ""
echo "To stop the test database:"
echo "  $DOCKER_COMPOSE_CMD -f docker-compose.test.yml down"
echo ""
echo "To stop and remove data:"
echo "  $DOCKER_COMPOSE_CMD -f docker-compose.test.yml down -v"