from fastapi import APIRouter, Body, status, HTTPException
from typing import Annotated
from sqlalchemy.exc import IntegrityError

from api.dependency import db_dependency, hasher_password_dependency,jwt_dependency
from api.auth_schema import UserRegistration, AddressRegistration, LoginData, TokenData
from api.utils import get_current_user

from database.models import User, Address
from settings import logger


auth_router = APIRouter(tags=["auth"], prefix="/auth")


@auth_router.post("/sign-up", status_code=status.HTTP_204_NO_CONTENT)
async def create_new_account(
    db: db_dependency,
    hasher_password: hasher_password_dependency,
    user: Annotated[UserRegistration, Body()],
    address: Annotated[AddressRegistration, Body()],
):
    """
    The function `create_new_account` handles user sign-up requests, checks for existing users, creates
    new user and address objects in the database, and logs relevant information.

    Args:
        db (db_dependency): The `db` parameter in the `create_new_account` function is a dependency that
            provides access to the database session. It is used to interact with the database, perform queries,
            add new records, commit transactions, and handle errors related to database operations. In this
            case, it is likely an instance
        user (Annotated[UserRegistration, Body()]): The `user` parameter in the `create_new_account`
            function represents the user registration data that is sent in the request body. It is of type
            `UserRegistration`, which likely contains information such as email, fiscal ID, password, and
            confirm password.
        address (Annotated[AddressRegistration, Body()]): The `address` parameter in the
            `create_new_account` function represents the address details provided during user registration. It
            is of type `AddressRegistration` and is expected to contain information such as the type of address
            (e.g., home, work), city, and province.
    """
    logger.info("Sign-up request received", email=user.email, fiscal_id=user.fiscal_id)
    existing_user = db.query(User).filter(User.fiscal_id == user.fiscal_id).first()

    if existing_user:
        logger.warning(
            "Sign-up attempt for already existing user",
            email=user.email,
            fiscal_id=user.fiscal_id,
            user_id=str(existing_user.id),
        )
        raise HTTPException(
            detail="L'utente inserito risulta già iscritto",
            status_code=status.HTTP_409_CONFLICT,
        )

    logger.debug(
        "User not found, proceeding with registration",
        email=user.email,
        fiscal_id=user.fiscal_id,
    )

    hashed_password = hasher_password.get_password_hash(user.password)

    user.__delattr__("password")
    user.__delattr__("confirm_password")

    new_user = User(hashed_password=hashed_password, **user.model_dump())
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
        raise HTTPException(
            detail="C'è stato un problema con il salvataggio dei dati",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@auth_router.post("/sign-in", status_code=status.HTTP_200_OK)
async def get_access_token(db: db_dependency, hasher_password: hasher_password_dependency, auth_jwt: jwt_dependency, payload: LoginData) -> TokenData:
    """
    This function handles user sign-in by generating access and refresh tokens for authentication.
    
    Args:
        db (db_dependency): The `db` parameter is likely a dependency injection for a database connection
            or session object. It allows your FastAPI route to interact with the database to perform operations
            like querying user data or updating records.
        hasher_password (hasher_password_dependency): The `hasher_password` parameter in your FastAPI
            route function seems to be a dependency that likely handles hashing of passwords for user
            authentication. This dependency is probably responsible for securely hashing passwords before they
            are stored in the database or compared during user login processes.
        auth_jwt (jwt_dependency): The `auth_jwt` parameter in the code snippet is likely a dependency
            that provides functionality related to JSON Web Tokens (JWT). In this case, it is used to create
            access tokens and refresh tokens for user authentication and authorization purposes. The
            `create_access_token` and `create_refresh_token` methods are
        payload (LoginData): The `payload` parameter in the code snippet represents the data received from
            the client during a sign-in request. It is of type `LoginData`, which likely contains information
            such as the user's email and password for authentication. This data is used to authenticate the user
            and generate access and refresh tokens for
    
    Returns:
        a dictionary containing the access token, refresh token, and type of token. The access token and
        refresh token are generated using the provided user's ID and email. The type of token is specified
        as "Bearer".
    """
    user = get_current_user(db, hasher_password, payload.email, payload.password)
    access_token = auth_jwt.create_access_token(user.id.__str__(), user.email)
    refresh_token = auth_jwt.create_refresh_token(user.id.__str__())
    
    token = TokenData(access_token=access_token,refresh_token=refresh_token, type="Bearer")
    return token
    
