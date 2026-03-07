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

from app.core.security import decode_jwt

from app.core.dependencies import DbSession
from app.core.dependencies import PasswordHasher
from app.core.dependencies import JWTAccessToken
from app.core.dependencies import JWTRefreshToken
from app.core.dependencies import AuthenticatedUser
from app.core.dependencies import InternalCallable

from app.core.exceptions import HTTPConflict
from app.core.exceptions import HTTPInternalServerError
from app.core.exceptions import HTTPForbidden
from app.core.exceptions import HTTPUnauthorized

from app.api.v1.auth.schema import UserCreate
from app.api.v1.auth.schema import AddressCreate
from app.api.v1.auth.schema import DriverLicenseCreate

from app.api.v1.auth.utils import get_user
from app.api.v1.auth.utils import get_token

from app.models import User
from app.models import Address
from app.models import Token

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
    internal_call: InternalCallable,
):
    """
    Registers a new user account along with their address and driver's license.

    This endpoint performs the following actions:
    1. Checks if a user with the given fiscal ID already exists.
    2. Hashes the user's password.
    3. Creates a new User record and associates the provided Address.
    4. Calls the internal Driver License Service to register the license.
    5. Commits the transaction if all steps succeed.

    Args:
        request (Request): The incoming HTTP request, used for tracing (correlation ID).
        db (DbSession): The database session for executing queries.
        hasher (PasswordHasher): The service used to hash passwords.
        user (UserCreate): The payload containing user registration details.
        address (AddressCreate): The payload containing the user's address.
        license (DriverLicenseCreate): The payload containing driver's license details.
        internal_call (InternalCallable): A callable for making internal microservice requests.

    Raises:
        HTTPConflict: If a user with the provided fiscal ID already exists.
        HTTPInternalServerError: If an error occurs during database operations or the internal service call.
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
    delattr(address, "cap")
    new_address = Address(cap=cap, **address.model_dump())
    new_user.addresses.append(new_address)

    try:
        db.add(new_user)
        await db.flush()
        # Service to service for license
        response = await internal_call(
            f"http://driver-license-service:8000/v1/driver-license/internal/add/{new_user.id}",
            method="POST",
            json=license.model_dump(mode="json"),
            correlation_id=request.state.correlation_id,
        )
        if response.status_code >= 400:
            await db.rollback()
            return response
    except Exception as ex:
        raise HTTPInternalServerError(f"There was a problem saving data: {ex.__str__()}")


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
    Authenticates a user and issues access and refresh tokens.

    Verifies the user's credentials (username/email and password). If valid, it sets
    an HTTP-only secure cookie containing the access token. If 'remember_me' is checked,
    it also issues a long-lived refresh token stored in the database and set as a cookie.

    Args:
        response (Response): The HTTP response object, used to set cookies.
        db (DbSession): The database session for executing queries.
        hasher (PasswordHasher): The service used to verify passwords.
        jwt_access (JWTAccessToken): The service used to generate access tokens.
        jwt_refresh (JWTRefreshToken): The service used to generate refresh tokens.
        form_data (OAuth2PasswordRequestForm): The form data containing username and password.
        remember_me (str, optional): Form field indicating if the session should persist. Defaults to "off".

    Raises:
        HTTPNotFound: If the user does not exist (raised by get_user).
        HTTPUnauthorized: If the password is incorrect (raised by get_user).
        HTTPInternalServerError: If there is an issue saving the refresh token.
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
    Logs out the user by invalidating their session.

    Deletes the refresh token from the database (if present) and clears the
    authentication cookies (access token and session) from the client.

    Args:
        response (Response): The HTTP response object, used to clear cookies.
        db (DbSession): The database session for executing queries.
        assicurapp_session (str, optional): The session token (refresh token ID) from the cookie.

    Returns:
        dict: A confirmation message {"message": "Logout successfully"}.

    Raises:
        HTTPInternalServerError: If an error occurs during the logout process.
    """
    if assicurapp_session:
        fetched_session = await get_token(db, token_id=assicurapp_session)
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
    """
    Verifies the validity of the access token.

    This endpoint is used by the frontend or other services to check if the
    current user is authenticated.

    Args:
        auth (AuthenticatedUser): The authenticated user's token payload.
    """
    return


# internal api call
@router.post(
    "/internal/refresh", status_code=status.HTTP_200_OK, include_in_schema=False
)
async def refresh_access_token(
    request: Request,
    db: DbSession,
    jwt_access: JWTAccessToken,
    _=Depends(decode_jwt),
    access_token: str = Body(embed=True),
):
    """
    Refreshes an access token using a valid refresh token (internal use only).

    This endpoint is intended for internal calls to obtain a new short-lived access token
    when the previous one has expired, provided the user has a valid session in the database.

    Args:
        request (Request): The incoming HTTP request, used for logging.
        db (DbSession): The database session for executing queries.
        jwt_access (JWTAccessToken): The service used to generate new access tokens.
        _ (dict): The decoded JWT payload from the Authorization header (dependency injection).
        access_token (str): The expired access token (used to identify the user).

    Returns:
        dict: A dictionary containing the new access token {"access_token": "..."}.

    Raises:
        HTTPForbidden: If the provided token is missing the 'sub' claim.
        HTTPUnauthorized: If the user's session (refresh token) is invalid or expired.
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
