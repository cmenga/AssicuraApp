from fastapi import APIRouter, status, Body
from typing import List, Annotated
from sqlalchemy.exc import SQLAlchemyError
from requests import delete

from settings import logger
from api.dependency import DbSession, JwtToken, PasswordHasher, JWTAccessService

from api.utils import get_current_user, get_addresses
from api.user.schema import (
    UserDataOut,
    AddressDataOut,
    ContactDataIn,
    AddressDataIn,
    ChangePasswordIn,
)
from api.exceptions import (
    HTTPInternalServer,
    HTTPNotFound,
    HTTPForbidden,
    HTTPBadGateway,
)

user_router = APIRouter(tags=["user"], prefix="/user")


@user_router.get("/me", status_code=status.HTTP_200_OK)
async def get_logged_user(
    token: JwtToken, db: DbSession, jwt: JWTAccessService
) -> UserDataOut:
    payload = jwt.decode(token)
    user = get_current_user(db, payload["sub"])
    return UserDataOut.model_validate(user)


@user_router.get("/addresses", status_code=status.HTTP_200_OK)
async def get_user_address(
    token: JwtToken, db: DbSession, jwt: JWTAccessService
) -> List[AddressDataOut]:
    payload = jwt.decode(token)
    user = get_current_user(db, payload["sub"])
    fetched_addresses = get_addresses(db, str(user.id))

    addresses = list()
    for address in fetched_addresses:
        addresses.append(AddressDataOut.model_validate(address))

    return addresses


@user_router.patch("/update-contact", status_code=status.HTTP_200_OK)
async def update_contact(
    token: JwtToken,
    db: DbSession,
    jwt: JWTAccessService,
    item: Annotated[ContactDataIn, Body()],
):
    payload = jwt.decode(token)
    fetched_user = get_current_user(db, payload["sub"])

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
        raise HTTPInternalServer(f"Errore database: {ex}")


@user_router.put("/update-address", status_code=status.HTTP_204_NO_CONTENT)
async def update_address(
    token: JwtToken,
    db: DbSession,
    jwt: JWTAccessService,
    address: Annotated[AddressDataIn, Body()],
):
    payload = jwt.decode(token)
    fecthed_address = get_addresses(db, payload["sub"])[0]

    if not fecthed_address:
        logger.warning("Address not found for user", user_id=payload["sub"])
        raise HTTPNotFound("Indirizzo non trovato per questo utente")

    for key, value in address.model_dump().items():
        setattr(fecthed_address, key, value)
        logger.debug("Set attribute", field=key, value=value)

    try:
        db.commit()
        logger.info("Address updated successfully", user_id=payload["sub"])
    except SQLAlchemyError as ex:
        db.rollback()
        logger.error(ex, user_id=payload["sub"])
        raise HTTPInternalServer(f"Errore database: {ex}")


@user_router.patch("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    token: JwtToken,
    db: DbSession,
    jwt: JWTAccessService,
    hasher: PasswordHasher,
    item: Annotated[ChangePasswordIn, Body()],
):
    payload = jwt.decode(token)
    fetched_user = get_current_user(db, payload["sub"])
    
    if not fetched_user:
        logger.warning("User not found", user_id=payload["sub"])
        raise HTTPForbidden("Utente non trovato")


    if not hasher.verify(item.old_password, fetched_user.hashed_password):
        logger.warning("Old password does not match", user_id=fetched_user.id)
        raise HTTPForbidden("Password errata, inserisci la password corretta")

    hashed_password = hasher.hash(item.new_password)
    fetched_user.hashed_password = hashed_password
    logger.debug("New password hashed and set", user_id=fetched_user.id)

    try:
        db.commit()
        logger.info("Password changed successfully", user_id=fetched_user.id)
    except SQLAlchemyError as ex:
        db.rollback()
        logger.exception(ex, user_id=fetched_user.id)
        raise HTTPInternalServer(f"Errore database: {ex}")

    return {"success": True, "message": "Password aggiornata correttamente"}


@user_router.delete("/delete", status_code=status.HTTP_200_OK)
async def delete_user(db: DbSession, jwt: JWTAccessService, token: JwtToken):
    """
    Deletes the authenticated user and all associated addresses.

    This endpoint decodes the provided JWT access token to identify
    the current user. It then deletes the user from the database.
    If the user's addresses are configured with ORM cascade, they
    will be removed automatically.

    Args:
        db (DbSession): Database session injected via dependency.
        jwt (JwtService): Service responsible for decoding JWT access tokens.
        token (JwtToken): JWT access token of the authenticated user.

    Returns:
        dict: A dictionary containing:
            - success (bool): True if the user was deleted successfully.
            - message (str): A descriptive message about the deletion.

    Raises:
        HTTPInternalServer: If a database error occurs during deletion.
    """
    payload = jwt.decode(token)
    fetched_user = get_current_user(db, payload["sub"])

    try:
        delete(
            "http://driver-license-dev:8001/driver-license/delete",
            headers={"Authorization": f"Bearer {token}"},
        )
        logger.info("User deleted successfully", user_id=fetched_user.id)
    except Exception as ex:
        logger.exception(ex)
        raise HTTPBadGateway(
            "Impossibile eliminare le patenti di guida dal servizio licenze"
        )

    try:
        db.delete(fetched_user)
        db.commit()

        logger.info("User deleted successfully", user_id=fetched_user.id)

        return {
            "success": True,
            "message": f"utente cancellato con successo",
        }

    except SQLAlchemyError as ex:
        db.rollback()
        logger.exception(ex, user_id=fetched_user.id, error=str(ex))
        raise HTTPInternalServer(f"Database error: {ex}")
