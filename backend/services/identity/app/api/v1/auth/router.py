from fastapi import APIRouter
from fastapi import status
from fastapi import Body
from fastapi import Response
from fastapi import Depends
from fastapi import Form
from fastapi import Cookie
from fastapi import Request

from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from datetime import datetime
from datetime import timezone
from datetime import timedelta

from core.http_client import call_internal_service
from core.security import decode_jwt

from core.dependencies import DbSession
from core.dependencies import PasswordHasher
from core.dependencies import JWTAccessToken
from core.dependencies import JWTRefreshToken
from core.dependencies import AuthenticatedUser

from core.exceptions import HTTPConflict
from core.exceptions import HTTPInternalServerError
from core.exceptions import HTTPForbidden
from core.exceptions import HTTPUnauthorized

from api.v1.auth.schema import UserCreate
from api.v1.auth.schema import AddressCreate
from api.v1.auth.schema import DriverLicenseCreate

from api.v1.auth.utils import get_user
from api.v1.auth.utils import get_token

from models import User
from models import Address
from models import Token

from sqlalchemy import select
from jose import jwt

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post("/sign-up", status_code=status.HTTP_204_NO_CONTENT)
async def create_new_account(
    request: Request,
    db: DbSession,
    hasher: PasswordHasher,
    user: Annotated[UserCreate, Body()],
    address: Annotated[AddressCreate, Body()],
    license: Annotated[DriverLicenseCreate, Body()],
):
    """
    The `create_new_account` function creates a new user account in a database, including handling
    password hashing, checking for existing users, and interacting with an internal service to add a
    driver's license.

    Args:
      db (DbSession): The `db` parameter is an instance of the `DbSession` class, which is likely a
    database session object used to interact with the database. It is used to query, add, and commit
    data to the database within the `create_new_account` function.
      hasher (PasswordHasher): The `hasher` parameter in the `create_new_account` function is an
    instance of `PasswordHasher` class. This class is used to securely hash passwords before storing
    them in the database. It provides methods for hashing passwords and verifying hashed passwords. In
    the code snippet provided, the `hash
      user (Annotated[UserCreate, Body()]): The `user` parameter in the `create_new_account`
    function represents the user registration data that includes information such as username, email,
    password, and other details required to create a new user account. This data is used to create a new
    `User` object in the database after performing necessary operations like
      address (Annotated[AddressCreate, Body()]): The `address` parameter in the
    `create_new_account` function is of type `AddressCreate` and is annotated with
    `Annotated[AddressCreate, Body()]`. This indicates that the `address` parameter is expected to
    be provided in the request body when calling this function. The `AddressCreate
      license (Annotated[DriverLicenseCreate, Body()]): The `license` parameter in the `create_new_account`
    function is of type `Annotated[DriverLicenseCreate, Body()]`. This indicates that it is expected to
    receive data in the request body that conforms to the `DriverLicenseCreate` model. The `license` data is
    used to create

    Returns:
      The function `create_new_account` is returning the response from the internal service call if the
    status code is less than 400 (indicating success). If the status code is 400 or higher, the response
    is returned as is.
    """
    statement = select(User).filter(User.fiscal_id == user.fiscal_id)
    result = await db.execute(statement)
    existing_user = result.scalar()

    if existing_user:
        raise HTTPConflict("The user entered is already registered")

    hashed = hasher.hash(user.password)
    delattr(user, "password")
    delattr(user, "confirm_password")

    new_user = User(hashed_password=hashed, **user.model_dump())
    cap = int(address.cap)
    delattr(address,"cap")
    new_address = Address(cap=cap,**address.model_dump())
    new_user.addresses.append(new_address)

    try:
        db.add(new_user)
        await db.flush()
        
        # Service to service for license
        response = await call_internal_service(
            f"http://driver-license-service:8001/v1/driver-license/internal/add/{new_user.id}",
            method="POST",
            json=license.model_dump(mode="json"),
            correlation_id=request.state.correlation_id
        )
        if response.status_code >= 400:
            await db.rollback()
            return response
    except Exception:
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
    """
    This Python function handles user sign-in, generates access and refresh tokens, and sets cookies
    accordingly.

    Args:
      response (Response): The `response` parameter in the code snippet represents the HTTP response
    object that will be returned to the client after the sign-in process. In this code, the `response`
    object is used to set cookies with the access token and refresh token for authentication and
    authorization purposes. It also specifies the status code
      db (DbSession): The `db` parameter in the code snippet refers to a database session object. It is
    used to interact with the database, perform queries, and commit transactions within the context of
    the HTTP request being handled by the `get_access_token` endpoint.
      hasher (PasswordHasher): The `hasher` parameter in the code snippet is likely an instance of a
    `PasswordHasher` class or a similar utility that is used for securely hashing passwords. In this
    context, it is used to hash the password provided by the user during the sign-in process before
    comparing it with the hashed
      jwt_access (JWTAccessToken): `jwt_access` is an instance of `JWTAccessToken` used for encoding
    access tokens for user authentication and authorization. In the provided code snippet, it is used to
    generate an access token for the authenticated user based on their user ID and set it as a cookie
    named "assicurapp_token" with
      jwt_refresh (JWTRefreshToken): The `jwt_refresh` parameter in the code snippet is an instance of
    `JWTRefreshToken`. It is used to generate a refresh token for the user during the sign-in process.
    The refresh token is then stored in the database along with its expiration time.
      form_data (OAuth2PasswordRequestForm): The `form_data` parameter in the `get_access_token`
    function is of type `OAuth2PasswordRequestForm`. It is used to extract the username and password
    from the request body when a user is signing in. This data is then used to authenticate the user and
    generate access and refresh tokens for
      remember_me (Annotated[str, Form()]): The `remember_me` parameter in the `get_access_token`
    function is used to determine whether the user wants to stay logged in or not. If the user chooses
    to remember their login, a refresh token with a longer expiration time (7 days) is generated and
    stored in the database. This allows. Defaults to off

    Returns:
      In this code snippet, depending on the value of the `remember_me` variable, different actions are
    taken:
    """
    user = await get_user(db, hasher, form_data.username, form_data.password)

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
    fetched_token = await get_token(db, user_id=str(user.id))

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
    try:
        db.add(new_refresh_token)
        await db.flush()
        await db.refresh(new_refresh_token)
        response.set_cookie(
            key="assicurapp_session",
            value=str(new_refresh_token.id),
            httponly=True,
            secure=True,
            max_age=60 * 60 * 24 * 7,
        )
    except Exception:
        raise HTTPInternalServerError("Save to db failed")


