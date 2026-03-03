from fastapi import Depends
from fastapi import Cookie
from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from typing import Annotated
from typing import Callable

from app.core.database import get_db

from app.core.security import IPasswordHasher
from app.core.security import IJwtService
from app.core.security import AccessToken
from app.core.security import get_jwt_access_token
from app.core.security import get_password_hasher

from app.core.http_client import call_internal_service
from app.core.exceptions import HTTPUnauthorized


DbSession = Annotated[AsyncSession, Depends(get_db)]
PasswordHasher = Annotated[IPasswordHasher, Depends(get_password_hasher)]
JWTAccessToken = Annotated[IJwtService, Depends(get_jwt_access_token)]


async def get_access_token(
    request: Request,
    jwt: IJwtService = Depends(get_jwt_access_token),
    assicurapp_token: str | None = Cookie(None),
):
    """
    This function retrieves and validates an access token, refreshing it if necessary.
    
    Args:
      jwt (IJwtService): The `jwt` parameter in the `get_access_token` function is a dependency that is
    expected to be an instance of `IJwtService`. It is obtained using the `Depends` function with the
    `get_jwt_access_token` function as an argument. This parameter is used for decoding and encoding
      token (str | None): The `token` parameter in the `get_access_token` function is a string that
    represents an access token. It is retrieved from a cookie but can also be passed as a parameter. If
    the `token` is `None`, it means the user is not authorized and an HTTPUnauthorized exception is
    raised
    
    Returns:
      The function `get_access_token` returns the decoded payload if the token is valid. If the token is
    not provided or invalid, it tries to refresh the token by calling an internal service. If the token
    refresh is successful, it decodes the new access token and returns the payload. If any step fails or
    the payload is still None, it raises an HTTPUnauthorized exception with the message "not authorized
    """
    payload = None
    if assicurapp_token is None:
        raise HTTPUnauthorized("not authorized")

    try:
        payload = jwt.decode(assicurapp_token)
        return payload
    except HTTPUnauthorized:
        response = await call_internal_service(
            url="http://identity-service:8001/v1/auth/internal/refresh",
            method="POST",
            json={"access_token": assicurapp_token},
            correlation_id=request.state.correlation_id,
        )
        if isinstance(response, JSONResponse):
            raise HTTPUnauthorized("not authorized")

        result = response.json()
        if "access_token" not in result:
            raise HTTPUnauthorized("not authorized")

        payload = jwt.decode(result["access_token"])
        return payload

    finally:
        if payload is None:
            raise HTTPUnauthorized("not authorized")


AuthenticatedUser = Annotated[AccessToken, Depends(get_access_token)]


def internal_call() -> Callable:
    return call_internal_service


InternalCallable = Annotated[Callable, Depends(internal_call)]
