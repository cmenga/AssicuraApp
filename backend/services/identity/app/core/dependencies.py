from fastapi import Depends
from fastapi import Cookie
from fastapi import Response

from datetime import datetime
from datetime import timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db

from typing import Annotated

from core.security import IPasswordHasher
from core.security import IJwtService
from core.security import AccessToken
from core.security import get_jwt_access_token
from core.security import get_jwt_refresh_token
from core.security import get_password_hasher

from core.exceptions import HTTPUnauthorized
from models import Token

DbSession = Annotated[AsyncSession, Depends(get_db)]
PasswordHasher = Annotated[IPasswordHasher, Depends(get_password_hasher)]
JWTAccessToken = Annotated[IJwtService, Depends(get_jwt_access_token)]
JWTRefreshToken = Annotated[IJwtService, Depends(get_jwt_refresh_token)]


def acquire_access_token(
    jwt: JWTAccessToken, assicurapp_token: str | None = Cookie(None)
):
    if assicurapp_token:
        try:
            payload = jwt.decode(assicurapp_token)
            return payload
        except HTTPUnauthorized:
            return None
    return None


async def refresh_token(
    db: DbSession,
    jwt: JWTRefreshToken,
    assicurapp_session: str | None = Cookie(None),
    access_token=Depends(acquire_access_token),
):
    if access_token is not None:
        return access_token
    
    statement = select(Token).filter(Token.id == assicurapp_session)
    result = await db.execute(statement)
    refresh_token = result.scalar_one()

    if not refresh_token or refresh_token.expires_at < int(
        datetime.now(timezone.utc).timestamp()
    ):
        raise HTTPUnauthorized("Invalid token")

    return jwt.decode(refresh_token.token)


def authenticated_user(
    response: Response,
    jwt: JWTAccessToken,
    token=Depends(refresh_token),
):

    if token["type"] == "access":
        return token
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
