#!/bin/bash

# Stop test database Docker container
set -e

echo "Stopping test database..."

# Use docker compose (newer) or docker-compose (legacy)
DOCKER_COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
fi

# Stop the database
$DOCKER_COMPOSE_CMD -f docker-compose.test.yml down

echo "Test database stopped!"
echo ""
echo "To also remove the database data, run:"
echo "  $DOCKER_COMPOSE_CMD -f docker-compose.test.yml down -v"