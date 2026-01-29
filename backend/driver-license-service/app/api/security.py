from fastapi.security import OAuth2PasswordBearer
from typing import Protocol, Type, TypeVar, TypedDict
from abc import abstractmethod
from passlib.context import CryptContext
from jose import jwt, JWTError, ExpiredSignatureError
  
from settings import logger, get_secret_key, get_algorithm
from api.exceptions import HTTPUnauthorized

oauth_scheme = OAuth2PasswordBearer(tokenUrl="http://localhost:8001/auth/sign-in")


class IPasswordHasher(Protocol):
    @abstractmethod
    def hash(self, password: str) -> str: ...
    @abstractmethod
    def verify(self, password: str, hashed: str) -> bool: ...


class Argon2Hasher(IPasswordHasher):
    context = CryptContext(schemes=["argon2"], deprecated="auto")

    def hash(self, password: str):
        return self.context.hash(password)

    def verify(self, password: str, hashed: str) -> bool:
        return self.context.verify(password, hashed)


class AccessToken(TypedDict):
    sub: str
    email: str
    exp: str


class IJwtService(Protocol):
    @abstractmethod
    def decode(self, token: str) -> AccessToken: ...


class AccessTokenBeaer(IJwtService):
    ALGORITHM: str = get_algorithm()
    SECRET_KEY: str = get_secret_key()

    def decode(self, token: str) -> AccessToken:
        try:
            payload = jwt.decode(token, algorithms=self.ALGORITHM, key=self.SECRET_KEY)
            return AccessToken(**payload)
        except ExpiredSignatureError as ex:
            logger.exception(ex)
            raise HTTPUnauthorized("Token expired")
        except JWTError as ex:
            logger.exception(ex)
            raise HTTPUnauthorized("Invalid token")
        return self._decode(token, model=AccessToken)
