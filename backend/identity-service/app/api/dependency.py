from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends


from api.security import IPasswordHasher,Argon2Hasher, oauth_scheme, IJWTService, RefreshTokenBearer, AccessTokenBearer
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


def get_hasher() -> IPasswordHasher:
    return Argon2Hasher()


def get_access_token_bearer() -> IJWTService:
    return AccessTokenBearer()

def get_refresh_token_bearer() -> IJWTService:
    return RefreshTokenBearer()

DbSession = Annotated[Session, Depends(get_db)]
PasswordHasher = Annotated[IPasswordHasher, Depends(get_hasher)]
JwtToken = Annotated[str, Depends(oauth_scheme)]
JWTAccessService = Annotated[IJWTService, Depends(get_access_token_bearer)]
JWTRefreshService = Annotated[IJWTService, Depends(get_refresh_token_bearer)]