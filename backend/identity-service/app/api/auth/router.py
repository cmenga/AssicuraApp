from fastapi import APIRouter, Body, status, Depends, Response, Cookie, Form
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone, timedelta

from api.dependency import (
    DbSession,
    PasswordHasher,
    JWTAccessService,
    JWTRefreshService,
    AuthenticatedUser,
)
from api.auth.schema import UserRegistration, AddressRegistration
from api.utils import get_user, get_user_session_token
from api.exceptions import HTTPConflit, HTTPInternalServer, HTTPUnauthorized

from database.models import User, Address, Token
from settings import logger


auth_router = APIRouter(tags=["auth"], prefix="/auth")


@auth_router.post("/sign-up", status_code=status.HTTP_204_NO_CONTENT)
async def create_new_account(
    db: DbSession,
    hasher: PasswordHasher,
    user: Annotated[UserRegistration, Body()],
    address: Annotated[AddressRegistration, Body()],
):
    existing_user = db.query(User).filter(User.fiscal_id == user.fiscal_id).first()

    if existing_user:
        raise HTTPConflit("The user entered is already registered")

    hashed = hasher.hash(user.password)

    user.__delattr__("password")
    user.__delattr__("confirm_password")

    new_user = User(hashed_password=hashed, **user.model_dump())
    new_address = Address(**address.model_dump())
    new_user.addresses.append(new_address)

    try:
        db.add(new_user)
        db.commit()
    except IntegrityError as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPInternalServer("There was a problem saving data")


@auth_router.post("/sign-in", status_code=status.HTTP_204_NO_CONTENT)
async def get_access_token(
    response: Response,
    db: DbSession,
    hasher: PasswordHasher,
    jwt_access: JWTAccessService,
    jwt_refresh: JWTRefreshService,
    form_data: OAuth2PasswordRequestForm = Depends(),
    remember_me: Annotated[str, Form()] = "off",
):
    user = get_user(db, hasher, form_data.username, form_data.password)

    if remember_me == "off":
        access_token = jwt_access.encode(str(user.id), hours=6)
        response.set_cookie(
            key="assicurapp_token",
            httponly=True,
            secure=True,
            value=access_token,
            max_age=60 * 60 * 6,
        )
        return

    access_token = jwt_access.encode(str(user.id), minutes=15)
    response.set_cookie(
        key="assicurapp_token",
        value=access_token,
        httponly=True,
        secure=True,
        max_age=60 * 15,
    )
    fetched_token = db.query(Token).filter(Token.user_id == user.id).first()

    if fetched_token and fetched_token.expires_at > int(
        datetime.now(timezone.utc).timestamp()
    ):
        return

    refresh_token = jwt_refresh.encode(str(user.id), days=7)

    created_at = int(datetime.now(timezone.utc).timestamp())
    expires_at = int((datetime.now(timezone.utc) + timedelta(days=7)).timestamp())
    new_refresh_token = Token(
        user_id=user.id,
        token=refresh_token,
        created_at=created_at,
        expires_at=expires_at,
    )
    db.add(new_refresh_token)
    try:
        db.commit()
        db.refresh(new_refresh_token)
        response.set_cookie(
            key="assicurapp_session",
            value=str(new_refresh_token.id),
            httponly=True,
            secure=True,
            max_age=60 * 60 * 24 * 7,
        )
    except Exception as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPInternalServer("Save to db failed")


@auth_router.post("/sign-out", status_code=status.HTTP_200_OK)
async def logout(response: Response, db: DbSession, assicurapp_session: str = Cookie()):
    fetched_session = db.query(Token).filter(Token.id == assicurapp_session).first()

    db.delete(fetched_session)
    try:
        db.commit()
        response.set_cookie(
            key="assicurapp_session",
            value="",
            httponly=True,
            secure=True,
            max_age=0,
        )
        response.set_cookie(
            key="assicurapp_token",
            value="",
            httponly=True,
            secure=True,
            max_age=0,
        )
    except Exception as ex:
        raise HTTPInternalServer("It was not possible to log out")
    return {"message": "Logout successfully"}


@auth_router.post("/protected", status_code=status.HTTP_204_NO_CONTENT)
async def verify_token(auth: AuthenticatedUser):
    return
