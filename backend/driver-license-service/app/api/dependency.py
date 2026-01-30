from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, Cookie

from database.session import get_session
from api.security import (
    oauth_scheme,
    IPasswordHasher,
    Argon2Hasher,
    IJwtService,
    AccessTokenBeaer,
    AccessToken
)
from api.exceptions import HTTPUnauthorized
from api.internal.utils import call_internal_service


def get_db():
    """
    The function `get_db` creates a database session and yields it for use, ensuring the session is
    closed properly afterwards.
    """
    SessionLocal = get_session()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_password_hasher() -> IPasswordHasher:
    return Argon2Hasher()


def get_access_token_bearer() -> IJwtService:
    return AccessTokenBeaer()


DbSession = Annotated[Session, Depends(get_db)]
PasswordHasher = Annotated[IPasswordHasher, Depends(get_password_hasher)]
JWToken = Annotated[str, Depends(oauth_scheme)]
JWTAccessToken = Annotated[IJwtService, Depends(get_access_token_bearer)]


async def get_access_token(
    jwt: JWTAccessToken, assicurapp_token: str | None = Cookie(None)
):
    if assicurapp_token is None:
        raise HTTPUnauthorized("not authorized")
    try:
        payload = jwt.decode(assicurapp_token)
        return payload
    except HTTPUnauthorized:
        result = await call_internal_service(
            url="http://identity-service:8001/internal/refresh",
            method="POST",
            json={"access_token": assicurapp_token},
        )
        if "access_token" not in result:
            raise HTTPUnauthorized("Not authorized")
        return jwt.decode(result["access_token"])

AuthenticatedUser = Annotated[AccessToken,Depends(get_access_token)]