from contextlib import asynccontextmanager
from fastapi import FastAPI

from database.connection import await_database_ready

from core.exceptions import HTTPServiceUnavailable
from core.logging import logger

from scripts import migrate
from scripts import populate_license_category 

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        await_database_ready()
        migrate.main()
        populate_license_category.main()
    except Exception as ex:
        raise HTTPServiceUnavailable("The service is currently unreachable")

    logger.debug("Start server: http://localhost:8002")
    yield
