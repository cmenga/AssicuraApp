from fastapi import APIRouter, Body, status, HTTPException
from typing import Annotated
from sqlalchemy.exc import IntegrityError

from api.dependency import db_dependency
from api.auth.schema import UserRegistration, AddressRegistration
from database.models import User, Address
from settings import logger

#TODO: questi non devono far parte di router.py ma di security.py o roba simile
from passlib.context import CryptContext
bcrypt_context = CryptContext(schemes=["argon2"], deprecated="auto")
def get_password_hash(password: str):
    return bcrypt_context.hash(password)


auth_router = APIRouter(tags=["auth"], prefix="/auth")


@auth_router.post("/sign-up", status_code=status.HTTP_204_NO_CONTENT)
async def create_new_account(
    db: db_dependency,
    user: Annotated[UserRegistration, Body()],
    address: Annotated[AddressRegistration, Body()],
):
    logger.info("Sign-up request received", email=user.email, fiscal_id=user.fiscal_id)
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .filter(User.fiscal_id == user.fiscal_id)
        .first()
    )

    if existing_user:
        logger.warning(
            "Sign-up attempt for already existing user",
            email=user.email,
            fiscal_id=user.fiscal_id,
            user_id=str(existing_user.id),
        )
        raise HTTPException(
            detail="L'utente inserito risulta già iscritto",
            status_code=status.HTTP_409_CONFLICT,
        )

    logger.debug(
        "User not found, proceeding with registration",
        email=user.email,
        fiscal_id=user.fiscal_id,
    )

    hashed_password = get_password_hash(user.password)

    user.__delattr__("password")
    user.__delattr__("confirm_password")

    new_user = User(hashed_password=hashed_password, **user.model_dump())
    new_address = Address(**address.model_dump())
    new_user.addresses.append(new_address)

    logger.debug("User and address ORM objects created",address_type=new_address.type,city=new_address.city,province=new_address.province)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info("User successfully registered",user_id=str(new_user.id),email=new_user.email,address_type=new_address.type)
    except IntegrityError as ex:
        logger.exception(ex)
        db.rollback()

        detail = ex.orig
        if detail == "uq_user_address_type":
            logger.warning("User attempted to insert duplicate address type",email=user.email,address_type=address.type)
            raise HTTPException(
                detail="L'utente ha entrambi gli indirizzi salvati",
                status_code=status.HTTP_409_CONFLICT,
            )
        raise HTTPException(
            detail="C'è stato un problema con il salvataggio dei dati",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
