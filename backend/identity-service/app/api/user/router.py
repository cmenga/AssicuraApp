from fastapi import APIRouter, status, Body
from typing import List, Annotated
from sqlalchemy.exc import SQLAlchemyError

from settings import logger
from api.dependency import DbSession, JwtToken, JwtService, PasswordHasher

from api.utils import get_current_user, get_addresses
from api.user.schema import (
    UserDataOut,
    AddressDataOut,
    ContactDataIn,
    AddressDataIn,
    ChangePasswordIn,
)
from api.exceptions import (
    InternalServerException,
    NotFoundException,
    ForbiddenException,
)

user_router = APIRouter(tags=["user"], prefix="/user")


@user_router.get("/me", status_code=status.HTTP_200_OK)
async def get_logged_user(
    token: JwtToken, db: DbSession, jwt: JwtService
) -> UserDataOut:
    user = get_current_user(db, jwt.decode_access_token(token))
    return UserDataOut.model_validate(user)


@user_router.get("/addresses", status_code=status.HTTP_200_OK)
async def get_user_address(
    token: JwtToken, db: DbSession, jwt: JwtService
) -> List[AddressDataOut]:
    user = get_current_user(db, jwt.decode_access_token(token))
    fetched_addresses = get_addresses(db, str(user.id))

    addresses = list()
    for address in fetched_addresses:
        addresses.append(AddressDataOut.model_validate(address))

    return addresses


@user_router.patch("/update-contact", status_code=status.HTTP_204_NO_CONTENT)
async def update_contact(
    token: JwtToken,
    db: DbSession,
    jwt: JwtService,
    item: Annotated[ContactDataIn, Body()],
):
    payload = jwt.decode_access_token(token)
    fetched_user = get_current_user(db, payload)

    logger.info(
        "update_contact_start",
        user_id=fetched_user.id,
        fields=list(item.model_dump().keys()),
    )
    for key, value in item.model_dump().items():
        if value:
            setattr(fetched_user, key, value)
            logger.debug("field_set", user_id=fetched_user.id, field=key, value=value)

    try:
        db.commit()
        logger.info("update_contact_success", user_id=fetched_user.id)
    except SQLAlchemyError as ex:
        db.rollback()
        logger.exception(
            ex,
            user_id=fetched_user.id,
        )
        raise InternalServerException(detail=f"Errore database: {ex}")


@user_router.put("/update-address", status_code=status.HTTP_204_NO_CONTENT)
async def update_address(
    token: JwtToken,
    db: DbSession,
    jwt: JwtService,
    address: Annotated[AddressDataIn, Body()],
):
    payload = jwt.decode_access_token(token)
    fecthed_address = get_addresses(db, payload.sub)[0]

    if not fecthed_address:
        logger.warning("Address not found for user", user_id=payload.sub)
        raise NotFoundException("Indirizzo non trovato per questo utente")

    for key, value in address.model_dump().items():
        setattr(fecthed_address, key, value)
        logger.debug("Set attribute", field=key, value=value)

    try:
        db.commit()
        logger.info("Address updated successfully", user_id=payload.sub)
    except SQLAlchemyError as ex:
        db.rollback()
        logger.error(ex, user_id=payload.sub)
        raise InternalServerException(detail=f"Errore database: {ex}")


@user_router.patch("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    token: JwtToken,
    db: DbSession,
    jwt: JwtService,
    hasher: PasswordHasher,
    item: Annotated[ChangePasswordIn, Body()],
):
    logger.info("change_password_called", payload=item.model_dump())

    # Decodifico token e recupero utente
    payload = jwt.decode_access_token(token)
    logger.debug("JWT decoded", payload=payload)

    fetched_user = get_current_user(db, payload)
    if not fetched_user:
        logger.warning("User not found", user_id=payload.sub)
        raise ForbiddenException(detail="Utente non trovato")

    # Verifico la vecchia password
    if not hasher.verify(item.old_password, fetched_user.hashed_password):
        logger.warning("Old password does not match", user_id=fetched_user.id)
        raise ForbiddenException(
            detail="Password errata, inserisci la password corretta"
        )

    # Creo l'hash della nuova password
    hashed_password = hasher.hash(item.new_password)
    fetched_user.hashed_password = hashed_password
    logger.debug("New password hashed and set", user_id=fetched_user.id)

    # Commit sul DB
    try:
        db.commit()
        logger.info("Password changed successfully", user_id=fetched_user.id)
    except SQLAlchemyError as ex:
        db.rollback()
        logger.exception(ex, user_id=fetched_user.id)
        raise InternalServerException(detail=f"Errore database: {ex}")

    return {"success": True, "message": "Password aggiornata correttamente"}
