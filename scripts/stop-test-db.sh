#!/bin/bash

# Stop test database Docker container
set -e

# Source shared utilities
source "$(dirname "$0")/utils.sh"

echo "Stopping test database..."

# Get Docker Compose command
DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)

# Stop the database
$DOCKER_COMPOSE_CMD -f docker-compose.test.yml down

echo "Test database stopped!"
echo ""
echo "To also remove the database data, run:"
echo "  $DOCKER_COMPOSE_CMD -f docker-compose.test.yml down -v"