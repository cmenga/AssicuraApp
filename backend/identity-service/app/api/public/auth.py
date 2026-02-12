from fastapi import APIRouter, status, Body, Response, Depends, Form, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from typing import Annotated
from datetime import datetime, timezone, timedelta

from core.dependencies import DbSession, PasswordHasher, JWTAccessToken, JWTRefreshToken, AuthenticatedUser
from core.exceptions import HTTPConflict, HTTPInternalServerError
from core.settings import logger

from database.models import User, Address, Token

from api.public.schema import UserRegistration, AddressRegistration, DriverLicenseIn
from api.public.utils import get_user

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post("/sign-up", status_code=status.HTTP_204_NO_CONTENT)
async def create_new_account(
    db: DbSession,
    hasher: PasswordHasher,
    user: Annotated[UserRegistration, Body()],
    address: Annotated[AddressRegistration, Body()],
    license: Annotated[DriverLicenseIn, Body()],
):
    existing_user = db.query(User).filter(User.fiscal_id == user.fiscal_id).first()

    if existing_user:
        raise HTTPConflict("The user entered is already registered")

    hashed = hasher.hash(user.password)
    delattr(user, "password")
    delattr(user, "confirm_password")

    new_user = User(hashed_password=hashed, **user.model_dump())
    new_address = Address(**address.model_dump())
    new_user.addresses.append(new_address)

    try:
        db.add(new_user)
        db.flush()
        # Service to service for license
        from core.utils import call_internal_service
        
        response = await call_internal_service(
            f"http://driver-license-service:8001/internal/add/{new_user.id}",
            method="POST",
            json=license.model_dump(mode="json"),
        )
        if response.status_code >= 400:
            return response
        db.commit()
    except IntegrityError as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPInternalServerError("There was a problem saving data")


@router.post("/sign-in", status_code=status.HTTP_204_NO_CONTENT)
async def get_access_token(
    response: Response,
    db: DbSession,
    hasher: PasswordHasher,
    jwt_access: JWTAccessToken,
    jwt_refresh: JWTRefreshToken,
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
        raise HTTPInternalServerError("Save to db failed")


@router.post("/sign-out", status_code=status.HTTP_200_OK)
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
    except:
        raise HTTPInternalServerError("It was not possible to log out")
    return {"message": "Logout successfully"}


@router.post("/protected", status_code=status.HTTP_204_NO_CONTENT)
async def verify_token(auth: AuthenticatedUser):
    return
