from typing_extensions import Annotated, Doc
from fastapi import HTTPException, status
from typing import Any, Dict

class HTTPUnauthorized(HTTPException):
    """
    Define a custom exception class for HTTP 401 Unauthorized errors.
    @param detail - Additional details about the error (optional)
    @param headers - Headers to include in the response (optional)
    """
    def __init__(
        self, detail: Any = None, headers: Dict[str, str] | None = None
    ) -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail, headers)

class HTTPForbidden(HTTPException):
    """
    Define a custom exception class for HTTP 403 Forbidden errors.
    @param detail - Additional details about the error (optional)
    @param headers - Headers to include in the response (optional)
    @return None
    """
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_403_FORBIDDEN, detail, headers)

class HTTPNotFound(HTTPException):
    """
    Define a custom exception class for HTTP 404 Not Found errors.
    @param detail - Additional details about the error (optional)
    @param headers - Headers to include in the response (optional)
    """
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_404_NOT_FOUND, detail, headers)
        

class HTTPConflict(HTTPException):
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_409_CONFLICT, detail, headers)

class HTTPInternalServerError(HTTPException):
    """
    Define a custom exception class for HTTP 500 Internal Server Error.
    @param detail - Additional details about the error (optional)
    @param headers - Headers to include in the response (optional)
    """
    def __init__(
        self, detail: Any = None, headers: Dict[str, str] | None = None
    ) -> None:
        super().__init__(status.HTTP_500_INTERNAL_SERVER_ERROR, detail, headers)

class HTTPServiceUnavailable(HTTPException):
    """
    Define a custom exception class for HTTP Service Unavailable.
    @param detail - Additional details about the exception (optional)
    @param headers - Headers to include in the response (optional)
    """
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_503_SERVICE_UNAVAILABLE, detail, headers)