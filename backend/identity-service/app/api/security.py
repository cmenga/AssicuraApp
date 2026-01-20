from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt

from dataclasses import dataclass
from typing import Protocol, TypeVar, Type
from abc import abstractmethod

from settings import get_secret_key
from api.exceptions import AuthenticationException

oauth_scheme = OAuth2PasswordBearer(tokenUrl="/auth/sign-in")


class IPasswordHasher(Protocol):
    @abstractmethod
    def hash(self, password: str) -> str: ...
    @abstractmethod
    def verify(self, password: str, hashed: str) -> bool: ...


class Argon2Hasher(IPasswordHasher):
    bcrypt_context: CryptContext = CryptContext(schemes=["argon2"], deprecated="auto")

    def hash(self, password: str):
        return self.bcrypt_context.hash(password)

    def verify(self, password: str, hashed: str):
        return self.bcrypt_context.verify(password, hashed)


@dataclass
class AccessToken:
    sub: str
    email: str
    exp: str


@dataclass
class RefreshToken:
    sub: str
    exp: str


T = TypeVar("T")


class IJWTServise(Protocol):
    @abstractmethod
    def create_access_token(self, user_id: str, email: str) -> str: ...
    @abstractmethod
    def create_refresh_token(self, user_id: str) -> str: ...
    @abstractmethod
    def decode_access_token(self, token) -> AccessToken: ...
    @abstractmethod
    def decode_refresh_token(self, token: str) -> RefreshToken: ...


class JWTService(IJWTServise):
    ALGHORITM: str = "HS256"
    SECRET_KEY: str = get_secret_key()

    def create_access_token(self, user_id: str, email: str) -> str:
        return self._create_token({"sub": user_id, "email": email}, hours=6)

    def create_refresh_token(self, user_id: str) -> str:
        return self._create_token({"sub": user_id}, days=30)

    def decode_access_token(self, token) -> AccessToken:
        return self._decode_token(token, AccessToken)

    def decode_refresh_token(self, token: str) -> RefreshToken:
        return self._decode_token(token, RefreshToken)

    def _create_token(self, claims: dict, *, hours: int = 0, days: int = 0):
        from datetime import timedelta, timezone, datetime

        claims["exp"] = datetime.now(timezone.utc) - timedelta(hours=hours, days=days)
        return jwt.encode(claims, key=self.SECRET_KEY, algorithm=self.ALGHORITM)

    def _decode_token(self, token: str, model: Type[T]):
        from jose import ExpiredSignatureError, JWTError

        try:
            payload = jwt.decode(token, key=self.SECRET_KEY, algorithms=self.ALGHORITM)
            obj = model(**payload)
            return obj
        except ExpiredSignatureError:
            raise AuthenticationException("Token scaduto")
        except JWTError:
            raise AuthenticationException("Token non valido")
