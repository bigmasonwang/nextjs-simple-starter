#!/bin/bash

# Setup test database using Docker for e2e tests
set -e

# Source shared utilities
source "$(dirname "$0")/utils.sh"

echo "Setting up test database with Docker..."

# Check Docker and get compose command
check_docker
DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)

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
load_test_env

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