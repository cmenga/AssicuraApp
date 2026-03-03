"""
Main FastAPI application setup.

- Configures application lifespan, middleware, routers, and exception handlers.
- Performs startup tasks including database readiness check, internal script execution, and Alembic migrations.
"""

from fastapi import FastAPI
from fastapi import status
from fastapi import Request
from fastapi import HTTPException
from uuid import uuid4

from app.core.config import settings
from app.core.logging import logger
from app.startup import startup

from app.api.router import router as api_router


# Create FastApi app
app: FastAPI = FastAPI(
    title=settings.app.service_name,
    version=settings.app.version,
    lifespan=startup
)

app.include_router(api_router)

# Middleware setup
"""
Adds application middleware:
    - CheckOriginMiddleware: Blocks requests from disallowed origins.
    - CORSMiddleware: Allows CORS requests from allowed origins with credentials, all methods and headers.
    - LoggerMiddleware: Logs all incoming requests and their responses with structured logging.
"""
from fastapi.middleware.cors import CORSMiddleware
from app.core.middleware import LoggerMiddleware
from app.core.middleware import CheckOriginMiddleware

app.add_middleware(CheckOriginMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.app.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggerMiddleware)


@app.middleware("http")
async def add_corellation_id(request: Request, call_next):
    correlation_id = request.headers.get("X-Correlation-ID", str(uuid4()))
    request.state.correlation_id = correlation_id
    
    client_host = request.client.host if request.client else "unknown"
    
    request.state.logger = logger.bind(
        client=client_host,
        correlation_id=correlation_id, 
        service=settings.app.service_name,
        method=request.method,
        path=request.url.path,
    )

    response = await call_next(request)
    response.headers["X-Correlation-ID"] = correlation_id
    return response


# Change validation error
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request,exc: RequestValidationError):
    """
    The function handles validation errors by returning a JSON response with details about the invalid
    input data.

    Args:
      exc (RequestValidationError): The parameter `exc` in the exception handler function
    `validation_exception_handler` is an instance of `RequestValidationError`. This exception is raised
    when there is a validation error in the request data, typically when the incoming data does not
    match the expected schema or format. The function handles this exception by returning a

    Returns:
      A JSONResponse is being returned with a status code of 422 (UNPROCESSABLE ENTITY) and content
    containing a message "Dati di input non validi" (Italian for "Invalid input data") along with a list
    of errors. Each error in the list includes the field name and the corresponding error message
    extracted from the RequestValidationError.
    """
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


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    The function handles HTTP exceptions by logging relevant information and returning a JSON response
    with the error details.

    Args:
      request (Request): The `request` parameter in the exception handler function represents the
    incoming request object received by the FastAPI application. It contains information about the HTTP
    request made to the server, such as headers, query parameters, path parameters, and more. In the
    context of the exception handler, it is used to access
      exc (HTTPException): The `exc` parameter in the exception handler function represents the instance
    of the `HTTPException` that was raised during the request processing. It contains information about
    the HTTP status code and detail message of the exception that occurred.

    Returns:
      A JSONResponse object is being returned with the status code, message, and correlation_id
    extracted from the HTTPException. The content of the response includes the code, message, and
    correlation_id values.
    """
    correlation_id = getattr(request.state, "logger", None)
    if correlation_id:
        correlation_id = request.state.logger._context.get("correlation_id", "N/A")

    request.state.logger.error(
        "http_exception",
        status_code=exc.status_code,
        detail=exc.detail,
        correlation_id=correlation_id,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "message": exc.detail,
            "correlation_id": correlation_id,
        },
    )
