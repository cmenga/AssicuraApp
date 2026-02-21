from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.logging import logger
from core.exceptions import HTTPServiceUnavailable

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        pass
    except Exception as ex:
        raise HTTPServiceUnavailable("The service is currently unreachable")
    logger.debug("Start server: http://localhost:8003")
    yield