from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from subprocess import run
from pathlib import Path

from database.connection import await_database_ready

from core.settings import logger
from core.exceptions import HTTPServiceUnavailable

from scripts.migrate import main as migrate_db

from scripts.populate_license_category import main as popolate_license_category 

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        await_database_ready()
        migrate_db()
        popolate_license_category()
    except Exception as ex:
        logger.exception(ex)
        raise HTTPServiceUnavailable("The service is currently unreachable")

    logger.debug("Start server: http://localhost:8002")
    yield
