from typing import Any, Dict
from fastapi import HTTPException, status


class HTTPUnauthorized(HTTPException):
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail, headers)

class HTTPInternalServer(HTTPException):
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_500_INTERNAL_SERVER_ERROR, detail, headers)