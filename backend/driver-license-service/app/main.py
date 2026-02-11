from fastapi import FastAPI, status
from core.settings import logger, ORIGINS
from startup import startup


# Create FastApi app
app: FastAPI = FastAPI(
    title="driver license service", version="0.0.1", lifespan=startup
)


# Middleware
from fastapi.middleware.cors import CORSMiddleware
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


# All routers are added here
from api.public.health import router as health_router
from api.public.license import router as license_router
from api.internal.license import router as internal_license_router

app.include_router(health_router)
app.include_router(license_router)
app.include_router(internal_license_router)


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
                    "message": err["msg"].replace("Value error,", "").strip(),
                }
                for err in exc.errors()
            ],
        },
    )
