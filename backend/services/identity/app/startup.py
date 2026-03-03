from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.logging import logger
from app.core.exceptions import HTTPServiceUnavailable

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        pass
    except Exception as ex:
        raise HTTPServiceUnavailable("The service is currently unreachable")
    logger.debug("Start server: http://localhost:8001")
    yield