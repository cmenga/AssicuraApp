from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from database.connection import await_database_ready
from settings import logger
from subprocess import run
from pathlib import Path
from scripts.run_all import run_all

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

    # Start subprocess for alembic migration

    root_path = Path(__file__).resolve().parents[1]
    try:
        # Alembic upgrade head, idempotente
        run(["alembic", "upgrade", "head"], cwd=str(root_path), check=True)
    except Exception as ex:
        logger.exception(ex)

    # Run scripts internally instead of from the command line
    try:
        run_all()
    except Exception as ex:
        logger.exception(ex)

    logger.debug("Start server: http://localhost:8002")
    yield
