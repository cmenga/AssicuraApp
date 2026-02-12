from fastapi import FastAPI, status

from startup import startup
from core.settings import logger, ORIGINS


# Create FastApi app
app: FastAPI = FastAPI(title="Core", version="0.0.1", lifespan=startup)


# Middleware
from core.middleware import LoggerMiddleware, CheckOriginMiddleware
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
from api.public.health import router as health_router
from api.public.auth import router as auth_router
from api.public.user import router as user_router
from api.internal.auth import router as internal_auth_router

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(internal_auth_router)

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
