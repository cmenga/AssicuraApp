from fastapi import Response, Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from core.settings import ORIGINS, logger


class LoggerMiddleware(BaseHTTPMiddleware):
    """
    A middleware class for logging request and response information.
    @param BaseHTTPMiddleware - The base HTTP middleware class.
    @method __init__ - Initializes the LoggerMiddleware with the provided app and logger.
    @method dispatch - Dispatches requests and logs information about the request and response.
    @param request - The incoming request object.
    @param call_next - The next middleware or endpoint to call.
    @return The response object.
    """

    def __init__(self, app, logger) -> None:
        super().__init__(app)
        self.logger = logger

    async def dispatch(self, request: Request, call_next) -> Response:
        """
        A method to dispatch requests and log information about the request and response.
        @param request - The incoming request object.
        @param call_next - The next middleware or endpoint to call.
        @return The response object.
        """
        client_host = request.client.host if request.client else "unknown"
        if request.method != "OPTIONS":
            print("", flush=True)
            self.logger.info(
                "request_started",
                method=request.method,
                path=request.url.path,
                client=client_host,
            )
        response = await call_next(request)

        if request.method != "OPTIONS":
            code = response.status_code
            match code // 100:
                case 2:
                    level = self.logger.info
                    message = "request_successful"
                case 3:
                    level = self.logger.info
                    message = "request_redirect"
                case 4:
                    level = self.logger.warning
                    message = "client_error"
                case 5:
                    level = self.logger.error
                    message = "server_error"
                case _:
                    return response

            level(
                message,
                method=request.method,
                client=client_host,
                status=response.status_code,
            )

        return response


class CheckOriginMiddleware(BaseHTTPMiddleware):
    """
    A middleware class to check the origin header of incoming requests against a list of allowed origins.
    @param BaseHTTPMiddleware - The base class for HTTP middleware.
    @method dispatch - A method to handle incoming requests by checking the origin header against a list of allowed origins. If the origin is not allowed, log an error and return a JSON response with a 403 status code. Otherwise, proceed with the request.
    @param request - The incoming request object.
    @param call_next - The next middleware or endpoint to call in the request chain.
    @return The response to the request.
    """

    async def dispatch(self, request: Request, call_next):
        """
        Define a method to handle incoming requests by checking the origin header against a list of allowed origins. If the origin is not allowed, log an error and return a JSON response with a 403 status code. Otherwise, proceed with the request.
        @param request - The incoming request object.
        @param call_next - The next middleware or endpoint to call in the request chain.
        @return The response to the request.
        """
        origin = request.headers.get("origin")
        if origin and origin not in ORIGINS:
            logger.error(
                "Request blocked: origin not allowed",
                origin=origin,
                method=request.method,
                endpoint=request.url.path,
                client_ip=request.client.host if request.client else None,
            )
            return JSONResponse(
                {"detail": "Origin not allowed"}, status_code=status.HTTP_403_FORBIDDEN
            )
        return await call_next(request)
