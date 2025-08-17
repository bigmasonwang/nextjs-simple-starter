#!/bin/bash

# Run e2e tests with proper environment variables
set -e

# Load test environment variables
if [ ! -f .env.test ]; then
    echo "Error: .env.test file not found"
    echo "Please create .env.test with your test database configuration"
    echo "Example content:"
    echo "DATABASE_URL=\"postgresql://test_user:test_password@localhost:5433/test_db\""
    echo "BETTER_AUTH_SECRET=\"test_secret_key_for_e2e_tests_only\""
    echo "BETTER_AUTH_URL=\"http://localhost:3000\""
    echo "NODE_ENV=\"test\""
    exit 1
fi

export $(grep -v '^#' .env.test | grep -v '^$' | xargs)

echo "Running e2e tests with environment:"
echo "DATABASE_URL: $DATABASE_URL"
echo "BETTER_AUTH_URL: $BETTER_AUTH_URL"
echo "NODE_ENV: $NODE_ENV"
echo ""

# Run Playwright tests
npx playwright test "$@"