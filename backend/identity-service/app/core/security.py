from abc import abstractmethod
from passlib.context import CryptContext

from typing import Protocol
from typing import TypedDict
from typing import Dict

from jose import jwt
from jose import JWTError
from jose import ExpiredSignatureError

from datetime import datetime
from datetime import timezone
from datetime import timedelta

from fastapi import Request
from fastapi import Depends

from core.config import get_secret_key
from core.config import get_algorithm
from core.config import get_service_secret
from core.config import get_service_name
from core.config import get_trusted_services

from core.exceptions import HTTPUnauthorized
from core.exceptions import HTTPForbidden

SECRET_KEY = get_secret_key()
ALGORITHM = get_algorithm()
TRUSTED_SERVICES = get_trusted_services()
SERVICE_NAME = get_service_name()
SERVICE_SECRET = get_service_secret()


# The `IPasswordHasher` class defines abstract methods for hashing and verifying passwords.
class IPasswordHasher(Protocol):
    @abstractmethod
    def hash(self, password: str) -> str: ...
    @abstractmethod
    def verify(self, password: str, hashed: str) -> bool: ...


class Argon2Hasher(IPasswordHasher):
    context = CryptContext(schemes=["argon2"], deprecated="auto")

    def hash(self, password: str):
        """
        The `hash` function takes a password as input and returns the hashed version using the hashing
        algorithm specified in the `context`.

        Args:
          password (str): The `hash` method takes a `password` parameter, which is expected to be a string
        representing the password that needs to be hashed. The method then uses the `hash` function from the
        `context` object to hash the provided password.

        Returns:
          The `hash` method is returning the result of hashing the `password` string using the `hash` method
        of the `context` object.
        """
        return self.context.hash(password)

    def verify(self, password: str, hashed: str) -> bool:
        """
        The function `verify` takes a password and a hashed password as input and returns a boolean
        indicating whether the password matches the hashed password.

        Args:
          password (str): The `password` parameter is a string that represents the user's input password
        that needs to be verified.
          hashed (str): The `hashed` parameter typically refers to a password that has been processed
        through a hashing algorithm to convert it into a fixed-length string of characters. This hashed
        password is stored in a database or used for comparison during authentication processes to enhance
        security.

        Returns:
          The `verify` method is returning the result of calling the `verify` method on `self.context` with
        the `password` and `hashed` parameters.
        """
        return self.context.verify(password, hashed)


def get_password_hasher() -> IPasswordHasher:
    """
    The function `get_password_hasher` returns an instance of the `Argon2Hasher` class.

    Returns:
      An instance of the Argon2Hasher class, which implements the IPasswordHasher interface.
    """
    return Argon2Hasher()


# The `AccessToken` class is a TypedDict with fields for `sub`, `email`, and `exp`.
class AccessToken(TypedDict):
    sub: str
    email: str
    exp: str


# The `IJwtService` class defines a protocol with an abstract method `decode` that takes a token
# string and returns an `AccessToken` object.
class IJwtService(Protocol):
    @abstractmethod
    def encode(
        self, user_id: str, days: int = 0, hours: int = 0, minutes: int = 0
    ) -> str: ...
    @abstractmethod
    def decode(self, token: str) -> AccessToken: ...


class AccessTokenBeaer(IJwtService):
    algorithm: str = ALGORITHM
    secret_key: str = SECRET_KEY

    def encode(self, user_id: str, days: int = 0, hours: int = 0, minutes: int = 0) -> str:
        """
        The `encode` function generates a JWT token with specified user ID and expiration time.
        
        Args:
          user_id (str): The `user_id` parameter is a string that represents the user identifier for whom
        the JWT token is being generated.
          days (int): The `days` parameter in the `encode` method represents the number of days that will be
        added to the current datetime to calculate the expiration time for the JWT token. It is an optional
        parameter with a default value of 0, meaning if no value is provided, the expiration time will be
        based. Defaults to 0
          hours (int): The `hours` parameter in the `encode` method specifies the number of hours to add to
        the current time to calculate the expiration time for the JWT token. It is an optional parameter
        with a default value of 0, meaning if no value is provided, it will not add any hours to the.
        Defaults to 0
          minutes (int): The `minutes` parameter in the `encode` method represents the number of minutes
        that will be added to the current time to calculate the expiration time for the JWT token. This
        parameter allows you to specify a duration in minutes for which the token will be valid before it
        expires. Defaults to 0
        
        Returns:
          The `encode` method returns a JSON Web Token (JWT) string after encoding the provided claims
        (user_id, type, exp) using the secret key and algorithm specified in the class instance.
        """
        expire = datetime.now(timezone.utc) + timedelta(
            days=days, hours=hours, minutes=minutes
        )
        claims = {"sub": user_id, "type": "access", "exp": expire.timestamp()}
        return jwt.encode(claims=claims, key=self.secret_key, algorithm=self.algorithm)

    def decode(self, token: str) -> AccessToken:
        """
        The `decode` function decodes a JWT token using a specified algorithm and secret key, returning an
        `AccessToken` object if successful, and raising exceptions for expired or invalid tokens.

        Args:
          token (str): The `token` parameter is a string that represents an encoded access token that needs
        to be decoded.

        Returns:
          The `decode` method is returning an `AccessToken` object created from the decoded payload of the
        JWT token.
        """
        try:
            payload = jwt.decode(token, algorithms=self.algorithm, key=self.secret_key)
            return AccessToken(**payload)
        except ExpiredSignatureError:
            raise HTTPUnauthorized("Token expired")
        except JWTError:
            raise HTTPUnauthorized("Invalid token")


