from fastapi import FastAPI, HTTPException, status
from contextlib import asynccontextmanager

from settings import logger, ORIGINS
from database.connection import await_database_ready


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
    from scripts.run_all import run_all
    try:
        run_all()
    except Exception as ex:
        logger.exception(ex)

    # Start subprocess for alembic migration
    from subprocess import run

    try:
        # Alembic upgrade head, idempotente
        run(["alembic","-c", "/app/alembic.ini", "upgrade", "head"], check=True)
    except Exception as ex:
        logger.exception(ex)
    logger.debug("Start server: http://localhost:8001")
    yield


# Create FastApi app
app: FastAPI = FastAPI(title="Core", version="0.0.1", lifespan=startup)


# Middleware
from middleware import LoggerMiddleware, CheckOriginMiddleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(CheckOriginMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggerMiddleware, logger)


# All routers are added here
from api.health.router import health_router
from api.auth.router import auth_router

app.include_router(health_router)
app.include_router(auth_router)


# Change validation error
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "message": "Dati di input non validi",
            "errors": [
                {
                    "field": err["loc"][-1],
                    "message": err["msg"].replace("Value error, ",""),
                }
                for err in exc.errors()
            ],
        },
    )