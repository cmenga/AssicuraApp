"""
Main FastAPI application setup.

- Configures application lifespan, middleware, routers, and exception handlers.
- Performs startup tasks including database readiness check, internal script execution, and Alembic migrations.
"""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware


from core.settings import logger, ORIGINS
from startup import startup


# Create FastApi app
app: FastAPI = FastAPI(title="Vehicle police service", version="0.0.1", lifespan=startup)


# Middleware setup
"""
Adds application middleware:
    - CheckOriginMiddleware: Blocks requests from disallowed origins.
    - CORSMiddleware: Allows CORS requests from allowed origins with credentials, all methods and headers.
    - LoggerMiddleware: Logs all incoming requests and their responses with structured logging.
"""
from core.middleware import LoggerMiddleware, CheckOriginMiddleware

app.add_middleware(CheckOriginMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggerMiddleware, logger)


# Routers
"""
Includes all API routers.

Currently included:
    - health_router: Provides health check endpoints.
"""
from api.public.health import router as health_router
from api.public.vehicle import router as vehicle_router
from api.internal.router import router as internal_router

app.include_router(health_router)
app.include_router(vehicle_router)
app.include_router(internal_router)

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
                    "message": err["msg"],
                }
                for err in exc.errors()
            ],
        },
    )
