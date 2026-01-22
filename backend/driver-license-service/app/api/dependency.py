from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends

from database.session import get_session
from api.security import oauth_scheme

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
        
DbSession = Annotated[Session,Depends(get_db)]
JwtToken = Annotated[str, Depends(oauth_scheme)]
