#!/bin/bash

# Shared utilities for e2e test scripts

# Detect and return the appropriate Docker Compose command
get_docker_compose_cmd() {
    if docker compose version &> /dev/null 2>&1; then
        echo "docker compose"
    elif command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    else
        echo "Error: Docker Compose is not available" >&2
        echo "Please install Docker Compose or use Docker Desktop" >&2
        exit 1
    fi
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "Error: Docker is not installed" >&2
        echo "Please install Docker first: https://docs.docker.com/get-docker/" >&2
        exit 1
    fi
}

# Load environment variables from .env.test file
load_test_env() {
    if [ -f .env.test ]; then
        export $(grep -v '^#' .env.test | grep -v '^$' | xargs)
    else
        echo "Warning: .env.test not found, using default values" >&2
        export DATABASE_URL="postgresql://test_user:test_password@localhost:5433/test_db"
    fi
}