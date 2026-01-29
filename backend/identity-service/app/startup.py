from contextlib import asynccontextmanager
from fastapi import FastAPI,HTTPException,status

from database.connection import await_database_ready
from settings import logger
from scripts.run_all import run_all
from subprocess import run
from pathlib import Path

root_project = Path(__file__).resolve().parents[1]

@asynccontextmanager
async def startup(app: FastAPI):
    try:
        await_database_ready()
    except Exception as ex:
        logger.exception(ex)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The service is currently unreachable",
        )
    # Run scripts internally instead of from the command line
   
    try:
        run_all()
    except Exception as ex:
        logger.exception(ex)

    # Start subprocess for alembic migration


    try:
        # Alembic upgrade head, idempotente
        run(["alembic", "upgrade", "head"],cwd=str(root_project), check=True)
    except Exception as ex:
        logger.exception(ex)
    logger.debug("Start server: http://localhost:8001")
    yield
