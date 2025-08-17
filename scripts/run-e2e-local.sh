#!/bin/bash

# Run e2e tests locally with Docker test database
set -e

echo "Starting local e2e test run with Docker..."

# Setup test database with Docker
echo "Setting up test database..."
./scripts/setup-test-db-docker.sh

# Load test environment variables (filter out comments and empty lines)
if [ -f .env.test ]; then
    export $(grep -v '^#' .env.test | grep -v '^$' | xargs)
fi

echo "Running e2e tests..."
# Run the tests
npm run test:e2e

echo "E2E tests completed!"
echo ""
echo "Test database is still running. To stop it:"
echo "  ./scripts/stop-test-db.sh"