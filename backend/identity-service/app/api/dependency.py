from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, Response, Cookie


from api.security import (
    IPasswordHasher,
    Argon2Hasher,
    IJWTService,
    RefreshTokenBearer,
    AccessTokenBearer,
    Token as AccessToken,
)
from api.exceptions import HTTPUnauthorized
from database.session import get_session


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


DbSession = Annotated[Session, Depends(get_db)]


def get_hasher() -> IPasswordHasher:
    return Argon2Hasher()


PasswordHasher = Annotated[IPasswordHasher, Depends(get_hasher)]


def get_access_token_bearer() -> IJWTService:
    return AccessTokenBearer()


def get_refresh_token_bearer() -> IJWTService:
    return RefreshTokenBearer()


JWTAccessService = Annotated[IJWTService, Depends(get_access_token_bearer)]
JWTRefreshService = Annotated[IJWTService, Depends(get_refresh_token_bearer)]




# TOKEN vlidate
from database.models import Token
from datetime import datetime, timezone
from settings import logger


def get_access_token(jwt: JWTAccessService, assicurapp_token: str | None = Cookie(None)):
    if assicurapp_token:
        try:
            payload = jwt.decode(assicurapp_token)
            return payload  # ok
        except HTTPUnauthorized:
            return None
    return None

def get_refresh_token(db: DbSession,jwt: JWTRefreshService, assicurapp_session: str | None = Cookie(None), access_token = Depends(get_access_token)):
    if access_token is not None:
        return access_token
    refresh_token = db.query(Token).filter(Token.id == assicurapp_session).first()
    if not refresh_token or refresh_token.expires_at < int(
        datetime.now(timezone.utc).timestamp()
    ):
        raise HTTPUnauthorized("Invalid token")

    return jwt.decode(refresh_token.token)

def authenticated_user(
    response: Response,
    jwt: JWTAccessService,
    token=Depends(get_refresh_token),
):

    if token["type"] == "access":
        return token
    logger.info("Siamo in auhtenticade_user dopo il rientro di refresh token")
    new_access_token = jwt.encode(token["sub"], minutes=15)
    response.set_cookie(
        key="assicurapp_token",
        httponly=True,
        secure=True,
        value=new_access_token,
        samesite="lax",
    )

    return jwt.decode(new_access_token)


AuthenticatedUser = Annotated[AccessToken, Depends(authenticated_user)]
