from fastapi import Depends, Cookie
from fastapi.responses import JSONResponse
from typing import Annotated
from sqlalchemy.orm import Session

from database.session import get_db
from core.security import (
    IPasswordHasher,
    IJwtService,
    AccessToken,
    get_password_hasher,
    get_jwt_access_token,
)
from core.exceptions import HTTPUnauthorized
from core.utils import call_internal_service

DbSession = Annotated[Session, Depends(get_db)]
PasswordHahser = Annotated[IPasswordHasher, Depends(get_password_hasher)]
JWTAccessToken = Annotated[IJwtService, Depends(get_jwt_access_token)]

async def get_access_token(
    jwt: IJwtService = Depends(get_jwt_access_token),
    assicurapp_token: str | None = Cookie(None),
):
    payload = None
    if assicurapp_token is None:
        raise HTTPUnauthorized("not authorized")
    try:
        payload = jwt.decode(assicurapp_token)
        return payload
    except HTTPUnauthorized:
        response = await call_internal_service(
            url="http://identity-service:8001/internal/refresh",
            method="POST",
            json={"access_token": assicurapp_token},
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
