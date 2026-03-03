from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.logging import logger
from app.core.exceptions import HTTPServiceUnavailable
from app.core.database import AsyncDBSession

from app.data.seed_insurance_policies import seed

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        async with AsyncDBSession() as session:
            await seed(session)
    except Exception as ex:
        raise HTTPServiceUnavailable("The service is currently unreachable")
    logger.debug("Start server: http://localhost:8003")
    yield