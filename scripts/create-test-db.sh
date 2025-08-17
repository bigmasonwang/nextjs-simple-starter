#!/bin/bash

# Create PostgreSQL test database for e2e tests
set -e

echo "Creating PostgreSQL test database..."

# Default values
DB_NAME="test_db"
DB_USER="test_user"
DB_PASSWORD="test_password"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready -q; then
    echo "PostgreSQL service is not running. Starting it..."
    if command -v brew &> /dev/null; then
        # macOS with Homebrew
        brew services start postgresql
    elif command -v systemctl &> /dev/null; then
        # Linux with systemd
        sudo systemctl start postgresql
    else
        echo "Please start PostgreSQL service manually"
        exit 1
    fi
    
    # Wait a moment for service to start
    sleep 2
fi

# Create test user (if it doesn't exist)
echo "Creating test user..."
psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User $DB_USER already exists"

# Grant privileges
psql postgres -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null

# Create test database (if it doesn't exist)
echo "Creating test database..."
createdb -O $DB_USER $DB_NAME 2>/dev/null || echo "Database $DB_NAME already exists"

# Grant all privileges
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null

echo "Test database setup complete!"
echo ""
echo "Database details:"
echo "  Name: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Connection: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
echo "Make sure your .env.test file contains:"
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME\""