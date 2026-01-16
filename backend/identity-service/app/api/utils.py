from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from database.models import User, Address
from api.security import HasherPassword, AccessTokenData
from api.exceptions import AuthenticationException, NotFoundException
from settings import logger


def get_user(
    db: Session, hasher_password: HasherPassword, email: str, password: str
) -> User:
    """
    The function `get_current_user` retrieves a user from the database based on email, verifies the
    password, and returns the user if found.

    Args:
        db (Session): The `db` parameter is of type `Session` and is used to interact with the database.
            It is typically used to query, insert, update, and delete data from the database.
        hasher_password (HasherPassword): The `hasher_password` parameter in the `get_current_user`
            function seems to be an instance of a class or a utility that is used for hashing passwords and
            verifying password hashes. It is likely used to securely compare the password provided by the user
            with the hashed password stored in the database for the
      email (str): The `get_current_user` function you provided takes in several parameters:
            password (str): The `get_current_user` function you provided takes in several parameters:

    Returns:
        The function `get_current_user` returns the user object fetched from the database if the user
        exists and the provided password matches the hashed password stored in the database. If the user
        does not exist or the password does not match, it raises appropriate HTTP exceptions with
        corresponding status codes and details.
    """
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

    if not hasher_password.verify_password_hash(password, fetched_user.hashed_password):
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


def get_current_user(db: Session, token_data: AccessTokenData):
    user = (
        db.query(User)
        .filter(User.id == token_data.sub, User.email == token_data.email)
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
