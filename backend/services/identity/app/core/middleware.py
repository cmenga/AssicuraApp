from fastapi import Response 
from fastapi import Request
from fastapi import status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from core.config import settings
from time import perf_counter

class LoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        The `dispatch` function logs information about incoming requests and their responses based on the
        response status code.

        Args:
          request (Request): The `dispatch` function you provided is an asynchronous function that acts
        as a middleware in a web application. It logs information about incoming requests and their
        responses using the provided `logger` object.
          call_next: The `call_next` parameter in the `dispatch` method is a callable that represents the
        next middleware or endpoint in the application's request-response cycle. When `dispatch` is
        called, it will pass the incoming request to `call_next` to continue processing the request and
        eventually generate a response.
        """

        logger = request.state.logger
        logger.info("request_started")
        start = perf_counter()
        response = await call_next(request)
        duration = round(perf_counter() - start, 3)

        if request.method != "OPTIONS":
            code = response.status_code
            match code // 100:
                case 2:
                    level = logger.info
                    message = "request_successful"
                case 3:
                    level = logger.info
                    message = "request_redirect"
                case 4:
                    level = logger.warning
                    message = "client_error"
                case 5:
                    level = logger.error
                    message = "server_error"
                case _:
                    return response

            level(message,duration=duration,status_code=code)

        return response


class CheckOriginMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        """
        The `dispatch` function in the given Python code snippet checks if the request origin is allowed and
        logs an error if not, returning a 403 Forbidden response if the origin is not allowed.

        Args:
          request (Request): The `request` parameter in the `dispatch` method is of type `Request`. It
        represents the incoming HTTP request that the application will process. It contains information such
        as headers, method, URL path, client IP address, etc.
          call_next: The `call_next` parameter in the `dispatch` method is a reference to the next
        middleware or endpoint handler in the ASGI application. When you call `await call_next(request)`,
        you are essentially passing the request to the next middleware or endpoint in the chain for further
        processing.

        Returns:
          The code is returning a JSONResponse with a message "Origin not allowed" and a status code of 403
        (HTTP Forbidden) if the origin in the request headers is not in the list of allowed origins
        (ORIGINS). If the origin is allowed, it will proceed to call the next middleware or endpoint handler
        by awaiting call_next(request).
        """

        origin = request.headers.get("origin")
        if origin and origin not in settings.app.cors_origins:
            request.state.logger.error(
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
