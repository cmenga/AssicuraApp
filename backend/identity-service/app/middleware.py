from fastapi import Response, Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from settings import ORIGINS, logger


class LoggerMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, logger) -> None:
        super().__init__(app)
        self.logger = logger

    async def dispatch(self, request: Request, call_next) -> Response:
        client_host = request.client.host if request.client else "unknown"
        print("", flush=True)
        self.logger.info(
            "request_started",
            method=request.method,
            path=request.url.path,
            client=client_host,
        )
        response = await call_next(request)
        # Log in base allo status code
        if response.status_code < status.HTTP_300_MULTIPLE_CHOICES:
            self.logger.info(
                "request_successful",
                method=request.method,
                path=request.url.path,
                client=client_host,
                status_code=response.status_code,
            )
        elif status.HTTP_300_MULTIPLE_CHOICES >= response.status_code < status.HTTP_400_BAD_REQUEST:
            self.logger.info(
                "request_redirect",
                method=request.method,
                path=request.url.path,
                client=client_host,
                status_code=response.status_code,
            )
        elif status.HTTP_400_BAD_REQUEST >= response.status_code < status.HTTP_500_INTERNAL_SERVER_ERROR:
            self.logger.warning(
                "client_error",
                method=request.method,
                path=request.url.path,
                client=client_host,
                status_code=response.status_code,
            )
        elif status.HTTP_500_INTERNAL_SERVER_ERROR >= response.status_code:
            self.logger.error(
                "server_error",
                method=request.method,
                path=request.url.path,
                client=client_host,
                status_code=response.status_code,
            )
        return response


class CheckOriginMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin")
        if origin and origin not in ORIGINS:
            logger.error(
                "Request blocked: origin not allowed",
                origin=origin,
                method=request.method,
                endpoint=request.url.path,
                client_ip=request.client.host if request.client else None,
            )
            return JSONResponse({"detail": "Origin not allowed"}, status_code=status.HTTP_403_FORBIDDEN)
        return await call_next(request)
