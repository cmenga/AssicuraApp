from contextlib import asynccontextmanager
from fastapi import FastAPI

from database.connection import await_database_ready
from core.settings import logger
from core.exceptions import HTTPServiceUnavailable

from scripts import populate_italy_cities,migrate

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        await_database_ready()
        migrate.main()
        populate_italy_cities.main()
    except Exception as ex:
        logger.exception(ex)
        raise HTTPServiceUnavailable("The service is currently unreachable")
    yield
