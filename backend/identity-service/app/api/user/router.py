from fastapi import APIRouter, status, Body
from typing import List, Annotated
from sqlalchemy.exc import SQLAlchemyError

from settings import logger
from api.dependency import db_dependency, auth_dependency, jwt_dependency
from api.utils import get_current_user, get_addresses
from api.user.schema import UserDataOut, AddressDataOut, ContactDataIn
from api.exceptions import InternalServerException

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


@user_router.patch("/update-contact")
async def update_email(
    auth_token: auth_dependency,
    db: db_dependency,
    jwt: jwt_dependency,
    item: Annotated[ContactDataIn, Body()],
):
    payload = jwt.decode_access_token(auth_token)
    fetched_user = get_current_user(db, payload)
  
    logger.info(
        "update_contact_start",
        user_id=fetched_user.id,
        fields=list(item.model_dump().keys())
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
        logger.exception(ex, user_id=fetched_user.id,)
        raise InternalServerException(detail=f"Errore database: {ex}")
