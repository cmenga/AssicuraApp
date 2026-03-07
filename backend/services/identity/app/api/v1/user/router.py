from fastapi import APIRouter
from fastapi import status
from fastapi import Response
from fastapi import Request
from fastapi import Body

from typing import List
from typing import Annotated

from sqlalchemy.exc import SQLAlchemyError

from app.core.dependencies import AuthenticatedUser
from app.core.dependencies import DbSession
from app.core.dependencies import PasswordHasher
from app.core.dependencies import InternalCallable
from app.core.exceptions import HTTPInternalServerError
from app.core.exceptions import HTTPForbidden
from app.core.http_client import call_internal_service

from app.api.v1.user.utils import get_current_user
from app.api.v1.user.utils import get_addresses
from app.api.v1.user.utils import get_user_session_token

from app.api.v1.user.schema import UserDetail
from app.api.v1.user.schema import AddressDetail
from app.api.v1.user.schema import ContactUpdate
from app.api.v1.user.schema import AddressUpdate
from app.api.v1.user.schema import PasswordUpdate


router = APIRouter(tags=["user"], prefix="/user")


@router.get("/me", status_code=status.HTTP_200_OK)
async def get_logged_user(auth: AuthenticatedUser, db: DbSession) -> UserDetail:
    """
    Retrieves the profile of the currently logged-in user.

    Args:
        auth (AuthenticatedUser): The authenticated user's token payload containing the user ID ('sub').
        db (DbSession): The database session for executing queries.

    Returns:
        UserDetail: A Pydantic model containing the details of the logged-in user.

    Raises:
        HTTPNotFound: If the user corresponding to the token's ID is not found in the database.
    """
    user = await get_current_user(db, auth["sub"])
    return UserDetail.model_validate(user)


@router.get("/addresses", status_code=status.HTTP_200_OK)
async def get_user_address(
    auth: AuthenticatedUser, db: DbSession
) -> List[AddressDetail]:
    """
    Retrieves the list of addresses associated with the logged-in user.

    Args:
        auth (AuthenticatedUser): The authenticated user's token payload containing the user ID ('sub').
        db (DbSession): The database session for executing queries.

    Returns:
        List[AddressDetail]: A list of Pydantic models representing the user's addresses.

    Raises:
        HTTPNotFound: If the user is not found or if the user has no addresses.
    """
    user = await get_current_user(db, auth["sub"])
    fetched_addresses = await get_addresses(db, str(user.id))

    addresses = list()
    for address in fetched_addresses:
        addresses.append(AddressDetail.model_validate(address))

    return addresses


@router.patch("/update-contact", status_code=status.HTTP_204_NO_CONTENT)
async def update_contact(
    auth: AuthenticatedUser,
    db: DbSession,
    item: Annotated[ContactUpdate, Body()],
):
    """
    Updates the contact information (email and/or phone number) for the logged-in user.

    Args:
        auth (AuthenticatedUser): The authenticated user's token payload containing the user ID ('sub').
        db (DbSession): The database session for executing queries.
        item (ContactUpdate): The payload containing the contact fields to update.

    Raises:
        HTTPNotFound: If the user is not found.
        HTTPInternalServerError: If an error occurs while saving changes to the database.
    """
    fetched_user = await get_current_user(db, auth["sub"])
    for key, value in item.model_dump().items():
        if value:
            setattr(fetched_user, key, value)

    try:
        await db.flush()
    except SQLAlchemyError:
        raise HTTPInternalServerError(f"The data could not be saved in the database")


@router.put("/update-address", status_code=status.HTTP_204_NO_CONTENT)
async def update_address(
    auth: AuthenticatedUser,
    db: DbSession,
    address: Annotated[AddressUpdate, Body()],
):
    """
    Updates the address information for the logged-in user.

    Currently updates the first address found associated with the user.

    Args:
        auth (AuthenticatedUser): The authenticated user's token payload containing the user ID ('sub').
        db (DbSession): The database session for executing queries.
        address (AddressUpdate): The payload containing the new address details.

    Raises:
        HTTPNotFound: If the user or their address is not found.
        HTTPInternalServerError: If a database error occurs during the update.
    """
    fecthed_addresses = await get_addresses(db, auth["sub"])
    fecthed_address = fecthed_addresses[0]

    for key, value in address.model_dump().items():
        if key == "cap" and isinstance(value, str):
            cap = int(value)
            setattr(fecthed_address, key, cap)
            continue
        setattr(fecthed_address, key, value)

    try:
        await db.flush()
    except SQLAlchemyError as ex:
        raise HTTPInternalServerError(f"Errore database: {ex}")


@router.patch("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    auth: AuthenticatedUser,
    db: DbSession,
    hasher: PasswordHasher,
    item: Annotated[PasswordUpdate, Body()],
):
    """
    Changes the password for the logged-in user.

    Verifies the old password before hashing and saving the new one.

    Args:
        auth (AuthenticatedUser): The authenticated user's token payload containing the user ID ('sub').
        db (DbSession): The database session for executing queries.
        hasher (PasswordHasher): The service used to hash and verify passwords.
        item (PasswordUpdate): The payload containing the old password, new password, and confirmation.

    Raises:
        HTTPForbidden: If the user is not found or if the old password provided is incorrect.
        HTTPInternalServerError: If an error occurs while saving the new password.
    """
    fetched_user = await get_current_user(db, auth["sub"])

    if not fetched_user:
        raise HTTPForbidden("Utente non trovato")

    if not hasher.verify(item.old_password, fetched_user.hashed_password):
        raise HTTPForbidden("Password errata, inserisci la password corretta")

    hashed_password = hasher.hash(item.new_password)
    fetched_user.hashed_password = hashed_password

    try:
        await db.flush()
    except SQLAlchemyError:
        raise HTTPInternalServerError(f"There were some problems updating the password")


@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(request: Request ,response: Response, auth: AuthenticatedUser, db: DbSession, internal_call: InternalCallable):
    """
    Deletes the logged-in user's account and all associated data.

    This includes removing the user record, invalidating the session token, and calling internal services
    to clean up related resources (e.g., driver licenses). It also clears authentication cookies.

    Args:
        request (Request): The incoming HTTP request, used for tracing (correlation ID).
        response (Response): The HTTP response object, used to clear cookies.
        auth (AuthenticatedUser): The authenticated user's token payload containing the user ID ('sub').
        db (DbSession): The database session for executing queries.
        internal_call (InternalCallable): A callable for making internal microservice requests.

    Raises:
        HTTPNotFound: If the user is not found.
        HTTPInternalServerError: If a database error occurs or if the internal service call fails.
    """
    fetched_user = await get_current_user(db, auth["sub"])
    user_id: str = str(fetched_user.id)
    fetched_token = await get_user_session_token(db, user_id)

    try:
        internal_response = await internal_call(
            f"http://driver-license-service:8000/v1/driver-license/internal/delete-licenses/{user_id}",
            method="DELETE",
            correlation_id=request.state.correlation_id,
        )

        if internal_response.status_code != 200:
            raise

        if fetched_token:
            await db.delete(fetched_token)
    except Exception as ex:
        raise HTTPInternalServerError(f"Database error: {ex}")

    try:
        await db.delete(fetched_user)
    except SQLAlchemyError:
        raise HTTPInternalServerError(f"There were some problems deleting the user")

    response.set_cookie(
        key="assicurapp_token", value="", max_age=0, httponly=True, secure=True
    )
    response.set_cookie(
        key="assicurapp_session", value="", max_age=0, httponly=True, secure=True
    )
