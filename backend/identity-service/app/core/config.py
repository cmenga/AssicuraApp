"""
Application settings and environment configuration.

- Configures the logger based on the current environment (production, development, or testing).
- Provides functions to retrieve the database URL from environment variables, with a fallback for local development.
- Defines allowed CORS origins.
"""

from os import environ
from dotenv import load_dotenv
from pathlib import Path
from core.exceptions import HTTPServiceUnavailable
from json import loads

root_env = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=root_env / ".env")


def get_database_url() -> str:
    """
    The function `get_database_url` retrieves the database URL from the environment variables or raises
    a `ConnectionError` if the URL is not set.

    Returns:
      The `get_database_url` function returns the value of the "DATABASE_URL" environment variable if it
    is set. If the variable is not set, it raises a `ConnectionError` with the message "DATABASE_URL env
    var not set".
    """
    if url := environ.get("DATABASE_URL"):
        return url
    raise ConnectionError("DATABASE_URL env var not set")


"""
List of allowed CORS origins.

Used by CheckOriginMiddleware to validate incoming request origins.
"""
ORIGINS = [
    "http://localhost:8001",
    "http://localhost:8002",
    "http://localhost:8003",
    "http://localhost:3000",
]


def _get_environ(name: str):
    """
    The function `_get_environ` retrieves an environment variable by name and raises an exception if the
    variable is not found.

    Args:
      name (str): The `name` parameter in the `_get_environ` function is a string that represents the
    name of an environment variable that we want to retrieve.

    Returns:
      The function `_get_environ` is returning the value associated with the given `name` key in the
    `environ` dictionary. If the key does not exist in the `environ` dictionary, it raises an
    `HTTPServiceUnavailable` exception with the message "Service not available".
    """
    environ_key = environ.get(name)
    if environ_key is None:
        raise HTTPServiceUnavailable("Service not available")
    return environ_key


def get_secret_key():
    return _get_environ("SECRET_KEY")


def get_service_name():
    return _get_environ("SERVICE_NAME")


def get_service_secret():
    return _get_environ("SERVICE_SECRET")


def get_algorithm():
    return _get_environ("ALGORITHM")


def get_trusted_services():
    return loads(_get_environ("TRUSTED_SERVICES"))
