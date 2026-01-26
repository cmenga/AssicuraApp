from typing_extensions import Annotated, Doc
from fastapi import HTTPException, status
from typing import Any, Dict


class HTTPUnauthorized(HTTPException):
    def __init__(self, detail: str, *,headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail, headers)

class HTTPForbidden(HTTPException):
    def __init__(self, detail: Any = None,*, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_403_FORBIDDEN, detail, headers)
        
class HTTPConflit(HTTPException):
    def __init__(self, detail: Any = None,*, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_409_CONFLICT, detail, headers)
class HTTPNotFound(HTTPException):
    def __init__(self, detail: Any = None,*, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_404_NOT_FOUND, detail, headers)
  
class HTTPInternalServer(HTTPException):
    def __init__(self, detail: Any = None,*, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_500_INTERNAL_SERVER_ERROR, detail, headers)
        
class HTTPBadGateway(HTTPException):
    def __init__(self, detail: Any = None, headers: Dict[str, str] | None = None) -> None:
        super().__init__(status.HTTP_502_BAD_GATEWAY, detail, headers)