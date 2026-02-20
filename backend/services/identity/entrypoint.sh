#!/bin/sh
set -e

echo "Running migrations..."
cd /
alembic upgrade head
cd /app
# Poi esegue il CMD del container (uvicorn)
exec "$@"
