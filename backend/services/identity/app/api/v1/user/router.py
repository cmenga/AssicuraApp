from fastapi import APIRouter
from fastapi import status
from fastapi import Response
from fastapi import Request
from fastapi import Body

from typing import List
from typing import Annotated

from sqlalchemy.exc import SQLAlchemyError
from core.http_client import call_internal_service

from core.dependencies import AuthenticatedUser
from core.dependencies import DbSession
from core.dependencies import PasswordHasher

from core.exceptions import HTTPInternalServerError
from core.exceptions import HTTPNotFound
from core.exceptions import HTTPForbidden

from api.v1.user.utils import get_current_user
from api.v1.user.utils import get_addresses
from api.v1.user.utils import get_user_session_token

from api.v1.user.schema import UserDetail
from api.v1.user.schema import AddressDetail
from api.v1.user.schema import ContactUpdate
from api.v1.user.schema import AddressUpdate
from api.v1.user.schema import PasswordUpdate


router = APIRouter(tags=["user"], prefix="/user")


@router.get("/me", status_code=status.HTTP_200_OK)
async def get_logged_user(auth: AuthenticatedUser, db: DbSession) -> UserDetail:
    """
    The function `get_logged_user` retrieves user data for the currently authenticated user and
    validates it using a model.

    Args:
      auth (AuthenticatedUser): The `auth` parameter is an object representing an authenticated user. It
    likely contains information such as the user's ID (`sub`) and possibly other authentication-related
    data.
      db (DbSession): The `db` parameter is likely a database session object that is used to interact
    with the database. It is passed to the function `get_logged_user` to retrieve the current user's
    data from the database.

    Returns:
      The function `get_logged_user` is returning a validated `UserDetail` model for the user retrieved
    from the database based on the provided authentication information.
    """
    user = await get_current_user(db, auth["sub"])
    return UserDetail.model_validate(user)


@router.get("/addresses", status_code=status.HTTP_200_OK)
async def get_user_address(
    auth: AuthenticatedUser, db: DbSession
) -> List[AddressDetail]:
    """
    This Python async function retrieves a user's addresses from a database and returns them as a list
    of validated AddressDetail objects.

    Args:
      auth (AuthenticatedUser): The `auth` parameter is of type `AuthenticatedUser`, which likely
    contains information about the authenticated user making the request, such as their user ID or other
    authentication details.
      db (DbSession): The `db` parameter is typically used to represent a database session or connection
    object. In this context, it seems to be a database session object (`DbSession`) that is used to
    interact with the database to retrieve user addresses.

    Returns:
      The function `get_user_address` returns a list of `AddressDetail` objects after fetching and
    validating addresses for the authenticated user from the database.
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
    The function `update_contact` updates a contact record in the database based on the provided data.

    Args:
      auth (AuthenticatedUser): The `auth` parameter in the `update_contact` function represents the
    authenticated user making the request. It is of type `AuthenticatedUser`, which likely contains
    information about the user's authentication status and possibly their identity or permissions.
      db (DbSession): The `db` parameter in the function `update_contact` is likely a database session
    object. It is used to interact with the database to perform operations such as fetching data,
    updating records, committing transactions, and rolling back changes in case of errors.
      item (Annotated[ContactUpdate, Body()]): The `item` parameter in the `update_contact` function is
    of type `Annotated[ContactUpdate, Body()]`. This means that it is expected to receive data in the
    request body that conforms to the `ContactUpdate` model. The `Body()` annotation indicates that the
    data should
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
    This Python function updates a user's address in a database with error handling for database
    integrity issues.

    Args:
      auth (AuthenticatedUser): The `auth` parameter represents the authenticated user making the
    request. It is of type `AuthenticatedUser`.
      db (DbSession): The `db` parameter in the `update_address` function represents the database
    session that is being passed to the endpoint. It is used to interact with the database to update the
    address information for a specific user. The `DbSession` type likely represents a database session
    object that allows you to perform operations
      address (Annotated[AddressUpdate, Body()]): The `address` parameter in the `update_address`
    function is of type `AddressUpdate`. It is used to update the address information for a user. The
    function retrieves the existing address for the authenticated user, updates the address fields with
    the new values provided in the `address` parameter, and
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
    This function changes the password for a user in a database after verifying the old password.

    Args:
      auth (AuthenticatedUser): The `auth` parameter represents the authenticated user making the
    request. It is of type `AuthenticatedUser`, which likely contains information about the user's
    authentication status and identity.
      db (DbSession): The `db` parameter in the `change_password` function is used to interact with the
    database. It is of type `DbSession`, which likely represents a database session or connection that
    allows you to perform operations like querying, updating, and committing data to the database.
      hasher (PasswordHasher): The `hasher` parameter in the `change_password` function is an instance
    of `PasswordHasher`. It is used to hash and verify passwords securely. In this code snippet, the
    `hasher` is used to verify the old password provided by the user against the hashed password stored
    in the
      item (Annotated[PasswordUpdate, Body()]): The `item` parameter in the `change_password` function
    represents the data needed to change a user's password. It is of type `Annotated[PasswordUpdate,
    Body()]`, which likely means it is a request body parameter containing information required to
    change the password. The `PasswordUpdate
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


# TODO ci deve essere la verifica in caso ci siano delle polize attive
@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(request: Request ,response: Response, auth: AuthenticatedUser, db: DbSession):
    """
    This function deletes a user from the database, revokes their session token, and calls an internal
    service to delete related licenses.

    Args:
      response (Response): The `response` parameter in the `delete_user` function is used to send a
    response back to the client making the request. In this case, it is an instance of `Response` class
    from the FastAPI framework.
      auth (AuthenticatedUser): The `auth` parameter in the `delete_user` function represents the
    authenticated user making the request. It is of type `AuthenticatedUser` and is used to retrieve the
    current user's information from the database based on the subject identifier (`sub`) provided in the
    authentication token.
      db (DbSession): The `db` parameter in the function `delete_user` is likely an instance of a
    database session object. It is used to interact with the database to perform operations such as
    fetching, updating, and deleting records. In this case, it is being used to delete a user and their
    associated session token
    """
    fetched_user = await get_current_user(db, auth["sub"])
    user_id: str = str(fetched_user.id)
    fetched_token = await get_user_session_token(db, user_id)

    try:
        internal_response = await call_internal_service(
            f"http://driver-license-service:8001/v1/driver-license/internal/delete-licenses/{user_id}",
            method="DELETE",
            correlation_id=request.state.correlation_id
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
