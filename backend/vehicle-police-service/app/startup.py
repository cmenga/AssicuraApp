from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.connection import await_database_ready
from core.settings import logger
from core.exceptions import HTTPServiceUnavailable
from scripts.migrate import main as migrate_db

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        await_database_ready()
        migrate_db()
    except Exception as ex:
        logger.exception(ex)
        raise HTTPServiceUnavailable("The service is currently unreachable")
    logger.debug("Start server: http://localhost:8003")
    yield
