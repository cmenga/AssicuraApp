from fastapi import Response, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from settings import ORIGINS,logger

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
        if 200 <= response.status_code < 300:
            self.logger.info(
                "request_successful",
                method=request.method,
                path=request.url.path,
                client=client_host,
                status_code=response.status_code,
            )
        elif 300 <= response.status_code < 400:
            self.logger.info(
                "request_redirect",
                method=request.method,
                path=request.url.path,
                client=client_host,
                status_code=response.status_code,
            )
        elif 400 <= response.status_code < 500:
            self.logger.warning(
                "client_error",
                method=request.method,
                path=request.url.path,
                client=client_host,
                status_code=response.status_code,
            )
        elif 500 <= response.status_code < 600:
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
            logger.error("")
            return JSONResponse({"detail": "Origin not allowed"}, status_code=403)
        return await call_next(request)


