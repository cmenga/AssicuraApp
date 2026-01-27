from fastapi import APIRouter, Body, status, Depends, Response, Cookie, Form
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.exc import IntegrityError

from api.dependency import (
    DbSession,
    PasswordHasher,
    JWTAccessService,
    JWTRefreshService,
)
from api.auth.schema import UserRegistration, AddressRegistration, TokenData
from api.utils import get_user
from api.exceptions import HTTPConflit, HTTPInternalServer, HTTPUnauthorized

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
        raise HTTPConflit("L'utente inserito risulta già iscritto")

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
        raise HTTPInternalServer("C'è stato un problema con il salvataggio dei dati")



@auth_router.post("/sign-in", status_code=status.HTTP_200_OK)
async def get_access_token(
    response: Response,
    db: DbSession,
    hasher: PasswordHasher,
    jwt_access: JWTAccessService,
    jwt_refresh: JWTRefreshService,
    form_data: OAuth2PasswordRequestForm = Depends(),
    remember_me: Annotated[str, Form()] = "off",
) -> TokenData:
    logger.info("login.attempt", username=form_data.username, remember_me=remember_me)

    user = get_user(db, hasher, form_data.username, form_data.password)
    logger.info("login.user_found", user_id=user.id)

    if remember_me == "off":
        access_token = jwt_access.encode(str(user.id), hours=6)
        logger.info(
            "login.access_token_generated", token_preview=access_token[:10] + "..."
        )
        return TokenData(access_token=access_token, type="Bearer")

    # remember_me == on
    access_token = jwt_access.encode(str(user.id), minutes=15)
    refresh_token = jwt_refresh.encode(str(user.id), days=7)
    logger.info(
        "login.tokens_generated",
        access_token_preview=access_token[:10] + "...",
        refresh_token_preview=refresh_token[:10] + "...",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=60 * 60 * 24 * 30,  # 30 giorni
    )
    logger.info("login.refresh_cookie_set", user_id=user.id)

    return TokenData(access_token=access_token, type="Bearer")


@auth_router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh_token(
    jwt_refresh: JWTRefreshService,
    jwt_access: JWTAccessService,
    refresh_token: str | None = Cookie(default=None),
):
    """
    Refreshes the access token using a valid refresh token.

    Args:
        token (JwtToken): The refresh token sent by the client.
        jwt (JwtService): JWT service used to decode and create tokens.

    Returns:
        dict: A dictionary containing:
            - access_token (str): Newly created access token.
            - token_type (str): Token type, e.g., "bearer".

    Raises:
        HTTPUnauthorized: If the provided token is invalid or not a refresh token.
    """
    
    if not refresh_token:
        raise HTTPUnauthorized("No refresh token provided")

    payload = jwt_refresh.decode(refresh_token)
    logger.info("refresh_token_decoded", payload=payload)

    if payload.get("type") != "refresh":
        logger.warning("refresh_token_invalid_type", payload=payload)
        raise HTTPUnauthorized("Token non valido")

    access_token = jwt_access.encode(user_id=payload["sub"])
    logger.info("refresh_token_success", user_id=payload["sub"])
    if not access_token:
        raise HTTPUnauthorized("Token non valido")
    return TokenData(access_token=access_token, type="Bearer")


@auth_router.post("/sign-out", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    logger.info("logout.attempt")
    response.set_cookie(
        key="refresh_token",
        value="",
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=0,  # scade subito
    )
    logger.info("logout.refresh_cookie_cleared")

    return {"message": "Logout effettuato correttamente"}
