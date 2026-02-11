from typing import Protocol, TypedDict, Dict
from abc import abstractmethod
from passlib.context import CryptContext
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timezone, timedelta
from fastapi import Request, Depends


from core.settings import (
    logger,
    get_secret_key,
    get_algorithm,
    get_service_secret,
    get_service_name,
    get_trusted_services,
)
from core.exceptions import HTTPUnauthorized, HTTPForbidden

SECRET_KEY = get_secret_key()
ALGORITHM = get_algorithm()
TRUSTED_SERVICES = get_trusted_services()
SERVICE_NAME = get_service_name()
SERVICE_SECRET = get_service_secret()


class IPasswordHasher(Protocol):
    """
    Define an interface for a password hasher with two abstract methods.
    - hash(self, password: str) -> str: Abstract method to hash a password.
    - verify(self, password: str, hashed: str) -> bool: Abstract method to verify a password against a hashed value.
    """
    @abstractmethod
    def hash(self, password: str) -> str: ...
    @abstractmethod
    def verify(self, password: str, hashed: str) -> bool: ...


class Argon2Hasher(IPasswordHasher):
    """
    A class for hashing and verifying passwords using Argon2 algorithm.
    @param IPasswordHasher - Interface for password hashing
    @method hash - Hashes the given password using the context's hash function.
    @param password - The password to be hashed.
    @return The hashed password.
    @method verify - Verify if a password matches a hashed value using the context.
    @param password - The password to verify.
    @param hashed - The hashed value to compare against.
    @return True if the password matches the hashed value, False otherwise.
    """

    context = CryptContext(schemes=["argon2"], deprecated="auto")

    def hash(self, password: str):
        """
        Hashes the given password using the context's hash function.
        @param password - The password to be hashed.
        @return The hashed password.
        """
        return self.context.hash(password)

    def verify(self, password: str, hashed: str) -> bool:
        """
        Verify if a password matches a hashed value using the context.
        @param password - The password to verify.
        @param hashed - The hashed value to compare against.
        @return True if the password matches the hashed value, False otherwise.
        """
        return self.context.verify(password, hashed)


def get_password_hasher() -> IPasswordHasher:
    """
    Return an instance of the Argon2Hasher class which implements the IPasswordHasher interface.
    @return An instance of the Argon2Hasher class that implements the IPasswordHasher interface.
    """
    return Argon2Hasher()


class AccessToken(TypedDict):
    sub: str
    email: str
    exp: str


class IJwtService(Protocol):
    """
    This class defines an abstract method for decoding a JWT token to obtain an AccessToken.
    @param token - The JWT token to decode.
    @return An AccessToken obtained from decoding the JWT token.
    """

    @abstractmethod
    def decode(self, token: str) -> AccessToken: ...


class AccessTokenBeaer(IJwtService):
    """
    A class that implements the `decode` method to decode a token and return it as an `AccessToken` object.
    Implements the `IJwtService` interface.
    @param token - The token to decode
    @return AccessToken object containing the decoded payload
    """

    algorithm: str = ALGORITHM
    secret_key: str = SECRET_KEY

    def decode(self, token: str) -> AccessToken:
        """
        Decode the given token to extract the payload and return it as an AccessToken object.
        @param token - The token to decode
        @return AccessToken object containing the decoded payload
        """
        try:
            payload = jwt.decode(token, algorithms=self.algorithm, key=self.secret_key)
            return AccessToken(**payload)
        except ExpiredSignatureError as ex:
            logger.exception(ex)
            raise HTTPUnauthorized("Token expired")
        except JWTError as ex:
            logger.exception(ex)
            raise HTTPUnauthorized("Invalid token")


def get_jwt_access_token() -> IJwtService:
    """
    Return a JWT access token using the AccessTokenBearer class that implements the IJwtService interface.
    @return An instance of a class that implements the IJwtService interface.
    """
    return AccessTokenBeaer()



def create_service_token():
    """
    Create a service token with a 2-minute expiry time using JWT encoding.
    @return The service token
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
    Extract the token from the request headers if it is present and in the correct format.
    @param request - The request object containing headers
    @return The extracted token
    """
    auth_request = request.headers.get("Authorization")
    if not auth_request or not auth_request.startswith("Bearer"):
        raise HTTPForbidden("Missing token")

    token = auth_request.split(" ")[1]
    return token


def decode_jwt(token: str = Depends(get_token)):
    """
    Decode a JWT token and verify its authenticity.
    @param token - The JWT token to decode
    @return The payload of the decoded token
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
