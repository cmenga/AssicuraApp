from fastapi.security import OAuth2PasswordBearer
from typing import Protocol, Type, TypeVar, TypedDict
from abc import abstractmethod
from passlib.context import CryptContext

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
    def decode_access_token(self, token: str) -> AccessToken: ...


T = TypeVar("T")


class JwtService(IJwtService):
    ALGORITHM: str = get_algorithm()
    SECRET_KEY: str = get_secret_key()

    def decode_access_token(self, token: str) -> AccessToken:
        return self._decode(token, model=AccessToken)

    def _decode(self, token: str, model: Type[T]):
        from jose import jwt, JWTError, ExpiredSignatureError

        try:
            payload = jwt.decode(token, algorithms=self.ALGORITHM, key=self.SECRET_KEY)
            return model(**payload)
        except ExpiredSignatureError as ex:
            logger.exception(ex)
            raise HTTPUnauthorized("Token expired")
        except JWTError as ex:
            logger.exception(ex)
            raise HTTPUnauthorized("Invalid token")