def get_jwt_access_token() -> IJwtService:
    """
    The function `get_jwt_access_token` returns an instance of `AccessTokenBearer` implementing the
    `IJwtService` interface.

    Returns:
      An instance of the `AccessTokenBeaer` class is being returned.
    """
    return AccessTokenBeaer()


# Refresh token
class RefreshTokenBearer(IJwtService):
    algorithm = "HS256"
    secret_key = get_secret_key()

    def encode(
        self, user_id: str, days: int = 0, hours: int = 0, minutes: int = 0
    ) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            days=days, hours=hours, minutes=minutes
        )
        claims = {"sub": user_id, "type": "refresh", "exp": expire.timestamp()}
        return jwt.encode(claims=claims, key=self.secret_key, algorithm=self.algorithm)

    def decode(self, token: str) -> AccessToken:
        try:
            payload = jwt.decode(token, key=self.secret_key, algorithms=self.algorithm)
            return AccessToken(**payload)
        except ExpiredSignatureError:
            raise HTTPUnauthorized("Token scaduto")
        except JWTError:
            raise HTTPUnauthorized("Token non valido")


def get_jwt_refresh_token() -> IJwtService:
    return RefreshTokenBearer()


def create_service_token():
    """
    The function `create_service_token` generates a JWT token with specified claims for a service.

    Returns:
      The `create_service_token` function returns a JSON Web Token (JWT) that is encoded with the
    specified claims, service secret key, and algorithm.
    """
    expiry: float = (datetime.now(timezone.utc) + timedelta(minutes=2)).timestamp()
    claims: Dict[str, str | int] = {
        "sub": SERVICE_NAME,
        "type": "service",
        "exp": int(expiry),
    }

    return jwt.encode(claims=claims, key=SERVICE_SECRET, algorithm=ALGORITHM)


def get_token(request: Request):
    """
    The function `get_token` extracts a token from the Authorization header in a request, raising an
    HTTPForbidden error if the token is missing or in an incorrect format.

    Args:
      request (Request): The `request` parameter in the `get_token` function is of type `Request`, which
    likely represents an HTTP request object. This function is designed to extract a token from the
    Authorization header of the request. It checks if the Authorization header starts with "Bearer" and
    then extracts the token from the

    Returns:
      The function `get_token` is returning the token extracted from the Authorization header in the
    request.
    """
    auth_request = request.headers.get("Authorization")
    if not auth_request or not auth_request.startswith("Bearer"):
        raise HTTPForbidden("Missing token")

    token = auth_request.split(" ")[1]
    return token


def decode_jwt(token: str = Depends(get_token)):
    """
    The `decode_jwt` function decodes a JWT token, verifies its claims, and returns the payload if the
    token is valid and authorized.

    Args:
      token (str): The `token` parameter is a JSON Web Token (JWT) string that is used for
    authentication and authorization purposes in web applications. The `decode_jwt` function takes this
    token as input and decodes it to extract the payload information.

    Returns:
      The function `decode_jwt` is returning the decoded payload from the JWT token if the token is
    valid and authorized. If the token is expired, it raises an HTTPUnauthorized exception with the
    message "Token expired". If the token is invalid for any other reason, it raises an HTTPUnauthorized
    exception with the message "Invalid token".
    """
    unverified_payload = jwt.get_unverified_claims(token)
    sub = unverified_payload["sub"]
    _type = unverified_payload["type"]
    if sub not in TRUSTED_SERVICES and _type != "service":
        raise HTTPForbidden("Not authorized")
    try:
        payload = jwt.decode(token, key=TRUSTED_SERVICES[sub], algorithms=ALGORITHM)
        return payload
    except ExpiredSignatureError:
        raise HTTPUnauthorized("Token expired")
    except JWTError:
        raise HTTPUnauthorized("Invalid token")
