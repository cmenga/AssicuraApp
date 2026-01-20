from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from database.models import User, Address
from api.security import IPasswordHasher, AccessToken
from api.exceptions import AuthenticationException, NotFoundException
from settings import logger


def get_user(
    db: Session, hasher: IPasswordHasher, email: str, password: str
) -> User:
    fetched_user = db.query(User).filter(User.email == email).first()

    if not fetched_user:
        logger.warning(
            "login_failed_user_not_found",
            email=email,
        )
        raise HTTPException(
            detail="L'utente non esiste", status_code=status.HTTP_404_NOT_FOUND
        )

    logger.debug(
        "login_user_found",
        user_id=fetched_user.id,
        email=fetched_user.email,
    )

    if not hasher.verify(password, fetched_user.hashed_password):
        logger.warning(
            "login_failed_invalid_password",
            user_id=fetched_user.id,
            email=fetched_user.email,
        )
        raise HTTPException(
            detail="La passowrd o la mail non corrispondono",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    logger.info(
        "login_success",
        user_id=fetched_user.id,
        email=fetched_user.email,
    )
    return fetched_user


def get_current_user(db: Session, token: AccessToken ):
    user = (
        db.query(User)
        .filter(User.id == token.sub, User.email == token.email)
        .first()
    )
    if not user:
        raise AuthenticationException("Impossibile convalidare le credenziali")
    return user


def get_addresses(db: Session, user_id: str):
    fetched_address = db.query(Address).filter(Address.user_id == user_id).all()
    if not fetched_address:
        raise NotFoundException("Non esistono indirizzi per questo utente") 
    return fetched_address
