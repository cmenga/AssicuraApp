from fastapi import APIRouter, status, Body, Response
from typing import List, Annotated
from sqlalchemy.exc import IntegrityError

from core.dependencies import AuthenticatedUser, DbSession, PasswordHasher
from core.exceptions import HTTPInternalServerError, HTTPNotFound, HTTPForbidden
from core.settings import logger

from api.public.utils import get_current_user, get_addresses, get_user_session_token
from api.public.schema import UserDataOut, AddressDataOut, ContactDataIn, AddressDataIn, ChangePasswordIn

router = APIRouter(tags=["user"], prefix="/user")


@router.get("/me", status_code=status.HTTP_200_OK)
async def get_logged_user(auth: AuthenticatedUser, db: DbSession) -> UserDataOut:
    user = get_current_user(db, auth["sub"])
    return UserDataOut.model_validate(user)


@router.get("/addresses", status_code=status.HTTP_200_OK)
async def get_user_address(
    auth: AuthenticatedUser, db: DbSession
) -> List[AddressDataOut]:
    user = get_current_user(db, auth["sub"])
    fetched_addresses = get_addresses(db, str(user.id))

    addresses = list()
    for address in fetched_addresses:
        addresses.append(AddressDataOut.model_validate(address))

    return addresses


@router.patch("/update-contact", status_code=status.HTTP_200_OK)
async def update_contact(
    auth: AuthenticatedUser,
    db: DbSession,
    item: Annotated[ContactDataIn, Body()],
):

    fetched_user = get_current_user(db, auth["sub"])
    for key, value in item.model_dump().items():
        if value:
            setattr(fetched_user, key, value)

    try:
        db.commit()
        logger.info("update_contact_success", user_id=fetched_user.id)
    except IntegrityError as ex:
        db.rollback()
        logger.exception(
            ex,
            user_id=fetched_user.id,
        )
        raise HTTPInternalServerError(f"Errore database: {ex}")


@router.put("/update-address", status_code=status.HTTP_204_NO_CONTENT)
async def update_address(
    auth: AuthenticatedUser,
    db: DbSession,
    address: Annotated[AddressDataIn, Body()],
):
    fecthed_address = get_addresses(db, auth["sub"])[0]

    if not fecthed_address:
        raise HTTPNotFound("Indirizzo non trovato per questo utente")

    for key, value in address.model_dump().items():
        setattr(fecthed_address, key, value)

    try:
        db.commit()
    except IntegrityError as ex:
        db.rollback()
        logger.error(ex, user_id=auth["sub"])
        raise HTTPInternalServerError(f"Errore database: {ex}")


@router.patch("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    auth: AuthenticatedUser,
    db: DbSession,
    hasher: PasswordHasher,
    item: Annotated[ChangePasswordIn, Body()],
):
    fetched_user = get_current_user(db, auth["sub"])

    if not fetched_user:
        raise HTTPForbidden("Utente non trovato")

    if not hasher.verify(item.old_password, fetched_user.hashed_password):
        raise HTTPForbidden("Password errata, inserisci la password corretta")

    hashed_password = hasher.hash(item.new_password)
    fetched_user.hashed_password = hashed_password

    try:
        db.commit()
    except IntegrityError as ex:
        db.rollback()
        logger.exception(ex, user_id=fetched_user.id)
        raise HTTPInternalServerError(f"Errore database: {ex}")

    return {"success": True, "message": "Password aggiornata correttamente"}


@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(response: Response, auth: AuthenticatedUser, db: DbSession):
    fetched_user = get_current_user(db, auth["sub"])
    user_id: str = str(fetched_user.id)
    fetched_token = get_user_session_token(db, user_id)

    try:
        from core.utils import call_internal_service

        internal_response = await call_internal_service(
            f"http://driver-license-service:8001/internal/delete-licenses/{user_id}",
            method="DELETE",
        )

        if internal_response.status_code != 200:
            raise

        if fetched_token:
            db.delete(fetched_token)
        db.commit()
    except Exception as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPInternalServerError(f"Database error: {ex}")

    try:
        db.delete(fetched_user)
        db.commit()
    except IntegrityError as ex:
        db.rollback()
        logger.exception(ex, user_id=fetched_user.id, error=str(ex))
        raise HTTPInternalServerError(f"Database error: {ex}")

    response.set_cookie(
        key="assicurapp_token", value="", max_age=0, httponly=True, secure=True
    )
    response.set_cookie(
        key="assicurapp_session", value="", max_age=0, httponly=True, secure=True
    )
