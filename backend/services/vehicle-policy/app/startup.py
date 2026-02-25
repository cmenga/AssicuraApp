from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.logging import logger
from core.exceptions import HTTPServiceUnavailable
from core.database import AsyncDBSession

from data.seed_insurance_policies import seed

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        async with AsyncDBSession() as session:
            await seed(session)
    except Exception as ex:
        raise HTTPServiceUnavailable("The service is currently unreachable")
    logger.debug("Start server: http://localhost:8003")
    yield