from os import environ
from vendor.lib.logger import Logger
from fastapi import HTTPException

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


ORIGINS = ["http://localhost:8002", "http://localhost:8001", "http://localhost:3000"]


def _get_environ(name: str):
    environ_key = environ.get(name)
    if environ_key is None:
        raise HTTPException(status_code=500, detail="Service not available")
    return environ_key


def get_secret_key():
    return _get_environ("SECRET_KEY")


def get_service_name():
    return _get_environ("SERVICE_NAME")


def get_service_secret():
    return _get_environ("SERVICE_SECRET")


def get_algorithm() -> str:
    return _get_environ("ALGORITHM")
