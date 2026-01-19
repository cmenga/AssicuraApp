from typing_extensions import Annotated, Doc
from fastapi import HTTPException, status
from typing import Any, Dict


class AuthenticationException(HTTPException):
    def __init__(self, detail: str, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail, headers)

class NotFoundException(HTTPException):
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_404_NOT_FOUND, detail, headers)
        
class InternalServerException(HTTPException):
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_500_INTERNAL_SERVER_ERROR, detail, headers)