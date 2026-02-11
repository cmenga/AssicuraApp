"""
Application settings and environment configuration.

- Configures the logger based on the current environment (production, development, or testing).
- Provides functions to retrieve the database URL from environment variables, with a fallback for local development.
- Defines allowed CORS origins.
"""

from os import environ
from vendor.lib.logger import Logger
from dotenv import load_dotenv
from pathlib import Path
from core.exceptions import HTTPServiceUnavailable

root_env = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=root_env / ".env")



"""
Create a logger based on the environment setting. If the environment is set to "production", 
create a logger for the production environment. If the environment is set to "development", 
create a logger for the development environment. Otherwise, create a logger for testing purposes.
"""
enviroment: str | None = environ.get("ENV")
if enviroment == "production":
    logger = Logger(name="app", to_prod=True).get_logger()
elif enviroment == "development":
    logger = Logger(name="app-dev", to_prod=False).get_logger()
else:
    logger = Logger(name="app-testing", to_prod=False).get_logger()


def get_database_url() -> str:
    """
    Retrieve the database URL from the environment variables.
    @return The database URL.
    """
    if url := environ.get("DATABASE_URL"):
        return url
    raise ConnectionError("DATABASE_URL env var not set")


def get_local_database_url():
    """
    Attempt to retrieve the database URL. If unsuccessful, return a default local database URL.
    @return The database URL
    """
    try:
        return get_database_url()
    except:
        return "postgresql://admin:admin@localhost:8432/test_db"  



"""
List of allowed CORS origins.

Used by CheckOriginMiddleware to validate incoming request origins.
"""
ORIGINS = [
    "http://localhost:8001",
]



def _get_environ(name: str):
    """
    Retrieve an environment variable by name and return its value. If the variable does not exist, raise an HTTPServiceUnavailable exception.
    @param name - The name of the environment variable to retrieve.
    @raises HTTPServiceUnavailable if the environment variable is not available.
    @return The value of the environment variable.
    """
    environ_key = environ.get(name)
    if environ_key is None:
        raise HTTPServiceUnavailable("Service not available")
    return environ_key


def get_secret_key():
    """
    Retrieve the secret key from the environment variables.
    @return The secret key.
    """
    return _get_environ("SECRET_KEY")


def get_service_name():
    """
    Retrieve the service name from the environment variables.
    @return The service name.
    """
    return _get_environ("SERVICE_NAME")


def get_service_secret():
    """
    Retrieve the service secret from the environment variables.
    @return The service secret.
    """
    return _get_environ("SERVICE_SECRET")


def get_algorithm():
    """
    Retrieve the algorithm name from the environment variables.
    @return The algorithm name.
    """
    return _get_environ("ALGORITHM")


def get_trusted_services():
    """
    Retrieve the trusted services from the environment variables.
    @return The trusted services.
    """
    return _get_environ("TRUSTED_SERVICES")
