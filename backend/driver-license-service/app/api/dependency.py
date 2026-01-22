from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends

from database.session import get_session
from api.security import oauth_scheme, IPasswordHasher, Argon2Hasher, IJwtService, JwtService

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

def get_jwt_service() -> IJwtService:
    return JwtService()

DbSession = Annotated[Session,Depends(get_db)]
PasswordHasher = Annotated[IPasswordHasher, Depends(get_password_hasher)]
JWToken = Annotated[str, Depends(oauth_scheme)]
JWTService = Annotated[IJwtService, Depends(get_jwt_service)]