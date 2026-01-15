from fastapi import HTTPException, status
from os import environ
from lib.logger import Logger
from json import load
from typing import Dict, List, Any

enviroment: str | None = environ.get("ENV")
if enviroment == "production":
    logger = Logger(name="app", to_prod=True).get_logger()
elif enviroment == "development":
    logger = Logger(name="app-dev", to_prod=False).get_logger()
else:
    logger = Logger(name="app-testing", to_prod=False).get_logger()


def get_database_url() -> str:
    if url := environ.get("DATABASE_URL"):
        return url
    raise ConnectionError("DATABASE_URL env var not set")


def get_local_database_url():
    try:
        return get_database_url()
    except:
        # Alembic requires a reachable (online) database to run migrations.
        # When Docker services are not running, an external/local connection string
        # (e.g. localhost) must be provided instead of a Docker service name.
        return "postgresql://admin:admin@localhost:8432/test_db"  # Example for postgres, use your local connection string

ORIGINS = [
    "http://localhost",
    "http://localhost:8001",
    "http://localhost:3000"
]


def get_secret_key():
    return "6HM_WkvCsJ6CKJvk2OKvvkR51jU8UAaOZ-Znm4Kbpjkk0xDnI15zD9rM8SYV09KWJcUcI2ONduj5_XWpdbSkBA"
