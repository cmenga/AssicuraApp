from sqlalchemy.orm import Session
from database.models import User, Address, Token
from api.security import IPasswordHasher
from api.exceptions import HTTPUnauthorized, HTTPNotFound
from settings import logger


def get_user(db: Session, hasher: IPasswordHasher, email: str, password: str) -> User:
    fetched_user = db.query(User).filter(User.email == email).first()

    if not fetched_user:
        logger.warning(
            "login_failed_user_not_found",
            email=email,
        )
        raise HTTPNotFound("L'utente inserito non esiste")

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
        raise HTTPUnauthorized("La passowrd o la mail non corrispondono")

    logger.info(
        "login_success",
        user_id=fetched_user.id,
        email=fetched_user.email,
    )
    return fetched_user


def get_current_user(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPNotFound("Utente non trovato")
    return user


def get_addresses(db: Session, user_id: str):
    fetched_address = db.query(Address).filter(Address.user_id == user_id).all()
    if not fetched_address:
        raise HTTPNotFound("Non esistono indirizzi per questo utente")
    return fetched_address



def get_user_session_token(db: Session, user_id: str)-> Token | None:
    fetched_token = db.query(Token).filter(Token.user_id == user_id).first()
    if not fetched_token:
        return None
    return fetched_token