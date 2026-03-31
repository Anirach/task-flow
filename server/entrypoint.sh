#!/bin/sh
set -e

# Ensure data directory exists for SQLite volume
mkdir -p /app/data

echo "Running database migrations..."
npx prisma migrate deploy

echo "Checking if database needs seeding..."
# Exit 0 = empty (seed needed), Exit 1 = has data (skip)
node scripts/check-seeded.mjs && npm run db:seed || true

echo "Starting TaskFlow server..."
exec node dist/index.js
