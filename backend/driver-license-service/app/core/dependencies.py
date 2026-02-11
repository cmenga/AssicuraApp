from fastapi import Depends
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
from core.utils import get_access_token

DbSession = Annotated[Session, Depends(get_db)]
PasswordHahser = Annotated[IPasswordHasher, Depends(get_password_hasher)]
JWTAccessToken = Annotated[IJwtService, Depends(get_jwt_access_token)]
AuthenticatedUser = Annotated[AccessToken, Depends(get_access_token)]
