from fastapi import APIRouter, Body, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.exc import IntegrityError

from api.dependency import DbSession, PasswordHasher, JwtService
from api.auth.schema import UserRegistration, AddressRegistration, TokenData
from api.utils import get_user

from database.models import User, Address
from settings import logger


auth_router = APIRouter(tags=["auth"], prefix="/auth")


@auth_router.post("/sign-up", status_code=status.HTTP_204_NO_CONTENT)
async def create_new_account(
    db: DbSession,
    hasher: PasswordHasher,
    user: Annotated[UserRegistration, Body()],
    address: Annotated[AddressRegistration, Body()],
):
    logger.info("Sign-up request received", email=user.email, fiscal_id=user.fiscal_id)
    existing_user = db.query(User).filter(User.fiscal_id == user.fiscal_id).first()

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

    hashed = hasher.hash(user.password)

    user.__delattr__("password")
    user.__delattr__("confirm_password")

    new_user = User(hashed_password=hashed, **user.model_dump())
    new_address = Address(**address.model_dump())
    new_user.addresses.append(new_address)

    logger.debug(
        "User and address ORM objects created",
        address_type=new_address.type,
        city=new_address.city,
        province=new_address.province,
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(
            "User successfully registered",
            user_id=str(new_user.id),
            email=new_user.email,
            address_type=new_address.type,
        )
    except IntegrityError as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPException(
            detail="C'è stato un problema con il salvataggio dei dati",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@auth_router.post("/sign-in", status_code=status.HTTP_200_OK)
async def get_access_token(
    db: DbSession,
    hasher: PasswordHasher,
    jwt: JwtService,
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> TokenData:
    user = get_user(db, hasher, form_data.username, form_data.password)
    access_token = jwt.create_access_token(user.id.__str__(), user.email)
    refresh_token = jwt.create_refresh_token(user.id.__str__())

    token = TokenData(
        access_token=access_token, refresh_token=refresh_token, type="Bearer"
    )
    return token