@router.post("/sign-out", status_code=status.HTTP_200_OK)
async def logout(
    response: Response, db: DbSession, assicurapp_session: str = Cookie(None)
):
    """
    The above functions handle user logout and token verification in a Python FastAPI application.

    Args:
      response (Response): The `response` parameter in the `logout` function is used to send a response
    back to the client. In this case, it is an instance of the `Response` class from the FastAPI
    framework. It allows you to set cookies, headers, status codes, and other response-related
    properties that
      db (DbSession): The `db` parameter in the code snippets you provided is likely an instance of a
    database session object. It is used to interact with the database, perform queries, and commit
    transactions. In this case, it seems to be an instance of `DbSession`, which is probably a custom
    class or an
      assicurapp_session (str): The `assicurapp_session` parameter in the `logout` endpoint is used to
    retrieve the session token from the cookie. This token is then used to query the database for the
    corresponding session entry and delete it to log the user out. Additionally, the session and token
    cookies are cleared from the response

    Returns:
      In the first function `/sign-out`, a message "Logout successfully" is being returned as a response
    when the user successfully logs out. In the second function `/protected`, nothing is being
    explicitly returned as the status code is set to `204 No Content`, indicating that there is no
    content to return in the response body.
    """
    if assicurapp_session:
        fetched_session = get_token(db, token_id=assicurapp_session)
        await db.delete(fetched_session)

    try:
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


# internal api call
@router.post("/internal/refresh", status_code=status.HTTP_200_OK, include_in_schema=False)
async def refresh_access_token(
    request: Request,
    db: DbSession,
    jwt_access: JWTAccessToken,
    _=Depends(decode_jwt),
    access_token: str = Body(embed=True),
):
    """
    This Python function handles refreshing access tokens for authenticated users.

    Args:
      request (Request): The `request` parameter in the code snippet represents the incoming request
    made to the `/refresh` endpoint. It allows you to access information about the request, such as
    headers, cookies, and query parameters. You can use it to extract data from the request or to modify
    the response that will be sent
      db (DbSession): The `db` parameter in the code snippet refers to a database session object that is
    used to interact with the database. It is likely an instance of a database session class that allows
    you to query and manipulate data in the database. In this case, it is being used to query the
    database for a
      jwt_access (JWTAccessToken): The `jwt_access` parameter in the code snippet is an instance of a
    class or object that is used to encode and decode JSON Web Tokens (JWTs) for access tokens. It is
    likely a utility or helper class that provides methods for generating and validating JWTs used for
    authentication and authorization purposes in
      _: The underscore (_) in the function signature `_=Depends(decode_jwt)` is used to ignore the
    return value of the `Depends` function. In FastAPI, when using dependencies with `Depends`, you can
    assign the return value of the dependency to a variable. In this case, the
      access_token (str): The `access_token` parameter in the code snippet represents the access token
    that is passed in the request body. This access token is used to authenticate and authorize the user
    making the request. The code decodes the access token to extract the payload and then checks if the
    "sub" key is present in

    Returns:
      The code is returning a new access token in the response body with the key "access_token"
    containing the newly generated access token value.
    """
    payload = jwt.get_unverified_claims(access_token)

    if "sub" not in payload:
        raise HTTPForbidden("Missing user token")
    sub = payload["sub"]

    request.state.logger.info(
        "Internal request", type=payload["type"], service=payload["sub"]
    )
    fetched_token = await get_token(db, user_id=sub)
    if not fetched_token:
        raise HTTPUnauthorized("Not authorized")

    new_access_token = jwt_access.encode(sub, minutes=1)
    return {"access_token": new_access_token}
