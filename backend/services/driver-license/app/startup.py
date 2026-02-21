from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.logging import logger
from core.exceptions import HTTPServiceUnavailable
from core.database import AsyncDBSession

from data.seed_license_category import seed


@asynccontextmanager
async def startup(app: FastAPI):
    try:
        async with AsyncDBSession() as session:
            await seed(session)
    except Exception:
        raise HTTPServiceUnavailable("The service is currently unreachable")
    logger.debug("Start server: http://localhost:8002")
    yield
