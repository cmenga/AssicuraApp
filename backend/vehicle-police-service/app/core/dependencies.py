from fastapi import Depends
from typing import Annotated
from sqlalchemy.orm import Session

from database.session import get_db
from core.security import (
    get_password_hasher,
    IPasswordHasher,
    IJwtService,
    get_jwt_access_token,
)

DbSession = Annotated[Session, Depends(get_db)]
PasswordHahser = Annotated[IPasswordHasher, Depends(get_password_hasher)]
JWTAccessToken = Annotated[IJwtService, Depends(get_jwt_access_token)]
