#!/bin/sh
set -e
: "${APP_ENV:=development}"

echo "Running migrations Alembic..."
alembic upgrade head

if [ "$APP_ENV" = "production" ]; then
    exec gunicorn -k  uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:5001
else
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level warning
fi

exec "$@"