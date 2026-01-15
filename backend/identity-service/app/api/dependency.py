from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends

from database.session import get_db
from api.security import HasherPassword,get_hasher_password, AuthJWT, get_auth_jwt

db_dependency = Annotated[Session,Depends(get_db)]
hasher_password_dependency = Annotated[HasherPassword, Depends(get_hasher_password)]
jwt_dependency = Annotated[AuthJWT, Depends(get_auth_jwt)]
