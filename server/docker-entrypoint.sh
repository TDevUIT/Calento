#!/bin/sh
set -e

echo "🚀 Starting Tcalento Server..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until node -e "const { Client } = require('pg'); const client = new Client({host: process.env.DB_HOST, port: process.env.DB_PORT, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: 'postgres'}); client.connect().then(() => {console.log('✅ PostgreSQL is ready'); client.end(); process.exit(0);}).catch(() => {console.log('⏳ PostgreSQL not ready yet...'); process.exit(1);});" 2>/dev/null; do
  sleep 2
done

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
until node -e "const redis = require('ioredis'); const client = new redis({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, password: process.env.REDIS_PASSWORD, lazyConnect: true}); client.connect().then(() => {console.log('✅ Redis is ready'); client.quit(); process.exit(0);}).catch(() => {console.log('⏳ Redis not ready yet...'); process.exit(1);});" 2>/dev/null; do
  sleep 2
done

# Run database migrations
echo "🔄 Running database migrations..."
if node dist/cli/migrate-standalone.js; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migration failed!"
  echo "⚠️  Cannot start application without database schema"
  exit 1
fi

# Start the application
echo "🚀 Starting application..."
exec node dist/main.js
