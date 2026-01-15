from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from database.models import User
from api.security import HasherPassword

def get_current_user(db: Session,hasher_password: HasherPassword, email: str, password: str) -> User:
    fetched_user = db.query(User).filter(User.email == email).first()

    if not fetched_user:
        raise HTTPException(
            detail="L'utente non esiste", status_code=status.HTTP_404_NOT_FOUND
        )

    if not hasher_password.verify_password_hash(password, fetched_user.hashed_password):
        raise HTTPException(
            detail="La passowrd o la mail non corrispondono",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    return fetched_user