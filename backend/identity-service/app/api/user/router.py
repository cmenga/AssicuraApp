from fastapi import APIRouter, status, Body
from typing import List, Annotated
from sqlalchemy.exc import SQLAlchemyError

from settings import logger
from database.models import Address
from api.dependency import db_dependency, auth_dependency, jwt_dependency
from api.utils import get_current_user, get_addresses
from api.user.schema import UserDataOut, AddressDataOut, ContactDataIn, AddressDataIn
from api.exceptions import InternalServerException, NotFoundException

user_router = APIRouter(tags=["user"], prefix="/user")


@user_router.get("/me", status_code=status.HTTP_200_OK)
async def get_logged_user(
    auth_token: auth_dependency, db: db_dependency, jwt: jwt_dependency
) -> UserDataOut:
    """
    This Python function retrieves information about the currently logged-in user using the provided
    dependencies and returns the user data after validation.

    Args:
      auth_token (auth_dependency): The `auth_token` parameter is likely a token that is used for
        authentication and authorization purposes. It is passed to the `get_logged_user` function as a
        dependency injection. This token is decoded using the `jwt.decode_access_token` function to extract
        information about the current user.
      db (db_dependency): The `db` parameter in the function `get_logged_user` is likely a dependency
        that provides access to the database. It is used to interact with the database to retrieve
        information about the current user. This parameter is essential for fetching user data from the
        database and returning it in the response.
      jwt (jwt_dependency): The `jwt` parameter in the code snippet likely represents a dependency
        injection for handling JSON Web Tokens (JWT). It is used to decode the access token provided in the
        `auth_token` parameter to extract information about the current user. The `jwt_dependency` is
        probably a custom dependency that provides the functionality

    Returns:
      The function `get_logged_user` is returning an instance of `UserDataOut` after validating the user
        data retrieved from the `get_current_user` function.
    """
    user = get_current_user(db, jwt.decode_access_token(auth_token))
    return UserDataOut.model_validate(user)


@user_router.get("/addresses", status_code=status.HTTP_200_OK)
async def get_user_address(
    auth_token: auth_dependency, db: db_dependency, jwt: jwt_dependency
) -> List[AddressDataOut]:
    """
    This Python async function retrieves a user's addresses using dependencies and returns a list of
    validated AddressDataOut objects.

    Args:
      auth_token (auth_dependency): The `auth_token` parameter is used to authenticate the user making
        the request. It is passed as a dependency to the `get_user_address` function to ensure that the user
        is authorized to access the address information.
      db (db_dependency): The `db` parameter in the `get_user_address` function likely refers to a
        database dependency that is used to interact with the database. This parameter is used to retrieve
        user information and addresses from the database in the function.
      jwt (jwt_dependency): The `jwt` parameter in the `get_user_address` function is a dependency that
        is used for decoding access tokens. It is likely used to verify the authenticity of the access token
        provided in the `auth_token` parameter before proceeding with retrieving the user's address
        information.

    Returns:
      The `get_user_address` function returns a list of `AddressDataOut` objects after fetching and
        processing user addresses from the database.
    """
    user = get_current_user(db, jwt.decode_access_token(auth_token))
    fetched_addresses = get_addresses(db, str(user.id))

    addresses = list()
    for address in fetched_addresses:
        addresses.append(AddressDataOut.model_validate(address))

    return addresses


@user_router.patch("/update-contact", status_code=status.HTTP_204_NO_CONTENT)
async def update_contact(
    auth_token: auth_dependency,
    db: db_dependency,
    jwt: jwt_dependency,
    item: Annotated[ContactDataIn, Body()],
):
    """
    This Python function updates a user's contact information in a database based on the provided data.

    Args:
      auth_token (auth_dependency): The `auth_token` parameter is used to authenticate the user making
        the request. It is decoded to extract the user's information and verify their identity.
      db (db_dependency): The `db` parameter in the function represents a dependency injection for a
        database connection or session. It is used to interact with the database, execute queries, and
        commit or rollback transactions. In this context, it seems to be an instance of a database
        dependency that provides access to database operations within the function
      jwt (jwt_dependency): The `jwt` parameter in the code snippet is a dependency that is used for
        decoding the access token provided in the `auth_token`. The `jwt` dependency is responsible for
        decoding the token to extract the payload, which typically contains information about the
        authenticated user. This decoded payload is then used to identify
      item (Annotated[ContactDataIn, Body()]): The `item` parameter in the `update_email` function
        represents the data that is being sent in the request body to update a contact. It is of type
        `ContactDataIn`, which likely contains the fields that can be updated for a contact. The function
        loops through the key-value pairs in `
    """
    payload = jwt.decode_access_token(auth_token)
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
    auth_token: auth_dependency,
    db: db_dependency,
    jwt: jwt_dependency,
    address: Annotated[AddressDataIn, Body()],
):
    payload = jwt.decode_access_token(auth_token)
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
